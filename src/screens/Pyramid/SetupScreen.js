import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Zap, Play, Users } from 'lucide-react-native';
import { MotiView } from 'moti';

import { AnimatedScreen, BeastButton, GlassCard, PremiumInput, BackButton } from '../../components';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../localization/translations';
import { layout } from '../../theme/layout';

export default function PyramidSetupScreen({ navigation }) {
    const { language, isKurdish } = useLanguage();
    const { colors, isRTL } = useTheme();

    // Initial State
    const [teamA, setTeamA] = useState('');
    const [teamB, setTeamB] = useState('');

    const canStart = teamA.trim().length > 0 && teamB.trim().length > 0;
    const rowDirection = isRTL ? 'row-reverse' : 'row';

    const startGame = () => {
        if (canStart) {
            navigation.navigate('PyramidGameBoard', {
                teams: {
                    A: { name: teamA.trim(), score: 0 },
                    B: { name: teamB.trim(), score: 0 }
                },
                currentTeam: 'A'
            });
        }
    };

    return (
        <AnimatedScreen>
            {/* Header */}
            <View style={[styles.header, { flexDirection: rowDirection }]}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                    {t('pyramid.title', language)}
                </Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <MotiView
                    from={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={styles.hero}
                >
                    <View style={[styles.heroIcon, { backgroundColor: colors.brand.gold + '20', borderColor: colors.brand.gold }]}>
                        <Zap size={64} color={colors.brand.gold} fill={colors.brand.gold} />
                    </View>
                    <Text style={[styles.heroDesc, { color: colors.text.secondary }]}>
                        {t('pyramid.description', language)}
                    </Text>
                </MotiView>

                {/* Teams Inputs */}
                <GlassCard style={styles.card}>
                    <View style={[styles.sectionHeader, { flexDirection: rowDirection }]}>
                        <Users size={18} color={colors.brand.gold} style={{ marginHorizontal: 8 }} />
                        <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>
                            {t('common.teams', language) || "TEAMS"}
                        </Text>
                    </View>

                    <PremiumInput
                        label={`${t('pyramid.teamName', language)} A`}
                        placeholder={t('pyramid.enterTeamName', language)}
                        value={teamA}
                        onChangeText={setTeamA}
                    />

                    <PremiumInput
                        label={`${t('pyramid.teamName', language)} B`}
                        placeholder={t('pyramid.enterTeamName', language)}
                        value={teamB}
                        onChangeText={setTeamB}
                    />
                </GlassCard>
            </ScrollView>

            {/* Start Button */}
            <MotiView
                animate={{ translateY: canStart ? 0 : 100, opacity: canStart ? 1 : 0 }}
                style={styles.fab}
            >
                <BeastButton
                    title={t('pyramid.startGame', language)}
                    onPress={startGame}
                    variant="primary"
                    size="lg"
                    icon={Play}
                    style={{ width: '100%' }}
                />
            </MotiView>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: layout.spacing.lg,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    hero: {
        alignItems: 'center',
        marginBottom: layout.spacing.xl,
    },
    heroIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        marginBottom: layout.spacing.md,
        ...layout.shadows.gold,
    },
    heroDesc: {
        textAlign: 'center',
        maxWidth: '80%',
        fontSize: 14,
        lineHeight: 20,
    },
    card: {
        padding: layout.spacing.lg,
    },
    sectionHeader: {
        alignItems: 'center',
        marginBottom: layout.spacing.lg,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
    }
});
