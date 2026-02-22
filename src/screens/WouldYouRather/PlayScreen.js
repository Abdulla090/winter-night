import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Eye, ArrowLeft, ArrowRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { Button, GradientBackground, GlassCard } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { getRandomQuestion } from '../../constants/wouldYouRatherData';
import { useLanguage } from '../../context/LanguageContext';
import { useGameRoom } from '../../context/GameRoomContext';
import { useAuth } from '../../context/AuthContext';
import { t } from '../../localization/translations';

const { width } = Dimensions.get('window');

export default function WouldYouRatherPlayScreen({ navigation, route }) {
    // Support both single-player and multiplayer
    const { players: contextPlayers, currentRoom, gameState, updateGameState, leaveRoom, isHost } = useGameRoom();
    const { user } = useAuth();
    const { language, isKurdish } = useLanguage();

    const routeParams = route?.params || {};
    const isMultiplayer = !!currentRoom && !routeParams.players;

    // Get players
    const players = isMultiplayer
        ? (contextPlayers?.map(p => p.player?.username || 'Player') || ['Player 1', 'Player 2'])
        : (routeParams.players || ['Player 1', 'Player 2']);

    const category = routeParams.category || 'mixed';

    // Local state
    const [localQuestion, setLocalQuestion] = useState(null);
    const [localVotes, setLocalVotes] = useState({});
    const [localShowResults, setLocalShowResults] = useState(false);
    const [localQuestionCount, setLocalQuestionCount] = useState(1);

    const scaleAnimA = useRef(new Animated.Value(1)).current;
    const scaleAnimB = useRef(new Animated.Value(1)).current;

    const rowDirection = isKurdish ? 'row-reverse' : 'row';
    const textAlign = isKurdish ? 'right' : 'left';

    // Initialize
    useEffect(() => {
        if (!isMultiplayer && !localQuestion) {
            setLocalQuestion(getRandomQuestion(category, language));
        }
    }, []);

    // Multiplayer state
    const currentQuestion = isMultiplayer
        ? (gameState?.current_question?.question || null)
        : localQuestion;
    const votes = isMultiplayer
        ? (gameState?.scores || {})
        : localVotes;
    const showResults = isMultiplayer
        ? (gameState?.current_question?.revealed || false)
        : localShowResults;
    const questionCount = isMultiplayer
        ? (gameState?.round_number || 1)
        : localQuestionCount;

    const myUsername = contextPlayers?.find(p => p.player_id === user?.id)?.player?.username;

    // Sync to database
    const syncGameState = useCallback(async (updates) => {
        if (!isMultiplayer) return;

        await updateGameState({
            current_question: {
                ...gameState?.current_question,
                ...updates,
            },
            scores: updates.votes !== undefined ? updates.votes : (gameState?.scores || {}),
            round_number: updates.round_number !== undefined ? updates.round_number : questionCount,
        });
    }, [isMultiplayer, gameState, updateGameState, questionCount]);

    const handleVote = async (player, choice) => {
        // In multiplayer, you can only vote for yourself
        if (isMultiplayer && player !== myUsername) return;

        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        const newVotes = { ...votes, [player]: choice };

        const anim = choice === 'a' ? scaleAnimA : scaleAnimB;
        Animated.sequence([
            Animated.timing(anim, { toValue: 1.05, duration: 100, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();

        if (isMultiplayer) {
            await syncGameState({ votes: newVotes });
        } else {
            setLocalVotes(newVotes);
        }
    };

    const handleReveal = async () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (isMultiplayer) {
            await syncGameState({ revealed: true });
        } else {
            setLocalShowResults(true);
        }
    };

    const handleNext = async () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const newQuestion = getRandomQuestion(category, language);

        if (isMultiplayer) {
            await updateGameState({
                current_question: {
                    question: newQuestion,
                    revealed: false,
                },
                scores: {},
                round_number: questionCount + 1,
            });
        } else {
            setLocalQuestion(newQuestion);
            setLocalVotes({});
            setLocalShowResults(false);
            setLocalQuestionCount(prev => prev + 1);
        }
    };

    const handleEndGame = async () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (isMultiplayer) {
            await leaveRoom();
            navigation.replace('Home');
        } else {
            navigation.popToTop();
        }
    };

    const votesForA = Object.values(votes).filter(v => v === 'a').length;
    const votesForB = Object.values(votes).filter(v => v === 'b').length;
    const totalVotes = votesForA + votesForB;
    const allVoted = Object.keys(votes).length >= players.length;

    if (!currentQuestion) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.accent.info} />
                <Text style={styles.loadingText}>{isKurdish ? 'چاوەڕوان...' : 'Loading...'}</Text>
            </SafeAreaView>
        );
    }

    return (
        <GradientBackground>
            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                <View style={[styles.header, { flexDirection: rowDirection }]}>
                    <TouchableOpacity style={styles.exitBtn} onPress={handleEndGame}>
                        <X size={24} color={COLORS.text.secondary} />
                    </TouchableOpacity>
                    <View style={styles.questionBadge}>
                        <Text style={[styles.questionText, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? `پرسیاری ${questionCount}` : `Question ${questionCount}`}
                        </Text>
                    </View>
                    <View style={{ width: 44 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={[styles.title, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'بە باشترت دەزانی...' : 'Would You Rather...'}
                    </Text>

                    {/* Option A */}
                    <Animated.View style={{ transform: [{ scale: scaleAnimA }], width: '100%' }}>
                        <TouchableOpacity
                            style={[
                                styles.optionCard,
                                styles.optionA,
                                showResults && votesForA >= votesForB && styles.winningOption
                            ]}
                            onPress={() => !showResults && handleVote(isMultiplayer ? myUsername : players[0], 'a')}
                            disabled={showResults}
                        >
                            <Text style={[styles.optionLabel, { color: '#3b82f6' }]}>A</Text>
                            <Text style={[styles.optionText, isKurdish && styles.kurdishFont]}>{currentQuestion.a}</Text>
                            {showResults && (
                                <View style={[styles.resultBar, { flexDirection: rowDirection }]}>
                                    <View style={[
                                        styles.resultFill,
                                        styles.fillA,
                                        {
                                            width: `${totalVotes ? (votesForA / totalVotes) * 100 : 0}%`,
                                            left: isKurdish ? undefined : 0,
                                            right: isKurdish ? 0 : undefined
                                        }
                                    ]} />
                                    <Text style={styles.resultPercent}>
                                        {totalVotes ? Math.round((votesForA / totalVotes) * 100) : 0}%
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </Animated.View>

                    {/* VS */}
                    <View style={styles.vsContainer}>
                        <Text style={styles.vsText}>VS</Text>
                    </View>

                    {/* Option B */}
                    <Animated.View style={{ transform: [{ scale: scaleAnimB }], width: '100%' }}>
                        <TouchableOpacity
                            style={[
                                styles.optionCard,
                                styles.optionB,
                                showResults && votesForB >= votesForA && styles.winningOption
                            ]}
                            onPress={() => !showResults && handleVote(isMultiplayer ? myUsername : players[0], 'b')}
                            disabled={showResults}
                        >
                            <Text style={[styles.optionLabel, { color: '#ef4444' }]}>B</Text>
                            <Text style={[styles.optionText, isKurdish && styles.kurdishFont]}>{currentQuestion.b}</Text>
                            {showResults && (
                                <View style={[styles.resultBar, { flexDirection: rowDirection }]}>
                                    <View style={[
                                        styles.resultFill,
                                        styles.fillB,
                                        {
                                            width: `${totalVotes ? (votesForB / totalVotes) * 100 : 0}%`,
                                            left: isKurdish ? undefined : 0,
                                            right: isKurdish ? 0 : undefined
                                        }
                                    ]} />
                                    <Text style={styles.resultPercent}>
                                        {totalVotes ? Math.round((votesForB / totalVotes) * 100) : 0}%
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Player Votes Status */}
                    {!showResults && (
                        <View style={styles.votingSection}>
                            <Text style={[styles.votingTitle, isKurdish && styles.kurdishFont]}>
                                {isMultiplayer
                                    ? (isKurdish ? 'هەلبژاردنی یاریزانەکان' : 'Player Votes')
                                    : (isKurdish ? 'کلیک بکە بۆ دەنگدان' : 'Tap to vote')}
                            </Text>
                            <View style={styles.playerVotes}>
                                {players.map((player) => (
                                    <View key={player} style={[styles.playerVoteRow, { flexDirection: rowDirection }]}>
                                        <Text style={[styles.playerName, isKurdish && styles.kurdishFont]}>
                                            {player} {player === myUsername && isMultiplayer ? (isKurdish ? '(تۆ)' : '(You)') : ''}
                                        </Text>
                                        {isMultiplayer ? (
                                            // In multiplayer, show who voted
                                            <View style={styles.voteStatus}>
                                                {votes[player] ? (
                                                    <View style={[
                                                        styles.votedBadge,
                                                        { backgroundColor: votes[player] === 'a' ? '#3b82f6' : '#ef4444' }
                                                    ]}>
                                                        <Text style={styles.votedText}>{votes[player].toUpperCase()}</Text>
                                                    </View>
                                                ) : (
                                                    <Text style={styles.waitingVote}>
                                                        {isKurdish ? 'چاوەڕوان...' : 'Waiting...'}
                                                    </Text>
                                                )}
                                            </View>
                                        ) : (
                                            // Single-player vote buttons
                                            <View style={[styles.voteButtons, { flexDirection: rowDirection }]}>
                                                <TouchableOpacity
                                                    style={[
                                                        styles.voteBtn,
                                                        styles.voteBtnA,
                                                        votes[player] === 'a' && styles.voteBtnActiveA
                                                    ]}
                                                    onPress={() => handleVote(player, 'a')}
                                                >
                                                    <Text style={[
                                                        styles.voteBtnText,
                                                        votes[player] === 'a' && styles.voteBtnTextActive
                                                    ]}>A</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={[
                                                        styles.voteBtn,
                                                        styles.voteBtnB,
                                                        votes[player] === 'b' && styles.voteBtnActiveB
                                                    ]}
                                                    onPress={() => handleVote(player, 'b')}
                                                >
                                                    <Text style={[
                                                        styles.voteBtnText,
                                                        votes[player] === 'b' && styles.voteBtnTextActive
                                                    ]}>B</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Show Results */}
                    {showResults && (
                        <View style={styles.resultSection}>
                            <View style={[styles.resultSummary, { flexDirection: rowDirection }]}>
                                <View style={styles.resultTeam}>
                                    <Text style={[styles.teamLabel, isKurdish && styles.kurdishFont, { color: '#3b82f6', textAlign }]}>
                                        {isKurdish ? 'تیمی A' : 'Team A'}
                                    </Text>
                                    {players.filter(p => votes[p] === 'a').map(p => (
                                        <Text key={p} style={[styles.teamPlayer, isKurdish && styles.kurdishFont, { textAlign }]}>{p}</Text>
                                    ))}
                                </View>
                                <View style={styles.resultTeam}>
                                    <Text style={[styles.teamLabel, isKurdish && styles.kurdishFont, { color: '#ef4444', textAlign }]}>
                                        {isKurdish ? 'تیمی B' : 'Team B'}
                                    </Text>
                                    {players.filter(p => votes[p] === 'b').map(p => (
                                        <Text key={p} style={[styles.teamPlayer, isKurdish && styles.kurdishFont, { textAlign }]}>{p}</Text>
                                    ))}
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Actions */}
                    <View style={styles.actionContainer}>
                        {!showResults ? (
                            (isHost || !isMultiplayer) && (
                                <Button
                                    title={isKurdish ? 'ئەنجامەکان نیشان بدە' : 'Reveal Results'}
                                    onPress={handleReveal}
                                    disabled={!allVoted}
                                    gradient={[COLORS.accent.info, '#0284c7']}
                                    icon={<Eye size={20} color="#FFF" />}
                                    isKurdish={isKurdish}
                                />
                            )
                        ) : (
                            (isHost || !isMultiplayer) && (
                                <Button
                                    title={isKurdish ? 'پرسیاری دواتر' : 'Next Question'}
                                    onPress={handleNext}
                                    gradient={[COLORS.accent.success, '#059669']}
                                    icon={isKurdish ? <ArrowLeft size={20} color="#FFF" /> : <ArrowRight size={20} color="#FFF" />}
                                    isKurdish={isKurdish}
                                />
                            )
                        )}

                        {isMultiplayer && !isHost && !showResults && (
                            <Text style={styles.waitingHostText}>
                                {allVoted
                                    ? (isKurdish ? 'چاوەڕوانی خاوەنی ژوور بۆ پیشاندان' : 'Waiting for host to reveal...')
                                    : (isKurdish ? 'چاوەڕوانی دەنگدانی هەموان' : 'Waiting for everyone to vote...')}
                            </Text>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1 }, // Keep for compatibility
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
    },
    exitBtn: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: COLORS.background.card,
        alignItems: 'center', justifyContent: 'center',
    },
    questionBadge: {
        backgroundColor: COLORS.background.card,
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    questionText: { color: COLORS.text.secondary, ...FONTS.medium },
    content: {
        padding: SPACING.lg,
        paddingBottom: 100,
        alignItems: 'center',
    },
    loadingText: {
        color: COLORS.text.secondary,
        ...FONTS.medium,
        marginTop: SPACING.md,
    },
    title: {
        color: COLORS.text.primary,
        ...FONTS.large,
        marginBottom: SPACING.lg,
    },
    optionCard: {
        width: '100%',
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        alignItems: 'center',
        borderWidth: 1,
    },
    optionA: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    optionB: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    winningOption: {
        borderWidth: 4,
    },
    optionLabel: {
        ...FONTS.bold,
        fontSize: 24,
        marginBottom: 8,
    },
    optionText: {
        color: COLORS.text.primary,
        ...FONTS.title,
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 26,
    },
    resultBar: {
        width: '100%',
        height: 30,
        backgroundColor: COLORS.background.secondary,
        borderRadius: 15,
        marginTop: SPACING.md,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    resultFill: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        borderRadius: 15,
    },
    fillA: { backgroundColor: '#3b82f6' },
    fillB: { backgroundColor: '#ef4444' },
    resultPercent: {
        color: '#FFF',
        ...FONTS.bold,
        textAlign: 'center',
        zIndex: 1,
    },
    vsContainer: {
        width: 50, height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.background.card,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: SPACING.md,
    },
    vsText: { color: COLORS.text.primary, ...FONTS.bold, fontSize: 18 },
    votingSection: {
        width: '100%',
        marginTop: SPACING.lg,
    },
    votingTitle: {
        color: COLORS.text.muted,
        textAlign: 'center',
        marginBottom: SPACING.md,
    },
    playerVotes: { gap: 8 },
    playerVoteRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
    },
    playerName: { color: COLORS.text.primary, ...FONTS.medium, flex: 1 },
    voteStatus: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    votedBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    votedText: {
        color: '#FFF',
        ...FONTS.bold,
        fontSize: 12,
    },
    waitingVote: {
        color: COLORS.text.muted,
        ...FONTS.medium,
        fontSize: 12,
    },
    voteButtons: { flexDirection: 'row', gap: 8 },
    voteBtn: {
        width: 40, height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    voteBtnA: { borderColor: 'rgba(59, 130, 246, 0.3)' },
    voteBtnB: { borderColor: 'rgba(239, 68, 68, 0.3)' },
    voteBtnActiveA: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
    voteBtnActiveB: { backgroundColor: '#ef4444', borderColor: '#ef4444' },
    voteBtnText: { color: COLORS.text.muted, ...FONTS.bold },
    voteBtnTextActive: { color: '#FFF' },
    resultSection: { width: '100%', marginTop: SPACING.lg },
    resultSummary: {
        flexDirection: 'row',
        gap: 12,
    },
    resultTeam: {
        flex: 1,
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
    },
    teamLabel: { ...FONTS.medium, marginBottom: 8 },
    teamPlayer: { color: COLORS.text.secondary, marginBottom: 4 },
    actionContainer: {
        width: '100%',
        marginTop: SPACING.lg,
    },
    waitingHostText: {
        color: COLORS.text.muted,
        ...FONTS.medium,
        textAlign: 'center',
        marginTop: SPACING.md,
    },
    kurdishFont: { fontFamily: 'Rabar' },
});
