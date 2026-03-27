import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay, FadeIn, FadeOut, runOnJS } from 'react-native-reanimated';
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { X, RotateCcw, Trophy, ArrowDown, Star } from 'lucide-react-native';
import { BackButton } from '../../components';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
    createDeck, getOkey, validateGroups, COLORS, getBotAction,
    getTeammateIndex, canLayDown, checkKonkan, canPickLeftDiscard,
    calculateHandPoints, calculateValidGroupPoints, extractGroups, getCardPoints, canAddToGroup,
} from './engine';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useWindowDimensions } from 'react-native';

const SLOTS_PER_ROW = 11;
const TOTAL_SLOTS = SLOTS_PER_ROW * 2;

const NUM_COLORS = { yellow: '#D4A017', blue: '#1A6FC4', black: '#2C2C2C', red: '#C62828', fake: '#2E7D32' };

/* ─── TILE COMPONENT ─── */
function OkeyTile({ tile, index, isSelected, onPress, onDragSwap, onDragDiscard, tileW, tileH }) {
    if (!tile) {
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => onPress && onPress(index)}>
                <View style={[st.emptySlot, { width: tileW, height: tileH, borderRadius: tileW * 0.14 }]} />
            </TouchableOpacity>
        );
    }
    const tx = useSharedValue(0);
    const ty = useSharedValue(0);
    const isDragging = useSharedValue(false);
    const pan = Gesture.Pan()
        .onStart(() => { isDragging.value = true; })
        .onUpdate((e) => { tx.value = e.translationX; ty.value = e.translationY; })
        .onEnd((e) => {
            isDragging.value = false;
            const throwThreshold = index < SLOTS_PER_ROW ? -50 : -100;
            if (e.translationY < throwThreshold) {
                tx.value = withSpring(0); ty.value = withSpring(0);
                if (onDragDiscard) runOnJS(onDragDiscard)(index);
                return;
            }
            const colOff = Math.round(e.translationX / (tileW + 3));
            const rowOff = Math.round(e.translationY / (tileH + 6));
            const target = index + (rowOff * SLOTS_PER_ROW) + colOff;
            tx.value = withSpring(0, { damping: 14, stiffness: 220 });
            ty.value = withSpring(0, { damping: 14, stiffness: 220 });
            if (colOff !== 0 || rowOff !== 0) {
                if (onDragSwap && target >= 0 && target < TOTAL_SLOTS && target !== index) runOnJS(onDragSwap)(index, target);
            } else if (Math.abs(e.translationX) < 10 && Math.abs(e.translationY) < 10) {
                runOnJS(onPress)(index);
            }
        });
    const animStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: isDragging.value ? 1.12 : 1 }],
        zIndex: isDragging.value || isSelected ? 100 : 1, touchAction: 'none',
    }));
    const dotColor = NUM_COLORS[tile.color] || '#999';
    return (
        <GestureDetector gesture={pan}>
            <Animated.View style={[st.tileOuter, { width: tileW, height: tileH, borderRadius: tileW * 0.14 }, isSelected && st.tileSelected, animStyle]}>
                <View style={[st.tileFace, { borderRadius: tileW * 0.12 }]}>
                    <LinearGradient colors={isSelected ? ['#FFF9E6', '#FFF3CC'] : ['#FAF6ED', '#F0EBDC']} style={[StyleSheet.absoluteFillObject, { borderRadius: tileW * 0.12 }]} />
                    {tile.isFake ? (
                        <View style={st.tileInner}><Text style={{ fontSize: tileW * 0.45, color: '#2E7D32', fontWeight: '900' }}>★</Text></View>
                    ) : (
                        <View style={st.tileInner}>
                            <Text style={[st.tileNumber, { color: NUM_COLORS[tile.color], fontSize: tileW * 0.52 }]}>{tile.value}</Text>
                            <View style={st.dotsRow}><View style={[st.tileDot, { backgroundColor: dotColor, width: tileW * 0.1, height: tileW * 0.1, borderRadius: tileW * 0.05 }]} /></View>
                        </View>
                    )}
                </View>
            </Animated.View>
        </GestureDetector>
    );
}

/* ─── MINI TILE ─── */
function MiniTile({ tile, size = 36, faceDown = false }) {
    if (faceDown) return (
        <View style={[st.miniTileFaceDown, { width: size, height: size * 1.45, borderRadius: size * 0.14 }]}>
            <LinearGradient colors={['#1B5E20', '#2E7D32']} style={[StyleSheet.absoluteFillObject, { borderRadius: size * 0.12 }]} />
        </View>
    );
    if (!tile) return null;
    return (
        <View style={[st.miniTileOuter, { width: size, height: size * 1.45, borderRadius: size * 0.14 }]}>
            <LinearGradient colors={['#FAF6ED', '#F0EBDC']} style={[StyleSheet.absoluteFillObject, { borderRadius: size * 0.12 }]} />
            <Text style={[st.miniTileNum, { color: NUM_COLORS[tile.color] || '#333', fontSize: size * 0.48 }]}>{tile.isFake ? '★' : tile.value}</Text>
            <View style={[st.miniTileDot, { backgroundColor: NUM_COLORS[tile.color] || '#999', width: size * 0.12, height: size * 0.12, borderRadius: size * 0.06 }]} />
        </View>
    );
}

