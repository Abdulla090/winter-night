import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Dices, ArrowUpCircle, ArrowDownCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { AnimatedScreen, BeastButton, GlassCard } from '../../components';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../localization/translations';
import { layout } from '../../theme/layout';

const COLS = 10;
const ROWS = 10;
const TOTAL_CELLS = COLS * ROWS;
// Ensure board fits inside the standard AnimatedScreen padding!
// AnimatedScreen has layout.screen.padding (usually 20px) on both sides.
const BOARD_SIZE = Dimensions.get('window').width - (layout.screen.padding * 2);
const CELL_SIZE = Math.floor(BOARD_SIZE / COLS);
const ACTUAL_BOARD_SIZE = CELL_SIZE * COLS;

const LADDERS = { 4: 14, 9: 31, 20: 38, 28: 84, 40: 59, 51: 67, 63: 81, 71: 91 };
const SNAKES = { 17: 7, 54: 34, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 99: 78 };

const getCellPosition = (pos) => {
    if (pos < 1) pos = 1;
    if (pos > TOTAL_CELLS) pos = TOTAL_CELLS;
    
    const zeroIndexed = pos - 1;
    const row = Math.floor(zeroIndexed / COLS);
    const colRaw = zeroIndexed % COLS;
    
    const col = row % 2 === 0 ? colRaw : (COLS - 1) - colRaw;
    
    return { x: col * CELL_SIZE, y: (ROWS - 1 - row) * CELL_SIZE };
};

