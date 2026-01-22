import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet, View, Text, TouchableOpacity, Animated, Vibration
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { GradientBackground, GlassCard, Button } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../localization/translations';
import { getForbiddenWords } from '../../constants/forbiddenWordData';

export default function ForbiddenWordPlayScreen({ navigation, route }) {
    const { teams, difficulty, roundTime } = route.params;
    const { language, isKurdish } = useLanguage();
    const rowDirection = isKurdish ? 'row-reverse' : 'row';

    // Game State
    const [words, setWords] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
    const [scores, setScores] = useState(teams.reduce((acc, t) => ({ ...acc, [t]: 0 }), {}));
    const [timeLeft, setTimeLeft] = useState(roundTime);
    const [phase, setPhase] = useState('ready'); // 'ready', 'playing', 'roundEnd', 'gameOver'
    const [roundNumber, setRoundNumber] = useState(1);
    const [wordsGuessed, setWordsGuessed] = useState(0);

    const timerRef = useRef(null);
    const shakeAnim = useRef(new Animated.Value(0)).current;

    // Initialize words
    useEffect(() => {
        const loadedWords = getForbiddenWords(difficulty.id, language);
        setWords(loadedWords);
    }, [difficulty, language]);

    // Timer
    useEffect(() => {
        if (phase === 'playing' && timeLeft > 0) {
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
    }, [phase]);

    const handleTimeUp = () => {
        Vibration.vibrate(500);
        setPhase('roundEnd');
    };

    const startRound = () => {
        setPhase('playing');
        setTimeLeft(roundTime);
        setWordsGuessed(0);
    };

    const handleCorrect = () => {
        // Add point
        setScores(prev => ({
            ...prev,
            [teams[currentTeamIndex]]: prev[teams[currentTeamIndex]] + 1
        }));
        setWordsGuessed(prev => prev + 1);
        nextWord();
    };

    const handleSkip = () => {
        // No penalty, just move to next word
        nextWord();
    };

    const handleBuzzer = () => {
        // Team used a forbidden word! (Usually called by opponents)
        Vibration.vibrate(300);
        // Shake animation
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
        nextWord();
    };

    const nextWord = () => {
        if (currentIndex + 1 >= words.length) {
            // Reshuffle words
            setWords(words.sort(() => Math.random() - 0.5));
            setCurrentIndex(0);
        } else {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const nextTeam = () => {
        const nextTeamIdx = (currentTeamIndex + 1) % teams.length;
        setCurrentTeamIndex(nextTeamIdx);

        if (nextTeamIdx === 0) {
            // Completed a full round
            setRoundNumber(prev => prev + 1);
        }

        setPhase('ready');
        setTimeLeft(roundTime);
    };

    const endGame = () => {
        setPhase('gameOver');
    };

    if (words.length === 0) {
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

    const currentWord = words[currentIndex];
    const currentTeam = teams[currentTeamIndex];
    const teamColor = currentTeamIndex === 0 ? '#3b82f6' : currentTeamIndex === 1 ? '#ef4444' : currentTeamIndex === 2 ? '#10b981' : '#f59e0b';

    // ========================
    // GAME OVER
    // ========================
    if (phase === 'gameOver') {
        const sortedTeams = Object.entries(scores).sort(([, a], [, b]) => b - a);
        const winner = sortedTeams[0];

        return (
            <GradientBackground>
                <SafeAreaView style={styles.safeArea}>
                    <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={styles.gameOverContainer}
                    >
                        <Text style={styles.gameOverEmoji}>🏆</Text>
                        <Text style={[styles.gameOverTitle, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'براوەکە!' : 'Winner!'}
                        </Text>
                        <Text style={[styles.winnerName, isKurdish && styles.kurdishFont]}>
                            {winner[0]}
                        </Text>
                        <Text style={styles.winnerScore}>{winner[1]} {isKurdish ? 'خاڵ' : 'points'}</Text>

                        <View style={styles.allScores}>
                            {sortedTeams.map(([team, score], idx) => (
                                <View key={team} style={[styles.scoreRow, { flexDirection: rowDirection }]}>
                                    <Text style={[styles.scoreRank, idx === 0 && { color: '#f59e0b' }]}>#{idx + 1}</Text>
                                    <Text style={[styles.scoreTeam, isKurdish && styles.kurdishFont]}>{team}</Text>
                                    <Text style={styles.scoreValue}>{score}</Text>
                                </View>
                            ))}
                        </View>

                        <Button
                            title={isKurdish ? 'گەڕانەوە' : 'Back to Home'}
                            onPress={() => navigation.goBack()}
                            gradient={[COLORS.accent.primary, '#2563eb']}
                            isKurdish={isKurdish}
                        />
                    </MotiView>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    // ========================
    // ROUND END
    // ========================
    if (phase === 'roundEnd') {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.safeArea}>
                    <MotiView
                        from={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={styles.roundEndContainer}
                    >
                        <Text style={styles.timeUpEmoji}>⏰</Text>
                        <Text style={[styles.timeUpText, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'کات تەواو بوو!' : "Time's Up!"}
                        </Text>

                        <GlassCard intensity={30} style={styles.roundResultCard}>
                            <Text style={[styles.roundResultTeam, isKurdish && styles.kurdishFont, { color: teamColor }]}>
                                {currentTeam}
                            </Text>
                            <Text style={styles.roundResultScore}>
                                +{wordsGuessed} {isKurdish ? 'وشە' : 'words'}
                            </Text>
                        </GlassCard>

                        <View style={styles.roundEndButtons}>
                            <Button
                                title={isKurdish ? 'تیمی دواتر' : 'Next Team'}
                                onPress={nextTeam}
                                gradient={[COLORS.accent.success, '#059669']}
                                icon={<Ionicons name="arrow-forward" size={20} color="#FFF" />}
                                isKurdish={isKurdish}
                            />
                            <TouchableOpacity style={styles.endGameBtn} onPress={endGame}>
                                <Text style={[styles.endGameText, isKurdish && styles.kurdishFont]}>
                                    {isKurdish ? 'کۆتایی یاری' : 'End Game'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </MotiView>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    // ========================
    // READY PHASE
    // ========================
    if (phase === 'ready') {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.safeArea}>
                    <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={styles.readyContainer}
                    >
                        <View style={styles.roundBadge}>
                            <Text style={[styles.roundBadgeText, isKurdish && styles.kurdishFont]}>
                                {isKurdish ? `دەوری ${roundNumber}` : `Round ${roundNumber}`}
                            </Text>
                        </View>

                        <View style={[styles.teamCircle, { backgroundColor: teamColor }]}>
                            <Text style={[styles.teamCircleText, isKurdish && styles.kurdishFont]}>
                                {currentTeam.charAt(0).toUpperCase()}
                            </Text>
                        </View>

                        <Text style={[styles.readyTitle, isKurdish && styles.kurdishFont, { color: teamColor }]}>
                            {currentTeam}
                        </Text>
                        <Text style={[styles.readySubtitle, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'ئامادەی؟' : 'Ready?'}
                        </Text>

                        <Text style={[styles.readyInstruction, isKurdish && styles.kurdishFont]}>
                            {isKurdish
                                ? 'تۆ وشەکە بۆ تیمەکەت باس دەکەیت بەبێ بەکارهێنانی وشە قەدەغەکان!'
                                : 'You will describe words to your team without using the forbidden words!'
                            }
                        </Text>

                        <Button
                            title={isKurdish ? 'دەست پێ بکە' : 'Start'}
                            onPress={startRound}
                            gradient={[teamColor, teamColor]}
                            icon={<Ionicons name="play" size={20} color="#FFF" />}
                            isKurdish={isKurdish}
                            style={{ marginTop: SPACING.xl }}
                        />
                    </MotiView>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    // ========================
    // PLAYING PHASE
    // ========================
    return (
        <GradientBackground>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Header */}
                <View style={[styles.header, { flexDirection: rowDirection }]}>
                    <View style={[styles.teamBadge, { backgroundColor: teamColor }]}>
                        <Text style={[styles.teamBadgeText, isKurdish && styles.kurdishFont]}>{currentTeam}</Text>
                    </View>
                    <View style={styles.timerContainer}>
                        <Ionicons name="time" size={20} color={timeLeft <= 10 ? COLORS.accent.danger : COLORS.text.primary} />
                        <Text style={[styles.timerText, timeLeft <= 10 && { color: COLORS.accent.danger }]}>
                            {timeLeft}s
                        </Text>
                    </View>
                    <View style={styles.scoreBadge}>
                        <Text style={styles.scoreText}>{wordsGuessed}</Text>
                    </View>
                </View>

                {/* Word Card */}
                <View style={styles.cardContainer}>
                    <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
                        <GlassCard intensity={40} style={styles.wordCard}>
                            <Text style={[styles.wordLabel, isKurdish && styles.kurdishFont]}>
                                {isKurdish ? 'باسی بکە:' : 'DESCRIBE:'}
                            </Text>
                            <Text style={[styles.targetWord, isKurdish && styles.kurdishFont]}>
                                {currentWord.target[language]}
                            </Text>

                            <View style={styles.divider} />

                            <Text style={[styles.forbiddenLabel, isKurdish && styles.kurdishFont]}>
                                🚫 {isKurdish ? 'وشە قەدەغەکان:' : 'FORBIDDEN WORDS:'}
                            </Text>
                            <View style={styles.forbiddenList}>
                                {currentWord.forbidden[language].map((word, idx) => (
                                    <View key={idx} style={styles.forbiddenChip}>
                                        <Text style={[styles.forbiddenWord, isKurdish && styles.kurdishFont]}>
                                            {word}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </GlassCard>
                    </Animated.View>
                </View>

                {/* Controls */}
                <View style={styles.controls}>
                    <TouchableOpacity
                        style={[styles.controlBtn, styles.skipBtn]}
                        onPress={handleSkip}
                    >
                        <Ionicons name="play-skip-forward" size={28} color={COLORS.text.muted} />
                        <Text style={[styles.controlText, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'تێپەڕێنە' : 'Skip'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.controlBtn, styles.buzzerBtn]}
                        onPress={handleBuzzer}
                    >
                        <Ionicons name="alert-circle" size={32} color="#FFF" />
                        <Text style={[styles.controlText, { color: '#FFF' }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'قەدەغە!' : 'Buzzer!'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.controlBtn, styles.correctBtn]}
                        onPress={handleCorrect}
                    >
                        <Ionicons name="checkmark-circle" size={28} color={COLORS.accent.success} />
                        <Text style={[styles.controlText, { color: COLORS.accent.success }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'ڕاستە!' : 'Correct!'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    loadingText: { color: COLORS.text.muted },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.md,
    },
    teamBadge: {
        paddingVertical: 6, paddingHorizontal: 14,
        borderRadius: 20,
    },
    teamBadgeText: { color: '#FFF', ...FONTS.bold },
    timerContainer: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: COLORS.background.card,
        paddingVertical: 8, paddingHorizontal: 16,
        borderRadius: 20,
    },
    timerText: { color: COLORS.text.primary, ...FONTS.bold, fontSize: 18 },
    scoreBadge: {
        backgroundColor: COLORS.accent.success + '30',
        paddingVertical: 6, paddingHorizontal: 14,
        borderRadius: 20,
    },
    scoreText: { color: COLORS.accent.success, ...FONTS.bold, fontSize: 18 },

    // Word Card
    cardContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: SPACING.lg,
    },
    wordCard: {
        padding: SPACING.xl,
        borderRadius: BORDER_RADIUS.xl,
        alignItems: 'center',
    },
    wordLabel: {
        color: COLORS.text.muted,
        ...FONTS.medium,
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: SPACING.sm,
    },
    targetWord: {
        color: COLORS.text.primary,
        ...FONTS.title,
        fontSize: 36,
        textAlign: 'center',
    },
    divider: {
        width: '80%',
        height: 1,
        backgroundColor: COLORS.background.border,
        marginVertical: SPACING.lg,
    },
    forbiddenLabel: {
        color: COLORS.accent.danger,
        ...FONTS.medium,
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: SPACING.md,
    },
    forbiddenList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: SPACING.sm,
    },
    forbiddenChip: {
        backgroundColor: COLORS.accent.danger + '20',
        paddingVertical: 6, paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.accent.danger + '40',
    },
    forbiddenWord: {
        color: COLORS.accent.danger,
        ...FONTS.medium,
    },

    // Controls
    controls: {
        flexDirection: 'row',
        padding: SPACING.lg,
        paddingBottom: SPACING.xl,
        gap: SPACING.md,
    },
    controlBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 2,
        gap: 4,
    },
    skipBtn: {
        backgroundColor: COLORS.background.card,
        borderColor: COLORS.background.border,
    },
    buzzerBtn: {
        backgroundColor: COLORS.accent.danger,
        borderColor: COLORS.accent.danger,
    },
    correctBtn: {
        backgroundColor: COLORS.accent.success + '20',
        borderColor: COLORS.accent.success,
    },
    controlText: {
        ...FONTS.medium,
        fontSize: 12,
        color: COLORS.text.muted,
    },

    // Ready Phase
    readyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.xl,
    },
    roundBadge: {
        backgroundColor: COLORS.background.card,
        paddingVertical: 6, paddingHorizontal: 16,
        borderRadius: 20,
        marginBottom: SPACING.lg,
    },
    roundBadgeText: { color: COLORS.text.secondary, ...FONTS.medium },
    teamCircle: {
        width: 100, height: 100, borderRadius: 50,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: SPACING.md,
    },
    teamCircleText: { color: '#FFF', fontSize: 48, fontWeight: '800' },
    readyTitle: { ...FONTS.large, fontSize: 32, marginBottom: 8 },
    readySubtitle: { color: COLORS.text.muted, ...FONTS.medium, fontSize: 18, marginBottom: SPACING.lg },
    readyInstruction: { color: COLORS.text.muted, textAlign: 'center', lineHeight: 22, maxWidth: 300 },

    // Round End
    roundEndContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.xl,
    },
    timeUpEmoji: { fontSize: 80, marginBottom: SPACING.md },
    timeUpText: { color: COLORS.accent.danger, ...FONTS.large, marginBottom: SPACING.lg },
    roundResultCard: {
        padding: SPACING.xl,
        borderRadius: BORDER_RADIUS.xl,
        alignItems: 'center',
        marginBottom: SPACING.xl,
        minWidth: 200,
    },
    roundResultTeam: { ...FONTS.title, fontSize: 24, marginBottom: 8 },
    roundResultScore: { color: COLORS.accent.success, ...FONTS.bold, fontSize: 20 },
    roundEndButtons: { width: '100%', gap: SPACING.md },
    endGameBtn: { alignSelf: 'center', padding: SPACING.md },
    endGameText: { color: COLORS.text.muted, ...FONTS.medium },

    // Game Over
    gameOverContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.xl,
    },
    gameOverEmoji: { fontSize: 80, marginBottom: SPACING.md },
    gameOverTitle: { color: COLORS.text.primary, ...FONTS.medium, marginBottom: SPACING.sm },
    winnerName: { color: COLORS.accent.primary, ...FONTS.title, fontSize: 36, marginBottom: 4 },
    winnerScore: { color: COLORS.text.muted, ...FONTS.medium, marginBottom: SPACING.xl },
    allScores: {
        width: '100%',
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.xl,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.background.border,
    },
    scoreRank: { color: COLORS.text.muted, ...FONTS.bold, width: 30 },
    scoreTeam: { flex: 1, color: COLORS.text.primary, ...FONTS.medium },
    scoreValue: { color: COLORS.accent.success, ...FONTS.bold },

    kurdishFont: { fontFamily: 'Rabar' },
});
