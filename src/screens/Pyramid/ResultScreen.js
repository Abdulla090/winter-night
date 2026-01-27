import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Trophy, RefreshCw, Home } from 'lucide-react-native';

import { AnimatedScreen, BeastButton, GlassCard } from '../../components';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../localization/translations';
import { layout } from '../../theme/layout';

export default function PyramidResultScreen({ navigation, route }) {
    const { teams } = route.params;
    const { language, isKurdish } = useLanguage();
    const { colors } = useTheme();

    const winner = teams.A.score > teams.B.score ? teams.A : (teams.B.score > teams.A.score ? teams.B : null);
    const isTie = teams.A.score === teams.B.score;

    const playAgain = () => {
        navigation.popToTop();
        navigation.navigate('PyramidSetup');
    };

    const goHome = () => {
        navigation.popToTop();
    };

    return (
        <AnimatedScreen>
            <ScrollView contentContainerStyle={styles.content}>

                {/* Winner Header */}
                <View style={styles.header}>
                    <View style={[styles.iconBox, { backgroundColor: colors.brand.gold + '20' }]}>
                        <Trophy size={60} color={colors.brand.gold} />
                    </View>
                    <Text style={[styles.title, { color: colors.brand.gold }]}>
                        {isTie ? t('common.gameOver', language) : t('common.winnerExclaim', language)}
                    </Text>
                    {!isTie && (
                        <Text style={[styles.winnerName, { color: colors.text.primary }]}>
                            {winner.name}
                        </Text>
                    )}
                </View>

                {/* Score Card */}
                <GlassCard style={styles.scoreCard}>
                    <View style={styles.teamResult}>
                        <Text style={[styles.teamLabel, { color: colors.text.secondary }]}>{teams.A.name}</Text>
                        <Text style={[styles.scoreValue, { color: colors.text.primary }]}>{teams.A.score}</Text>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <View style={styles.teamResult}>
                        <Text style={[styles.teamLabel, { color: colors.text.secondary }]}>{teams.B.name}</Text>
                        <Text style={[styles.scoreValue, { color: colors.text.primary }]}>{teams.B.score}</Text>
                    </View>
                </GlassCard>

                {/* Actions */}
                <View style={styles.actions}>
                    <BeastButton
                        title={t('common.playAgain', language)}
                        onPress={playAgain}
                        icon={RefreshCw}
                        variant="primary"
                        style={{ marginBottom: 12, width: '100%' }}
                    />
                    <BeastButton
                        title={t('common.home', language)}
                        onPress={goHome}
                        icon={Home}
                        variant="ghost"
                        style={{ width: '100%' }}
                    />
                </View>

            </ScrollView>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    content: {
        flexGrow: 1,
        alignItems: 'center',
        padding: layout.spacing.xl,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    iconBox: {
        width: 100, height: 100, borderRadius: 50,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8,
    },
    winnerName: {
        fontSize: 32, fontWeight: '800',
    },
    scoreCard: {
        flexDirection: 'row', width: '100%',
        justifyContent: 'space-around', alignItems: 'center',
        paddingVertical: 30, marginBottom: 50,
    },
    teamResult: {
        alignItems: 'center',
    },
    teamLabel: {
        fontSize: 14, fontWeight: '600', marginBottom: 8,
    },
    scoreValue: {
        fontSize: 40, fontWeight: '800',
    },
    divider: {
        width: 1, height: 60,
    },
    actions: {
        width: '100%',
    }
});
