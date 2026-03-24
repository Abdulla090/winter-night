import { BackButton } from '../../components/BackButton';
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Platform,
    SafeAreaView, useWindowDimensions, Animated, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, ArrowRight, Crown, RotateCcw, Flag, Swords } from 'lucide-react-native';
import { AnimatedScreen } from '../../components/AnimatedScreen';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
    createInitialBoard,
    getAllLegalMoves,
    getLegalMovesForPiece,
    applyMove,
    checkGameEnd,
    countPieces,
    getOwner,
    isKing,
    checkSwar,
    EMPTY, PLAYER1, PLAYER2, PLAYER1_KING, PLAYER2_KING,
} from './gameEngine';

// Board colors
const LIGHT_SQUARE = '#DEB887'; // Burlywood
const DARK_SQUARE = '#8B4513';  // Saddle brown
const SELECTED_COLOR = 'rgba(255, 215, 0, 0.6)';
const VALID_MOVE_COLOR = 'rgba(76, 175, 80, 0.5)';
const CAPTURE_COLOR = 'rgba(244, 67, 54, 0.5)';
const SWAR_COLOR = 'rgba(255, 69, 0, 0.7)';
const LAST_MOVE_COLOR = 'rgba(255, 215, 0, 0.25)';

// Piece colors
const WHITE_PIECE = '#F5F5DC';
const WHITE_PIECE_BORDER = '#8B7355';
const BLACK_PIECE = '#1a1a1a';
const BLACK_PIECE_BORDER = '#444';
const KING_CROWN = '#FFD700';

