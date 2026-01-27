import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Trophy, RefreshCw, Home, Medal } from 'lucide-react-native';

import { AnimatedScreen, BeastButton, GlassCard } from '../../components';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../localization/translations';
import { layout } from '../../theme/layout';

export default function ResultsScreen({ navigation, route }) {
    const { players, scores } = route.params;
    const { language, isKurdish } = useLanguage();
    const { colors, isRTL } = useTheme();

    const sortedPlayers = [...players].sort((a, b) => (scores[b] || 0) - (scores[a] || 0));
    const winner = sortedPlayers[0];
    const winnerScore = scores[winner] || 0;

    const rowDirection = isRTL ? 'row-reverse' : 'row';
    const alignStyle = isRTL ? 'right' : 'left';

    const getGuessText = (score) => {
        if (isKurdish) return `${score} ${t('common.correctGuess', language)}`;
        return `${score} correct guess${score !== 1 ? 'es' : ''}`;
    };

    return (
        <AnimatedScreen>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Trophy & Winner */}
                <View style={styles.trophyContainer}>
                    <View style={[styles.trophyCircle, { backgroundColor: colors.surface, borderColor: colors.brand.gold }]}>
                        <Trophy size={60} color={colors.brand.gold} />
                    </View>
                </View>

                <Text style={[styles.winnerLabel, { color: colors.brand.gold }]}>
                    {t('common.winnerExclaim', language)}
                </Text>
                <Text style={[styles.winnerName, { color: colors.text.primary }]}>{winner}</Text>
                <Text style={[styles.winnerScore, { color: colors.text.muted }]}>
                    {getGuessText(winnerScore)}
                </Text>

                {/* Scoreboard */}
                <GlassCard style={styles.scoresCard}>
                    <Text style={[styles.scoresTitle, { color: colors.text.secondary }]}>
                        {t('common.finalScores', language)}
                    </Text>

                    {sortedPlayers.map((player, index) => (
                        <View key={player} style={[styles.scoreRow, { flexDirection: rowDirection, borderColor: colors.border }]}>
                            <View style={styles.rankBox}>
                                {index === 0 ? <Medal size={20} color={colors.brand.gold} /> : (
                                    <Text style={[styles.rank, { color: colors.text.muted }]}>#{index + 1}</Text>
                                )}
                            </View>

                            <Text style={[styles.playerName, { color: colors.text.primary, textAlign: alignStyle }]}>
                                {player}
                            </Text>

                            <View style={[styles.scoreBadge, { backgroundColor: colors.surfaceHighlight }]}>
                                <Text style={[styles.score, { color: colors.brand.mountain }]}>{scores[player] || 0}</Text>
                            </View>
                        </View>
                    ))}
                </GlassCard>

                {/* Footer Actions */}
                <View style={styles.footer}>
                    <BeastButton
                        title={t('common.playAgain', language)}
                        onPress={() => navigation.replace('WhoAmISetup')}
                        icon={RefreshCw}
                        variant="primary"
                        style={{ width: '100%', marginBottom: 12 }}
                    />
                    <BeastButton
                        title={t('common.backToHome', language)}
                        onPress={() => navigation.navigate('Home')}
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
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        padding: layout.spacing.xl,
        paddingBottom: 100,
    },
    trophyContainer: {
        marginTop: layout.spacing.xl,
        marginBottom: layout.spacing.lg,
    },
    trophyCircle: {
        width: 120, height: 120, borderRadius: 60,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 3,
        ...layout.shadows.gold,
    },
    winnerLabel: {
        fontSize: 18, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4,
    },
    winnerName: {
        fontSize: 36, fontWeight: '800', marginBottom: 4,
    },
    winnerScore: {
        fontSize: 16, marginBottom: 32,
    },
    scoresCard: {
        width: '100%',
        padding: layout.spacing.lg,
        marginBottom: layout.spacing.xl,
    },
    scoresTitle: {
        textAlign: 'center', fontSize: 14, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16,
    },
    scoreRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 12, borderBottomWidth: 1,
    },
    rankBox: {
        width: 40, alignItems: 'center',
    },
    rank: {
        fontWeight: 'bold',
    },
    playerName: {
        flex: 1, fontSize: 16, fontWeight: '600', paddingHorizontal: 12,
    },
    scoreBadge: {
        paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12,
    },
    score: {
        fontWeight: '800', fontSize: 16,
    },
    footer: {
        width: '100%',
    }
});
