import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView,
} from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import {
    Vote,
    Clock,
    Check,
    Users,
    ChevronRight,
} from 'lucide-react-native';

import { AnimatedScreen } from '../../components/AnimatedScreen';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');
const CANVAS_SIZE = (width - 60) / 2;

// Player Drawing Card for Voting
const VotingCard = ({ player, playerIndex, drawings, isSelected, onVote, colors, isDark }) => (
    <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onVote(playerIndex)}
        style={[
            styles.votingCard,
            { backgroundColor: isDark ? '#1A0B2E' : '#FFF' },
            isSelected && { borderColor: '#EF4444', borderWidth: 3 },
        ]}
    >
        {/* Player Header */}
        <View style={[styles.votingCardHeader, { backgroundColor: player.color }]}>
            <Text style={styles.votingCardName}>{player.name}</Text>
            {isSelected && (
                <View style={styles.selectedBadge}>
                    <Check size={14} color="#FFF" />
                </View>
            )}
        </View>

        {/* Drawing Preview */}
        <View style={styles.votingCardCanvas}>
            <Svg width="100%" height="100%" viewBox={`0 0 ${width - 32} ${width - 32}`}>
                {drawings?.map((stroke, index) => (
                    <Path
                        key={index}
                        d={stroke.path}
                        stroke={stroke.color}
                        strokeWidth={stroke.size}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                ))}
            </Svg>
        </View>
    </TouchableOpacity>
);

// Current Voter Indicator
const VoterIndicator = ({ player, isKurdish }) => (
    <View style={[styles.voterIndicator, { backgroundColor: player.color }]}>
        <Vote size={20} color="#FFF" />
        <Text style={styles.voterIndicatorText}>
            {player.name} {isKurdish ? 'دەنگ دەدات' : 'is voting'}
        </Text>
    </View>
);

