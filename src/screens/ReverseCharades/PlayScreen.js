import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Vibration, Animated } from 'react-native';
import { Play, Pause, Check, RotateCcw, Clock, SkipForward } from 'lucide-react-native';
import { MotiView, AnimatePresence } from 'moti';
import { AnimatedScreen } from '../../components/AnimatedScreen';
import { BeastButton } from '../../components/BeastButton';
import { GlassCard } from '../../components/GlassCard';
import { BackButton } from '../../components/BackButton';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../localization/translations';
import { layout } from '../../theme/layout';
import { getCharadesWords } from '../../constants/charadesData';

export default function ReverseCharadesPlayScreen({ navigation, route }) {
    const { category, roundTime } = route.params;
    const { colors, isRTL } = useTheme();
    const { language, isKurdish } = useLanguage();

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
        const loadedWords = getCharadesWords(category.id, language) || [];
        // Ensure we have words, if strictly array is returned
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

    if (words.length === 0) {
        return (
            <AnimatedScreen>
                <View style={[styles.centerContent, { justifyContent: 'center' }]}>
                    <Text style={{ color: colors.text.muted }}>Loading Words...</Text>
                </View>
            </AnimatedScreen>
        );
    }

    const currentWord = words[currentIndex];

    // ========================
    // GAME OVER
    // ========================
    if (gameOver) {
        return (
            <AnimatedScreen>
                <MotiView
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={styles.centerContent}
                >
                    <View style={[styles.iconContainer, { backgroundColor: colors.surfaceHighlight }]}>
                        <Clock size={48} color={colors.accent} />
                    </View>

                    <Text style={[styles.title, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'کات تەواو بوو!' : "Time's Up!"}
                    </Text>

                    <GlassCard style={styles.scoreCard}>
                        <Text style={[styles.scoreLabel, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'کۆی گشتی خاڵ' : 'Total Score'}
                        </Text>
                        <Text style={[styles.finalScore, { color: colors.brand.success }]}>{score}</Text>
                    </GlassCard>

                    <View style={{ width: '100%', gap: 16 }}>
                        <BeastButton
                            title={isKurdish ? 'دووبارە یاری بکە' : 'Play Again'}
                            onPress={() => {
                                setScore(0);
                                setTimeLeft(roundTime);
                                setGameOver(false);
                                setWords(prev => [...prev].sort(() => Math.random() - 0.5));
                                setIsPlaying(true);
                            }}
                            variant="primary"
                            icon={RotateCcw}
                            size="lg"
                        />
                        <BeastButton
                            title={isKurdish ? 'گەڕانەوە' : 'Back to Menu'}
                            onPress={() => navigation.goBack()}
                            variant="ghost"
                            size="md"
                        />
                    </View>
                </MotiView>
            </AnimatedScreen>
        );
    }

    // ========================
    // PRE-GAME
    // ========================
    if (!isPlaying) {
        return (
            <AnimatedScreen>
                <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <BackButton onPress={() => navigation.goBack()} />
                </View>
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    style={styles.centerContent}
                >
                    <GlassCard intensity={30} style={styles.startCard}>
                        <View style={[styles.iconContainer, { backgroundColor: category.color + '20', marginBottom: 24 }]}>
                            <Text style={{ fontSize: 40 }}>{category.icon}</Text>
                        </View>

                        <Text style={[styles.readyTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'ئامادەی؟' : 'Ready?'}
                        </Text>
                        <Text style={[styles.readySub, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish
                                ? 'مۆبایلەکە ڕووەو تیمەکە بگرە. کاتێک ئامادە بوون دەست پێ بکە!'
                                : 'Hold phone facing the team. Start when ready!'
                            }
                        </Text>
                        <BeastButton
                            title={isKurdish ? 'دەست پێ بکە' : 'Start Game'}
                            onPress={handleStart}
                            style={{ width: '100%', backgroundColor: category.color }}
                            size="lg"
                            icon={Play}
                        />
                    </GlassCard>
                </MotiView>
            </AnimatedScreen>
        );
    }

    // ========================
    // PLAYING
    // ========================
    // Calculate danger state for timer
    const isDanger = timeLeft <= 10;

    return (
        <AnimatedScreen style={{ backgroundColor: isDanger ? 'rgba(239, 68, 68, 0.2)' : undefined }}>
            {/* Header */}
            <View style={[styles.playHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <BeastButton
                    variant="ghost"
                    icon={isPaused ? Play : Pause}
                    onPress={() => setIsPaused(!isPaused)}
                    size="sm"
                    style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
                />

                <GlassCard
                    intensity={20}
                    style={[
                        styles.timerPill,
                        isDanger && { borderColor: colors.brand.danger, borderWidth: 1, backgroundColor: colors.brand.danger + '20' }
                    ]}
                >
                    <Text style={[
                        styles.timerText,
                        { color: isDanger ? colors.brand.danger : colors.text.primary }
                    ]}>
                        {timeLeft}s
                    </Text>
                </GlassCard>

                <GlassCard intensity={20} style={styles.scorePill}>
                    <Text style={[styles.scoreText, { color: colors.text.primary }]}>{score}</Text>
                </GlassCard>
            </View>

            {/* Main Game Area */}
            <View style={styles.gameArea}>
                <AnimatePresence>
                    {isPaused && (
                        <MotiView
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={styles.pausedOverlay}
                        >
                            <GlassCard style={{ padding: 32, alignItems: 'center' }}>
                                <Text style={[styles.pausedText, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                                    {isKurdish ? 'وەستاوە' : 'PAUSED'}
                                </Text>
                            </GlassCard>
                        </MotiView>
                    )}
                </AnimatePresence>

                <Animated.View style={{ width: '100%', transform: [{ translateX: cardAnim }], paddingHorizontal: layout.spacing.lg }}>
                    <GlassCard
                        intensity={40}
                        style={[styles.wordCard, { borderColor: category.color }]}
                    >
                        <Text style={[styles.categoryLabel, { color: category.color }, isKurdish && styles.kurdishFont]}>
                            {category.title[language]}
                        </Text>
                        <Text style={[styles.wordText, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                            {currentWord?.word[language]}
                        </Text>
                    </GlassCard>
                </Animated.View>
            </View>

            {/* Controls */}
            <View style={styles.controls}>
                <TouchableOpacity
                    style={[styles.controlBtnWrapper]}
                    onPress={handlePass}
                    activeOpacity={0.8}
                    disabled={isPaused}
                >
                    <GlassCard style={[styles.controlBtn, isPaused && { opacity: 0.5 }]}>
                        <SkipForward size={32} color={colors.text.tertiary} />
                        <Text style={[styles.controlText, { color: colors.text.tertiary, marginTop: 8 }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'تێپەڕێنە' : 'PASS'}
                        </Text>
                    </GlassCard>
                </TouchableOpacity>

                <View style={{ width: 20 }} />

                <TouchableOpacity
                    style={[styles.controlBtnWrapper, { flex: 1.5 }]}
                    onPress={handleCorrect}
                    activeOpacity={0.8}
                    disabled={isPaused}
                >
                    <View style={[
                        styles.controlBtn,
                        { backgroundColor: colors.brand.success, borderColor: colors.brand.success, borderWidth: 0 },
                        isPaused && { opacity: 0.5 }
                    ]}>
                        <Check size={48} color="#FFF" strokeWidth={3} />
                        <Text style={[styles.controlText, { color: '#FFF', marginTop: 8 }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'ڕاستە' : 'CORRECT'}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: layout.spacing.md,
        paddingTop: layout.spacing.sm,
    },
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: layout.spacing.lg,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        marginBottom: 24,
        textAlign: 'center',
    },
    scoreCard: {
        width: '100%',
        alignItems: 'center',
        padding: 24,
        marginBottom: 32,
        borderRadius: 24,
    },
    scoreLabel: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '600',
    },
    finalScore: {
        fontSize: 64,
        fontWeight: '900',
        lineHeight: 70,
    },

    // Pre-game
    startCard: {
        padding: layout.spacing.xl,
        borderRadius: 32,
        alignItems: 'center',
        width: '100%',
    },
    readyTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: layout.spacing.md,
    },
    readySub: {
        textAlign: 'center',
        fontSize: 18,
        lineHeight: 26,
        marginBottom: layout.spacing.xl,
    },

    // Playing
    playHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: layout.spacing.md,
    },
    timerPill: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        minWidth: 80,
        alignItems: 'center',
    },
    timerText: {
        fontWeight: '900',
        fontSize: 20,
        fontVariant: ['tabular-nums'],
    },
    scorePill: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        minWidth: 60,
        alignItems: 'center',
    },
    scoreText: {
        fontWeight: '900',
        fontSize: 20,
    },
    gameArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    wordCard: {
        width: '100%',
        aspectRatio: 1, // Square card
        maxWidth: 350,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
        padding: 24,
        borderWidth: 2,
    },
    categoryLabel: {
        position: 'absolute',
        top: 24,
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    wordText: {
        fontSize: 48,
        fontWeight: '900',
        textAlign: 'center',
        lineHeight: 56,
    },
    pausedOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    pausedText: {
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: 4,
    },

    // Controls
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: layout.spacing.lg,
        paddingBottom: layout.spacing.xl,
    },
    controlBtnWrapper: {
        flex: 1,
        height: 100,
    },
    controlBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
        width: '100%',
        height: '100%',
    },
    controlText: {
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    kurdishFont: {
        fontFamily: 'Rabar_022',
    }
});
