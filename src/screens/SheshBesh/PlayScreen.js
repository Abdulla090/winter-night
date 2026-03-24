import { BackButton } from '../../components/BackButton';
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Platform,
    SafeAreaView, useWindowDimensions, Animated, Alert, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, ArrowRight, RotateCcw, Flag, Dice5 } from 'lucide-react-native';
import { AnimatedScreen } from '../../components/AnimatedScreen';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
    createInitialState, cloneState, startTurn, endTurn,
    getValidMoves, applyMove, isTurnOver, hasValidMoves,
    getPlayerStats, rollForFirst, PLAYER1, PLAYER2, TOTAL_CHECKERS,
} from './gameEngine';

// Board colors
const WOOD_DARK = '#3E2209';
const WOOD_MED = '#5D3A1A';
const WOOD_LIGHT = '#8B6B3D';
const FELT_GREEN = '#0B6623';
const FELT_DARK = '#064216';
const TRI_DARK = '#8B4513';
const TRI_LIGHT = '#DEB887';
const WHITE_PIECE_COLOR = '#F5F0E8';
const WHITE_PIECE_BORDER = '#C4B59A';
const BLACK_PIECE_COLOR = '#1C1C1C';
const BLACK_PIECE_BORDER = '#555';
const HIGHLIGHT_COLOR = 'rgba(255, 215, 0, 0.5)';
const VALID_DEST_COLOR = 'rgba(76, 175, 80, 0.6)';

// ==================== DICE FACE COMPONENT ====================
const DieFace = ({ value, size = 48, rolling = false }) => {
    const dots = {
        1: [[1,1]],
        2: [[0,2],[2,0]],
        3: [[0,2],[1,1],[2,0]],
        4: [[0,0],[0,2],[2,0],[2,2]],
        5: [[0,0],[0,2],[1,1],[2,0],[2,2]],
        6: [[0,0],[0,2],[1,0],[1,2],[2,0],[2,2]],
    };

    const dotSize = size * 0.16;
    const padding = size * 0.18;
    const spacing = (size - padding * 2 - dotSize) / 2;

    return (
        <View style={[diceStyles.die, { width: size, height: size, borderRadius: size * 0.18 }]}>
            <LinearGradient colors={['#FFFFFF', '#F0E8D8']} style={[StyleSheet.absoluteFill, { borderRadius: size * 0.18 }]} />
            {(dots[value] || []).map(([row, col], i) => (
                <View key={i} style={{
                    position: 'absolute',
                    top: padding + row * spacing,
                    left: padding + col * spacing,
                    width: dotSize, height: dotSize, borderRadius: dotSize / 2,
                    backgroundColor: '#1a1a1a',
                }} />
            ))}
        </View>
    );
};

const diceStyles = StyleSheet.create({
    die: {
        backgroundColor: '#FFF', position: 'relative',
        shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3, shadowRadius: 4, elevation: 6,
        borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)',
    },
});

// ==================== CHECKER PIECE COMPONENT ====================
const Checker = ({ player, isTop = false, count, size, selected, isOnBar = false }) => {
    const isWhite = player === 1;
    const maxVisible = 5;
    const visible = Math.min(count, maxVisible);
    const stackOffset = size * 0.2;

    return (
        <View style={{ alignItems: 'center', height: visible * stackOffset + size * 0.8 }}>
            {Array(visible).fill(null).map((_, i) => (
                <View key={i} style={[
                    checkerStyles.piece,
                    {
                        width: size, height: size * 0.8,
                        borderRadius: size * 0.4,
                        backgroundColor: isWhite ? WHITE_PIECE_COLOR : BLACK_PIECE_COLOR,
                        borderColor: isWhite ? WHITE_PIECE_BORDER : BLACK_PIECE_BORDER,
                        position: 'absolute',
                        [isTop ? 'top' : 'bottom']: i * stackOffset,
                        zIndex: i,
                    },
                    selected && i === visible - 1 && checkerStyles.selected,
                ]}>
                    {/* Inner circle for depth */}
                    <View style={[checkerStyles.inner, {
                        width: size * 0.6, height: size * 0.45,
                        borderRadius: size * 0.3,
                        borderColor: isWhite ? 'rgba(139,115,85,0.2)' : 'rgba(100,100,100,0.3)',
                    }]} />
                </View>
            ))}
            {/* Count badge for > 5 pieces */}
            {count > maxVisible && (
                <View style={[checkerStyles.countBadge, {
                    [isTop ? 'top' : 'bottom']: (visible - 1) * stackOffset + size * 0.15,
                }]}>
                    <Text style={checkerStyles.countText}>{count}</Text>
                </View>
            )}
        </View>
    );
};

