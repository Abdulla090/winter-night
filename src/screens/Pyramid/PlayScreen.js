import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, PanResponder, Animated, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { Check, X, Clock, Trophy, ChevronRight } from 'lucide-react-native';

import { AnimatedScreen, Timer, BeastButton, GlassCard } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { useGameRoom } from '../../context/GameRoomContext';
import { useAuth } from '../../context/AuthContext';
import { t } from '../../localization/translations';
import { useTheme } from '../../context/ThemeContext';
import { layout } from '../../theme/layout';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;
const CARD_WIDTH = Math.min(width - 48, 400);

export default function PyramidPlayScreen({ navigation, route }) {
    const { players: contextPlayers, currentRoom, gameState, updateGameState, leaveRoom, isHost } = useGameRoom();
    const { user } = useAuth();
    const { language, isKurdish } = useLanguage();
    const { colors, isRTL } = useTheme();

    const routeParams = route?.params || {};
    const isMultiplayer = !!currentRoom && !routeParams.teamName;
    const categoryId = routeParams.category?.id || 'standard';
    const category = routeParams.category || {};

    const [localWords, setLocalWords] = useState([]);
    const [localCurrentIndex, setLocalCurrentIndex] = useState(0);
    const [localScore, setLocalScore] = useState(0);
    const [localPhase, setLocalPhase] = useState('preview');

    const position = useRef(new Animated.ValueXY()).current;

    // Ensure colors are array
    const gameColors = Array.isArray(COLORS.games.pyramid) ? COLORS.games.pyramid : [COLORS.games.pyramid, COLORS.games.pyramid];
    const accentColor = gameColors[0];

    useEffect(() => {
        if (!isMultiplayer && category.items) {
            setLocalWords(category.items || []);
        }
    }, [isMultiplayer, category]);

    const words = isMultiplayer ? (gameState?.state?.words || []) : localWords;
    const currentIndex = isMultiplayer ? (gameState?.state?.current_index || 0) : localCurrentIndex;
    const score = isMultiplayer ? (gameState?.scores?.current || 0) : localScore;
    const phase = isMultiplayer ? (gameState?.game_phase === 'playing' ? 'playing' : (gameState?.game_phase === 'result' ? 'result' : 'preview')) : localPhase;

    const giverIndex = isMultiplayer ? (gameState?.state?.giver_index || 0) : 0;
    const isGiver = isMultiplayer ? (contextPlayers?.[giverIndex]?.player_id === user?.id) : true;
    const giverName = isMultiplayer ? (contextPlayers?.[giverIndex]?.player?.username || 'Giver') : 'Giver';
    const currentWord = words[currentIndex] ? words[currentIndex][language] : null;

    const syncState = useCallback(async (updates) => {
        if (!isMultiplayer) return;
        await updateGameState({
            state: { ...gameState?.state, ...updates.state },
            scores: { ...gameState?.scores, ...updates.scores },
            game_phase: updates.phase || gameState?.game_phase
        });
    }, [isMultiplayer, gameState, updateGameState]);

    const startGame = async () => {
        if (isMultiplayer) await syncState({ phase: 'playing' });
        else setLocalPhase('playing');
    };

    const handleNextWord = async (correct) => {
        if (correct && !isMultiplayer) setLocalScore(prev => prev + 1);

        const nextIndex = currentIndex + 1;
        const newScore = correct ? score + 1 : score;
        const isFinished = nextIndex >= words.length;

        if (isMultiplayer) {
            if (isFinished) await syncState({ scores: { current: newScore }, phase: 'result' });
            else await syncState({ state: { current_index: nextIndex }, scores: { current: newScore } });
        } else {
            if (isFinished) {
                setLocalPhase('result');
                setTimeout(() => {
                    navigation.goBack();
                    if (routeParams.onComplete) routeParams.onComplete(newScore);
                }, 1500);
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
            }, 1000);
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

    return (
        <AnimatedScreen>
            <View style={{ flex: 1, alignItems: 'center' }}>

                {/* PREVIEW PHASE */}
                {phase === 'preview' && (
                    <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={styles.centerContent}
                    >
                        <View style={[styles.heroIconStub, { backgroundColor: colors.brand.gold + '20' }]}>
                            <Trophy size={40} color={colors.brand.gold} />
                        </View>
                        <Text style={[styles.categoryTitle, { color: colors.text.primary }]}>
                            {category.title?.[language] || "Current Category"}
                        </Text>
                        <Text style={[styles.instruction, { color: colors.text.secondary }]}>
                            {isMultiplayer
                                ? (isKurdish ? `نۆرەی ${giverName} ـە` : `${giverName}'s turn!`)
                                : t('pyramid.describeItems', language)}
                        </Text>

                        {(!isMultiplayer || isHost) ? (
                            <BeastButton
                                title={t('common.start', language)}
                                onPress={startGame}
                                icon={ChevronRight}
                                size="lg"
                            />
                        ) : (
                            <Text style={{ color: colors.text.muted }}>Waiting for host...</Text>
                        )}
                    </MotiView>
                )}

                {/* PLAYING PHASE */}
                {phase === 'playing' && (
                    <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
                        {/* Stats Header */}
                        <GlassCard style={styles.statsHeader}>
                            <View style={styles.statItem}>
                                <Clock size={16} color={accentColor} />
                                <View style={{ width: 30 }}>
                                    <Timer duration={60} onComplete={handleTimeUp} isRunning={phase === 'playing'} size={16} showText={true} />
                                </View>
                            </View>
                            <View style={styles.statItem}>
                                <Trophy size={16} color={accentColor} />
                                <Text style={[styles.scoreText, { color: colors.text.primary }]}>{score}</Text>
                            </View>
                        </GlassCard>

                        {/* Deck */}
                        <View style={styles.gameArea}>
                            <View style={[styles.cardDeck, { width: CARD_WIDTH, height: CARD_WIDTH * 1.3 }]}>
                                {/* Back Cards */}
                                <View style={[styles.cardBase, styles.cardBack2, { backgroundColor: colors.surfaceHighlight }]} />
                                <View style={[styles.cardBase, styles.cardBack1, { backgroundColor: colors.surface }]} />

                                {/* Active Card */}
                                <Animated.View
                                    style={[
                                        styles.cardBase,
                                        styles.cardActive,
                                        {
                                            backgroundColor: colors.surface,
                                            borderColor: accentColor,
                                            borderWidth: 2,
                                            ...layout.shadows.md
                                        },
                                        isGiver && { transform: [{ translateX: position.x }, { rotate: cardRotate }] }
                                    ]}
                                    {...(isGiver ? panResponder.panHandlers : {})}
                                >
                                    {isGiver ? (
                                        <View style={styles.cardInner}>
                                            <Text style={[styles.wordLabel, { color: accentColor }]}>DESCRIBE:</Text>
                                            <Text style={[styles.wordText, { color: colors.text.primary }]}>{currentWord}</Text>
                                            <Text style={[styles.footerText, { color: colors.text.muted }]}>SWIPE LEFT OR RIGHT</Text>
                                        </View>
                                    ) : (
                                        <View style={styles.cardInner}>
                                            <Text style={{ fontSize: 60 }}>🤔</Text>
                                            <Text style={[styles.guessText, { color: colors.text.primary }]}>Guess it!</Text>
                                        </View>
                                    )}
                                </Animated.View>
                            </View>
                        </View>

                        {/* Controls */}
                        {isGiver && (
                            <View style={styles.controls}>
                                <TouchableOpacity
                                    style={[styles.ctrlBtn, { backgroundColor: colors.brand.crimson + '20', borderColor: colors.brand.crimson }]}
                                    onPress={() => swipeCard('left')}
                                >
                                    <X size={32} color={colors.brand.crimson} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.ctrlBtn, { backgroundColor: colors.brand.mountain + '20', borderColor: colors.brand.mountain }]}
                                    onPress={() => swipeCard('right')}
                                >
                                    <Check size={32} color={colors.brand.mountain} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}

                {/* RESULT PHASE */}
                {phase === 'result' && (
                    <MotiView style={styles.centerContent} from={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Text style={[styles.categoryTitle, { color: colors.text.primary }]}>
                            {t('pyramid.categoryComplete', language)}
                        </Text>
                        <Text style={[styles.finalScore, { color: accentColor }]}>{score}</Text>
                        <BeastButton
                            title={isKurdish ? 'تەواو' : 'Done'}
                            onPress={handleExit}
                        />
                    </MotiView>
                )}
            </View>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: layout.spacing.xl,
    },
    heroIconStub: {
        width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 24,
    },
    categoryTitle: {
        fontSize: 24, fontWeight: '800', marginBottom: 16, textAlign: 'center',
    },
    instruction: {
        fontSize: 16, textAlign: 'center', marginBottom: 40,
    },
    statsHeader: {
        flexDirection: 'row', justifyContent: 'space-between', width: '90%', marginTop: 10,
        paddingHorizontal: 20, paddingVertical: 10,
    },
    statItem: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
    },
    scoreText: {
        fontSize: 18, fontWeight: '800',
    },
    gameArea: {
        flex: 1, justifyContent: 'center', alignItems: 'center',
    },
    cardDeck: {
        alignItems: 'center', justifyContent: 'center',
    },
    cardBase: {
        position: 'absolute', width: '100%', height: '100%', borderRadius: 24,
    },
    cardBack2: { transform: [{ scale: 0.9 }, { translateY: 25 }], opacity: 0.5 },
    cardBack1: { transform: [{ scale: 0.95 }, { translateY: 15 }], opacity: 0.8 },
    cardActive: {
        alignItems: 'center', justifyContent: 'center',
    },
    cardInner: {
        alignItems: 'center', gap: 20,
    },
    wordLabel: {
        fontSize: 12, fontWeight: '700', letterSpacing: 2,
    },
    wordText: {
        fontSize: 40, fontWeight: '800', textAlign: 'center',
    },
    footerText: {
        fontSize: 10, marginTop: 40, opacity: 0.6,
    },
    guessText: {
        fontSize: 24, fontWeight: '700', marginTop: 20,
    },
    controls: {
        flexDirection: 'row', width: '100%', justifyContent: 'space-around', paddingBottom: 40,
    },
    ctrlBtn: {
        width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 2,
    },
    finalScore: {
        fontSize: 80, fontWeight: '900', marginBottom: 40,
    },
});
