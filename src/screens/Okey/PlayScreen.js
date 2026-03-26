import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { LinearTransition, FadeIn, FadeOut, withTiming, useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { X, RotateCcw, Trophy } from 'lucide-react-native';

import { BackButton } from '../../components';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { createDeck, getOkey, validateGroups, COLORS, getBotAction } from './engine';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useWindowDimensions } from 'react-native';

const SLOTS_PER_ROW = 11;
const ROWS = 2;
const TOTAL_SLOTS = SLOTS_PER_ROW * ROWS;

/* ─────────────────── TILE COMPONENT ─────────────────── */
function OkeyTile({ tile, index, isSelected, onPress, onDragSwap, onDragDiscard, tileW, tileH }) {
    if (!tile) {
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => onPress && onPress(index)}>
                <View style={[st.emptySlot, { width: tileW, height: tileH, borderRadius: tileW * 0.14 }]} />
            </TouchableOpacity>
        );
    }

    const numColors = {
        yellow: '#D4A017',
        blue: '#1A6FC4',
        black: '#2C2C2C',
        red: '#C62828',
        fake: '#2E7D32',
    };

    const tx = useSharedValue(0);
    const ty = useSharedValue(0);
    const isDragging = useSharedValue(false);

    const pan = Gesture.Pan()
        .onStart(() => {
            isDragging.value = true;
        })
        .onUpdate((e) => {
            tx.value = e.translationX;
            ty.value = e.translationY;
        })
        .onEnd((e) => {
            isDragging.value = false;

            const isTopRow = index < SLOTS_PER_ROW;
            const throwThreshold = isTopRow ? -50 : -100;

            if (e.translationY < throwThreshold) {
                tx.value = withSpring(0);
                ty.value = withSpring(0);
                if (onDragDiscard) {
                    runOnJS(onDragDiscard)(index);
                }
                return;
            }

            const colOffset = Math.round(e.translationX / (tileW + 3));
            const rowOffset = Math.round(e.translationY / (tileH + 6));

            const targetIndex = index + (rowOffset * SLOTS_PER_ROW) + colOffset;

            tx.value = withSpring(0, { damping: 14, stiffness: 220 });
            ty.value = withSpring(0, { damping: 14, stiffness: 220 });

            if (colOffset !== 0 || rowOffset !== 0) {
                if (onDragSwap && targetIndex >= 0 && targetIndex < TOTAL_SLOTS && targetIndex !== index) {
                    runOnJS(onDragSwap)(index, targetIndex);
                }
            } else if (Math.abs(e.translationX) < 10 && Math.abs(e.translationY) < 10) {
                runOnJS(onPress)(index);
            }
        });

    const animStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: tx.value },
                { translateY: ty.value },
                { scale: isDragging.value ? 1.12 : 1 },
            ],
            zIndex: isDragging.value || isSelected ? 100 : 1,
            touchAction: 'none',
        };
    });

    const dotColor = numColors[tile.color] || '#999';

    return (
        <GestureDetector gesture={pan}>
            <Animated.View
                style={[
                    st.tileOuter,
                    {
                        width: tileW,
                        height: tileH,
                        borderRadius: tileW * 0.14,
                    },
                    isSelected && st.tileSelected,
                    animStyle,
                ]}
            >
                {/* Tile body — cream with subtle border */}
                <View style={[st.tileFace, { borderRadius: tileW * 0.12 }]}>  
                    <LinearGradient
                        colors={isSelected ? ['#FFF9E6', '#FFF3CC'] : ['#FAF6ED', '#F0EBDC']}
                        style={[StyleSheet.absoluteFillObject, { borderRadius: tileW * 0.12 }]}
                    />
                    {tile.isFake ? (
                        <View style={st.tileInner}>
                            <Text style={{ fontSize: tileW * 0.45, color: '#2E7D32', fontWeight: '900' }}>★</Text>
                        </View>
                    ) : (
                        <View style={st.tileInner}>
                            <Text
                                style={[
                                    st.tileNumber,
                                    {
                                        color: numColors[tile.color],
                                        fontSize: tileW * 0.52,
                                    },
                                ]}
                            >
                                {tile.value}
                            </Text>
                            {/* Two dots like real Okey tiles */}
                            <View style={st.dotsRow}>
                                <View style={[st.tileDot, { backgroundColor: dotColor, width: tileW * 0.1, height: tileW * 0.1, borderRadius: tileW * 0.05 }]} />
                            </View>
                        </View>
                    )}
                </View>
            </Animated.View>
        </GestureDetector>
    );
}

