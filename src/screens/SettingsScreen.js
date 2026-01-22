import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Switch,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { t } from '../localization/translations';

export default function SettingsScreen({ navigation }) {
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [vibrationEnabled, setVibrationEnabled] = useState(true);
    const { language, setLanguage, isKurdish } = useLanguage();
    const { theme, toggleTheme, isDark } = useTheme();

    // Get RTL styles
    const rtlStyles = {
        textAlign: isKurdish ? 'right' : 'left',
        writingDirection: isKurdish ? 'rtl' : 'ltr',
    };

    const rowDirection = isKurdish ? 'row-reverse' : 'row';

    // Dynamic styles based on theme
    const themeStyles = {
        container: { backgroundColor: theme.background.main },
        text: { color: theme.text.primary },
        subtext: { color: theme.text.secondary },
        card: { backgroundColor: theme.background.card },
        iconBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
        border: theme.background.border
    };

    return (
        <GradientBackground>
            <SafeAreaView style={[styles.container, themeStyles.container]}>
                {/* Header */}
                <View style={[styles.header, { flexDirection: rowDirection }]}>
                    <TouchableOpacity
                        style={[styles.backButton, { backgroundColor: theme.background.card }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons
                            name={isKurdish ? "arrow-forward" : "arrow-back"}
                            size={24}
                            color={theme.text.primary}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.title, rtlStyles, isKurdish && styles.kurdishFont, { color: theme.text.primary }]}>
                        {t('settings.title', language)}
                    </Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Settings List */}
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Appearance */}
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, rtlStyles, isKurdish && styles.kurdishFont, { color: theme.text.muted }]}>
                            {t('common.settings', language)}
                        </Text>
                    </View>

                    <View style={[styles.settingItem, { flexDirection: rowDirection, backgroundColor: theme.background.card }]}>
                        <View style={[styles.settingInfo, { flexDirection: rowDirection }]}>
                            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                                <Ionicons name={isDark ? "moon" : "sunny"} size={22} color={theme.colors.primary} />
                            </View>
                            <Text style={[styles.settingText, rtlStyles, isKurdish && styles.kurdishFont, { color: theme.text.primary }]}>
                                {isDark ? "Dark Mode" : "Light Mode"}
                            </Text>
                        </View>
                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            trackColor={{ false: '#767577', true: theme.colors.primary }}
                            thumbColor={'#fff'}
                        />
                    </View>

                    {/* Language Setting */}
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, rtlStyles, isKurdish && styles.kurdishFont, { color: theme.text.muted }]}>
                            {t('settings.language', language)}
                        </Text>
                    </View>

                    <View style={styles.languageContainer}>
                        <TouchableOpacity
                            style={[
                                styles.languageOption,
                                !isKurdish && styles.languageOptionSelected,
                                { backgroundColor: theme.background.card, borderColor: !isKurdish ? theme.colors.success : 'transparent' }
                            ]}
                            onPress={() => setLanguage('en')}
                        >
                            <View style={[styles.languageContent, { flexDirection: rowDirection }]}>
                                <Text style={styles.languageFlag}>🇬🇧</Text>
                                <View style={styles.languageTextContainer}>
                                    <Text style={[
                                        styles.languageText,
                                        !isKurdish && { color: theme.colors.success },
                                        { color: theme.text.primary }
                                    ]}>
                                        English
                                    </Text>
                                    <Text style={[styles.languageSubtext, { color: theme.text.muted }]}>
                                        English (US)
                                    </Text>
                                </View>
                            </View>
                            {!isKurdish && (
                                <Ionicons
                                    name="checkmark-circle"
                                    size={24}
                                    color={theme.colors.success}
                                />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.languageOption,
                                isKurdish && styles.languageOptionSelected,
                                { backgroundColor: theme.background.card, borderColor: isKurdish ? theme.colors.success : 'transparent' }
                            ]}
                            onPress={() => setLanguage('ku')}
                        >
                            <View style={[styles.languageContent, { flexDirection: rowDirection }]}>
                                <Text style={styles.languageFlag}>🇮🇶</Text>
                                <View style={styles.languageTextContainer}>
                                    <Text style={[
                                        styles.languageText,
                                        isKurdish && { color: theme.colors.success },
                                        styles.kurdishFont,
                                        { color: theme.text.primary }
                                    ]}>
                                        کوردی سۆرانی
                                    </Text>
                                    <Text style={[styles.languageSubtext, styles.kurdishFont, { color: theme.text.muted }]}>
                                        Kurdish (Sorani)
                                    </Text>
                                </View>
                            </View>
                            {isKurdish && (
                                <Ionicons
                                    name="checkmark-circle"
                                    size={24}
                                    color={theme.colors.success}
                                />
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* About Section */}
                    <View style={[styles.aboutSection, { backgroundColor: theme.background.card }]}>
                        <View style={styles.aboutHeader}>
                            <View style={[styles.appIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                                <Ionicons name="game-controller" size={32} color={theme.colors.primary} />
                            </View>
                            <Text style={[styles.aboutTitle, rtlStyles, isKurdish && styles.kurdishFont, { color: theme.text.primary }]}>
                                {t('settings.about', language)}
                            </Text>
                        </View>
                        <Text style={[styles.appName, rtlStyles, isKurdish && styles.kurdishFont, { color: theme.text.primary }]}>
                            {t('settings.appName', language)}
                        </Text>
                        <Text style={[styles.versionText, rtlStyles, isKurdish && styles.kurdishFont, { color: theme.text.muted }]}>
                            {t('settings.version', language)}
                        </Text>
                        <View style={[styles.divider, { backgroundColor: theme.background.border }]} />
                        <Text style={[styles.aboutText, rtlStyles, isKurdish && styles.kurdishFont, { color: theme.text.secondary }]}>
                            {t('settings.aboutDescription', language)}
                        </Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </GradientBackground>
    );
}

const SHADOWS = {
    small: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.small
    },
    title: {
        ...FONTS.title,
        fontSize: 24,
    },
    placeholder: {
        width: 44,
    },
    content: {
        flex: 1,
        padding: SPACING.lg,
    },
    sectionHeader: {
        marginTop: SPACING.md,
        marginBottom: SPACING.sm,
    },
    sectionTitle: {
        ...FONTS.semibold,
        fontSize: 12,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    languageContainer: {
        marginBottom: SPACING.lg,
    },
    languageOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.sm,
        borderWidth: 2,
    },
    languageOptionSelected: {
        // Handled in render
    },
    languageContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    languageFlag: {
        fontSize: 32,
    },
    languageTextContainer: {
        gap: 2,
    },
    languageText: {
        ...FONTS.semibold,
        fontSize: 17,
    },
    languageSubtext: {
        fontSize: 13,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.md,
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingText: {
        ...FONTS.medium,
        fontSize: 16,
    },
    aboutSection: {
        marginTop: SPACING.xl,
        padding: SPACING.xl,
        borderRadius: BORDER_RADIUS.lg,
        alignItems: 'center',
    },
    aboutHeader: {
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    appIconContainer: {
        width: 64,
        height: 64,
        borderRadius: BORDER_RADIUS.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.sm,
    },
    aboutTitle: {
        ...FONTS.bold,
        fontSize: 18,
    },
    appName: {
        ...FONTS.semibold,
        fontSize: 16,
        textAlign: 'center',
    },
    versionText: {
        fontSize: 13,
        marginTop: 4,
    },
    divider: {
        height: 1,
        width: '80%',
        marginVertical: SPACING.lg,
    },
    aboutText: {
        ...FONTS.regular,
        textAlign: 'center',
        lineHeight: 22,
    },
    kurdishFont: {
        fontFamily: 'Rabar',
    },
});


