import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Platform,
    Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Fingerprint, EyeOff, Type, MessageCircle, Hand, CheckCircle2, Shield, ShieldAlert, Eye, Sparkles, Lock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientBackground, Button, GlassCard, Modal } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { getRandomWord } from '../../constants/imposterWords';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useGameRoom } from '../../context/GameRoomContext';
import { useAuth } from '../../context/AuthContext';
import { t } from '../../localization/translations';

export default function ImposterPlayScreen({ navigation, route }) {
    // Multiplayer context
    const { players: contextPlayers, currentRoom, gameState, updateGameState, leaveRoom, isHost } = useGameRoom();
    const { user } = useAuth();
    const { language, isKurdish } = useLanguage();
    const { colors } = useTheme();

    // Determine mode
    const routeParams = route?.params || {};
    const isMultiplayer = !!currentRoom && !routeParams.players;

    // Get players list
    const players = isMultiplayer
        ? (contextPlayers?.map(p => p.player?.username || 'Player') || ['Player 1', 'Player 2'])
        : (routeParams.players || ['Player 1', 'Player 2']);

    const category = routeParams.category || gameState?.state?.category || 'general';
    const imposterCount = routeParams.imposterCount || gameState?.state?.imposterCount || 1;

    // Game State
    const [localGameWord, setLocalGameWord] = useState(null);
    const [localImposters, setLocalImposters] = useState([]);
    const [localCurrentPlayerIdx, setLocalCurrentPlayerIdx] = useState(0);
    const [localPhase, setLocalPhase] = useState('reveal'); // 'reveal', 'viewing', 'discussion'
    const [showSecret, setShowSecret] = useState(false);
    const [showVoteModal, setShowVoteModal] = useState(false);
    const [votedPlayer, setVotedPlayer] = useState(null);

    // Multiplayer state
    const gameWord = isMultiplayer ? gameState?.state?.gameWord : localGameWord;
    const imposters = isMultiplayer ? (gameState?.state?.imposters || []) : localImposters;
    const currentPlayerIdx = isMultiplayer
        ? (gameState?.current_question?.player_index || 0)
        : localCurrentPlayerIdx;
    const phase = isMultiplayer
        ? (gameState?.current_question?.phase || 'reveal')
        : localPhase;

    // My identity in multiplayer
    const myUsername = isMultiplayer
        ? contextPlayers?.find(p => p.player_id === user?.id)?.player?.username
        : null;
    const isMyTurnToReveal = isMultiplayer
        ? (players[currentPlayerIdx] === myUsername)
        : true;

    // RTL styles
    const rowDirection = isKurdish ? 'row-reverse' : 'row';

    // Sync game state for multiplayer
    const syncGameState = useCallback(async (updates) => {
        if (!isMultiplayer) return;
        await updateGameState({
            current_question: {
                ...gameState?.current_question,
                ...updates.current_question,
            },
            state: {
                ...gameState?.state,
                ...updates.state,
            },
            scores: updates.scores !== undefined ? updates.scores : (gameState?.scores || {}),
        });
    }, [isMultiplayer, gameState, updateGameState]);

    // Setup Game — runs once
    useEffect(() => {
        if (isMultiplayer) {
            // Host sets up the game
            if (isHost && !gameState?.state?.gameWord) {
                const selected = getRandomWord(category, language);
                // Assign imposters
                const shuffledIndices = [...Array(players.length).keys()]
                    .sort(() => 0.5 - Math.random());
                const selectedImposters = shuffledIndices.slice(0, imposterCount)
                    .map(idx => players[idx]);

                updateGameState({
                    state: {
                        gameWord: selected,
                        imposters: selectedImposters,
                        category,
                        imposterCount,
                    },
                    current_question: {
                        phase: 'reveal',
                        player_index: 0,
                        revealed: [],
                    },
                });
            }
        } else {
            // Single-player setup
            const selected = getRandomWord(category, language);
            setLocalGameWord(selected);
            const shuffledIndices = [...Array(players.length).keys()]
                .sort(() => 0.5 - Math.random());
            const selectedImposters = shuffledIndices.slice(0, imposterCount)
                .map(idx => players[idx]);
            setLocalImposters(selectedImposters);
        }
    }, []);

    const currentPlayer = players[currentPlayerIdx];
    const isImposter = imposters.includes(currentPlayer);

    // In multiplayer: check if I'm an imposter (for my own reveal)
    const amIImposter = isMultiplayer ? imposters.includes(myUsername) : false;

    const handleReveal = async () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setShowSecret(true);

        if (isMultiplayer) {
            await syncGameState({
                current_question: { phase: 'viewing' },
            });
        } else {
            setLocalPhase('viewing');
        }
    };

    const handleNext = async () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setShowSecret(false);

        if (isMultiplayer) {
            if (currentPlayerIdx < players.length - 1) {
                await syncGameState({
                    current_question: {
                        phase: 'reveal',
                        player_index: currentPlayerIdx + 1,
                    },
                });
            } else {
                await syncGameState({
                    current_question: { phase: 'discussion' },
                });
            }
        } else {
            if (currentPlayerIdx < players.length - 1) {
                setLocalCurrentPlayerIdx(prev => prev + 1);
                setLocalPhase('reveal');
            } else {
                setLocalPhase('discussion');
            }
        }
    };

    const handleVote = (idx) => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setVotedPlayer(idx);
    };

    const confirmVote = async () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setShowVoteModal(false);
        const votedName = players[votedPlayer];
        const isCaught = imposters.includes(votedName);

        if (isMultiplayer) {
            // Update game state with result, then navigate
            await updateGameState({
                game_phase: 'finished',
                state: {
                    ...gameState?.state,
                    votedPlayer: votedName,
                    isCaught,
                },
            });
            // Navigate to result
            navigation.replace('ImposterResult', {
                imposters,
                word: gameWord,
                players,
                votedPlayer: votedName,
                isCaught
            });
        } else {
            navigation.replace('ImposterResult', {
                imposters,
                word: gameWord,
                players,
                votedPlayer: votedName,
                isCaught
            });
        }
    };

    const handleEndGame = async () => {
        if (isMultiplayer) {
            await leaveRoom();
            navigation.replace('Home');
        } else {
            navigation.goBack();
        }
    };

    // Watch for game finish in multiplayer (for non-host players)
    useEffect(() => {
        if (isMultiplayer && gameState?.game_phase === 'finished' && gameState?.state?.votedPlayer) {
            navigation.replace('ImposterResult', {
                imposters: gameState.state.imposters,
                word: gameState.state.gameWord,
                players,
                votedPlayer: gameState.state.votedPlayer,
                isCaught: gameState.state.isCaught
            });
        }
    }, [gameState?.game_phase]);

    // --- RENDER --- (Distribution Phase)
    if (phase === 'reveal' || phase === 'viewing') {
        const showingImposter = isMultiplayer ? amIImposter : isImposter;

        return (
            <GradientBackground>
                <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                    <ScrollView
                        style={styles.scrollContainer}
                        contentContainerStyle={styles.centerContent}
                        showsVerticalScrollIndicator={false}
                        bounces={true}
                    >
                        {/* Progress Indicator */}
                        <MotiView
                            from={{ opacity: 0, translateY: -10 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ type: 'timing', duration: 300 }}
                            style={styles.progressRow}
                        >
                            {players.map((_, i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.progressDot,
                                        i < currentPlayerIdx && styles.progressDotDone,
                                        i === currentPlayerIdx && styles.progressDotActive,
                                    ]}
                                />
                            ))}
                        </MotiView>

                        <View style={styles.progressLabel}>
                            <Text style={[styles.progressLabelText, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                                {t('common.player', language)} {currentPlayerIdx + 1}/{players.length}
                            </Text>
                        </View>

                        {phase === 'reveal' ? (
                            /* ═══════════════════════════════ */
                            /* CARD BACK — TAP TO REVEAL       */
                            /* ═══════════════════════════════ */
                            <MotiView
                                from={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'spring', damping: 14, stiffness: 120 }}
                                style={styles.revealSection}
                            >
                                {isMultiplayer && !isMyTurnToReveal ? (
                                    <View style={styles.waitingBox}>
                                        <MotiView
                                            from={{ rotate: '0deg' }}
                                            animate={{ rotate: '360deg' }}
                                            transition={{ type: 'timing', duration: 2000, loop: true }}
                                        >
                                            <Lock size={32} color={colors.text.muted} />
                                        </MotiView>
                                        <Text style={[styles.waitingLabel, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                                            {isKurdish ? `چاوەڕوانی ${currentPlayer}...` : `Waiting for ${currentPlayer}...`}
                                        </Text>
                                        <ActivityIndicator size="small" color={colors.brand.primary} style={{ marginTop: 12 }} />
                                    </View>
                                ) : (
                                    <>
                                        {/* Card Back Design */}
                                        <View style={styles.cardBackOuter}>
                                            {/* Pulsing Glow Ring */}
                                            <MotiView
                                                from={{ opacity: 0.3, scale: 1 }}
                                                animate={{ opacity: 0.8, scale: 1.15 }}
                                                transition={{ type: 'timing', duration: 1500, loop: true }}
                                                style={styles.glowRing}
                                            />

                                            <LinearGradient
                                                colors={['#1A0B2E', '#2D1B4E', '#1A0B2E']}
                                                style={styles.cardBack}
                                            >
                                                {/* Decorative Pattern */}
                                                <View style={styles.cardBackPattern}>
                                                    <View style={styles.patternLine} />
                                                    <View style={[styles.patternLine, { transform: [{ rotate: '60deg' }] }]} />
                                                    <View style={[styles.patternLine, { transform: [{ rotate: '120deg' }] }]} />
                                                </View>

                                                {/* Center Icon */}
                                                <MotiView
                                                    from={{ scale: 0.9, opacity: 0.5 }}
                                                    animate={{ scale: 1.05, opacity: 1 }}
                                                    transition={{ type: 'timing', duration: 1200, loop: true }}
                                                    style={styles.cardBackIconWrap}
                                                >
                                                    <View style={styles.cardBackIconCircle}>
                                                        <EyeOff size={36} color="#E8D5FF" />
                                                    </View>
                                                </MotiView>

                                                {/* "?" Symbol */}
                                                <Text style={styles.cardBackQuestion}>?</Text>

                                                {/* Corner Decorations */}
                                                <View style={[styles.cornerDeco, styles.cornerTL]} />
                                                <View style={[styles.cornerDeco, styles.cornerTR]} />
                                                <View style={[styles.cornerDeco, styles.cornerBL]} />
                                                <View style={[styles.cornerDeco, styles.cornerBR]} />
                                            </LinearGradient>
                                        </View>

                                        {/* Player Name */}
                                        <Text style={[styles.passLabel, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                                            {isMultiplayer
                                                ? (isKurdish ? 'نۆرەی تۆیە!' : "It's your turn!")
                                                : t('common.passPhoneTo', language)}
                                        </Text>
                                        <Text style={[styles.revealPlayerName, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                                            {currentPlayer}
                                        </Text>
                                        <Text style={[styles.revealInstruction, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                                            {t('common.keepItSecret', language)}
                                        </Text>

                                        {/* Reveal Button */}
                                        <TouchableOpacity
                                            onPress={handleReveal}
                                            activeOpacity={0.8}
                                            style={styles.revealBtnOuter}
                                        >
                                            <MotiView
                                                from={{ scale: 1 }}
                                                animate={{ scale: 1.05 }}
                                                transition={{ type: 'timing', duration: 800, loop: true }}
                                            >
                                                <LinearGradient
                                                    colors={['#EF4444', '#DC2626', '#B91C1C']}
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 1 }}
                                                    style={styles.revealBtn}
                                                >
                                                    <Fingerprint size={28} color="#FFF" />
                                                    <Text style={[styles.revealBtnText, isKurdish && styles.kurdishFont]}>
                                                        {t('common.reveal', language)}
                                                    </Text>
                                                </LinearGradient>
                                            </MotiView>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </MotiView>
                        ) : (
                            /* ═══════════════════════════════ */
                            /* CARD FRONT — ROLE REVEALED      */
                            /* ═══════════════════════════════ */
                            <MotiView
                                from={{ opacity: 0, scale: 0.7, rotateY: '90deg' }}
                                animate={{ opacity: 1, scale: 1, rotateY: '0deg' }}
                                transition={{ type: 'spring', damping: 12, stiffness: 100 }}
                                style={styles.revealSection}
                            >
                                {isMultiplayer && !isMyTurnToReveal ? (
                                    <View style={styles.waitingBox}>
                                        <Eye size={32} color={colors.text.muted} />
                                        <Text style={[styles.waitingLabel, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                                            {isKurdish ? `${currentPlayer} ڕۆڵەکەی خۆی دەبینێت...` : `${currentPlayer} is viewing their role...`}
                                        </Text>
                                        <ActivityIndicator size="small" color={colors.brand.primary} style={{ marginTop: 12 }} />
                                    </View>
                                ) : (
                                    <>
                                        {/* ── Premium Role Card ── */}
                                        <View style={styles.roleCardOuter}>
                                            {/* Glow Effect Behind Card */}
                                            <MotiView
                                                from={{ opacity: 0.4, scale: 0.95 }}
                                                animate={{ opacity: 0.8, scale: 1.02 }}
                                                transition={{ type: 'timing', duration: 1500, loop: true }}
                                                style={[
                                                    styles.roleCardGlow,
                                                    { backgroundColor: showingImposter ? 'rgba(239, 68, 68, 0.25)' : 'rgba(59, 130, 246, 0.25)' }
                                                ]}
                                            />

                                            <LinearGradient
                                                colors={showingImposter
                                                    ? ['#7F1D1D', '#991B1B', '#B91C1C', '#991B1B', '#7F1D1D']
                                                    : ['#1E3A5F', '#1D4ED8', '#3B82F6', '#1D4ED8', '#1E3A5F']
                                                }
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                                style={[
                                                    styles.roleCard,
                                                    { borderColor: showingImposter ? '#EF4444' : '#3B82F6' }
                                                ]}
                                            >
                                                {/* Top Label */}
                                                <View style={[styles.roleTopLabel, {
                                                    backgroundColor: showingImposter ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.3)'
                                                }]}>
                                                    <Text style={[styles.roleTopLabelText, isKurdish && styles.kurdishFont]}>
                                                        {isKurdish ? 'ڕۆڵی نهێنی تۆ' : 'YOUR SECRET ROLE'}
                                                    </Text>
                                                </View>

                                                {/* Icon Section */}
                                                <MotiView
                                                    from={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: 'spring', delay: 200, damping: 10 }}
                                                    style={[styles.roleIconContainer, {
                                                        backgroundColor: showingImposter
                                                            ? 'rgba(239, 68, 68, 0.2)'
                                                            : 'rgba(59, 130, 246, 0.2)',
                                                        borderColor: showingImposter
                                                            ? 'rgba(239, 68, 68, 0.4)'
                                                            : 'rgba(59, 130, 246, 0.4)',
                                                    }]}
                                                >
                                                    {showingImposter ? (
                                                        <ShieldAlert size={56} color="#FCA5A5" strokeWidth={1.5} />
                                                    ) : (
                                                        <Shield size={56} color="#93C5FD" strokeWidth={1.5} />
                                                    )}
                                                </MotiView>

                                                {/* Role Title */}
                                                <MotiView
                                                    from={{ opacity: 0, translateY: 10 }}
                                                    animate={{ opacity: 1, translateY: 0 }}
                                                    transition={{ delay: 300 }}
                                                >
                                                    <Text style={[styles.roleCardTitle, {
                                                        color: showingImposter ? '#FCA5A5' : '#93C5FD'
                                                    }, isKurdish && styles.kurdishFont]}>
                                                        {showingImposter
                                                            ? (isKurdish ? '🕵️ جاسوس' : '🕵️ IMPOSTER')
                                                            : (isKurdish ? '✅ ئەندام' : '✅ CREW')}
                                                    </Text>
                                                </MotiView>

                                                {/* Divider */}
                                                <View style={[styles.roleDivider, {
                                                    backgroundColor: showingImposter
                                                        ? 'rgba(252, 165, 165, 0.3)'
                                                        : 'rgba(147, 197, 253, 0.3)'
                                                }]} />

                                                {/* Content Section */}
                                                <MotiView
                                                    from={{ opacity: 0, translateY: 15 }}
                                                    animate={{ opacity: 1, translateY: 0 }}
                                                    transition={{ delay: 450 }}
                                                    style={{ alignItems: 'center', width: '100%' }}
                                                >
                                                    {showingImposter ? (
                                                        <>
                                                            <Text style={[styles.roleDescText, isKurdish && styles.kurdishFont]}>
                                                                {isKurdish
                                                                    ? 'خۆت بشارەوە. نەهێڵە بزانن\nکە وشەکەت نازانیت.'
                                                                    : "Blend in. Don't let them know\nyou don't know the word."}
                                                            </Text>
                                                            <View style={styles.tipPill}>
                                                                <Sparkles size={14} color="#FBBF24" />
                                                                <Text style={[styles.tipPillText, isKurdish && styles.kurdishFont]}>
                                                                    {isKurdish ? 'ئاگاداری وتارەکانی تریان بە' : 'Listen carefully to others'}
                                                                </Text>
                                                            </View>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {/* Category Pill */}
                                                            <View style={styles.categoryPill}>
                                                                <Text style={[styles.categoryPillText, isKurdish && styles.kurdishFont]}>
                                                                    {gameWord?.category || (isKurdish ? 'گشتی' : 'General')}
                                                                </Text>
                                                            </View>

                                                            {/* The Word */}
                                                            <Text style={[styles.secretWordText, isKurdish && styles.kurdishFont]}>
                                                                {gameWord?.word}
                                                            </Text>

                                                            {/* Hint */}
                                                            {gameWord?.hint && (
                                                                <View style={styles.hintBox}>
                                                                    <Text style={[styles.hintLabel, isKurdish && styles.kurdishFont]}>
                                                                        {isKurdish ? '💡 ئامۆژگاری' : '💡 Hint'}
                                                                    </Text>
                                                                    <Text style={[styles.hintText, isKurdish && styles.kurdishFont]}>
                                                                        {gameWord?.hint}
                                                                    </Text>
                                                                </View>
                                                            )}
                                                        </>
                                                    )}
                                                </MotiView>

                                                {/* Corner Marks */}
                                                <View style={[styles.cornerMark, styles.cornerMarkTL, {
                                                    borderColor: showingImposter ? '#EF444460' : '#3B82F660'
                                                }]} />
                                                <View style={[styles.cornerMark, styles.cornerMarkBR, {
                                                    borderColor: showingImposter ? '#EF444460' : '#3B82F660'
                                                }]} />
                                            </LinearGradient>
                                        </View>

                                        {/* Hide & Pass Button */}
                                        <TouchableOpacity
                                            onPress={handleNext}
                                            activeOpacity={0.8}
                                            style={styles.hidePassBtnOuter}
                                        >
                                            <LinearGradient
                                                colors={['#D900FF', '#9333EA', '#7C3AED']}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                                style={styles.hidePassBtn}
                                            >
                                                <EyeOff size={22} color="#FFF" />
                                                <Text style={[styles.hidePassBtnText, isKurdish && styles.kurdishFont]}>
                                                    {isKurdish ? 'بیشارەوە و بیدە' : 'Hide & Pass'}
                                                </Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </MotiView>
                        )}
                    </ScrollView>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    // --- RENDER --- (Discussion Phase)
    return (
        <GradientBackground>
            <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'گفتوگۆ' : 'Discussion'}
                    </Text>
                </View>

                <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.discussionContent}
                    showsVerticalScrollIndicator={true}
                    bounces={true}
                >
                    <View style={[styles.iconCircle, { backgroundColor: colors.surface }]}>
                        <MessageCircle size={40} color={colors.text.primary} />
                    </View>

                    <Text style={[styles.discussTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                        {t('common.findSpy', language)}
                    </Text>
                    <Text style={[styles.discussDesc, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                        {isKurdish
                            ? 'پرسیار بکە، دەنگ بدە، و بزانە کێ وشەکەی نازانێت.'
                            : "Ask questions, vote, and figure out who doesn't know the word."}
                    </Text>

                    <View style={[styles.tipBox, { flexDirection: rowDirection, backgroundColor: colors.surfaceHighlight }]}>
                        <Text style={[styles.tipTitle, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                            {t('common.category', language)}:
                        </Text>
                        <Text style={[styles.tipText, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                            {gameWord?.category || 'Unknown'}
                        </Text>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    {(!isMultiplayer || isHost) ? (
                        <Button
                            title={isKurdish ? 'دەنگدان بۆ دەرکردنی جاسوس' : 'Vote out Imposter'}
                            onPress={() => setShowVoteModal(true)}
                            gradient={[COLORS.accent.danger, COLORS.accent.danger]}
                            icon={<Hand size={20} color="#FFF" />}
                            isKurdish={isKurdish}
                        />
                    ) : (
                        <View style={{ alignItems: 'center', padding: SPACING.md }}>
                            <ActivityIndicator size="small" color={colors.brand.primary} />
                            <Text style={[{ color: colors.text.muted, marginTop: 8 }]}>
                                {isKurdish ? 'چاوەڕوانی دەنگدان...' : 'Waiting for host to start voting...'}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Vote Modal */}
                <Modal
                    visible={showVoteModal}
                    onClose={() => { setShowVoteModal(false); setVotedPlayer(null); }}
                    title={isKurdish ? 'دەنگ بدە بەرامبەر!' : "Vote out a Player!"}
                    isKurdish={isKurdish}
                >
                    <ScrollView style={{ maxHeight: 300 }}>
                        {players.map((player, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.voteItem,
                                    { flexDirection: rowDirection, backgroundColor: colors.surfaceHighlight },
                                    votedPlayer === index && styles.voteItemSelected
                                ]}
                                onPress={() => handleVote(index)}
                            >
                                <Text style={[styles.voteItemText, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>{player}</Text>
                                {votedPlayer === index && (
                                    <CheckCircle2 size={24} color={COLORS.accent.success} style={isKurdish ? { marginRight: 'auto' } : { marginLeft: 'auto' }} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <Button
                        title={isKurdish ? 'دووپاتکردنەوەی دەنگ' : "Confirm Vote"}
                        onPress={confirmVote}
                        disabled={votedPlayer === null}
                        gradient={[COLORS.accent.danger, COLORS.accent.danger]}
                        style={{ marginTop: SPACING.md }}
                        isKurdish={isKurdish}
                    />
                </Modal>
            </SafeAreaView>
        </GradientBackground>
    );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 64;

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContainer: { flex: 1 },
    centerContent: {
        flexGrow: 1, alignItems: 'center', padding: SPACING.lg, paddingVertical: 24,
        paddingBottom: 100
    },

    /* ── Progress Dots ── */
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 8,
    },
    progressDot: {
        width: 10, height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    progressDotDone: {
        backgroundColor: '#10B981',
        borderColor: '#10B981',
    },
    progressDotActive: {
        backgroundColor: '#D0B4FF',
        borderColor: '#D0B4FF',
        width: 24,
        borderRadius: 5,
    },
    progressLabel: { marginBottom: 20 },
    progressLabelText: { ...FONTS.medium, fontSize: 13, letterSpacing: 1 },

    /* ── Reveal Section Wrapper ── */
    revealSection: {
        alignItems: 'center',
        width: '100%',
    },

    /* ── Waiting State ── */
    waitingBox: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    waitingLabel: {
        ...FONTS.medium,
        fontSize: 16,
        marginTop: 16,
        textAlign: 'center',
    },

    /* ═══════════════════════════════ */
    /* CARD BACK (Tap to Reveal)       */
    /* ═══════════════════════════════ */
    cardBackOuter: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    glowRing: {
        position: 'absolute',
        width: CARD_WIDTH + 16,
        height: CARD_WIDTH * 0.85 + 16,
        borderRadius: 28,
        backgroundColor: 'rgba(208, 180, 255, 0.2)',
    },
    cardBack: {
        width: CARD_WIDTH,
        height: CARD_WIDTH * 0.85,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(208, 180, 255, 0.4)',
        overflow: 'hidden',
    },
    cardBackPattern: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    patternLine: {
        position: 'absolute',
        width: 160,
        height: 1,
        backgroundColor: 'rgba(208, 180, 255, 0.2)',
    },
    cardBackIconWrap: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardBackIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(208, 180, 255, 0.15)',
        borderWidth: 2,
        borderColor: 'rgba(208, 180, 255, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardBackQuestion: {
        fontSize: 36,
        fontWeight: '900',
        color: 'rgba(208, 180, 255, 0.25)',
        position: 'absolute',
        bottom: 20,
    },

    /* Corner Decorations */
    cornerDeco: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderColor: 'rgba(208, 180, 255, 0.5)',
    },
    cornerTL: { top: 14, left: 14, borderLeftWidth: 2, borderTopWidth: 2, borderTopLeftRadius: 6 },
    cornerTR: { top: 14, right: 14, borderRightWidth: 2, borderTopWidth: 2, borderTopRightRadius: 6 },
    cornerBL: { bottom: 14, left: 14, borderLeftWidth: 2, borderBottomWidth: 2, borderBottomLeftRadius: 6 },
    cornerBR: { bottom: 14, right: 14, borderRightWidth: 2, borderBottomWidth: 2, borderBottomRightRadius: 6 },

    /* ── Before-Reveal Text ── */
    passLabel: {
        ...FONTS.medium,
        fontSize: 14,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        marginBottom: 6,
    },
    revealPlayerName: {
        ...FONTS.title,
        fontSize: 36,
        marginBottom: 8,
        textAlign: 'center',
    },
    revealInstruction: {
        textAlign: 'center',
        lineHeight: 22,
        fontSize: 14,
        marginBottom: 28,
    },

    /* ── Reveal Button ── */
    revealBtnOuter: {
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
    },
    revealBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 20,
    },
    revealBtnText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 1,
    },

    /* ═══════════════════════════════ */
    /* CARD FRONT (Role Revealed)       */
    /* ═══════════════════════════════ */
    roleCardOuter: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 28,
    },
    roleCardGlow: {
        position: 'absolute',
        width: CARD_WIDTH + 24,
        height: 420,
        borderRadius: 30,
    },
    roleCard: {
        width: CARD_WIDTH,
        minHeight: 340,
        borderRadius: 24,
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 20,
        borderWidth: 2,
        overflow: 'hidden',
    },
    roleTopLabel: {
        paddingVertical: 6,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginBottom: 20,
    },
    roleTopLabelText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    roleIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        marginBottom: 16,
    },
    roleCardTitle: {
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: 2,
        textAlign: 'center',
        marginBottom: 12,
    },
    roleDivider: {
        width: '60%',
        height: 1,
        marginVertical: 16,
    },
    roleDescText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 16,
    },
    tipPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(251, 191, 36, 0.15)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(251, 191, 36, 0.3)',
    },
    tipPillText: {
        color: '#FBBF24',
        fontSize: 13,
        fontWeight: '600',
    },

    /* ── Crew Word Display ── */
    categoryPill: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingVertical: 4,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    categoryPillText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    secretWordText: {
        color: '#FFFFFF',
        fontSize: 42,
        fontWeight: '900',
        textAlign: 'center',
        letterSpacing: 1,
        marginBottom: 12,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    hintBox: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 4,
    },
    hintLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 4,
    },
    hintText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        textAlign: 'center',
    },

    /* ── Corner Marks on Role Card ── */
    cornerMark: {
        position: 'absolute',
        width: 20,
        height: 20,
    },
    cornerMarkTL: {
        top: 12, left: 12,
        borderLeftWidth: 2, borderTopWidth: 2,
        borderTopLeftRadius: 4,
    },
    cornerMarkBR: {
        bottom: 12, right: 12,
        borderRightWidth: 2, borderBottomWidth: 2,
        borderBottomRightRadius: 4,
    },

    /* ── Hide & Pass Button ── */
    hidePassBtnOuter: {
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 6,
        shadowColor: '#D900FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
    },
    hidePassBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 20,
    },
    hidePassBtnText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '700',
    },

    /* ═══════════════════════════════ */
    /* DISCUSSION PHASE                 */
    /* ═══════════════════════════════ */
    header: { padding: SPACING.lg, alignItems: 'center' },
    headerTitle: { textTransform: 'uppercase', letterSpacing: 2 },

    discussionContent: {
        flexGrow: 1, alignItems: 'center', padding: SPACING.xl, paddingVertical: 40,
        paddingBottom: 100
    },
    iconCircle: {
        width: 80, height: 80, borderRadius: 40,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 24,
    },
    discussTitle: { ...FONTS.title, fontSize: 32, marginBottom: 16 },
    discussDesc: { textAlign: 'center', lineHeight: 24, marginBottom: 40 },

    footer: { padding: SPACING.lg },

    tipBox: {
        padding: SPACING.md, borderRadius: 8,
        flexDirection: 'row', gap: 8,
    },
    tipTitle: {},
    tipText: { fontWeight: '600' },

    voteItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        marginBottom: 8,
    },
    voteItemSelected: { backgroundColor: 'rgba(16, 185, 129, 0.2)', borderColor: COLORS.accent.success, borderWidth: 1 },
    voteItemText: { ...FONTS.medium },
    kurdishFont: { fontFamily: 'Rabar' },
});

