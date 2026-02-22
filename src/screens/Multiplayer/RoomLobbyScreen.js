import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    Share,
    Alert,
    ActivityIndicator,
    Modal,
    ScrollView,
    Platform,
} from 'react-native';
import { Share2, Copy, X, Star, CheckCircle2, Clock, Play, ChevronRight, Gamepad2 } from 'lucide-react-native';
import * as Icons from 'lucide-react-native';
import { GradientBackground } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { useGameRoom } from '../../context/GameRoomContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabase';

// Available games for multiplayer
const MULTIPLAYER_GAMES = [
    { id: 'truthordare', name: 'Truth or Dare', nameKu: 'ڕاستی یان بوێری', icon: 'Flame', color: '#ef4444', available: true },
    { id: 'neverhaveiever', name: 'Never Have I Ever', nameKu: 'هەرگیز نەمکردووە', icon: 'Hand', color: '#f59e0b', available: true },
    { id: 'wouldyourather', name: 'Would You Rather', nameKu: 'کامیان باشترە', icon: 'ArrowRightLeft', color: '#06b6d4', available: true },
    { id: 'quiz', name: 'Quiz Trivia', nameKu: 'پرسیار و وەڵام', icon: 'Trophy', color: '#10b981', available: true },
    { id: 'pyramid', name: 'Pyramid', nameKu: 'پیرامید', icon: 'Triangle', color: '#8b5cf6', available: true },
    { id: 'whoami', name: 'Who Am I', nameKu: 'من کێم', icon: 'HelpCircle', color: '#f97316', available: true },
    { id: 'imposter', name: 'Imposter', nameKu: 'ئیمپۆستەر', icon: 'EyeOff', color: '#ef4444', available: true },
    { id: 'spyfall', name: 'Spyfall', nameKu: 'سیخوڕ', icon: 'Search', color: '#3b82f6', available: true },
    { id: 'drawguess', name: 'Draw & Guess', nameKu: 'وێنەکێشان', icon: 'Paintbrush', color: '#ec4899', available: true },
    { id: 'forbiddenword', name: 'Forbidden Word', nameKu: 'وشەی قەدەغە', icon: 'AlertCircle', color: '#ef4444', available: false },
    { id: 'emojidecoder', name: 'Emoji Decoder', nameKu: 'دەربازی ئیمۆجی', icon: 'Smile', color: '#8b5cf6', available: false },
];