export default function PlayScreen({ route, navigation }) {
    const { players: initialPlayers } = route.params;
    const { language, isKurdish } = useLanguage();
    const { colors, isRTL } = useTheme();

    const [players, setPlayers] = useState(initialPlayers.map(p => ({ ...p, position: 0 })));
    const [turn, setTurn] = useState(0);
    const [diceValue, setDiceValue] = useState(1);
    const [isRolling, setIsRolling] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [statusText, setStatusText] = useState(isKurdish ? 'یاری دەستی پێکرد!' : "Let's Play!");

    const diceAnim = useRef(new Animated.Value(0)).current;
    
    const rowDirection = isRTL ? 'row-reverse' : 'row';
    const textAlign = isRTL ? 'right' : 'left';

    const rollDice = () => {
        if (isRolling) return;
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setIsRolling(true);
        setStatusText(isKurdish ? 'زار لێ دەدرێت...' : 'Rolling dice...');

        Animated.loop(
            Animated.sequence([
                Animated.timing(diceAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
                Animated.timing(diceAnim, { toValue: 0, duration: 150, useNativeDriver: true })
            ]), { iterations: 3 }
        ).start();

        setTimeout(() => {
            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            const roll = Math.floor(Math.random() * 6) + 1;
            setDiceValue(roll);
            setHasStarted(true);
            movePlayer(roll);
        }, 900);
    };

    const movePlayer = (roll) => {
        const currentPlayer = players[turn];
        if (currentPlayer.position === 0 && roll !== 6) {
            setStatusText(isKurdish ? `پێویستە ٦ بهێنیت بەلایەنی کەمەوە بۆ دەستپێکردن.` : `You need a 6 to start.`);
            endTurn(roll);
            return;
        }

        let newPos = currentPlayer.position === 0 ? 1 : currentPlayer.position + roll;

        if (newPos > 100) newPos = 100 - (newPos - 100);

        updatePlayerPosition(newPos, () => checkSnakesAndLadders(newPos, roll));
    };

    const updatePlayerPosition = (newPos, callback) => {
        const newPlayers = [...players];
        newPlayers[turn].position = newPos;
        setPlayers(newPlayers);
        setTimeout(() => callback && callback(), 600);
    };

    const checkSnakesAndLadders = (pos, roll) => {
        if (LADDERS[pos]) {
            if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setStatusText(isKurdish ? 'زۆر باشە! سەرکەوتیت!' : 'Awesome! You found a ladder!');
            setTimeout(() => updatePlayerPosition(LADDERS[pos], () => checkWin(LADDERS[pos], roll)), 800);
        } else if (SNAKES[pos]) {
            if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            setStatusText(isKurdish ? 'نەفرەت! مارێک پێوەی دایت!' : 'Ouch! Bitten by a snake!');
            setTimeout(() => updatePlayerPosition(SNAKES[pos], () => checkWin(SNAKES[pos], roll)), 800);
        } else {
            checkWin(pos, roll);
        }
    };

    const checkWin = (pos, roll) => {
        if (pos === 100) navigation.replace('ZarWMarResult', { winner: players[turn], players });
        else endTurn(roll);
    };

    const endTurn = (roll) => {
        if (roll === 6) {
            setStatusText(isKurdish ? '٦ت هێنا! جارێکی تر لێ بدە!' : 'You got a 6! Roll again!');
            setIsRolling(false);
            return;
        }

        setTimeout(() => {
            const nextTurn = (turn + 1) % players.length;
            setTurn(nextTurn);
            setStatusText(isKurdish ? `نۆرەی: ${players[nextTurn].name}` : `Turn: ${players[nextTurn].name}`);
            setIsRolling(false);
        }, 1000);
    };

    const renderBoard = () => {
        let cells = [];
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const isEvenRow = r % 2 === 0;
                let cellId = (ROWS - r - 1) * COLS + (isEvenRow ? (COLS - c) : (c + 1));
                const cellBg = (r + c) % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)';

                cells.push(
                    <View key={`cell-${cellId}`} style={[styles.cell, { backgroundColor: cellBg }]}>
                        <Text style={styles.cellNumber}>{cellId}</Text>
                        {LADDERS[cellId] && <ArrowUpCircle size={16} color="#38BDF8" style={{position:'absolute', opacity: 0.6}} />}
                        {SNAKES[cellId] && <ArrowDownCircle size={16} color="#EF4444" style={{position:'absolute', opacity: 0.6}} />}
                    </View>
                );
            }
        }
        return cells;
    };

    const diceRotation = diceAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <AnimatedScreen>
            <View style={styles.container}>
                {/* Header Players Map */}
                <View style={styles.header}>
                    <Text style={[styles.statusText, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>{statusText}</Text>
                    <View style={[styles.playersRow, { flexDirection: rowDirection }]}>
                        {players.map((p, i) => (
                            <View key={p.id} style={[styles.pBadge, turn === i && { borderColor: p.color, backgroundColor: p.color + '20' }]}>
                                <View style={[styles.pDot, { backgroundColor: p.color }]} />
                                <Text style={[styles.pName, { color: colors.text.secondary }, turn === i && {color: colors.text.primary, fontWeight: 'bold'}]} numberOfLines={1}>{p.name}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* The Board */}
                <GlassCard style={styles.boardContainer}>
                    <View style={styles.boardClip}>
                        <View style={styles.grid}>{renderBoard()}</View>
                        {players.map(p => {
                            if (p.position === 0) return null;
                            const pos = getCellPosition(p.position);
                            return (
                                <Animated.View 
                                    key={`pawn-${p.id}`} 
                                    style={[
                                        styles.pawn, 
                                        { backgroundColor: p.color, shadowColor: p.color, left: pos.x + (CELL_SIZE / 2) - 10, top: pos.y + (CELL_SIZE / 2) - 10 }
                                    ]} 
                                />
                            );
                        })}
                    </View>
                </GlassCard>

                {/* Footer Controls */}
                <View style={styles.footerWrap}>
                    <View style={[styles.footer, { flexDirection: rowDirection }]}>
                        <Animated.View style={{ transform: [{ rotate: diceRotation }] }}>
                            <View style={[styles.diceBox, { borderColor: players[turn].color, shadowColor: players[turn].color }]}>
                                <Text style={[styles.diceNumber, { color: colors.text.primary }]}>{hasStarted ? diceValue : '?'}</Text>
                            </View>
                        </Animated.View>

                        <View style={{ flex: 1, marginHorizontal: 16 }}>
                            <BeastButton
                                title={isRolling ? (isKurdish ? 'چاوەڕێ بە...' : 'Rolling...') : (isKurdish ? `نۆرەی زار لێدان` : `ROLL DICE`)}
                                onPress={rollDice}
                                disabled={isRolling}
                                variant="primary"
                                style={{ backgroundColor: isRolling ? colors.border : players[turn].color }}
                                icon={Dices}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'space-between', paddingBottom: layout.spacing.xl },
    header: { alignItems: 'center', marginVertical: layout.spacing.md },
    statusText: { fontSize: 20, fontWeight: '800', marginBottom: 12, textAlign: 'center' },
    playersRow: { flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
    pBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: layout.radius.sm, borderWidth: 1, borderColor: 'transparent' },
    pDot: { width: 10, height: 10, borderRadius: 5, marginHorizontal: 6 },
    pName: { fontSize: 12, fontWeight: '600', maxWidth: 80 },

    boardContainer: { alignItems: 'center', justifyContent: 'center', padding: 0, marginHorizontal: 0 },
    boardClip: { width: ACTUAL_BOARD_SIZE, height: ACTUAL_BOARD_SIZE, borderRadius: layout.radius.md, overflow: 'hidden' },
    grid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap' },
    cell: { width: CELL_SIZE, height: CELL_SIZE, justifyContent: 'center', alignItems: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.05)' },
    cellNumber: { fontSize: 9, color: 'rgba(255,255,255,0.5)', position: 'absolute', top: 2, left: 4 },

    pawn: { position: 'absolute', width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#FFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.8, shadowRadius: 6, elevation: 8 },

    footerWrap: { marginTop: layout.spacing.xl, paddingHorizontal: layout.spacing.sm },
    footer: { alignItems: 'center', justifyContent: 'space-between' },
    diceBox: { width: 60, height: 60, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: layout.radius.md, borderWidth: 2, justifyContent: 'center', alignItems: 'center', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 8, elevation: 5 },
    diceNumber: { fontSize: 28, fontWeight: '900' },
    kurdishFont: { fontFamily: 'Rabar', transform: [{ scale: 1.15 }] },
});
