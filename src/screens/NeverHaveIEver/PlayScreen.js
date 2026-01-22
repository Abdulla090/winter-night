import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button, GradientBackground, GlassCard } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { getRandomStatement } from '../../constants/neverHaveIEverData';
import { useLanguage } from '../../context/LanguageContext';
import { useGameRoom } from '../../context/GameRoomContext';
import { useAuth } from '../../context/AuthContext';
import { t } from '../../localization/translations';

const { width } = Dimensions.get('window');

export default function NeverHaveIEverPlayScreen({ navigation, route }) {
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

    const intensity = routeParams.intensity || 'medium';

    // Local state for single-player
    const [localStatement, setLocalStatement] = useState('');
    const [localFingerCounts, setLocalFingerCounts] = useState({});
    const [localStatementsUsed, setLocalStatementsUsed] = useState(0);
    const [showScores, setShowScores] = useState(true);

    const slideAnim = useRef(new Animated.Value(0)).current;
    const rowDirection = isKurdish ? 'row-reverse' : 'row';
    const textAlign = isKurdish ? 'right' : 'left';

    // Initialize on mount
    useEffect(() => {
        if (!isMultiplayer) {
            // Single-player init
            setLocalStatement(getRandomStatement(intensity, language));
            setLocalFingerCounts(players.reduce((acc, p) => ({ ...acc, [p]: 5 }), {}));
            setLocalStatementsUsed(1);
        }
    }, []);

    // Multiplayer state
    const currentStatement = isMultiplayer
        ? (gameState?.current_question?.statement || '')
        : localStatement;
    const fingerCounts = isMultiplayer
        ? (gameState?.scores || {})
        : localFingerCounts;
    const statementsUsed = isMultiplayer
        ? (gameState?.round_number || 1)
        : localStatementsUsed;

    const myUsername = contextPlayers?.find(p => p.player_id === user?.id)?.player?.username;

    // Sync state to database
    const syncGameState = useCallback(async (updates) => {
        if (!isMultiplayer) return;

        await updateGameState({
            current_question: {
                ...gameState?.current_question,
                ...updates,
            },
            scores: updates.scores !== undefined ? updates.scores : (gameState?.scores || {}),
            round_number: updates.round_number !== undefined ? updates.round_number : statementsUsed,
        });
    }, [isMultiplayer, gameState, updateGameState, statementsUsed]);

    const getNextStatement = async () => {
        const newStatement = getRandomStatement(intensity, language);

        // Animate
        const slideOut = isKurdish ? width : -width;
        const slideIn = isKurdish ? -width : width;
        Animated.sequence([
            Animated.timing(slideAnim, { toValue: slideOut, duration: 200, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: slideIn, duration: 0, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start();

        if (isMultiplayer) {
            await syncGameState({
                statement: newStatement,
                round_number: statementsUsed + 1,
            });
        } else {
            setLocalStatement(newStatement);
            setLocalStatementsUsed(prev => prev + 1);
        }
    };

    const handleFingerDown = async (player) => {
        const newCounts = {
            ...fingerCounts,
            [player]: Math.max(0, (fingerCounts[player] || 5) - 1)
        };

        if (isMultiplayer) {
            await syncGameState({ scores: newCounts });
        } else {
            setLocalFingerCounts(newCounts);
        }
    };

    const handleFingerUp = async (player) => {
        const newCounts = {
            ...fingerCounts,
            [player]: Math.min(5, (fingerCounts[player] || 0) + 1)
        };

        if (isMultiplayer) {
            await syncGameState({ scores: newCounts });
        } else {
            setLocalFingerCounts(newCounts);
        }
    };

    const handleEndGame = async () => {
        if (isMultiplayer) {
            await leaveRoom();
            navigation.replace('Home');
        } else {
            navigation.replace('NeverHaveIEverResult', {
                players,
                fingerCounts,
                statementsUsed,
            });
        }
    };

    // Check who controls (in multiplayer, everyone can adjust their own fingers OR host can adjust all)
    const canAdjust = (player) => {
        if (!isMultiplayer) return true;
        return player === myUsername || isHost;
    };

    // Check if anyone is out
    const playersOut = players.filter(p => (fingerCounts[p] || 5) === 0);
    const gameOver = playersOut.length > 0;

    if (!currentStatement && isMultiplayer) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.accent.warning} />
                <Text style={styles.loadingText}>{isKurdish ? 'چاوەڕوان...' : 'Loading...'}</Text>
            </SafeAreaView>
        );
    }

    return (
        <GradientBackground>
            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                {/* Header */}
                <View style={[styles.header, { flexDirection: rowDirection }]}>
                    <TouchableOpacity style={styles.exitBtn} onPress={handleEndGame}>
                        <Ionicons name="close" size={24} color={COLORS.text.secondary} />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>
                            {isKurdish ? 'هەرگیز نەمکردووە' : 'Never Have I Ever'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.scoresBtn}
                        onPress={() => setShowScores(!showScores)}
                    >
                        <Ionicons name="people" size={20} color={COLORS.text.secondary} />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    {/* Statement Card */}
                    <Animated.View style={{ transform: [{ translateX: slideAnim }], width: '100%' }}>
                        <GlassCard intensity={30} style={styles.statementCard}>
                            <Text style={[styles.neverText, isKurdish && styles.kurdishFont, { textAlign }]}>
                                {isKurdish ? 'هەرگیز ئەوەم نەکردووە...' : 'Never have I ever...'}
                            </Text>
                            <Text style={[styles.statementText, isKurdish && styles.kurdishFont, { textAlign }]}>
                                {currentStatement.replace('Never have I ever ', '')}
                            </Text>
                        </GlassCard>
                    </Animated.View>

                    {/* Instructions */}
                    <Text style={[styles.instruction, isKurdish && styles.kurdishFont]}>
                        {isKurdish
                            ? 'ئەگەر ئەوەت کردبێت، پەنجەیەک دابەزێنە'
                            : 'Put a finger down if you\'ve done it'}
                    </Text>

                    {/* Finger Counters */}
                    {showScores && (
                        <View style={styles.fingersContainer}>
                            {players.map((player) => (
                                <View key={player} style={styles.fingerRow}>
                                    <Text style={[
                                        styles.fingerPlayerName,
                                        isKurdish && styles.kurdishFont,
                                        (fingerCounts[player] || 5) === 0 && styles.outPlayer
                                    ]}>
                                        {player} {player === myUsername && isMultiplayer ? (isKurdish ? '(تۆ)' : '(You)') : ''}
                                    </Text>
                                    <View style={[styles.fingerControls, { flexDirection: rowDirection }]}>
                                        <TouchableOpacity
                                            style={[styles.fingerBtn, !canAdjust(player) && styles.disabledBtn]}
                                            onPress={() => handleFingerDown(player)}
                                            disabled={!canAdjust(player)}
                                        >
                                            <Ionicons name="remove" size={20} color="#FFF" />
                                        </TouchableOpacity>
                                        <View style={[styles.fingerDisplay, { flexDirection: rowDirection }]}>
                                            {[...Array(5)].map((_, i) => (
                                                <Text key={i} style={styles.fingerEmoji}>
                                                    {i < (fingerCounts[player] || 5) ? '☝️' : '✊'}
                                                </Text>
                                            ))}
                                        </View>
                                        <TouchableOpacity
                                            style={[styles.fingerBtn, !canAdjust(player) && styles.disabledBtn]}
                                            onPress={() => handleFingerUp(player)}
                                            disabled={!canAdjust(player)}
                                        >
                                            <Ionicons name="add" size={20} color="#FFF" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Game Over Notice */}
                    {gameOver && (
                        <View style={[styles.gameOverBanner, { flexDirection: rowDirection }]}>
                            <Ionicons name="skull" size={24} color={COLORS.accent.danger} />
                            <Text style={[styles.gameOverText, isKurdish && styles.kurdishFont]}>
                                {playersOut.join(', ')} {playersOut.length > 1
                                    ? (isKurdish ? 'دەرچوون' : 'are out!')
                                    : (isKurdish ? 'دەرچوو' : 'is out!')}
                            </Text>
                        </View>
                    )}

                    {/* Next Button - In multiplayer only host can advance */}
                    {(!isMultiplayer || isHost) && (
                        <View style={styles.actionContainer}>
                            <Button
                                title={isKurdish ? 'دەربڕینی دواتر' : 'Next Statement'}
                                onPress={getNextStatement}
                                gradient={[COLORS.accent.warning, '#d97706']}
                                icon={<Ionicons name={isKurdish ? "arrow-back" : "arrow-forward"} size={20} color="#FFF" />}
                                isKurdish={isKurdish}
                            />
                        </View>
                    )}

                    {isMultiplayer && !isHost && (
                        <Text style={styles.waitingText}>
                            {isKurdish ? 'خاوەنی ژوور دەربڕینی دواتر دەگوازێتەوە' : 'Host controls the next statement'}
                        </Text>
                    )}

                    <Text style={[styles.statementCounter, isKurdish && styles.kurdishFont]}>
                        {statementsUsed} {isKurdish ? 'دەربڕین' : 'statements'}
                    </Text>
                </ScrollView>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1 }, // Keep for compatibility if needed elsewhere
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
    },
    exitBtn: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: COLORS.background.card,
        alignItems: 'center', justifyContent: 'center',
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        color: COLORS.text.primary,
        ...FONTS.bold,
        fontSize: 16,
    },
    scoresBtn: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: COLORS.background.card,
        alignItems: 'center', justifyContent: 'center',
    },
    content: {
        flexGrow: 1,
        padding: SPACING.lg,
        paddingBottom: 100,
        alignItems: 'center',
    },
    loadingText: {
        color: COLORS.text.secondary,
        ...FONTS.medium,
        marginTop: SPACING.md,
    },
    statementCard: {
        width: '100%',
        padding: SPACING.xl,
        borderWidth: 1,
        borderColor: 'rgba(245, 158, 11, 0.3)', // Warning color tint
        marginBottom: SPACING.lg,
        backgroundColor: 'rgba(245, 158, 11, 0.05)',
    },
    neverText: {
        color: COLORS.accent.warning,
        ...FONTS.medium,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: SPACING.sm,
    },
    statementText: {
        color: COLORS.text.primary,
        ...FONTS.large,
        fontSize: 24,
        lineHeight: 34,
    },
    instruction: {
        color: COLORS.text.muted,
        textAlign: 'center',
        marginBottom: SPACING.lg,
    },
    fingersContainer: {
        width: '100%',
        marginBottom: SPACING.lg,
    },
    fingerRow: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    fingerPlayerName: {
        color: COLORS.text.primary,
        ...FONTS.medium,
        marginBottom: 8,
        textAlign: 'center',
    },
    outPlayer: {
        color: COLORS.accent.danger,
        textDecorationLine: 'line-through',
    },
    fingerControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    fingerBtn: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: COLORS.background.secondary,
        alignItems: 'center', justifyContent: 'center',
    },
    disabledBtn: {
        opacity: 0.3,
    },
    fingerDisplay: {
        flexDirection: 'row',
        gap: 4,
    },
    fingerEmoji: { fontSize: 20 },
    gameOverBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.lg,
    },
    gameOverText: { color: COLORS.accent.danger, ...FONTS.medium },
    actionContainer: {
        width: '100%',
        marginTop: SPACING.md,
    },
    waitingText: {
        color: COLORS.text.muted,
        ...FONTS.medium,
        textAlign: 'center',
        marginTop: SPACING.md,
    },
    statementCounter: {
        color: COLORS.text.muted,
        fontSize: 12,
        marginTop: SPACING.md,
    },
    kurdishFont: { fontFamily: 'Rabar' },
});
