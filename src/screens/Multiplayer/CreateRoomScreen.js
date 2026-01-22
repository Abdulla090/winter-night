import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { useGameRoom } from '../../context/GameRoomContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export default function CreateRoomScreen({ navigation }) {
    const { createRoom, loading, error, clearError } = useGameRoom();
    const { isAuthenticated, initialized } = useAuth();
    const { theme } = useTheme();
    const { isKurdish } = useLanguage();

    const [roomName, setRoomName] = useState('');

    // Check authentication on mount
    useEffect(() => {
        if (initialized && !isAuthenticated) {
            Alert.alert(
                isKurdish ? 'چوونەژوورەوە پێویستە' : 'Login Required',
                isKurdish ? 'تکایە سەرەتا بچۆ ژوورەوە' : 'Please login first to create a room',
                [
                    { text: isKurdish ? 'باشە' : 'OK', onPress: () => navigation.replace('Login') }
                ]
            );
        }
    }, [initialized, isAuthenticated]);

    const handleCreateRoom = async () => {
        if (!isAuthenticated) {
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

        // Create room without game type - host will select later
        const room = await createRoom(null, roomName);

        if (room) {
            navigation.replace('RoomLobby');
        } else if (error) {
            Alert.alert(isKurdish ? 'هەڵە' : 'Error', error);
            clearError();
        }
    };

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={[styles.backBtn, { backgroundColor: theme.background.card }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons
                            name={isKurdish ? 'arrow-forward' : 'arrow-back'}
                            size={24}
                            color={theme.text.primary}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text.primary }]}>
                        {isKurdish ? 'دروستکردنی ژوور' : 'Create Room'}
                    </Text>
                    <View style={{ width: 44 }} />
                </View>

                {/* Content */}
                <View style={styles.content}>
                    {/* Icon */}
                    <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                        <Ionicons name="game-controller" size={48} color={theme.colors.primary} />
                    </View>

                    <Text style={[styles.title, { color: theme.text.primary }]}>
                        {isKurdish ? 'ژوورێکی نوێ دروستبکە' : 'Create a New Room'}
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
                        {isKurdish
                            ? 'هاوڕێکانت دەتوانن بە کۆدەکە بەشداری بکەن'
                            : 'Friends can join using the room code'}
                    </Text>

                    {/* Room Name Input */}
                    <View style={[styles.inputContainer, { backgroundColor: theme.background.card, borderColor: theme.background.border }]}>
                        <Ionicons name="home-outline" size={20} color={theme.text.secondary} />
                        <TextInput
                            style={[styles.input, { color: theme.text.primary }]}
                            placeholder={isKurdish ? 'ناوی ژوور' : 'Room Name'}
                            placeholderTextColor={theme.text.secondary}
                            value={roomName}
                            onChangeText={setRoomName}
                            maxLength={30}
                        />
                    </View>

                    <Text style={[styles.hint, { color: theme.text.muted }]}>
                        {isKurdish
                            ? 'یاری لە ناو ژوورەکە هەڵدەبژێریت'
                            : 'You\'ll choose the game after creating the room'}
                    </Text>

                    {/* Create Button */}
                    <TouchableOpacity
                        style={[
                            styles.createBtn,
                            { backgroundColor: theme.colors.primary },
                            !roomName.trim() && { opacity: 0.5 },
                        ]}
                        onPress={handleCreateRoom}
                        disabled={loading || !roomName.trim()}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <>
                                <Ionicons name="add-circle" size={24} color="#FFF" />
                                <Text style={styles.createBtnText}>
                                    {isKurdish ? 'دروستکردن' : 'Create Room'}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.md,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        ...FONTS.bold,
        fontSize: 18,
    },
    content: {
        flex: 1,
        paddingHorizontal: SPACING.xl,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xl,
    },
    title: {
        ...FONTS.bold,
        fontSize: 24,
        marginBottom: SPACING.sm,
        textAlign: 'center',
    },
    subtitle: {
        ...FONTS.regular,
        fontSize: 15,
        textAlign: 'center',
        marginBottom: SPACING.xl,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        height: 56,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        gap: SPACING.sm,
        width: '100%',
    },
    input: {
        flex: 1,
        ...FONTS.regular,
        fontSize: 16,
    },
    hint: {
        ...FONTS.regular,
        fontSize: 13,
        marginTop: SPACING.md,
        textAlign: 'center',
    },
    createBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderRadius: BORDER_RADIUS.lg,
        marginTop: SPACING.xl,
        gap: SPACING.sm,
        width: '100%',
    },
    createBtnText: {
        ...FONTS.bold,
        fontSize: 16,
        color: '#FFF',
    },
});
