import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Platform } from 'react-native';
import { HelpCircle, Play, Users } from 'lucide-react-native';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';

import { AnimatedScreen, BeastButton, GlassCard, PlayerInput, BackButton } from '../../components';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../localization/translations';
import { layout } from '../../theme/layout';

export default function TwoTruthsSetupScreen({ navigation }) {
    const [players, setPlayers] = useState([]);
    const { language, isKurdish } = useLanguage();
    const { colors, isRTL } = useTheme();

    const canStart = players.length >= 3;
    const rowDirection = isRTL ? 'row-reverse' : 'row';

    const startGame = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const mappedPlayers = players.map(p => ({ ...p, score: 0 }));
        navigation.replace('TwoTruthsInput', { players: mappedPlayers, currentTurn: 0 });
    };

    return (
        <AnimatedScreen>
            {/* Header */}
            <View style={[styles.header, { flexDirection: rowDirection }]}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={[styles.headerTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                    {t('twotruths.title', language)}
                </Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Hero Icon */}
                <MotiView
                    from={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ alignItems: 'center', marginBottom: layout.spacing.lg }}
                >
                    <View style={[styles.heroIcon, { backgroundColor: '#8B5CF620' }]}>
                        <HelpCircle size={48} color="#8B5CF6" strokeWidth={1.5} />
                    </View>
                </MotiView>

                {/* Players Section */}
                <GlassCard style={{ marginBottom: layout.spacing.lg }}>
                    <View style={[styles.sectionHeader, { flexDirection: rowDirection }]}>
                        <Users size={18} color="#8B5CF6" style={{ marginHorizontal: 8 }} />
                        <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                            {t('common.players', language)}
                        </Text>
                    </View>
                    <PlayerInput
                        players={players}
                        setPlayers={setPlayers}
                        minPlayers={3}
                        maxPlayers={8}
                        isKurdish={isKurdish}
                        language={language}
                    />
                </GlassCard>
            </ScrollView>

            {/* Start Button */}
            <MotiView
                animate={{ translateY: canStart ? 0 : 100, opacity: canStart ? 1 : 0 }}
                style={styles.fabContainer}
            >
                <BeastButton
                    title={t('common.start', language)}
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
    header: { alignItems: 'center', justifyContent: 'space-between', marginBottom: layout.spacing.md },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    heroIcon: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
    sectionHeader: { alignItems: 'center', marginBottom: 12 },
    sectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
    fabContainer: { position: 'absolute', bottom: 30, left: 20, right: 20 },
    kurdishFont: { fontFamily: 'Rabar', transform: [{ scale: 1.15 }] },
});
