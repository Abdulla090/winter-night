import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button, Modal, GradientBackground, GlassCard } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { getRandomLocation, getAllLocations } from '../../constants/spyfallData';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../localization/translations';

const { width } = Dimensions.get('window');

export default function SpyfallPlayScreen({ navigation, route }) {
    const { players, gameDuration, spyCount } = route.params;
    const { language, isKurdish } = useLanguage();

    // Game state
    const [phase, setPhase] = useState('reveal'); // 'reveal', 'playing', 'voting'
    const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
    const [showRole, setShowRole] = useState(false);
    const [gameData, setGameData] = useState(null);
    const [timeLeft, setTimeLeft] = useState(gameDuration * 60);
    const [showVoteModal, setShowVoteModal] = useState(false);
    const [showLocationsModal, setShowLocationsModal] = useState(false);
    const [votedPlayer, setVotedPlayer] = useState(null);

    const timerRef = useRef(null);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // RTL styles
    const rowDirection = isKurdish ? 'row-reverse' : 'row';
    const textAlign = isKurdish ? 'right' : 'left';

    // Initialize game on mount
    useEffect(() => {
        initializeGame();
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

        setGameData({
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
                    setPhase('voting');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleRevealComplete = () => {
        if (currentRevealIndex < players.length - 1) {
            setCurrentRevealIndex(currentRevealIndex + 1);
            setShowRole(false);
        } else {
            setPhase('playing');
            startTimer();
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleVote = (playerIndex) => {
        setVotedPlayer(playerIndex);
    };

    const confirmVote = () => {
        const isCaught = gameData.spyIndices.includes(votedPlayer);
        navigation.replace('SpyfallResult', {
            gameData,
            players,
            votedPlayer,
            spyCaught: isCaught,
        });
    };

    // ========================
    // REVEAL PHASE
    // ========================
    if (phase === 'reveal' && gameData) {
        const currentPlayer = gameData.playerRoles[currentRevealIndex];

        return (
            <GradientBackground>
                <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                    <ScrollView contentContainerStyle={styles.centerContent}>
                        <View style={styles.badge}>
                            <Text style={[styles.badgeText, isKurdish && styles.kurdishFont]}>
                                {isKurdish
                                    ? `یاریزان ${currentRevealIndex + 1} لە ${players.length}`
                                    : `Player ${currentRevealIndex + 1} of ${players.length}`
                                }
                            </Text>
                        </View>

                        <Text style={[styles.label, isKurdish && styles.kurdishFont]}>
                            {t('common.passPhoneTo', language)}
                        </Text>
                        <Text style={[styles.playerName, isKurdish && styles.kurdishFont]}>{currentPlayer.name}</Text>

                        {!showRole ? (
                            <>
                                <Text style={[styles.instruction, isKurdish && styles.kurdishFont]}>
                                    {isKurdish
                                        ? 'لێ بدە بۆ بینینی نۆرەی خۆت.\nبە نهێنی بیهێڵەرەوە!'
                                        : 'Tap to reveal your role.\nKeep it secret!'
                                    }
                                </Text>
                                <Button
                                    title={isKurdish ? 'نۆرەکەم ببینە' : "Reveal My Role"}
                                    onPress={() => setShowRole(true)}
                                    gradient={[COLORS.accent.success, COLORS.accent.success]}
                                    icon={<Ionicons name="eye-outline" size={20} color="#FFF" />}
                                    isKurdish={isKurdish}
                                />
                            </>
                        ) : (
                            <View style={styles.roleContainer}>
                                {currentPlayer.isSpy ? (
                                    <GlassCard intensity={30} style={styles.spyCard}>
                                        <Ionicons name="skull" size={48} color={COLORS.accent.danger} />
                                        <Text style={[styles.spyText, isKurdish && styles.kurdishFont]}>
                                            {t('common.youAreSpy', language)}
                                        </Text>
                                        <Text style={[styles.spyHint, isKurdish && styles.kurdishFont]}>
                                            {t('spyfall.figureOut', language)}
                                        </Text>
                                    </GlassCard>
                                ) : (
                                    <GlassCard intensity={30} style={styles.infoCard}>
                                        <View style={[styles.infoRow, isKurdish && { alignItems: 'flex-end' }]}>
                                            <Text style={[styles.infoLabel, isKurdish && styles.kurdishFont]}>
                                                {t('common.location', language)}:
                                            </Text>
                                            <Text style={[styles.infoValue, isKurdish && styles.kurdishFont]}>
                                                {gameData.location.name}
                                            </Text>
                                        </View>
                                        <View style={styles.divider} />
                                        <View style={[styles.infoRow, isKurdish && { alignItems: 'flex-end' }]}>
                                            <Text style={[styles.infoLabel, isKurdish && styles.kurdishFont]}>
                                                {isKurdish ? 'نۆرەی تۆ:' : 'Your Role:'}
                                            </Text>
                                            <Text style={[styles.infoValue, isKurdish && styles.kurdishFont]}>
                                                {currentPlayer.role}
                                            </Text>
                                        </View>
                                    </GlassCard>
                                )}
                                <Button
                                    title={t('common.ready', language)}
                                    onPress={handleRevealComplete}
                                    gradient={[COLORS.accent.primary, COLORS.accent.primary]}
                                    style={{ marginTop: SPACING.lg }}
                                    isKurdish={isKurdish}
                                />
                            </View>
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
                            <Ionicons name="list" size={20} color={COLORS.text.secondary} />
                            <Text style={[styles.locationBtnText, isKurdish && styles.kurdishFont]}>
                                {t('common.location', language)}
                            </Text>
                        </TouchableOpacity>

                        <Animated.View style={[styles.timerBadge, { transform: [{ scale: pulseAnim }], flexDirection: rowDirection }]}>
                            <Ionicons name="time-outline" size={20} color={timeLeft <= 30 ? COLORS.accent.danger : COLORS.text.primary} />
                            <Text style={[styles.timerText, timeLeft <= 30 && styles.timerDanger]}>
                                {formatTime(timeLeft)}
                            </Text>
                        </Animated.View>

                        <TouchableOpacity
                            style={[styles.voteBtn, { flexDirection: rowDirection }]}
                            onPress={() => setShowVoteModal(true)}
                        >
                            <Ionicons name="hand-left" size={20} color="#FFF" />
                            <Text style={[styles.voteBtnText, isKurdish && styles.kurdishFont]}>
                                {t('common.vote', language)}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.playContent}>
                        <Text style={[styles.gameTitle, isKurdish && styles.kurdishFont]}>
                            {t('spyfall.askQuestions', language)}
                        </Text>
                        <Text style={[styles.gameSubtitle, isKurdish && styles.kurdishFont]}>
                            {t('spyfall.askInstruction', language)}
                        </Text>

                        {/* Player List */}
                        <View style={[styles.playerGrid, { flexDirection: rowDirection }]}>
                            {players.map((player, index) => (
                                <View key={index} style={[styles.playerChip, { flexDirection: rowDirection }]}>
                                    <Ionicons name="person" size={16} color={COLORS.accent.primary} />
                                    <Text style={[styles.playerChipText, isKurdish && styles.kurdishFont]}>{player}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.tipsCard}>
                            <Text style={[styles.tipsTitle, isKurdish && styles.kurdishFont, { textAlign }]}>
                                {t('spyfall.tipsPlayers', language)}
                            </Text>
                            <Text style={[styles.tipsText, isKurdish && styles.kurdishFont, { textAlign }]}>
                                {isKurdish
                                    ? '• پرسیارێک بکە کە تەنها کەسێک لەو شوێنە بزانێت\n• بە شێوەیەکی ناڕۆشن پرسیار بکە تا جاسوسەکە تێ نەگات\n• سەرنجی وەڵامە شڵەژاوەکان بدە'
                                    : "• Ask questions that only someone at the location would know\n• Be vague enough that the spy can't guess\n• Watch for confused or suspicious answers"
                                }
                            </Text>
                        </View>

                        <View style={styles.tipsCard}>
                            <Text style={[styles.tipsTitle, isKurdish && styles.kurdishFont, { textAlign }]}>
                                {t('spyfall.tipsSpy', language)}
                            </Text>
                            <Text style={[styles.tipsText, isKurdish && styles.kurdishFont, { textAlign }]}>
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
                                    <Text style={[styles.voteItemText, isKurdish && styles.kurdishFont]}>{player}</Text>
                                    {votedPlayer === index && (
                                        <Ionicons name="checkmark-circle" size={24} color={COLORS.accent.success} />
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
                            {getAllLocations(language).map((loc) => (
                                <View key={loc.key} style={[styles.locationItem, { flexDirection: rowDirection }]}>
                                    <Ionicons name={loc.icon} size={20} color={COLORS.accent.primary} />
                                    <Text style={[styles.locationItemText, isKurdish && styles.kurdishFont]}>{loc.name}</Text>
                                </View>
                            ))}
                        </ScrollView>
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
                            <Ionicons name="alarm" size={48} color={COLORS.accent.danger} />
                            <Text style={[styles.timeUpText, isKurdish && styles.kurdishFont]}>
                                {t('quiz.timeUp', language)}
                            </Text>
                        </View>

                        <Text style={[styles.voteTitle, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'دەنگ بدە بۆ جاسوس!' : "Vote for the Spy!"}
                        </Text>
                        <Text style={[styles.voteSubtitle, isKurdish && styles.kurdishFont]}>
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
                                    <Ionicons
                                        name={votedPlayer === index ? "checkmark-circle" : "person-circle-outline"}
                                        size={32}
                                        color={votedPlayer === index ? COLORS.accent.success : COLORS.text.secondary}
                                    />
                                    <Text style={[
                                        styles.voteCardText,
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

    badge: { backgroundColor: COLORS.background.card, paddingVertical: 6, paddingHorizontal: 16, borderRadius: 100, marginBottom: 32 },
    badgeText: { color: COLORS.text.secondary, ...FONTS.medium, fontSize: 13 },

    label: { color: COLORS.text.secondary, ...FONTS.medium, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
    playerName: { color: COLORS.text.primary, ...FONTS.large, fontSize: 36, marginBottom: 32, textAlign: 'center' },
    instruction: { color: COLORS.text.muted, textAlign: 'center', marginBottom: 32, lineHeight: 24 },

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
    spyText: { color: COLORS.accent.danger, ...FONTS.large, marginTop: SPACING.md },
    spyHint: { color: COLORS.text.muted, textAlign: 'center', marginTop: SPACING.sm },

    infoCard: {
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        width: '100%',
        borderWidth: 1,
        borderColor: COLORS.accent.success,
    },
    infoRow: { marginVertical: SPACING.sm },
    infoLabel: { color: COLORS.text.muted, fontSize: 12, marginBottom: 4 },
    infoValue: { color: COLORS.text.primary, ...FONTS.title },
    divider: { height: 1, backgroundColor: COLORS.background.border, marginVertical: SPACING.sm },

    // Game Header
    gameHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: COLORS.background.secondary,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.background.border,
    },
    locationBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: COLORS.background.card,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    locationBtnText: { color: COLORS.text.secondary, ...FONTS.medium, fontSize: 13 },
    timerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: COLORS.background.card,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    timerText: { color: COLORS.text.primary, ...FONTS.bold, fontSize: 18 },
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
    gameTitle: { color: COLORS.text.primary, ...FONTS.large, textAlign: 'center', marginBottom: 8 },
    gameSubtitle: { color: COLORS.text.muted, textAlign: 'center', marginBottom: SPACING.lg },

    playerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: SPACING.lg },
    playerChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: COLORS.background.card,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    playerChipText: { color: COLORS.text.primary, ...FONTS.medium, fontSize: 14 },

    tipsCard: {
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        marginBottom: SPACING.md,
    },
    tipsTitle: { color: COLORS.text.primary, ...FONTS.medium, marginBottom: 8 },
    tipsText: { color: COLORS.text.muted, lineHeight: 22 },

    // Vote Modal
    voteList: { maxHeight: 300 },
    voteItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.background.secondary,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        marginBottom: 8,
    },
    voteItemSelected: { backgroundColor: 'rgba(16, 185, 129, 0.2)', borderColor: COLORS.accent.success, borderWidth: 1 },
    voteItemText: { color: COLORS.text.primary, ...FONTS.medium },

    // Locations Modal
    locationsList: { maxHeight: 350 },
    locationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.background.border,
    },
    locationItemText: { color: COLORS.text.primary, ...FONTS.medium },

    // Time's Up
    timeUpBadge: { alignItems: 'center', marginBottom: SPACING.lg },
    timeUpText: { color: COLORS.accent.danger, ...FONTS.large, marginTop: 8 },
    voteTitle: { color: COLORS.text.primary, ...FONTS.title, marginBottom: 8 },
    voteSubtitle: { color: COLORS.text.muted, marginBottom: SPACING.lg },

    voteGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
    voteCard: {
        width: (width - 80) / 2,
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    voteCardSelected: { borderColor: COLORS.accent.success, backgroundColor: 'rgba(16, 185, 129, 0.1)' },
    voteCardText: { color: COLORS.text.secondary, ...FONTS.medium, marginTop: 8 },
    voteCardTextSelected: { color: COLORS.accent.success },
    kurdishFont: { fontFamily: 'Rabar' },
});