export default function ImpostorDrawVote({ navigation, route }) {
    const { isKurdish } = useLanguage();
    const { colors, isDark } = useTheme();

    const {
        players,
        impostorIndex,
        word,
        voteTime,
        rounds,
        currentRound,
        scores,
        allPlayerDrawings
    } = route.params;

    // Voting state
    const [currentVoterIndex, setCurrentVoterIndex] = useState(0);
    const [votes, setVotes] = useState({}); // { voterIndex: votedForIndex }
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [timeLeft, setTimeLeft] = useState(voteTime);
    const [phase, setPhase] = useState('voting'); // voting, submitted

    const currentVoter = players[currentVoterIndex];
    const allVoted = Object.keys(votes).length === players.length;

    // Timer
    useEffect(() => {
        if (timeLeft > 0 && phase === 'voting') {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && phase === 'voting') {
            // Auto-select random if time runs out
            if (selectedPlayer === null) {
                const randomVote = Math.floor(Math.random() * players.length);
                handleConfirmVote(randomVote);
            } else {
                handleConfirmVote(selectedPlayer);
            }
        }
    }, [timeLeft, phase]);

    // Check if all voted
    useEffect(() => {
        if (allVoted) {
            // Navigate to results
            setTimeout(() => {
                navigation.replace('ImpostorDrawResult', {
                    players,
                    impostorIndex,
                    word,
                    votes,
                    rounds,
                    currentRound,
                    scores,
                    allPlayerDrawings,
                });
            }, 1500);
        }
    }, [allVoted]);

    // Handle vote selection
    const handleVoteSelect = (playerIndex) => {
        // Can't vote for yourself
        if (playerIndex === currentVoterIndex) return;
        setSelectedPlayer(playerIndex);
    };

    // Confirm vote and move to next voter
    const handleConfirmVote = (voteIndex) => {
        const newVotes = { ...votes, [currentVoterIndex]: voteIndex ?? selectedPlayer };
        setVotes(newVotes);

        if (currentVoterIndex < players.length - 1) {
            // Move to next voter
            setPhase('submitted');
            setTimeout(() => {
                setCurrentVoterIndex(currentVoterIndex + 1);
                setSelectedPlayer(null);
                setTimeLeft(voteTime);
                setPhase('voting');
            }, 1500);
        }
    };

    return (
        <AnimatedScreen>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Vote size={24} color={colors.primary} />
                        <Text style={[styles.headerTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'کاتی دەنگدان' : 'Voting Time'}
                        </Text>
                    </View>

                    <View style={[styles.timerBadge, { backgroundColor: timeLeft <= 5 ? '#EF4444' : colors.primary }]}>
                        <Clock size={16} color="#FFF" />
                        <Text style={styles.timerText}>{timeLeft}s</Text>
                    </View>
                </View>

                {/* Voting Progress */}
                <View style={styles.progressContainer}>
                    {players.map((player, index) => (
                        <View
                            key={index}
                            style={[
                                styles.progressDot,
                                { backgroundColor: player.color },
                                votes[index] !== undefined && styles.progressDotComplete,
                                index === currentVoterIndex && styles.progressDotCurrent,
                            ]}
                        >
                            {votes[index] !== undefined && (
                                <Check size={12} color="#FFF" />
                            )}
                        </View>
                    ))}
                </View>

                {/* Current Voter */}
                {!allVoted && (
                    <VoterIndicator player={currentVoter} isKurdish={isKurdish} />
                )}

                {/* All Voted Message */}
                {allVoted && (
                    <MotiView
                        from={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={styles.allVotedContainer}
                    >
                        <LinearGradient colors={['#D900FF', '#7000FF']} style={styles.allVotedBadge}>
                            <Users size={24} color="#FFF" />
                            <Text style={[styles.allVotedText, isKurdish && styles.kurdishFont]}>
                                {isKurdish ? 'هەمووان دەنگیان دا!' : 'All votes are in!'}
                            </Text>
                        </LinearGradient>
                    </MotiView>
                )}

                {/* Voting Cards */}
                {phase === 'voting' && !allVoted && (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.cardsContainer}
                    >
                        <Text style={[styles.instructionText, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'کێ دزەکارە؟ هەڵبژێرە!' : 'Who is the impostor? Tap to vote!'}
                        </Text>

                        <View style={styles.cardsGrid}>
                            {players.map((player, index) => (
                                <VotingCard
                                    key={index}
                                    player={player}
                                    playerIndex={index}
                                    drawings={allPlayerDrawings[index]}
                                    isSelected={selectedPlayer === index}
                                    onVote={handleVoteSelect}
                                    colors={colors}
                                    isDark={isDark}
                                />
                            ))}
                        </View>

                        {/* Self Vote Warning */}
                        <Text style={[styles.warningText, { color: colors.text.muted }]}>
                            {isKurdish ? '(ناتوانیت بۆ خۆت دەنگ بدەیت)' : '(You cannot vote for yourself)'}
                        </Text>
                    </ScrollView>
                )}

                {/* Submit Phase */}
                {phase === 'submitted' && !allVoted && (
                    <MotiView
                        from={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: 'timing', duration: 250 }}
                        style={styles.submittedContainer}
                    >
                        <View style={styles.submittedCheckCircle}>
                            <Check size={40} color="#FFF" />
                        </View>
                        <Text style={[styles.submittedText, { color: colors.text.primary }]}>
                            {isKurdish ? 'دەنگەکەت تۆمار کرا!' : 'Vote Submitted!'}
                        </Text>
                        <Text style={[styles.passDeviceText, { color: colors.text.secondary }]}>
                            {isKurdish
                                ? `ئامرازەکە بدە بە ${players[currentVoterIndex + 1]?.name}`
                                : `Pass device to ${players[currentVoterIndex + 1]?.name}`
                            }
                        </Text>
                    </MotiView>
                )}

                {/* Confirm Vote Button */}
                {phase === 'voting' && selectedPlayer !== null && !allVoted && (
                    <MotiView
                        from={{ translateY: 50, opacity: 0 }}
                        animate={{ translateY: 0, opacity: 1 }}
                        style={styles.confirmBtnWrap}
                    >
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => handleConfirmVote()}
                        >
                            <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.confirmBtn}>
                                <Text style={[styles.confirmBtnText, isKurdish && styles.kurdishFont]}>
                                    {isKurdish
                                        ? `دەنگ بدە بۆ ${players[selectedPlayer].name}`
                                        : `Vote for ${players[selectedPlayer].name}`
                                    }
                                </Text>
                                <ChevronRight size={20} color="#FFF" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </MotiView>
                )}
            </View>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
    },
    timerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    timerText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '800',
    },

    // Progress
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        paddingVertical: 12,
    },
    progressDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.4,
    },
    progressDotComplete: {
        opacity: 1,
    },
    progressDotCurrent: {
        opacity: 1,
        borderWidth: 3,
        borderColor: '#FFF',
    },

    // Voter Indicator
    voterIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16,
        gap: 10,
        marginBottom: 12,
    },
    voterIndicatorText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },

    // All Voted
    allVotedContainer: {
        alignItems: 'center',
        marginVertical: 40,
    },
    allVotedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 30,
        gap: 12,
    },
    allVotedText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },

    // Cards
    cardsContainer: {
        paddingHorizontal: 16,
        paddingBottom: 120,
    },
    instructionText: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16,
    },
    cardsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center',
    },
    votingCard: {
        width: CANVAS_SIZE,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    votingCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    votingCardName: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    selectedBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#EF4444',
        alignItems: 'center',
        justifyContent: 'center',
    },
    votingCardCanvas: {
        aspectRatio: 1,
        backgroundColor: '#FFF',
    },
    warningText: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 16,
    },

    // Submitted
    submittedContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submittedCheckCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#10B981',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    submittedText: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 8,
    },
    passDeviceText: {
        fontSize: 16,
    },

    // Confirm Button
    confirmBtnWrap: {
        position: 'absolute',
        bottom: 24,
        left: 16,
        right: 16,
    },
    confirmBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderRadius: 28,
        gap: 8,
    },
    confirmBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },

    kurdishFont: {
        fontFamily: 'System',
    },
});
