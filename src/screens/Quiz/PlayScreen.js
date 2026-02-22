import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, User, CheckCircle2, XCircle, ArrowLeft, ArrowRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Button, GradientBackground, GlassCard } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { getRandomQuestions } from '../../constants/quizData';
import { useLanguage } from '../../context/LanguageContext';
import { useGameRoom } from '../../context/GameRoomContext';
import { useAuth } from '../../context/AuthContext';
import { t } from '../../localization/translations';

const { width } = Dimensions.get('window');
const ANSWER_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export default function QuizPlayScreen({ navigation, route }) {
    // Support both single-player and multiplayer
    const { players: contextPlayers, currentRoom, gameState, updateGameState, leaveRoom, isHost } = useGameRoom();
    const { user } = useAuth();
    const { language, isKurdish } = useLanguage();

    const routeParams = route?.params || {};
    const isMultiplayer = !!currentRoom && !routeParams.players;

    // Get players
    const players = isMultiplayer
        ? (contextPlayers?.map(p => p.player?.username || 'Player') || ['Player 1', 'Player 2'])
        : (routeParams.players || ['Player 1', 'Player 2']);

    const category = routeParams.category || 'general';
    const questionCount = routeParams.questionCount || 10;

    // Local state
    const [localQuestions, setLocalQuestions] = useState([]);
    const [localCurrentIndex, setLocalCurrentIndex] = useState(0);
    const [localCurrentPlayerIndex, setLocalCurrentPlayerIndex] = useState(0);
    const [localSelectedAnswer, setLocalSelectedAnswer] = useState(null);
    const [localShowResult, setLocalShowResult] = useState(false);
    const [localScores, setLocalScores] = useState({});
    const [localTimeLeft, setLocalTimeLeft] = useState(15);
    const [localIsAnswered, setLocalIsAnswered] = useState(false);

    const timerRef = useRef(null);
    const progressAnim = useRef(new Animated.Value(1)).current;

    const rowDirection = isKurdish ? 'row-reverse' : 'row';
    const textAlign = isKurdish ? 'right' : 'left';

    // Initialize
    useEffect(() => {
        if (!isMultiplayer) {
            const loadedQuestions = getRandomQuestions(category, questionCount, language);
            setLocalQuestions(loadedQuestions);
            setLocalScores(players.reduce((acc, p) => ({ ...acc, [p]: 0 }), {}));
        }
    }, []);

    // Multiplayer state
    const questions = isMultiplayer
        ? (gameState?.current_question?.questions || [])
        : localQuestions;
    const currentIndex = isMultiplayer
        ? (gameState?.current_question?.question_index || 0)
        : localCurrentIndex;
    const currentPlayerIndex = isMultiplayer
        ? (gameState?.current_question?.player_index || 0)
        : localCurrentPlayerIndex;
    const selectedAnswer = isMultiplayer
        ? gameState?.current_question?.selected_answer
        : localSelectedAnswer;
    const showResult = isMultiplayer
        ? (gameState?.current_question?.show_result || false)
        : localShowResult;
    const scores = isMultiplayer
        ? (gameState?.scores || {})
        : localScores;
    const isAnswered = isMultiplayer
        ? (gameState?.current_question?.is_answered || false)
        : localIsAnswered;

    const myUsername = contextPlayers?.find(p => p.player_id === user?.id)?.player?.username;
    const currentPlayer = players[currentPlayerIndex] || players[0];
    const isMyTurn = isMultiplayer ? (currentPlayer === myUsername) : true;

    // Timer logic (local only - multiplayer just shows what host controls)
    useEffect(() => {
        if (!isMultiplayer && localQuestions.length > 0 && !localIsAnswered) {
            startTimer();
        }
        return () => clearInterval(timerRef.current);
    }, [localCurrentIndex, localQuestions, localIsAnswered, isMultiplayer]);

    const startTimer = () => {
        setLocalTimeLeft(15);
        progressAnim.setValue(1);

        Animated.timing(progressAnim, {
            toValue: 0,
            duration: 15000,
            useNativeDriver: false,
        }).start();

        timerRef.current = setInterval(() => {
            setLocalTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleTimeout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleTimeout = () => {
        setLocalIsAnswered(true);
        setLocalShowResult(true);
    };

    // Sync to database
    const syncGameState = useCallback(async (updates) => {
        if (!isMultiplayer) return;

        await updateGameState({
            current_question: {
                ...gameState?.current_question,
                ...updates,
            },
            scores: updates.scores !== undefined ? updates.scores : (gameState?.scores || {}),
        });
    }, [isMultiplayer, gameState, updateGameState]);

    const handleAnswer = async (index) => {
        if (isAnswered) return;
        if (isMultiplayer && !isMyTurn) return;

        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        clearInterval(timerRef.current);

        const currentQuestion = questions[currentIndex];
        const isCorrect = index === currentQuestion.answer;
        const points = isCorrect ? Math.max(1, localTimeLeft) : 0;

        const newScores = { ...scores };
        if (isCorrect) {
            newScores[currentPlayer] = (newScores[currentPlayer] || 0) + points;
        }

        if (isMultiplayer) {
            await syncGameState({
                selected_answer: index,
                is_answered: true,
                show_result: true,
                scores: newScores,
            });
        } else {
            setLocalSelectedAnswer(index);
            setLocalIsAnswered(true);
            if (isCorrect) {
                setLocalScores(newScores);
            }
            setTimeout(() => setLocalShowResult(true), 500);
        }
    };

    const handleNext = async () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (currentIndex + 1 >= questions.length) {
            // Game over
            if (isMultiplayer) {
                await leaveRoom();
                navigation.replace('Home');
            } else {
                navigation.replace('QuizResult', {
                    players,
                    scores,
                    category,
                    totalQuestions: questions.length,
                });
            }
            return;
        }

        const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;

        if (isMultiplayer) {
            await syncGameState({
                question_index: currentIndex + 1,
                player_index: nextPlayerIndex,
                selected_answer: null,
                is_answered: false,
                show_result: false,
            });
        } else {
            setLocalCurrentPlayerIndex(nextPlayerIndex);
            setLocalCurrentIndex(prev => prev + 1);
            setLocalSelectedAnswer(null);
            setLocalShowResult(false);
            setLocalIsAnswered(false);
            setLocalTimeLeft(15);
        }
    };

    const handleEndGame = async () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        clearInterval(timerRef.current);
        if (isMultiplayer) {
            await leaveRoom();
            navigation.replace('Home');
        } else {
            navigation.popToTop();
        }
    };

    if (questions.length === 0) {
        return (
            <GradientBackground>
                <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color={COLORS.accent.success} />
                    <Text style={[styles.loadingText, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'چاوەڕوان...' : 'Loading...'}
                    </Text>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    const currentQuestion = questions[currentIndex];

    return (
        <GradientBackground>
            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                {/* Header */}
                <View style={[styles.header, { flexDirection: rowDirection }]}>
                    <TouchableOpacity style={styles.exitBtn} onPress={handleEndGame}>
                        <X size={24} color={COLORS.text.secondary} />
                    </TouchableOpacity>
                    <View style={styles.progressInfo}>
                        <Text style={styles.questionNum}>{currentIndex + 1}/{questions.length}</Text>
                    </View>
                    <View style={{ width: 44 }} />
                </View>

                {/* Progress Bar */}
                <View style={[styles.progressBar, isKurdish && { flexDirection: 'row-reverse' }]}>
                    <Animated.View
                        style={[
                            styles.progressFill,
                            {
                                width: progressAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0%', '100%']
                                }),
                                backgroundColor: localTimeLeft <= 5 ? COLORS.accent.danger : COLORS.accent.success
                            }
                        ]}
                    />
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    {/* Current Player */}
                    <GlassCard intensity={20} style={[styles.playerBadge, { flexDirection: rowDirection }]}>
                        <User size={16} color={COLORS.accent.primary} />
                        <Text style={[styles.playerBadgeText, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? `نۆرەی ${currentPlayer}` : `${currentPlayer}'s Turn`}
                        </Text>
                    </GlassCard>

                    {/* Waiting message for non-active players in multiplayer */}
                    {isMultiplayer && !isMyTurn && !showResult && (
                        <GlassCard intensity={30} style={styles.waitingCard}>
                            <ActivityIndicator size="small" color={COLORS.accent.primary} />
                            <Text style={styles.waitingText}>
                                {isKurdish ? `چاوەڕوانی ${currentPlayer}...` : `Waiting for ${currentPlayer}...`}
                            </Text>
                        </GlassCard>
                    )}

                    {/* Question */}
                    <GlassCard intensity={45} style={styles.questionCard}>
                        <Text style={[styles.questionText, isKurdish && styles.kurdishFont]}>
                            {currentQuestion.question}
                        </Text>
                    </GlassCard>

                    {/* Options */}
                    <View style={styles.optionsGrid}>
                        {currentQuestion.options.map((option, index) => {
                            const isSelected = selectedAnswer === index;
                            const isCorrect = index === currentQuestion.answer;
                            const showCorrect = showResult && isCorrect;
                            const showWrong = showResult && isSelected && !isCorrect;

                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleAnswer(index)}
                                    disabled={isAnswered || (isMultiplayer && !isMyTurn)}
                                    activeOpacity={0.8}
                                >
                                    <GlassCard
                                        intensity={25}
                                        style={[
                                            styles.optionCard,
                                            { flexDirection: rowDirection },
                                            { borderColor: ANSWER_COLORS[index] + '40' },
                                            isSelected && { borderColor: ANSWER_COLORS[index], borderWidth: 2, backgroundColor: ANSWER_COLORS[index] + '15' },
                                            showCorrect && styles.optionCorrect,
                                            showWrong && styles.optionWrong,
                                            isMultiplayer && !isMyTurn && !showResult && styles.optionDisabled,
                                        ]}
                                    >
                                        <View style={[styles.optionLabel, { backgroundColor: ANSWER_COLORS[index] }]}>
                                            <Text style={styles.optionLabelText}>
                                                {String.fromCharCode(65 + index)}
                                            </Text>
                                        </View>
                                        <Text style={[styles.optionText, isKurdish && styles.kurdishFont, { textAlign }]}>{option}</Text>
                                        {showCorrect && (
                                            <CheckCircle2 size={24} color={COLORS.accent.success} />
                                        )}
                                        {showWrong && (
                                            <XCircle size={24} color={COLORS.accent.danger} />
                                        )}
                                    </GlassCard>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Result Message */}
                    {showResult && (
                        <GlassCard intensity={30} style={[
                            styles.resultBanner,
                            { flexDirection: rowDirection },
                            selectedAnswer === currentQuestion.answer ? styles.resultCorrect : styles.resultWrong
                        ]}>
                            {selectedAnswer === currentQuestion.answer ?
                                <CheckCircle2 size={24} color={COLORS.accent.success} /> :
                                <XCircle size={24} color={COLORS.accent.danger} />
                            }
                            <Text style={[
                                styles.resultText,
                                isKurdish && styles.kurdishFont,
                                { color: selectedAnswer === currentQuestion.answer ? COLORS.accent.success : COLORS.accent.danger }
                            ]}>
                                {selectedAnswer === currentQuestion.answer
                                    ? (isKurdish ? 'ڕاستە!' : 'Correct!')
                                    : (isKurdish ? 'هەڵەیە!' : 'Wrong!')}
                            </Text>
                        </GlassCard>
                    )}

                    {/* Next Button */}
                    {showResult && (isHost || !isMultiplayer) && (
                        <Button
                            title={currentIndex + 1 >= questions.length
                                ? (isKurdish ? 'تەواوبوو' : 'Finish')
                                : (isKurdish ? 'پرسیاری دواتر' : 'Next Question')}
                            onPress={handleNext}
                            gradient={[COLORS.accent.primary, '#2563eb']}
                            icon={isKurdish ? <ArrowLeft size={20} color="#FFF" /> : <ArrowRight size={20} color="#FFF" />}
                            isKurdish={isKurdish}
                        />
                    )}

                    {showResult && isMultiplayer && !isHost && (
                        <Text style={styles.waitingText}>
                            {isKurdish ? 'چاوەڕوانی خاوەنی ژوور...' : 'Waiting for host...'}
                        </Text>
                    )}

                    {/* Current Scores */}
                    <View style={[styles.scoresBar, { flexDirection: rowDirection }]}>
                        {Object.entries(scores)
                            .sort(([, a], [, b]) => b - a)
                            .map(([name, score]) => (
                                <GlassCard key={name} intensity={20} style={[styles.scoreItem, { flexDirection: rowDirection }]}>
                                    <Text style={[styles.scoreName, isKurdish && styles.kurdishFont]}>{name}</Text>
                                    <Text style={styles.scoreValue}>{score}</Text>
                                </GlassCard>
                            ))
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    loadingText: { color: COLORS.text.secondary, ...FONTS.medium, marginTop: SPACING.md },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
    },
    exitBtn: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: COLORS.background.card,
        alignItems: 'center', justifyContent: 'center',
    },
    progressInfo: {
        backgroundColor: COLORS.background.card,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    questionNum: { color: COLORS.text.secondary, ...FONTS.medium },
    progressBar: {
        height: 4,
        backgroundColor: COLORS.background.secondary,
    },
    progressFill: {
        height: '100%',
    },
    content: {
        padding: SPACING.lg,
        paddingBottom: 100,
    },
    playerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        gap: 8,
        // backgroundColor: 'rgba(59, 130, 246, 0.15)', // Removed, glass card handles it
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
        marginBottom: SPACING.md,
        borderColor: 'rgba(59, 130, 246, 0.3)',
        borderWidth: 1,
    },
    playerBadgeText: { color: COLORS.accent.primary, ...FONTS.medium },
    waitingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.md,
    },
    waitingText: {
        color: COLORS.text.secondary,
        ...FONTS.medium,
        textAlign: 'center',
        marginTop: SPACING.md,
    },
    questionCard: {
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    questionText: {
        color: COLORS.text.primary,
        ...FONTS.title,
        fontSize: 20,
        textAlign: 'center',
        lineHeight: 30,
    },
    optionsGrid: { gap: 12, marginBottom: SPACING.lg },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        borderWidth: 1,
    },
    optionDisabled: {
        opacity: 0.5,
    },
    optionCorrect: {
        backgroundColor: 'rgba(16, 185, 129, 0.25)',
        borderColor: COLORS.accent.success,
        borderWidth: 2,
    },
    optionWrong: {
        backgroundColor: 'rgba(239, 68, 68, 0.25)',
        borderColor: COLORS.accent.danger,
        borderWidth: 2,
    },
    optionLabel: {
        width: 36, height: 36, borderRadius: 8,
        alignItems: 'center', justifyContent: 'center',
    },
    optionLabelText: { color: '#FFF', ...FONTS.bold },
    optionText: { flex: 1, color: COLORS.text.primary, ...FONTS.medium },
    resultBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    resultCorrect: { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: COLORS.accent.success },
    resultWrong: { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: COLORS.accent.danger },
    resultText: { ...FONTS.medium },
    scoresBar: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: SPACING.lg,
        justifyContent: 'center',
    },
    scoreItem: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        flexDirection: 'row',
        gap: 8,
    },
    scoreName: { color: COLORS.text.secondary, ...FONTS.medium, fontSize: 13 },
    scoreValue: { color: COLORS.accent.success, ...FONTS.bold, fontSize: 13 },
    kurdishFont: { fontFamily: 'Rabar' },
});
