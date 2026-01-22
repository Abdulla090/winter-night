import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../localization/translations';

export default function TruthOrDareResultScreen({ navigation, route }) {
    const { players, scores } = route.params;
    const { language, isKurdish } = useLanguage();

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
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Winner Banner */}
                {hasWinner ? (
                    <View style={styles.winnerBanner}>
                        <View style={styles.crown}>
                            <Ionicons name="trophy" size={60} color="#FFD700" />
                        </View>
                        <Text style={[styles.winnerLabel, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'قارەمان' : 'Champion'}
                        </Text>
                        <Text style={[styles.winnerName, isKurdish && styles.kurdishFont]}>{winner[0]}</Text>
                        <Text style={[styles.winnerScore, isKurdish && styles.kurdishFont]}>
                            {isKurdish
                                ? `${winner[1]} چالینج تەواو کرا`
                                : `${winner[1]} challenges completed`
                            }
                        </Text>
                    </View>
                ) : (
                    <View style={styles.noWinnerBanner}>
                        <Ionicons name="game-controller" size={60} color={COLORS.accent.purple} />
                        <Text style={[styles.noWinnerTitle, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'یاری تەواو بوو!' : 'Game Complete!'}
                        </Text>
                        <Text style={[styles.noWinnerText, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'هەموان خۆشیان کرد!' : 'Everyone had fun!'}
                        </Text>
                    </View>
                )}

                {/* Leaderboard */}
                <Text style={[
                    styles.sectionTitle,
                    isKurdish && { alignSelf: 'flex-end' },
                    isKurdish && styles.kurdishFont
                ]}>
                    {isKurdish ? 'ڕیزبەندی کۆتایی' : 'Final Standings'}
                </Text>
                <View style={styles.leaderboard}>
                    {sortedPlayers.map(([name, score], index) => (
                        <View key={name} style={[styles.leaderboardItem, { flexDirection: rowDirection }]}>
                            <View style={styles.rankContainer}>
                                {index < 3 ? (
                                    <Ionicons name="medal" size={24} color={getMedalColor(index)} />
                                ) : (
                                    <Text style={styles.rankNumber}>{index + 1}</Text>
                                )}
                            </View>
                            <Text style={[
                                styles.playerName,
                                isKurdish ? { marginRight: SPACING.sm, marginLeft: 0 } : { marginLeft: SPACING.sm, marginRight: 0 },
                                isKurdish && styles.kurdishFont
                            ]}>
                                {name}
                            </Text>
                            <View style={[styles.scoreContainer, { flexDirection: rowDirection }]}>
                                <Text style={styles.scoreValue}>{score}</Text>
                                <Ionicons name="checkmark-circle" size={16} color={COLORS.accent.success} />
                            </View>
                        </View>
                    ))}
                </View>

                {/* Stats */}
                <View style={[styles.statsCard, { flexDirection: rowDirection }]}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{players.length}</Text>
                        <Text style={[styles.statLabel, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'یاریزان' : 'Players'}
                        </Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                            {Object.values(scores).reduce((a, b) => a + b, 0)}
                        </Text>
                        <Text style={[styles.statLabel, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'تەواوکراو' : 'Completed'}
                        </Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>🔥</Text>
                        <Text style={[styles.statLabel, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'یادەوەری' : 'Memories'}
                        </Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={[styles.buttonRow, { flexDirection: rowDirection }]}>
                    <Button
                        title={t('common.playAgain', language)}
                        onPress={playAgain}
                        gradient={[COLORS.accent.purple, COLORS.accent.purple]}
                        icon={<Ionicons name="refresh" size={20} color="#FFF" />}
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
    container: { flex: 1, backgroundColor: COLORS.background.dark },
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
        borderColor: COLORS.accent.purple,
    },
    crown: { marginBottom: SPACING.sm },
    winnerLabel: {
        color: COLORS.accent.purple,
        ...FONTS.medium,
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 4,
    },
    winnerName: { color: COLORS.text.primary, ...FONTS.large, marginBottom: 8 },
    winnerScore: { color: COLORS.text.muted },

    noWinnerBanner: {
        width: '100%',
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    noWinnerTitle: { color: COLORS.text.primary, ...FONTS.large, marginTop: SPACING.md },
    noWinnerText: { color: COLORS.text.muted, marginTop: 4 },

    sectionTitle: {
        color: COLORS.text.secondary,
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
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: 8,
    },
    rankContainer: {
        width: 40,
        alignItems: 'center',
    },
    rankNumber: { color: COLORS.text.muted, ...FONTS.bold, fontSize: 18 },
    playerName: { flex: 1, color: COLORS.text.primary, ...FONTS.medium },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    scoreValue: { color: COLORS.accent.success, ...FONTS.bold, fontSize: 18 },

    statsCard: {
        width: '100%',
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: SPACING.lg,
    },
    statItem: { alignItems: 'center' },
    statValue: { color: COLORS.text.primary, ...FONTS.large },
    statLabel: { color: COLORS.text.muted, fontSize: 12, marginTop: 4 },
    statDivider: { width: 1, backgroundColor: COLORS.background.border },

    buttonRow: {
        flexDirection: 'row',
        width: '100%',
        marginTop: SPACING.md,
    },
    kurdishFont: { fontFamily: 'Rabar' },
});
