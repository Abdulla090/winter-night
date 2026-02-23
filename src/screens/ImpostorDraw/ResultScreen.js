import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView,
    Vibration,
} from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import {
    Skull,
    Trophy,
    Star,
    Check,
    X,
    RotateCcw,
    Home,
    ChevronRight,
    Users,
    Target,
    Crown,
} from 'lucide-react-native';

import { AnimatedScreen } from '../../components/AnimatedScreen';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

// Vote Result Card
const VoteResultCard = ({ player, votesReceived, isImpostor, wasCorrectVote, colors, isDark }) => (
    <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 200 }}
        style={[
            styles.voteResultCard,
            { backgroundColor: isDark ? '#1A0B2E' : '#FFF' },
            isImpostor && { borderColor: '#EF4444', borderWidth: 2 },
        ]}
    >
        <View style={[styles.voteResultAvatar, { backgroundColor: player.color }]}>
            <Text style={styles.voteResultAvatarText}>{player.name.charAt(0)}</Text>
            {isImpostor && (
                <View style={styles.impostorBadge}>
                    <Skull size={12} color="#FFF" />
                </View>
            )}
        </View>

        <View style={styles.voteResultInfo}>
            <Text style={[styles.voteResultName, { color: colors.text.primary }]}>
                {player.name}
            </Text>
            <Text style={[styles.voteResultVotes, { color: colors.text.secondary }]}>
                {votesReceived} vote{votesReceived !== 1 ? 's' : ''}
            </Text>
        </View>

        {isImpostor && (
            <View style={styles.impostorLabel}>
                <Skull size={16} color="#EF4444" />
                <Text style={styles.impostorLabelText}>IMPOSTOR</Text>
            </View>
        )}
    </MotiView>
);