/* ─── DRAGGABLE DRAW WRAPPER ─── */
function DraggableDraw({ children, enabled, onDraw }) {
    const tx = useSharedValue(0);
    const ty = useSharedValue(0);
    const dragging = useSharedValue(false);

    const pan = Gesture.Pan()
        .enabled(enabled)
        .onStart(() => { dragging.value = true; })
        .onUpdate((e) => {
            tx.value = e.translationX * 0.3; // subtle horizontal follow
            ty.value = Math.max(0, e.translationY * 0.5); // only pull down
        })
        .onEnd((e) => {
            dragging.value = false;
            const didDrag = e.translationY > 60; // threshold: dragged down enough
            tx.value = withSpring(0, { damping: 16, stiffness: 200 });
            ty.value = withSpring(0, { damping: 16, stiffness: 200 });
            if (didDrag && onDraw) {
                runOnJS(onDraw)(e.absoluteX, e.absoluteY);
            }
        });

    const tap = Gesture.Tap()
        .enabled(enabled)
        .onEnd((e) => {
            if (onDraw) runOnJS(onDraw)(e.absoluteX, e.absoluteY);
        });

    const composed = Gesture.Race(pan, tap);

    const animStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: tx.value },
            { translateY: ty.value },
            { scale: dragging.value ? 1.1 : 1 },
        ],
        opacity: dragging.value ? 0.8 : 1,
    }));

    return (
        <GestureDetector gesture={composed}>
            <Animated.View style={animStyle}>
                {children}
            </Animated.View>
        </GestureDetector>
    );
}

