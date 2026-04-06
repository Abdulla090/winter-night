import React, { useState, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Switch,
    ScrollView,
    Image,
    Platform,
    Alert,
    TextInput
} from 'react-native';

import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import {
    User,
    Lock,
    Bell,
    Volume2,
    Globe,
    CircleHelp,
    Shield,
    LogOut,
    ChevronRight,
    ChevronLeft,
    Pencil,
    Sun,
    Moon,
    Palette
} from 'lucide-react-native';

import { AnimatedScreen, BackButton } from '../components';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { t } from '../localization/translations';
import { layout } from '../theme/layout';
import { getGeminiApiKey, maskGeminiApiKey, setGeminiApiKey } from '../utils/geminiConfig';

export default function SettingsScreen({ navigation }) {
    const { language, setLanguage, isKurdish } = useLanguage();
    const { colors, isRTL, toggleTheme, isDark } = useTheme();
    const { profile, user, signOut } = useAuth();

    // Get user's display name and email
    const userName = profile?.username || user?.user_metadata?.username || (user?.email ? user.email.split('@')[0] : (isKurdish ? 'میوان' : 'Guest'));
    const userEmail = user?.email || (isKurdish ? 'ئیمەیلێک زیادبکە' : 'Add an email');

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [geminiApiKey, setGeminiApiKeyInput] = useState('');
    const [savedGeminiApiKey, setSavedGeminiApiKey] = useState('');

    const isDarkMode = isDark;

    const handleLanguageToggle = () => {
        setLanguage(language === 'en' ? 'ku' : 'en');
    };

    useEffect(() => {
        let isMounted = true;

        const loadGeminiKey = async () => {
            const key = await getGeminiApiKey();
            if (isMounted) {
                setGeminiApiKeyInput(key);
                setSavedGeminiApiKey(key);
            }
        };

        loadGeminiKey();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleLogout = async () => {
        Alert.alert(
            isKurdish ? 'چوونەدەرەوە' : 'Log Out',
            isKurdish ? 'دڵنیایت دەتەوێت بچیتە دەرەوە؟' : 'Are you sure you want to log out?',
            [
                { text: isKurdish ? 'نەخێر' : 'Cancel', style: 'cancel' },
                {
                    text: isKurdish ? 'بەڵێ' : 'Yes',
                    style: 'destructive',
                    onPress: async () => {
                        await signOut();
                        navigation.navigate('Login');
                    }
                }
            ]
        );
    };

    const handleSaveGeminiKey = async () => {
        try {
            await setGeminiApiKey(geminiApiKey);
            const trimmedKey = geminiApiKey.trim();
            setSavedGeminiApiKey(trimmedKey);
            Alert.alert(
                isKurdish ? 'تەواو بوو' : 'Saved',
                trimmedKey
                    ? (isKurdish ? 'کلیلی Gemini پاشەکەوت کرا.' : 'Gemini API key saved.')
                    : (isKurdish ? 'کلیلی Gemini سڕایەوە.' : 'Gemini API key cleared.')
            );
        } catch (error) {
            Alert.alert(
                isKurdish ? 'هەڵە' : 'Error',
                isKurdish ? 'نەتوانرا کلیلی Gemini پاشەکەوت بکرێت.' : 'Failed to save Gemini API key.'
            );
        }
    };

    // ☀️ Theme-aware accent colors
    const accentColor = isDarkMode ? '#D946EF' : colors.primary;
    const accentBg = isDarkMode ? '#D946EF20' : 'rgba(14, 165, 233, 0.1)';
    const switchActiveColor = isDarkMode ? '#FF00A6' : colors.primary;
    const switchInactiveColor = isDarkMode ? '#3F3F5A' : '#E2E8F0';

    // Simple row component with native-feel animation
    const SettingRow = ({ icon: Icon, title, showToggle, value, onToggle, showChevron, subtitle, onPress }) => {
        const handlePress = useCallback(() => {
            if (onPress && !showToggle) {
                if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                onPress();
            }
        }, [onPress, showToggle]);

        return (
            <TouchableOpacity
                onPress={handlePress}
                disabled={showToggle}
                activeOpacity={showToggle ? 1 : 0.7}
                style={styles.row}
            >
                <View style={[styles.iconBox, { backgroundColor: accentBg }]}>
                    <Icon size={20} color={accentColor} />
                </View>
                <View style={styles.rowText}>
                    <Text style={[styles.rowTitle, { color: colors.text.primary }]}>{title}</Text>
                    {subtitle && <Text style={[styles.rowSubtitle, { color: colors.text.muted }]}>{subtitle}</Text>}
                </View>
                {showToggle && (
                    <Switch
                        value={value}
                        onValueChange={onToggle}
                        trackColor={{ false: switchInactiveColor, true: switchActiveColor }}
                        thumbColor="#FFF"
                    />
                )}
                {showChevron && (
                    isRTL ? <ChevronLeft size={20} color={colors.text.muted} /> : <ChevronRight size={20} color={colors.text.muted} />
                )}
            </TouchableOpacity>
        );
    };

    const cardBg = isDarkMode ? 'rgba(26, 11, 46, 0.8)' : '#FFFFFF';
    const cardBorder = isDarkMode ? 'rgba(255,255,255,0.06)' : '#E2E8F0';

    return (
        <AnimatedScreen>
            {/* Header */}
            <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                    {t('settings.title', language)}
                </Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Profile */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarWrap}>
                        <LinearGradient
                            colors={isDarkMode ? ['#D946EF', '#EC4899', '#F43F5E'] : [colors.primary, '#38BDF8', '#7DD3FC']}
                            style={styles.avatarRing}
                        >
                            <View style={styles.avatarInner}>
                                <Image
                                    source={{ uri: 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_25.png' }}
                                    style={styles.avatarImg}
                                />
                            </View>
                        </LinearGradient>
                        <TouchableOpacity style={[styles.editBtn, { backgroundColor: accentColor, borderColor: colors.background }]}>
                            <Pencil size={14} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.profileName, { color: colors.text.primary }]}>
                        {userName}
                    </Text>
                    <Text style={[styles.profileEmail, { color: colors.text.muted }]}>
                        {userEmail}
                    </Text>
                </View>

                {/* Account Section */}
                <Text style={[styles.sectionLabel, { color: colors.text.muted }]}>
                    {t('settings.account', language)}
                </Text>
                <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                    <SettingRow icon={User} title={t('settings.personalInfo', language)} showChevron />
                    <View style={styles.divider} />
                    <SettingRow icon={Lock} title={t('settings.security', language)} showChevron />
                </View>

                {/* Preferences Section */}
                <Text style={[styles.sectionLabel, { color: colors.text.muted }]}>
                    {t('settings.preferences', language)}
                </Text>
                <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                    <SettingRow icon={Bell} title={t('settings.notifications', language)} showToggle value={notificationsEnabled} onToggle={setNotificationsEnabled} />
                    <View style={[styles.divider, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#E2E8F0' }]} />
                    <SettingRow icon={Volume2} title={t('settings.sound', language)} showToggle value={soundEnabled} onToggle={setSoundEnabled} />
                    <View style={[styles.divider, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#E2E8F0' }]} />
                    <SettingRow
                        icon={isDarkMode ? Moon : Sun}
                        title={isKurdish ? 'دۆخی تاریک' : 'Dark Mode'}
                        showToggle
                        value={isDarkMode}
                        onToggle={toggleTheme}
                    />
                    <View style={[styles.divider, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#E2E8F0' }]} />
                    <SettingRow icon={Globe} title={t('settings.language', language)} subtitle={isKurdish ? 'کوردی' : 'English'} showChevron onPress={handleLanguageToggle} />
                </View>

                <Text style={[styles.sectionLabel, { color: colors.text.muted }]}>
                    {isKurdish ? 'Gemini API' : 'Gemini API'}
                </Text>
                <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder, padding: 16 }]}>
                    <View style={styles.apiHeader}>
                        <View style={[styles.iconBox, { backgroundColor: accentBg, marginRight: 12 }]}>
                            <Palette size={20} color={accentColor} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.rowTitle, { color: colors.text.primary }]}>
                                {isKurdish ? 'کلیلی Gemini لەسەر دیڤایس' : 'Device Gemini API key'}
                            </Text>
                            <Text style={[styles.rowSubtitle, { color: colors.text.muted }]}>
                                {savedGeminiApiKey
                                    ? `${isKurdish ? 'کلیلی پاشەکەوتکراو:' : 'Saved key:'} ${maskGeminiApiKey(savedGeminiApiKey)}`
                                    : (isKurdish ? 'هێشتا هیچ کلیلی Gemini دانەنراوە.' : 'No Gemini API key saved yet.')}
                            </Text>
                        </View>
                    </View>

                    <TextInput
                        style={[
                            styles.apiInput,
                            {
                                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.06)' : '#F8FAFC',
                                borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : '#E2E8F0',
                                color: colors.text.primary,
                                textAlign: isRTL ? 'right' : 'left',
                            }
                        ]}
                        value={geminiApiKey}
                        onChangeText={setGeminiApiKeyInput}
                        placeholder={isKurdish ? 'Gemini API key بنووسە' : 'Enter Gemini API key'}
                        placeholderTextColor={colors.text.muted}
                        autoCapitalize="none"
                        autoCorrect={false}
                        spellCheck={false}
                    />

                    <Text style={[styles.apiHint, { color: colors.text.muted, textAlign: isRTL ? 'right' : 'left' }]}>
                        {isKurdish
                            ? 'ئەم کلیلیە بۆ Family Feud AI و voice transcription بەکاردێت. دەتوانیت هەر کاتێک بگۆڕیت.'
                            : 'This key is used for Family Feud AI judging and voice transcription. You can change it anytime.'}
                    </Text>

                    <View style={[styles.apiActions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <TouchableOpacity
                            onPress={() => setGeminiApiKeyInput('')}
                            activeOpacity={0.7}
                            style={[styles.secondaryAction, { borderColor: colors.border }]}
                        >
                            <Text style={[styles.secondaryActionText, { color: colors.text.secondary }]}>
                                {isKurdish ? 'پاککردنەوە' : 'Clear'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSaveGeminiKey}
                            activeOpacity={0.8}
                            style={[styles.primaryAction, { backgroundColor: accentColor }]}
                        >
                            <Text style={styles.primaryActionText}>
                                {isKurdish ? 'پاشەکەوتکردن' : 'Save key'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* More Section */}
                <Text style={[styles.sectionLabel, { color: colors.text.muted }]}>
                    {t('settings.more', language)}
                </Text>
                <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                    <SettingRow icon={CircleHelp} title={t('settings.helpCenter', language)} showChevron />
                    <View style={styles.divider} />
                    <SettingRow icon={Shield} title={t('settings.privacy', language)} showChevron />
                </View>

                {/* Logout */}
                <TouchableOpacity
                    onPress={handleLogout}
                    activeOpacity={0.7}
                    style={[styles.logoutBtn, { borderColor: colors.brand.crimson }]}
                >
                    <LogOut size={20} color={colors.brand.crimson} />
                    <Text style={[styles.logoutText, { color: colors.brand.crimson }]}>
                        {t('settings.logout', language)}
                    </Text>
                </TouchableOpacity>

                {/* Version */}
                <Text style={[styles.version, { color: colors.text.muted }]}>
                    {t('settings.version', language)}
                </Text>

            </ScrollView>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingBottom: 120,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarWrap: {
        marginBottom: 16,
    },
    avatarRing: {
        width: 108,
        height: 108,
        borderRadius: 54,
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInner: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFD6A5',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    avatarImg: {
        width: 80,
        height: 80,
    },
    editBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#D946EF',
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#0F0518',
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        opacity: 0.7,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    card: {
        borderRadius: 24,
        borderWidth: 1,
        marginBottom: 24,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        minHeight: 64,
    },
    iconBox: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    rowText: {
        flex: 1,
    },
    rowTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    rowSubtitle: {
        fontSize: 13,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginLeft: 70,
    },
    apiHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    apiInput: {
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 10,
    },
    apiHint: {
        fontSize: 12,
        lineHeight: 18,
        marginBottom: 14,
    },
    apiActions: {
        flexDirection: 'row',
        gap: 10,
    },
    primaryAction: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryActionText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
    secondaryAction: {
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 14,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryActionText: {
        fontSize: 14,
        fontWeight: '600',
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        borderRadius: 24,
        borderWidth: 1.5,
        backgroundColor: 'rgba(239, 68, 68, 0.06)',
        gap: 12,
        marginBottom: 16,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '700',
    },
    version: {
        textAlign: 'center',
        fontSize: 11,
        opacity: 0.5,
        letterSpacing: 1,
        marginBottom: 20,
    },
});
