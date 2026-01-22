import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet, View, Text, TouchableOpacity, Animated, Vibration
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';
import { GradientBackground, GlassCard, Button } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';

const STARTING_WORDS = {
    en: ['Fire', 'Water', 'Time', 'Love', 'House', 'Car', 'Phone', 'Music', 'School', 'Food'],
    ku: ['ئاگر', 'ئاو', 'کات', 'خۆشەویستی', 'خانوو', 'سەیارە', 'مۆبایل', 'مۆسیقا', 'قوتابخانە', 'خواردن']
};

export default function WordChainPlayScreen({ navigation }) {
    const { language, isKurdish } = useLanguage();
    const rowDirection = isKurdish ? 'row-reverse' : 'row';

    // Game State
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentWord, setCurrentWord] = useState('');
    const [timeLeft, setTimeLeft] = useState(5);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [showInstructions, setShowInstructions] = useState(true);

    const timerRef = useRef(null);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const bgAnim = useRef(new Animated.Value(0)).current;

    // Timer Logic
    useEffect(() => {
        if (isPlaying && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        handleTimeUp();
                        return 0;
                    }
                    return prev - 0.1; // Fast timer updates
                });
            }, 100);
        }
        return () => clearInterval(timerRef.current);
    }, [isPlaying, timeLeft]);

    // Animate background color based on time left
    useEffect(() => {
        Animated.timing(bgAnim, {
            toValue: timeLeft / 5, // Normalized 0-1
            duration: 100,
            useNativeDriver: false,
        }).start();
    }, [timeLeft]);

    const handleStart = () => {
        const words = STARTING_WORDS[language] || STARTING_WORDS.en;
        const randomWord = words[Math.floor(Math.random() * words.length)];

        setCurrentWord(randomWord);
        setIsPlaying(true);
        setShowInstructions(false);
        setScore(0);
        setGameOver(false);
        setTimeLeft(5);
    };

    const handleNext = () => {
        // Reset timer
        setTimeLeft(5);
        setScore(prev => prev + 1);

        // Visual feedback
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.2, duration: 100, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();
    };

    const handleTimeUp = () => {
        Vibration.vibrate(500);
        setIsPlaying(false);
        setGameOver(true);
    };

    const getBackgroundColor = bgAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [COLORS.accent.danger, COLORS.background.dark]
    });

    if (showInstructions) {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="close" size={24} color={COLORS.text.primary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.centerContent}>
                        <MotiView
                            from={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={styles.instructionCard}
                        >
                            <Text style={styles.gameIcon}>🔗</Text>
                            <Text style={[styles.gameTitle, isKurdish && styles.kurdishFont]}>
                                {isKurdish ? 'زنجیرەی وشە' : 'Word Chain'}
                            </Text>

                            <Text style={[styles.instructionText, isKurdish && styles.kurdishFont]}>
                                {isKurdish
                                    ? '١. وشەیەک دەردەکەوێت\n٢. وشەیەکی پەیوەندیدار بڵێ\n٣. دوگمەکە داگرە\n٤. تەنها ٥ چرکەت هەیە!'
                                    : '1. A word appears\n2. Say a related word\n3. Tap the button\n4. You only have 5 seconds!'}
                            </Text>

                            <Button
                                title={isKurdish ? 'دەست پێ بکە' : 'Start Playing'}
                                onPress={handleStart}
                                gradient={[COLORS.games.quiz[0], COLORS.games.quiz[1]]}
                                icon={<Ionicons name="rocket" size={20} color="#FFF" />}
                                isKurdish={isKurdish}
                                style={{ width: '100%', marginTop: SPACING.xl }}
                            />
                        </MotiView>
                    </View>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    if (gameOver) {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.safeArea}>
                    <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={styles.gameOverContainer}
                    >
                        <Text style={styles.gameOverEmoji}>💥</Text>
                        <Text style={[styles.gameOverTitle, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'زنجیرەکە پچڕا!' : 'Chain Broken!'}
                        </Text>

                        <View style={styles.scoreContainer}>
                            <Text style={styles.finalScore}>{score}</Text>
                            <Text style={[styles.scoreLabel, isKurdish && styles.kurdishFont]}>
                                {isKurdish ? 'وشە' : 'Words'}
                            </Text>
                        </View>

                        <View style={styles.gameOverButtons}>
                            <Button
                                title={isKurdish ? 'دووبارە بیکەوە' : 'Try Again'}
                                onPress={handleStart}
                                gradient={[COLORS.accent.danger, '#ef4444']}
                                isKurdish={isKurdish}
                            />
                            <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.goBack()}>
                                <Text style={[styles.menuBtnText, isKurdish && styles.kurdishFont]}>
                                    {isKurdish ? 'گەڕانەوە' : 'Exit Info'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </MotiView>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    return (
        <Animated.View style={[styles.container, { backgroundColor: getBackgroundColor }]}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.playHeader}>
                    <View style={styles.scorePill}>
                        <Text style={styles.scoreVal}>{score}</Text>
                    </View>
                    <View style={styles.timerPill}>
                        <Text style={styles.timerVal}>{timeLeft.toFixed(1)}s</Text>
                    </View>
                </View>

                {/* Main Game Area */}
                <View style={styles.gameArea}>
                    <Text style={[styles.previousLabel, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'وشەی ئێستا' : 'CURRENT WORD'}
                    </Text>
                    <Animated.Text
                        style={[
                            styles.currentWordText,
                            isKurdish && styles.kurdishFont,
                            { transform: [{ scale: scaleAnim }] }
                        ]}
                    >
                        {score === 0 ? currentWord : (isKurdish ? '؟' : '?')}
                    </Animated.Text>

                    {score > 0 && (
                        <Text style={[styles.promptText, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'وشەی داهاتوو بڵێ!' : 'Say the next word!'}
                        </Text>
                    )}
                </View>

                {/* Interaction - Hit the whole screen basically */}
                <TouchableOpacity
                    style={styles.tapArea}
                    activeOpacity={0.8}
                    onPress={handleNext}
                >
                    <View style={styles.tapCircle}>
                        <Text style={[styles.tapText, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'دواتر!' : 'NEXT!'}
                        </Text>
                        <Text style={styles.tapSubText}>
                            {isKurdish ? 'کاتێک وتت، دایگرە' : 'Tap after you say it'}
                        </Text>
                    </View>
                </TouchableOpacity>

            </SafeAreaView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background.dark },
    safeArea: { flex: 1 },

    // Setup
    header: { padding: SPACING.md },
    backBtn: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: COLORS.background.card,
        alignItems: 'center', justifyContent: 'center',
    },
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.xl,
    },
    instructionCard: {
        width: '100%',
        padding: SPACING.xl,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: BORDER_RADIUS.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    gameIcon: { fontSize: 60, marginBottom: SPACING.lg },
    gameTitle: { color: COLORS.text.primary, ...FONTS.large, marginBottom: SPACING.lg },
    instructionText: {
        color: COLORS.text.secondary,
        lineHeight: 28,
        textAlign: 'center',
        fontSize: 16,
        marginBottom: SPACING.xl
    },

    // Play
    playHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: SPACING.lg,
    },
    scorePill: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingVertical: 8, paddingHorizontal: 16,
        borderRadius: 20,
    },
    scoreVal: { color: '#FFF', fontWeight: 'bold', fontSize: 20 },
    timerPill: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 8, paddingHorizontal: 16,
        borderRadius: 20,
    },
    timerVal: { color: '#FFF', fontWeight: '900', fontSize: 20, fontVariant: ['tabular-nums'] },

    gameArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    previousLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        letterSpacing: 2,
        marginBottom: SPACING.md,
    },
    currentWordText: {
        color: '#FFF',
        fontSize: 48,
        fontWeight: '900',
        textAlign: 'center',
    },
    promptText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 20,
        marginTop: SPACING.lg,
    },

    tapArea: {
        height: '40%',
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tapCircle: {
        width: 150, height: 150,
        borderRadius: 75,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    tapText: {
        color: '#000',
        fontSize: 24,
        fontWeight: '900',
    },
    tapSubText: {
        color: '#666',
        fontSize: 10,
        marginTop: 4,
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
    finalScore: { fontSize: 80, fontWeight: '900', color: COLORS.accent.danger },
    scoreLabel: { color: COLORS.text.muted, fontSize: 18 },
    gameOverButtons: { width: '100%', gap: SPACING.md, marginTop: SPACING.xl },
    menuBtn: { padding: SPACING.md, alignSelf: 'center' },
    menuBtnText: { color: COLORS.text.muted },

    kurdishFont: { fontFamily: 'Rabar' },
});
