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
import { Gamepad2, Plus, Home } from 'lucide-react-native';
import { MotiView } from 'moti';

import { AnimatedScreen, BeastButton, GlassCard, BackButton } from '../../components';
import { useGameRoom } from '../../context/GameRoomContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { layout } from '../../theme/layout';

export default function CreateRoomScreen({ navigation }) {
    const { createRoom, currentRoom, loading, error, clearError } = useGameRoom();
    const { user, initialized } = useAuth();
    const { colors, isRTL } = useTheme();
    const { isKurdish } = useLanguage();

    const [roomName, setRoomName] = useState('');

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

    const rowDirection = isRTL ? 'row-reverse' : 'row';

    return (
        <AnimatedScreen>
            {/* Header */}
            <View style={[styles.header, { flexDirection: rowDirection }]}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                    {isKurdish ? 'دروستکردنی ژوور' : 'Create Room'}
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
                        <Gamepad2 size={48} color={colors.accent} strokeWidth={1.5} />
                    </View>
                </MotiView>

                <Text style={[styles.title, { color: colors.text.primary }]}>
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

                <Text style={[styles.hint, { color: colors.text.muted }]}>
                    {isKurdish
                        ? 'یاری لە ناو ژوورەکە هەڵدەبژێریت'
                        : 'You\'ll choose the game after creating the room'}
                </Text>

                {/* Create Button */}
                <BeastButton
                    title={isKurdish ? 'دروستکردن' : 'Create Room'}
                    onPress={handleCreateRoom}
                    variant="primary"
                    size="lg"
                    icon={Plus}
                    style={{ width: '100%', marginTop: layout.spacing.xl, opacity: !roomName.trim() ? 0.5 : 1 }}
                />
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
        fontSize: 24,
        fontWeight: '800',
        marginBottom: layout.spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        textAlign: 'center',
        marginBottom: layout.spacing.xl,
    },
    inputCard: {
        width: '100%',
        marginBottom: layout.spacing.sm,
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
    hint: {
        fontSize: 13,
        textAlign: 'center',
    },
});