/* ─────────── MINI TILE (for bots / indicator) ─────────── */
function MiniTile({ tile, size = 36, faceDown = false }) {
    const numColors = {
        yellow: '#D4A017',
        blue: '#1A6FC4',
        black: '#2C2C2C',
        red: '#C62828',
    };

    if (faceDown) {
        return (
            <View style={[st.miniTileFaceDown, { width: size, height: size * 1.45, borderRadius: size * 0.14 }]}>
                <LinearGradient
                    colors={['#1B5E20', '#2E7D32']}
                    style={[StyleSheet.absoluteFillObject, { borderRadius: size * 0.12 }]}
                />
            </View>
        );
    }

    if (!tile) return null;

    return (
        <View style={[st.miniTileOuter, { width: size, height: size * 1.45, borderRadius: size * 0.14 }]}>
            <LinearGradient
                colors={['#FAF6ED', '#F0EBDC']}
                style={[StyleSheet.absoluteFillObject, { borderRadius: size * 0.12 }]}
            />
            <Text style={[st.miniTileNum, { color: numColors[tile.color] || '#333', fontSize: size * 0.48 }]}>
                {tile.isFake ? '★' : tile.value}
            </Text>
            <View
                style={[
                    st.miniTileDot,
                    {
                        backgroundColor: numColors[tile.color] || '#999',
                        width: size * 0.12,
                        height: size * 0.12,
                        borderRadius: size * 0.06,
                    },
                ]}
            />
        </View>
    );
}



/* ═══════════════════════════════════════════════════════
   MAIN PLAY SCREEN
   ═══════════════════════════════════════════════════════ */
