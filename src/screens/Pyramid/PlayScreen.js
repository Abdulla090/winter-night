import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, PanResponder, Animated, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { MotiView, MotiText } from 'moti';
import { Check, X, Clock, Trophy, ChevronRight } from 'lucide-react-native';

import { GradientBackground, Timer } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { useGameRoom } from '../../context/GameRoomContext';
import { useAuth } from '../../context/AuthContext';
import { t } from '../../localization/translations';
import { categories } from '../../constants/pyramidData';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;
const CARD_WIDTH = Math.min(width - 48, 400); // Max width for web

export default function PyramidPlayScreen({ navigation, route }) {
    // ... (Keep existing hooks same as before) ...
    const { players: contextPlayers, currentRoom, gameState, updateGameState, leaveRoom, isHost } = useGameRoom();
    const { user } = useAuth();
    const { language, isKurdish } = useLanguage();

    const routeParams = route?.params || {};
    const isMultiplayer = !!currentRoom && !routeParams.teamName;
    const categoryId = routeParams.category?.id || 'standard';
    const category = routeParams.category || categories[0];

    // Local state
    const [localWords, setLocalWords] = useState([]);
    const [localCurrentIndex, setLocalCurrentIndex] = useState(0);
    const [localScore, setLocalScore] = useState(0);
    const [localPhase, setLocalPhase] = useState('preview');

    const position = useRef(new Animated.ValueXY()).current;

    // Use effects for initialization same as before
    useEffect(() => {
        if (!isMultiplayer) {
            setLocalWords(category.items || []);
        }
    }, [isMultiplayer, category]);

    // Multiplayer State Sync (same logic)
    const words = isMultiplayer ? (gameState?.state?.words || []) : localWords;
    const currentIndex = isMultiplayer ? (gameState?.state?.current_index || 0) : localCurrentIndex;
    const score = isMultiplayer ? (gameState?.scores?.current || 0) : localScore;
    const phase = isMultiplayer ? (gameState?.game_phase === 'playing' ? 'playing' : (gameState?.game_phase === 'result' ? 'result' : 'preview')) : localPhase;

    // Giver Logic
    const giverIndex = isMultiplayer ? (gameState?.state?.giver_index || 0) : 0;
    const isGiver = isMultiplayer ? (contextPlayers?.[giverIndex]?.player_id === user?.id) : true;
    const giverName = isMultiplayer ? (contextPlayers?.[giverIndex]?.player?.username || 'Giver') : 'Giver';
    const currentWord = words[currentIndex] ? words[currentIndex][language] : null;

    // ... (Keep existing logic handlers: syncState, startGame, handleNextWord, handleTimeUp) ...
    const syncState = useCallback(async (updates) => {
        if (!isMultiplayer) return;
        await updateGameState({
            state: { ...gameState?.state, ...updates.state },
            scores: { ...gameState?.scores, ...updates.scores },
            game_phase: updates.phase || gameState?.game_phase
        });
    }, [isMultiplayer, gameState, updateGameState]);

    useEffect(() => {
        if (isMultiplayer && isHost && !gameState?.state?.words) {
            syncState({
                state: { words: category.items || [], current_index: 0, giver_index: 0 },
                scores: { current: 0 },
                phase: 'preview'
            });
        }
    }, [isMultiplayer, isHost, gameState?.state?.words]);

    const startGame = async () => {
        if (isMultiplayer) await syncState({ phase: 'playing' });
        else setLocalPhase('playing');
    };

    const handleNextWord = async (correct) => {
        const nextIndex = currentIndex + 1;
        const newScore = correct ? score + 1 : score;
        const isFinished = nextIndex >= words.length;

        if (isMultiplayer) {
            if (isFinished) await syncState({ scores: { current: newScore }, phase: 'result' });
            else await syncState({ state: { current_index: nextIndex }, scores: { current: newScore } });
        } else {
            if (correct) setLocalScore(prev => prev + 1);
            if (isFinished) {
                setLocalPhase('result');
                setTimeout(() => {
                    navigation.goBack();
                    if (routeParams.onComplete) routeParams.onComplete(newScore);
                }, 2000);
            } else {
                setLocalCurrentIndex(prev => prev + 1);
            }
        }
    };

    const handleTimeUp = async () => {
        if (isMultiplayer) {
            if (isHost) await syncState({ phase: 'result' });
        } else {
            setLocalPhase('result');
            setTimeout(() => {
                navigation.goBack();
                if (routeParams.onComplete) routeParams.onComplete(score);
            }, 2000);
        }
    };

    const handleExit = async () => {
        if (isMultiplayer) {
            await leaveRoom();
            navigation.replace('Home');
        } else {
            navigation.goBack();
        }
    };


    // Pan Responder (Same logic)
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => isGiver,
            onPanResponderMove: (_, gesture) => {
                if (isGiver) position.setValue({ x: gesture.dx, y: 0 });
            },
            onPanResponderRelease: (_, gesture) => {
                if (!isGiver) return;
                if (gesture.dx > SWIPE_THRESHOLD) swipeCard('right');
                else if (gesture.dx < -SWIPE_THRESHOLD) swipeCard('left');
                else Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
            },
        })
    ).current;

    const swipeCard = (direction) => {
        Animated.timing(position, {
            toValue: { x: direction === 'right' ? width + 100 : -width - 100, y: 0 },
            duration: 250, useNativeDriver: false,
        }).start(() => {
            handleNextWord(direction === 'right');
            position.setValue({ x: 0, y: 0 });
        });
    };

    const cardRotate = position.x.interpolate({
        inputRange: [-width / 2, 0, width / 2],
        outputRange: ['-10deg', '0deg', '10deg'],
        extrapolate: 'clamp',
    });

    // --- RENDER ---

    return (
        <GradientBackground>
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
                <View style={styles.webContainer}>

                    {/* --- PREVIEW PHASE --- */}
                    {phase === 'preview' && (
                        <MotiView
                            from={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={styles.centerContent}
                        >
                            <View style={styles.heroIconStub}>
                                <Text style={{ fontSize: 40 }}>🏆</Text>
                            </View>
                            <Text style={[styles.categoryTitle, isKurdish && styles.kurdishFont]}>
                                {category.title[language]}
                            </Text>
                            <Text style={[styles.instruction, isKurdish && styles.kurdishFont]}>
                                {isMultiplayer
                                    ? (isKurdish ? `نۆرەی ${giverName} ـە` : `${giverName}'s turn!`)
                                    : t('pyramid.describeItems', language)}
                            </Text>

                            {(!isMultiplayer || isHost) ? (
                                <TouchableOpacity onPress={startGame} activeOpacity={0.8}>
                                    <View style={styles.startBtn}>
                                        <Text style={[styles.startBtnText, isKurdish && styles.kurdishFont]}>
                                            {t('common.start', language)}
                                        </Text>
                                        <ChevronRight size={20} color="#000" />
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <View style={styles.pulseContainer}>
                                    <View style={styles.pulseDot} />
                                    <Text style={{ color: 'rgba(255,255,255,0.5)' }}>Waiting...</Text>
                                </View>
                            )}
                        </MotiView>
                    )}

                    {/* --- PLAYING PHASE --- */}
                    {phase === 'playing' && (
                        <View style={{ flex: 1, width: '100%' }}>
                            {/* Header */}
                            <BlurView intensity={30} tint="dark" style={styles.statsHeader}>
                                <View style={styles.statPill}>
                                    <Clock size={16} color={COLORS.games.pyramid[0]} />
                                    <View style={{ width: 40, height: 20 }}>
                                        <Timer duration={60} onComplete={handleTimeUp} isRunning={phase === 'playing'} size={20} showText={true} />
                                    </View>
                                </View>
                                <View style={[styles.statPill, { borderColor: COLORS.games.pyramid[0] }]}>
                                    <Trophy size={16} color={COLORS.games.pyramid[0]} />
                                    <Text style={styles.scoreText}>{score}</Text>
                                </View>
                            </BlurView>

                            <View style={styles.gameArea}>
                                {/* The Card Deck */}
                                <View style={styles.cardDeck}>
                                    {/* Back Card (Stack Effect) */}
                                    <View style={[styles.cardBase, styles.cardBack2]} />
                                    <View style={[styles.cardBase, styles.cardBack1]} />

                                    {/* Active Card */}
                                    <Animated.View
                                        style={[
                                            styles.cardBase,
                                            styles.cardActive,
                                            isGiver && { transform: [{ translateX: position.x }, { rotate: cardRotate }] }
                                        ]}
                                        {...(isGiver ? panResponder.panHandlers : {})}
                                    >
                                        {isGiver ? (
                                            <View style={styles.cardInner}>
                                                <Text style={[styles.wordLabel, isKurdish && styles.kurdishFont]}>DESCRIBE:</Text>
                                                <Text style={[styles.wordText, isKurdish && styles.kurdishFont]}>
                                                    {currentWord}
                                                </Text>
                                                <View style={styles.cardFooter}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', opacity: 0.5 }}>
                                                        <Text style={{ color: '#FFF', fontSize: 10 }}>SWIPE LEFT OR RIGHT</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        ) : (
                                            <View style={styles.cardInner}>
                                                <Text style={{ fontSize: 60 }}>🤔</Text>
                                                <Text style={[styles.hiddenText, isKurdish && styles.kurdishFont]}>
                                                    {isKurdish ? 'بیزانە!' : 'Guess it!'}
                                                </Text>
                                            </View>
                                        )}
                                    </Animated.View>
                                </View>
                            </View>

                            {/* Controls - Fixed to Bottom & Web Safe */}
                            {isGiver && (
                                <View style={styles.controlsBar}>
                                    <TouchableOpacity
                                        style={[styles.actionBtn, styles.btnPass]}
                                        onPress={() => swipeCard('left')}
                                        activeOpacity={0.8}
                                    >
                                        <X size={32} color="#FFF" />
                                        <Text style={[styles.actionLabel, isKurdish && styles.kurdishFont]}>{t('pyramid.pass', language)}</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.actionBtn, styles.btnCorrect]}
                                        onPress={() => swipeCard('right')}
                                        activeOpacity={0.8}
                                    >
                                        <Check size={32} color="#FFF" />
                                        <Text style={[styles.actionLabel, isKurdish && styles.kurdishFont]}>{t('pyramid.correct', language)}</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}

                    {/* --- RESULT PHASE --- */}
                    {phase === 'result' && (
                        <MotiView
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={styles.centerContent}
                        >
                            <Text style={[styles.resultTitle, isKurdish && styles.kurdishFont]}>
                                {t('pyramid.categoryComplete', language)}
                            </Text>
                            <Text style={styles.finalScore}>{score}</Text>
                            <TouchableOpacity style={styles.startBtn} onPress={handleExit}>
                                <Text style={[styles.startBtnText, isKurdish && styles.kurdishFont]}>
                                    {isKurdish ? 'تەواو' : 'Done'}
                                </Text>
                            </TouchableOpacity>
                        </MotiView>
                    )}
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    // Layout
    webContainer: {
        flex: 1,
        width: '100%',
        maxWidth: 600, // Enforce max width on web
        alignSelf: 'center',
        alignItems: 'center',
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: SPACING.xl,
    },

    // Preview
    heroIconStub: {
        width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg
    },
    categoryTitle: { color: COLORS.games.pyramid[0], fontSize: 24, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
    instruction: { color: 'rgba(255,255,255,0.7)', fontSize: 16, marginBottom: 40, textAlign: 'center' },

    startBtn: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: COLORS.games.pyramid[0],
        paddingHorizontal: 32, paddingVertical: 16, borderRadius: 30,
        gap: 8,
    },
    startBtnText: { color: '#000', fontSize: 18, fontWeight: 'bold' },

    // Header Stats
    statsHeader: {
        flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: 12,
        borderRadius: 20, marginHorizontal: SPACING.md, marginTop: SPACING.sm, overflow: 'hidden',
    },
    statPill: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingHorizontal: 12, paddingVertical: 6,
        backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    },
    scoreText: { color: '#FFF', fontSize: 18, fontWeight: '800' },

    // Game Area
    gameArea: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    cardDeck: {
        width: CARD_WIDTH,
        height: CARD_WIDTH * 1.3, // Aspect ratio roughly card like
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardBase: {
        position: 'absolute',
        width: '100%', height: '100%',
        borderRadius: 24,
        backfaceVisibility: 'hidden',
    },
    cardBack2: { transform: [{ scale: 0.9 }, { translateY: 25 }], backgroundColor: 'rgba(255,255,255,0.05)' },
    cardBack1: { transform: [{ scale: 0.95 }, { translateY: 15 }], backgroundColor: 'rgba(255,255,255,0.1)' },

    cardActive: {
        backgroundColor: 'rgba(30,30,35, 0.85)', // Dark glass
        borderWidth: 1, borderColor: COLORS.games.pyramid[0],
        shadowColor: COLORS.games.pyramid[0], shadowOpacity: 0.5, shadowRadius: 30,
        elevation: 10,
    },
    cardInner: {
        flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl,
    },
    wordLabel: { color: COLORS.games.pyramid[0], fontSize: 12, fontWeight: '700', letterSpacing: 2, marginBottom: 12 },
    wordText: { color: '#FFF', fontSize: 48, fontWeight: '800', textAlign: 'center' },
    hiddenText: { color: 'rgba(255,255,255,0.5)', fontSize: 24, marginTop: 12 },
    cardFooter: { position: 'absolute', bottom: 20 },

    // Controls
    controlsBar: {
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.xl, // Safe area
        justifyContent: 'space-between',
        gap: SPACING.md,
        marginTop: 'auto', // Push to bottom
    },
    actionBtn: {
        flex: 1,
        height: 80,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    btnPass: { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
    btnCorrect: { backgroundColor: 'rgba(34, 197, 94, 0.2)' },
    actionLabel: { color: '#FFF', fontSize: 14, fontWeight: '700', textTransform: 'uppercase', marginTop: 4 },

    // Result
    resultTitle: { color: '#FFF', fontSize: 24, marginBottom: 16 },
    finalScore: { color: COLORS.games.pyramid[0], fontSize: 80, fontWeight: '900', marginBottom: 40 },

    kurdishFont: { fontFamily: 'Rabar' },
});