// Scoreboard Entry
const ScoreEntry = ({ player, score, rank, isWinner, colors, isDark, delay }) => (
    <MotiView
        from={{ opacity: 0, translateX: -20 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ type: 'spring', delay, damping: 15 }}
        style={[
            styles.scoreEntry,
            { backgroundColor: isDark ? '#1A0B2E' : '#FFF' },
            isWinner && { borderColor: '#FFD700', borderWidth: 2 },
        ]}
    >
        <View style={styles.scoreRank}>
            {rank === 1 ? (
                <Crown size={20} color="#FFD700" fill="#FFD700" />
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

export default function ImpostorDrawResult({ navigation, route }) {
    const { isKurdish } = useLanguage();
    const { colors, isDark } = useTheme();

    const {
        players,
        impostorIndex,
        word,
        votes,
        rounds,
        currentRound,
        scores: initialScores,
        allPlayerDrawings
    } = route.params;

    // Calculate results
    const [showImpostor, setShowImpostor] = useState(false);
    const [showScores, setShowScores] = useState(false);
    const [updatedScores, setUpdatedScores] = useState([...initialScores]);

    // Count votes for each player
    const voteCounts = players.map((_, index) =>
        Object.values(votes).filter(v => v === index).length
    );

    // Check if impostor was caught (got most votes)
    const maxVotes = Math.max(...voteCounts);
    const mostVotedIndex = voteCounts.indexOf(maxVotes);
    const impostorCaught = mostVotedIndex === impostorIndex;
    const impostor = players[impostorIndex];

    // Calculate new scores
    useEffect(() => {
        const timer = setTimeout(() => {
            const newScores = [...initialScores];

            if (impostorCaught) {
                // Regular players who voted correctly get +100 points
                Object.entries(votes).forEach(([voterIndex, votedFor]) => {
                    if (parseInt(voterIndex) !== impostorIndex && votedFor === impostorIndex) {
                        newScores[parseInt(voterIndex)] += 100;
                    }
                });
            } else {
                // Impostor wins - gets +200 points
                newScores[impostorIndex] += 200;
            }

            setUpdatedScores(newScores);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    // Animation sequence
    useEffect(() => {
        // Show impostor reveal after 1 second
        const timer1 = setTimeout(() => {
            setShowImpostor(true);
            Vibration.vibrate([0, 200, 100, 200]);
        }, 1000);

        // Show scores after 3 seconds
        const timer2 = setTimeout(() => {
            setShowScores(true);
        }, 3000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    // Handle next round
    const handleNextRound = () => {
        if (currentRound >= rounds) {
            // Game over - show final results
            navigation.replace('ImpostorDrawFinal', {
                players,
                scores: updatedScores,
            });
        } else {
            // Next round - go back to role reveal
            navigation.replace('ImpostorDrawRoleReveal', {
                players,
                words: route.params.words || ['Cat', 'Dog', 'House', 'Car', 'Tree'], // fallback
                drawTime: route.params.drawTime || 60,
                discussTime: route.params.discussTime || 30,
                voteTime: route.params.voteTime || 20,
                rounds,
                currentRound: currentRound + 1,
                scores: updatedScores,
            });
        }
    };

    // Get sorted scores for leaderboard
    const sortedPlayers = players
        .map((player, index) => ({ player, score: updatedScores[index], index }))
        .sort((a, b) => b.score - a.score);

    return (
        <AnimatedScreen>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >
                {/* Round Header */}
                <View style={styles.header}>
                    <Text style={[styles.roundText, { color: colors.text.secondary }]}>
                        {isKurdish ? `خولی ${currentRound}/${rounds}` : `Round ${currentRound}/${rounds}`}
                    </Text>
                    <Text style={[styles.headerTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'ئەنجامەکان' : 'Results'}
                    </Text>
                </View>

                {/* The Word Reveal */}
                <MotiView
                    from={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={[styles.wordReveal, { backgroundColor: isDark ? '#1A0B2E' : '#FFF' }]}
                >
                    <Text style={[styles.wordRevealLabel, { color: colors.text.secondary }]}>
                        {isKurdish ? 'وشەکە بوو:' : 'The word was:'}
                    </Text>
                    <Text style={[styles.wordRevealText, { color: colors.primary }]}>{word}</Text>
                </MotiView>

                {/* Vote Results */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'ئەنجامی دەنگەکان' : 'Vote Results'}
                    </Text>

                    <View style={styles.voteResults}>
                        {players.map((player, index) => (
                            <MotiView
                                key={index}
                                from={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'spring', delay: index * 100 }}
                            >
                                <VoteResultCard
                                    player={player}
                                    votesReceived={voteCounts[index]}
                                    isImpostor={showImpostor && index === impostorIndex}
                                    wasCorrectVote={votes[index] === impostorIndex}
                                    colors={colors}
                                    isDark={isDark}
                                />
                            </MotiView>
                        ))}
                    </View>
                </View>

                {/* Impostor Reveal */}
                {showImpostor && (
                    <MotiView
                        from={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', damping: 10 }}
                        style={styles.impostorRevealContainer}
                    >
                        <LinearGradient
                            colors={impostorCaught ? ['#10B981', '#059669'] : ['#EF4444', '#DC2626']}
                            style={styles.impostorRevealCard}
                        >
                            <View style={styles.impostorRevealIcon}>
                                {impostorCaught ? (
                                    <Check size={40} color="#FFF" strokeWidth={3} />
                                ) : (
                                    <Skull size={40} color="#FFF" />
                                )}
                            </View>

                            <Text style={[styles.impostorRevealTitle, isKurdish && styles.kurdishFont]}>
                                {impostorCaught
                                    ? (isKurdish ? 'دزەکار گیرا!' : 'Impostor Caught!')
                                    : (isKurdish ? 'دزەکار هەڵاتەوە!' : 'Impostor Escaped!')
                                }
                            </Text>

                            <View style={styles.impostorRevealPlayer}>
                                <View style={[styles.impostorRevealAvatar, { backgroundColor: impostor.color }]}>
                                    <Text style={styles.impostorRevealAvatarText}>{impostor.name.charAt(0)}</Text>
                                </View>
                                <Text style={styles.impostorRevealName}>{impostor.name}</Text>
                            </View>

                            <Text style={styles.impostorRevealSub}>
                                {impostorCaught
                                    ? (isKurdish ? 'یاریزانەکان بردیانەوە!' : '+100 points to correct voters!')
                                    : (isKurdish ? `${impostor.name} +200 خاڵ!` : `${impostor.name} +200 points!`)
                                }
                            </Text>
                        </LinearGradient>
                    </MotiView>
                )}

                {/* Scoreboard */}
                {showScores && (
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        style={styles.section}
                    >
                        <View style={styles.sectionHeader}>
                            <Trophy size={20} color="#FFD700" />
                            <Text style={[styles.sectionTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                                {isKurdish ? 'خشتەی خاڵەکان' : 'Scoreboard'}
                            </Text>
                        </View>

                        <View style={styles.scoreboardContainer}>
                            {sortedPlayers.map(({ player, score, index }, rank) => (
                                <ScoreEntry
                                    key={index}
                                    player={player}
                                    score={score}
                                    rank={rank + 1}
                                    isWinner={rank === 0}
                                    colors={colors}
                                    isDark={isDark}
                                    delay={300 + (rank * 100)}
                                />
                            ))}
                        </View>
                    </MotiView>
                )}

                {/* Action Buttons */}
                {showScores && (
                    <MotiView
                        from={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={styles.actionsContainer}
                    >
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={handleNextRound}
                            style={styles.nextRoundBtnWrap}
                        >
                            <LinearGradient
                                colors={['#D900FF', '#7000FF']}
                                style={styles.nextRoundBtn}
                            >
                                <Text style={[styles.nextRoundBtnText, isKurdish && styles.kurdishFont]}>
                                    {currentRound >= rounds
                                        ? (isKurdish ? 'بینینی ئەنجامەکان' : 'See Final Results')
                                        : (isKurdish ? 'خولی داهاتوو' : 'Next Round')
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
                            <Text style={[styles.homeBtnText, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
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
        paddingVertical: 20,
    },
    roundText: {
        fontSize: 14,
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        marginTop: 4,
    },

    // Word Reveal
    wordReveal: {
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    wordRevealLabel: {
        fontSize: 14,
        marginBottom: 8,
    },
    wordRevealText: {
        fontSize: 36,
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
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
    },

    // Vote Results
    voteResults: {
        gap: 12,
    },
    voteResultCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    voteResultAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    voteResultAvatarText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
    impostorBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#EF4444',
        alignItems: 'center',
        justifyContent: 'center',
    },
    voteResultInfo: {
        flex: 1,
        marginLeft: 14,
    },
    voteResultName: {
        fontSize: 16,
        fontWeight: '600',
    },
    voteResultVotes: {
        fontSize: 13,
        marginTop: 2,
    },
    impostorLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 6,
    },
    impostorLabelText: {
        color: '#EF4444',
        fontSize: 12,
        fontWeight: '700',
    },

    // Impostor Reveal
    impostorRevealContainer: {
        marginBottom: 24,
    },
    impostorRevealCard: {
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
    },
    impostorRevealIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    impostorRevealTitle: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 20,
    },
    impostorRevealPlayer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 30,
        gap: 12,
        marginBottom: 16,
    },
    impostorRevealAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    impostorRevealAvatarText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
    impostorRevealName: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
    impostorRevealSub: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
    },

    // Scoreboard
    scoreboardContainer: {
        gap: 10,
    },
    scoreEntry: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    scoreRank: {
        width: 32,
        alignItems: 'center',
    },
    scoreRankText: {
        fontSize: 14,
        fontWeight: '600',
    },
    scoreAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    scoreAvatarText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    scoreName: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
    },
    scorePoints: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    scorePointsText: {
        color: '#FFD700',
        fontSize: 18,
        fontWeight: '800',
    },

    // Actions
    actionsContainer: {
        gap: 12,
    },
    nextRoundBtnWrap: {
        width: '100%',
    },
    nextRoundBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderRadius: 28,
        gap: 8,
    },
    nextRoundBtnText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
    homeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 52,
        borderRadius: 26,
        gap: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    homeBtnText: {
        fontSize: 16,
        fontWeight: '600',
    },

    kurdishFont: {
        fontFamily: 'System',
    },
});
