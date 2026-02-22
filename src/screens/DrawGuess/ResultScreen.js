import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, Medal, Paintbrush, RefreshCw } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { Button } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../localization/translations';

export default function DrawGuessResultScreen({ navigation, route }) {
    const { players, scores, rounds } = route.params;
    const { language, isKurdish } = useLanguage();

    const rowDirection = isKurdish ? 'row-reverse' : 'row';
    const textAlign = isKurdish ? 'right' : 'left';

    const sortedPlayers = Object.entries(scores).sort(([, a], [, b]) => b - a);
    const winner = sortedPlayers[0];

    const playAgain = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        navigation.popToTop();
        navigation.navigate('DrawGuessSetup');
    };

    const goHome = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
                <View style={[styles.winnerBanner, isKurdish && styles.kurdishBorder]}>
                    <Trophy size={60} color="#FFD700" />
                    <Text style={[styles.winnerLabel, isKurdish && styles.kurdishFont]}>
                        {t('drawGuess.bestArtist', language)}
                    </Text>
                    <Text style={[styles.winnerName, isKurdish && styles.kurdishFont]}>{winner[0]}</Text>
                    <Text style={[styles.winnerScore, isKurdish && styles.kurdishFont]}>
                        {winner[1]} {t('common.correctGuesses', language)}
                    </Text>
                </View>

                <Text style={[styles.sectionTitle, isKurdish && { alignSelf: 'flex-end' }, isKurdish && styles.kurdishFont]}>
                    {t('neverHaveIEver.finalStandings', language)}
                </Text>
                <View style={styles.leaderboard}>
                    {sortedPlayers.map(([name, score], index) => (
                        <View key={name} style={[styles.leaderboardItem, { flexDirection: rowDirection }]}>
                            <View style={styles.rankContainer}>
                                {index < 3 ? (
                                    <Medal size={24} color={getMedalColor(index)} />
                                ) : (
                                    <Text style={styles.rankNumber}>{index + 1}</Text>
                                )}
                            </View>
                            <Text style={[styles.playerName, isKurdish && styles.kurdishFont, { textAlign }]}>{name}</Text>
                            <View style={[styles.scoreContainer, { flexDirection: rowDirection }]}>
                                <Text style={styles.scoreValue}>{score}</Text>
                                <Paintbrush size={16} color={COLORS.accent.info} />
                            </View>
                        </View>
                    ))}
                </View>

                <View style={[styles.statsCard, { flexDirection: rowDirection }]}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{rounds}</Text>
                        <Text style={[styles.statLabel, isKurdish && styles.kurdishFont]}>
                            {t('common.round', language)}
                        </Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{players.length}</Text>
                        <Text style={[styles.statLabel, isKurdish && styles.kurdishFont]}>
                            {t('common.players', language)}
                        </Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>🎨</Text>
                        <Text style={[styles.statLabel, isKurdish && styles.kurdishFont]}>
                            {t('drawGuess.art', language)}
                        </Text>
                    </View>
                </View>

                <View style={[styles.buttonRow, { flexDirection: rowDirection }]}>
                    <Button
                        title={t('common.playAgain', language)}
                        onPress={playAgain}
                        gradient={[COLORS.accent.info, COLORS.accent.info]}
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
    container: { flex: 1, backgroundColor: COLORS.background.dark },
    content: { padding: SPACING.lg, paddingBottom: 100, alignItems: 'center' },
    winnerBanner: {
        width: '100%',
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        alignItems: 'center',
        marginBottom: SPACING.lg,
        borderWidth: 2,
        borderColor: COLORS.accent.info,
    },
    winnerLabel: { color: COLORS.accent.info, ...FONTS.medium, textTransform: 'uppercase', letterSpacing: 2, marginTop: 8 },
    winnerName: { color: COLORS.text.primary, ...FONTS.large, marginTop: 4 },
    winnerScore: { color: COLORS.text.muted, marginTop: 4 },
    sectionTitle: {
        color: COLORS.text.secondary, ...FONTS.medium,
        textTransform: 'uppercase', fontSize: 13, letterSpacing: 1,
        alignSelf: 'flex-start', marginBottom: SPACING.md,
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
    rankContainer: { width: 40, alignItems: 'center' },
    rankNumber: { color: COLORS.text.muted, ...FONTS.bold, fontSize: 18 },
    playerName: { flex: 1, color: COLORS.text.primary, ...FONTS.medium },
    scoreContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    scoreValue: { color: COLORS.accent.info, ...FONTS.bold, fontSize: 18 },
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
    buttonRow: { flexDirection: 'row', width: '100%', marginTop: SPACING.md },
    kurdishFont: { fontFamily: 'Rabar' },
    kurdishBorder: { borderColor: COLORS.accent.info },
});