const checkerStyles = StyleSheet.create({
    piece: {
        borderWidth: 2, alignItems: 'center', justifyContent: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25, shadowRadius: 3, elevation: 3,
    },
    inner: { borderWidth: 1 },
    selected: {
        borderColor: '#FFD700', borderWidth: 3,
        shadowColor: '#FFD700', shadowOpacity: 0.6, elevation: 8,
    },
    countBadge: {
        position: 'absolute', zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8,
    },
    countText: { color: '#FFF', fontSize: 11, fontWeight: '800' },
});

// ==================== MAIN PLAY SCREEN ====================

export default function PlayScreen({ navigation, route }) {
    const { player1Name, player2Name } = route.params;
    const { language, isKurdish } = useLanguage();
    const { colors, isDark } = useTheme();
    const { width: screenWidth } = useWindowDimensions();

    // Game state
    const [gameState, setGameState] = useState(() => createInitialState());
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [validMoves, setValidMoves] = useState([]);
    const [phase, setPhase] = useState('roll'); // 'roll', 'move', 'endTurn'
    const [moveHistory, setMoveHistory] = useState([]);
    const [turnMoves, setTurnMoves] = useState([]); // moves made this turn

    // Dice animation
    const diceAnim = useRef(new Animated.Value(0)).current;
    const [diceRolling, setDiceRolling] = useState(false);

    // Board sizing
    const containerWidth = Platform.OS === 'web' ? Math.min(screenWidth, 500) : screenWidth;
    const boardMargin = 8;
    const boardWidth = containerWidth - boardMargin * 2;
    const barWidth = boardWidth * 0.08;
    const playAreaWidth = (boardWidth - barWidth) / 2;
    const pointWidth = playAreaWidth / 6;
    const boardHeight = boardWidth * 1.15;
    const halfBoardHeight = boardHeight / 2;
    const checkerSize = pointWidth * 0.85;

    const tc = colors.text.primary;
    const sc = colors.text.muted;

    // Current valid moves
    const allValidMoves = useMemo(() => {
        if (phase !== 'move') return [];
        return getValidMoves(gameState);
    }, [gameState, phase]);

    // Get valid destinations for selected point
    const validDestinations = useMemo(() => {
        if (selectedPoint === null) return [];
        return allValidMoves.filter(m => {
            if (selectedPoint === 'bar') return m.from === 'bar';
            return m.from === selectedPoint;
        });
    }, [allValidMoves, selectedPoint]);

    // Points that have movable pieces
    const movablePoints = useMemo(() => {
        const points = new Set();
        allValidMoves.forEach(m => {
            if (m.from === 'bar') points.add('bar');
            else points.add(m.from);
        });
        return points;
    }, [allValidMoves]);

    // Handle dice roll
    const handleRoll = useCallback(() => {
        if (phase !== 'roll') return;
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        setDiceRolling(true);
        
        // Animate dice
        Animated.sequence([
            Animated.timing(diceAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
            Animated.timing(diceAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
            Animated.timing(diceAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
            Animated.timing(diceAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        ]).start(() => {
            setDiceRolling(false);
            const newState = startTurn(gameState);
            setGameState(newState);
            setTurnMoves([]);
            
            // Check if player has any valid moves
            if (!hasValidMoves(newState)) {
                // No valid moves — auto skip
                setTimeout(() => {
                    setPhase('endTurn');
                }, 1000);
            } else {
                setPhase('move');
            }
        });
    }, [phase, gameState, diceAnim]);

    // Handle point tap
    const handlePointPress = useCallback((pointIndex) => {
        if (phase !== 'move') return;
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        const point = gameState.points[pointIndex];
        const player = gameState.currentPlayer;

        // If clicking on a valid destination
        if (selectedPoint !== null) {
            const move = validDestinations.find(m => m.to === pointIndex);
            if (move) {
                executeMove(move);
                return;
            }
        }

        // If clicking on own piece, select it
        if (point.player === player && point.count > 0 && movablePoints.has(pointIndex)) {
            setSelectedPoint(pointIndex);
            return;
        }

        // Deselect
        setSelectedPoint(null);
    }, [phase, gameState, selectedPoint, validDestinations, movablePoints]);

    // Handle bar tap
    const handleBarPress = useCallback(() => {
        if (phase !== 'move') return;
        const player = gameState.currentPlayer;
        if (gameState.bar[player] > 0 && movablePoints.has('bar')) {
            setSelectedPoint('bar');
            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    }, [phase, gameState, movablePoints]);

    // Handle bear off
    const handleBearOff = useCallback(() => {
        if (selectedPoint === null || phase !== 'move') return;
        const move = validDestinations.find(m => m.to === 'off');
        if (move) {
            executeMove(move);
        }
    }, [selectedPoint, validDestinations, phase]);

    // Execute a move
    const executeMove = useCallback((move) => {
        if (Platform.OS !== 'web') {
            if (move.isHit) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } else {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
        }

        const newState = applyMove(gameState, move);
        setGameState(newState);
        setTurnMoves(prev => [...prev, move]);
        setSelectedPoint(null);

        // Check for win
        if (newState.gameOver) {
            setTimeout(() => {
                navigation.navigate('SheshBeshResult', {
                    winner: newState.winner,
                    winType: newState.winType,
                    player1Name,
                    player2Name,
                    stats: getPlayerStats(newState),
                });
            }, 1000);
            return;
        }

        // Check if turn is over
        if (isTurnOver(newState)) {
            setPhase('endTurn');
        }
    }, [gameState, player1Name, player2Name, navigation]);

    // End turn
    const handleEndTurn = useCallback(() => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const newState = endTurn(gameState);
        setGameState(newState);
        setSelectedPoint(null);
        setValidMoves([]);
        setPhase('roll');
        setMoveHistory(prev => [...prev, ...turnMoves]);
    }, [gameState, turnMoves]);

    // Resign
    const handleResign = useCallback(() => {
        Alert.alert(
            isKurdish ? 'وازهێنان' : 'Resign',
            isKurdish ? 'ئایا دڵنیایت؟' : 'Are you sure?',
            [
                { text: isKurdish ? 'نەخێر' : 'No', style: 'cancel' },
                {
                    text: isKurdish ? 'بەڵێ' : 'Yes', style: 'destructive',
                    onPress: () => {
                        const winner = gameState.currentPlayer === 1 ? 2 : 1;
                        navigation.navigate('SheshBeshResult', {
                            winner, winType: 'resign', player1Name, player2Name,
                            stats: getPlayerStats(gameState),
                        });
                    }
                },
            ]
        );
    }, [gameState, isKurdish, player1Name, player2Name, navigation]);

    const stats = useMemo(() => getPlayerStats(gameState), [gameState]);
    const currentName = gameState.currentPlayer === 1 ? player1Name : player2Name;

    // Is a destination highlighted?
    const isValidDest = useCallback((idx) => {
        return validDestinations.some(m => m.to === idx);
    }, [validDestinations]);
    
    const canBearOffNow = validDestinations.some(m => m.to === 'off');

    // ==================== RENDER BOARD ====================

    // Render a single triangular point
    const renderPoint = (pointIndex, isTop) => {
        const point = gameState.points[pointIndex];
        const isSelected = selectedPoint === pointIndex;
        const isMovable = movablePoints.has(pointIndex);
        const isDest = isValidDest(pointIndex);
        const triColor = pointIndex % 2 === 0 ? TRI_DARK : TRI_LIGHT;

        return (
            <TouchableOpacity
                key={pointIndex}
                activeOpacity={0.7}
                onPress={() => handlePointPress(pointIndex)}
                style={[boardSt.pointContainer, { width: pointWidth }]}
            >
                {/* Triangle */}
                <View style={[
                    isTop ? boardSt.triangleDown : boardSt.triangleUp,
                    {
                        borderLeftWidth: pointWidth / 2,
                        borderRightWidth: pointWidth / 2,
                        [isTop ? 'borderTopWidth' : 'borderBottomWidth']: halfBoardHeight * 0.7,
                        [isTop ? 'borderTopColor' : 'borderBottomColor']: triColor,
                    },
                    isDest && { opacity: 0.7 },
                ]} />

                {/* Valid destination highlight */}
                {isDest && (
                    <View style={[boardSt.destHighlight, {
                        width: pointWidth - 4,
                        height: halfBoardHeight * 0.7,
                        [isTop ? 'top' : 'bottom']: 0,
                        borderRadius: pointWidth / 2,
                    }]} />
                )}

                {/* Pieces */}
                {point.count > 0 && (
                    <View style={[boardSt.piecesContainer, {
                        [isTop ? 'top' : 'bottom']: 2,
                    }]}>
                        <Checker
                            player={point.player}
                            count={point.count}
                            size={checkerSize}
                            isTop={isTop}
                            selected={isSelected}
                        />
                    </View>
                )}

                {/* Point number (subtle) */}
                <View style={[boardSt.pointNumber, { [isTop ? 'bottom' : 'top']: 2 }]}>
                    <Text style={boardSt.pointNumberText}>{pointIndex + 1}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <AnimatedScreen noPadding noTopPadding>
            <View style={st.root}>
                <LinearGradient
                    colors={isDark ? ['#0A1F0A', '#0D2B0D', '#0A1F0A'] : ['#F0F5EF', '#E5EDE3', '#F0F5EF']}
                    style={StyleSheet.absoluteFill}
                />
                <SafeAreaView style={{ flex: 1 }}>
                    {/* Header */}
                    <View style={st.header}>
                        <BackButton onPress={() => navigation.goBack()} />
                        <Text style={[st.headerTitle, { color: tc }, isKurdish && st.kf]}>
                            {isKurdish ? 'تەولە' : 'Tawla'}
                        </Text>
                        <TouchableOpacity onPress={handleResign}
                            style={[st.backBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                            <Flag size={18} color="#EF4444" />
                        </TouchableOpacity>
                    </View>

                    {/* Player 2 Info (Top - Black) */}
                    <View style={[st.playerBar, {
                        backgroundColor: isDark ? 'rgba(26,26,26,0.3)' : 'rgba(26,26,26,0.08)',
                        borderColor: gameState.currentPlayer === 2 ? '#DAA520' : 'transparent',
                    }]}>
                        <View style={st.playerBarLeft}>
                            <View style={[st.playerPiece, { backgroundColor: BLACK_PIECE_COLOR, borderColor: BLACK_PIECE_BORDER }]} />
                            <Text style={[st.playerName, { color: tc }, isKurdish && st.kf]} numberOfLines={1}>{player2Name}</Text>
                        </View>
                        <View style={st.playerStats}>
                            <Text style={[st.pipText, { color: sc }]}>Pip: {stats[2].pips}</Text>
                            <Text style={[st.offText, { color: '#22C55E' }]}>✓{gameState.borneOff[2]}</Text>
                            {gameState.bar[2] > 0 && <Text style={[st.barText, { color: '#EF4444' }]}>Bar: {gameState.bar[2]}</Text>}
                        </View>
                    </View>

                    {/* Bear off zone - Player 2 */}
                    {canBearOffNow && gameState.currentPlayer === 2 && (
                        <TouchableOpacity onPress={handleBearOff} style={st.bearOffBtn}>
                            <Text style={[st.bearOffText, isKurdish && st.kf]}>
                                {isKurdish ? '⬆ دەربکە' : '⬆ Bear Off'}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {/* Board */}
                    <View style={[st.boardOuter, { width: boardWidth, height: boardHeight, marginHorizontal: boardMargin }]}>
                        <LinearGradient colors={[WOOD_DARK, WOOD_MED, WOOD_DARK]} style={[StyleSheet.absoluteFill, { borderRadius: 8 }]} />
                        
                        <View style={st.boardInner}>
                            {/* Top half (points 12-23 for display) */}
                            <View style={[st.boardHalf, { height: halfBoardHeight }]}>
                                <LinearGradient colors={[FELT_DARK, FELT_GREEN]} style={StyleSheet.absoluteFill} />
                                <View style={st.pointsRow}>
                                    {/* Left side: points 12-17 */}
                                    <View style={st.pointsGroup}>
                                        {[12,13,14,15,16,17].map(i => renderPoint(i, true))}
                                    </View>
                                    {/* Bar */}
                                    <TouchableOpacity 
                                        onPress={handleBarPress}
                                        style={[st.barZone, { width: barWidth, height: halfBoardHeight }]}
                                    >
                                        {gameState.bar[2] > 0 && (
                                            <View style={st.barPieces}>
                                                <Checker player={2} count={gameState.bar[2]} size={checkerSize * 0.8} isTop={true} isOnBar />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                    {/* Right side: points 18-23 */}
                                    <View style={st.pointsGroup}>
                                        {[18,19,20,21,22,23].map(i => renderPoint(i, true))}
                                    </View>
                                </View>
                            </View>

                            {/* Center bar / Dice area */}
                            <View style={st.centerStrip}>
                                <LinearGradient colors={[WOOD_MED, WOOD_LIGHT, WOOD_MED]} style={StyleSheet.absoluteFill} />
                                <View style={st.diceArea}>
                                    {gameState.dice.length > 0 ? (
                                        <View style={st.diceRow}>
                                            <Animated.View style={{ transform: [{ rotate: diceAnim.interpolate({ inputRange: [0,1], outputRange: ['0deg', '360deg'] }) }] }}>
                                                <DieFace value={gameState.dice[0]} size={36} />
                                            </Animated.View>
                                            <Animated.View style={{ transform: [{ rotate: diceAnim.interpolate({ inputRange: [0,1], outputRange: ['0deg', '-360deg'] }) }] }}>
                                                <DieFace value={gameState.dice[1]} size={36} />
                                            </Animated.View>
                                            {gameState.remainingMoves.length > 0 && (
                                                <View style={st.remainingBadge}>
                                                    <Text style={st.remainingText}>
                                                        {gameState.remainingMoves.join(',')}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    ) : (
                                        <TouchableOpacity onPress={handleRoll} activeOpacity={0.7}>
                                            <View style={st.rollHint}>
                                                <Dice5 size={20} color="#FFD700" />
                                                <Text style={[st.rollHintText, isKurdish && st.kf]}>
                                                    {isKurdish ? 'تاس بهاوێژە' : 'Roll Dice'}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>

                            {/* Bottom half (points 11-0 for display) */}
                            <View style={[st.boardHalf, { height: halfBoardHeight }]}>
                                <LinearGradient colors={[FELT_GREEN, FELT_DARK]} style={StyleSheet.absoluteFill} />
                                <View style={st.pointsRow}>
                                    {/* Left side: points 11-6 */}
                                    <View style={st.pointsGroup}>
                                        {[11,10,9,8,7,6].map(i => renderPoint(i, false))}
                                    </View>
                                    {/* Bar */}
                                    <TouchableOpacity 
                                        onPress={handleBarPress}
                                        style={[st.barZone, { width: barWidth, height: halfBoardHeight }]}
                                    >
                                        {gameState.bar[1] > 0 && (
                                            <View style={[st.barPieces, { justifyContent: 'flex-end' }]}>
                                                <Checker player={1} count={gameState.bar[1]} size={checkerSize * 0.8} isOnBar />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                    {/* Right side: points 5-0 */}
                                    <View style={st.pointsGroup}>
                                        {[5,4,3,2,1,0].map(i => renderPoint(i, false))}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Bear off zone - Player 1 */}
                    {canBearOffNow && gameState.currentPlayer === 1 && (
                        <TouchableOpacity onPress={handleBearOff} style={st.bearOffBtn}>
                            <Text style={[st.bearOffText, isKurdish && st.kf]}>
                                {isKurdish ? '⬇ دەربکە' : '⬇ Bear Off'}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {/* Player 1 Info (Bottom - White) */}
                    <View style={[st.playerBar, {
                        backgroundColor: isDark ? 'rgba(245,245,220,0.08)' : 'rgba(245,245,220,0.3)',
                        borderColor: gameState.currentPlayer === 1 ? '#DAA520' : 'transparent',
                    }]}>
                        <View style={st.playerBarLeft}>
                            <View style={[st.playerPiece, { backgroundColor: WHITE_PIECE_COLOR, borderColor: WHITE_PIECE_BORDER }]} />
                            <Text style={[st.playerName, { color: tc }, isKurdish && st.kf]} numberOfLines={1}>{player1Name}</Text>
                        </View>
                        <View style={st.playerStats}>
                            <Text style={[st.pipText, { color: sc }]}>Pip: {stats[1].pips}</Text>
                            <Text style={[st.offText, { color: '#22C55E' }]}>✓{gameState.borneOff[1]}</Text>
                            {gameState.bar[1] > 0 && <Text style={[st.barText, { color: '#EF4444' }]}>Bar: {gameState.bar[1]}</Text>}
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={st.actionRow}>
                        {phase === 'roll' && (
                            <TouchableOpacity onPress={handleRoll} style={st.rollBtn} activeOpacity={0.8}>
                                <LinearGradient colors={[FELT_GREEN, FELT_DARK]} style={st.rollBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                                    <Dice5 size={20} color="#FFF" />
                                    <Text style={[st.rollBtnText, isKurdish && st.kf]}>
                                        {isKurdish ? `تاس بهاوێژە - ${currentName}` : `Roll - ${currentName}`}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        )}
                        {phase === 'endTurn' && (
                            <TouchableOpacity onPress={handleEndTurn} style={st.rollBtn} activeOpacity={0.8}>
                                <LinearGradient colors={['#DAA520', '#B8860B']} style={st.rollBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                                    <Text style={[st.rollBtnText, isKurdish && st.kf]}>
                                        {isKurdish ? 'نۆرەی دواتر' : 'End Turn'}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        )}
                        {phase === 'move' && !hasValidMoves(gameState) && (
                            <TouchableOpacity onPress={handleEndTurn} style={st.rollBtn} activeOpacity={0.8}>
                                <LinearGradient colors={['#EF4444', '#DC2626']} style={st.rollBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                                    <Text style={[st.rollBtnText, isKurdish && st.kf]}>
                                        {isKurdish ? 'هیچ جوڵەیەک نییە!' : 'No moves! Skip'}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        )}
                        {phase === 'move' && hasValidMoves(gameState) && (
                            <View style={st.moveHint}>
                                <Text style={[st.moveHintText, { color: sc }, isKurdish && st.kf]}>
                                    {selectedPoint !== null 
                                        ? (isKurdish ? 'شوێنی مەبەست هەڵبژێرە' : 'Tap destination')
                                        : (isKurdish ? 'پاسە هەڵبژێرە' : 'Select a piece to move')
                                    }
                                </Text>
                            </View>
                        )}
                    </View>
                </SafeAreaView>
            </View>
        </AnimatedScreen>
    );
}

// ==================== STYLES ====================

const boardSt = StyleSheet.create({
    pointContainer: { alignItems: 'center', position: 'relative' },
    triangleDown: {
        width: 0, height: 0,
        borderLeftColor: 'transparent', borderRightColor: 'transparent',
        borderBottomWidth: 0, borderBottomColor: 'transparent',
    },
    triangleUp: {
        width: 0, height: 0,
        borderLeftColor: 'transparent', borderRightColor: 'transparent',
        borderTopWidth: 0, borderTopColor: 'transparent',
    },
    piecesContainer: { position: 'absolute', alignItems: 'center', left: 0, right: 0 },
    destHighlight: {
        position: 'absolute', backgroundColor: VALID_DEST_COLOR,
        alignSelf: 'center', opacity: 0.5,
    },
    pointNumber: { position: 'absolute', alignSelf: 'center' },
    pointNumberText: { color: 'rgba(255,255,255,0.25)', fontSize: 8, fontWeight: '700' },
});

const st = StyleSheet.create({
    root: { flex: 1 },
    kf: { fontFamily: 'Rabar' },

    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 10, paddingVertical: 4,
    },
    backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '900' },

    // Player bar
    playerBar: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        marginHorizontal: 8, marginVertical: 2, paddingHorizontal: 12, paddingVertical: 6,
        borderRadius: 12, borderWidth: 2,
    },
    playerBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
    playerPiece: { width: 24, height: 24, borderRadius: 12, borderWidth: 2 },
    playerName: { fontSize: 14, fontWeight: '800', maxWidth: 120 },
    playerStats: { flexDirection: 'row', gap: 8, alignItems: 'center' },
    pipText: { fontSize: 11, fontWeight: '600' },
    offText: { fontSize: 12, fontWeight: '800' },
    barText: { fontSize: 11, fontWeight: '700' },

    // Board
    boardOuter: {
        borderRadius: 8, overflow: 'hidden', borderWidth: 3, borderColor: WOOD_DARK,
        alignSelf: 'center',
    },
    boardInner: { flex: 1 },
    boardHalf: { overflow: 'hidden' },
    pointsRow: { flexDirection: 'row', flex: 1 },
    pointsGroup: { flexDirection: 'row', flex: 1 },
    barZone: {
        backgroundColor: 'rgba(62,34,9,0.6)', alignItems: 'center',
        justifyContent: 'center', borderLeftWidth: 1, borderRightWidth: 1,
        borderColor: 'rgba(93,58,26,0.5)',
    },
    barPieces: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingVertical: 4 },

    // Center strip
    centerStrip: {
        height: 44, justifyContent: 'center', alignItems: 'center',
    },
    diceArea: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    diceRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
    remainingBadge: {
        backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 6, paddingVertical: 2,
        borderRadius: 6, marginLeft: 6,
    },
    remainingText: { color: '#FFD700', fontSize: 11, fontWeight: '800' },
    rollHint: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    rollHintText: { color: '#FFD700', fontSize: 13, fontWeight: '700' },

    // Bear off
    bearOffBtn: {
        alignSelf: 'center', backgroundColor: 'rgba(34,197,94,0.15)',
        paddingHorizontal: 20, paddingVertical: 6, borderRadius: 12,
        borderWidth: 1, borderColor: '#22C55E', marginVertical: 2,
    },
    bearOffText: { color: '#22C55E', fontSize: 13, fontWeight: '800' },

    // Actions
    actionRow: { paddingHorizontal: 8, paddingVertical: 4 },
    rollBtn: { height: 44, borderRadius: 22, overflow: 'hidden' },
    rollBtnGrad: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    rollBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
    moveHint: { alignItems: 'center', paddingVertical: 8 },
    moveHintText: { fontSize: 13, fontWeight: '600' },
});