export default function RoomLobbyScreen({ navigation }) {
    const { currentRoom, players, gameState, onlinePlayers, isHost, leaveRoom, toggleReady, startGame, selectGame, loading } = useGameRoom();
    const { user } = useAuth();
    const { colors, isRTL } = useTheme();
    const { isKurdish } = useLanguage();
    const [showGamePicker, setShowGamePicker] = useState(false);
    const [roomData, setRoomData] = useState(currentRoom);

    // Sync roomData with context updates immediately
    useEffect(() => {
        if (currentRoom) {
            setRoomData(currentRoom);
        }
    }, [currentRoom]);

    // Subscribe to room changes (for game selection updates)
    useEffect(() => {
        if (!currentRoom) return;

        const roomChannel = supabase
            .channel(`room:${currentRoom.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'game_rooms',
                    filter: `id=eq.${currentRoom.id}`,
                },
                (payload) => {
                    setRoomData(payload.new);
                }
            )
            .subscribe();

        return () => {
            roomChannel.unsubscribe();
        };
    }, [currentRoom?.id]);

    // Redirect if no room
    useEffect(() => {
        if (!currentRoom) {
            navigation.replace('Home');
        }
    }, [currentRoom]);

    // Watch for game start
    useEffect(() => {
        if (gameState?.game_phase === 'playing') {
            const gameType = roomData?.game_type || currentRoom?.game_type; // Fallback to context
            const gameScreen = getGameScreen(gameType);

            console.log('Game Starting:', { gameType, gameScreen });

            if (gameScreen) {
                navigation.replace(gameScreen);
            } else {
                Alert.alert("Error", "Game screen not found for type: " + gameType);
            }
        }
    }, [gameState?.game_phase, roomData, currentRoom]);

    const getGameScreen = (gameType) => {
        const screens = {
            'truthordare': 'TruthOrDarePlay',
            'neverhaveiever': 'NeverHaveIEverPlay',
            'wouldyourather': 'WouldYouRatherPlay',
            'pyramid': 'PyramidPlay',
            'whoami': 'WhoAmIPlay',
            'imposter': 'ImposterPlay',
            'spyfall': 'SpyfallPlay',
            'quiz': 'QuizPlay',
            'drawguess': 'DrawGuessPlay',
            // New Games (Mapped for future implementation)
            'forbiddenword': 'ForbiddenWordPlay',
            'lyricschallenge': 'LyricsChallengePlay',
            'wordchain': 'WordChainPlay',
            'reversecharades': 'ReverseCharadesPlay',
            'partnersincrime': 'PartnersInCrimePlay',
        };
        return screens[gameType];
    };

    const getGameInfo = (gameType) => {
        return MULTIPLAYER_GAMES.find(g => g.id === gameType) || null;
    };

    const handleShareCode = async () => {
        const shareMessage = isKurdish
            ? `وەرە یاری بکەین! کۆدی ژوور: ${currentRoom?.room_code}`
            : `Join my game room! Code: ${currentRoom?.room_code}`;

        try {
            // Check if native sharing is available
            if (Platform.OS !== 'web') {
                await Share.share({ message: shareMessage });
            } else {
                // On web, try clipboard API or show alert with code
                if (navigator.clipboard) {
                    await navigator.clipboard.writeText(currentRoom?.room_code || '');
                    Alert.alert(
                        isKurdish ? 'کۆپی کرا!' : 'Copied!',
                        isKurdish ? `کۆدی ژوور: ${currentRoom?.room_code}` : `Room code: ${currentRoom?.room_code} copied to clipboard`
                    );
                } else {
                    Alert.alert(
                        isKurdish ? 'کۆدی ژوور' : 'Room Code',
                        currentRoom?.room_code
                    );
                }
            }
        } catch (error) {
            // Fallback: just show the code
            Alert.alert(
                isKurdish ? 'کۆدی ژوور' : 'Room Code',
                currentRoom?.room_code
            );
        }
    };

    const handleLeaveRoom = () => {
        Alert.alert(
            isKurdish ? 'دەرچوون لە ژوور' : 'Leave Room',
            isKurdish
                ? 'دڵنیایت دەتەوێت لە ژوورەکە دەربچیت؟'
                : 'Are you sure you want to leave this room?',
            [
                { text: isKurdish ? 'نەخێر' : 'Cancel', style: 'cancel' },
                {
                    text: isKurdish ? 'بەڵێ' : 'Leave',
                    style: 'destructive',
                    onPress: async () => {
                        await leaveRoom();
                        navigation.replace('Home');
                    },
                },
            ]
        );
    };

    const handleSelectGame = async (game) => {
        if (!game.available) {
            Alert.alert(
                isKurdish ? 'بەردەست نییە' : 'Not Available',
                isKurdish ? 'ئەم یاریە هێشتا بەردەست نییە بۆ ئۆنلاین' : 'This game is not available for online play yet'
            );
            return;
        }

        const success = await selectGame(game.id);
        if (success) {
            setShowGamePicker(false);
        }
    };

    const handleStartGame = async () => {
        if (!roomData?.game_type) {
            Alert.alert(
                isKurdish ? 'هەڵە' : 'Cannot Start',
                isKurdish ? 'تکایە یاریەک هەڵبژێرە' : 'Please select a game first'
            );
            return;
        }

        const allReady = players.every(p => p.is_ready);
        if (!allReady) {
            Alert.alert(
                isKurdish ? 'هەڵە' : 'Cannot Start',
                isKurdish ? 'هەموو یاریزانەکان دەبێت ئامادە بن' : 'All players must be ready'
            );
            return;
        }

        if (players.length < 2) {
            Alert.alert(
                isKurdish ? 'هەڵە' : 'Cannot Start',
                isKurdish ? 'لانیکەم ٢ یاریزان پێویستە' : 'At least 2 players needed'
            );
            return;
        }

        await startGame();
    };

    const currentPlayer = players.find(p => p.player_id === user?.id);
    const allReady = players.every(p => p.is_ready);
    const selectedGame = getGameInfo(roomData?.game_type);

    const renderPlayer = ({ item }) => {
        const isOnline = onlinePlayers[item.player_id];
        const isMe = item.player_id === user?.id;
        const isRoomHost = item.player_id === currentRoom?.host_id;

        return (
            <View style={[styles.playerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.playerInfo}>
                    <View style={[styles.avatar, { backgroundColor: colors.accent + '20' }]}>
                        <Text style={[styles.avatarText, { color: colors.accent }]}>
                            {item.player?.username?.[0]?.toUpperCase() || '?'}
                        </Text>
                        <View style={[styles.onlineIndicator, { backgroundColor: isOnline ? '#22c55e' : '#6b7280' }]} />
                    </View>

                    <View style={styles.playerDetails}>
                        <View style={styles.nameRow}>
                            <Text style={[styles.playerName, { color: colors.text.primary }]}>
                                {item.player?.username || 'Unknown'}
                            </Text>
                            {isMe && (
                                <Text style={[styles.youBadge, { color: colors.accent }]}>
                                    ({isKurdish ? 'تۆ' : 'You'})
                                </Text>
                            )}
                        </View>
                        {isRoomHost && (
                            <View style={styles.hostBadge}>
                                <Star size={12} color="#f59e0b" fill="#f59e0b" />
                                <Text style={styles.hostText}>
                                    {isKurdish ? 'خاوەنی ژوور' : 'Host'}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={[styles.readyBadge, { backgroundColor: item.is_ready ? '#22c55e20' : '#6b728020' }]}>
                    {item.is_ready ? (
                        <CheckCircle2 size={18} color="#22c55e" />
                    ) : (
                        <Clock size={18} color="#6b7280" />
                    )}
                    <Text style={[styles.readyText, { color: item.is_ready ? '#22c55e' : '#6b7280' }]}>
                        {item.is_ready ? (isKurdish ? 'ئامادە' : 'Ready') : (isKurdish ? 'چاوەڕوان' : 'Waiting')}
                    </Text>
                </View>
            </View>
        );
    };

    if (!currentRoom) {
        return (
            <GradientBackground>
                <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color={colors.accent} />
                </SafeAreaView>
            </GradientBackground>
        );
    }

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={[styles.backBtn, { backgroundColor: colors.surface }]}
                        onPress={handleLeaveRoom}
                    >
                        <X size={24} color={colors.text.primary} />
                    </TouchableOpacity>

                    <View style={styles.headerCenter}>
                        <Text style={[styles.roomName, { color: colors.text.primary }]} numberOfLines={1}>
                            {currentRoom.room_name}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.shareBtn, { backgroundColor: colors.surface }]}
                        onPress={handleShareCode}
                    >
                        <Share2 size={20} color={colors.text.primary} />
                    </TouchableOpacity>
                </View>

                {/* Room Code Card */}
                <View style={[styles.codeCard, { backgroundColor: colors.accent + '15', borderColor: colors.accent + '30' }]}>
                    <Text style={[styles.codeLabel, { color: colors.accent }]}>
                        {isKurdish ? 'کۆدی ژوور' : 'ROOM CODE'}
                    </Text>
                    <Text style={[styles.codeValue, { color: colors.accent }]}>
                        {currentRoom.room_code}
                    </Text>
                    <TouchableOpacity style={styles.copyBtn} onPress={handleShareCode}>
                        <Copy size={18} color={colors.accent} />
                        <Text style={[styles.copyText, { color: colors.accent }]}>
                            {isKurdish ? 'هاوبەشی بکە' : 'Share'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Game Selection (Host Only) */}
                {isHost ? (
                    <TouchableOpacity
                        style={[styles.gameSelector, { backgroundColor: colors.surface, borderColor: selectedGame ? selectedGame.color : colors.border }]}
                        onPress={() => setShowGamePicker(true)}
                    >
                        {selectedGame ? (
                            <View style={styles.selectedGame}>
                                <View style={[styles.gameIconSmall, { backgroundColor: selectedGame.color + '20' }]}>
                                    {(() => {
                                        const IconComp = Icons[selectedGame.icon] || Icons.HelpCircle;
                                        return <IconComp size={24} color={selectedGame.color} />;
                                    })()}
                                </View>
                                <View style={styles.gameInfo}>
                                    <Text style={[styles.gameName, { color: colors.text.primary }]}>
                                        {isKurdish ? selectedGame.nameKu : selectedGame.name}
                                    </Text>
                                    <Text style={[styles.gameHint, { color: colors.text.secondary }]}>
                                        {isKurdish ? 'کلیک بکە بۆ گۆڕین' : 'Tap to change'}
                                    </Text>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.noGame}>
                                <Gamepad2 size={28} color={colors.text.secondary} />
                                <Text style={[styles.selectGameText, { color: colors.text.secondary }]}>
                                    {isKurdish ? 'یاری هەڵبژێرە' : 'Select a Game'}
                                </Text>
                                <ChevronRight size={20} color={colors.text.muted} />
                            </View>
                        )}
                    </TouchableOpacity>
                ) : (
                    <View style={[styles.gameDisplay, { backgroundColor: colors.surface }]}>
                        {selectedGame ? (
                            <View style={styles.selectedGame}>
                                <View style={[styles.gameIconSmall, { backgroundColor: selectedGame.color + '20' }]}>
                                    {(() => {
                                        const IconComp = Icons[selectedGame.icon] || Icons.HelpCircle;
                                        return <IconComp size={24} color={selectedGame.color} />;
                                    })()}
                                </View>
                                <Text style={[styles.gameName, { color: colors.text.primary }]}>
                                    {isKurdish ? selectedGame.nameKu : selectedGame.name}
                                </Text>
                            </View>
                        ) : (
                            <Text style={[styles.waitingGame, { color: colors.text.secondary }]}>
                                {isKurdish ? 'چاوەڕوانی هەڵبژاردنی یاری...' : 'Waiting for host to select game...'}
                            </Text>
                        )}
                    </View>
                )}

                {/* Players Count */}
                <View style={styles.playersHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                        {isKurdish ? 'یاریزانەکان' : 'PLAYERS'}
                    </Text>
                    <Text style={[styles.playerCount, { color: colors.text.secondary }]}>
                        {players.length}/{currentRoom.max_players}
                    </Text>
                </View>

                {/* Players List */}
                <FlatList
                    data={players}
                    renderItem={renderPlayer}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.playersList}
                    showsVerticalScrollIndicator={false}
                />

                {/* Bottom Actions */}
                <View style={styles.bottomActions}>
                    {!isHost ? (
                        <TouchableOpacity
                            style={[
                                styles.readyBtn,
                                { backgroundColor: currentPlayer?.is_ready ? '#6b7280' : colors.accent },
                            ]}
                            onPress={toggleReady}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <>
                                    {currentPlayer?.is_ready ? (
                                        <X size={24} color="#FFF" />
                                    ) : (
                                        <CheckCircle2 size={24} color="#FFF" />
                                    )}
                                    <Text style={styles.readyBtnText}>
                                        {currentPlayer?.is_ready
                                            ? (isKurdish ? 'ئامادە نیم' : 'Not Ready')
                                            : (isKurdish ? 'ئامادەم' : "I'm Ready")}
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[
                                styles.startBtn,
                                { backgroundColor: allReady && players.length >= 2 && selectedGame ? '#22c55e' : '#6b7280' },
                            ]}
                            onPress={handleStartGame}
                            disabled={loading || !allReady || players.length < 2 || !selectedGame}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <>
                                    <Play size={24} color="#FFF" fill="#FFF" />
                                    <Text style={styles.startBtnText}>
                                        {isKurdish ? 'دەستپێکردنی یاری' : 'Start Game'}
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
                    )}
                </View>

                {/* Game Picker Modal */}
                <Modal
                    visible={showGamePicker}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowGamePicker(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                            <View style={styles.modalHeader}>
                                <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                                    {isKurdish ? 'یاری هەڵبژێرە' : 'Select Game'}
                                </Text>
                                <TouchableOpacity onPress={() => setShowGamePicker(false)}>
                                    <X size={24} color={colors.text.secondary} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView style={styles.gamesList}>
                                {MULTIPLAYER_GAMES.map((game) => (
                                    <TouchableOpacity
                                        key={game.id}
                                        style={[
                                            styles.gameOption,
                                            { backgroundColor: colors.surface, borderColor: colors.border },
                                            roomData?.game_type === game.id && { borderColor: game.color, borderWidth: 2 },
                                            !game.available && styles.gameDisabled,
                                        ]}
                                        onPress={() => handleSelectGame(game)}
                                    >
                                        <View style={[styles.gameIconLarge, { backgroundColor: game.color + '20' }]}>
                                            {(() => {
                                                const IconComp = Icons[game.icon] || Icons.HelpCircle;
                                                return <IconComp size={32} color={game.available ? game.color : '#666'} />;
                                            })()}
                                        </View>
                                        <View style={styles.gameDetails}>
                                            <Text style={[styles.gameTitle, { color: game.available ? colors.text.primary : '#666' }]}>
                                                {isKurdish ? game.nameKu : game.name}
                                            </Text>
                                            {!game.available && (
                                                <Text style={styles.comingSoonText}>
                                                    {isKurdish ? 'بەم زووانە' : 'Coming Soon'}
                                                </Text>
                                            )}
                                        </View>
                                        {roomData?.game_type === game.id && (
                                            <CheckCircle2 size={24} color={game.color} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: SPACING.lg },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.md,
        gap: SPACING.md,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenter: { flex: 1 },
    roomName: {
        ...FONTS.bold,
        fontSize: 18,
    },
    shareBtn: {
        width: 44,
        height: 44,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    codeCard: {
        marginTop: SPACING.lg,
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.xl,
        borderWidth: 1,
        alignItems: 'center',
    },
    codeLabel: {
        ...FONTS.bold,
        fontSize: 11,
        letterSpacing: 2,
    },
    codeValue: {
        ...FONTS.bold,
        fontSize: 36,
        letterSpacing: 8,
        marginVertical: SPACING.sm,
    },
    copyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },
    copyText: {
        ...FONTS.medium,
        fontSize: 13,
    },
    gameSelector: {
        marginTop: SPACING.md,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
    },
    gameDisplay: {
        marginTop: SPACING.md,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        alignItems: 'center',
    },
    selectedGame: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    gameIconSmall: {
        width: 48,
        height: 48,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gameInfo: { flex: 1 },
    gameName: {
        ...FONTS.bold,
        fontSize: 16,
    },
    gameHint: {
        ...FONTS.regular,
        fontSize: 12,
        marginTop: 2,
    },
    noGame: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        paddingVertical: SPACING.sm,
    },
    selectGameText: {
        ...FONTS.medium,
        fontSize: 15,
        flex: 1,
    },
    waitingGame: {
        ...FONTS.medium,
        fontSize: 14,
        paddingVertical: SPACING.sm,
    },
    playersHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: SPACING.lg,
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        ...FONTS.bold,
        fontSize: 12,
        letterSpacing: 1,
    },
    playerCount: {
        ...FONTS.medium,
        fontSize: 13,
    },
    playersList: {
        gap: SPACING.sm,
        paddingBottom: SPACING.lg,
    },
    playerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
    },
    playerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.sm,
    },
    avatarText: {
        ...FONTS.bold,
        fontSize: 18,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#1a1a2e',
    },
    playerDetails: { flex: 1 },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    playerName: {
        ...FONTS.semibold,
        fontSize: 15,
    },
    youBadge: {
        ...FONTS.medium,
        fontSize: 12,
    },
    hostBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    hostText: {
        ...FONTS.medium,
        fontSize: 11,
        color: '#f59e0b',
    },
    readyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.md,
    },
    readyText: {
        ...FONTS.medium,
        fontSize: 12,
    },
    bottomActions: {
        paddingVertical: SPACING.lg,
    },
    readyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderRadius: BORDER_RADIUS.lg,
        gap: SPACING.sm,
    },
    readyBtnText: {
        ...FONTS.bold,
        fontSize: 16,
        color: '#FFF',
    },
    startBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderRadius: BORDER_RADIUS.lg,
        gap: SPACING.sm,
    },
    startBtnText: {
        ...FONTS.bold,
        fontSize: 16,
        color: '#FFF',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: BORDER_RADIUS.xl,
        borderTopRightRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    modalTitle: {
        ...FONTS.bold,
        fontSize: 20,
    },
    gamesList: {
        marginBottom: SPACING.lg,
    },
    gameOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        marginBottom: SPACING.sm,
        gap: SPACING.md,
    },
    gameDisabled: {
        opacity: 0.5,
    },
    gameIconLarge: {
        width: 56,
        height: 56,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gameDetails: {
        flex: 1,
    },
    gameTitle: {
        ...FONTS.bold,
        fontSize: 16,
    },
    comingSoonText: {
        ...FONTS.medium,
        fontSize: 12,
        color: '#3b82f6',
        marginTop: 2,
    },
});
