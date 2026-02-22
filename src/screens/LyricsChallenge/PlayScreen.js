import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet, View, Text, TouchableOpacity, Animated, TextInput,
    KeyboardAvoidingView, Platform, Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, Music, Lightbulb, X, Check, Eye } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { MotiView, AnimatePresence } from 'moti';
import { GradientBackground, GlassCard, Button } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { getLyrics } from '../../constants/lyricsData';

export default function LyricsChallengePlayScreen({ navigation, route }) {
    const { category } = route.params;
    const { language, isKurdish } = useLanguage();
    const rowDirection = isKurdish ? 'row-reverse' : 'row';

    // Game State
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [revealAnswer, setRevealAnswer] = useState(false);
    const [score, setScore] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    // Animation refs
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const loadedQuestions = getLyrics(category.id, language);
        setQuestions(loadedQuestions.slice(0, 10)); // 10 rounds
    }, [category, language]);

    const handleReveal = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setRevealAnswer(true);
    };

    const handleNext = (correct) => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (correct) {
            setScore(prev => prev + 1);
            // Pulse animation
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
                Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
            ]).start();
        }

        if (currentIndex + 1 >= questions.length) {
            setGameOver(true);
        } else {
            setCurrentIndex(prev => prev + 1);
            setRevealAnswer(false);
            setShowHint(false);
        }
    };

    const handleRestart = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setQuestions(questions.sort(() => Math.random() - 0.5));
        setCurrentIndex(0);
        setScore(0);
        setGameOver(false);
        setRevealAnswer(false);
        setShowHint(false);
    };

    if (questions.length === 0) return null;

    const currentQuestion = questions[currentIndex];

    // ========================
    // GAME OVER
    // ========================
    if (gameOver) {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.safeArea}>
                    <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={styles.gameOverContainer}
                    >
                        <Text style={styles.gameOverEmoji}>🎵</Text>
                        <Text style={[styles.gameOverTitle, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'پێشبڕکێ تەواو بوو!' : 'Challenge Complete!'}
                        </Text>

                        <View style={styles.scoreContainer}>
                            <Text style={styles.finalScore}>{score}</Text>
                            <Text style={[styles.scoreLabel, isKurdish && styles.kurdishFont]}>
                                {isKurdish ? 'لە ١٠' : 'out of 10'}
                            </Text>
                        </View>

                        <Text style={[styles.feedbackText, isKurdish && styles.kurdishFont]}>
                            {score === 10 ? (isKurdish ? 'تۆ ئەفسانەیت! 🌟' : 'You are a Legend! 🌟') :
                                score > 7 ? (isKurdish ? 'نایابە! 🔥' : 'Amazing! 🔥') :
                                    score > 4 ? (isKurdish ? 'باشە! 👍' : 'Good job! 👍') :
                                        (isKurdish ? 'هەوڵ بدەرەوە! 😅' : 'Try again! 😅')}
                        </Text>

                        <View style={styles.gameOverButtons}>
                            <Button
                                title={isKurdish ? 'دووبارە یاری بکە' : 'Play Again'}
                                onPress={handleRestart}
                                gradient={[category.color, category.color]}
                            />
                            <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.goBack()}>
                                <Text style={[styles.menuBtnText, isKurdish && styles.kurdishFont]}>
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
    // PLAYING
    // ========================
    return (
        <GradientBackground>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Header */}
                <View style={[styles.header, { flexDirection: rowDirection }]}>
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <X size={24} color={COLORS.text.primary} />
                    </TouchableOpacity>

                    <View style={styles.progressPill}>
                        <Text style={styles.progressText}>{currentIndex + 1} / {questions.length}</Text>
                    </View>

                    <Animated.View style={[styles.scoreBadge, { transform: [{ scale: scaleAnim }] }]}>
                        <Star size={16} color="#f59e0b" fill="#f59e0b" />
                        <Text style={styles.scoreText}>{score}</Text>
                    </Animated.View>
                </View>

                <View style={styles.content}>
                    {/* Lyrics Card */}
                    <GlassCard intensity={40} style={styles.lyricsCard}>
                        <View style={styles.musicIcon}>
                            <Music size={32} color={category.color} />
                        </View>

                        <Text style={[styles.lyricsText, isKurdish && styles.kurdishFont]}>
                            "{currentQuestion.lyrics}"
                        </Text>

                        {!revealAnswer && (
                            <TouchableOpacity
                                style={styles.hintBtn}
                                onPress={() => setShowHint(true)}
                            >
                                <Lightbulb size={16} color={COLORS.text.secondary} />
                                <Text style={[styles.hintText, isKurdish && styles.kurdishFont]}>
                                    {showHint ? currentQuestion.hint : (isKurdish ? 'یارمەتی' : 'Show Hint')}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </GlassCard>

                    {/* Answer Reveal Section */}
                    <AnimatePresence>
                        {revealAnswer ? (
                            <MotiView
                                from={{ opacity: 0, translateY: 20 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                style={styles.answerContainer}
                            >
                                <Text style={[styles.answerLabel, isKurdish && styles.kurdishFont]}>
                                    {isKurdish ? 'وەڵام:' : 'ANSWER:'}
                                </Text>
                                <GlassCard intensity={20} style={styles.answerCard}>
                                    <Text style={[styles.answerText, isKurdish && styles.kurdishFont]}>
                                        {currentQuestion.answer}
                                    </Text>
                                </GlassCard>

                                <Text style={[styles.questionText, isKurdish && styles.kurdishFont]}>
                                    {isKurdish ? 'تۆ زانیت؟' : 'Did you get it right?'}
                                </Text>

                                <View style={styles.actionButtons}>
                                    <TouchableOpacity
                                        style={[styles.actionBtn, styles.wrongBtn]}
                                        onPress={() => handleNext(false)}
                                    >
                                        <X size={32} color="#FFF" />
                                        <Text style={[styles.btnLabel, isKurdish && styles.kurdishFont]}>
                                            {isKurdish ? 'نەخێر' : 'No'}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.actionBtn, styles.correctBtn]}
                                        onPress={() => handleNext(true)}
                                    >
                                        <Check size={32} color="#FFF" />
                                        <Text style={[styles.btnLabel, isKurdish && styles.kurdishFont]}>
                                            {isKurdish ? 'بەڵێ' : 'Yes'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </MotiView>
                        ) : (
                            <View style={styles.revealContainer}>
                                <Button
                                    title={isKurdish ? 'وەڵامەکە پیشان بدە' : 'Reveal Answer'}
                                    onPress={handleReveal}
                                    gradient={[category.color, category.color]}
                                    icon={<Eye size={20} color="#FFF" />}
                                    isKurdish={isKurdish}
                                />
                            </View>
                        )}
                    </AnimatePresence>
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
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
    progressPill: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20,
    },
    progressText: { color: COLORS.text.secondary, ...FONTS.medium },
    scoreBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20,
    },
    scoreText: { color: '#FFF', ...FONTS.bold, fontSize: 16 },

    content: {
        flex: 1,
        padding: SPACING.lg,
        justifyContent: 'center',
        paddingBottom: 80,
    },
    lyricsCard: {
        padding: SPACING.xl,
        borderRadius: BORDER_RADIUS.xl,
        alignItems: 'center',
        minHeight: 250,
        justifyContent: 'center',
    },
    musicIcon: {
        marginBottom: SPACING.lg,
        opacity: 0.8,
    },
    lyricsText: {
        color: COLORS.text.primary,
        fontSize: 26,
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: 36,
        fontStyle: 'italic',
    },
    hintBtn: {
        marginTop: SPACING.xl,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        padding: SPACING.sm,
    },
    hintText: {
        color: COLORS.text.secondary,
        fontSize: 14,
    },

    // Answer Reveal
    answerContainer: {
        marginTop: SPACING.xl,
        width: '100%',
        alignItems: 'center',
    },
    answerLabel: {
        color: COLORS.text.secondary,
        fontSize: 12,
        letterSpacing: 1.5,
        marginBottom: SPACING.sm,
    },
    answerCard: {
        width: '100%',
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        alignItems: 'center',
        backgroundColor: COLORS.accent.success + '10',
    },
    answerText: {
        color: COLORS.accent.success,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    questionText: {
        color: COLORS.text.primary,
        fontSize: 16,
        marginTop: SPACING.lg,
        marginBottom: SPACING.lg,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: SPACING.lg,
        width: '100%',
    },
    actionBtn: {
        flex: 1,
        height: 80,
        borderRadius: BORDER_RADIUS.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    wrongBtn: { backgroundColor: COLORS.accent.danger },
    correctBtn: { backgroundColor: COLORS.accent.success },
    btnLabel: {
        color: '#FFF',
        marginTop: 4,
        fontWeight: '600',
    },

    revealContainer: {
        marginTop: SPACING.xl,
        width: '100%',
    },

    // Game Over
    gameOverContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.xl,
    },
    gameOverEmoji: { fontSize: 80, marginBottom: SPACING.lg },
    gameOverTitle: { color: COLORS.text.primary, ...FONTS.title, marginBottom: SPACING.lg },
    scoreContainer: { alignItems: 'center', marginBottom: SPACING.lg },
    finalScore: { fontSize: 72, fontWeight: '900', color: COLORS.accent.primary },
    scoreLabel: { color: COLORS.text.muted, fontSize: 16 },
    feedbackText: { color: COLORS.text.primary, fontSize: 20, fontWeight: '600', marginBottom: SPACING.xl },
    gameOverButtons: { width: '100%', gap: SPACING.md },
    menuBtn: { padding: SPACING.md, alignSelf: 'center' },
    menuBtnText: { color: COLORS.text.muted },

    kurdishFont: { fontFamily: 'Rabar' },
});
