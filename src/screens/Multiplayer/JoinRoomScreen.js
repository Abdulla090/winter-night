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

export default function JoinRoomScreen({ navigation }) {
    const { joinRoom, loading, error, clearError } = useGameRoom();
    const { isAuthenticated, initialized } = useAuth();
    const { theme } = useTheme();
    const { isKurdish } = useLanguage();

    const [roomCode, setRoomCode] = useState('');

    // Check authentication on mount
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

        const room = await joinRoom(roomCode);

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
                {/* Back Button */}
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

                {/* Content */}
                <View style={styles.content}>
                    <Ionicons name="enter-outline" size={80} color={theme.colors.primary} />

                    <Text style={[styles.title, { color: theme.text.primary }]}>
                        {isKurdish ? 'چوونە ژوورەوە' : 'Join Room'}
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
                        {isKurdish ? 'کۆدی ژوورەکە لە هاوڕێکەت وەربگرە' : 'Enter the room code from your friend'}
                    </Text>

                    {/* Code Input */}
                    <View style={styles.codeInputContainer}>
                        <TextInput
                            style={[
                                styles.codeInput,
                                {
                                    backgroundColor: theme.background.card,
                                    borderColor: theme.background.border,
                                    color: theme.text.primary,
                                },
                            ]}
                            value={roomCode}
                            onChangeText={(text) => setRoomCode(text.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                            maxLength={6}
                            placeholder="XXXXXX"
                            placeholderTextColor={theme.text.secondary}
                            autoCapitalize="characters"
                            autoCorrect={false}
                        />
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.joinBtn,
                            { backgroundColor: theme.colors.primary },
                            roomCode.length !== 6 && { opacity: 0.5 },
                        ]}
                        onPress={handleJoinRoom}
                        disabled={loading || roomCode.length !== 6}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <>
                                <Ionicons name="enter" size={24} color="#FFF" />
                                <Text style={styles.joinBtnText}>
                                    {isKurdish ? 'چوونە ژوورەوە' : 'Join Room'}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Divider */}
                <View style={styles.dividerContainer}>
                    <View style={[styles.divider, { backgroundColor: theme.background.border }]} />
                    <Text style={[styles.dividerText, { color: theme.text.secondary }]}>
                        {isKurdish ? 'یان' : 'OR'}
                    </Text>
                    <View style={[styles.divider, { backgroundColor: theme.background.border }]} />
                </View>

                {/* Create Room Link */}
                <TouchableOpacity
                    style={[styles.createBtn, { borderColor: theme.colors.primary }]}
                    onPress={() => navigation.replace('CreateRoom')}
                >
                    <Ionicons name="add-circle-outline" size={24} color={theme.colors.primary} />
                    <Text style={[styles.createBtnText, { color: theme.colors.primary }]}>
                        {isKurdish ? 'ژوورێک دروستبکە' : 'Create a New Room'}
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: SPACING.lg },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SPACING.md,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100,
    },
    title: {
        ...FONTS.bold,
        fontSize: 28,
        marginTop: SPACING.lg,
    },
    subtitle: {
        ...FONTS.regular,
        fontSize: 15,
        marginTop: SPACING.sm,
        textAlign: 'center',
    },
    codeInputContainer: {
        marginTop: SPACING.xl,
        width: '100%',
        alignItems: 'center',
    },
    codeInput: {
        width: 200,
        height: 70,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 2,
        textAlign: 'center',
        ...FONTS.bold,
        fontSize: 32,
        letterSpacing: 8,
    },
    joinBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderRadius: BORDER_RADIUS.lg,
        paddingHorizontal: SPACING.xl,
        marginTop: SPACING.xl,
        gap: SPACING.sm,
    },
    joinBtnText: {
        ...FONTS.bold,
        fontSize: 16,
        color: '#FFF',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: SPACING.xl,
        gap: SPACING.md,
    },
    divider: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        ...FONTS.medium,
        fontSize: 12,
    },
    createBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 2,
        gap: SPACING.sm,
        marginBottom: SPACING.xl,
    },
    createBtnText: {
        ...FONTS.bold,
        fontSize: 16,
    },
});
