import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, Skull, List, Clock, Hand, User, CheckCircle2, AlarmClock, UserCircle2, MapPin, Lock, EyeOff } from 'lucide-react-native';
import * as Icons from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Modal, GradientBackground, GlassCard } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { getRandomLocation, getAllLocations } from '../../constants/spyfallData';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useGameRoom } from '../../context/GameRoomContext';
import { useAuth } from '../../context/AuthContext';
import { t } from '../../localization/translations';

const { width } = Dimensions.get('window');

export default function SpyfallPlayScreen({ navigation, route }) {
    // Multiplayer context
    const { players: contextPlayers, currentRoom, gameState, updateGameState, leaveRoom, isHost } = useGameRoom();
    const { user } = useAuth();
    const { language, isKurdish } = useLanguage();
    const { colors, isDark } = useTheme();

    // Determine mode
    const routeParams = route?.params || {};
    const isMultiplayer = !!currentRoom && !routeParams.players;

    // Get players list
    const players = isMultiplayer
        ? (contextPlayers?.map(p => p.player?.username || 'Player') || ['Player 1', 'Player 2'])
        : (routeParams.players || ['Player 1', 'Player 2']);

    const gameDuration = routeParams.gameDuration || gameState?.state?.gameDuration || 5;
    const spyCount = routeParams.spyCount || gameState?.state?.spyCount || 1;

    // Game state
    const [localPhase, setLocalPhase] = useState('reveal');
    const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
    const [showRole, setShowRole] = useState(false);
    const [localGameData, setLocalGameData] = useState(null);
    const [timeLeft, setTimeLeft] = useState(gameDuration * 60);
    const [showVoteModal, setShowVoteModal] = useState(false);
    const [showLocationsModal, setShowLocationsModal] = useState(false);
    const [votedPlayer, setVotedPlayer] = useState(null);
    const [showSpyGuessModal, setShowSpyGuessModal] = useState(false);
    const [selectedLocationGuess, setSelectedLocationGuess] = useState(null);

    const timerRef = useRef(null);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Multiplayer state
    const phase = isMultiplayer
        ? (gameState?.current_question?.phase || 'reveal')
        : localPhase;
    const revealIndex = isMultiplayer
        ? (gameState?.current_question?.reveal_index || 0)
        : currentRevealIndex;
    const gameData = isMultiplayer
        ? (gameState?.state?.gameData || null)
        : localGameData;

    // My identity in multiplayer
    const myUsername = isMultiplayer
        ? contextPlayers?.find(p => p.player_id === user?.id)?.player?.username
        : null;
    const isMyTurnToReveal = isMultiplayer
        ? (players[revealIndex] === myUsername)
        : true;

    // RTL styles
    const rowDirection = isKurdish ? 'row-reverse' : 'row';
    const textAlign = isKurdish ? 'right' : 'left';

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
        });
    }, [isMultiplayer, gameState, updateGameState]);

    // Initialize game on mount
    useEffect(() => {
        if (isMultiplayer) {
            if (isHost && !gameState?.state?.gameData) {
                const location = getRandomLocation(language);
                const spyIndices = [];
                while (spyIndices.length < spyCount) {
                    const randomIndex = Math.floor(Math.random() * players.length);
                    if (!spyIndices.includes(randomIndex)) spyIndices.push(randomIndex);
                }
                const playerRoles = players.map((player, index) => {
                    const isSpy = spyIndices.includes(index);
                    const role = isSpy ? (isKurdish ? 'جاسوس' : 'Spy') : location.roles[Math.floor(Math.random() * location.roles.length)];
                    return { name: player, isSpy, role };
                });
                updateGameState({
                    state: {
                        gameData: { location, playerRoles, spyIndices },
                        gameDuration,
                        spyCount,
                    },
                    current_question: {
                        phase: 'reveal',
                        reveal_index: 0,
                    },
                });
            }
        } else {
            initializeGame();
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // Timer pulse animation
    useEffect(() => {
        if (timeLeft <= 30 && phase === 'playing') {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.1, duration: 500, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
                ])
            ).start();
        }
    }, [timeLeft, phase]);

    const initializeGame = () => {
        const location = getRandomLocation(language);

        // Randomly select spies
        const spyIndices = [];
        while (spyIndices.length < spyCount) {
            const randomIndex = Math.floor(Math.random() * players.length);
            if (!spyIndices.includes(randomIndex)) {
                spyIndices.push(randomIndex);
            }
        }

        // Assign roles
        const playerRoles = players.map((player, index) => {
            const isSpy = spyIndices.includes(index);
            const role = isSpy ? (isKurdish ? 'جاسوس' : 'Spy') : location.roles[Math.floor(Math.random() * location.roles.length)];
            return { name: player, isSpy, role };
        });

        setLocalGameData({
            location,
            playerRoles,
            spyIndices,
        });
    };

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    if (isMultiplayer) {
                        syncGameState({ current_question: { phase: 'voting' } });
                    } else {
                        setLocalPhase('voting');
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleRevealComplete = async () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        if (isMultiplayer) {
            if (revealIndex < players.length - 1) {
                setShowRole(false);
                await syncGameState({
                    current_question: { reveal_index: revealIndex + 1, phase: 'reveal' },
                });
            } else {
                await syncGameState({ current_question: { phase: 'playing' } });
                startTimer();
            }
        } else {
            if (currentRevealIndex < players.length - 1) {
                setCurrentRevealIndex(currentRevealIndex + 1);
                setShowRole(false);
            } else {
                setLocalPhase('playing');
                startTimer();
            }
        }
    };

    // Start timer when phase changes to playing (for non-host in multiplayer)
    useEffect(() => {
        if (isMultiplayer && phase === 'playing' && !timerRef.current) {
            startTimer();
        }
    }, [phase]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleVote = (playerIndex) => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setVotedPlayer(playerIndex);
    };

    const confirmVote = async () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const isCaught = gameData.spyIndices.includes(votedPlayer);

        if (isMultiplayer) {
            await updateGameState({
                game_phase: 'finished',
                state: {
                    ...gameState?.state,
                    result: { votedPlayer, spyCaught: isCaught, spyGuessedLocation: false, spyGuessCorrect: false },
                },
            });
        }

        navigation.replace('SpyfallResult', {
            gameData,
            players,
            votedPlayer,
            spyCaught: isCaught,
            spyGuessedLocation: false,
            spyGuessCorrect: false,
        });
    };

    const confirmSpyGuess = async () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        const isCorrect = selectedLocationGuess === gameData.location.key;

        if (isMultiplayer) {
            await updateGameState({
                game_phase: 'finished',
                state: {
                    ...gameState?.state,
                    result: { votedPlayer: null, spyCaught: !isCorrect, spyGuessedLocation: true, spyGuessCorrect: isCorrect },
                },
            });
        }

        navigation.replace('SpyfallResult', {
            gameData,
            players,
            votedPlayer: null,
            spyCaught: !isCorrect,
            spyGuessedLocation: true,
            spyGuessCorrect: isCorrect,
        });
    };

    // Watch for game finish from other players
    useEffect(() => {
        if (isMultiplayer && gameState?.game_phase === 'finished' && gameState?.state?.result) {
            const r = gameState.state.result;
            navigation.replace('SpyfallResult', {
                gameData: gameState.state.gameData,
                players,
                votedPlayer: r.votedPlayer,
                spyCaught: r.spyCaught,
                spyGuessedLocation: r.spyGuessedLocation,
                spyGuessCorrect: r.spyGuessCorrect,
            });
        }
    }, [gameState?.game_phase]);

    // ========================
    // REVEAL PHASE
    // ========================
    if (phase === 'reveal' && gameData) {
        // In multiplayer, find MY role; in single-player, show current reveal player
        const currentRevealPlayer = gameData.playerRoles[revealIndex];
        const myRole = isMultiplayer
            ? gameData.playerRoles.find(p => p.name === myUsername)
            : currentRevealPlayer;

        const CARD_W = width - 64;
        const isSpy = myRole?.isSpy;

        return (
            <GradientBackground>
                <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                    <ScrollView contentContainerStyle={styles.centerContent} showsVerticalScrollIndicator={false}>

                        {/* Progress Dots */}
                        <MotiView
                            from={{ opacity: 0, translateY: -10 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ type: 'timing', duration: 300 }}
                            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}
                        >
                            {players.map((_, i) => (
                                <View
                                    key={i}
                                    style={{
                                        width: i === revealIndex ? 24 : 10,
                                        height: 10,
                                        borderRadius: 5,
                                        backgroundColor: i < revealIndex ? '#10B981'
                                            : i === revealIndex ? '#10B981'
                                                : 'rgba(255,255,255,0.15)',
                                        borderWidth: 1,
                                        borderColor: i <= revealIndex ? '#10B981' : 'rgba(255,255,255,0.1)',
                                    }}
                                />
                            ))}
                        </MotiView>

                        <View style={{ marginBottom: 20 }}>
                            <Text style={[styles.badgeText, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                                {isKurdish
                                    ? `یاریزان ${revealIndex + 1} لە ${players.length}`
                                    : `Player ${revealIndex + 1} of ${players.length}`
                                }
                            </Text>
                        </View>

                        {isMultiplayer && !isMyTurnToReveal ? (
                            <View style={{ alignItems: 'center', paddingVertical: 60 }}>
                                <Lock size={32} color={colors.text.muted} />
                                <Text style={[{ ...FONTS.medium, fontSize: 16, marginTop: 16, textAlign: 'center' }, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                                    {isKurdish ? `چاوەڕوانی ${currentRevealPlayer?.name}...` : `Waiting for ${currentRevealPlayer?.name}...`}
                                </Text>
                                <ActivityIndicator size="small" color={colors.brand.primary} style={{ marginTop: 12 }} />
                            </View>
                        ) : (
                            <>
                                {!showRole ? (
                                    /* ═══════════════════════════ */
                                    /* CARD BACK — TAP TO REVEAL   */
                                    /* ═══════════════════════════ */
                                    <MotiView
                                        from={{ opacity: 0, scale: 0.85 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ type: 'spring', damping: 14, stiffness: 120 }}
                                        style={{ alignItems: 'center', width: '100%' }}
                                    >
                                        <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                                            {/* Glow Ring */}
                                            <MotiView
                                                from={{ opacity: 0.3, scale: 1 }}
                                                animate={{ opacity: 0.7, scale: 1.12 }}
                                                transition={{ type: 'timing', duration: 1500, loop: true }}
                                                style={{
                                                    position: 'absolute',
                                                    width: CARD_W + 16, height: CARD_W * 0.85 + 16,
                                                    borderRadius: 28, backgroundColor: 'rgba(16, 185, 129, 0.18)',
                                                }}
                                            />

                                            <LinearGradient
                                                colors={['#0F2922', '#1A3D33', '#0F2922']}
                                                style={{
                                                    width: CARD_W, height: CARD_W * 0.85,
                                                    borderRadius: 24, alignItems: 'center', justifyContent: 'center',
                                                    borderWidth: 2, borderColor: 'rgba(16, 185, 129, 0.4)', overflow: 'hidden',
                                                }}
                                            >
                                                {/* Pattern Lines */}
                                                <View style={{ position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                                    <View style={{ position: 'absolute', width: 160, height: 1, backgroundColor: 'rgba(16, 185, 129, 0.2)' }} />
                                                    <View style={{ position: 'absolute', width: 160, height: 1, backgroundColor: 'rgba(16, 185, 129, 0.2)', transform: [{ rotate: '60deg' }] }} />
                                                    <View style={{ position: 'absolute', width: 160, height: 1, backgroundColor: 'rgba(16, 185, 129, 0.2)', transform: [{ rotate: '120deg' }] }} />
                                                </View>

                                                {/* Center Icon */}
                                                <MotiView
                                                    from={{ scale: 0.9, opacity: 0.5 }}
                                                    animate={{ scale: 1.05, opacity: 1 }}
                                                    transition={{ type: 'timing', duration: 1200, loop: true }}
                                                >
                                                    <View style={{
                                                        width: 80, height: 80, borderRadius: 40,
                                                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                                                        borderWidth: 2, borderColor: 'rgba(16, 185, 129, 0.4)',
                                                        alignItems: 'center', justifyContent: 'center',
                                                    }}>
                                                        <Eye size={36} color="#A7F3D0" />
                                                    </View>
                                                </MotiView>

                                                {/* ? Symbol */}
                                                <Text style={{ fontSize: 36, fontWeight: '900', color: 'rgba(16, 185, 129, 0.25)', position: 'absolute', bottom: 20 }}>?</Text>

                                                {/* Corner Decorations */}
                                                <View style={{ position: 'absolute', top: 14, left: 14, width: 20, height: 20, borderLeftWidth: 2, borderTopWidth: 2, borderColor: 'rgba(16, 185, 129, 0.5)', borderTopLeftRadius: 6 }} />
                                                <View style={{ position: 'absolute', top: 14, right: 14, width: 20, height: 20, borderRightWidth: 2, borderTopWidth: 2, borderColor: 'rgba(16, 185, 129, 0.5)', borderTopRightRadius: 6 }} />
                                                <View style={{ position: 'absolute', bottom: 14, left: 14, width: 20, height: 20, borderLeftWidth: 2, borderBottomWidth: 2, borderColor: 'rgba(16, 185, 129, 0.5)', borderBottomLeftRadius: 6 }} />
                                                <View style={{ position: 'absolute', bottom: 14, right: 14, width: 20, height: 20, borderRightWidth: 2, borderBottomWidth: 2, borderColor: 'rgba(16, 185, 129, 0.5)', borderBottomRightRadius: 6 }} />
                                            </LinearGradient>
                                        </View>

                                        {/* Player Name */}
                                        <Text style={[{ ...FONTS.medium, fontSize: 14, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                                            {isMultiplayer
                                                ? (isKurdish ? 'نۆرەی تۆیە!' : "It's your turn!")
                                                : t('common.passPhoneTo', language)}
                                        </Text>
                                        <Text style={[{ ...FONTS.title, fontSize: 36, marginBottom: 8, textAlign: 'center' }, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                                            {isMultiplayer ? myUsername : currentRevealPlayer.name}
                                        </Text>
                                        <Text style={[{ textAlign: 'center', lineHeight: 22, fontSize: 14, marginBottom: 28 }, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                                            {isKurdish
                                                ? 'لێ بدە بۆ بینینی نۆرەی خۆت.\nبە نهێنی بیهێڵەرەوە!'
                                                : 'Tap to reveal your role.\nKeep it secret!'
                                            }
                                        </Text>

                                        {/* Reveal Button */}
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                                setShowRole(true);
                                            }}
                                            activeOpacity={0.8}
                                            style={{ borderRadius: 20, overflow: 'hidden', elevation: 8, shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12 }}
                                        >
                                            <MotiView
                                                from={{ scale: 1 }}
                                                animate={{ scale: 1.05 }}
                                                transition={{ type: 'timing', duration: 800, loop: true }}
                                            >
                                                <LinearGradient
                                                    colors={['#10B981', '#059669', '#047857']}
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 1 }}
                                                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 16, paddingHorizontal: 40, borderRadius: 20 }}
                                                >
                                                    <Eye size={28} color="#FFF" />
                                                    <Text style={[{ color: '#FFF', fontSize: 18, fontWeight: '700', letterSpacing: 1 }, isKurdish && styles.kurdishFont]}>
                                                        {isKurdish ? 'نۆرەکەم ببینە' : 'Reveal My Role'}
                                                    </Text>
                                                </LinearGradient>
                                            </MotiView>
                                        </TouchableOpacity>
                                    </MotiView>
                                ) : (
                                    /* ═══════════════════════════ */
                                    /* CARD FRONT — ROLE REVEALED  */
                                    /* ═══════════════════════════ */
                                    <MotiView
                                        from={{ opacity: 0, scale: 0.7, rotateY: '90deg' }}
                                        animate={{ opacity: 1, scale: 1, rotateY: '0deg' }}
                                        transition={{ type: 'spring', damping: 12, stiffness: 100 }}
                                        style={{ alignItems: 'center', width: '100%' }}
                                    >
                                        {/* Premium Role Card */}
                                        <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                                            {/* Glow Behind Card */}
                                            <MotiView
                                                from={{ opacity: 0.4, scale: 0.95 }}
                                                animate={{ opacity: 0.8, scale: 1.02 }}
                                                transition={{ type: 'timing', duration: 1500, loop: true }}
                                                style={{
                                                    position: 'absolute',
                                                    width: CARD_W + 24, height: 380,
                                                    borderRadius: 30,
                                                    backgroundColor: isSpy ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)',
                                                }}
                                            />

                                            <LinearGradient
                                                colors={isSpy
                                                    ? ['#7F1D1D', '#991B1B', '#B91C1C', '#991B1B', '#7F1D1D']
                                                    : ['#064E3B', '#047857', '#059669', '#047857', '#064E3B']
                                                }
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                                style={{
                                                    width: CARD_W, minHeight: 320,
                                                    borderRadius: 24, alignItems: 'center',
                                                    paddingVertical: 24, paddingHorizontal: 20,
                                                    borderWidth: 2,
                                                    borderColor: isSpy ? '#EF4444' : '#10B981',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                {/* Top Label */}
                                                <View style={{ backgroundColor: 'rgba(0,0,0,0.3)', paddingVertical: 6, paddingHorizontal: 20, borderRadius: 20, marginBottom: 20 }}>
                                                    <Text style={[{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' }, isKurdish && styles.kurdishFont]}>
                                                        {isKurdish ? 'ڕۆڵی نهێنی تۆ' : 'YOUR SECRET ROLE'}
                                                    </Text>
                                                </View>

                                                {/* Icon */}
                                                <MotiView
                                                    from={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: 'spring', delay: 200, damping: 10 }}
                                                    style={{
                                                        width: 100, height: 100, borderRadius: 50,
                                                        alignItems: 'center', justifyContent: 'center',
                                                        borderWidth: 2, marginBottom: 16,
                                                        backgroundColor: isSpy ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                                        borderColor: isSpy ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)',
                                                    }}
                                                >
                                                    {isSpy ? (
                                                        <Skull size={56} color="#FCA5A5" strokeWidth={1.5} />
                                                    ) : (
                                                        <MapPin size={56} color="#6EE7B7" strokeWidth={1.5} />
                                                    )}
                                                </MotiView>

                                                {/* Role Title */}
                                                <MotiView
                                                    from={{ opacity: 0, translateY: 10 }}
                                                    animate={{ opacity: 1, translateY: 0 }}
                                                    transition={{ delay: 300 }}
                                                >
                                                    <Text style={[{
                                                        fontSize: 28, fontWeight: '900', letterSpacing: 2,
                                                        textAlign: 'center', marginBottom: 12,
                                                        color: isSpy ? '#FCA5A5' : '#6EE7B7',
                                                    }, isKurdish && styles.kurdishFont]}>
                                                        {isSpy
                                                            ? (isKurdish ? '🕵️ جاسوس' : '🕵️ SPY')
                                                            : (isKurdish ? '✅ شارمەند' : '✅ CIVILIAN')}
                                                    </Text>
                                                </MotiView>

                                                {/* Divider */}
                                                <View style={{
                                                    width: '60%', height: 1, marginVertical: 16,
                                                    backgroundColor: isSpy ? 'rgba(252, 165, 165, 0.3)' : 'rgba(110, 231, 183, 0.3)',
                                                }} />

                                                {/* Content */}
                                                <MotiView
                                                    from={{ opacity: 0, translateY: 15 }}
                                                    animate={{ opacity: 1, translateY: 0 }}
                                                    transition={{ delay: 450 }}
                                                    style={{ alignItems: 'center', width: '100%' }}
                                                >
                                                    {isSpy ? (
                                                        <>
                                                            <Text style={[{ color: 'rgba(255,255,255,0.8)', fontSize: 15, textAlign: 'center', lineHeight: 24, marginBottom: 16 }, isKurdish && styles.kurdishFont]}>
                                                                {t('spyfall.figureOut', language)}
                                                            </Text>
                                                            <View style={{
                                                                flexDirection: 'row', alignItems: 'center', gap: 6,
                                                                backgroundColor: 'rgba(251, 191, 36, 0.15)',
                                                                paddingVertical: 8, paddingHorizontal: 16,
                                                                borderRadius: 20, borderWidth: 1,
                                                                borderColor: 'rgba(251, 191, 36, 0.3)',
                                                            }}>
                                                                <Icons.Sparkles size={14} color="#FBBF24" />
                                                                <Text style={[{ color: '#FBBF24', fontSize: 13, fontWeight: '600' }, isKurdish && styles.kurdishFont]}>
                                                                    {isKurdish ? 'بە وردی گوێ بگرە' : 'Listen carefully to clues'}
                                                                </Text>
                                                            </View>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {/* Location */}
                                                            <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: 4, paddingHorizontal: 16, borderRadius: 12, marginBottom: 8 }}>
                                                                <Text style={[{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' }, isKurdish && styles.kurdishFont]}>
                                                                    {t('common.location', language)}
                                                                </Text>
                                                            </View>
                                                            <Text style={[{
                                                                color: '#FFFFFF', fontSize: 36, fontWeight: '900',
                                                                textAlign: 'center', letterSpacing: 1, marginBottom: 16,
                                                                textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4,
                                                            }, isKurdish && styles.kurdishFont]}>
                                                                {gameData.location.name}
                                                            </Text>

                                                            {/* Your Role */}
                                                            <View style={{
                                                                backgroundColor: 'rgba(255,255,255,0.1)',
                                                                paddingVertical: 10, paddingHorizontal: 20,
                                                                borderRadius: 12, alignItems: 'center', marginTop: 4,
                                                            }}>
                                                                <Text style={[{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 4 }, isKurdish && styles.kurdishFont]}>
                                                                    {isKurdish ? '🎭 نۆرەی تۆ' : '🎭 Your Role'}
                                                                </Text>
                                                                <Text style={[{ color: 'rgba(255,255,255,0.9)', fontSize: 18, fontWeight: '700', textAlign: 'center' }, isKurdish && styles.kurdishFont]}>
                                                                    {myRole?.role}
                                                                </Text>
                                                            </View>
                                                        </>
                                                    )}
                                                </MotiView>

                                                {/* Corner Marks */}
                                                <View style={{ position: 'absolute', top: 12, left: 12, width: 20, height: 20, borderLeftWidth: 2, borderTopWidth: 2, borderColor: isSpy ? '#EF444460' : '#10B98160', borderTopLeftRadius: 4 }} />
                                                <View style={{ position: 'absolute', bottom: 12, right: 12, width: 20, height: 20, borderRightWidth: 2, borderBottomWidth: 2, borderColor: isSpy ? '#EF444460' : '#10B98160', borderBottomRightRadius: 4 }} />
                                            </LinearGradient>
                                        </View>

                                        {/* Ready Button */}
                                        <TouchableOpacity
                                            onPress={handleRevealComplete}
                                            activeOpacity={0.8}
                                            style={{ borderRadius: 20, overflow: 'hidden', elevation: 6, shadowColor: '#D900FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10 }}
                                        >
                                            <LinearGradient
                                                colors={['#D900FF', '#9333EA', '#7C3AED']}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, paddingHorizontal: 40, borderRadius: 20 }}
                                            >
                                                <EyeOff size={22} color="#FFF" />
                                                <Text style={[{ color: '#FFF', fontSize: 17, fontWeight: '700' }, isKurdish && styles.kurdishFont]}>
                                                    {t('common.ready', language)}
                                                </Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </MotiView>
                                )}
                            </>
                        )}
                    </ScrollView>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    // ========================
    // PLAYING PHASE
    // ========================
    if (phase === 'playing' && gameData) {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                    {/* Header with Timer */}
                    <View style={[styles.gameHeader, { flexDirection: rowDirection }]}>
                        <TouchableOpacity
                            style={[styles.locationBtn, { flexDirection: rowDirection }]}
                            onPress={() => setShowLocationsModal(true)}
                        >
                            <List size={20} color={colors.text.secondary} />
                            <Text style={[styles.locationBtnText, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                                {t('common.location', language)}
                            </Text>
                        </TouchableOpacity>

                        <Animated.View style={[styles.timerBadge, { transform: [{ scale: pulseAnim }], flexDirection: rowDirection }]}>
                            <Clock size={20} color={timeLeft <= 30 ? COLORS.accent.danger : colors.text.primary} />
                            <Text style={[styles.timerText, { color: colors.text.primary }, timeLeft <= 30 && styles.timerDanger]}>
                                {formatTime(timeLeft)}
                            </Text>
                        </Animated.View>

                        <View style={{ flexDirection: rowDirection, gap: 8 }}>
                            <TouchableOpacity
                                style={[styles.voteBtn, { flexDirection: rowDirection, backgroundColor: COLORS.accent.warning }]}
                                onPress={() => setShowSpyGuessModal(true)}
                            >
                                <MapPin size={20} color="#FFF" />
                                <Text style={[styles.voteBtnText, { color: '#FFF' }, isKurdish && styles.kurdishFont, { display: width > 350 ? 'flex' : 'none' }]}>
                                    {isKurdish ? 'جاسوس' : 'Guess'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.voteBtn, { flexDirection: rowDirection }]}
                                onPress={() => setShowVoteModal(true)}
                            >
                                <Hand size={20} color="#FFF" />
                                <Text style={[styles.voteBtnText, isKurdish && styles.kurdishFont]}>
                                    {t('common.vote', language)}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView contentContainerStyle={styles.playContent}>
                        <Text style={[styles.gameTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                            {t('spyfall.askQuestions', language)}
                        </Text>
                        <Text style={[styles.gameSubtitle, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                            {t('spyfall.askInstruction', language)}
                        </Text>

                        {/* Player List */}
                        <View style={[styles.playerGrid, { flexDirection: rowDirection }]}>
                            {players.map((player, index) => (
                                <View key={index} style={[styles.playerChip, { flexDirection: rowDirection, backgroundColor: colors.surface }]}>
                                    <User size={16} color={colors.accent || colors.primary} />
                                    <Text style={[styles.playerChipText, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>{player}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.tipsCard}>
                            <Text style={[styles.tipsTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont, { textAlign }]}>
                                {t('spyfall.tipsPlayers', language)}
                            </Text>
                            <Text style={[styles.tipsText, { color: colors.text.muted }, isKurdish && styles.kurdishFont, { textAlign }]}>
                                {isKurdish
                                    ? '• پرسیارێک بکە کە تەنها کەسێک لەو شوێنە بزانێت\n• بە شێوەیەکی ناڕۆشن پرسیار بکە تا جاسوسەکە تێ نەگات\n• سەرنجی وەڵامە شڵەژاوەکان بدە'
                                    : "• Ask questions that only someone at the location would know\n• Be vague enough that the spy can't guess\n• Watch for confused or suspicious answers"
                                }
                            </Text>
                        </View>

                        <View style={styles.tipsCard}>
                            <Text style={[styles.tipsTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont, { textAlign }]}>
                                {t('spyfall.tipsSpy', language)}
                            </Text>
                            <Text style={[styles.tipsText, { color: colors.text.muted }, isKurdish && styles.kurdishFont, { textAlign }]}>
                                {isKurdish
                                    ? '• بە وردی گوێ لە پرسیارەکان بگرە بۆ وەرگرتنی سەرەداو\n• وەڵامی ناڕۆشن بەڵام گونجاو بدەرەوە\n• تۆش دەتوانیت تۆمەتی کەسێکی تر بکەیت!'
                                    : "• Listen carefully to questions for clues\n• Give vague but plausible answers\n• You can accuse someone too!"
                                }
                            </Text>
                        </View>
                    </ScrollView>

                    {/* Vote Modal */}
                    <Modal
                        visible={showVoteModal}
                        onClose={() => { setShowVoteModal(false); setVotedPlayer(null); }}
                        title={isKurdish ? 'دەنگ بدە بۆ جاسوس!' : "Vote for the Spy!"}
                        isKurdish={isKurdish}
                    >
                        <ScrollView style={styles.voteList}>
                            {players.map((player, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.voteItem,
                                        { flexDirection: rowDirection },
                                        votedPlayer === index && styles.voteItemSelected
                                    ]}
                                    onPress={() => handleVote(index)}
                                >
                                    <Text style={[styles.voteItemText, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>{player}</Text>
                                    {votedPlayer === index && (
                                        <CheckCircle2 size={24} color={COLORS.accent.success} />
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

                    {/* Locations Modal */}
                    <Modal
                        visible={showLocationsModal}
                        onClose={() => setShowLocationsModal(false)}
                        title={t('spyfall.possibleLocations', language)}
                        isKurdish={isKurdish}
                    >
                        <ScrollView style={styles.locationsList}>
                            {getAllLocations(language).map((loc) => {
                                const IconComponent = Icons[loc.icon] || Icons.HelpCircle;
                                return (
                                    <View key={loc.key} style={[styles.locationItem, { flexDirection: rowDirection }]}>
                                        <IconComponent size={20} color={colors.accent || colors.primary} />
                                        <Text style={[styles.locationItemText, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>{loc.name}</Text>
                                    </View>
                                );
                            })}
                        </ScrollView>
                    </Modal>

                    {/* Spy Guess Modal */}
                    <Modal
                        visible={showSpyGuessModal}
                        onClose={() => { setShowSpyGuessModal(false); setSelectedLocationGuess(null); }}
                        title={isKurdish ? 'پێشبینیکردنی شوێن' : "Spy: Guess Location"}
                        isKurdish={isKurdish}
                    >
                        <Text style={[styles.gameSubtitle, isKurdish && styles.kurdishFont, { marginBottom: 16 }]}>
                            {isKurdish
                                ? 'ئەگەر تۆ جاسوسیت، کام شوێنە ڕاستە؟ (ئەگەر هەڵە بکەیت دەدۆڕێیت!)'
                                : 'If you are the spy, guess the location! (If wrong, you lose!)'}
                        </Text>
                        <ScrollView style={styles.locationsList}>
                            {getAllLocations(language).map((loc) => {
                                const IconComponent = Icons[loc.icon] || Icons.HelpCircle;
                                return (
                                    <TouchableOpacity
                                        key={loc.key}
                                        style={[
                                            styles.locationItem,
                                            { flexDirection: rowDirection },
                                            selectedLocationGuess === loc.key && styles.voteItemSelected
                                        ]}
                                        onPress={() => setSelectedLocationGuess(loc.key)}
                                    >
                                        <IconComponent size={20} color={selectedLocationGuess === loc.key ? COLORS.accent.success : COLORS.accent.primary} />
                                        <Text numberOfLines={1} style={[
                                            styles.locationItemText,
                                            isKurdish && styles.kurdishFont,
                                            selectedLocationGuess === loc.key && { color: COLORS.accent.success, fontWeight: 'bold' }
                                        ]}>
                                            {loc.name}
                                        </Text>
                                        {selectedLocationGuess === loc.key && (
                                            <CheckCircle2 size={24} color={COLORS.accent.success} style={isKurdish ? { marginRight: 'auto' } : { marginLeft: 'auto' }} />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                        <Button
                            title={isKurdish ? 'دووپاتکردنەوەی پێشبینی' : "Confirm Guess"}
                            onPress={confirmSpyGuess}
                            disabled={selectedLocationGuess === null}
                            gradient={[COLORS.accent.warning, COLORS.accent.danger]}
                            style={{ marginTop: SPACING.md }}
                            icon={<MapPin size={20} color="#FFF" />}
                            isKurdish={isKurdish}
                        />
                    </Modal>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    // ========================
    // VOTING PHASE (Time's Up)
    // ========================
    if (phase === 'voting' && gameData) {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                    <ScrollView contentContainerStyle={styles.centerContent}>
                        <View style={styles.timeUpBadge}>
                            <AlarmClock size={48} color={COLORS.accent.danger} />
                            <Text style={[styles.timeUpText, { color: COLORS.accent.danger }, isKurdish && styles.kurdishFont]}>
                                {t('quiz.timeUp', language)}
                            </Text>
                        </View>

                        <Text style={[styles.voteTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'دەنگ بدە بۆ جاسوس!' : "Vote for the Spy!"}
                        </Text>
                        <Text style={[styles.voteSubtitle, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                            {t('spyfall.discussAndVote', language)}
                        </Text>

                        <View style={[styles.voteGrid, { flexDirection: rowDirection }]}>
                            {players.map((player, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.voteCard,
                                        votedPlayer === index && styles.voteCardSelected
                                    ]}
                                    onPress={() => handleVote(index)}
                                >
                                    {votedPlayer === index ? (
                                        <CheckCircle2 size={32} color={COLORS.accent.success} />
                                    ) : (
                                        <UserCircle2 size={32} color={colors.text.secondary} />
                                    )}
                                    <Text style={[
                                        styles.voteCardText,
                                        { color: colors.text.secondary },
                                        votedPlayer === index && styles.voteCardTextSelected,
                                        isKurdish && styles.kurdishFont
                                    ]}>{player}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Button
                            title={isKurdish ? 'پیشاندانی ئەنجامەکان' : "Reveal Results"}
                            onPress={confirmVote}
                            disabled={votedPlayer === null}
                            gradient={[COLORS.accent.danger, COLORS.accent.danger]}
                            style={{ marginTop: SPACING.lg }}
                            isKurdish={isKurdish}
                        />
                    </ScrollView>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1 },
    centerContent: {
        flexGrow: 1, alignItems: 'center', padding: SPACING.xl,
        justifyContent: 'center', paddingBottom: 100
    },
    playContent: { padding: SPACING.lg, paddingBottom: 100 },

    badge: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 100, marginBottom: 32 },
    badgeText: { ...FONTS.medium, fontSize: 13 },

    label: { ...FONTS.medium, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
    playerName: { ...FONTS.large, fontSize: 36, marginBottom: 32, textAlign: 'center' },
    instruction: { textAlign: 'center', marginBottom: 32, lineHeight: 24 },

    roleContainer: { alignItems: 'center', width: '100%' },

    spyCard: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.accent.danger,
        width: '100%',
    },
    spyText: { ...FONTS.large, marginTop: SPACING.md },
    spyHint: { textAlign: 'center', marginTop: SPACING.sm },

    infoCard: {
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        width: '100%',
        borderWidth: 1,
        borderColor: COLORS.accent.success,
    },
    infoRow: { marginVertical: SPACING.sm },
    infoLabel: { fontSize: 12, marginBottom: 4 },
    infoValue: { ...FONTS.title },
    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: SPACING.sm },

    // Game Header
    gameHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
    },
    locationBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    locationBtnText: { ...FONTS.medium, fontSize: 13 },
    timerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    timerText: { ...FONTS.bold, fontSize: 18 },
    timerDanger: { color: COLORS.accent.danger },
    voteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: COLORS.accent.danger,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    voteBtnText: { color: '#FFF', ...FONTS.medium, fontSize: 13 },

    // Game Content
    gameTitle: { ...FONTS.large, textAlign: 'center', marginBottom: 8 },
    gameSubtitle: { textAlign: 'center', marginBottom: SPACING.lg },

    playerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: SPACING.lg },
    playerChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    playerChipText: { ...FONTS.medium, fontSize: 14 },

    tipsCard: {
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    tipsTitle: { ...FONTS.medium, marginBottom: 8 },
    tipsText: { lineHeight: 22 },

    // Vote Modal
    voteList: { maxHeight: 300 },
    voteItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        marginBottom: 8,
    },
    voteItemSelected: { backgroundColor: 'rgba(16, 185, 129, 0.2)', borderColor: COLORS.accent.success, borderWidth: 1 },
    voteItemText: { ...FONTS.medium },

    // Locations Modal
    locationsList: { maxHeight: 350 },
    locationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.08)',
    },
    locationItemText: { ...FONTS.medium },

    // Time's Up
    timeUpBadge: { alignItems: 'center', marginBottom: SPACING.lg },
    timeUpText: { ...FONTS.large, marginTop: 8 },
    voteTitle: { ...FONTS.title, marginBottom: 8 },
    voteSubtitle: { marginBottom: SPACING.lg },

    voteGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
    voteCard: {
        width: (width - 80) / 2,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    voteCardSelected: { borderColor: COLORS.accent.success, backgroundColor: 'rgba(16, 185, 129, 0.1)' },
    voteCardText: { ...FONTS.medium, marginTop: 8 },
    voteCardTextSelected: { color: COLORS.accent.success },
    kurdishFont: { fontFamily: 'Rabar' },
});
