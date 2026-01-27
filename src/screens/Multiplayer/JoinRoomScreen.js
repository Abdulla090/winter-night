import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { LogIn, Plus, ArrowLeft, ArrowRight } from 'lucide-react-native';
import { MotiView } from 'moti';

import { AnimatedScreen, BeastButton, GlassCard, BackButton } from '../../components';
import { useGameRoom } from '../../context/GameRoomContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { layout } from '../../theme/layout';

export default function JoinRoomScreen({ navigation }) {
    const { joinRoom, loading, error, clearError } = useGameRoom();
    const { isAuthenticated, initialized } = useAuth();
    const { colors, isRTL } = useTheme();
    const { isKurdish, language } = useLanguage();

    const [roomCode, setRoomCode] = useState('');

    useEffect(() => {
        if (initialized && !isAuthenticated) {
            Alert.alert(
                isKurdish ? 'چوونەژوورەوە پێویستە' : 'Login Required',
                isKurdish ? 'تکایە سەرەتا بچۆ ژوورەوە' : 'Please login first to join a room',
                [
                    { text: isKurdish ? 'باشە' : 'OK', onPress: () => navigation.replace('Login') }
                ]
            );
        }
    }, [initialized, isAuthenticated]);

    const handleJoinRoom = async () => {
        if (!isAuthenticated) {
            navigation.replace('Login');
            return;
        }

        if (roomCode.length !== 6) {
            Alert.alert(
                isKurdish ? 'هەڵە' : 'Error',
                isKurdish ? 'کۆدی ژوور دەبێت ٦ پیت بێت' : 'Room code must be 6 characters'
            );
            return;
        }

        console.log('Joining room with code:', roomCode);
        const result = await joinRoom(roomCode);
        console.log('Join room result:', result);

        if (result?.success) {
            console.log('Joined room successfully, navigating to lobby');
            navigation.replace('RoomLobby');
        } else {
            const errorMsg = result?.error || error || 'Failed to join room';
            console.log('Join room failed:', errorMsg);
            Alert.alert(isKurdish ? 'هەڵە' : 'Error', errorMsg);
            clearError();
        }
    };

    const rowDirection = isRTL ? 'row-reverse' : 'row';

    return (
        <AnimatedScreen>
            {/* Header */}
            <View style={[styles.header, { flexDirection: rowDirection }]}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                    {isKurdish ? 'چوونە ژوورەوە' : 'Join Room'}
                </Text>
                <View style={{ width: 44 }} />
            </View>

            {/* Content */}
            <View style={styles.content}>
                <MotiView
                    from={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ alignItems: 'center', marginBottom: layout.spacing.xl }}
                >
                    <View style={[styles.heroIcon, { backgroundColor: colors.accent + '20' }]}>
                        <LogIn size={48} color={colors.accent} strokeWidth={1.5} />
                    </View>
                </MotiView>

                <Text style={[styles.title, { color: colors.text.primary }]}>
                    {isKurdish ? 'چوونە ژوورەوە' : 'Join Room'}
                </Text>
                <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                    {isKurdish ? 'کۆدی ژوورەکە لە هاوڕێکەت وەربگرە' : 'Enter the room code from your friend'}
                </Text>

                {/* Code Input */}
                <GlassCard style={styles.inputCard}>
                    <TextInput
                        style={[
                            styles.codeInput,
                            {
                                backgroundColor: colors.surfaceHighlight,
                                borderColor: colors.border,
                                color: colors.text.primary,
                            },
                        ]}
                        value={roomCode}
                        onChangeText={(text) => setRoomCode(text.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                        maxLength={6}
                        placeholder="XXXXXX"
                        placeholderTextColor={colors.text.muted}
                        autoCapitalize="characters"
                        autoCorrect={false}
                    />
                </GlassCard>

                <BeastButton
                    title={isKurdish ? 'چوونە ژوورەوە' : 'Join Room'}
                    onPress={handleJoinRoom}
                    variant="primary"
                    size="lg"
                    icon={LogIn}
                    style={{ width: '100%', opacity: roomCode.length !== 6 ? 0.5 : 1 }}
                />

                {/* Divider */}
                <View style={[styles.dividerContainer, { flexDirection: rowDirection }]}>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <Text style={[styles.dividerText, { color: colors.text.muted }]}>
                        {isKurdish ? 'یان' : 'OR'}
                    </Text>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                </View>

                {/* Create Room Button */}
                <TouchableOpacity
                    style={[styles.createBtn, { borderColor: colors.accent }]}
                    onPress={() => navigation.replace('CreateRoom')}
                >
                    <Plus size={20} color={colors.accent} />
                    <Text style={[styles.createBtnText, { color: colors.accent }]}>
                        {isKurdish ? 'ژوورێک دروستبکە' : 'Create a New Room'}
                    </Text>
                </TouchableOpacity>
            </View>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: layout.spacing.md,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100,
    },
    heroIcon: {
        width: 96,
        height: 96,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: layout.spacing.sm,
    },
    subtitle: {
        fontSize: 15,
        textAlign: 'center',
        marginBottom: layout.spacing.xl,
    },
    inputCard: {
        width: '100%',
        alignItems: 'center',
        marginBottom: layout.spacing.xl,
    },
    codeInput: {
        width: 200,
        height: 70,
        borderRadius: layout.radius.lg,
        borderWidth: 2,
        textAlign: 'center',
        fontSize: 32,
        fontWeight: '700',
        letterSpacing: 8,
    },
    dividerContainer: {
        alignItems: 'center',
        marginVertical: layout.spacing.xl,
        gap: layout.spacing.md,
        width: '100%',
    },
    divider: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        fontSize: 12,
        fontWeight: '600',
    },
    createBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderRadius: layout.radius.xl,
        borderWidth: 2,
        gap: layout.spacing.sm,
        width: '100%',
    },
    createBtnText: {
        fontSize: 16,
        fontWeight: '700',
    },
});
