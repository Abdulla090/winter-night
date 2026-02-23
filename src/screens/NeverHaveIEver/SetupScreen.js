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
        <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
            <View style={[styles.header, { flexDirection: rowDirection, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
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

                <Text style={[styles.sectionTitle, { color: colors.text.secondary }, rtlStyles, isKurdish && styles.kurdishFont]}>
                    {t('truthOrDare.chooseIntensity', language)}
                </Text>
                <View style={styles.intensityGrid}>
                    {intensityLevels.map((level) => (
                        <TouchableOpacity
                            key={level.key}
                            style={[
                                styles.intensityCard,
                                { backgroundColor: colors.surface },
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
                                { color: colors.text.primary },
                                selectedIntensity === level.key && { color: level.color },
                                isKurdish && styles.kurdishFont
                            ]}>
                                {getIntensityName(level.key)}
                            </Text>
                            <Text style={[styles.intensityDesc, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                                {getIntensityDesc(level.key)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={[styles.rulesCard, { backgroundColor: colors.surface }]}>
                    <View style={[styles.rulesHeader, { flexDirection: rowDirection }]}>
                        <Hand size={20} color={colors.brand.warning} />
                        <Text style={[styles.rulesTitle, { color: colors.brand.warning }, isKurdish && styles.kurdishFont]}>
                            {t('common.howToPlay', language)}
                        </Text>
                    </View>
                    <Text style={[styles.rulesText, { color: colors.text.muted }, rtlStyles, isKurdish && styles.kurdishFont]}>
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
                        gradient={[colors.brand.warning, colors.brand.warning]}
                        icon={<Hand size={20} color="#FFF" />}
                        isKurdish={isKurdish}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        minHeight: 60,
    },
    backButton: {
        width: 44, height: 44, borderRadius: 22,
        alignItems: 'center', justifyContent: 'center',
    },
    title: { ...FONTS.title, fontSize: 22 },
    placeholder: { width: 44 },
    scrollView: { flex: 1 },
    scrollContent: { padding: SPACING.lg, paddingBottom: 120 },
    sectionTitle: {
        ...FONTS.medium,
        marginBottom: SPACING.md, marginTop: SPACING.lg,
        textTransform: 'uppercase', fontSize: 13, letterSpacing: 1,
    },
    intensityGrid: { gap: 12 },
    intensityCard: {
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
    intensityName: { ...FONTS.bold, fontSize: 18, marginBottom: 4 },
    intensityDesc: { fontSize: 13 },
    rulesCard: {
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
    rulesTitle: { ...FONTS.medium },
    rulesText: { lineHeight: 22 },
    buttonContainer: { marginTop: SPACING.xl, marginBottom: 50 },
    kurdishFont: { fontFamily: 'Rabar' },
});