export default function OkeyPlayScreen({ route, navigation }) {
    const { players: initialPlayers } = route.params;
    const { isKurdish } = useLanguage();
    const { colors, isDark } = useTheme();

    const { width, height } = useWindowDimensions();

    /* ── Tile sizing: constrained by BOTH width and height for mobile landscape ── */
    const isLandscape = width > height;
    const availableW = isLandscape ? width - 120 : width - 24;
    // Height constraint: rack takes ~45% of screen, 2 rows + gaps + padding
    const maxTileByHeight = isLandscape ? Math.floor((height * 0.38 - 24) / 3.0) : 72;
    const tileByWidth = Math.floor((availableW - 30) / SLOTS_PER_ROW);
    const tileW = Math.min(tileByWidth, maxTileByHeight, 64);
    const tileH = Math.floor(tileW * 1.4);
    const miniSize = Math.max(tileW * 0.55, 24);

    // Game State
    const [deck, setDeck] = useState([]);
    const [indicator, setIndicator] = useState(null);
    const [okeyTile, setOkeyTile] = useState(null);
    const [isDistributing, setIsDistributing] = useState(true);

    const [players, setPlayers] = useState(
        initialPlayers.map(p => ({ ...p, discard: [], hand: [], handSize: 0 }))
    );

    const [rack, setRack] = useState(Array(TOTAL_SLOTS).fill(null));
    const [selectedSlot, setSelectedSlot] = useState(null);

    const [turn, setTurn] = useState(0);
    const [phase, setPhase] = useState('draw');

    useEffect(() => {
        const newDeck = createDeck();
        const ind = newDeck.pop();
        setIndicator(ind);
        setOkeyTile(getOkey(ind));

        const newRack = Array(TOTAL_SLOTS).fill(null);
        let currentSlot = 0;

        const dealToUser = [];
        for (let i = 0; i < 15; i++) {
            dealToUser.push(newDeck.pop());
        }

        dealToUser.sort((a, b) => {
            if (a.color !== b.color) return a.color.localeCompare(b.color);
            return a.value - b.value;
        });

        for (let t of dealToUser) {
            newRack[currentSlot++] = t;
        }

        const newPlayers = [...players];
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

        if (Platform.OS !== 'web') {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        }

        return () => {
            if (Platform.OS !== 'web') {
                ScreenOrientation.unlockAsync();
            }
        };
    }, []);

    // BOT LOGIC
    useEffect(() => {
        if (!isDistributing && turn !== 0) {
            let timeout = setTimeout(() => {
                executeBotTurn();
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [turn, phase, isDistributing]);

    const executeBotTurn = () => {
        if (deck.length === 0) return;

        let prevPlayerTurn = (turn - 1 + 4) % 4;
        let prevDiscardPile = players[prevPlayerTurn].discard;
        let leftDiscardTile = prevDiscardPile.length > 0 ? prevDiscardPile[prevDiscardPile.length - 1] : null;

        const action = getBotAction(players[turn].hand, leftDiscardTile, okeyTile);
        let newPlayers = [...players];
        let newDeck = [...deck];
        let bot = newPlayers[turn];

        if (action.wantsDiscard) {
            let tile = newPlayers[prevPlayerTurn].discard.pop();
            bot.hand.push(tile);
        } else {
            bot.hand.push(newDeck.pop());
        }

        bot.handSize = 15;
        let finalAction = getBotAction(bot.hand, null, okeyTile);

        const possibleHand = [...bot.hand];
        possibleHand.splice(finalAction.discardIndex, 1);
        if (validateGroups(possibleHand, okeyTile)) {
            if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert(
                isKurdish ? 'دۆڕاندت!' : 'Game Over',
                `${bot.name} ${isKurdish ? 'یارییەکەی بردەوە!' : 'has won the game!'}`,
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
            return;
        }

        let thrownTile = bot.hand.splice(finalAction.discardIndex, 1)[0];
        bot.handSize = 14;

        const rDiscard = [...bot.discard, thrownTile];
        if (rDiscard.length > 3) rDiscard.shift();
        bot.discard = rDiscard;

        setDeck(newDeck);
        setPlayers(newPlayers);
        setTurn((turn + 1) % 4);
        setPhase('draw');
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    // HUMAN LOGIC
    const handleDragSwap = (fromIndex, toIndex) => {
        if (fromIndex === toIndex) return;
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        setRack(prev => {
            const next = [...prev];
            const temp = next[fromIndex];
            next[fromIndex] = next[toIndex];
            next[toIndex] = temp;
            return next;
        });
        setSelectedSlot(null);
    };

    const handleRackPress = (index) => {
        if (selectedSlot === index) {
            setSelectedSlot(null);
            return;
        }

        if (selectedSlot !== null) {
            handleDragSwap(selectedSlot, index);
        } else {
            if (rack[index] !== null) {
                if (Platform.OS !== 'web') Haptics.selectionAsync();
                setSelectedSlot(index);
            }
        }
    };

    const drawFromCenter = () => {
        if (turn !== 0 || phase !== 'draw' || deck.length === 0) return;

        const emptyIndex = rack.indexOf(null);
        if (emptyIndex === -1) {
            Alert.alert(isKurdish ? 'هەڵە' : 'Error', 'No empty slot to draw into!');
            return;
        }

        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        const drawnTile = deck[deck.length - 1];
        setDeck(prev => prev.slice(0, prev.length - 1));

        setRack(prev => {
            const next = [...prev];
            next[emptyIndex] = drawnTile;
            return next;
        });

        setPhase('discard');
    };

    const drawFromDiscard = () => {
        if (turn !== 0 || phase !== 'draw') return;
        const leftPlayer = players[3];
        if (!leftPlayer || leftPlayer.discard.length === 0) return;

        const emptyIndex = rack.indexOf(null);
        if (emptyIndex === -1) {
            Alert.alert(isKurdish ? 'هەڵە' : 'Error', 'No empty slot to draw into!');
            return;
        }

        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        const drawnTile = leftPlayer.discard[leftPlayer.discard.length - 1];
        setPlayers(prev => {
            const next = [...prev];
            next[3].discard = next[3].discard.slice(0, -1);
            return next;
        });

        setRack(prev => {
            const next = [...prev];
            next[emptyIndex] = drawnTile;
            return next;
        });

        setPhase('discard');
    };

    const discardSelected = () => {
        if (turn !== 0 || phase !== 'discard') return;
        if (selectedSlot === null) {
            Alert.alert(isKurdish ? 'هەڵە' : 'Error', isKurdish ? 'پارچەیەک دیاری بکە بۆ فڕێدان' : 'Select a tile to discard!');
            return;
        }

        executeDiscard(selectedSlot);
    };

    const handleDragDiscard = (index) => {
        if (turn !== 0 || phase !== 'discard') {
            Alert.alert(isKurdish ? 'هەڵە' : 'Wait', isKurdish ? 'ئێستا کاتی فڕێدان نییە!' : "It's not time to discard yet!");
            return;
        }
        executeDiscard(index);
    };

    const executeDiscard = (slotIndex) => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        const tileToDiscard = rack[slotIndex];

        setRack(prev => {
            const next = [...prev];
            next[slotIndex] = null;
            return next;
        });

        setPlayers(prev => {
            const next = [...prev];
            const rDiscard = [...next[0].discard, tileToDiscard];
            if (rDiscard.length > 3) rDiscard.shift();
            next[0].discard = rDiscard;
            return next;
        });

        setSelectedSlot(null);
        setTurn(1);
        setPhase('draw');
    };

    const tryWin = () => {
        if (turn !== 0 || phase !== 'discard') return;
        if (selectedSlot === null) {
            Alert.alert(
                isKurdish ? 'هەڵە' : 'Wait',
                isKurdish ? 'تکایە ئەو پارچەیە دیاری بکە کە دەتەوێت بۆ تەواوکردنی یارییەکە فڕێی بدەیت.' : 'Select the tile to discard to finish the game.'
            );
            return;
        }

        const tempRack = [...rack];
        tempRack[selectedSlot] = null;

        if (validateGroups(tempRack, okeyTile)) {
            if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert(
                isKurdish ? 'پیرۆزە!' : 'Congratulations!',
                isKurdish ? 'ئۆکەیی! تۆ بردتەوە!' : 'You won the game in valid sets!',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } else {
            if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert(
                isKurdish ? 'هەڵە' : 'Invalid Hand',
                isKurdish ? 'ڕیزکردنەکە دروست نییە! ناتوانیت یارییەکە تەواو بکەیت.' : "Your runs/sets are not valid. You can't win yet!"
            );
            setSelectedSlot(null);
        }
    };

    const autoSort = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const tiles = rack.filter(t => t !== null);

        tiles.sort((a, b) => {
            if (a.color !== b.color) return a.color.localeCompare(b.color);
            return a.value - b.value;
        });

        const newRack = Array(TOTAL_SLOTS).fill(null);
        tiles.forEach((t, i) => { newRack[i] = t; });
        setRack(newRack);
        setSelectedSlot(null);
    };


    /* ─────────────────── RENDER ─────────────────── */
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={st.container}>
                {/* === REALISTIC GREEN FELT TABLE === */}
                <LinearGradient
                    colors={['#0a2e12', '#124c1f', '#196b2d', '#124c1f', '#0a2e12']}
                    locations={[0, 0.15, 0.5, 0.85, 1]}
                    start={{ x: 0, y: 0.1 }} end={{ x: 1, y: 0.9 }}
                    style={StyleSheet.absoluteFillObject}
                />
                
                {/* Subtle felt texture */}
                <View style={st.feltTexture} />

                {/* === EDGE RACKS (BOTS) === */}
                <View style={[st.edgeRack, st.edgeRackTop]}>
                    <LinearGradient colors={['#A0714D', '#5C3F20', '#3E2914']} style={StyleSheet.absoluteFillObject} />
                    <View style={[st.woodInsetBottom, { opacity: 0.5 }]} />
                </View>
                <View style={[st.edgeRack, st.edgeRackLeft]}>
                    <LinearGradient colors={['#A0714D', '#5C3F20', '#3E2914']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFillObject} />
                    <View style={[st.woodInsetBottom, { opacity: 0.5, right: 0, left: 'auto', width: 2, height: '100%' }]} />
                </View>
                <View style={[st.edgeRack, st.edgeRackRight]}>
                    <LinearGradient colors={['#3E2914', '#5C3F20', '#A0714D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFillObject} />
                    <View style={[st.woodInsetBottom, { opacity: 0.5, left: 0, width: 2, height: '100%' }]} />
                </View>

                {/* ══════════ TOP BAR (minimal) ══════════ */}
                <View style={[st.topBar, { marginTop: 35 }]}>
                    <TouchableOpacity style={st.iconBtn} onPress={() => navigation.goBack()}>
                        <X color="#FFF" size={18} />
                    </TouchableOpacity>

                    {/* Top Bot (Player 2) */}
                    <View style={st.topBotArea}>
                        <View style={st.botNameRow}>
                            <Text style={[st.botName, isKurdish && st.kf]}>{players[2]?.name}</Text>
                        </View>
                        {players[2]?.discard?.length > 0 && (
                            <MiniTile
                                tile={players[2].discard[players[2].discard.length - 1]}
                                size={miniSize * 0.9}
                            />
                        )}
                    </View>

                    {/* Empty spacer to balance layout */}
                    <View style={{ width: 32 }} />
                </View>

                {/* ══════════ MAIN TABLE AREA ══════════ */}
                <View style={st.tableArea}>
                    {/* Left Bot (Player 3) */}
                    <View style={st.sideBotLeft}>
                        <Text style={[st.botNameSide, isKurdish && st.kf]}>{players[3]?.name}</Text>
                    </View>

                    {/* Center Table */}
                    <View style={st.centerArea}>
                        {/* Indicator + Deck */}
                        <View style={st.centerCards}>
                            <TouchableOpacity
                                onPress={drawFromCenter}
                                disabled={turn !== 0 || phase !== 'draw'}
                                activeOpacity={0.7}
                            >
                                <View style={[
                                    st.deckCard,
                                    { width: tileW * 1.1, height: tileH * 1.1, borderRadius: tileW * 0.16 },
                                    turn === 0 && phase === 'draw' && st.deckGlow,
                                ]}>
                                    <LinearGradient
                                        colors={['#1B5E20', '#2E7D32']}
                                        style={[StyleSheet.absoluteFillObject, { borderRadius: tileW * 0.14 }]}
                                    />
                                    <Text style={[st.deckCountText, { fontSize: tileW * 0.38 }]}>{deck.length}</Text>
                                </View>
                            </TouchableOpacity>

                            {/* Indicator tile */}
                            {indicator && (
                                <View style={{ transform: [{ rotate: '-2deg' }] }}>
                                    <MiniTile tile={indicator} size={tileW * 0.9} />
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Right Bot (Player 1) */}
                    <View style={st.sideBotRight}>
                        <Text style={[st.botNameSide, isKurdish && st.kf]}>{players[1]?.name}</Text>
                        <View style={{ marginTop: 6 }}>
                            {players[1]?.discard?.length > 0 && (
                                <MiniTile
                                    tile={players[1].discard[players[1].discard.length - 1]}
                                    size={miniSize * 0.9}
                                />
                            )}
                        </View>
                    </View>
                </View>

                {/* ══════════ DISCARD ZONES (Left to draw, Right to throw) ══════════ */}
                <View style={st.discardZone}>
                    {/* LEFT: P3's Discard Pile (Where we can draw from) */}
                    <TouchableOpacity
                        style={[
                            st.discardTarget,
                            { minHeight: tileH * 0.7, opacity: phase === 'draw' && turn === 0 && players[3]?.discard?.length > 0 ? 1 : 0.6 },
                            turn === 0 && phase === 'draw' && st.drawTargetActive,
                        ]}
                        onPress={drawFromDiscard}
                        disabled={turn !== 0 || phase !== 'draw' || !players[3]?.discard?.length}
                        activeOpacity={0.7}
                    >
                        {players[3]?.discard?.length > 0 ? (
                            <View style={st.discardPileRow}>
                                {players[3].discard.map((t, idx) => (
                                    <View key={idx} style={{ marginLeft: idx > 0 ? -8 : 0, transform: [{ rotate: `${(idx - 1) * -3}deg` }] }}>
                                        <MiniTile tile={t} size={miniSize * 1.1} />
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text style={[st.discardZoneLabel, isKurdish && st.kf]}>
                                {isKurdish ? 'بەتاڵە' : 'Empty'}
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* RIGHT: Player's Discard Pile (Where we throw) */}
                    <TouchableOpacity
                        style={[
                            st.discardTarget,
                            { minHeight: tileH * 0.7 },
                            turn === 0 && phase === 'discard' && selectedSlot !== null && st.discardTargetActive,
                        ]}
                        onPress={discardSelected}
                        activeOpacity={0.7}
                        disabled={turn !== 0 || phase !== 'discard' || selectedSlot === null}
                    >
                        {players[0].discard.length > 0 ? (
                            <View style={st.discardPileRow}>
                                {players[0].discard.map((t, idx) => (
                                    <View key={idx} style={{ marginLeft: idx > 0 ? -8 : 0, transform: [{ rotate: `${(idx - 1) * 3}deg` }] }}>
                                        <MiniTile tile={t} size={miniSize * 1.1} />
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text style={[st.discardZoneLabel, isKurdish && st.kf]}>
                                {isKurdish ? '▼ فڕێدان لێرە ▼' : '▼ Throw here ▼'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* ══════════ COMPACT ACTION BAR ══════════ */}
                <View style={st.actionBar}>
                    <TouchableOpacity style={st.sortBtn} onPress={autoSort}>
                        <RotateCcw color="#FFF" size={14} />
                        <Text style={[st.sortBtnText, isKurdish && st.kf]}>{isKurdish ? 'ڕیزکردن' : 'Sort'}</Text>
                    </TouchableOpacity>

                    <View style={st.statusChip}>
                        <View style={[st.statusDot, { backgroundColor: turn === 0 ? '#4ADE80' : '#FBBF24' }]} />
                        <Text style={[st.statusChipText, isKurdish && st.kf]}>
                            {isDistributing
                                ? (isKurdish ? 'دابەشکردن...' : 'Dealing...')
                                : turn !== 0
                                    ? (isKurdish ? 'چاوەڕوانبە...' : 'Wait...')
                                    : phase === 'draw'
                                        ? (isKurdish ? 'دابگرە' : 'Draw')
                                        : (isKurdish ? 'فڕێبدە' : 'Discard')}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[
                            st.winBtn,
                            turn === 0 && phase === 'discard' && selectedSlot !== null && st.winBtnActive,
                        ]}
                        onPress={tryWin}
                    >
                        <Trophy color="#FFF" size={14} />
                        <Text style={[st.winBtnText, isKurdish && st.kf]}>{isKurdish ? 'تەواو' : 'Okey!'}</Text>
                    </TouchableOpacity>
                </View>

                {/* ══════════ THE WOODEN RACK ══════════ */}
                <View style={st.rackWrapper}>
                    {isDistributing ? (
                        <View style={[st.distributingOverlay, { height: tileH * 2.5 }]}>
                            <Text style={[st.statusChipText, isKurdish && st.kf]}>
                                {isKurdish ? 'ئامادەکردنی یاری...' : 'Preparing Game...'}
                            </Text>
                        </View>
                    ) : (
                        <View style={st.woodRack}>
                            {/* Wood grain background — separate layer so tiles can overflow */}
                            <View style={st.woodBg}>
                                <LinearGradient
                                    colors={['#A0714D', '#8B6339', '#7A5530', '#6B4A28', '#5C3F20']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={StyleSheet.absoluteFillObject}
                                />
                                <View style={st.woodInsetTop} />
                                <View style={st.woodInsetBottom} />
                            </View>

                            {/* Row 1 */}
                            <View style={st.rackRow}>
                                {rack.slice(0, SLOTS_PER_ROW).map((t, i) => (
                                    <OkeyTile
                                        key={`slot-${i}`}
                                        index={i}
                                        tile={t}
                                        tileW={tileW}
                                        tileH={tileH}
                                        isSelected={selectedSlot === i}
                                        onPress={handleRackPress}
                                        onDragSwap={handleDragSwap}
                                        onDragDiscard={handleDragDiscard}
                                    />
                                ))}
                            </View>
                            {/* Row 2 */}
                            <View style={st.rackRow}>
                                {rack.slice(SLOTS_PER_ROW, TOTAL_SLOTS).map((t, i) => {
                                    const absIndex = i + SLOTS_PER_ROW;
                                    return (
                                        <OkeyTile
                                            key={`slot-${absIndex}`}
                                            index={absIndex}
                                            tile={t}
                                            tileW={tileW}
                                            tileH={tileH}
                                            isSelected={selectedSlot === absIndex}
                                            onPress={handleRackPress}
                                            onDragSwap={handleDragSwap}
                                            onDragDiscard={handleDragDiscard}
                                        />
                                    );
                                })}
                            </View>
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

/* ══════════════════════════════════════════════════════════
   STYLES
   ══════════════════════════════════════════════════════════ */
const st = StyleSheet.create({
    kf: { fontFamily: 'Rabar' },

    container: {
        flex: 1,
        ...Platform.select({
            web: {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 9999,
            },
        }),
    },

    feltTexture: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.05,
        ...Platform.select({
            web: {
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
                backgroundSize: '10px 10px',
            },
            default: {},
        }),
    },

    /* ── EDGE RACKS (BOTS) ── */
    edgeRack: {
        position: 'absolute',
        backgroundColor: '#5C3F20',
        borderColor: '#3E2914',
        shadowColor: '#000',
        shadowOpacity: 0.9,
        shadowRadius: 15,
        elevation: 20,
        overflow: 'hidden',
    },
    edgeRackTop: {
        top: -10, // Hide the top corner
        alignSelf: 'center',
        width: 250,
        height: 35,
        borderRadius: 15,
        borderWidth: 3,
        borderBottomColor: '#2E1908',
        borderTopWidth: 0, // hidden
        zIndex: 1,
    },
    edgeRackLeft: {
        left: -10,
        top: '20%',
        width: 35,
        height: 250,
        borderRadius: 15,
        borderWidth: 3,
        borderRightColor: '#2E1908',
        borderLeftWidth: 0,
        zIndex: 1,
    },
    edgeRackRight: {
        right: -10,
        top: '20%',
        width: 35,
        height: 250,
        borderRadius: 15,
        borderWidth: 3,
        borderLeftColor: '#7A5530',
        borderRightWidth: 0,
        zIndex: 1,
    },

    /* ── TOP BAR ── */
    topBar: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingTop: Platform.OS === 'ios' ? 6 : 4,
        paddingBottom: 2,
        zIndex: 10,
    },
    iconBtn: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: 'rgba(0,0,0,0.35)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    /* ── TOP BOT ── */
    topBotArea: {
        alignItems: 'center',
        gap: 4,
    },
    botNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    botName: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '700',
    },

    /* ── TABLE AREA ── */
    tableArea: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 50,
    },

    /* ── SIDE BOTS ── */
    sideBotLeft: {
        alignItems: 'center',
        gap: 3,
        width: 55,
    },
    sideBotRight: {
        alignItems: 'center',
        gap: 3,
        width: 55,
    },
    botNameSide: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
        textAlign: 'center',
    },
    sideDiscardPile: {
        marginTop: 6,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.15)',
        overflow: 'hidden',
    },

    /* ── CENTER AREA ── */
    centerArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    centerCards: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    deckCard: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.12)',
        overflow: 'hidden',
        // Slight tilt for a natural look
        transform: [{ rotate: '3deg' }],
    },
    deckGlow: {
        borderColor: '#4ADE80',
        shadowColor: '#4ADE80',
        shadowOpacity: 0.7,
        shadowRadius: 14,
        elevation: 12,
    },
    deckCountText: {
        color: '#FFF',
        fontWeight: '900',
    },
    centerDiscard: {
        width: 80,
        height: 60,
        position: 'relative',
    },

    /* ── ACTION BAR ── */
    actionBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 3,
        paddingHorizontal: 8,
    },
    sortBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(0,0,0,0.35)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    sortBtnText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
    },
    statusChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusChipText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '600',
    },
    tileCountBadge: {
        backgroundColor: '#5C3F20',
        borderWidth: 1.5,
        borderColor: '#8B6339',
        borderRadius: 6,
        paddingHorizontal: 7,
        paddingVertical: 3,
        minWidth: 24,
        alignItems: 'center',
    },
    tileCountText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '800',
    },
    winBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(0,0,0,0.35)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    winBtnActive: {
        backgroundColor: '#B45309',
        borderColor: '#F59E0B',
        shadowColor: '#F59E0B',
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 6,
    },
    winBtnText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
    },
    /* ── DISCARD ZONE ── */
    discardZone: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 2,
        width: '100%',
        maxWidth: 700,
        alignSelf: 'center',
    },
    discardTarget: {
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 10,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: 'rgba(255,255,255,0.15)',
        backgroundColor: 'rgba(0,0,0,0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 100,
    },
    discardTargetActive: {
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239,68,68,0.2)',
        borderStyle: 'solid',
        shadowColor: '#EF4444',
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 6,
    },
    drawTargetActive: {
        borderColor: '#4ADE80',
        backgroundColor: 'rgba(74,222,128,0.2)',
        borderStyle: 'solid',
        shadowColor: '#4ADE80',
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 6,
    },
    discardPileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    discardZoneLabel: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
    },

    /* ── WOODEN RACK ── */
    rackWrapper: {
        paddingHorizontal: 6,
        paddingBottom: Platform.OS === 'ios' ? 16 : 6,
    },
    distributingOverlay: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155',
    },
    woodRack: {
        alignSelf: 'center',
        paddingHorizontal: 8,
        paddingVertical: 7,
        borderRadius: 14,
        gap: 4,
        // NO overflow hidden — tiles must be able to pop up when selected/dragged
    },
    woodBg: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 14,
        overflow: 'hidden',
        // 3D depth effect
        borderWidth: 3,
        borderTopColor: '#B8885A',
        borderLeftColor: '#9A7248',
        borderRightColor: '#5C3F20',
        borderBottomColor: '#3E2914',
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 20,
    },
    woodInsetTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
    },
    woodInsetBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14,
    },
    rackRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 3,
        zIndex: 1,
    },

    /* ── TILE STYLES ── */
    emptySlot: {
        backgroundColor: 'rgba(0,0,0,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
    },
    tileOuter: {
        position: 'relative',
        borderWidth: 1.5,
        borderTopColor: '#E8E0D0',
        borderLeftColor: '#DDD6C6',
        borderRightColor: '#C4BCA8',
        borderBottomColor: '#A89E8C',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35,
        shadowRadius: 4,
        elevation: 6,
    },
    tileSelected: {
        transform: [{ translateY: -10 }, { scale: 1.08 }],
        shadowColor: '#F59E0B',
        shadowOpacity: 0.7,
        shadowRadius: 10,
        borderColor: '#FCD34D',
        borderWidth: 2,
        zIndex: 100,
    },
    tileFace: {
        flex: 1,
        overflow: 'hidden',
    },
    tileInner: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
    },
    tileNumber: {
        fontWeight: '900',
        textShadowColor: 'rgba(0,0,0,0.06)',
        textShadowOffset: { width: 0.5, height: 0.5 },
        textShadowRadius: 0,
    },
    dotsRow: {
        flexDirection: 'row',
        gap: 3,
        marginTop: -2,
    },
    tileDot: {},

    /* ── MINI TILE ── */
    miniTileFaceDown: {
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.15)',
        overflow: 'hidden',
    },
    miniTileOuter: {
        borderWidth: 1,
        borderTopColor: '#E8E0D0',
        borderLeftColor: '#DDD6C6',
        borderRightColor: '#C4BCA8',
        borderBottomColor: '#A89E8C',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        padding: 2,
    },
    miniTileNum: {
        fontWeight: '900',
    },
    miniTileDot: {},
});
