import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Paintbrush, Clock, Trash2, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Button, GradientBackground, GlassCard } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { getRandomWord } from '../../constants/drawingData';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useGameRoom } from '../../context/GameRoomContext';
import { useAuth } from '../../context/AuthContext';
import { t } from '../../localization/translations';

const { width } = Dimensions.get('window');
const CANVAS_SIZE = width - 48;

const DRAW_COLORS = ['#FFFFFF', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#000000'];

export default function DrawGuessPlayScreen({ navigation, route }) {
    // Multiplayer context
    const { players: contextPlayers, currentRoom, gameState, updateGameState, leaveRoom, isHost } = useGameRoom();
    const { user } = useAuth();
    const { language, isKurdish } = useLanguage();
    const { colors, isRTL } = useTheme();

    // Determine mode
    const routeParams = route?.params || {};
    const isMultiplayer = !!currentRoom && !routeParams.players;

    // Get players list
    const players = isMultiplayer
        ? (contextPlayers?.map(p => p.player?.username || 'Player') || ['Player 1', 'Player 2'])
        : (routeParams.players || ['Player 1', 'Player 2']);

    const category = routeParams.category || gameState?.state?.category || 'general';
    const roundTime = routeParams.roundTime || gameState?.state?.roundTime || 60;

    const rowDirection = isKurdish ? 'row-reverse' : 'row';
    const textAlign = isKurdish ? 'right' : 'left';

    // Local game state
    const [phase, setPhase] = useState('reveal'); // 'reveal', 'drawing', 'result'
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [currentWord, setCurrentWord] = useState('');
    const [paths, setPaths] = useState([]);
    const [currentPath, setCurrentPath] = useState([]);
    const [currentColor, setCurrentColor] = useState('#FFFFFF');
    const [timeLeft, setTimeLeft] = useState(roundTime);
    const [scores, setScores] = useState(players.reduce((acc, p) => ({ ...acc, [p]: 0 }), {}));
    const [roundNumber, setRoundNumber] = useState(1);

    const timerRef = useRef(null);

    // Multiplayer sync for scores
    const syncScores = useCallback(async (newScores) => {
        if (!isMultiplayer) return;
        await updateGameState({
            scores: newScores,
            current_question: {
                ...gameState?.current_question,
                round: roundNumber,
                player_index: currentPlayerIndex,
            },
        });
    }, [isMultiplayer, gameState, updateGameState, roundNumber, currentPlayerIndex]);

    useEffect(() => {
        if (phase === 'reveal') {
            setCurrentWord(getRandomWord(category, language));
        }
    }, [currentPlayerIndex, phase, language]);

    useEffect(() => {
        if (phase === 'drawing') {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        setPhase('result');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [phase]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (e) => {
                const { locationX, locationY } = e.nativeEvent;
                setCurrentPath([`M${locationX},${locationY}`]);
            },
            onPanResponderMove: (e) => {
                const { locationX, locationY } = e.nativeEvent;
                setCurrentPath((prev) => [...prev, `L${locationX},${locationY}`]);
            },
            onPanResponderRelease: () => {
                if (currentPath.length > 0) {
                    setPaths((prev) => [...prev, { d: currentPath.join(' '), color: currentColor }]);
                    setCurrentPath([]);
                }
            },
        })
    ).current;

    const handleStartDrawing = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setPhase('drawing');
        setTimeLeft(roundTime);
        setPaths([]);
    };

    const handleGuessed = async (correct) => {
        if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        clearInterval(timerRef.current);
        const newScores = { ...scores };
        if (correct) {
            newScores[players[currentPlayerIndex]] = (newScores[players[currentPlayerIndex]] || 0) + 1;
            setScores(newScores);
        }
        if (isMultiplayer) {
            await syncScores(newScores);
        }
        setPhase('result');
    };

    const handleNext = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const nextIndex = (currentPlayerIndex + 1) % players.length;
        if (nextIndex === 0) {
            setRoundNumber(prev => prev + 1);
        }
        setCurrentPlayerIndex(nextIndex);
        setPhase('reveal');
        setPaths([]);
        setCurrentPath([]);
    };

    const handleEndGame = async () => {
        if (isMultiplayer) {
            await leaveRoom();
        }
        navigation.replace('DrawGuessResult', {
            players,
            scores,
            rounds: roundNumber,
        });
    };

    const clearCanvas = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setPaths([]);
    };

    const currentPlayer = players[currentPlayerIndex];

    // ========================
    // REVEAL PHASE
    // ========================
    if (phase === 'reveal') {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                    <ScrollView contentContainerStyle={styles.centerContent}>
                        <View style={styles.badge}>
                            <Text style={[styles.badgeText, isKurdish && styles.kurdishFont]}>
                                {t('common.round', language)} {roundNumber}
                            </Text>
                        </View>

                        <Text style={[styles.label, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                            {t('common.passPhoneTo', language)}
                        </Text>
                        <Text style={[styles.playerName, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>{currentPlayer}</Text>

                        <GlassCard intensity={30} style={[styles.wordCard, { borderColor: colors.brand.info }]}>
                            <Text style={[styles.wordLabel, { color: colors.brand.info }, isKurdish && styles.kurdishFont]}>
                                {t('common.yourWord', language)}
                            </Text>
                            <Text style={[styles.wordText, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>{currentWord}</Text>
                        </GlassCard>

                        <Text style={[styles.instruction, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                            {isKurdish
                                ? `ڕێگەمەدە کەسەکانی‌تر بیبینن!\nتۆ ${roundTime} چرکەت هەیە بۆ وێنەکێشان.`
                                : `Don't let others see!\nYou have ${roundTime} seconds to draw.`
                            }
                        </Text>

                        <Button
                            title={t('drawGuess.draw', language)}
                            onPress={handleStartDrawing}
                            gradient={[colors.brand.info, colors.brand.info]}
                            icon={<Paintbrush size={20} color="#FFF" />}
                            isKurdish={isKurdish}
                        />
                    </ScrollView>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    // ========================
    // DRAWING PHASE
    // ========================
    if (phase === 'drawing') {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                    {/* Header */}
                    <View style={[styles.drawHeader, { flexDirection: rowDirection }]}>
                        <View style={[styles.timerBadge, { backgroundColor: colors.surface }, { flexDirection: rowDirection }]}>
                            <Clock
                                size={18}
                                color={timeLeft <= 10 ? colors.brand.error : colors.text.primary}
                            />
                            <Text style={[
                                styles.timerText,
                                { color: colors.text.primary },
                                timeLeft <= 10 && [styles.timerDanger, { color: colors.brand.error }]
                            ]}>{timeLeft}{isKurdish ? 'چ' : 's'}</Text>
                        </View>

                        <TouchableOpacity style={[styles.clearBtn, { backgroundColor: colors.surface }]} onPress={clearCanvas}>
                            <Trash2 size={20} color={colors.brand.error} />
                        </TouchableOpacity>
                    </View>

                    {/* Canvas */}
                    <View style={styles.canvasContainer} {...panResponder.panHandlers}>
                        <Svg width={CANVAS_SIZE} height={CANVAS_SIZE}>
                            {paths.map((path, index) => (
                                <Path
                                    key={index}
                                    d={path.d}
                                    stroke={path.color}
                                    strokeWidth={4}
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            ))}
                            {currentPath.length > 0 && (
                                <Path
                                    d={currentPath.join(' ')}
                                    stroke={currentColor}
                                    strokeWidth={4}
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            )}
                        </Svg>
                    </View>

                    {/* Color Picker */}
                    <View style={[styles.colorPicker, { flexDirection: rowDirection }]}>
                        {DRAW_COLORS.map((color) => (
                            <TouchableOpacity
                                key={color}
                                style={[
                                    styles.colorBtn,
                                    { backgroundColor: color },
                                    currentColor === color && styles.colorBtnSelected
                                ]}
                                onPress={() => setCurrentColor(color)}
                            />
                        ))}
                    </View>

                    {/* Actions */}
                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={[
                                styles.guessBtn,
                                { backgroundColor: colors.brand.success + '15', borderColor: colors.brand.success },
                                { flexDirection: rowDirection }
                            ]}
                            onPress={() => handleGuessed(true)}
                        >
                            <CheckCircle2 size={24} color={colors.brand.success} />
                            <Text style={[styles.guessBtnText, { color: colors.brand.success }, isKurdish && styles.kurdishFont]}>
                                {t('drawGuess.someoneGuessed', language)}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    // ========================
    // RESULT PHASE
    // ========================
    if (phase === 'result') {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                    <ScrollView contentContainerStyle={styles.centerContent}>
                        <View style={styles.resultBanner}>
                            <Paintbrush size={48} color={colors.brand.info} />
                            <Text style={[styles.resultTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                                {t('drawGuess.roundComplete', language)}
                            </Text>
                            <Text style={[styles.wordReveal, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                                {t('drawGuess.theWordWas', language)}
                                <Text style={[styles.wordHighlight, { color: colors.brand.info }]}>{currentWord}</Text>
                            </Text>
                        </View>

                        {/* Scores */}
                        <GlassCard intensity={20} style={styles.scoresCard}>
                            <Text style={[styles.scoresTitle, { color: colors.text.muted }, isKurdish && styles.kurdishFont, { textAlign }]}>
                                {isKurdish ? 'خاڵەکانی ئێستا' : 'Current Scores'}
                            </Text>
                            {Object.entries(scores)
                                .sort(([, a], [, b]) => b - a)
                                .map(([name, score]) => (
                                    <View key={name} style={[styles.scoreRow, { borderBottomColor: colors.border, flexDirection: rowDirection }]}>
                                        <Text style={[styles.scoreName, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>{name}</Text>
                                        <Text style={[styles.scoreValue, { color: colors.brand.success }]}>{score}</Text>
                                    </View>
                                ))
                            }
                        </GlassCard>

                        <View style={styles.actionButtons}>
                            <Button
                                title={t('drawGuess.nextRound', language)}
                                onPress={handleNext}
                                gradient={[colors.brand.info, colors.brand.info]}
                                icon={isRTL ? <ArrowLeft size={20} color="#FFF" /> : <ArrowRight size={20} color="#FFF" />}
                                style={{ marginBottom: SPACING.md }}
                                isKurdish={isKurdish}
                            />
                            <TouchableOpacity style={styles.endGameBtn} onPress={handleEndGame}>
                                <Text style={[styles.endGameText, { color: colors.brand.error }, isKurdish && styles.kurdishFont]}>
                                    {t('drawGuess.endGameResults', language)}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    centerContent: {
        flexGrow: 1,
        alignItems: 'center',
        padding: SPACING.xl,
        justifyContent: 'center',
        paddingBottom: 100,
    },
    badge: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 100,
        marginBottom: 32
    },
    badgeText: { ...FONTS.medium, fontSize: 13 },
    label: { ...FONTS.medium, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
    playerName: { ...FONTS.large, fontSize: 36, marginBottom: 32, textAlign: 'center' },
    wordCard: {
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        alignItems: 'center',
    },
    wordLabel: { ...FONTS.medium, marginBottom: 8 },
    wordText: { ...FONTS.large, fontSize: 32 },
    instruction: { textAlign: 'center', marginBottom: 32, lineHeight: 24 },

    // Drawing Phase
    drawHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
    },
    timerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    timerText: { ...FONTS.bold, fontSize: 18 },
    timerDanger: {},
    clearBtn: {
        width: 44, height: 44, borderRadius: 22,
        alignItems: 'center', justifyContent: 'center',
    },
    canvasContainer: {
        width: CANVAS_SIZE,
        height: CANVAS_SIZE,
        backgroundColor: 'rgba(255,255,255,0.05)', // Semi-transparent for glass effect
        borderRadius: BORDER_RADIUS.lg,
        alignSelf: 'center',
        marginVertical: SPACING.md,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    colorPicker: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        paddingVertical: SPACING.md,
    },
    colorBtn: {
        width: 36, height: 36, borderRadius: 18,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    colorBtnSelected: {
        borderColor: '#FFF',
        transform: [{ scale: 1.2 }],
    },
    actionRow: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.lg,
    },
    guessBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 2,
    },
    guessBtnText: { ...FONTS.medium },

    // Result Phase
    resultBanner: {
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    resultTitle: { ...FONTS.large, marginTop: SPACING.md },
    wordReveal: { marginTop: 8 },
    wordHighlight: { ...FONTS.bold },
    scoresCard: {
        width: '100%',
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
    },
    scoresTitle: { fontSize: 12, textTransform: 'uppercase', marginBottom: SPACING.md },
    scoreRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
    },
    scoreName: { ...FONTS.medium },
    scoreValue: { ...FONTS.bold },
    actionButtons: { width: '100%' },
    endGameBtn: { alignSelf: 'center', padding: SPACING.sm },
    endGameText: { ...FONTS.medium },
    kurdishFont: { fontFamily: 'Rabar' },
});
