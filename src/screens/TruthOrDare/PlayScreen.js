import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, User, MessageCircle, Zap, CheckCircle2, XCircle, RefreshCw, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay
} from 'react-native-reanimated';
import { Button, GradientBackground, GlassCard } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { getRandomTruth, getRandomDare } from '../../constants/truthOrDareData';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useGameRoom } from '../../context/GameRoomContext';
import { useAuth } from '../../context/AuthContext';
import { t } from '../../localization/translations';

const { width } = Dimensions.get('window');

// Animated Card Component - Professional fade animation
const AnimatedCard = ({ children, style, delay = 0 }) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(10);

    useEffect(() => {
        opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
        translateY.value = withDelay(delay, withTiming(0, { duration: 300 }));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }]
    }));

    return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
};

export default function TruthOrDarePlayScreen({ navigation, route }) {
    // Support both single-player (route params) and multiplayer (context)
    const { players: contextPlayers, currentRoom, gameState, updateGameState, leaveRoom } = useGameRoom();
    const { user } = useAuth();
    const { language, isKurdish } = useLanguage();
    const { colors, isDark } = useTheme();

    // Determine mode
    const routeParams = route?.params || {};
    const isMultiplayer = !!currentRoom && !routeParams.players;

    // For single-player mode (backward compatibility)
    const [localPlayerIndex, setLocalPlayerIndex] = useState(0);
    const [localPhase, setLocalPhase] = useState('choose');
    const [localChosenType, setLocalChosenType] = useState(null);
    const [localChallenge, setLocalChallenge] = useState('');
    const [localScores, setLocalScores] = useState({});

    // Get players list
    const players = isMultiplayer
        ? (contextPlayers?.map(p => p.player?.username || 'Player') || ['Player 1', 'Player 2'])
        : (routeParams.players || ['Player 1', 'Player 2']);

    const intensity = routeParams.intensity || currentRoom?.settings?.intensity || 'medium';

    // Initialize local scores for single-player
    useEffect(() => {
        if (!isMultiplayer && Object.keys(localScores).length === 0) {
            setLocalScores(players.reduce((acc, p) => ({ ...acc, [p]: 0 }), {}));
        }
    }, [players, isMultiplayer]);

    // MULTIPLAYER: Get state from database
    const currentPlayerIndex = isMultiplayer
        ? (gameState?.current_question?.player_index || 0)
        : localPlayerIndex;
    const phase = isMultiplayer
        ? (gameState?.current_question?.phase || 'choose')
        : localPhase;
    const chosenType = isMultiplayer
        ? gameState?.current_question?.chosen_type
        : localChosenType;
    const currentChallenge = isMultiplayer
        ? (gameState?.current_question?.challenge || '')
        : localChallenge;
    const scores = isMultiplayer
        ? (gameState?.scores || {})
        : localScores;

    const currentPlayer = players[currentPlayerIndex] || players[0];
    const rowDirection = isKurdish ? 'row-reverse' : 'row';

    // Check if it's current user's turn (multiplayer only)
    const myUsername = contextPlayers?.find(p => p.player_id === user?.id)?.player?.username;
    const isMyTurn = isMultiplayer ? (currentPlayer === myUsername) : true;

    // Animation Values
    const cardScale = useSharedValue(1);
    const contentOpacity = useSharedValue(1);

    useEffect(() => {
        contentOpacity.value = 0;
        contentOpacity.value = withTiming(1, { duration: 300 });
    }, [phase]);

    // MULTIPLAYER: Update game state in database
    const syncGameState = useCallback(async (updates) => {
        if (!isMultiplayer) return;

        await updateGameState({
            current_question: {
                ...gameState?.current_question,
                ...updates,
            },
            scores: updates.scores !== undefined ? updates.scores : (gameState?.scores || {}),
        });
    }, [isMultiplayer, gameState, updateGameState]);

    const handleChoice = async (type) => {
        if (isMultiplayer && !isMyTurn) return; // Only active player can choose

        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        cardScale.value = withTiming(0.95, { duration: 100 });

        const challenge = type === 'truth' ? getRandomTruth(intensity, language) : getRandomDare(intensity, language);

        setTimeout(async () => {
            cardScale.value = withTiming(1, { duration: 100 });

            if (isMultiplayer) {
                await syncGameState({
                    phase: 'reveal',
                    chosen_type: type,
                    challenge: challenge,
                    player_index: currentPlayerIndex,
                });
            } else {
                setLocalChosenType(type);
                setLocalChallenge(challenge);
                setLocalPhase('reveal');
            }
        }, 150);
    };

    const handleComplete = async (completed) => {
        if (isMultiplayer && !isMyTurn) return;

        if (Platform.OS !== 'web') Haptics.notificationAsync(completed ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning);

        const newScores = { ...scores };
        if (completed) {
            newScores[currentPlayer] = (newScores[currentPlayer] || 0) + 1;
        }

        if (isMultiplayer) {
            await syncGameState({
                phase: 'complete',
                scores: newScores,
            });
        } else {
            setLocalScores(newScores);
            setLocalPhase('complete');
        }
    };

    const handleNext = async () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        const nextIndex = (currentPlayerIndex + 1) % players.length;

        if (isMultiplayer) {
            await syncGameState({
                phase: 'choose',
                chosen_type: null,
                challenge: '',
                player_index: nextIndex,
            });
        } else {
            setLocalPlayerIndex(nextIndex);
            setLocalPhase('choose');
            setLocalChosenType(null);
            setLocalChallenge('');
        }
    };

    const handleEndGame = async () => {
        if (isMultiplayer) {
            await leaveRoom();
            navigation.replace('Home');
        } else {
            navigation.replace('TruthOrDareResult', {
                players,
                scores,
                intensity,
            });
        }
    };

    const handleNewChallenge = async () => {
        if (isMultiplayer && !isMyTurn) return;

        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        const challenge = chosenType === 'truth' ? getRandomTruth(intensity, language) : getRandomDare(intensity, language);

        if (isMultiplayer) {
            await syncGameState({ challenge });
        } else {
            setLocalChallenge(challenge);
        }
    };

    const contentStyle = useAnimatedStyle(() => ({
        opacity: contentOpacity.value,
        transform: [{ scale: cardScale.value }],
    }));

    // ========================
    // CHOOSE PHASE
    // ========================
    if (phase === 'choose') {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                    <View style={[styles.header, { flexDirection: rowDirection }]}>
                        <TouchableOpacity style={[styles.exitBtn, { backgroundColor: colors.surface }]} onPress={handleEndGame}>
                            <X size={24} color={colors.text.secondary} />
                        </TouchableOpacity>
                        <View style={[styles.roundBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Text style={[styles.roundText, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                                {t('common.round', language)} {Math.floor(currentPlayerIndex / players.length) + 1}
                            </Text>
                        </View>
                        <View style={{ width: 44 }} />
                    </View>

                    <ScrollView contentContainerStyle={styles.centerContent}>
                        <AnimatedCard delay={100} style={[styles.playerBadge, { flexDirection: rowDirection }]}>
                            <User size={16} color={colors.brand.primary} />
                            <Text style={[styles.playerBadgeText, { color: colors.brand.primary }, isKurdish && styles.kurdishFont]}>
                                {currentPlayer}{isKurdish ? ' نۆرەبەتی' : "'s Turn"}
                            </Text>
                        </AnimatedCard>

                        {/* Show waiting message if not your turn in multiplayer */}
                        {isMultiplayer && !isMyTurn && (
                            <GlassCard intensity={isDark ? 30 : 50} style={styles.waitingCard}>
                                <ActivityIndicator size="small" color={colors.brand.primary} />
                                <Text style={[styles.waitingText, { color: colors.text.secondary }]}>
                                    {isKurdish ? `چاوەڕوانی ${currentPlayer}...` : `Waiting for ${currentPlayer}...`}
                                </Text>
                            </GlassCard>
                        )}

                        <AnimatedCard delay={200}>
                            <Text style={[styles.chooseTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                                {isKurdish ? 'ڕاستی یان هەوەس؟' : 'Truth or Dare?'}
                            </Text>
                            <Text style={[styles.chooseSubtitle, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                                {isMultiplayer && !isMyTurn
                                    ? (isKurdish ? `${currentPlayer} دەبێت هەڵبژێرێت` : `${currentPlayer} must choose`)
                                    : (isKurdish ? 'بە وریایی هەڵبژێرە...' : 'Make your choice wisely...')}
                            </Text>
                        </AnimatedCard>

                        <View style={[styles.choiceRow, { flexDirection: rowDirection }]}>
                            <TouchableOpacity
                                style={[styles.choiceTouch, { marginRight: isKurdish ? 0 : 16, marginLeft: isKurdish ? 16 : 0 }]}
                                onPress={() => handleChoice('truth')}
                                activeOpacity={0.9}
                                disabled={isMultiplayer && !isMyTurn}
                            >
                                <GlassCard
                                    intensity={isDark ? 20 : 60}
                                    style={[
                                        styles.choiceCard,
                                        styles.truthCard,
                                        isMultiplayer && !isMyTurn && styles.disabledCard
                                    ]}
                                >
                                    <View style={styles.iconCircleBlue}>
                                        <MessageCircle size={32} color="#3b82f6" />
                                    </View>
                                    <Text style={[styles.choiceText, { color: isDark ? '#60a5fa' : '#3b82f6' }, isKurdish && styles.kurdishFont]}>
                                        {t('common.truth', language)}
                                    </Text>
                                </GlassCard>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.choiceTouch}
                                onPress={() => handleChoice('dare')}
                                activeOpacity={0.9}
                                disabled={isMultiplayer && !isMyTurn}
                            >
                                <GlassCard
                                    intensity={isDark ? 20 : 60}
                                    style={[
                                        styles.choiceCard,
                                        styles.dareCard,
                                        isMultiplayer && !isMyTurn && styles.disabledCard
                                    ]}
                                >
                                    <View style={styles.iconCircleRed}>
                                        <Zap size={32} color="#ef4444" />
                                    </View>
                                    <Text style={[styles.choiceText, { color: isDark ? '#f87171' : '#ef4444' }, isKurdish && styles.kurdishFont]}>
                                        {t('common.dare', language)}
                                    </Text>
                                </GlassCard>
                            </TouchableOpacity>
                        </View>

                        <GlassCard delay={500} style={styles.scoresCard} intensity={isDark ? 20 : 60}>
                            <Text style={[styles.scoresTitle, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                                {isKurdish ? 'ڕیزبەندی' : 'Leaderboard'}
                            </Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {Object.entries(scores)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([name, score], index) => (
                                        <View key={name} style={[styles.scoreItem, { backgroundColor: colors.surfaceHighlight }]}>
                                            <Text style={styles.scoreRank}>#{index + 1}</Text>
                                            <Text style={[styles.scoreName, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>{name}</Text>
                                            <Text style={[styles.scoreValue, { color: colors.brand.success }]}>{score}</Text>
                                        </View>
                                    ))
                                }
                            </ScrollView>
                        </GlassCard>
                    </ScrollView>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    // ========================
    // REVEAL PHASE
    // ========================
    if (phase === 'reveal') {
        const isTruth = chosenType === 'truth';
        const accentColor = isTruth ? '#3b82f6' : '#ef4444';

        return (
            <GradientBackground>
                <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                    <ScrollView contentContainerStyle={styles.centerContent}>
                        <Animated.View style={contentStyle}>
                            <View style={[styles.typeBadge, { backgroundColor: `${accentColor}20`, flexDirection: rowDirection }]}>
                                {isTruth ? (
                                    <MessageCircle size={20} color={accentColor} />
                                ) : (
                                    <Zap size={20} color={accentColor} />
                                )}
                                <Text style={[styles.typeBadgeText, { color: accentColor }, isKurdish && styles.kurdishFont]}>
                                    {isTruth ? t('common.truth', language).toUpperCase() : t('common.dare', language).toUpperCase()}
                                </Text>
                            </View>

                            <Text style={[styles.playerLabel, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>{currentPlayer}</Text>

                            <GlassCard intensity={isDark ? 40 : 80} style={[styles.challengeCard, { borderColor: accentColor }]}>
                                <Text style={[styles.challengeText, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>{currentChallenge}</Text>
                            </GlassCard>

                            {/* Only active player can mark complete/skip */}
                            {(!isMultiplayer || isMyTurn) ? (
                                <View style={[styles.actionRow, { flexDirection: rowDirection }]}>
                                    <Button
                                        title={isKurdish ? 'تەواو کرا!' : 'Completed!'}
                                        onPress={() => handleComplete(true)}
                                        gradient={[COLORS.accent.success, '#059669']}
                                        icon={<CheckCircle2 size={20} color="#FFF" />}
                                        style={{ flex: 1, marginRight: isKurdish ? 0 : 12, marginLeft: isKurdish ? 12 : 0 }}
                                        isKurdish={isKurdish}
                                    />
                                    <Button
                                        title={isKurdish ? 'تێپەڕا' : 'Skipped'}
                                        onPress={() => handleComplete(false)}
                                        gradient={[COLORS.accent.danger, '#b91c1c']}
                                        icon={<XCircle size={20} color="#FFF" />}
                                        style={{ flex: 1, marginLeft: isKurdish ? 0 : 12, marginRight: isKurdish ? 12 : 0 }}
                                        isKurdish={isKurdish}
                                    />
                                </View>
                            ) : (
                                <View style={styles.waitingCard}>
                                    <ActivityIndicator size="small" color={accentColor} />
                                    <Text style={[styles.waitingText, { color: colors.text.secondary }]}>
                                        {isKurdish ? `چاوەڕوانی ${currentPlayer}...` : `Waiting for ${currentPlayer} to respond...`}
                                    </Text>
                                </View>
                            )}

                            {(!isMultiplayer || isMyTurn) && (
                                <TouchableOpacity
                                    style={[styles.newChallengeBtn, { flexDirection: rowDirection }]}
                                    onPress={handleNewChallenge}
                                >
                                    <RefreshCw size={18} color={colors.text.muted} />
                                    <Text style={[styles.newChallengeText, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                                        {isKurdish
                                            ? `${isTruth ? 'ڕاستی' : 'هەوەس'}ی نوێ وەربگرە`
                                            : `Get New ${isTruth ? 'Truth' : 'Dare'}`
                                        }
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </Animated.View>
                    </ScrollView>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    // ========================
    // COMPLETE PHASE
    // ========================
    if (phase === 'complete') {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                    <ScrollView contentContainerStyle={styles.centerContent}>
                        <AnimatedCard delay={100}>
                            <View style={styles.completeBadge}>
                                <CheckCircle size={80} color={colors.brand.success} />
                            </View>
                        </AnimatedCard>

                        <AnimatedCard delay={200}>
                            <Text style={[styles.completeTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                                {isKurdish ? 'نۆرەبەت تەواو بوو!' : 'Turn Complete!'}
                            </Text>
                            <Text style={[styles.completeSubtitle, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                                {isKurdish ? `خاڵی ${currentPlayer}: ${scores[currentPlayer] || 0}` : `${currentPlayer}'s score: ${scores[currentPlayer] || 0}`}
                            </Text>
                        </AnimatedCard>

                        <AnimatedCard delay={300} style={styles.actionRow}>
                            {(!isMultiplayer || isMyTurn) ? (
                                <Button
                                    title={isKurdish ? 'یاریزانی دواتر' : 'Next Player'}
                                    onPress={handleNext}
                                    gradient={[colors.brand.primary, colors.brand.primary]}
                                    icon={isKurdish ? <ArrowLeft size={20} color="#FFF" /> : <ArrowRight size={20} color="#FFF" />}
                                    style={{ flex: 1 }}
                                    isKurdish={isKurdish}
                                />
                            ) : (
                                <View style={styles.waitingCard}>
                                    <ActivityIndicator size="small" color={colors.brand.primary} />
                                    <Text style={[styles.waitingText, { color: colors.text.secondary }]}>
                                        {isKurdish ? 'چاوەڕوانی...' : 'Waiting...'}
                                    </Text>
                                </View>
                            )}
                        </AnimatedCard>

                        <AnimatedCard delay={400}>
                            <TouchableOpacity style={styles.endGameBtn} onPress={handleEndGame}>
                                <Text style={[styles.endGameText, { color: colors.brand.error }, isKurdish && styles.kurdishFont]}>
                                    {isKurdish ? 'یاری تەواو بکە و ئەنجامەکان ببینە' : 'End Game & See Results'}
                                </Text>
                            </TouchableOpacity>
                        </AnimatedCard>
                    </ScrollView>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    centerContent: {
        flexGrow: 1,
        alignItems: 'center',
        padding: SPACING.xl,
        justifyContent: 'center',
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
    },
    exitBtn: {
        width: 44, height: 44, borderRadius: 22,
        alignItems: 'center', justifyContent: 'center',
    },
    roundBadge: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
    },
    roundText: { ...FONTS.medium },
    playerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 100,
        marginBottom: SPACING.xl,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.3)',
    },
    playerBadgeText: { ...FONTS.bold },
    waitingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.lg,
        width: '100%',
    },
    waitingText: {
        ...FONTS.medium,
    },
    chooseTitle: { ...FONTS.large, marginBottom: 8, textAlign: 'center' },
    chooseSubtitle: { marginBottom: SPACING.xl, textAlign: 'center' },
    choiceRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 0,
        marginBottom: SPACING.xl,
        width: '100%',
    },
    choiceTouch: {
        flex: 1,
        maxWidth: (width - 60) / 2,
    },
    choiceCard: {
        width: '100%',
        aspectRatio: 0.85,
        borderRadius: BORDER_RADIUS.xl,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        ...SHADOWS.medium,
        elevation: 5,
    },
    disabledCard: {
        opacity: 0.5,
    },
    truthCard: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    dareCard: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    iconCircleBlue: {
        width: 64, height: 64, borderRadius: 32,
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: SPACING.md,
    },
    iconCircleRed: {
        width: 64, height: 64, borderRadius: 32,
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: SPACING.md,
    },
    choiceText: { ...FONTS.bold, fontSize: 22, marginTop: SPACING.sm },
    scoresCard: {
        width: '100%',
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
    },
    scoresTitle: { fontSize: 12, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
    scoreItem: {
        alignItems: 'center',
        marginRight: 16,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        minWidth: 80,
    },
    scoreRank: { color: '#eab308', fontSize: 10, fontWeight: '700', marginBottom: 2 },
    scoreName: { ...FONTS.medium, fontSize: 14, marginBottom: 2 },
    scoreValue: { fontWeight: '700', fontSize: 16 },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 100,
        marginBottom: SPACING.md,
    },
    typeBadgeText: { ...FONTS.bold, fontSize: 14, letterSpacing: 1 },
    playerLabel: { ...FONTS.medium, marginBottom: SPACING.lg },
    challengeCard: {
        width: '100%',
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        borderWidth: 1,
        marginBottom: SPACING.xl,
        minHeight: 200,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.medium,
    },
    challengeText: {
        ...FONTS.title,
        fontSize: 24,
        textAlign: 'center',
        lineHeight: 34,
    },
    actionRow: {
        flexDirection: 'row',
        width: '100%',
    },
    newChallengeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: SPACING.lg,
        padding: SPACING.sm,
    },
    newChallengeText: { ...FONTS.medium },
    completeBadge: { marginBottom: SPACING.md },
    completeTitle: { ...FONTS.large, marginBottom: 8 },
    completeSubtitle: { marginBottom: SPACING.xl },
    endGameBtn: {
        marginTop: SPACING.lg,
        padding: SPACING.sm,
    },
    endGameText: { ...FONTS.medium },
    kurdishFont: { fontFamily: 'Rabar' },
});
