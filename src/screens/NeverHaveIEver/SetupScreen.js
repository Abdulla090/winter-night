import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Hand } from 'lucide-react-native';
import * as Icons from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { Button, PlayerInput, BackButton } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { getIntensityLevels } from '../../constants/neverHaveIEverData';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../localization/translations';

export default function NeverHaveIEverSetupScreen({ navigation }) {
    const [players, setPlayers] = useState([]);
    const [selectedIntensity, setSelectedIntensity] = useState('mild');

    const { language, isKurdish } = useLanguage();
    const { colors, isRTL } = useTheme();
    const intensityLevels = getIntensityLevels();
    const canStart = players.length >= 2;

    const rowDirection = isRTL ? 'row-reverse' : 'row';
    const rtlStyles = { textAlign: isRTL ? 'right' : 'left' };

    // Get intensity name based on language
    const getIntensityName = (key) => {
        const names = {
            mild: isKurdish ? 'سووک' : 'Mild',
            medium: isKurdish ? 'ناوەند' : 'Medium',
            spicy: isKurdish ? 'توون' : 'Spicy'
        };
        return names[key] || key;
    };

    const getIntensityDesc = (key) => {
        const descs = {
            mild: isKurdish ? 'خۆشی خێزانی' : 'Family friendly fun',
            medium: isKurdish ? 'کەمێک توونتر' : 'A bit more spicy',
            spicy: isKurdish ? 'تەنها بۆ گەورەکان!' : 'Adults only!'
        };
        return descs[key] || '';
    };

    const startGame = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        navigation.navigate('NeverHaveIEverPlay', {
            players,
            intensity: selectedIntensity,
        });
    };

    return (
        <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
            <View style={[styles.header, { flexDirection: rowDirection }]}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={[styles.title, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                    {t('neverHaveIEver.title', language)}
                </Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <PlayerInput
                    players={players}
                    setPlayers={setPlayers}
                    minPlayers={2}
                    maxPlayers={20}
                    isKurdish={isKurdish}
                    language={language}
                />

                <Text style={[styles.sectionTitle, rtlStyles, isKurdish && styles.kurdishFont]}>
                    {t('truthOrDare.chooseIntensity', language)}
                </Text>
                <View style={styles.intensityGrid}>
                    {intensityLevels.map((level) => (
                        <TouchableOpacity
                            key={level.key}
                            style={[
                                styles.intensityCard,
                                selectedIntensity === level.key && {
                                    borderColor: level.color,
                                    backgroundColor: `${level.color}15`
                                }
                            ]}
                            onPress={() => {
                                if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setSelectedIntensity(level.key);
                            }}
                        >
                            <View style={[styles.intensityIcon, { backgroundColor: `${level.color}20` }]}>
                                {(() => {
                                    const IconComponent = Icons[level.icon] || Icons.HelpCircle;
                                    return <IconComponent size={28} color={level.color} />;
                                })()}
                            </View>
                            <Text style={[
                                styles.intensityName,
                                selectedIntensity === level.key && { color: level.color },
                                isKurdish && styles.kurdishFont
                            ]}>
                                {getIntensityName(level.key)}
                            </Text>
                            <Text style={[styles.intensityDesc, isKurdish && styles.kurdishFont]}>
                                {getIntensityDesc(level.key)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.rulesCard}>
                    <View style={[styles.rulesHeader, { flexDirection: rowDirection }]}>
                        <Hand size={20} color={COLORS.accent.warning} />
                        <Text style={[styles.rulesTitle, isKurdish && styles.kurdishFont]}>
                            {t('common.howToPlay', language)}
                        </Text>
                    </View>
                    <Text style={[styles.rulesText, rtlStyles, isKurdish && styles.kurdishFont]}>
                        {isKurdish
                            ? '• ڕستەیەک لەسەر شاشەکە دەردەکەوێت\n• ئەگەر تۆ کردووتبێت، پەنجەیەک دابەزێنە\n• یەکەم کەسێک کە هەموو ٥ پەنجەی دادەبەزێنێت دەدۆڕێت!\n• یان تەنها بۆ خۆشی و چیرۆک یاری بکەن!'
                            : "• A statement appears on screen\n• If you HAVE done it, put a finger down\n• The first person to lose all 5 fingers loses!\n• Or just play for fun and stories!"
                        }
                    </Text>
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        title={t('common.start', language)}
                        onPress={startGame}
                        disabled={!canStart}
                        gradient={[COLORS.accent.warning, COLORS.accent.warning]}
                        icon={<Hand size={20} color="#FFF" />}
                        isKurdish={isKurdish}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: COLORS.background.dark },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.background.dark,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.background.border,
        minHeight: 60,
    },
    backButton: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: COLORS.background.card,
        alignItems: 'center', justifyContent: 'center',
    },
    title: { color: COLORS.text.primary, ...FONTS.title, fontSize: 22 },
    placeholder: { width: 44 },
    scrollView: { flex: 1 },
    scrollContent: { padding: SPACING.lg, paddingBottom: 120 },
    sectionTitle: {
        color: COLORS.text.secondary, ...FONTS.medium,
        marginBottom: SPACING.md, marginTop: SPACING.lg,
        textTransform: 'uppercase', fontSize: 13, letterSpacing: 1,
    },
    intensityGrid: { gap: 12 },
    intensityCard: {
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    intensityIcon: {
        width: 56, height: 56, borderRadius: 28,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: SPACING.sm,
    },
    intensityName: { color: COLORS.text.primary, ...FONTS.bold, fontSize: 18, marginBottom: 4 },
    intensityDesc: { color: COLORS.text.muted, fontSize: 13 },
    rulesCard: {
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        marginTop: SPACING.lg,
    },
    rulesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.sm,
    },
    rulesTitle: { color: COLORS.accent.warning, ...FONTS.medium },
    rulesText: { color: COLORS.text.muted, lineHeight: 22 },
    buttonContainer: { marginTop: SPACING.xl, marginBottom: 50 },
    kurdishFont: { fontFamily: 'Rabar' },
});
