import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Vibration,
    Dimensions,
} from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Trophy,
    Star,
    Crown,
    ThumbsUp,
    ThumbsDown,
    X,
    Check,
    ChevronRight,
    Home,
    Award,
    Zap,
} from 'lucide-react-native';

import { AnimatedScreen } from '../../components/AnimatedScreen';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

// Answer Result Card
const AnswerResultCard = ({
    player,
    answer,
    isCorrect,
    voteCount,
    rank,
    pointsEarned,
    isWinner,
    colors,
    isDark,
    isKurdish,
    delay,
}) => (
    <MotiView
        from={{ opacity: 0, translateX: -20 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ delay }}
        style={[
            styles.resultCard,
            {
                backgroundColor: isDark ? '#1A0B2E' : '#FFF',
                borderColor: isCorrect
                    ? '#EF4444'
                    : isWinner
                        ? '#FFD700'
                        : (isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0'),
                borderWidth: isCorrect || isWinner ? 2 : 1,
            }
        ]}
    >
        {/* Rank Badge */}
        {!isCorrect && rank <= 3 && (
            <View style={[
                styles.rankBadge,
                { backgroundColor: rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32' }
            ]}>
                {rank === 1 ? (
                    <Crown size={14} color="#FFF" fill="#FFF" />
                ) : (
                    <Text style={styles.rankBadgeText}>#{rank}</Text>
                )}
            </View>
        )}

        {/* Player Info */}
        <View style={[styles.playerAvatar, { backgroundColor: player.color }]}>
            <Text style={styles.playerAvatarText}>{player.name.charAt(0)}</Text>
        </View>

        <View style={styles.resultContent}>
            <Text style={[styles.playerName, { color: colors.text.primary }]}>{player.name}</Text>
            <Text style={[
                styles.answerText,
                { color: isCorrect ? '#EF4444' : colors.text.secondary }
            ]}>
                "{answer.answer || (isKurdish ? 'وەڵام نەدا' : 'No answer')}"
            </Text>
        </View>

        {/* Vote Count */}
        {!isCorrect && voteCount > 0 && (
            <View style={styles.voteCountContainer}>
                <ThumbsUp size={16} color="#10B981" fill="#10B981" />
                <Text style={styles.voteCountText}>{voteCount}</Text>
            </View>
        )}

        {/* Points */}
        <View style={[
            styles.pointsBadge,
            { backgroundColor: pointsEarned >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' }
        ]}>
            <Text style={[
                styles.pointsText,
                { color: pointsEarned >= 0 ? '#10B981' : '#EF4444' }
            ]}>
                {pointsEarned >= 0 ? '+' : ''}{pointsEarned}
            </Text>
        </View>

        {/* Correct Answer X */}
        {isCorrect && (
            <View style={styles.correctXBadge}>
                <X size={16} color="#FFF" strokeWidth={3} />
            </View>
        )}
    </MotiView>
);

// Scoreboard Entry
const ScoreEntry = ({ player, score, rank, colors, isDark, delay }) => (
    <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay }}
        style={[styles.scoreEntry, { backgroundColor: isDark ? '#1A0B2E' : '#FFF' }]}
    >
        <View style={styles.scoreRank}>
            {rank === 1 ? (
                <Crown size={18} color="#FFD700" fill="#FFD700" />
            ) : (
                <Text style={[styles.scoreRankText, { color: colors.text.muted }]}>#{rank}</Text>
            )}
        </View>

        <View style={[styles.scoreAvatar, { backgroundColor: player.color }]}>
            <Text style={styles.scoreAvatarText}>{player.name.charAt(0)}</Text>
        </View>

        <Text style={[styles.scoreName, { color: colors.text.primary }]}>{player.name}</Text>

        <View style={styles.scorePoints}>
            <Star size={16} color="#FFD700" fill="#FFD700" />
            <Text style={styles.scorePointsText}>{score}</Text>
        </View>
    </MotiView>
);

export default function WrongAnswerResult({ navigation, route }) {
    const { isKurdish } = useLanguage();
    const { colors, isDark } = useTheme();

    const {
        players,
        questions,
        currentQuestionIndex,
        answerTime,
        voteTime,
        scores: initialScores,
        answers,
        correctAnswer,
        votes,
    } = route.params;

    // Calculate results
    const [updatedScores, setUpdatedScores] = useState([...initialScores]);
    const [showScoreboard, setShowScoreboard] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];

    // Count votes for each answer
    const voteCounts = answers.map((_, idx) =>
        Object.values(votes).filter(v => v === idx).length
    );

    // Check if answer is correct
    const isAnswerCorrect = (answerText) => {
        if (!answerText) return false;
        return answerText.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    };

    // Calculate rankings (exclude correct answers)
    const getAnswerRankings = () => {
        const wrongAnswers = answers
            .map((a, idx) => ({ ...a, idx, votes: voteCounts[idx] }))
            .filter(a => !isAnswerCorrect(a.answer))
            .sort((a, b) => b.votes - a.votes);

        return wrongAnswers.map((a, i) => ({ ...a, rank: i + 1 }));
    };

    const rankings = getAnswerRankings();

    // Calculate points for each player
    useEffect(() => {
        const timer = setTimeout(() => {
            const newScores = [...initialScores];

            answers.forEach((answer, idx) => {
                const playerIdx = answer.playerIndex;

                if (isAnswerCorrect(answer.answer)) {
                    // Penalty for correct answer
                    newScores[playerIdx] -= 50;
                } else if (answer.isTimeout || !answer.answer) {
                    // Penalty for no answer
                    newScores[playerIdx] -= 25;
                } else {
                    // Points for wrong answers
                    const ranking = rankings.find(r => r.idx === idx);
                    if (ranking) {
                        if (ranking.rank === 1) {
                            newScores[playerIdx] += 100; // Winner
                        } else if (ranking.rank === 2) {
                            newScores[playerIdx] += 50; // 2nd place
                        } else if (ranking.rank === 3) {
                            newScores[playerIdx] += 25; // 3rd place
                        } else {
                            newScores[playerIdx] += 10; // Participation
                        }
                    }
                }
            });

            setUpdatedScores(newScores);
            Vibration.vibrate(100);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    // Show scoreboard after results
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowScoreboard(true);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    // Get points earned for an answer
    const getPointsEarned = (answer, idx) => {
        if (isAnswerCorrect(answer.answer)) return -50;
        if (answer.isTimeout || !answer.answer) return -25;

        const ranking = rankings.find(r => r.idx === idx);
        if (ranking) {
            if (ranking.rank === 1) return 100;
            if (ranking.rank === 2) return 50;
            if (ranking.rank === 3) return 25;
            return 10;
        }
        return 0;
    };

    // Get rank for an answer
    const getAnswerRank = (idx) => {
        const ranking = rankings.find(r => r.idx === idx);
        return ranking ? ranking.rank : 99;
    };

    // Handle next question
    const handleNextQuestion = () => {
        if (currentQuestionIndex >= questions.length - 1) {
            // Game over
            navigation.replace('WrongAnswerFinal', {
                players,
                scores: updatedScores,
            });
        } else {
            // Next question
            navigation.replace('WrongAnswerPlay', {
                players,
                questions,
                answerTime,
                voteTime,
                scores: updatedScores,
            });
        }
    };

    // Get sorted scores
    const sortedPlayers = players
        .map((player, index) => ({ player, score: updatedScores[index], index }))
        .sort((a, b) => b.score - a.score);

    return (
        <AnimatedScreen>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.roundText, { color: colors.text.secondary }]}>
                        {isKurdish ? 'پرسیار' : 'Question'} {currentQuestionIndex + 1}/{questions.length}
                    </Text>
                    <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                        {isKurdish ? 'ئەنجامەکان' : 'Results'}
                    </Text>
                </View>

                {/* Question Recap */}
                <View style={[styles.questionRecap, { backgroundColor: isDark ? '#1A0B2E' : '#FFF' }]}>
                    <Text style={[styles.questionRecapLabel, { color: colors.text.muted }]}>
                        {isKurdish ? 'پرسیارەکە:' : 'Question:'}
                    </Text>
                    <Text style={[styles.questionRecapText, { color: colors.text.primary }]}>
                        {currentQuestion.q}
                    </Text>
                    <View style={styles.correctAnswerRow}>
                        <Check size={16} color="#10B981" />
                        <Text style={styles.correctAnswerLabel}>
                            {isKurdish ? 'وەڵامی دروست:' : 'Correct:'} {correctAnswer}
                        </Text>
                    </View>
                </View>

                {/* Winner Banner */}
                {rankings.length > 0 && rankings[0].votes > 0 && (
                    <MotiView
                        from={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 500 }}
                        style={styles.winnerBanner}
                    >
                        <LinearGradient
                            colors={['#FFD700', '#FFA500']}
                            style={styles.winnerBannerGradient}
                        >
                            <Crown size={28} color="#FFF" fill="#FFF" />
                            <View style={styles.winnerInfo}>
                                <Text style={styles.winnerLabel}>
                                    {isKurdish ? 'باشترین وەڵامی هەڵە!' : 'Best Wrong Answer!'}
                                </Text>
                                <Text style={styles.winnerName}>
                                    {players[rankings[0].playerIndex].name}
                                </Text>
                            </View>
                            <View style={styles.winnerPoints}>
                                <Text style={styles.winnerPointsText}>+100</Text>
                            </View>
                        </LinearGradient>
                    </MotiView>
                )}

                {/* All Answers */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                        {isKurdish ? 'هەموو وەڵامەکان' : 'All Answers'}
                    </Text>

                    {answers
                        .map((answer, idx) => ({
                            answer,
                            idx,
                            player: players[answer.playerIndex],
                            rank: getAnswerRank(idx),
                        }))
                        .sort((a, b) => a.rank - b.rank)
                        .map(({ answer, idx, player, rank }, i) => (
                            <AnswerResultCard
                                key={idx}
                                player={player}
                                answer={answer}
                                isCorrect={isAnswerCorrect(answer.answer)}
                                voteCount={voteCounts[idx]}
                                rank={rank}
                                pointsEarned={getPointsEarned(answer, idx)}
                                isWinner={rank === 1 && voteCounts[idx] > 0}
                                colors={colors}
                                isDark={isDark}
                                isKurdish={isKurdish}
                                delay={i * 100 + 700}
                            />
                        ))
                    }
                </View>

                {/* Scoreboard */}
                {showScoreboard && (
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        style={styles.section}
                    >
                        <View style={styles.sectionHeader}>
                            <Trophy size={20} color="#FFD700" />
                            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                                {isKurdish ? 'خشتەی خاڵەکان' : 'Scoreboard'}
                            </Text>
                        </View>

                        <View style={styles.scoreboardContainer}>
                            {sortedPlayers.map(({ player, score }, rank) => (
                                <ScoreEntry
                                    key={rank}
                                    player={player}
                                    score={score}
                                    rank={rank + 1}
                                    colors={colors}
                                    isDark={isDark}
                                    delay={rank * 100}
                                />
                            ))}
                        </View>
                    </MotiView>
                )}

                {/* Action Buttons */}
                {showScoreboard && (
                    <MotiView
                        from={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={styles.actionsContainer}
                    >
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={handleNextQuestion}
                            style={styles.nextBtnWrap}
                        >
                            <LinearGradient
                                colors={['#D900FF', '#7000FF']}
                                style={styles.nextBtn}
                            >
                                <Text style={styles.nextBtnText}>
                                    {currentQuestionIndex >= questions.length - 1
                                        ? (isKurdish ? 'بینینی ئەنجامەکان' : 'See Final Results')
                                        : (isKurdish ? 'پرسیاری داهاتوو' : 'Next Question')
                                    }
                                </Text>
                                <ChevronRight size={20} color="#FFF" />
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.homeBtn, { backgroundColor: isDark ? '#1A0B2E' : '#FFF' }]}
                            onPress={() => navigation.navigate('Home')}
                        >
                            <Home size={20} color={colors.text.primary} />
                            <Text style={[styles.homeBtnText, { color: colors.text.primary }]}>
                                {isKurdish ? 'ماڵەوە' : 'Home'}
                            </Text>
                        </TouchableOpacity>
                    </MotiView>
                )}
            </ScrollView>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },

    // Header
    header: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    roundText: {
        fontSize: 14,
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '800',
        marginTop: 4,
    },

    // Question Recap
    questionRecap: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    questionRecapLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    questionRecapText: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 12,
    },
    correctAnswerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    correctAnswerLabel: {
        color: '#10B981',
        fontSize: 14,
        fontWeight: '600',
    },

    // Winner Banner
    winnerBanner: {
        marginBottom: 20,
        borderRadius: 20,
        overflow: 'hidden',
    },
    winnerBannerGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    winnerInfo: {
        flex: 1,
        marginLeft: 16,
    },
    winnerLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontWeight: '600',
    },
    winnerName: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: '800',
    },
    winnerPoints: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 16,
    },
    winnerPointsText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '900',
    },

    // Section
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 14,
    },

    // Result Card
    resultCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 16,
        marginBottom: 10,
        position: 'relative',
    },
    rankBadge: {
        position: 'absolute',
        top: -6,
        left: -6,
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    rankBadgeText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '700',
    },
    playerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    playerAvatarText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    resultContent: {
        flex: 1,
    },
    playerName: {
        fontSize: 14,
        fontWeight: '600',
    },
    answerText: {
        fontSize: 13,
        marginTop: 2,
    },
    voteCountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginRight: 12,
    },
    voteCountText: {
        color: '#10B981',
        fontSize: 16,
        fontWeight: '800',
    },
    pointsBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    pointsText: {
        fontSize: 14,
        fontWeight: '800',
    },
    correctXBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#EF4444',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },

    // Scoreboard
    scoreboardContainer: {
        gap: 8,
    },
    scoreEntry: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    scoreRank: {
        width: 28,
        alignItems: 'center',
    },
    scoreRankText: {
        fontSize: 13,
        fontWeight: '600',
    },
    scoreAvatar: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    scoreAvatarText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    },
    scoreName: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
    },
    scorePoints: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    scorePointsText: {
        color: '#FFD700',
        fontSize: 17,
        fontWeight: '800',
    },

    // Actions
    actionsContainer: {
        gap: 12,
    },
    nextBtnWrap: {
        width: '100%',
    },
    nextBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderRadius: 28,
        gap: 8,
    },
    nextBtnText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '700',
    },
    homeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderRadius: 25,
        gap: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    homeBtnText: {
        fontSize: 15,
        fontWeight: '600',
    },

    kurdishFont: {
        fontFamily: 'System',
    },
});