export default function PlayScreen({ navigation, route }) {
    const { player1Name, player2Name } = route.params;
    const { language, isKurdish } = useLanguage();
    const { colors, isDark } = useTheme();
    const { width: screenWidth } = useWindowDimensions();

    // Game state
    const [board, setBoard] = useState(() => createInitialBoard());
    const [currentPlayer, setCurrentPlayer] = useState(1); // Player 1 starts
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [validMoves, setValidMoves] = useState([]);
    const [lastMove, setLastMove] = useState(null);
    const [swarPieces, setSwarPieces] = useState(null);
    const [gameOver, setGameOver] = useState(null);
    const [moveHistory, setMoveHistory] = useState([]);
    const [capturedByP1, setCapturedByP1] = useState(0);
    const [capturedByP2, setCapturedByP2] = useState(0);

    // Animation refs
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const turnIndicatorAnim = useRef(new Animated.Value(0)).current;

    // Board sizing
    const containerWidth = Platform.OS === 'web' ? Math.min(screenWidth, 500) : screenWidth;
    const boardPadding = 16;
    const boardSize = containerWidth - (boardPadding * 2);
    const cellSize = Math.floor(boardSize / 8);
    const actualBoardSize = cellSize * 8;

    // Pulse animation for selected piece
    useEffect(() => {
        if (selectedPiece) {
            const pulse = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.1, duration: 500, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
                ])
            );
            pulse.start();
            return () => pulse.stop();
        } else {
            pulseAnim.setValue(1);
        }
    }, [selectedPiece]);

    // Turn indicator animation
    useEffect(() => {
        Animated.timing(turnIndicatorAnim, {
            toValue: currentPlayer === 1 ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [currentPlayer]);

    // Calculate pieces
    const pieces = useMemo(() => countPieces(board), [board]);

    // Get all legal moves for current player
    const allLegalMoves = useMemo(() => {
        if (gameOver) return [];
        return getAllLegalMoves(board, currentPlayer);
    }, [board, currentPlayer, gameOver]);

    // Pieces that can move (for highlighting)
    const movablePieces = useMemo(() => {
        const pieces = new Set();
        allLegalMoves.forEach(m => pieces.add(`${m.from.r},${m.from.c}`));
        return pieces;
    }, [allLegalMoves]);

    // Handle cell press
    const handleCellPress = useCallback((r, c) => {
        if (gameOver) return;

        const cell = board[r][c];
        const owner = getOwner(cell);

        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        // If clicking on own piece, select it
        if (owner === currentPlayer) {
            const pieceMoves = getLegalMovesForPiece(board, r, c);
            if (pieceMoves.length > 0) {
                setSelectedPiece({ r, c });
                setValidMoves(pieceMoves);
            } else {
                // Can't move this piece
                setSelectedPiece(null);
                setValidMoves([]);
                if (Platform.OS !== 'web') {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                }
            }
            return;
        }

        // If a piece is selected and clicking on a valid destination
        if (selectedPiece) {
            const move = validMoves.find(m => m.to.r === r && m.to.c === c);
            if (move) {
                executeMove(move);
                return;
            }
        }

        // Deselect
        setSelectedPiece(null);
        setValidMoves([]);
    }, [board, currentPlayer, selectedPiece, validMoves, gameOver]);

    // Execute a move
    const executeMove = useCallback((move) => {
        if (Platform.OS !== 'web') {
            if (move.captures.length > 0) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } else {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
        }

        const newBoard = applyMove(board, move);
        
        // Track captures
        if (move.captures.length > 0) {
            if (currentPlayer === 1) {
                setCapturedByP1(prev => prev + move.captures.length);
            } else {
                setCapturedByP2(prev => prev + move.captures.length);
            }
        }

        // Save to history
        setMoveHistory(prev => [...prev, { board: board, player: currentPlayer, move }]);

        // Update board
        setBoard(newBoard);
        setLastMove(move);
        setSelectedPiece(null);
        setValidMoves([]);

        // Check Swar
        const swar = checkSwar(newBoard, move, currentPlayer);
        setSwarPieces(swar);

        // Switch player
        const nextPlayer = currentPlayer === 1 ? 2 : 1;

        // Check game end
        const result = checkGameEnd(newBoard, nextPlayer);
        if (result) {
            setGameOver(result);
            setTimeout(() => {
                navigation.navigate('DamaResult', {
                    winner: result,
                    player1Name,
                    player2Name,
                    capturedByP1: currentPlayer === 1 ? capturedByP1 + move.captures.length : capturedByP1,
                    capturedByP2: currentPlayer === 2 ? capturedByP2 + move.captures.length : capturedByP2,
                    totalMoves: moveHistory.length + 1,
                });
            }, 800);
            return;
        }

        setCurrentPlayer(nextPlayer);
    }, [board, currentPlayer, capturedByP1, capturedByP2, moveHistory, player1Name, player2Name, navigation]);

    // Undo move
    const handleUndo = useCallback(() => {
        if (moveHistory.length === 0) return;
        
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }

        const lastState = moveHistory[moveHistory.length - 1];
        setBoard(lastState.board);
        setCurrentPlayer(lastState.player);
        setMoveHistory(prev => prev.slice(0, -1));
        setSelectedPiece(null);
        setValidMoves([]);
        setLastMove(null);
        setSwarPieces(null);
        setGameOver(null);
        
        // Reverse capture count
        if (lastState.move.captures.length > 0) {
            if (lastState.player === 1) {
                setCapturedByP1(prev => prev - lastState.move.captures.length);
            } else {
                setCapturedByP2(prev => prev - lastState.move.captures.length);
            }
        }
    }, [moveHistory]);

    // Resign
    const handleResign = useCallback(() => {
        const title = isKurdish ? 'وازهێنان' : 'Resign';
        const message = isKurdish 
            ? 'ئایا دڵنیایت لە وازهێنان؟' 
            : 'Are you sure you want to resign?';
        
        Alert.alert(title, message, [
            { text: isKurdish ? 'نەخێر' : 'No', style: 'cancel' },
            { 
                text: isKurdish ? 'بەڵێ' : 'Yes', 
                style: 'destructive',
                onPress: () => {
                    const winner = currentPlayer === 1 ? 2 : 1;
                    navigation.navigate('DamaResult', {
                        winner,
                        player1Name,
                        player2Name,
                        capturedByP1,
                        capturedByP2,
                        totalMoves: moveHistory.length,
                        resigned: true,
                    });
                }
            },
        ]);
    }, [currentPlayer, isKurdish, player1Name, player2Name, capturedByP1, capturedByP2, moveHistory, navigation]);

    // Check if cell is a valid move destination
    const isValidDestination = useCallback((r, c) => {
        return validMoves.some(m => m.to.r === r && m.to.c === c);
    }, [validMoves]);

    // Check if cell will be captured 
    const isCaptureTarget = useCallback((r, c) => {
        return validMoves.some(m => m.captures.some(cap => cap.r === r && cap.c === c));
    }, [validMoves]);

    // Check if cell was part of last move
    const isLastMoveCell = useCallback((r, c) => {
        if (!lastMove) return false;
        return (lastMove.from.r === r && lastMove.from.c === c) || 
               (lastMove.to.r === r && lastMove.to.c === c);
    }, [lastMove]);

    // Check if piece is swar
    const isSwarPiece = useCallback((r, c) => {
        if (!swarPieces) return false;
        return swarPieces.some(p => p.r === r && p.c === c);
    }, [swarPieces]);

    const tc = colors.text.primary;
    const sc = colors.text.muted;

    // Render a single cell
    const renderCell = (r, c) => {
        const cell = board[r][c];
        const owner = getOwner(cell);
        const king = isKing(cell);
        const isSelected = selectedPiece && selectedPiece.r === r && selectedPiece.c === c;
        const isValid = isValidDestination(r, c);
        const isCapture = isCaptureTarget(r, c);
        const isLastMove = isLastMoveCell(r, c);
        const isSwar = isSwarPiece(r, c);
        const isMovable = owner === currentPlayer && movablePieces.has(`${r},${c}`);
        const squareColor = (r + c) % 2 === 0 ? LIGHT_SQUARE : DARK_SQUARE;

        return (
            <TouchableOpacity
                key={`${r}-${c}`}
                activeOpacity={0.7}
                onPress={() => handleCellPress(r, c)}
                style={[
                    st.cell,
                    {
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: squareColor,
                    },
                    isLastMove && { backgroundColor: squareColor },
                ]}
            >
                {/* Last move highlight */}
                {isLastMove && (
                    <View style={[st.cellOverlay, { backgroundColor: LAST_MOVE_COLOR }]} />
                )}

                {/* Selected highlight */}
                {isSelected && (
                    <View style={[st.cellOverlay, { backgroundColor: SELECTED_COLOR }]} />
                )}

                {/* Valid move indicator */}
                {isValid && !owner && (
                    <View style={st.validMoveContainer}>
                        <View style={[st.validMoveDot, { 
                            width: cellSize * 0.3, 
                            height: cellSize * 0.3, 
                            borderRadius: cellSize * 0.15,
                            backgroundColor: VALID_MOVE_COLOR,
                        }]} />
                    </View>
                )}

                {/* Valid move landing on piece (capture destination) */}
                {isValid && owner && (
                    <View style={[st.cellOverlay, { backgroundColor: VALID_MOVE_COLOR }]} />
                )}

                {/* Capture target highlight */}
                {isCapture && owner && !isValid && (
                    <View style={[st.cellOverlay, { backgroundColor: CAPTURE_COLOR }]} />
                )}

                {/* Swar highlight */}
                {isSwar && (
                    <View style={[st.cellOverlay, { backgroundColor: SWAR_COLOR }]} />
                )}

                {/* Piece */}
                {owner > 0 && (
                    <Animated.View style={[
                        st.piece,
                        {
                            width: cellSize * 0.72,
                            height: cellSize * 0.72,
                            borderRadius: cellSize * 0.36,
                            backgroundColor: owner === 1 ? WHITE_PIECE : BLACK_PIECE,
                            borderColor: owner === 1 ? WHITE_PIECE_BORDER : BLACK_PIECE_BORDER,
                            transform: [{ scale: isSelected ? pulseAnim : 1 }],
                        },
                        isMovable && !isSelected && st.movablePiece,
                        king && st.kingPiece,
                    ]}>
                        {/* Piece inner shadow/gradient */}
                        <View style={[
                            st.pieceInner,
                            {
                                width: cellSize * 0.56,
                                height: cellSize * 0.56,
                                borderRadius: cellSize * 0.28,
                                backgroundColor: owner === 1 ? '#FAFAF0' : '#2a2a2a',
                                borderColor: owner === 1 ? 'rgba(139,115,85,0.3)' : 'rgba(100,100,100,0.3)',
                            },
                        ]} />
                        
                        {/* King crown */}
                        {king && (
                            <View style={st.crownContainer}>
                                <Crown 
                                    size={cellSize * 0.3} 
                                    color={KING_CROWN} 
                                    fill={KING_CROWN}
                                />
                            </View>
                        )}

                        {/* Swar indicator */}
                        {isSwar && (
                            <View style={st.swarBadge}>
                                <Text style={st.swarText}>!</Text>
                            </View>
                        )}
                    </Animated.View>
                )}
            </TouchableOpacity>
        );
    };

    // Background color for turn indicator
    const turnBgColor = turnIndicatorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(245, 245, 220, 0.15)', 'rgba(26, 26, 26, 0.15)'],
    });

    return (
        <AnimatedScreen noPadding noTopPadding>
            <View style={st.root}>
                <LinearGradient
                    colors={isDark ? ['#1B0F0A', '#2C1810', '#1B0F0A'] : ['#F5F0EB', '#EDE5DC', '#F5F0EB']}
                    style={StyleSheet.absoluteFill}
                />
                <SafeAreaView style={{ flex: 1 }}>
                    {/* Header */}
                    <View style={st.header}>
                        <BackButton onPress={() => navigation.goBack()} />
                        <Text style={[st.headerTitle, { color: tc }, isKurdish && st.kf]}>
                            {isKurdish ? 'دامە' : 'Dama'}
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            <TouchableOpacity onPress={handleUndo}
                                style={[st.actionBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                                <RotateCcw size={18} color={sc} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleResign}
                                style={[st.actionBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                                <Flag size={18} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Player Info - Top (Player 2 / Black) */}
                    <View style={[st.playerBar, { 
                        backgroundColor: isDark ? 'rgba(26,26,26,0.3)' : 'rgba(26,26,26,0.08)',
                        borderColor: currentPlayer === 2 ? '#DAA520' : 'transparent',
                    }]}>
                        <View style={st.playerBarLeft}>
                            <View style={[st.playerPiece, { backgroundColor: BLACK_PIECE, borderColor: BLACK_PIECE_BORDER }]}>
                                {currentPlayer === 2 && <View style={st.activeDot} />}
                            </View>
                            <View>
                                <Text style={[st.playerName, { color: tc }, isKurdish && st.kf]} numberOfLines={1}>
                                    {player2Name}
                                </Text>
                                <Text style={[st.pieceCount, { color: sc }]}>
                                    {pieces.p2} {isKurdish ? 'پاسە' : 'pieces'} 
                                    {pieces.p2Kings > 0 ? ` (${pieces.p2Kings} ${isKurdish ? 'پاشا' : 'K'})` : ''}
                                </Text>
                            </View>
                        </View>
                        <View style={st.capturedContainer}>
                            <Text style={[st.capturedCount, { color: '#EF4444' }]}>-{capturedByP1}</Text>
                        </View>
                    </View>

                    {/* Turn Indicator */}
                    {!gameOver && (
                        <View style={st.turnIndicator}>
                            <Animated.View style={[st.turnBg, { backgroundColor: turnBgColor }]}>
                                <Swords size={14} color="#DAA520" />
                                <Text style={[st.turnText, { color: tc }, isKurdish && st.kf]}>
                                    {currentPlayer === 1 
                                        ? (isKurdish ? `نۆرەی ${player1Name}` : `${player1Name}'s Turn`)
                                        : (isKurdish ? `نۆرەی ${player2Name}` : `${player2Name}'s Turn`)
                                    }
                                </Text>
                            </Animated.View>
                            {swarPieces && (
                                <View style={st.swarAlert}>
                                    <Text style={[st.swarAlertText, isKurdish && st.kf]}>
                                        {isKurdish ? '⚡ سوار! پێویستە بگریت!' : '⚡ SWAR! Must capture!'}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Game Over Banner */}
                    {gameOver && (
                        <View style={st.gameOverBanner}>
                            <LinearGradient colors={['#DAA520', '#B8860B']} style={st.gameOverGrad}>
                                <Crown size={20} color="#FFF" fill="#FFF" />
                                <Text style={[st.gameOverText, isKurdish && st.kf]}>
                                    {gameOver === 1 
                                        ? (isKurdish ? `${player1Name} بردییەوە!` : `${player1Name} Wins!`)
                                        : (isKurdish ? `${player2Name} بردییەوە!` : `${player2Name} Wins!`)
                                    }
                                </Text>
                            </LinearGradient>
                        </View>
                    )}

                    {/* Board */}
                    <View style={[st.boardContainer, { paddingHorizontal: boardPadding }]}>
                        <View style={[st.board, { 
                            width: actualBoardSize, 
                            height: actualBoardSize,
                        }]}>
                            {/* Board border gradient */}
                            <View style={[st.boardBorder, { 
                                width: actualBoardSize + 8, 
                                height: actualBoardSize + 8,
                            }]}>
                                <LinearGradient 
                                    colors={['#654321', '#8B4513', '#654321']} 
                                    style={StyleSheet.absoluteFill} 
                                    start={{ x: 0, y: 0 }} 
                                    end={{ x: 1, y: 1 }}
                                />
                            </View>
                            
                            {/* Cells */}
                            <View style={st.boardInner}>
                                {Array(8).fill(null).map((_, r) => (
                                    <View key={r} style={st.row}>
                                        {Array(8).fill(null).map((_, c) => renderCell(r, c))}
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Player Info - Bottom (Player 1 / White) */}
                    <View style={[st.playerBar, { 
                        backgroundColor: isDark ? 'rgba(245,245,220,0.08)' : 'rgba(245,245,220,0.3)',
                        borderColor: currentPlayer === 1 ? '#DAA520' : 'transparent',
                    }]}>
                        <View style={st.playerBarLeft}>
                            <View style={[st.playerPiece, { backgroundColor: WHITE_PIECE, borderColor: WHITE_PIECE_BORDER }]}>
                                {currentPlayer === 1 && <View style={st.activeDot} />}
                            </View>
                            <View>
                                <Text style={[st.playerName, { color: tc }, isKurdish && st.kf]} numberOfLines={1}>
                                    {player1Name}
                                </Text>
                                <Text style={[st.pieceCount, { color: sc }]}>
                                    {pieces.p1} {isKurdish ? 'پاسە' : 'pieces'} 
                                    {pieces.p1Kings > 0 ? ` (${pieces.p1Kings} ${isKurdish ? 'پاشا' : 'K'})` : ''}
                                </Text>
                            </View>
                        </View>
                        <View style={st.capturedContainer}>
                            <Text style={[st.capturedCount, { color: '#EF4444' }]}>-{capturedByP2}</Text>
                        </View>
                    </View>

                    {/* Move Count */}
                    <View style={st.moveCounter}>
                        <Text style={[st.moveCountText, { color: sc }]}>
                            {isKurdish ? `جوڵەکان: ${moveHistory.length}` : `Moves: ${moveHistory.length}`}
                        </Text>
                    </View>
                </SafeAreaView>
            </View>
        </AnimatedScreen>
    );
}

const st = StyleSheet.create({
    root: { flex: 1 },
    kf: { fontFamily: 'Rabar' },

    // Header
    header: { 
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 14, paddingVertical: 8 
    },
    backBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 20, fontWeight: '900', letterSpacing: 0.5 },
    actionBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },

    // Player Bar
    playerBar: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        marginHorizontal: 14, marginVertical: 4, paddingHorizontal: 14, paddingVertical: 10,
        borderRadius: 14, borderWidth: 2,
    },
    playerBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
    playerPiece: {
        width: 32, height: 32, borderRadius: 16, borderWidth: 2.5,
        alignItems: 'center', justifyContent: 'center',
    },
    activeDot: {
        width: 10, height: 10, borderRadius: 5, backgroundColor: '#22C55E',
        borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
    },
    playerName: { fontSize: 15, fontWeight: '800', maxWidth: 150 },
    pieceCount: { fontSize: 11, fontWeight: '600', marginTop: 1 },
    capturedContainer: { paddingHorizontal: 8 },
    capturedCount: { fontSize: 16, fontWeight: '900' },

    // Turn Indicator
    turnIndicator: { alignItems: 'center', marginVertical: 4 },
    turnBg: { 
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20,
    },
    turnText: { fontSize: 13, fontWeight: '700' },

    // Swar Alert
    swarAlert: { 
        marginTop: 4, backgroundColor: 'rgba(255,69,0,0.15)', 
        paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8,
    },
    swarAlertText: { color: '#FF4500', fontSize: 12, fontWeight: '800' },

    // Game Over
    gameOverBanner: { marginHorizontal: 14, marginVertical: 4, borderRadius: 14, overflow: 'hidden' },
    gameOverGrad: { 
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
        gap: 8, paddingVertical: 12 
    },
    gameOverText: { color: '#FFF', fontSize: 18, fontWeight: '900' },

    // Board
    boardContainer: { 
        alignItems: 'center', justifyContent: 'center', 
        flex: 1, 
    },
    board: { 
        position: 'relative', alignItems: 'center', justifyContent: 'center',
    },
    boardBorder: {
        position: 'absolute', borderRadius: 6, overflow: 'hidden',
        top: -4, left: -4,
    },
    boardInner: { 
        overflow: 'hidden', borderRadius: 2,
        zIndex: 1,
    },
    row: { flexDirection: 'row' },

    // Cell
    cell: { 
        alignItems: 'center', justifyContent: 'center', position: 'relative',
    },
    cellOverlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
    },

    // Valid move dot
    validMoveContainer: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center', justifyContent: 'center',
        zIndex: 2,
    },
    validMoveDot: {
        opacity: 0.8,
    },

    // Piece
    piece: {
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 2.5,
        zIndex: 3,
        // Shadow for 3D effect
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
    },
    pieceInner: {
        position: 'absolute',
        borderWidth: 1,
    },
    movablePiece: {
        borderColor: '#DAA520',
        borderWidth: 2.5,
    },
    kingPiece: {
        borderWidth: 3,
        borderColor: '#DAA520',
    },

    // Crown
    crownContainer: {
        position: 'absolute',
        zIndex: 4,
    },

    // Swar badge
    swarBadge: {
        position: 'absolute', top: -4, right: -4,
        width: 16, height: 16, borderRadius: 8,
        backgroundColor: '#FF4500',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1.5, borderColor: '#FFF',
        zIndex: 5,
    },
    swarText: { color: '#FFF', fontSize: 10, fontWeight: '900' },

    // Move Counter
    moveCounter: { alignItems: 'center', paddingVertical: 4 },
    moveCountText: { fontSize: 12, fontWeight: '600' },
});
