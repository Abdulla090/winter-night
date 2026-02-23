import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, Smartphone, Play, CheckCircle2, XCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { GradientBackground, Button, Timer, Modal, GlassCard } from '../../components';
import { SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { getRandomCharacter } from '../../constants/whoAmIData';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useGameRoom } from '../../context/GameRoomContext';
import { useAuth } from '../../context/AuthContext';
import { t } from '../../localization/translations';

const { width } = Dimensions.get('window');

export default function PlayScreen({ navigation, route }) {
    // Multiplayer context
    const { players: contextPlayers, currentRoom, gameState, updateGameState, leaveRoom, isHost } = useGameRoom();
    const { user } = useAuth();
    const { language, isKurdish } = useLanguage();
    const { colors } = useTheme();

    // Determine mode
    const routeParams = route?.params || {};
    const isMultiplayer = !!currentRoom && !routeParams.players;

    // Local state for single-player
    const [localCharacter, setLocalCharacter] = useState('');
    const [localIsPlaying, setLocalIsPlaying] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [guessedCorrect, setGuessedCorrect] = useState(null);

    // Get players list
    const players = isMultiplayer
        ? (contextPlayers?.map(p => p.player?.username || 'Player') || ['Player 1', 'Player 2'])
        : (routeParams.players || ['Player 1', 'Player 2']);

    const category = routeParams.category || gameState?.state?.category || 'famous';
    const roundTime = routeParams.roundTime || gameState?.state?.roundTime || 60;

    // Multiplayer state from DB
    const currentPlayerIndex = isMultiplayer
        ? (gameState?.current_question?.player_index || 0)
        : (routeParams.currentPlayerIndex || 0);
    const scores = isMultiplayer
        ? (gameState?.scores || {})
        : (routeParams.scores || {});
    const character = isMultiplayer
        ? (gameState?.current_question?.character || '')
        : localCharacter;
    const phase = isMultiplayer
        ? (gameState?.current_question?.phase || 'ready')
        : (localIsPlaying ? 'playing' : 'ready');

    const currentPlayer = players[currentPlayerIndex] || players[0];
    const isLastPlayer = currentPlayerIndex === players.length - 1;

    // Check if it's current user's turn
    const myUsername = contextPlayers?.find(p => p.player_id === user?.id)?.player?.username;
    const isMyTurn = isMultiplayer ? (currentPlayer === myUsername) : true;

    // Ensure we handle array or string for colors
    const gameColors = Array.isArray(colors.brand.primary) ? colors.brand.primary : [colors.brand.primary, colors.brand.primary];
    const accentColor = Array.isArray(colors.brand.primary) ? colors.brand.primary[0] : colors.brand.primary;

    // Generate character for single-player
    useEffect(() => {
        if (!isMultiplayer) {
            setLocalCharacter(getRandomCharacter(category, language));
        }
    }, [isMultiplayer]);

    // Sync game state for multiplayer
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

    const handleStart = async () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        if (isMultiplayer) {
            // Generate character and sync to all players
            const newCharacter = getRandomCharacter(category, language);
            await syncGameState({
                phase: 'playing',
                character: newCharacter,
                player_index: currentPlayerIndex,
            });
        } else {
            setLocalIsPlaying(true);
        }
    };

    const handleTimeUp = async () => {
        if (isMultiplayer) {
            if (isMyTurn) {
                await syncGameState({ phase: 'result' });
            }
        } else {
            setLocalIsPlaying(false);
            setShowResultModal(true);
        }
    };

    const handleGuessResult = async (correct) => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setGuessedCorrect(correct);

        const newScores = { ...scores };
        if (correct) {
            newScores[currentPlayer] = (newScores[currentPlayer] || 0) + 1;
        }

        if (isMultiplayer) {
            const nextIndex = currentPlayerIndex + 1;
            const isFinished = nextIndex >= players.length;

            if (isFinished) {
                // End game
                await updateGameState({
                    game_phase: 'finished',
                    scores: newScores,
                    current_question: {
                        phase: 'finished',
                        player_index: currentPlayerIndex,
                    },
                });
                setTimeout(() => {
                    leaveRoom();
                    navigation.replace('Home');
                }, 1500);
            } else {
                // Next player
                await syncGameState({
                    phase: 'ready',
                    character: '',
                    player_index: nextIndex,
                    scores: newScores,
                });
            }
        } else {
            setTimeout(() => {
                setShowResultModal(false);
                if (isLastPlayer) {
                    navigation.replace('WhoAmIResults', { players, scores: newScores, category });
                } else {
                    navigation.replace('WhoAmIPlay', {
                        players, category, roundTime, currentPlayerIndex: currentPlayerIndex + 1, scores: newScores,
                    });
                }
            }, 1000);
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

    // MULTIPLAYER: Result phase (after time up)
    if (isMultiplayer && phase === 'result') {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                    <View style={styles.centerContent}>
                        <MotiView
                            from={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ alignItems: 'center' }}
                        >
                            <Text style={[styles.label, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                                {isKurdish ? 'کارەکتەرەکە بوو:' : 'The character was:'}
                            </Text>
                            <Text style={[styles.playerName, { color: colors.text.primary, fontSize: 32 }, isKurdish && styles.kurdishFont]}>
                                {character}
                            </Text>

                            {isMyTurn ? (
                                <View style={{ alignItems: 'center', width: '100%' }}>
                                    <Text style={[styles.instruction, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                                        {isKurdish ? 'ئایا توانیت بیزانیت؟' : 'Did you guess it?'}
                                    </Text>
                                    <View style={[styles.row, { flexDirection: isKurdish ? 'row-reverse' : 'row', marginTop: 24 }]}>
                                        <Button
                                            title={t('common.yes', language)}
                                            onPress={() => handleGuessResult(true)}
                                            gradient={[colors.brand.success, colors.brand.success]}
                                            style={{ flex: 1, marginRight: isKurdish ? 0 : 8, marginLeft: isKurdish ? 8 : 0 }}
                                            isKurdish={isKurdish}
                                        />
                                        <Button
                                            title={t('common.no', language)}
                                            onPress={() => handleGuessResult(false)}
                                            gradient={[colors.brand.error, colors.brand.error]}
                                            style={{ flex: 1, marginLeft: isKurdish ? 0 : 8, marginRight: isKurdish ? 8 : 0 }}
                                            isKurdish={isKurdish}
                                        />
                                    </View>
                                </View>
                            ) : (
                                <View style={{ alignItems: 'center', marginTop: 24 }}>
                                    <ActivityIndicator size="small" color={accentColor} />
                                    <Text style={[styles.instructionHint, { color: colors.text.muted, marginTop: 12 }]}>
                                        {isKurdish ? `چاوەڕوانی ${currentPlayer}...` : `Waiting for ${currentPlayer}...`}
                                    </Text>
                                </View>
                            )}
                        </MotiView>
                    </View>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    // Ready Screen
    if (phase === 'ready') {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                    <ScrollView
                        style={styles.scrollContainer}
                        contentContainerStyle={styles.centerContent}
                        showsVerticalScrollIndicator={true}
                    >
                        <MotiView
                            from={{ opacity: 0, translateY: -20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            style={[styles.badge, { backgroundColor: colors.surface }]}
                        >
                            <Text style={[styles.badgeText, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                                {t('common.player', language)} {currentPlayerIndex + 1}/{players.length}
                            </Text>
                        </MotiView>

                        <Text style={[styles.label, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'ئێستا نۆرەی' : "Now it's time for"}
                        </Text>
                        <Text style={[styles.playerName, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                            {currentPlayer}
                        </Text>

                        {isMultiplayer && !isMyTurn && (
                            <GlassCard style={{ padding: SPACING.md, marginBottom: 24, width: '100%', alignItems: 'center' }}>
                                <ActivityIndicator size="small" color={accentColor} />
                                <Text style={[styles.instructionHint, { color: colors.text.muted, marginTop: 8 }]}>
                                    {isKurdish ? `چاوەڕوانی ${currentPlayer} بۆ دەستپێکردن...` : `Waiting for ${currentPlayer} to start...`}
                                </Text>
                            </GlassCard>
                        )}

                        <MotiView
                            from={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', delay: 200 }}
                            style={{ alignItems: 'center', marginBottom: 48 }}
                        >
                            <Smartphone size={64} color={colors.text.secondary} style={{ marginBottom: 24 }} />
                            <Text style={[styles.instruction, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                                {isKurdish
                                    ? 'موبایلەکە بخەرە سەر ناوچەوانت بەبێ ئەوەی سەیری شاشەکە بکەیت (با ڕووی شاشەکە لە هاوڕێکانت بێت)'
                                    : 'Hold the phone on your forehead facing your friends without looking at the screen!'}
                            </Text>
                            <Text style={[styles.instructionHint, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                                {isKurdish
                                    ? 'زیاتر پرسیاری "بەڵێ" یان "نەخێر" بکە بۆ زانینی کارەکتەرەکەت.'
                                    : 'Ask Yes/No questions to guess who you are.'}
                            </Text>
                        </MotiView>

                        {(!isMultiplayer || isMyTurn) && (
                            <Button
                                title={isKurdish ? 'دەستپێکردن' : 'Start Timer'}
                                onPress={handleStart}
                                gradient={gameColors}
                                icon={<Play size={20} color="#FFF" />}
                                isKurdish={isKurdish}
                            />
                        )}

                        {/* Scores display for multiplayer */}
                        {isMultiplayer && Object.keys(scores).length > 0 && (
                            <GlassCard style={{ marginTop: 24, padding: SPACING.md, width: '100%' }}>
                                <Text style={[{ color: colors.text.muted, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }]}>
                                    {isKurdish ? 'خاڵەکان' : 'Scores'}
                                </Text>
                                {Object.entries(scores).sort(([, a], [, b]) => b - a).map(([name, score]) => (
                                    <View key={name} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
                                        <Text style={{ color: colors.text.primary, fontWeight: '600' }}>{name}</Text>
                                        <Text style={{ color: colors.brand.success, fontWeight: '700' }}>{score}</Text>
                                    </View>
                                ))}
                            </GlassCard>
                        )}
                    </ScrollView>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    // Gameplay Screen (Forehead Mode)
    return (
        <LinearGradient
            colors={gameColors}
            style={styles.gameContainer}
        >
            <MotiView
                from={{ opacity: 0, scale: 0.5, rotateX: '90deg' }}
                animate={{ opacity: 1, scale: 1, rotateX: '0deg' }}
                transition={{ type: 'spring', damping: 14 }}
                style={[styles.rotateContainer]}
            >
                {/* In multiplayer, only show character to non-guessing players */}
                {isMultiplayer && !isMyTurn ? (
                    <Text style={[styles.gameCharacter, isKurdish && styles.kurdishFont]}>{character}</Text>
                ) : isMultiplayer && isMyTurn ? (
                    <Text style={[styles.gameCharacter, { fontSize: 28 }, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? '🤔 پرسیار بکە!' : '🤔 Ask questions!'}
                    </Text>
                ) : (
                    <Text style={[styles.gameCharacter, isKurdish && styles.kurdishFont]}>{character}</Text>
                )}

                <Timer
                    duration={roundTime}
                    onComplete={handleTimeUp}
                    isRunning={phase === 'playing'}
                    size={120}
                />

                {(!isMultiplayer || isMyTurn) && (
                    <TouchableOpacity style={styles.skipButton} onPress={handleTimeUp}>
                        <Text style={[styles.skipText, isKurdish && styles.kurdishFont]}>
                            {t('common.endTurn', language)}
                        </Text>
                    </TouchableOpacity>
                )}
            </MotiView>

            {/* Single-player result modal */}
            {!isMultiplayer && (
                <Modal
                    visible={showResultModal}
                    onClose={() => { }}
                    title={t('common.didYouGuessIt', language)}
                    showClose={false}
                    isKurdish={isKurdish}
                >
                    <View style={[styles.row, { flexDirection: isKurdish ? 'row-reverse' : 'row' }]}>
                        <Button
                            title={t('common.yes', language)}
                            onPress={() => handleGuessResult(true)}
                            gradient={[colors.brand.success, colors.brand.success]}
                            style={{ flex: 1, marginRight: isKurdish ? 0 : 8, marginLeft: isKurdish ? 8 : 0 }}
                            isKurdish={isKurdish}
                        />
                        <Button
                            title={t('common.no', language)}
                            onPress={() => handleGuessResult(false)}
                            gradient={[colors.brand.error, colors.brand.error]}
                            style={{ flex: 1, marginLeft: isKurdish ? 0 : 8, marginRight: isKurdish ? 8 : 0 }}
                            isKurdish={isKurdish}
                        />
                    </View>
                </Modal>
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContainer: { flex: 1 },
    gameContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    centerContent: {
        flexGrow: 1, alignItems: 'center', padding: SPACING.xl, paddingVertical: 40,
        paddingBottom: 100
    },

    badge: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 100, marginBottom: 32 },
    badgeText: { ...FONTS.medium, fontSize: 13 },

    label: { ...FONTS.medium, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
    playerName: { ...FONTS.large, fontSize: 40, marginBottom: 48, textAlign: 'center' },
    instruction: { textAlign: 'center', marginBottom: 12, lineHeight: 28, fontSize: 18, fontWeight: 'bold' },
    instructionHint: { textAlign: 'center', lineHeight: 22, fontSize: 14 },

    card: {
        width: '100%', padding: SPACING.xl,
        borderRadius: BORDER_RADIUS.xl, borderWidth: 1, alignItems: 'center', marginBottom: 48
    },
    cardText: { ...FONTS.large, textAlign: 'center' },

    rotateContainer: { alignItems: 'center', width: '100%' },
    gameCharacter: { color: '#FFF', ...FONTS.large, fontSize: 56, textAlign: 'center', marginBottom: 48 },
    skipButton: { marginTop: 48, padding: 16 },
    skipText: { color: 'rgba(255,255,255,0.6)', ...FONTS.medium },

    row: { flexDirection: 'row', width: '100%' },
    resultText: { ...FONTS.title, marginTop: 16 },
    kurdishFont: { fontFamily: 'Rabar' },
});
