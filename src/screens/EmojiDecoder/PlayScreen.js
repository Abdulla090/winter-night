import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet, View, Text, TouchableOpacity, TextInput,
    Animated, Keyboard, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { GradientBackground, GlassCard, Button } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../localization/translations';
import { getPuzzles, getCategoryById } from '../../constants/emojiPuzzles';

const TIMER_DURATION = 30; // seconds per puzzle

export default function EmojiDecoderPlayScreen({ navigation, route }) {
    const { category } = route.params;
    const { language, isKurdish } = useLanguage();
    const rowDirection = isKurdish ? 'row-reverse' : 'row';

    // Game State
    const [puzzles, setPuzzles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [revealed, setRevealed] = useState(false);

    const timerRef = useRef(null);
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const inputRef = useRef(null);

    // Initialize puzzles
    useEffect(() => {
        const loadedPuzzles = getPuzzles(category.id, language);
        setPuzzles(loadedPuzzles.slice(0, 10)); // 10 puzzles per game
    }, [category, language]);

    // Timer
    useEffect(() => {
        if (puzzles.length > 0 && !showResult && !gameOver) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        handleTimeUp();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [currentIndex, puzzles, showResult, gameOver]);

    const handleTimeUp = () => {
        setShowResult(true);
        setIsCorrect(false);
        setRevealed(true);
    };

    const checkAnswer = () => {
        if (!userAnswer.trim()) return;

        Keyboard.dismiss();
        clearInterval(timerRef.current);

        const currentPuzzle = puzzles[currentIndex];
        const correctAnswer = currentPuzzle.answer[language].toLowerCase();
        const userInput = userAnswer.trim().toLowerCase();

        // Check if answer is close enough (contains main keywords)
        const isMatch = correctAnswer.includes(userInput) ||
            userInput.includes(correctAnswer.split(' ')[0]) ||
            userInput === correctAnswer;

        if (isMatch) {
            setIsCorrect(true);
            setScore(prev => prev + (timeLeft * 10)); // Bonus for speed
            // Success animation
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
                Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
            ]).start();
        } else {
            setIsCorrect(false);
            // Shake animation for wrong answer
            Animated.sequence([
                Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
            ]).start();
        }

        setShowResult(true);
        setRevealed(true);
    };

    const handleNext = () => {
        if (currentIndex + 1 >= puzzles.length) {
            setGameOver(true);
        } else {
            setCurrentIndex(prev => prev + 1);
            setUserAnswer('');
            setShowResult(false);
            setIsCorrect(false);
            setRevealed(false);
            setTimeLeft(TIMER_DURATION);
        }
    };

    const handleSkip = () => {
        clearInterval(timerRef.current);
        setShowResult(true);
        setIsCorrect(false);
        setRevealed(true);
    };

    const handlePlayAgain = () => {
        const loadedPuzzles = getPuzzles(category.id, language);
        setPuzzles(loadedPuzzles.slice(0, 10));
        setCurrentIndex(0);
        setScore(0);
        setUserAnswer('');
        setShowResult(false);
        setIsCorrect(false);
        setRevealed(false);
        setGameOver(false);
        setTimeLeft(TIMER_DURATION);
    };

    if (puzzles.length === 0) {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Loading...</Text>
                    </View>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    const currentPuzzle = puzzles[currentIndex];

    // ========================
    // GAME OVER SCREEN
    // ========================
    if (gameOver) {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.safeArea} edges={['top']}>
                    <MotiView
                        from={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: 'timing', duration: 300 }}
                        style={styles.gameOverContainer}
                    >
                        <Text style={styles.gameOverEmoji}>🏆</Text>
                        <Text style={[styles.gameOverTitle, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'یاری تەواو بوو!' : 'Game Complete!'}
                        </Text>
                        <Text style={styles.finalScore}>{score}</Text>
                        <Text style={[styles.finalScoreLabel, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'خاڵ' : 'Points'}
                        </Text>

                        <View style={styles.gameOverButtons}>
                            <Button
                                title={isKurdish ? 'دووبارە بیکەوە' : 'Play Again'}
                                onPress={handlePlayAgain}
                                gradient={[category.color, category.color]}
                                icon={<Ionicons name="refresh" size={20} color="#FFF" />}
                                isKurdish={isKurdish}
                            />
                            <TouchableOpacity
                                style={styles.homeBtn}
                                onPress={() => navigation.goBack()}
                            >
                                <Text style={[styles.homeBtnText, isKurdish && styles.kurdishFont]}>
                                    {isKurdish ? 'گەڕانەوە' : 'Back to Menu'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </MotiView>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    // ========================
    // MAIN GAME SCREEN
    // ========================
    return (
        <GradientBackground>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    {/* Header */}
                    <View style={[styles.header, { flexDirection: rowDirection }]}>
                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="close" size={24} color={COLORS.text.primary} />
                        </TouchableOpacity>

                        <View style={styles.progressBadge}>
                            <Text style={styles.progressText}>
                                {currentIndex + 1}/{puzzles.length}
                            </Text>
                        </View>

                        <View style={[styles.scoreBadge, { backgroundColor: category.color + '30' }]}>
                            <Ionicons name="star" size={16} color={category.color} />
                            <Text style={[styles.scoreText, { color: category.color }]}>{score}</Text>
                        </View>
                    </View>

                    {/* Timer */}
                    <View style={styles.timerContainer}>
                        <View style={[
                            styles.timerBar,
                            { width: `${(timeLeft / TIMER_DURATION) * 100}%` },
                            timeLeft <= 10 && { backgroundColor: COLORS.accent.danger }
                        ]} />
                    </View>

                    {/* Puzzle Card */}
                    <View style={styles.puzzleContainer}>
                        <Animated.View style={{ transform: [{ translateX: shakeAnim }, { scale: scaleAnim }] }}>
                            <GlassCard intensity={40} style={styles.puzzleCard}>
                                <Text style={[styles.categoryLabel, { color: category.color }]}>
                                    {category.icon} {category.title[language]}
                                </Text>

                                <Text style={styles.emojiDisplay}>
                                    {currentPuzzle.emojis}
                                </Text>

                                {revealed && (
                                    <MotiView
                                        from={{ opacity: 0, translateY: 10 }}
                                        animate={{ opacity: 1, translateY: 0 }}
                                    >
                                        <View style={[
                                            styles.resultBadge,
                                            { backgroundColor: isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)' }
                                        ]}>
                                            <Ionicons
                                                name={isCorrect ? "checkmark-circle" : "close-circle"}
                                                size={24}
                                                color={isCorrect ? COLORS.accent.success : COLORS.accent.danger}
                                            />
                                            <Text style={[
                                                styles.resultText,
                                                { color: isCorrect ? COLORS.accent.success : COLORS.accent.danger },
                                                isKurdish && styles.kurdishFont
                                            ]}>
                                                {isCorrect
                                                    ? (isKurdish ? 'ڕاستە!' : 'Correct!')
                                                    : (isKurdish ? 'هەڵەیە!' : 'Wrong!')}
                                            </Text>
                                        </View>
                                        <Text style={[styles.correctAnswer, isKurdish && styles.kurdishFont]}>
                                            {currentPuzzle.answer[language]}
                                        </Text>
                                    </MotiView>
                                )}
                            </GlassCard>
                        </Animated.View>
                    </View>

                    {/* Input Area */}
                    {!showResult ? (
                        <View style={styles.inputContainer}>
                            <TextInput
                                ref={inputRef}
                                style={[styles.input, isKurdish && styles.kurdishFont]}
                                value={userAnswer}
                                onChangeText={setUserAnswer}
                                placeholder={isKurdish ? 'وەڵامەکەت بنووسە...' : 'Type your answer...'}
                                placeholderTextColor={COLORS.text.muted}
                                autoCapitalize="none"
                                autoCorrect={false}
                                returnKeyType="done"
                                onSubmitEditing={checkAnswer}
                            />
                            <View style={[styles.buttonRow, { flexDirection: rowDirection }]}>
                                <TouchableOpacity
                                    style={styles.skipBtn}
                                    onPress={handleSkip}
                                >
                                    <Text style={[styles.skipBtnText, isKurdish && styles.kurdishFont]}>
                                        {isKurdish ? 'تێپەڕێنە' : 'Skip'}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.submitBtn, { backgroundColor: category.color }]}
                                    onPress={checkAnswer}
                                >
                                    <Text style={[styles.submitBtnText, isKurdish && styles.kurdishFont]}>
                                        {isKurdish ? 'بیسەلمێنە' : 'Submit'}
                                    </Text>
                                    <Ionicons name="checkmark" size={20} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.inputContainer}>
                            <Button
                                title={currentIndex + 1 >= puzzles.length
                                    ? (isKurdish ? 'ئەنجامەکان ببینە' : 'See Results')
                                    : (isKurdish ? 'دواتر' : 'Next')}
                                onPress={handleNext}
                                gradient={[category.color, category.color]}
                                icon={<Ionicons name={isKurdish ? "arrow-back" : "arrow-forward"} size={20} color="#FFF" />}
                                isKurdish={isKurdish}
                            />
                        </View>
                    )}
                </KeyboardAvoidingView>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    loadingText: { color: COLORS.text.muted },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.md,
    },
    backBtn: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: COLORS.background.card,
        alignItems: 'center', justifyContent: 'center',
    },
    progressBadge: {
        backgroundColor: COLORS.background.card,
        paddingVertical: 6, paddingHorizontal: 12,
        borderRadius: 20,
    },
    progressText: { color: COLORS.text.secondary, ...FONTS.medium },
    scoreBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingVertical: 6, paddingHorizontal: 12,
        borderRadius: 20,
    },
    scoreText: { ...FONTS.bold, fontSize: 16 },

    timerContainer: {
        height: 4,
        backgroundColor: COLORS.background.secondary,
        marginHorizontal: SPACING.md,
        borderRadius: 2,
        overflow: 'hidden',
    },
    timerBar: {
        height: '100%',
        backgroundColor: COLORS.accent.success,
        borderRadius: 2,
    },

    puzzleContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: SPACING.lg,
    },
    puzzleCard: {
        padding: SPACING.xl,
        borderRadius: BORDER_RADIUS.xl,
        alignItems: 'center',
    },
    categoryLabel: {
        ...FONTS.medium,
        fontSize: 14,
        marginBottom: SPACING.md,
    },
    emojiDisplay: {
        fontSize: 64,
        textAlign: 'center',
        marginVertical: SPACING.lg,
    },
    resultBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8, paddingHorizontal: 16,
        borderRadius: 20,
        marginTop: SPACING.md,
        alignSelf: 'center',
    },
    resultText: { ...FONTS.medium },
    correctAnswer: {
        color: COLORS.text.primary,
        ...FONTS.title,
        fontSize: 24,
        textAlign: 'center',
        marginTop: SPACING.md,
    },

    inputContainer: {
        padding: SPACING.lg,
        paddingBottom: SPACING.xl,
    },
    input: {
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        color: COLORS.text.primary,
        ...FONTS.medium,
        fontSize: 18,
        textAlign: 'center',
        borderWidth: 2,
        borderColor: COLORS.background.border,
        marginBottom: SPACING.md,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    skipBtn: {
        flex: 1,
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        alignItems: 'center',
    },
    skipBtnText: { color: COLORS.text.muted, ...FONTS.medium },
    submitBtn: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center', justifyContent: 'center',
        gap: 8,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
    },
    submitBtnText: { color: '#FFF', ...FONTS.medium, fontSize: 16 },

    // Game Over
    gameOverContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.xl,
    },
    gameOverEmoji: { fontSize: 80, marginBottom: SPACING.lg },
    gameOverTitle: {
        color: COLORS.text.primary,
        ...FONTS.large,
        marginBottom: SPACING.md,
    },
    finalScore: {
        color: COLORS.accent.primary,
        fontSize: 72,
        fontWeight: '900',
    },
    finalScoreLabel: {
        color: COLORS.text.muted,
        ...FONTS.medium,
        marginBottom: SPACING.xl,
    },
    gameOverButtons: {
        width: '100%',
        gap: SPACING.md,
    },
    homeBtn: {
        alignSelf: 'center',
        padding: SPACING.md,
    },
    homeBtnText: {
        color: COLORS.text.muted,
        ...FONTS.medium,
    },

    kurdishFont: { fontFamily: 'Rabar' },
});