/* ═══════════════ MAIN PLAY SCREEN ═══════════════ */
export default function OkeyPlayScreen({ route, navigation }) {
    const { players: initialPlayers, gameMode = 'standard' } = route.params;
    const { isKurdish } = useLanguage();
    const { colors, isDark } = useTheme();
    const { width, height } = useWindowDimensions();

    const isLandscape = width > height;
    const availableW = isLandscape ? width - 120 : width - 24;
    const maxTileByHeight = isLandscape ? Math.floor((height * 0.38 - 24) / 3.0) : 72;
    const tileByWidth = Math.floor((availableW - 30) / SLOTS_PER_ROW);
    const tileW = Math.min(tileByWidth, maxTileByHeight, 64);
    const tileH = Math.floor(tileW * 1.4);
    const miniSize = Math.max(tileW * 0.55, 24);

    // ── Game State ──
    const [deck, setDeck] = useState([]);
    const [indicator, setIndicator] = useState(null);
    const [okeyTile, setOkeyTile] = useState(null);
    const [isDistributing, setIsDistributing] = useState(true);
    const [players, setPlayers] = useState(
        initialPlayers.map(p => ({ ...p, discard: [], hand: [], handSize: 0, hasLaidDown: false, laidDownGroups: [] }))
    );
    const [rack, setRack] = useState(Array(TOTAL_SLOTS).fill(null));
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [turn, setTurn] = useState(0);
    const [phase, setPhase] = useState('draw');
    // Table groups: all laid-down sets visible on the table
    const [tableGroups, setTableGroups] = useState([]);
    // Track points display
    const [rackPoints, setRackPoints] = useState(0);
    // Flying tile animation state
    const [flyingTile, setFlyingTile] = useState(null); // { tile, fromX, fromY }
    const flyX = useSharedValue(0);
    const flyY = useSharedValue(0);
    const flyScale = useSharedValue(0.5);
    const flyOpacity = useSharedValue(0);
    // Layout refs for animation targets
    const deckRef = useRef(null);
    const leftDiscardRef = useRef(null);
    const rackRef = useRef(null);

    const flyAnimStyle = useAnimatedStyle(() => ({
        position: 'absolute',
        left: flyX.value,
        top: flyY.value,
        transform: [{ scale: flyScale.value }],
        opacity: flyOpacity.value,
        zIndex: 9999,
    }));

    // Calculate rack points — ONLY valid groups of 3+ count
    useEffect(() => {
        if (okeyTile) {
            const { totalPoints } = calculateValidGroupPoints(rack, okeyTile);
            setRackPoints(totalPoints);
        } else {
            setRackPoints(0);
        }
    }, [rack, okeyTile]);

    // ── INIT ──
    useEffect(() => {
        const newDeck = createDeck();
        const ind = newDeck.pop();
        const okey = getOkey(ind);
        setIndicator(ind);
        setOkeyTile(okey);

        const newRack = Array(TOTAL_SLOTS).fill(null);
        const dealToUser = [];
        for (let i = 0; i < 15; i++) dealToUser.push(newDeck.pop());
        dealToUser.sort((a, b) => { if (a.color !== b.color) return a.color.localeCompare(b.color); return a.value - b.value; });
        dealToUser.forEach((t, i) => { newRack[i] = t; });

        const newPlayers = initialPlayers.map(p => ({ ...p, discard: [], hand: [], handSize: 0, hasLaidDown: false, laidDownGroups: [] }));
        newPlayers[0].handSize = 15;
        for (let i = 1; i < 4; i++) {
            const botHand = [];
            for (let j = 0; j < 14; j++) botHand.push(newDeck.pop());
            newPlayers[i].hand = botHand;
            newPlayers[i].handSize = 14;
        }
        setDeck(newDeck);
        setRack(newRack);
        setPlayers(newPlayers);
        setPhase('discard');
        setTimeout(() => setIsDistributing(false), 2000);

        if (Platform.OS !== 'web') ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        return () => { if (Platform.OS !== 'web') ScreenOrientation.unlockAsync(); };
    }, []);

    // ── BOT LOGIC ──
    useEffect(() => {
        if (!isDistributing && turn !== 0) {
            const timeout = setTimeout(() => executeBotTurn(), 3000);
            return () => clearTimeout(timeout);
        }
    }, [turn, phase, isDistributing]);

    const executeBotTurn = () => {
        if (deck.length === 0) return;
        const prevTurn = (turn - 1 + 4) % 4;
        const leftDiscardTile = players[prevTurn].discard.length > 0 ? players[prevTurn].discard[players[prevTurn].discard.length - 1] : null;
        const teammateIdx = getTeammateIndex(turn);
        const teammateHasLaidDown = players[teammateIdx].hasLaidDown;

        const action = getBotAction(players[turn].hand, leftDiscardTile, okeyTile, {
            mode: gameMode, teammateHasLaidDown, playerHasLaidDown: players[turn].hasLaidDown, tableGroups,
        });

        let newPlayers = [...players];
        let newDeck = [...deck];
        let bot = { ...newPlayers[turn] };

        // Left discard restriction: bot can only pick from left if it enables immediate دابەزین
        let canPickLeft = false;
        if (action.wantsDiscard && leftDiscardTile) {
            if (bot.hasLaidDown) {
                canPickLeft = true; // Already laid down, no restriction
            } else {
                // Check if picking enables immediate lay down
                const testHand = [...bot.hand, leftDiscardTile];
                const testSlots = Array(22).fill(null);
                testHand.forEach((t, i) => { if (i < 22) testSlots[i] = t; });
                const result = canLayDown(testSlots, okeyTile, gameMode, teammateHasLaidDown);
                canPickLeft = result.canLayDown;
            }
        }

        if (canPickLeft && leftDiscardTile) {
            const tile = newPlayers[prevTurn].discard.pop();
            bot.hand = [...bot.hand, tile];
        } else {
            bot.hand = [...bot.hand, newDeck.pop()];
        }
        bot.handSize = bot.hand.length;

        // Check for کۆنکان
        if (action.wantsKonkan && action.konkanData) {
            if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert(
                isKurdish ? 'کۆنکان!' : 'Konkan!',
                `${bot.name} ${isKurdish ? 'کۆنکانی کرد!' : 'achieved Konkan!'}`,
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
            return;
        }

        // Check if bot wants to lay down (دابەزین)
        if (!bot.hasLaidDown && action.wantsLayDown && action.layDownData) {
            bot.hasLaidDown = true;
            bot.laidDownGroups = action.layDownData.groups;
            const newTableGroups = [...tableGroups, ...action.layDownData.groups];
            setTableGroups(newTableGroups);
            if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }

        // Discard worst tile
        const finalAction = getBotAction(bot.hand, null, okeyTile, {
            mode: gameMode, teammateHasLaidDown, playerHasLaidDown: bot.hasLaidDown, tableGroups,
        });

        // Check for standard win (all valid groups)
        const possibleHand = [...bot.hand];
        possibleHand.splice(finalAction.discardIndex, 1);
        if (validateGroups(possibleHand.length <= 22 ? (() => { const s = Array(22).fill(null); possibleHand.forEach((t, i) => { s[i] = t; }); return s; })() : possibleHand, okeyTile)) {
            if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert(isKurdish ? 'دۆڕاندت!' : 'Game Over', `${bot.name} ${isKurdish ? 'یارییەکەی بردەوە!' : 'won!'}`,
                [{ text: 'OK', onPress: () => navigation.goBack() }]);
            return;
        }

        const thrownTile = bot.hand.splice(finalAction.discardIndex, 1)[0];
        bot.handSize = bot.hand.length;
        const rDiscard = [...bot.discard, thrownTile];
        if (rDiscard.length > 3) rDiscard.shift();
        bot.discard = rDiscard;

        newPlayers[turn] = bot;
        setDeck(newDeck);
        setPlayers(newPlayers);
        setTurn((turn + 1) % 4);
        setPhase('draw');
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    // ── HUMAN ACTIONS ──
    const handleDragSwap = (from, to) => {
        if (from === to) return;
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setRack(prev => { const n = [...prev]; [n[from], n[to]] = [n[to], n[from]]; return n; });
        setSelectedSlot(null);
    };

    const handleRackPress = (index) => {
        if (selectedSlot === index) { setSelectedSlot(null); return; }
        if (selectedSlot !== null) { handleDragSwap(selectedSlot, index); }
        else if (rack[index] !== null) {
            if (Platform.OS !== 'web') Haptics.selectionAsync();
            setSelectedSlot(index);
        }
    };

    const animateDrawTile = useCallback((tile, startX, startY) => {
        // Show the flying tile at the source position
        setFlyingTile(tile);
        flyX.value = startX;
        flyY.value = startY;
        flyScale.value = 0.6;
        flyOpacity.value = 1;

        // Animate to rack area (center-bottom of screen)
        const targetX = width / 2 - tileW / 2;
        const targetY = height - tileH * 2.5;

        flyX.value = withSpring(targetX, { damping: 14, stiffness: 120 });
        flyY.value = withSpring(targetY, { damping: 14, stiffness: 120 });
        flyScale.value = withSpring(1, { damping: 12, stiffness: 140 });

        // Fade out after landing
        flyOpacity.value = withDelay(350, withTiming(0, { duration: 200 }));
        setTimeout(() => setFlyingTile(null), 600);
    }, [width, height, tileW, tileH]);

    const drawFromCenter = (gestureX, gestureY) => {
        if (turn !== 0 || phase !== 'draw' || deck.length === 0) return;
        const emptyIndex = rack.indexOf(null);
        if (emptyIndex === -1) { Alert.alert(isKurdish ? 'هەڵە' : 'Error', 'No empty slot!'); return; }
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        const drawnTile = deck[deck.length - 1];
        // Animate from gesture end or center of screen
        const startX = typeof gestureX === 'number' ? gestureX : width / 2 - tileW / 2;
        const startY = typeof gestureY === 'number' ? gestureY : height * 0.35;
        animateDrawTile(drawnTile, startX, startY);

        setDeck(prev => prev.slice(0, -1));
        setRack(prev => { const n = [...prev]; n[emptyIndex] = drawnTile; return n; });
        setPhase('discard');
    };

    const drawFromDiscard = (gestureX, gestureY) => {
        if (turn !== 0 || phase !== 'draw') return;
        const leftPlayer = players[3];
        if (!leftPlayer || leftPlayer.discard.length === 0) return;

        const leftTile = leftPlayer.discard[leftPlayer.discard.length - 1];

        // KURDISH RULE: Cannot pick from left unless already laid down OR it enables immediate دابەزین
        if (!players[0].hasLaidDown) {
            const emptyIdx = rack.indexOf(null);
            if (emptyIdx === -1) return;
            const testRack = [...rack];
            testRack[emptyIdx] = leftTile;
            const teammateIdx = getTeammateIndex(0);
            const result = canLayDown(testRack, okeyTile, gameMode, players[teammateIdx].hasLaidDown);
            if (!result.canLayDown) {
                Alert.alert(
                    isKurdish ? 'ناتوانیت!' : 'Not Allowed!',
                    isKurdish ? 'تەنها ئەگەر بتوانیت دابەزیت دەتوانیت لە چەپ وەربگریت!' : 'You can only pick from left if you can lay down immediately!',
                );
                return;
            }
        }

        const emptyIndex = rack.indexOf(null);
        if (emptyIndex === -1) { Alert.alert(isKurdish ? 'هەڵە' : 'Error', 'No empty slot!'); return; }
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        const startX = typeof gestureX === 'number' ? gestureX : 100;
        const startY = typeof gestureY === 'number' ? gestureY : height * 0.6;
        animateDrawTile(leftTile, startX, startY);

        setPlayers(prev => { const n = [...prev]; n[3] = { ...n[3], discard: n[3].discard.slice(0, -1) }; return n; });
        setRack(prev => { const n = [...prev]; n[emptyIndex] = leftTile; return n; });
        setPhase('discard');
    };

    const executeDiscard = (slotIndex) => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const tile = rack[slotIndex];
        setRack(prev => { const n = [...prev]; n[slotIndex] = null; return n; });
        setPlayers(prev => {
            const n = [...prev];
            const d = [...n[0].discard, tile];
            if (d.length > 3) d.shift();
            n[0] = { ...n[0], discard: d };
            return n;
        });
        setSelectedSlot(null);
        setTurn(1);
        setPhase('draw');
    };

    const discardSelected = () => {
        if (turn !== 0 || phase !== 'discard') return;
        if (selectedSlot === null) { Alert.alert(isKurdish ? 'هەڵە' : 'Error', isKurdish ? 'پارچەیەک دیاری بکە' : 'Select a tile to discard!'); return; }
        executeDiscard(selectedSlot);
    };

    const handleDragDiscard = (index) => {
        if (turn !== 0 || phase !== 'discard') { Alert.alert(isKurdish ? 'هەڵە' : 'Wait', isKurdish ? 'ئێستا کاتی فڕێدان نییە!' : "Not time to discard!"); return; }
        executeDiscard(index);
    };

    // ── دابەزین (Lay Down) ──
    const tryLayDown = () => {
        if (turn !== 0 || phase !== 'discard') return;
        if (players[0].hasLaidDown) { Alert.alert(isKurdish ? 'هەڵە' : 'Error', isKurdish ? 'تۆ پێشتر دابەزیوتە!' : 'You already laid down!'); return; }

        const teammateIdx = getTeammateIndex(0);
        const result = canLayDown(rack, okeyTile, gameMode, players[teammateIdx].hasLaidDown);

        if (!result.canLayDown) {
            const msg = result.reason === 'invalid_group'
                ? (isKurdish ? 'ڕیزکردنەکەت دروست نییە! هەموو گرووپەکان دەبێت لانیکەم ٣ پارچە بن.' : 'Invalid groups! All groups must have at least 3 tiles.')
                : (isKurdish ? `خاڵەکانت بەس نییە! ${result.totalPoints}/${result.threshold}` : `Not enough points! ${result.totalPoints}/${result.threshold}`);
            Alert.alert(isKurdish ? 'ناتوانیت دابەزیت' : 'Cannot Lay Down', msg);
            return;
        }

        // Success — mark player as laid down
        if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const newTableGroups = [...tableGroups, ...result.groups];
        setTableGroups(newTableGroups);
        setPlayers(prev => {
            const n = [...prev];
            n[0] = { ...n[0], hasLaidDown: true, laidDownGroups: result.groups };
            return n;
        });

        Alert.alert(
            isKurdish ? 'دابەزین!' : 'Laid Down!',
            isKurdish ? `${result.totalPoints} خاڵ — ئێستا بتوانیت پارچەکانت لە سەر مێزەکە دابنێیت` : `${result.totalPoints} points — you can now add tiles to table sets`,
        );
    };

    // ── کۆنکان Check ──
    const tryKonkan = () => {
        if (turn !== 0 || phase !== 'discard') return;
        const result = checkKonkan(rack, okeyTile);
        if (!result.isKonkan) {
            Alert.alert(isKurdish ? 'کۆنکان نییە' : 'No Konkan', isKurdish ? 'هەموو ڕەنگەکانی یەک ڕەنگ بە ڕیز لەگەڵ ٤ پارچەی جیاواز نییە.' : 'You need all tiles of one color in order + exactly 4 remaining.');
            return;
        }
        if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
            isKurdish ? 'کۆنکان! 🎉' : 'KONKAN! 🎉',
            isKurdish ? `تۆ کۆنکانت کرد بە ڕەنگی ${result.sequenceColor}!` : `You achieved Konkan with ${result.sequenceColor}!`,
            [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
    };

    // ── Standard Win ──
    const tryWin = () => {
        if (turn !== 0 || phase !== 'discard') return;
        if (selectedSlot === null) {
            Alert.alert(isKurdish ? 'هەڵە' : 'Wait', isKurdish ? 'پارچەیەک دیاری بکە بۆ فڕێدان' : 'Select a tile to discard to finish.');
            return;
        }
        const tempRack = [...rack];
        tempRack[selectedSlot] = null;
        if (validateGroups(tempRack, okeyTile)) {
            if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert(isKurdish ? 'پیرۆزە!' : 'You Won!', isKurdish ? 'ئۆکەیی! تۆ بردتەوە!' : 'Okey! All groups valid!',
                [{ text: 'OK', onPress: () => navigation.goBack() }]);
        } else {
            if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert(isKurdish ? 'هەڵە' : 'Invalid', isKurdish ? 'ڕیزکردنەکە دروست نییە!' : "Your groups aren't valid yet!");
            setSelectedSlot(null);
        }
    };

    const autoSort = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const tiles = rack.filter(t => t !== null);
        tiles.sort((a, b) => { if (a.color !== b.color) return a.color.localeCompare(b.color); return a.value - b.value; });
        const newRack = Array(TOTAL_SLOTS).fill(null);
        tiles.forEach((t, i) => { newRack[i] = t; });
        setRack(newRack);
        setSelectedSlot(null);
    };

    const threshold = players[0] ? (players[getTeammateIndex(0)]?.hasLaidDown
        ? (gameMode === 'hard' ? 81 : 61)
        : (gameMode === 'hard' ? 101 : 81)) : 81;

    /* ═══════ RENDER ═══════ */
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={st.container}>
                <LinearGradient colors={['#0a2e12', '#124c1f', '#196b2d', '#124c1f', '#0a2e12']} locations={[0, 0.15, 0.5, 0.85, 1]} start={{ x: 0, y: 0.1 }} end={{ x: 1, y: 0.9 }} style={StyleSheet.absoluteFillObject} />
                <View style={st.feltTexture} />

                {/* Edge Racks */}
                <View style={[st.edgeRack, st.edgeRackTop]}>
                    <LinearGradient colors={['#A0714D', '#5C3F20', '#3E2914']} style={StyleSheet.absoluteFillObject} />
                </View>
                <View style={[st.edgeRack, st.edgeRackLeft]}>
                    <LinearGradient colors={['#A0714D', '#5C3F20', '#3E2914']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFillObject} />
                </View>
                <View style={[st.edgeRack, st.edgeRackRight]}>
                    <LinearGradient colors={['#3E2914', '#5C3F20', '#A0714D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFillObject} />
                </View>

                {/* TOP BAR */}
                <View style={[st.topBar, { marginTop: 35 }]}>
                    <TouchableOpacity style={st.iconBtn} onPress={() => navigation.goBack()}>
                        <X color="#FFF" size={18} />
                    </TouchableOpacity>
                    <View style={st.topBotArea}>
                        <View style={st.botNameRow}>
                            <Text style={[st.botName, isKurdish && st.kf]}>{players[2]?.name}</Text>
                            {players[2]?.hasLaidDown && <View style={st.laidDownBadge}><Text style={st.laidDownBadgeText}>✓</Text></View>}
                            {getTeammateIndex(0) === 2 && <View style={st.teamBadge}><Text style={st.teamBadgeText}>{isKurdish ? 'هاوتیم' : 'Team'}</Text></View>}
                        </View>
                        {players[2]?.discard?.length > 0 && <MiniTile tile={players[2].discard[players[2].discard.length - 1]} size={miniSize * 0.9} />}
                    </View>
                    <View style={{ width: 32 }} />
                </View>

                {/* TABLE AREA */}
                <View style={st.tableArea}>
                    <View style={st.sideBotLeft}>
                        <Text style={[st.botNameSide, isKurdish && st.kf]}>{players[3]?.name}</Text>
                        {players[3]?.hasLaidDown && <View style={st.laidDownBadge}><Text style={st.laidDownBadgeText}>✓</Text></View>}
                    </View>

                    <View style={st.centerArea}>
                        {/* Points Display */}
                        <View style={st.pointsChip}>
                            <Text style={[st.pointsText, isKurdish && st.kf]}>
                                {isKurdish ? `خاڵ: ${rackPoints}/${threshold}` : `Pts: ${rackPoints}/${threshold}`}
                            </Text>
                            {players[0]?.hasLaidDown && <Text style={st.laidDownLabel}>{isKurdish ? '✓ دابەزیو' : '✓ Laid'}</Text>}
                        </View>
                        <View style={st.centerCards}>
                            <DraggableDraw
                                enabled={turn === 0 && phase === 'draw' && deck.length > 0}
                                onDraw={(gx, gy) => drawFromCenter(gx, gy)}
                            >
                                <View ref={deckRef} style={[st.deckCard, { width: tileW * 1.1, height: tileH * 1.1, borderRadius: tileW * 0.16 }, turn === 0 && phase === 'draw' && st.deckGlow]}>
                                    <LinearGradient colors={['#1B5E20', '#2E7D32']} style={[StyleSheet.absoluteFillObject, { borderRadius: tileW * 0.14 }]} />
                                    <Text style={[st.deckCountText, { fontSize: tileW * 0.38 }]}>{deck.length}</Text>
                                </View>
                            </DraggableDraw>
                            {indicator && <View style={{ transform: [{ rotate: '-2deg' }] }}><MiniTile tile={indicator} size={tileW * 0.9} /></View>}
                        </View>
                    </View>

                    <View style={st.sideBotRight}>
                        <Text style={[st.botNameSide, isKurdish && st.kf]}>{players[1]?.name}</Text>
                        {players[1]?.hasLaidDown && <View style={st.laidDownBadge}><Text style={st.laidDownBadgeText}>✓</Text></View>}
                        {players[1]?.discard?.length > 0 && <View style={{ marginTop: 6 }}><MiniTile tile={players[1].discard[players[1].discard.length - 1]} size={miniSize * 0.9} /></View>}
                    </View>
                </View>

                {/* DISCARD ZONES */}
                <View style={st.discardZone}>
                    <DraggableDraw
                        enabled={turn === 0 && phase === 'draw' && players[3]?.discard?.length > 0}
                        onDraw={(gx, gy) => drawFromDiscard(gx, gy)}
                    >
                        <View ref={leftDiscardRef} style={[st.discardTarget, { minHeight: tileH * 0.7, opacity: phase === 'draw' && turn === 0 && players[3]?.discard?.length > 0 ? 1 : 0.6 }, turn === 0 && phase === 'draw' && st.drawTargetActive]}>
                            {players[3]?.discard?.length > 0 ? (
                                <View style={st.discardPileRow}>
                                    {players[3].discard.map((t, idx) => <View key={idx} style={{ marginLeft: idx > 0 ? -8 : 0, transform: [{ rotate: `${(idx - 1) * -3}deg` }] }}><MiniTile tile={t} size={miniSize * 1.1} /></View>)}
                                </View>
                            ) : <Text style={[st.discardZoneLabel, isKurdish && st.kf]}>{isKurdish ? 'بەتاڵە' : 'Empty'}</Text>}
                        </View>
                    </DraggableDraw>

                    <TouchableOpacity style={[st.discardTarget, { minHeight: tileH * 0.7 }, turn === 0 && phase === 'discard' && selectedSlot !== null && st.discardTargetActive]}
                        onPress={discardSelected} activeOpacity={0.7} disabled={turn !== 0 || phase !== 'discard' || selectedSlot === null}>
                        {players[0]?.discard?.length > 0 ? (
                            <View style={st.discardPileRow}>
                                {players[0].discard.map((t, idx) => <View key={idx} style={{ marginLeft: idx > 0 ? -8 : 0, transform: [{ rotate: `${(idx - 1) * 3}deg` }] }}><MiniTile tile={t} size={miniSize * 1.1} /></View>)}
                            </View>
                        ) : <Text style={[st.discardZoneLabel, isKurdish && st.kf]}>{isKurdish ? '▼ فڕێدان ▼' : '▼ Throw ▼'}</Text>}
                    </TouchableOpacity>
                </View>

                {/* ACTION BAR — includes دابەزین & کۆنکان */}
                <View style={st.actionBar}>
                    <TouchableOpacity style={st.sortBtn} onPress={autoSort}>
                        <RotateCcw color="#FFF" size={13} />
                        <Text style={[st.sortBtnText, isKurdish && st.kf]}>{isKurdish ? 'ڕیز' : 'Sort'}</Text>
                    </TouchableOpacity>

                    <View style={st.statusChip}>
                        <View style={[st.statusDot, { backgroundColor: turn === 0 ? '#4ADE80' : '#FBBF24' }]} />
                        <Text style={[st.statusChipText, isKurdish && st.kf]}>
                            {isDistributing ? (isKurdish ? 'دابەشکردن...' : 'Dealing...')
                                : turn !== 0 ? (isKurdish ? 'چاوەڕوانبە...' : 'Wait...')
                                : phase === 'draw' ? (isKurdish ? 'دابگرە' : 'Draw')
                                : (isKurdish ? 'فڕێبدە' : 'Discard')}
                        </Text>
                    </View>

                    {/* دابەزین Button */}
                    {!players[0]?.hasLaidDown && (
                        <TouchableOpacity style={[st.layDownBtn, rackPoints >= threshold && turn === 0 && phase === 'discard' && st.layDownBtnActive]} onPress={tryLayDown}>
                            <ArrowDown color="#FFF" size={13} />
                            <Text style={[st.actionBtnText, isKurdish && st.kf]}>{isKurdish ? 'دابەزین' : 'Lay'}</Text>
                        </TouchableOpacity>
                    )}

                    {/* کۆنکان Button */}
                    <TouchableOpacity style={[st.konkanBtn, turn === 0 && phase === 'discard' && st.konkanBtnActive]} onPress={tryKonkan}>
                        <Star color="#FFF" size={13} />
                        <Text style={[st.actionBtnText, isKurdish && st.kf]}>{isKurdish ? 'کۆنکان' : 'Konkan'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[st.winBtn, turn === 0 && phase === 'discard' && selectedSlot !== null && st.winBtnActive]} onPress={tryWin}>
                        <Trophy color="#FFF" size={13} />
                        <Text style={[st.actionBtnText, isKurdish && st.kf]}>{isKurdish ? 'تەواو' : 'Okey!'}</Text>
                    </TouchableOpacity>
                </View>

                {/* RACK */}
                <View style={st.rackWrapper}>
                    {isDistributing ? (
                        <View style={[st.distributingOverlay, { height: tileH * 2.5 }]}>
                            <Text style={[st.statusChipText, isKurdish && st.kf]}>{isKurdish ? 'ئامادەکردن...' : 'Preparing...'}</Text>
                        </View>
                    ) : (
                        <View style={st.woodRack}>
                            <View style={st.woodBg}>
                                <LinearGradient colors={['#A0714D', '#8B6339', '#7A5530', '#6B4A28', '#5C3F20']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} />
                                <View style={st.woodInsetTop} /><View style={st.woodInsetBottom} />
                            </View>
                            <View style={st.rackRow}>
                                {rack.slice(0, SLOTS_PER_ROW).map((t, i) => (
                                    <OkeyTile key={`s-${i}`} index={i} tile={t} tileW={tileW} tileH={tileH} isSelected={selectedSlot === i} onPress={handleRackPress} onDragSwap={handleDragSwap} onDragDiscard={handleDragDiscard} />
                                ))}
                            </View>
                            <View style={st.rackRow}>
                                {rack.slice(SLOTS_PER_ROW, TOTAL_SLOTS).map((t, i) => {
                                    const abs = i + SLOTS_PER_ROW;
                                    return <OkeyTile key={`s-${abs}`} index={abs} tile={t} tileW={tileW} tileH={tileH} isSelected={selectedSlot === abs} onPress={handleRackPress} onDragSwap={handleDragSwap} onDragDiscard={handleDragDiscard} />;
                                })}
                            </View>
                        </View>
                    )}
                </View>
                {/* Flying tile overlay */}
                {flyingTile && (
                    <Animated.View style={flyAnimStyle} pointerEvents="none">
                        <View style={[st.tileOuter, { width: tileW, height: tileH, borderRadius: tileW * 0.14 }]}>
                            <View style={[st.tileFace, { borderRadius: tileW * 0.12 }]}>
                                <LinearGradient colors={['#FFF9E6', '#FFF3CC']} style={[StyleSheet.absoluteFillObject, { borderRadius: tileW * 0.12 }]} />
                                {flyingTile.isFake ? (
                                    <View style={st.tileInner}><Text style={{ fontSize: tileW * 0.45, color: '#2E7D32', fontWeight: '900' }}>★</Text></View>
                                ) : (
                                    <View style={st.tileInner}>
                                        <Text style={[st.tileNumber, { color: NUM_COLORS[flyingTile.color], fontSize: tileW * 0.52 }]}>{flyingTile.value}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </Animated.View>
                )}
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

/* ═══════ STYLES ═══════ */
const st = StyleSheet.create({
    kf: { fontFamily: 'Rabar' },
    container: { flex: 1, ...Platform.select({ web: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999 }, }) },
    feltTexture: { ...StyleSheet.absoluteFillObject, opacity: 0.05, ...Platform.select({ web: { backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '10px 10px' }, default: {} }) },
    edgeRack: { position: 'absolute', backgroundColor: '#5C3F20', borderColor: '#3E2914', shadowColor: '#000', shadowOpacity: 0.9, shadowRadius: 15, elevation: 20, overflow: 'hidden' },
    edgeRackTop: { top: -10, alignSelf: 'center', width: 250, height: 35, borderRadius: 15, borderWidth: 3, borderBottomColor: '#2E1908', borderTopWidth: 0, zIndex: 1 },
    edgeRackLeft: { left: -10, top: '20%', width: 35, height: 250, borderRadius: 15, borderWidth: 3, borderRightColor: '#2E1908', borderLeftWidth: 0, zIndex: 1 },
    edgeRackRight: { right: -10, top: '20%', width: 35, height: 250, borderRadius: 15, borderWidth: 3, borderLeftColor: '#7A5530', borderRightWidth: 0, zIndex: 1 },
    topBar: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 10, paddingTop: Platform.OS === 'ios' ? 6 : 4, paddingBottom: 2, zIndex: 10 },
    iconBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.35)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', justifyContent: 'center', alignItems: 'center' },
    topBotArea: { alignItems: 'center', gap: 4 },
    botNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    botName: { color: '#FFF', fontSize: 13, fontWeight: '700' },
    tableArea: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 50 },
    sideBotLeft: { alignItems: 'center', gap: 3, width: 55 },
    sideBotRight: { alignItems: 'center', gap: 3, width: 55 },
    botNameSide: { color: '#FFF', fontSize: 12, fontWeight: '700', textAlign: 'center' },
    centerArea: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
    centerCards: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    deckCard: { justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.12)', overflow: 'hidden', transform: [{ rotate: '3deg' }] },
    deckGlow: { borderColor: '#4ADE80', shadowColor: '#4ADE80', shadowOpacity: 0.7, shadowRadius: 14, elevation: 12 },
    deckCountText: { color: '#FFF', fontWeight: '900' },

    // Points chip
    pointsChip: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
    pointsText: { color: '#4ADE80', fontSize: 12, fontWeight: '800' },
    laidDownLabel: { color: '#FBBF24', fontSize: 10, fontWeight: '800' },

    // Laid down / team badges
    laidDownBadge: { backgroundColor: '#10B981', borderRadius: 6, paddingHorizontal: 4, paddingVertical: 1 },
    laidDownBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '900' },
    teamBadge: { backgroundColor: '#3B82F6', borderRadius: 6, paddingHorizontal: 5, paddingVertical: 1 },
    teamBadgeText: { color: '#FFF', fontSize: 8, fontWeight: '800' },

    // Discard
    discardZone: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 2, width: '100%', maxWidth: 700, alignSelf: 'center' },
    discardTarget: { paddingHorizontal: 16, paddingVertical: 4, borderRadius: 10, borderWidth: 1.5, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'rgba(0,0,0,0.08)', justifyContent: 'center', alignItems: 'center', minWidth: 100 },
    discardTargetActive: { borderColor: '#EF4444', backgroundColor: 'rgba(239,68,68,0.2)', borderStyle: 'solid', shadowColor: '#EF4444', shadowOpacity: 0.5, shadowRadius: 10, elevation: 6 },
    drawTargetActive: { borderColor: '#4ADE80', backgroundColor: 'rgba(74,222,128,0.2)', borderStyle: 'solid', shadowColor: '#4ADE80', shadowOpacity: 0.5, shadowRadius: 10, elevation: 6 },
    discardPileRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    discardZoneLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: '700', letterSpacing: 1 },

    // Action bar
    actionBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 3, paddingHorizontal: 8 },
    sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(0,0,0,0.35)', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    sortBtnText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
    statusChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
    statusDot: { width: 6, height: 6, borderRadius: 3 },
    statusChipText: { color: '#FFF', fontSize: 11, fontWeight: '600' },
    layDownBtn: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(0,0,0,0.35)', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    layDownBtnActive: { backgroundColor: '#047857', borderColor: '#10B981', shadowColor: '#10B981', shadowOpacity: 0.5, shadowRadius: 8, elevation: 6 },
    konkanBtn: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(0,0,0,0.35)', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    konkanBtnActive: { backgroundColor: '#7C3AED', borderColor: '#A78BFA', shadowColor: '#A78BFA', shadowOpacity: 0.5, shadowRadius: 8, elevation: 6 },
    winBtn: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(0,0,0,0.35)', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    winBtnActive: { backgroundColor: '#B45309', borderColor: '#F59E0B', shadowColor: '#F59E0B', shadowOpacity: 0.5, shadowRadius: 8, elevation: 6 },
    actionBtnText: { color: '#FFF', fontSize: 11, fontWeight: '700' },

    // Rack
    rackWrapper: { paddingHorizontal: 6, paddingBottom: Platform.OS === 'ios' ? 16 : 6 },
    distributingOverlay: { backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
    woodRack: { alignSelf: 'center', paddingHorizontal: 8, paddingVertical: 7, borderRadius: 14, gap: 4 },
    woodBg: { ...StyleSheet.absoluteFillObject, borderRadius: 14, overflow: 'hidden', borderWidth: 3, borderTopColor: '#B8885A', borderLeftColor: '#9A7248', borderRightColor: '#5C3F20', borderBottomColor: '#3E2914', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 16, elevation: 20 },
    woodInsetTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: 'rgba(255,255,255,0.12)', borderTopLeftRadius: 14, borderTopRightRadius: 14 },
    woodInsetBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, backgroundColor: 'rgba(0,0,0,0.2)', borderBottomLeftRadius: 14, borderBottomRightRadius: 14 },
    rackRow: { flexDirection: 'row', justifyContent: 'center', gap: 3, zIndex: 1 },

    // Tiles
    emptySlot: { backgroundColor: 'rgba(0,0,0,0.15)', borderWidth: 1, borderColor: 'rgba(0,0,0,0.2)' },
    tileOuter: { position: 'relative', borderWidth: 1.5, borderTopColor: '#E8E0D0', borderLeftColor: '#DDD6C6', borderRightColor: '#C4BCA8', borderBottomColor: '#A89E8C', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.35, shadowRadius: 4, elevation: 6 },
    tileSelected: { transform: [{ translateY: -10 }, { scale: 1.08 }], shadowColor: '#F59E0B', shadowOpacity: 0.7, shadowRadius: 10, borderColor: '#FCD34D', borderWidth: 2, zIndex: 100 },
    tileFace: { flex: 1, overflow: 'hidden' },
    tileInner: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 1 },
    tileNumber: { fontWeight: '900', textShadowColor: 'rgba(0,0,0,0.06)', textShadowOffset: { width: 0.5, height: 0.5 }, textShadowRadius: 0 },
    dotsRow: { flexDirection: 'row', gap: 3, marginTop: -2 },
    tileDot: {},
    miniTileFaceDown: { borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)', overflow: 'hidden' },
    miniTileOuter: { borderWidth: 1, borderTopColor: '#E8E0D0', borderLeftColor: '#DDD6C6', borderRightColor: '#C4BCA8', borderBottomColor: '#A89E8C', overflow: 'hidden', alignItems: 'center', justifyContent: 'center', gap: 1, padding: 2 },
    miniTileNum: { fontWeight: '900' },
    miniTileDot: {},
});
