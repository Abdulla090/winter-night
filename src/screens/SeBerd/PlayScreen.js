import { BackButton } from '../../components/BackButton';
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Platform,
    SafeAreaView, useWindowDimensions, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, ArrowRight, RotateCcw, Target } from 'lucide-react-native';
import { AnimatedScreen } from '../../components/AnimatedScreen';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
    createInitialState, applyMove, getValidMoves, getMovesForStone,
    getPositionCoords, getBoardLines, getWinningLine,
    EMPTY, PLAYER1, PLAYER2, PHASE_PLACE, PHASE_MOVE,
} from './gameEngine';

const BLUE = '#3B82F6';
const BLUE_GLOW = '#60A5FA';
const RED = '#EF4444';
const RED_GLOW = '#F87171';
const STONE_SIZE_RATIO = 0.14;

export default function PlayScreen({ navigation, route }) {
    const { player1Name, player2Name } = route.params;
    const { isKurdish } = useLanguage();
    const { colors, isDark } = useTheme();
    const { width: screenWidth } = useWindowDimensions();

    const [gameState, setGameState] = useState(() => createInitialState());
    const [selectedStone, setSelectedStone] = useState(null);
    const [history, setHistory] = useState([]);

    // Pulsing animation for selected stone
    const selectedPulseAnim = useRef(new Animated.Value(1)).current;
    const staticAnim = useRef(new Animated.Value(1)).current;
    // Win line animation
    const winAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let pulse;
        if (selectedStone !== null) {
            pulse = Animated.loop(Animated.sequence([
                // useNativeDriver:true is required for transform-only animations on Android production
                Animated.timing(selectedPulseAnim, { toValue: 1.15, duration: 400, useNativeDriver: true }),
                Animated.timing(selectedPulseAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
            ]));
            pulse.start();
        } else {
            Animated.timing(selectedPulseAnim, { toValue: 1, duration: 50, useNativeDriver: true }).start();
        }
        return () => {
            if (pulse) pulse.stop();
        };
    }, [selectedStone]);

    useEffect(() => {
        if (gameState.gameOver) {
            // useNativeDriver:false because we animate opacity via interpolation linked to color
            Animated.timing(winAnim, { toValue: 1, duration: 600, useNativeDriver: false }).start();
            if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    }, [gameState.gameOver]);

    // Board sizing
    const boardMargin = 40;
    const containerWidth = Platform.OS === 'web' ? Math.min(screenWidth, 500) : screenWidth;
    const boardSize = containerWidth - boardMargin * 2;
    const stoneSize = boardSize * STONE_SIZE_RATIO;
    const coords = getPositionCoords();
    const boardLines = useMemo(() => getBoardLines(), []);
    const winLine = getWinningLine(gameState);

    // Valid moves
    const validMoves = useMemo(() => getValidMoves(gameState), [gameState]);
    const stoneMoves = useMemo(() => {
        if (selectedStone === null || gameState.phase !== PHASE_MOVE) return [];
        return getMovesForStone(gameState, selectedStone);
    }, [selectedStone, gameState]);

    // Movable stone positions
    const movableStones = useMemo(() => {
        if (gameState.phase !== PHASE_MOVE) return new Set();
        const set = new Set();
        validMoves.forEach(m => { if (m.from !== undefined) set.add(m.from); });
        return set;
    }, [validMoves, gameState.phase]);

    // Valid destination positions
    const validDests = useMemo(() => {
        const set = new Set();
        stoneMoves.forEach(m => set.add(m.to));
        return set;
    }, [stoneMoves]);

    const tc = colors.text.primary;
    const sc = colors.text.muted;
    const currentName = gameState.currentPlayer === PLAYER1 ? player1Name : player2Name;
    const currentColor = gameState.currentPlayer === PLAYER1 ? BLUE : RED;

    // Handle position tap
    const handlePositionPress = useCallback((pos) => {
        if (gameState.gameOver) return;
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        const { board, currentPlayer, phase } = gameState;

        if (phase === PHASE_PLACE) {
            // Place phase: tap empty position to place stone
            if (board[pos] === EMPTY) {
                const move = validMoves.find(m => m.to === pos);
                if (move) {
                    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    setHistory(prev => [...prev, gameState]);
                    const newState = applyMove(gameState, move);
                    setGameState(newState);
                    setSelectedStone(null);

                    if (newState.gameOver) {
                        setTimeout(() => navigateToResult(newState), 1200);
                    }
                }
            }
        } else {
            // Move phase
            if (board[pos] === currentPlayer && movableStones.has(pos)) {
                // Select own stone
                setSelectedStone(pos === selectedStone ? null : pos);
            } else if (selectedStone !== null && validDests.has(pos)) {
                // Move selected stone to valid destination
                const move = stoneMoves.find(m => m.to === pos);
                if (move) {
                    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    setHistory(prev => [...prev, gameState]);
                    const newState = applyMove(gameState, move);
                    setGameState(newState);
                    setSelectedStone(null);

                    if (newState.gameOver) {
                        setTimeout(() => navigateToResult(newState), 1200);
                    }
                }
            } else {
                setSelectedStone(null);
            }
        }
    }, [gameState, selectedStone, validMoves, stoneMoves, validDests, movableStones]);

    const navigateToResult = (state) => {
        navigation.navigate('SeBerdResult', {
            winner: state.winner,
            player1Name,
            player2Name,
            moveCount: state.moveCount,
        });
    };

    const handleUndo = useCallback(() => {
        if (history.length === 0) return;
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const prev = history[history.length - 1];
        setGameState(prev);
        setHistory(h => h.slice(0, -1));
        setSelectedStone(null);
        winAnim.setValue(0);
    }, [history]);

    // Convert position index to pixel coordinates
    const getPixelPos = (pos) => {
        const c = coords[pos];
        return {
            x: c.x * (boardSize - stoneSize) + stoneSize / 2,
            y: c.y * (boardSize - stoneSize) + stoneSize / 2,
        };
    };

    // Render board lines
    // CRITICAL FIX: `transformOrigin` is a web-only CSS property — it crashes React Native on Android.
    // Instead, use the native-compatible approach: translate by -length/2 so rotation pivots from left
    // edge, then translate back. We achieve left-edge rotation via: translateX(length/2) rotate translateX(-length/2)
    // Simpler approach: shift the View's left to start at p1, then use translateX(length/2) with a
    // rotation + translateX(-length/2) combination, OR just offset the top/left by half-height and accept
    // the View extends rightward from p1 naturally — which is how CSS rotation works with transformOrigin left.
    // The correct native-compatible way: place the view with its CENTER at midpoint, width=length, no origin hack.
    const renderLines = () => {
        return boardLines.map(([from, to], i) => {
            const p1 = getPixelPos(from);
            const p2 = getPixelPos(to);
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            const isWinLine = winLine && winLine.includes(from) && winLine.includes(to);
            // Center the line View between p1 and p2 so rotation is around the midpoint,
            // which is equivalent to transformOrigin:center (the React Native default).
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;

            return (
                <View key={i} style={{
                    position: 'absolute',
                    left: midX - length / 2,
                    top: midY - 1.5,
                    width: length,
                    height: 3,
                    backgroundColor: isWinLine ? '#FFD700' : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'),
                    transform: [{ rotate: `${angle}deg` }],
                    zIndex: 1,
                }} />
            );
        });
    };

    // Render a position (stone or empty spot)
    const renderPosition = (pos) => {
        const { x, y } = getPixelPos(pos);
        const cell = gameState.board[pos];
        const isSelected = selectedStone === pos;
        const isDest = validDests.has(pos);
        const isEmpty = cell === EMPTY;
        const isMovable = gameState.phase === PHASE_MOVE && movableStones.has(pos);
        const isPlaceable = gameState.phase === PHASE_PLACE && isEmpty;
        const isWinPos = winLine && winLine.includes(pos);

        return (
            <TouchableOpacity
                key={pos}
                activeOpacity={0.7}
                onPress={() => handlePositionPress(pos)}
                style={[pst.position, {
                    left: x - stoneSize / 2,
                    top: y - stoneSize / 2,
                    width: stoneSize,
                    height: stoneSize,
                    borderRadius: stoneSize / 2,
                    zIndex: isSelected ? 10 : 5,
                }]}
            >
                {/* Empty position indicator */}
                {isEmpty && !isDest && !isPlaceable && (
                    <View style={[pst.emptyDot, {
                        width: stoneSize * 0.25,
                        height: stoneSize * 0.25,
                        borderRadius: stoneSize * 0.125,
                        backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                    }]} />
                )}

                {/* Placeable indicator */}
                {isPlaceable && (
                    <View style={[pst.placeIndicator, {
                        width: stoneSize * 0.6,
                        height: stoneSize * 0.6,
                        borderRadius: stoneSize * 0.3,
                        borderColor: currentColor,
                    }]} />
                )}

                {/* Valid destination indicator */}
                {isDest && isEmpty && (
                    <View style={[pst.destIndicator, {
                        width: stoneSize * 0.5,
                        height: stoneSize * 0.5,
                        borderRadius: stoneSize * 0.25,
                        backgroundColor: `${currentColor}40`,
                        borderColor: currentColor,
                    }]} />
                )}

                {/* Stone */}
                {!isEmpty && (
                    <Animated.View style={[pst.stone, {
                        width: stoneSize,
                        height: stoneSize,
                        borderRadius: stoneSize / 2,
                        backgroundColor: cell === PLAYER1 ? BLUE : RED,
                        borderColor: cell === PLAYER1 ? BLUE_GLOW : RED_GLOW,
                        // Fix for Android crash: safely swapping Animated.Values instead of mixing value types
                        transform: [{ scale: isSelected ? selectedPulseAnim : staticAnim }],
                    },
                        isMovable && !isSelected && pst.movableStone,
                        isWinPos && pst.winStone,
                    ]}>
                        {/* Inner highlight */}
                        <View style={[pst.stoneInner, {
                            width: stoneSize * 0.6,
                            height: stoneSize * 0.6,
                            borderRadius: stoneSize * 0.3,
                            backgroundColor: cell === PLAYER1 ? '#60A5FA' : '#F87171',
                        }]} />
                        {/* Shine */}
                        <View style={[pst.stoneShine, {
                            width: stoneSize * 0.3,
                            height: stoneSize * 0.15,
                            borderRadius: stoneSize * 0.1,
                            top: stoneSize * 0.15,
                        }]} />
                    </Animated.View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <AnimatedScreen noPadding noTopPadding>
            <View style={st.root}>
                <LinearGradient
                    colors={isDark ? ['#111827', '#1F2937', '#111827'] : ['#F3F4F6', '#E5E7EB', '#F3F4F6']}
                    style={StyleSheet.absoluteFill}
                />
                <SafeAreaView style={{ flex: 1 }}>
                    {/* Header */}
                    <View style={st.header}>
                        <BackButton onPress={() => navigation.goBack()} />
                        <Text style={[st.headerTitle, { color: tc }, isKurdish && st.kf]}>
                            {isKurdish ? 'سێ بەرد' : 'Sê Berd'}
                        </Text>
                        <TouchableOpacity onPress={handleUndo}
                            style={[st.backBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                            <RotateCcw size={18} color={sc} />
                        </TouchableOpacity>
                    </View>

                    {/* Player Info Top (Player 2 - Red) */}
                    <View style={[st.playerBar, {
                        backgroundColor: isDark ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.08)',
                        borderColor: gameState.currentPlayer === PLAYER2 && !gameState.gameOver ? RED : 'transparent',
                    }]}>
                        <View style={st.playerBarLeft}>
                            <View style={[st.playerDot, { backgroundColor: RED, borderColor: RED_GLOW }]}>
                                {gameState.currentPlayer === PLAYER2 && !gameState.gameOver && <View style={st.activePulse} />}
                            </View>
                            <Text style={[st.playerName, { color: tc }, isKurdish && st.kf]} numberOfLines={1}>
                                {player2Name}
                            </Text>
                        </View>
                        <View style={st.stonesInfo}>
                            {Array(3).fill(null).map((_, i) => {
                                const placed = gameState.phase === PHASE_PLACE ? gameState.placedCount[PLAYER2] : 3;
                                return (
                                    <View key={i} style={[st.miniStone, {
                                        backgroundColor: i < placed ? RED : 'transparent',
                                        borderColor: RED,
                                    }]} />
                                );
                            })}
                        </View>
                    </View>

                    {/* Turn / Status */}
                    <View style={st.statusBar}>
                        {gameState.gameOver ? (
                            <Animated.View style={[st.statusPill, { backgroundColor: '#FFD70020', opacity: winAnim }]}>
                                <Text style={[st.statusText, { color: '#DAA520' }, isKurdish && st.kf]}>
                                    🏆 {gameState.winner === PLAYER1 ? player1Name : player2Name} {isKurdish ? 'بردییەوە!' : 'Wins!'}
                                </Text>
                            </Animated.View>
                        ) : (
                            <View style={[st.statusPill, {
                                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                            }]}>
                                <View style={[st.turnDot, { backgroundColor: currentColor }]} />
                                <Text style={[st.statusText, { color: tc }, isKurdish && st.kf]}>
                                    {gameState.phase === PHASE_PLACE
                                        ? (isKurdish ? `${currentName} — بەرد دابنێ` : `${currentName} — Place a stone`)
                                        : (isKurdish ? `${currentName} — بەرد بجوڵێنە` : `${currentName} — Move a stone`)}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Board */}
                    <View style={st.boardContainer}>
                        <View style={[st.board, {
                            width: boardSize,
                            height: boardSize,
                        }]}>
                            {/* Background */}
                            <View style={[st.boardBg, {
                                backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                            }]} />

                            {/* Lines */}
                            {renderLines()}

                            {/* Positions */}
                            {Array(9).fill(null).map((_, i) => renderPosition(i))}
                        </View>
                    </View>

                    {/* Phase indicator */}
                    <View style={st.phaseIndicator}>
                        <View style={[st.phasePill, {
                            backgroundColor: gameState.phase === PHASE_PLACE ? '#3B82F620' : '#22C55E20',
                            borderColor: gameState.phase === PHASE_PLACE ? '#3B82F6' : '#22C55E',
                        }]}>
                            <Text style={[st.phaseText, {
                                color: gameState.phase === PHASE_PLACE ? '#3B82F6' : '#22C55E',
                            }, isKurdish && st.kf]}>
                                {gameState.phase === PHASE_PLACE
                                    ? (isKurdish ? '📍 قۆناغی دانان' : '📍 Placement Phase')
                                    : (isKurdish ? '➡️ قۆناغی جوڵاندن' : '➡️ Movement Phase')}
                            </Text>
                        </View>
                    </View>

                    {/* Player Info Bottom (Player 1 - Blue) */}
                    <View style={[st.playerBar, {
                        backgroundColor: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.08)',
                        borderColor: gameState.currentPlayer === PLAYER1 && !gameState.gameOver ? BLUE : 'transparent',
                    }]}>
                        <View style={st.playerBarLeft}>
                            <View style={[st.playerDot, { backgroundColor: BLUE, borderColor: BLUE_GLOW }]}>
                                {gameState.currentPlayer === PLAYER1 && !gameState.gameOver && <View style={st.activePulse} />}
                            </View>
                            <Text style={[st.playerName, { color: tc }, isKurdish && st.kf]} numberOfLines={1}>
                                {player1Name}
                            </Text>
                        </View>
                        <View style={st.stonesInfo}>
                            {Array(3).fill(null).map((_, i) => {
                                const placed = gameState.phase === PHASE_PLACE ? gameState.placedCount[PLAYER1] : 3;
                                return (
                                    <View key={i} style={[st.miniStone, {
                                        backgroundColor: i < placed ? BLUE : 'transparent',
                                        borderColor: BLUE,
                                    }]} />
                                );
                            })}
                        </View>
                    </View>

                    {/* Move counter */}
                    <View style={st.moveCounter}>
                        <Text style={[st.moveCountText, { color: sc }]}>
                            {isKurdish ? `جوڵەکان: ${gameState.moveCount}` : `Moves: ${gameState.moveCount}`}
                        </Text>
                    </View>
                </SafeAreaView>
            </View>
        </AnimatedScreen>
    );
}

// Position styles
const pst = StyleSheet.create({
    position: {
        position: 'absolute', alignItems: 'center', justifyContent: 'center',
    },
    emptyDot: {},
    placeIndicator: {
        borderWidth: 2, borderStyle: 'dashed', opacity: 0.5,
    },
    destIndicator: {
        borderWidth: 2,
    },
    stone: {
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 3,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 6, elevation: 8,
    },
    stoneInner: {
        position: 'absolute', opacity: 0.4,
    },
    stoneShine: {
        position: 'absolute', backgroundColor: 'rgba(255,255,255,0.4)',
    },
    movableStone: {
        shadowOpacity: 0.5, elevation: 12,
    },
    winStone: {
        borderColor: '#FFD700', borderWidth: 4,
        shadowColor: '#FFD700', shadowOpacity: 0.8,
    },
});

const st = StyleSheet.create({
    root: { flex: 1 },
    kf: { fontFamily: 'Rabar' },

    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 14, paddingVertical: 8,
    },
    backBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 20, fontWeight: '900' },

    playerBar: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        marginHorizontal: 14, marginVertical: 4, paddingHorizontal: 14, paddingVertical: 10,
        borderRadius: 14, borderWidth: 2,
    },
    playerBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
    playerDot: { width: 28, height: 28, borderRadius: 14, borderWidth: 2.5, alignItems: 'center', justifyContent: 'center' },
    activePulse: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#22C55E' },
    playerName: { fontSize: 15, fontWeight: '800', maxWidth: 150 },
    stonesInfo: { flexDirection: 'row', gap: 4 },
    miniStone: { width: 14, height: 14, borderRadius: 7, borderWidth: 2 },

    statusBar: { alignItems: 'center', marginVertical: 6 },
    statusPill: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
    turnDot: { width: 10, height: 10, borderRadius: 5 },
    statusText: { fontSize: 14, fontWeight: '700' },

    boardContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    board: { position: 'relative' },
    boardBg: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 20, borderWidth: 1.5,
        margin: -20,
    },

    phaseIndicator: { alignItems: 'center', marginVertical: 6 },
    phasePill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12, borderWidth: 1 },
    phaseText: { fontSize: 12, fontWeight: '700' },

    moveCounter: { alignItems: 'center', paddingVertical: 4 },
    moveCountText: { fontSize: 12, fontWeight: '600' },
});
