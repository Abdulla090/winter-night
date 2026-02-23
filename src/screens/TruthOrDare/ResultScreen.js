import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, Gamepad2, Medal, CheckCircle2, RefreshCw } from 'lucide-react-native';
import { Button } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../localization/translations';

export default function TruthOrDareResultScreen({ navigation, route }) {
    const { players, scores } = route.params;
    const { language, isKurdish } = useLanguage();
    const { colors } = useTheme();

    // Sort players by score
    const sortedPlayers = Object.entries(scores)
        .sort(([, a], [, b]) => b - a);

    const winner = sortedPlayers[0];
    const hasWinner = winner && winner[1] > 0;

    // RTL styles
    const rowDirection = isKurdish ? 'row-reverse' : 'row';

    const playAgain = () => {
        navigation.popToTop();
        navigation.navigate('TruthOrDareSetup');
    };

    const goHome = () => {
        navigation.popToTop();
    };

    const getMedalColor = (index) => {
        switch (index) {
            case 0: return '#FFD700';
            case 1: return '#C0C0C0';
            case 2: return '#CD7F32';
            default: return COLORS.text.muted;
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Winner Banner */}
                {hasWinner ? (
                    <View style={[styles.winnerBanner, { borderColor: colors.brand.primary }]}>
                        <View style={styles.crown}>
                            <Trophy size={60} color="#FFD700" />
                        </View>
                        <Text style={[styles.winnerLabel, { color: colors.brand.primary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'قارەمان' : 'Champion'}
                        </Text>
                        <Text style={[styles.winnerName, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>{winner[0]}</Text>
                        <Text style={[styles.winnerScore, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish
                                ? `${winner[1]} چالینج تەواو کرا`
                                : `${winner[1]} challenges completed`
                            }
                        </Text>
                    </View>
                ) : (
                    <View style={[styles.noWinnerBanner, { backgroundColor: colors.surface }]}>
                        <Gamepad2 size={60} color={colors.brand.primary} />
                        <Text style={[styles.noWinnerTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'یاری تەواو بوو!' : 'Game Complete!'}
                        </Text>
                        <Text style={[styles.noWinnerText, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'هەموان خۆشیان کرد!' : 'Everyone had fun!'}
                        </Text>
                    </View>
                )}

                {/* Leaderboard */}
                <Text style={[
                    styles.sectionTitle,
                    { color: colors.text.muted },
                    isKurdish && { alignSelf: 'flex-end' },
                    isKurdish && styles.kurdishFont
                ]}>
                    {isKurdish ? 'ڕیزبەندی کۆتایی' : 'Final Standings'}
                </Text>
                <View style={styles.leaderboard}>
                    {sortedPlayers.map(([name, score], index) => (
                        <View key={name} style={[styles.leaderboardItem, { backgroundColor: colors.surface, flexDirection: rowDirection }]}>
                            <View style={styles.rankContainer}>
                                {index < 3 ? (
                                    <Medal size={24} color={getMedalColor(index)} />
                                ) : (
                                    <Text style={[styles.rankNumber, { color: colors.text.muted }]}>{index + 1}</Text>
                                )}
                            </View>
                            <Text style={[
                                styles.playerName,
                                { color: colors.text.primary },
                                isKurdish ? { marginRight: SPACING.sm, marginLeft: 0 } : { marginLeft: SPACING.sm, marginRight: 0 },
                                isKurdish && styles.kurdishFont
                            ]}>
                                {name}
                            </Text>
                            <View style={[styles.scoreContainer, { flexDirection: rowDirection }]}>
                                <Text style={[styles.scoreValue, { color: colors.brand.success }]}>{score}</Text>
                                <CheckCircle2 size={16} color={colors.brand.success} />
                            </View>
                        </View>
                    ))}
                </View>

                {/* Stats */}
                <View style={[styles.statsCard, { backgroundColor: colors.surface, flexDirection: rowDirection }]}>
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: colors.text.primary }]}>{players.length}</Text>
                        <Text style={[styles.statLabel, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'یاریزان' : 'Players'}
                        </Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: colors.text.primary }]}>
                            {Object.values(scores).reduce((a, b) => a + b, 0)}
                        </Text>
                        <Text style={[styles.statLabel, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'تەواوکراو' : 'Completed'}
                        </Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: colors.text.primary }]}>🔥</Text>
                        <Text style={[styles.statLabel, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'یادەوەری' : 'Memories'}
                        </Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={[styles.buttonRow, { flexDirection: rowDirection }]}>
                    <Button
                        title={t('common.playAgain', language)}
                        onPress={playAgain}
                        gradient={[colors.brand.primary, colors.brand.primary]}
                        icon={<RefreshCw size={20} color="#FFF" />}
                        style={{ flex: 1, marginRight: isKurdish ? 0 : 8, marginLeft: isKurdish ? 8 : 0 }}
                        isKurdish={isKurdish}
                    />
                    <Button
                        title={t('common.home', language)}
                        onPress={goHome}
                        variant="secondary"
                        style={{ flex: 1, marginLeft: isKurdish ? 0 : 8, marginRight: isKurdish ? 8 : 0 }}
                        isKurdish={isKurdish}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: {
        padding: SPACING.lg,
        paddingBottom: 100,
        alignItems: 'center',
    },

    winnerBanner: {
        width: '100%',
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        alignItems: 'center',
        marginBottom: SPACING.lg,
        borderWidth: 2,
    },
    crown: { marginBottom: SPACING.sm },
    winnerLabel: {
        ...FONTS.medium,
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 4,
    },
    winnerName: { ...FONTS.large, marginBottom: 8 },
    winnerScore: {},

    noWinnerBanner: {
        width: '100%',
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    noWinnerTitle: { ...FONTS.large, marginTop: SPACING.md },
    noWinnerText: { marginTop: 4 },

    sectionTitle: {
        ...FONTS.medium,
        textTransform: 'uppercase',
        fontSize: 13,
        letterSpacing: 1,
        alignSelf: 'flex-start',
        marginBottom: SPACING.md,
    },

    leaderboard: { width: '100%', marginBottom: SPACING.lg },
    leaderboardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: 8,
    },
    rankContainer: {
        width: 40,
        alignItems: 'center',
    },
    rankNumber: { ...FONTS.bold, fontSize: 18 },
    playerName: { flex: 1, ...FONTS.medium },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    scoreValue: { ...FONTS.bold, fontSize: 18 },

    statsCard: {
        width: '100%',
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: SPACING.lg,
    },
    statItem: { alignItems: 'center' },
    statValue: { ...FONTS.large },
    statLabel: { fontSize: 12, marginTop: 4 },
    statDivider: { width: 1 },

    buttonRow: {
        flexDirection: 'row',
        width: '100%',
        marginTop: SPACING.md,
    },
    kurdishFont: { fontFamily: 'Rabar' },
});
