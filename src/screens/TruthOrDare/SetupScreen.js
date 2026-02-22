import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Smile, Flame, Skull, Gamepad2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Button, PlayerInput, BackButton } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { getIntensityLevels } from '../../constants/truthOrDareData';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../localization/translations';

export default function TruthOrDareSetupScreen({ navigation }) {
    const [players, setPlayers] = useState([]);
    const [selectedIntensity, setSelectedIntensity] = useState('mild');

    const { language, isKurdish } = useLanguage();
    const { colors, isRTL } = useTheme();
    const intensityLevels = getIntensityLevels(language);
    const canStart = players.length >= 2;

    const rowDirection = isRTL ? 'row-reverse' : 'row';
    const rtlStyles = { textAlign: isRTL ? 'right' : 'left' };

    // Get intensity name and desc from the levels array
    const getIntensityName = (key) => {
        const level = intensityLevels.find(l => l.key === key);
        return level ? level.name : key;
    };

    const getIntensityDesc = (key) => {
        const level = intensityLevels.find(l => l.key === key);
        return level ? level.description : '';
    };

    const handleIntensitySelect = (key) => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        setSelectedIntensity(key);
    };

    const startGame = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        navigation.navigate('TruthOrDarePlay', {
            players,
            intensity: selectedIntensity,
        });
    };

    const getIcon = (iconName, color) => {
        switch (iconName) {
            case 'Smile': return <Smile size={28} color={color} />;
            case 'Flame': return <Flame size={28} color={color} />;
            case 'Skull': return <Skull size={28} color={color} />;
            default: return <Smile size={28} color={color} />;
        }
    };

    return (
        <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View style={[styles.header, { flexDirection: rowDirection }]}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={[styles.title, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                    {t('truthOrDare.title', language)}
                </Text>
                <View style={{ width: 44 }} />
            </View>

            {/* Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={true}
            >
                {/* Player Input */}
                <PlayerInput
                    players={players}
                    setPlayers={setPlayers}
                    minPlayers={2}
                    maxPlayers={20}
                    isKurdish={isKurdish}
                    language={language}
                />

                {/* Intensity Selection */}
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
                            onPress={() => handleIntensitySelect(level.key)}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.intensityIcon, { backgroundColor: `${level.color}20` }]}>
                                {getIcon(level.icon, level.color)}
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

                {/* How to Play */}
                <View style={styles.rulesCard}>
                    <View style={[styles.rulesHeader, { flexDirection: rowDirection }]}>
                        <Gamepad2 size={20} color={COLORS.accent.purple} />
                        <Text style={[styles.rulesTitle, isKurdish && styles.kurdishFont]}>
                            {t('common.howToPlay', language)}
                        </Text>
                    </View>
                    <Text style={[styles.rulesText, rtlStyles, isKurdish && styles.kurdishFont]}>
                        {t('truthOrDare.howToPlayRules', language)}
                    </Text>
                </View>

                {/* Start Button */}
                <View style={styles.buttonContainer}>
                    <Button
                        title={t('common.start', language)}
                        onPress={startGame}
                        disabled={!canStart}
                        gradient={[COLORS.accent.purple, COLORS.accent.purple]}
                        icon={<Flame size={20} color="#FFF" />}
                        isKurdish={isKurdish}
                    />
                    {!canStart && (
                        <Text style={[styles.minPlayersHint, rtlStyles, isKurdish && styles.kurdishFont]}>
                            {t('truthOrDare.minPlayersHint', language)}
                        </Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLORS.background.dark,
    },
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
    title: { color: COLORS.text.primary, ...FONTS.title, fontSize: 24 },

    scrollView: { flex: 1 },
    scrollContent: {
        padding: SPACING.lg,
        paddingBottom: 120,
    },

    sectionTitle: {
        color: COLORS.text.secondary, ...FONTS.medium,
        marginBottom: SPACING.md, marginTop: SPACING.lg,
        textTransform: 'uppercase', fontSize: 13, letterSpacing: 1,
    },

    intensityGrid: {
        gap: 12,
    },
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
    intensityDesc: { color: COLORS.text.muted, fontSize: 13, textAlign: 'center' },

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
    rulesTitle: { color: COLORS.accent.purple, ...FONTS.medium },
    rulesText: { color: COLORS.text.muted, lineHeight: 22 },

    buttonContainer: {
        marginTop: SPACING.xl,
        marginBottom: 50,
    },
    minPlayersHint: {
        color: COLORS.text.muted,
        textAlign: 'center',
        marginTop: SPACING.sm,
        fontSize: 13,
    },
    kurdishFont: {
        fontFamily: 'Rabar',
    },
});
