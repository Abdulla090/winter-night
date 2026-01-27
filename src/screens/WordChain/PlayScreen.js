import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Vibration } from 'react-native';
import { X, Play, Rocket, Link, Clock } from 'lucide-react-native';
import { MotiView, AnimatePresence } from 'moti';
import { AnimatedScreen } from '../../components/AnimatedScreen';
import { BeastButton } from '../../components/BeastButton';
import { GlassCard } from '../../components/GlassCard';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { layout } from '../../theme/layout';

const STARTING_WORDS = {
    en: ['Fire', 'Water', 'Time', 'Love', 'House', 'Car', 'Phone', 'Music', 'School', 'Food'],
    ku: ['ئاگر', 'ئاو', 'کات', 'خۆشەویستی', 'خانوو', 'سەیارە', 'مۆبایل', 'مۆسیقا', 'قوتابخانە', 'خواردن']
};

export default function WordChainPlayScreen({ navigation }) {
    const { colors, isRTL } = useTheme();
    const { language, isKurdish } = useLanguage();

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentWord, setCurrentWord] = useState('');
    const [timeLeft, setTimeLeft] = useState(5);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [showInstructions, setShowInstructions] = useState(true);

    const timerRef = useRef(null);

    useEffect(() => {
        if (isPlaying && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        handleTimeUp();
                        return 0;
                    }
                    return prev - 0.1;
                });
            }, 100);
        }
        return () => clearInterval(timerRef.current);
    }, [isPlaying, timeLeft]);

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
        setTimeLeft(5);
        setScore(prev => prev + 1);
    };

    const handleTimeUp = () => {
        Vibration.vibrate(500);
        setIsPlaying(false);
        setGameOver(true);
    };

    if (showInstructions) {
        return (
            <AnimatedScreen>
                <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <BeastButton
                        variant="ghost"
                        icon={X}
                        onPress={() => navigation.goBack()}
                        size="sm"
                    />
                </View>

                <View style={styles.centerContent}>
                    <GlassCard style={{ width: '100%', alignItems: 'center', padding: 24 }}>
                        <View style={[styles.iconContainer, { backgroundColor: colors.surfaceHighlight }]}>
                            <Link size={48} color={colors.accent} />
                        </View>
                        <Text style={[styles.gameTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'زنجیرەی وشە' : 'Word Chain'}
                        </Text>
                        <Text style={[styles.instructionText, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish
                                ? '١. وشەیەک دەردەکەوێت\n٢. وشەیەکی پەیوەندیدار بڵێ\n٣. دوگمەکە داگرە\n٤. تەنها ٥ چرکەت هەیە!'
                                : '1. A word appears\n2. Say a related word\n3. Tap the button\n4. You only have 5 seconds!'}
                        </Text>
                        <BeastButton
                            title={isKurdish ? 'دەست پێ بکە' : 'Start Playing'}
                            onPress={handleStart}
                            icon={Rocket}
                            size="lg"
                            style={{ width: '100%', marginTop: 20 }}
                        />
                    </GlassCard>
                </View>
            </AnimatedScreen>
        );
    }

    if (gameOver) {
        return (
            <AnimatedScreen>
                <View style={styles.centerContent}>
                    <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ width: '100%', alignItems: 'center' }}
                    >
                        <Text style={{ fontSize: 80, marginBottom: 20 }}>💥</Text>
                        <Text style={[styles.gameOverTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'زنجیرەکە پچڕا!' : 'Chain Broken!'}
                        </Text>

                        <View style={{ alignItems: 'center', marginBottom: 40 }}>
                            <Text style={{ fontSize: 80, fontWeight: '900', color: colors.accent }}>{score}</Text>
                            <Text style={{ fontSize: 18, color: colors.text.muted }}>{isKurdish ? 'وشە' : 'Words'}</Text>
                        </View>

                        <BeastButton
                            title={isKurdish ? 'دووبارە بیکەوە' : 'Try Again'}
                            onPress={handleStart}
                            variant="primary"
                            size="lg"
                            style={{ width: '100%', marginBottom: 16 }}
                        />
                        <BeastButton
                            title={isKurdish ? 'گەڕانەوە' : 'Exit'}
                            onPress={() => navigation.goBack()}
                            variant="ghost"
                            size="md"
                        />
                    </MotiView>
                </View>
            </AnimatedScreen>
        );
    }

    // Dynamic background based on timer
    const dangerLevel = Math.max(0, 1 - timeLeft / 5);
    const bgColor = timeLeft < 2 ? 'rgba(239, 68, 68, 0.3)' : undefined; // Red tint if low time

    return (
        <AnimatedScreen style={{ backgroundColor: bgColor }}>
            <View style={styles.playHeader}>
                <GlassCard style={{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 }}>
                    <Text style={{ color: colors.text.primary, fontWeight: 'bold', fontSize: 20 }}>{score}</Text>
                </GlassCard>
                <GlassCard
                    style={{
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 20,
                        borderColor: timeLeft < 2 ? colors.error : colors.border
                    }}
                >
                    <Text style={{ color: timeLeft < 2 ? colors.error : colors.text.primary, fontWeight: '900', fontSize: 20, fontVariant: ['tabular-nums'] }}>
                        {timeLeft.toFixed(1)}s
                    </Text>
                </GlassCard>
            </View>

            <View style={styles.gameArea}>
                <Text style={[styles.previousLabel, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                    {isKurdish ? 'وشەی ئێستا' : 'CURRENT WORD'}
                </Text>

                <MotiView
                    key={score} // Re-animate on score change
                    from={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <Text style={[styles.currentWordText, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                        {score === 0 ? currentWord : (isKurdish ? '؟' : '?')}
                    </Text>
                </MotiView>

                {score > 0 && (
                    <Text style={[styles.promptText, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'وشەی داهاتوو بڵێ!' : 'Say the next word!'}
                    </Text>
                )}
            </View>

            <TouchableOpacity
                style={styles.tapArea}
                activeOpacity={0.8}
                onPress={handleNext}
            >
                <GlassCard
                    intensity={40}
                    style={{
                        width: 200,
                        height: 200,
                        borderRadius: 100,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: colors.accent + '40',
                        borderColor: colors.accent
                    }}
                >
                    <Text style={[styles.tapText, { color: '#FFF' }, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'دواتر!' : 'NEXT!'}
                    </Text>
                    <Text style={[styles.tapSubText, { color: 'rgba(255,255,255,0.7)' }]}>
                        {isKurdish ? 'کاتێک وتت، دایگرە' : 'Tap after you say it'}
                    </Text>
                </GlassCard>
            </TouchableOpacity>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    header: {
        padding: layout.spacing.md,
        justifyContent: 'flex-start',
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
        marginBottom: 20,
    },
    gameTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    instructionText: {
        fontSize: 16,
        lineHeight: 26,
        textAlign: 'center',
        marginBottom: 24,
    },
    playHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: layout.spacing.lg,
    },
    gameArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    previousLabel: {
        fontSize: 14,
        letterSpacing: 2,
        marginBottom: layout.spacing.md,
        textTransform: 'uppercase',
    },
    currentWordText: {
        fontSize: 48,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 20,
    },
    promptText: {
        fontSize: 20,
    },
    tapArea: {
        paddingBottom: 50,
        alignItems: 'center',
    },
    tapText: {
        fontSize: 32,
        fontWeight: '900',
    },
    tapSubText: {
        fontSize: 12,
        marginTop: 8,
    },
    gameOverTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    kurdishFont: {
        fontFamily: 'Rabar_022',
    }
});
