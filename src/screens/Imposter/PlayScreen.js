import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Fingerprint, EyeOff, Type, MessageCircle, Hand, CheckCircle2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { MotiView } from 'moti';
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
        return (
            <GradientBackground>
                <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                    <ScrollView
                        style={styles.scrollContainer}
                        contentContainerStyle={styles.centerContent}
                        showsVerticalScrollIndicator={true}
                        bounces={true}
                    >
                        {/* Player Badge */}
                        <View style={[styles.badge, { backgroundColor: colors.surface }]}>
                            <Text style={[styles.badgeText, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                                {t('common.player', language)} {currentPlayerIdx + 1}/{players.length}
                            </Text>
                        </View>

                        {phase === 'reveal' ? (
                            <MotiView
                                from={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'spring' }}
                                style={{ alignItems: 'center' }}
                            >
                                {isMultiplayer && !isMyTurnToReveal ? (
                                    // Other players wait
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={[styles.label, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                                            {isKurdish ? `چاوەڕوانی ${currentPlayer}...` : `Waiting for ${currentPlayer}...`}
                                        </Text>
                                        <ActivityIndicator size="large" color={colors.brand.primary} style={{ marginTop: 24 }} />
                                    </View>
                                ) : (
                                    <>
                                        <Text style={[styles.label, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                                            {isMultiplayer
                                                ? (isKurdish ? 'نۆرەی تۆیە!' : "It's your turn!")
                                                : t('common.passPhoneTo', language)}
                                        </Text>
                                        <Text style={[styles.playerName, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                                            {currentPlayer}
                                        </Text>
                                        <Text style={[styles.instruction, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                                            {t('common.keepItSecret', language)}{'\n'}{t('common.tapToReveal', language)}
                                        </Text>

                                        <Button
                                            title={t('common.reveal', language)}
                                            onPress={handleReveal}
                                            gradient={[COLORS.accent.danger, COLORS.accent.danger]}
                                            icon={<Fingerprint size={24} color="#FFF" />}
                                            style={{ minWidth: 200 }}
                                            isKurdish={isKurdish}
                                        />
                                    </>
                                )}
                            </MotiView>
                        ) : (
                            <MotiView
                                from={{ opacity: 0, scale: 0.8, rotateY: '90deg' }}
                                animate={{ opacity: 1, scale: 1, rotateY: '0deg' }}
                                transition={{ type: 'spring', damping: 14 }}
                                style={{ alignItems: 'center', width: '100%' }}
                            >
                                {isMultiplayer && !isMyTurnToReveal ? (
                                    // Other players see waiting
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={[styles.label, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                                            {isKurdish ? `${currentPlayer} ڕۆڵەکەی خۆی دەبینێت...` : `${currentPlayer} is viewing their role...`}
                                        </Text>
                                        <ActivityIndicator size="large" color={colors.brand.primary} style={{ marginTop: 24 }} />
                                    </View>
                                ) : (
                                    <>
                                        <Text style={[styles.label, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                                            {isKurdish ? 'ڕۆڵی نهێنی تۆ' : 'Your Secret Role'}
                                        </Text>

                                        {/* Secret Card — in multiplayer show MY role */}
                                        <GlassCard intensity={30} style={[
                                            styles.card,
                                            (isMultiplayer ? amIImposter : isImposter)
                                                ? styles.imposterCard
                                                : styles.crewCard
                                        ]}>
                                            {(isMultiplayer ? amIImposter : isImposter) ? (
                                                <EyeOff size={48} color={COLORS.accent.danger} style={{ marginBottom: 16 }} />
                                            ) : (
                                                <Type size={48} color={colors.brand.primary} style={{ marginBottom: 16 }} />
                                            )}

                                            {(isMultiplayer ? amIImposter : isImposter) ? (
                                                <>
                                                    <Text style={[styles.roleTitle, isKurdish && styles.kurdishFont]}>
                                                        {isKurdish ? 'جاسوس' : 'IMPOSTER'}
                                                    </Text>
                                                    <Text style={[styles.roleDesc, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                                                        {isKurdish
                                                            ? 'خۆت بشارەوە. نەهێڵە بزانن کە وشەکەت نازانیت.'
                                                            : "Blend in. Don't let them know you don't know the word."}
                                                    </Text>
                                                </>
                                            ) : (
                                                <>
                                                    <Text style={[styles.wordLabel, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                                                        {isKurdish ? 'وشەکە:' : 'The Word Is:'}
                                                    </Text>
                                                    <Text style={[styles.secretWord, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                                                        {gameWord?.word}
                                                    </Text>
                                                    <Text style={[styles.wordHint, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                                                        {gameWord?.hint}
                                                    </Text>
                                                </>
                                            )}
                                        </GlassCard>

                                        <Button
                                            title={isKurdish ? 'بیشارەوە و بیدە' : 'Hide & Pass'}
                                            onPress={handleNext}
                                            gradient={[colors.brand.primary, colors.brand.primary]}
                                            style={{ minWidth: 200 }}
                                            isKurdish={isKurdish}
                                        />
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

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContainer: { flex: 1 },
    centerContent: {
        flexGrow: 1, alignItems: 'center', padding: SPACING.xl, paddingVertical: 40,
        paddingBottom: 100
    },

    badge: {
        paddingVertical: 6, paddingHorizontal: 16,
        borderRadius: 100, marginBottom: 32,
    },
    badgeText: { ...FONTS.medium, fontSize: 13 },

    label: {
        ...FONTS.medium,
        marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1,
    },
    playerName: {
        ...FONTS.large, fontSize: 40,
        marginBottom: 24, textAlign: 'center',
    },
    instruction: {
        textAlign: 'center',
        marginBottom: 48, lineHeight: 24,
    },

    card: {
        width: '100%',
        padding: SPACING.xl,
        borderRadius: BORDER_RADIUS.xl,
        alignItems: 'center',
        marginBottom: 48,
        borderWidth: 1,
    },
    imposterCard: { borderColor: COLORS.accent.danger },
    crewCard: { borderColor: COLORS.accent.primary },

    roleTitle: { color: COLORS.accent.danger, ...FONTS.large, fontSize: 32, marginBottom: 12 },
    roleDesc: { textAlign: 'center', lineHeight: 24 },

    wordLabel: { marginBottom: 8 },
    secretWord: { ...FONTS.large, fontSize: 36, marginBottom: 8 },
    wordHint: { fontSize: 14 },

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
