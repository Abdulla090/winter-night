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
import { getCharadesWords } from '../../constants/charadesData';

// Fallback to buttons if sensors not implemented
const USE_SENSORS = false;

export default function ReverseCharadesPlayScreen({ navigation, route }) {
    const { category, roundTime } = route.params;
    const { language, isKurdish } = useLanguage();
    const rowDirection = isKurdish ? 'row-reverse' : 'row';

    // Game State
    const [words, setWords] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(roundTime);
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const timerRef = useRef(null);
    const cardAnim = useRef(new Animated.Value(0)).current;

    // Initialize
    useEffect(() => {
        const loadedWords = getCharadesWords(category.id, language);
        setWords(loadedWords);
    }, [category, language]);

    // Timer
    useEffect(() => {
        if (isPlaying && !isPaused && timeLeft > 0) {
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
    }, [isPlaying, isPaused, timeLeft]);

    const handleStart = () => {
        setIsPlaying(true);
    };

    const handleTimeUp = () => {
        Vibration.vibrate(500);
        setIsPlaying(false);
        setGameOver(true);
    };

    const handleCorrect = () => {
        setScore(prev => prev + 1);
        nextWord();
    };

    const handlePass = () => {
        nextWord();
    };

    const nextWord = () => {
        // Animate out
        Animated.sequence([
            Animated.timing(cardAnim, { toValue: -500, duration: 200, useNativeDriver: true }),
            Animated.timing(cardAnim, { toValue: 0, duration: 1, useNativeDriver: true }), // Reset instantly
        ]).start(() => {
            if (currentIndex + 1 >= words.length) {
                // Shuffle and restart if run out of words
                setWords(prev => [...prev].sort(() => Math.random() - 0.5));
                setCurrentIndex(0);
            } else {
                setCurrentIndex(prev => prev + 1);
            }
        });
    };

    if (words.length === 0) return null;
    const currentWord = words[currentIndex];

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
                        <Text style={styles.gameOverEmoji}>🎉</Text>
                        <Text style={[styles.gameOverTitle, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'کات تەواو بوو!' : "Time's Up!"}
                        </Text>

                        <View style={styles.scoreContainer}>
                            <Text style={styles.finalScore}>{score}</Text>
                            <Text style={[styles.scoreLabel, isKurdish && styles.kurdishFont]}>
                                {isKurdish ? 'خاڵ' : 'Points'}
                            </Text>
                        </View>

                        <View style={styles.gameOverButtons}>
                            <Button
                                title={isKurdish ? 'دووبارە یاری بکە' : 'Play Again'}
                                onPress={() => {
                                    setScore(0);
                                    setTimeLeft(roundTime);
                                    setGameOver(false);
                                    setWords(prev => [...prev].sort(() => Math.random() - 0.5));
                                    setIsPlaying(true);
                                }}
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
    // PRE-GAME
    // ========================
    if (!isPlaying) {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.centerContent}>
                        <GlassCard intensity={30} style={styles.startCard}>
                            <Text style={[styles.readyTitle, isKurdish && styles.kurdishFont]}>
                                {isKurdish ? 'ئامادەی؟' : 'Ready?'}
                            </Text>
                            <Text style={[styles.readySub, isKurdish && styles.kurdishFont]}>
                                {isKurdish
                                    ? 'مۆبایلەکە ڕووەو تیمەکە بگرە. کاتێک ئامادە بوون دەست پێ بکە!'
                                    : 'Hold phone facing the team. Start when ready!'
                                }
                            </Text>
                            <Button
                                title={isKurdish ? 'دەست پێ بکە' : 'Start'}
                                onPress={handleStart}
                                gradient={[category.color, category.color]}
                                style={{ width: 200 }}
                            />
                        </GlassCard>
                    </View>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    // ========================
    // PLAYING
    // ========================
    return (
        <View style={[styles.container, { backgroundColor: category.color }]}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={[styles.header, { flexDirection: rowDirection }]}>
                    <TouchableOpacity onPress={() => setIsPaused(!isPaused)}>
                        <Ionicons name={isPaused ? "play" : "pause"} size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.timerPill}>
                        <Text style={styles.timerText}>{timeLeft}s</Text>
                    </View>
                    <View style={styles.scorePill}>
                        <Text style={styles.scoreText}>{score}</Text>
                    </View>
                </View>

                {/* Main Card */}
                <Animated.View style={[styles.gameArea, { transform: [{ translateX: cardAnim }] }]}>
                    <Text style={[styles.wordText, isKurdish && styles.kurdishFont]}>
                        {currentWord.word[language]}
                    </Text>
                    {isPaused && (
                        <View style={styles.pausedOverlay}>
                            <Text style={[styles.pausedText, isKurdish && styles.kurdishFont]}>
                                {isKurdish ? 'وەستاوە' : 'PAUSED'}
                            </Text>
                        </View>
                    )}
                </Animated.View>

                {/* Controls */}
                <View style={styles.controls}>
                    <TouchableOpacity
                        style={[styles.controlBtn, styles.passBtn]}
                        onPress={handlePass}
                    >
                        <Text style={[styles.controlText, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'تێپەڕێنە' : 'PASS'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.separator} />

                    <TouchableOpacity
                        style={[styles.controlBtn, styles.correctBtn]}
                        onPress={handleCorrect}
                    >
                        <Text style={[styles.controlText, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'ڕاستە' : 'CORRECT'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
    },
    timerPill: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        paddingVertical: 8, paddingHorizontal: 16,
        borderRadius: 20,
    },
    timerText: { color: '#FFF', fontWeight: 'bold', fontSize: 20 },
    scorePill: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 8, paddingHorizontal: 16,
        borderRadius: 20,
    },
    scoreText: { color: '#FFF', fontWeight: 'bold', fontSize: 20 },

    gameArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.xl,
    },
    wordText: {
        color: '#FFF',
        fontSize: 56,
        fontWeight: '900',
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 10,
    },

    controls: {
        flexDirection: 'row',
        height: 100,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    controlBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    passBtn: { backgroundColor: '#f59e0b' },
    correctBtn: { backgroundColor: '#10b981' },
    controlText: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    separator: { width: 2, backgroundColor: 'rgba(0,0,0,0.1)' },

    // Pre-game
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.xl,
    },
    startCard: {
        padding: SPACING.xl,
        borderRadius: BORDER_RADIUS.xl,
        alignItems: 'center',
        width: '100%',
    },
    readyTitle: { color: COLORS.text.primary, fontSize: 32, fontWeight: 'bold', marginBottom: SPACING.md },
    readySub: { color: COLORS.text.secondary, textAlign: 'center', fontSize: 18, marginBottom: SPACING.xl },

    // Paused
    pausedOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pausedText: { color: '#FFF', fontSize: 40, fontWeight: '900', letterSpacing: 5 },

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
    finalScore: { fontSize: 80, fontWeight: '900', color: COLORS.accent.success },
    scoreLabel: { color: COLORS.text.muted, fontSize: 18 },
    gameOverButtons: { width: '100%', gap: SPACING.md, marginTop: SPACING.xl },
    menuBtn: { padding: SPACING.md, alignSelf: 'center' },
    menuBtnText: { color: COLORS.text.muted },

    kurdishFont: { fontFamily: 'Rabar' },
});
