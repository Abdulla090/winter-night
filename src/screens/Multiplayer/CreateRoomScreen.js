import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Gamepad2, Plus, Home, LogIn } from 'lucide-react-native';

import { AnimatedScreen, BeastButton, GlassCard, BackButton } from '../../components';
import { useGameRoom } from '../../context/GameRoomContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { layout } from '../../theme/layout';

export default function CreateRoomScreen({ navigation }) {
    const { createRoom, currentRoom, loading, error, clearError } = useGameRoom();
    const { user, initialized } = useAuth();
    const { colors, isRTL, isDark } = useTheme();
    const { isKurdish } = useLanguage();

    const [roomName, setRoomName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const { joinRoom } = useGameRoom();

    // If not authenticated, navigate to Login immediately when screen mounts
    useEffect(() => {
        if (initialized && !user) {
            navigation.replace('Login');
        }
    }, [initialized, user]);

    // Watch for room creation success via context state
    useEffect(() => {
        if (currentRoom) {
            console.log('currentRoom detected, navigating to RoomLobby:', currentRoom.id);
            navigation.replace('RoomLobby');
        }
    }, [currentRoom]);

    const handleCreateRoom = async () => {
        if (!user) {
            navigation.replace('Login');
            return;
        }

        if (!roomName.trim()) {
            Alert.alert(
                isKurdish ? 'هەڵە' : 'Error',
                isKurdish ? 'تکایە ناوی ژوورەکە بنووسە' : 'Please enter a room name'
            );
            return;
        }

        console.log('Creating room with name:', roomName);
        try {
            const result = await createRoom(null, roomName);
            console.log('Create room result:', result);

            if (result?.success) {
                console.log('Room created successfully, navigating to lobby');
                navigation.replace('RoomLobby');
            } else {
                const errorMsg = result?.error || error || 'Failed to create room';
                console.log('Room creation failed:', errorMsg);
                Alert.alert(isKurdish ? 'هەڵە' : 'Error', errorMsg);
                clearError();
            }
        } catch (err) {
            console.log('handleCreateRoom caught error:', err);
            Alert.alert(isKurdish ? 'هەڵە' : 'Error', err.message || 'Something went wrong');
        }
    };

    const handleJoinRoom = async () => {
        if (!user) {
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
            navigation.replace('RoomLobby');
        } else {
            const errorMsg = result?.error || error || 'Failed to join room';
            Alert.alert(isKurdish ? 'هەڵە' : 'Error', errorMsg);
            clearError();
        }
    };

    const rowDirection = isRTL ? 'row-reverse' : 'row';

    return (
        <AnimatedScreen>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >
                    {/* Header */}
                    <View style={[styles.header, { flexDirection: rowDirection }]}>
                        <BackButton onPress={() => navigation.goBack()} />
                        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                            {isKurdish ? 'یاری ئۆنلاین' : 'Play Online'}
                        </Text>
                        <View style={{ width: 44 }} />
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        <View style={{ alignItems: 'center', marginBottom: layout.spacing.lg }}>
                            <View style={[styles.heroIcon, { backgroundColor: colors.accent + '20' }]}>
                                <Gamepad2 size={48} color={colors.accent} strokeWidth={1.5} />
                            </View>
                        </View>

                        {/* === CREATE ROOM SECTION === */}
                        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                            {isKurdish ? 'ژوورێکی نوێ دروستبکە' : 'Create a New Room'}
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                            {isKurdish
                                ? 'هاوڕێکانت دەتوانن بە کۆدەکە بەشداری بکەن'
                                : 'Friends can join using the room code'}
                        </Text>

                        {/* Room Name Input */}
                        <GlassCard style={styles.inputCard}>
                            <View style={[styles.inputContainer, { flexDirection: rowDirection }]}>
                                <Home size={20} color={colors.text.muted} />
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            color: colors.text.primary,
                                            textAlign: isRTL ? 'right' : 'left',
                                        }
                                    ]}
                                    placeholder={isKurdish ? 'ناوی ژوور' : 'Room Name'}
                                    placeholderTextColor={colors.text.muted}
                                    value={roomName}
                                    onChangeText={setRoomName}
                                    maxLength={30}
                                />
                            </View>
                        </GlassCard>

                        {/* Create Button */}
                        <BeastButton
                            title={isKurdish ? 'دروستکردن' : 'Create Room'}
                            onPress={handleCreateRoom}
                            variant="primary"
                            size="lg"
                            icon={Plus}
                            style={{ width: '100%', marginTop: layout.spacing.md, opacity: !roomName.trim() ? 0.5 : 1 }}
                        />

                        {/* Divider */}
                        <View style={[styles.dividerContainer, { flexDirection: rowDirection }]}>
                            <View style={[styles.divider, { backgroundColor: colors.border }]} />
                            <Text style={[styles.dividerText, { color: colors.text.muted }]}>
                                {isKurdish ? 'یان' : 'OR'}
                            </Text>
                            <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        </View>

                        {/* === JOIN ROOM SECTION === */}
                        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                            {isKurdish ? 'چوونە ژوورەوە' : 'Join a Room'}
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                            {isKurdish ? 'کۆدی ژوورەکە لە هاوڕێکەت وەربگرە' : 'Enter the 6-digit room code'}
                        </Text>

                        {/* Code Input */}
                        <GlassCard style={styles.inputCard}>
                            <TextInput
                                style={[
                                    styles.codeInput,
                                    {
                                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
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

                        {/* Join Button */}
                        <TouchableOpacity
                            style={[
                                styles.joinBtn,
                                {
                                    borderColor: colors.accent,
                                    opacity: roomCode.length !== 6 ? 0.5 : 1,
                                },
                            ]}
                            onPress={handleJoinRoom}
                            activeOpacity={0.8}
                        >
                            <LogIn size={20} color={colors.accent} />
                            <Text style={[styles.joinBtnText, { color: colors.accent }]}>
                                {isKurdish ? 'چوونە ژوورەوە' : 'Join Room'}
                            </Text>
                        </TouchableOpacity>

                        <View style={{ height: 40 }} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
        alignItems: 'center',
        paddingBottom: 40,
    },
    heroIcon: {
        width: 96,
        height: 96,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '800',
        marginBottom: layout.spacing.xs,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: layout.spacing.lg,
    },
    inputCard: {
        width: '100%',
        marginBottom: layout.spacing.xs,
    },
    inputContainer: {
        alignItems: 'center',
        gap: layout.spacing.sm,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    codeInput: {
        width: 200,
        height: 64,
        borderRadius: layout.radius.lg,
        borderWidth: 2,
        textAlign: 'center',
        fontSize: 28,
        fontWeight: '700',
        letterSpacing: 8,
        alignSelf: 'center',
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
    joinBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderRadius: layout.radius.xl,
        borderWidth: 2,
        gap: layout.spacing.sm,
        width: '100%',
        marginTop: layout.spacing.md,
    },
    joinBtnText: {
        fontSize: 16,
        fontWeight: '700',
    },
});
