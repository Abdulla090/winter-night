import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Vibration, ScrollView } from 'react-native';
import { Play, SkipForward, AlertCircle, Check, Clock, RotateCcw, ArrowRight } from 'lucide-react-native';
import { MotiView, AnimatePresence } from 'moti';
import { AnimatedScreen } from '../../components/AnimatedScreen';
import { GlassCard } from '../../components/GlassCard';
import { BeastButton } from '../../components/BeastButton';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { layout } from '../../theme/layout';
import { getForbiddenWords } from '../../constants/forbiddenWordData';

export default function ForbiddenWordPlayScreen({ navigation, route }) {
    const { teams, difficulty, roundTime } = route.params;
    const { colors, isRTL } = useTheme();
    const { language, isKurdish } = useLanguage();

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

    useEffect(() => {
        const loadedWords = getForbiddenWords(difficulty.id, language);
        setWords(loadedWords);
    }, [difficulty, language]);

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
        setScores(prev => ({
            ...prev,
            [teams[currentTeamIndex]]: prev[teams[currentTeamIndex]] + 1
        }));
        setWordsGuessed(prev => prev + 1);
        nextWord();
    };

    const handleSkip = () => {
        nextWord();
    };

    const handleBuzzer = () => {
        Vibration.vibrate(300);
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
            <AnimatedScreen>
                <View style={styles.loadingContainer}>
                    <Text style={{ color: colors.text.muted }}>Loading...</Text>
                </View>
            </AnimatedScreen>
        );
    }

    const currentWord = words[currentIndex];
    const currentTeam = teams[currentTeamIndex];

    // Team Colors based on index (Blue, Red, Green, Yellow essentially)
    const teamColors = [colors.brand.primary, colors.brand.crimson, colors.accent, colors.brand.gold];
    const teamColor = teamColors[currentTeamIndex % teamColors.length];

    // ========================
    // GAME OVER
    // ========================
    if (phase === 'gameOver') {
        const sortedTeams = Object.entries(scores).sort(([, a], [, b]) => b - a);
        const winner = sortedTeams[0];

        return (
            <AnimatedScreen>
                <MotiView
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: 'timing', duration: 300 }}
                    style={styles.centerContent}
                >
                    <View style={[styles.iconCircle, { backgroundColor: colors.surfaceHighlight, marginBottom: 20 }]}>
                        <Text style={{ fontSize: 40 }}>🏆</Text>
                    </View>
                    <Text style={[styles.title, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'براوەکە!' : 'WINNER!'}
                    </Text>
                    <Text style={[styles.winnerName, { color: teamColor }, isKurdish && styles.kurdishFont]}>
                        {winner[0]}
                    </Text>
                    <Text style={[styles.scoreText, { color: colors.text.secondary }]}>
                        {winner[1]} {isKurdish ? 'خاڵ' : 'points'}
                    </Text>

                    <GlassCard style={styles.scoreBoard}>
                        {sortedTeams.map(([team, score], idx) => (
                            <View key={team} style={[styles.scoreRow, { borderBottomColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                <Text style={{ color: idx === 0 ? colors.brand.gold : colors.text.muted, fontWeight: 'bold', width: 30 }}>#{idx + 1}</Text>
                                <Text style={[{ flex: 1, color: colors.text.primary, fontWeight: '600' }, isKurdish && styles.kurdishFont, { textAlign: isRTL ? 'right' : 'left' }]}>{team}</Text>
                                <Text style={{ color: colors.accent, fontWeight: 'bold' }}>{score}</Text>
                            </View>
                        ))}
                    </GlassCard>

                    <BeastButton
                        title={isKurdish ? 'گەڕانەوە' : 'Back to Home'}
                        onPress={() => navigation.goBack()}
                        variant="ghost"
                        style={{ marginTop: layout.spacing.lg }}
                    />
                </MotiView>
            </AnimatedScreen>
        );
    }

    // ========================
    // ROUND END
    // ========================
    if (phase === 'roundEnd') {
        return (
            <AnimatedScreen>
                <MotiView
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={styles.centerContent}
                >
                    <View style={[styles.iconCircle, { backgroundColor: colors.accent + '20', marginBottom: 20 }]}>
                        <Clock size={48} color={colors.accent} />
                    </View>
                    <Text style={[styles.title, { color: colors.accent }, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'کات تەواو بوو!' : "Time's Up!"}
                    </Text>

                    <GlassCard style={[styles.resultCard, { borderColor: teamColor }]}>
                        <Text style={[styles.teamName, { color: teamColor }, isKurdish && styles.kurdishFont]}>
                            {currentTeam}
                        </Text>
                        <Text style={[styles.scoreValue, { color: colors.text.primary }]}>
                            +{wordsGuessed} <Text style={{ fontSize: 16, color: colors.text.secondary }}>{isKurdish ? 'وشە' : 'words'}</Text>
                        </Text>
                    </GlassCard>

                    <View style={{ width: '100%', gap: 16 }}>
                        <BeastButton
                            title={isKurdish ? 'تیمی دواتر' : 'Next Team'}
                            onPress={nextTeam}
                            variant="primary"
                            icon={ArrowRight}
                            style={{ backgroundColor: colors.brand.success }}
                        />
                        <BeastButton
                            title={isKurdish ? 'کۆتایی یاری' : 'End Game'}
                            onPress={endGame}
                            variant="ghost"
                        />
                    </View>
                </MotiView>
            </AnimatedScreen>
        );
    }

    // ========================
    // READY PHASE
    // ========================
    if (phase === 'ready') {
        return (
            <AnimatedScreen>
                <MotiView
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: 'timing', duration: 300 }}
                    style={styles.centerContent}
                >
                    <GlassCard intensity={20} style={{ marginBottom: layout.spacing.xl, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 }}>
                        <Text style={{ color: colors.text.secondary, fontWeight: 'bold' }}>
                            {isKurdish ? `دەوری ${roundNumber}` : `ROUND ${roundNumber}`}
                        </Text>
                    </GlassCard>

                    <View style={[styles.largeAvatar, { backgroundColor: teamColor, ...layout.shadows.lg }]}>
                        <Text style={{ color: '#FFF', fontSize: 60, fontWeight: '800' }}>
                            {currentTeam.charAt(0).toUpperCase()}
                        </Text>
                    </View>

                    <Text style={[styles.title, { color: teamColor, marginBottom: 8 }, isKurdish && styles.kurdishFont]}>
                        {currentTeam}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'ئامادەی؟' : 'Are you ready?'}
                    </Text>

                    <BeastButton
                        title={isKurdish ? 'دەست پێ بکە' : 'Start Round'}
                        onPress={startRound}
                        size="lg"
                        style={{ marginTop: layout.spacing.xxl, backgroundColor: teamColor, width: '100%' }}
                        icon={Play}
                    />
                </MotiView>
            </AnimatedScreen>
        );
    }

    // ========================
    // PLAYING PHASE
    // ========================
    return (
        <AnimatedScreen>
            <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <View style={[styles.teamBadge, { backgroundColor: teamColor }]}>
                    <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{currentTeam}</Text>
                </View>

                <GlassCard intensity={20} style={styles.timerContainer}>
                    <Clock size={16} color={timeLeft <= 10 ? colors.brand.danger : colors.text.primary} style={{ marginRight: 6 }} />
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: timeLeft <= 10 ? colors.brand.danger : colors.text.primary }}>
                        {timeLeft}s
                    </Text>
                </GlassCard>

                <View style={[styles.scoreBadge, { backgroundColor: colors.brand.success + '20' }]}>
                    <Text style={{ color: colors.brand.success, fontWeight: 'bold', fontSize: 18 }}>{wordsGuessed}</Text>
                </View>
            </View>

            <View style={{ flex: 1, justifyContent: 'center', paddingVertical: layout.spacing.md }}>
                <Animated.View style={{ transform: [{ translateX: shakeAnim }], width: '100%' }}>
                    <GlassCard intensity={45} style={styles.wordCard}>
                        <Text style={[styles.label, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'باسی بکە:' : 'DESCRIBE:'}
                        </Text>
                        <Text style={[styles.targetWord, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                            {currentWord.target[language]}
                        </Text>

                        <View style={[styles.divider, { backgroundColor: colors.border }]} />

                        <Text style={[styles.label, { color: colors.brand.danger, marginBottom: 12 }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'وشە قەدەغەکان:' : 'FORBIDDEN:'}
                        </Text>

                        <View style={styles.forbiddenList}>
                            {currentWord.forbidden[language].map((word, idx) => (
                                <View key={idx} style={[styles.forbiddenChip, { backgroundColor: colors.brand.danger + '15', borderColor: colors.brand.danger + '30' }]}>
                                    <Text style={[styles.forbiddenText, { color: colors.brand.danger }, isKurdish && styles.kurdishFont]}>
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
                <TouchableOpacity onPress={handleSkip} activeOpacity={0.8} style={styles.controlBtnWrapper}>
                    <GlassCard style={styles.controlBtn}>
                        <SkipForward size={32} color={colors.text.muted} />
                        <Text style={[styles.controlLabel, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>{isKurdish ? 'تێپەڕێنە' : 'Skip'}</Text>
                    </GlassCard>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleBuzzer} activeOpacity={0.8} style={[styles.controlBtnWrapper, { flex: 1.2 }]}>
                    <View style={[styles.controlBtn, { backgroundColor: colors.brand.danger, borderRadius: 24, borderWidth: 0 }]}>
                        <AlertCircle size={40} color="#FFF" />
                        <Text style={[styles.controlLabel, { color: '#FFF' }, isKurdish && styles.kurdishFont]}>{isKurdish ? 'قەدەغە!' : 'TABOO!'}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleCorrect} activeOpacity={0.8} style={styles.controlBtnWrapper}>
                    <View style={[styles.controlBtn, { backgroundColor: colors.brand.success + '20', borderColor: colors.brand.success, borderWidth: 2 }]}>
                        <Check size={32} color={colors.brand.success} />
                        <Text style={[styles.controlLabel, { color: colors.brand.success }, isKurdish && styles.kurdishFont]}>{isKurdish ? 'ڕاستە!' : 'Got it!'}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: layout.spacing.md,
    },
    teamBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    scoreBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },

    // Play Card
    wordCard: {
        alignItems: 'center',
        padding: layout.spacing.xl,
        borderRadius: 24,
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 8,
    },
    targetWord: {
        fontSize: 42,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 8,
    },
    divider: {
        height: 1,
        width: '100%',
        marginVertical: layout.spacing.lg,
    },
    forbiddenList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
    },
    forbiddenChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 1,
    },
    forbiddenText: {
        fontWeight: '600',
        fontSize: 18,
    },

    // Controls
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingBottom: 20,
        height: 120,
    },
    controlBtnWrapper: {
        flex: 1,
        height: '100%',
    },
    controlBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        width: '100%',
    },
    controlLabel: {
        fontSize: 12,
        fontWeight: 'Bold',
        marginTop: 4,
        textTransform: 'uppercase',
    },

    // Center Content (Ready/End)
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: layout.spacing.lg,
    },
    largeAvatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    resultCard: {
        width: '100%',
        alignItems: 'center',
        padding: 24,
        borderRadius: 24,
        marginBottom: 32,
        marginTop: 32,
        borderWidth: 2,
    },
    teamName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    scoreValue: {
        fontSize: 32,
        fontWeight: '900',
    },
    winnerName: {
        fontSize: 40,
        fontWeight: '900',
        marginBottom: 4,
    },
    scoreText: {
        fontSize: 18,
        marginBottom: 32,
    },
    scoreBoard: {
        width: '100%',
        padding: 16,
    },
    scoreRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    kurdishFont: {
        fontFamily: 'Rabar_022',
    }
});
