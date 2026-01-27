import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Dimensions,
} from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Vote,
    Clock,
    Check,
    X,
    ThumbsUp,
    AlertTriangle,
    ChevronRight,
} from 'lucide-react-native';

import { AnimatedScreen } from '../../components/AnimatedScreen';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

// Answer Card for Voting
const AnswerCard = ({
    answer,
    index,
    isCorrect,
    isSelected,
    isOwnAnswer,
    onVote,
    showVotes,
    voteCount,
    colors,
    isDark,
    isKurdish,
}) => {
    const isEmpty = !answer.answer || answer.isTimeout;

    return (
        <TouchableOpacity
            activeOpacity={isOwnAnswer || isEmpty ? 1 : 0.8}
            onPress={() => !isOwnAnswer && !isEmpty && onVote(index)}
            disabled={isOwnAnswer || isEmpty}
            style={[
                styles.answerCard,
                {
                    backgroundColor: isDark ? '#1A0B2E' : '#FFF',
                    borderColor: isCorrect
                        ? '#EF4444'
                        : isSelected
                            ? '#10B981'
                            : (isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0'),
                    borderWidth: isCorrect || isSelected ? 3 : 1,
                    opacity: isOwnAnswer ? 0.5 : 1,
                }
            ]}
        >
            {/* Answer Number */}
            <View style={[
                styles.answerNumber,
                { backgroundColor: isCorrect ? '#EF4444' : (isSelected ? '#10B981' : colors.primary) }
            ]}>
                <Text style={styles.answerNumberText}>{index + 1}</Text>
            </View>

            {/* Answer Text */}
            <View style={styles.answerContent}>
                {isEmpty ? (
                    <Text style={[styles.answerText, { color: colors.text.muted, fontStyle: 'italic' }]}>
                        {isKurdish ? '(وەڵام نەدا)' : '(No answer)'}
                    </Text>
                ) : (
                    <Text style={[styles.answerText, { color: colors.text.primary }]}>
                        "{answer.answer}"
                    </Text>
                )}

                {/* Correct Answer Warning */}
                {isCorrect && (
                    <View style={styles.correctWarning}>
                        <X size={14} color="#EF4444" />
                        <Text style={styles.correctWarningText}>
                            {isKurdish ? 'وەڵامی دروستە!' : 'CORRECT ANSWER!'}
                        </Text>
                    </View>
                )}

                {/* Own Answer Label */}
                {isOwnAnswer && (
                    <Text style={[styles.ownAnswerLabel, { color: colors.text.muted }]}>
                        {isKurdish ? '(وەڵامی تۆ)' : '(Your answer)'}
                    </Text>
                )}
            </View>

            {/* Vote Button / Count */}
            {!isOwnAnswer && !isEmpty && !isCorrect && (
                <View style={styles.voteSection}>
                    {showVotes ? (
                        <View style={styles.voteCount}>
                            <ThumbsUp size={16} color="#10B981" fill="#10B981" />
                            <Text style={styles.voteCountText}>{voteCount}</Text>
                        </View>
                    ) : isSelected ? (
                        <View style={styles.votedBadge}>
                            <Check size={16} color="#FFF" />
                        </View>
                    ) : (
                        <View style={styles.voteBtn}>
                            <ThumbsUp size={18} color={colors.text.muted} />
                        </View>
                    )}
                </View>
            )}

            {/* Penalty Badge for Correct */}
            {isCorrect && (
                <View style={styles.penaltyBadge}>
                    <Text style={styles.penaltyText}>-50</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

// Current Voter Indicator
const VoterIndicator = ({ player, currentVoterIndex, totalVoters, isKurdish }) => (
    <View style={[styles.voterIndicator, { backgroundColor: player.color }]}>
        <Vote size={18} color="#FFF" />
        <Text style={styles.voterIndicatorText}>
            {player.name} {isKurdish ? 'دەنگ دەدات' : 'is voting'}
        </Text>
        <Text style={styles.voterIndicatorCount}>
            ({currentVoterIndex + 1}/{totalVoters})
        </Text>
    </View>
);

// Pass Device for Voting
const PassDeviceVote = ({ nextPlayer, onReady, isKurdish, colors }) => (
    <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={styles.passDeviceContainer}
    >
        <Vote size={50} color="#10B981" />
        <Text style={[styles.passDeviceTitle, { color: colors.text.primary }]}>
            {isKurdish ? 'ئامرازەکە بدە بە' : 'Pass device to'}
        </Text>
        <View style={[styles.passDevicePlayerBadge, { backgroundColor: nextPlayer.color }]}>
            <Text style={styles.passDevicePlayerName}>{nextPlayer.name}</Text>
        </View>
        <Text style={[styles.passDeviceSubtitle, { color: colors.text.secondary }]}>
            {isKurdish ? 'بۆ دەنگدان' : 'for voting'}
        </Text>

        <TouchableOpacity activeOpacity={0.9} onPress={onReady} style={styles.readyBtnWrap}>
            <LinearGradient colors={['#10B981', '#059669']} style={styles.readyBtn}>
                <Text style={styles.readyBtnText}>
                    {isKurdish ? 'ئامادەم بۆ دەنگدان' : 'Ready to Vote'}
                </Text>
                <ChevronRight size={20} color="#FFF" />
            </LinearGradient>
        </TouchableOpacity>
    </MotiView>
);

export default function WrongAnswerVote({ navigation, route }) {
    const { isKurdish } = useLanguage();
    const { colors, isDark } = useTheme();

    const {
        players,
        questions,
        currentQuestionIndex,
        answerTime,
        voteTime,
        scores,
        answers,
        correctAnswer,
    } = route.params;

    // Voting state
    const [currentVoterIndex, setCurrentVoterIndex] = useState(0);
    const [votes, setVotes] = useState({}); // { voterIndex: answerIndex }
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [phase, setPhase] = useState('ready'); // ready, voting, submitted
    const [timeLeft, setTimeLeft] = useState(voteTime);

    const currentVoter = players[currentVoterIndex];
    const allVoted = Object.keys(votes).length === players.length;

    // Check if answer is correct (compare case-insensitive)
    const isAnswerCorrect = (answerText) => {
        if (!answerText) return false;
        return answerText.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    };

    // Timer for voting
    useEffect(() => {
        if (phase === 'voting' && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (phase === 'voting' && timeLeft === 0) {
            // Auto-submit (no vote if nothing selected)
            handleConfirmVote();
        }
    }, [phase, timeLeft]);

    // Check if all voted
    useEffect(() => {
        if (allVoted) {
            setTimeout(() => {
                navigation.replace('WrongAnswerResult', {
                    players,
                    questions,
                    currentQuestionIndex,
                    answerTime,
                    voteTime,
                    scores,
                    answers,
                    correctAnswer,
                    votes,
                });
            }, 1000);
        }
    }, [allVoted]);

    // Handle vote selection
    const handleVoteForAnswer = (answerIndex) => {
        // Can't vote for own answer
        const answer = answers[answerIndex];
        if (answer.playerIndex === currentVoterIndex) return;
        // Can't vote for correct answers
        if (isAnswerCorrect(answer.answer)) return;

        setSelectedAnswer(answerIndex);
    };

    // Confirm vote
    const handleConfirmVote = () => {
        if (selectedAnswer !== null) {
            setVotes(prev => ({ ...prev, [currentVoterIndex]: selectedAnswer }));
        }

        setPhase('submitted');

        setTimeout(() => {
            if (currentVoterIndex < players.length - 1) {
                setPhase('ready');
                setCurrentVoterIndex(currentVoterIndex + 1);
                setSelectedAnswer(null);
                setTimeLeft(voteTime);
            }
        }, 1000);
    };

    // Start voting
    const handleStartVoting = () => {
        setPhase('voting');
    };

    return (
        <AnimatedScreen>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Vote size={22} color={colors.primary} />
                        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                            {isKurdish ? 'دەنگدان' : 'Vote for Best'}
                        </Text>
                    </View>

                    {phase === 'voting' && (
                        <View style={[
                            styles.timerBadge,
                            { backgroundColor: timeLeft <= 5 ? '#EF4444' : colors.primary }
                        ]}>
                            <Clock size={14} color="#FFF" />
                            <Text style={styles.timerText}>{timeLeft}s</Text>
                        </View>
                    )}
                </View>

                {/* Question Reminder */}
                <View style={[styles.questionReminder, { backgroundColor: isDark ? '#1A0B2E' : '#F1F5F9' }]}>
                    <Text style={[styles.questionReminderLabel, { color: colors.text.muted }]}>
                        {isKurdish ? 'پرسیارەکە:' : 'Question:'}
                    </Text>
                    <Text style={[styles.questionReminderText, { color: colors.text.primary }]}>
                        {questions[currentQuestionIndex].q}
                    </Text>
                    <View style={styles.correctAnswerRow}>
                        <Check size={14} color="#10B981" />
                        <Text style={styles.correctAnswerLabel}>
                            {isKurdish ? 'وەڵامی دروست:' : 'Correct answer:'} {correctAnswer}
                        </Text>
                    </View>
                </View>

                {/* Main Content */}
                {phase === 'ready' ? (
                    <PassDeviceVote
                        nextPlayer={currentVoter}
                        onReady={handleStartVoting}
                        isKurdish={isKurdish}
                        colors={colors}
                    />
                ) : phase === 'voting' ? (
                    <View style={styles.votingContent}>
                        <VoterIndicator
                            player={currentVoter}
                            currentVoterIndex={currentVoterIndex}
                            totalVoters={players.length}
                            isKurdish={isKurdish}
                        />

                        <Text style={[styles.votingInstruction, { color: colors.text.secondary }]}>
                            {isKurdish
                                ? 'باشترین وەڵامی هەڵە هەڵبژێرە!'
                                : 'Vote for the best WRONG answer!'
                            }
                        </Text>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.answersContainer}
                        >
                            {answers.map((answer, index) => (
                                <AnswerCard
                                    key={index}
                                    answer={answer}
                                    index={index}
                                    isCorrect={isAnswerCorrect(answer.answer)}
                                    isSelected={selectedAnswer === index}
                                    isOwnAnswer={answer.playerIndex === currentVoterIndex}
                                    onVote={handleVoteForAnswer}
                                    showVotes={false}
                                    voteCount={0}
                                    colors={colors}
                                    isDark={isDark}
                                    isKurdish={isKurdish}
                                />
                            ))}
                        </ScrollView>

                        {/* Confirm Vote Button */}
                        {selectedAnswer !== null && (
                            <MotiView
                                from={{ translateY: 50, opacity: 0 }}
                                animate={{ translateY: 0, opacity: 1 }}
                                style={styles.confirmBtnWrap}
                            >
                                <TouchableOpacity activeOpacity={0.9} onPress={handleConfirmVote}>
                                    <LinearGradient colors={['#10B981', '#059669']} style={styles.confirmBtn}>
                                        <ThumbsUp size={20} color="#FFF" fill="#FFF" />
                                        <Text style={styles.confirmBtnText}>
                                            {isKurdish ? 'دەنگ بدە' : 'Confirm Vote'}
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </MotiView>
                        )}
                    </View>
                ) : (
                    /* Submitted */
                    <MotiView
                        from={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: 'timing', duration: 250 }}
                        style={styles.submittedContainer}
                    >
                        <View style={styles.submittedCheckCircle}>
                            <Check size={40} color="#FFF" strokeWidth={3} />
                        </View>
                        <Text style={[styles.submittedText, { color: colors.text.primary }]}>
                            {isKurdish ? 'دەنگەکەت تۆمار کرا!' : 'Vote Submitted!'}
                        </Text>
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
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
    },
    timerText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
    },

    // Question Reminder
    questionReminder: {
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
    },
    questionReminderLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    questionReminderText: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    correctAnswerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    correctAnswerLabel: {
        color: '#10B981',
        fontSize: 13,
        fontWeight: '600',
    },

    // Voter Indicator
    voterIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        marginBottom: 12,
        gap: 8,
    },
    voterIndicatorText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    voterIndicatorCount: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
    },

    // Voting Content
    votingContent: {
        flex: 1,
    },
    votingInstruction: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16,
        marginHorizontal: 16,
    },
    answersContainer: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },

    // Answer Card
    answerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 16,
        marginBottom: 12,
    },
    answerNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    answerNumberText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
    answerContent: {
        flex: 1,
    },
    answerText: {
        fontSize: 16,
        fontWeight: '600',
    },
    correctWarning: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 6,
    },
    correctWarningText: {
        color: '#EF4444',
        fontSize: 11,
        fontWeight: '700',
    },
    ownAnswerLabel: {
        fontSize: 11,
        marginTop: 4,
    },
    voteSection: {
        marginLeft: 12,
    },
    voteBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    votedBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#10B981',
        alignItems: 'center',
        justifyContent: 'center',
    },
    voteCount: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    voteCountText: {
        color: '#10B981',
        fontSize: 18,
        fontWeight: '800',
    },
    penaltyBadge: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        marginLeft: 12,
    },
    penaltyText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '800',
    },

    // Pass Device
    passDeviceContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    passDeviceTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 16,
    },
    passDevicePlayerBadge: {
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 30,
        marginBottom: 8,
    },
    passDevicePlayerName: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '800',
    },
    passDeviceSubtitle: {
        fontSize: 14,
        marginBottom: 32,
    },
    readyBtnWrap: {
        width: width - 80,
    },
    readyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderRadius: 28,
        gap: 8,
    },
    readyBtnText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
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
        gap: 10,
    },
    confirmBtnText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
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
    },

    kurdishFont: {
        fontFamily: 'System',
    },
});
