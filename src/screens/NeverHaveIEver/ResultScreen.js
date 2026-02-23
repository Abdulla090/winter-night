import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, Skull, RefreshCw } from 'lucide-react-native';
import { Button } from '../../components';
import { SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../localization/translations';

export default function NeverHaveIEverResultScreen({ navigation, route }) {
    const { players, fingerCounts, statementsUsed } = route.params;
    const { language, isKurdish } = useLanguage();
    const { colors } = useTheme();

    const rowDirection = isKurdish ? 'row-reverse' : 'row';
    const textAlign = isKurdish ? 'right' : 'left';

    const sortedPlayers = Object.entries(fingerCounts)
        .sort(([, a], [, b]) => b - a);

    const winner = sortedPlayers[0];
    const loser = sortedPlayers[sortedPlayers.length - 1];

    const playAgain = () => {
        navigation.popToTop();
        navigation.navigate('NeverHaveIEverSetup');
    };

    const goHome = () => {
        navigation.popToTop();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.winnerBanner, { backgroundColor: colors.brand.warning + '25', borderColor: colors.brand.warning }, isKurdish && styles.kurdishBorder]}>
                    <Trophy size={60} color="#FFD700" />
                    <Text style={[styles.winnerLabel, { color: colors.brand.warning }, isKurdish && styles.kurdishFont]}>
                        {t('neverHaveIEver.mostInnocent', language)}
                    </Text>
                    <Text style={[styles.winnerName, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>{winner[0]}</Text>
                    <Text style={[styles.winnerScore, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                        {winner[1]} {t('neverHaveIEver.fingersRemaining', language)}
                    </Text>
                </View>

                {loser && loser[1] < winner[1] && (
                    <View style={[styles.loserBanner, { backgroundColor: colors.surface }, { flexDirection: rowDirection }]}>
                        <Skull size={32} color={colors.brand.error} />
                        <View style={isKurdish && { alignItems: 'flex-end' }}>
                            <Text style={[styles.loserLabel, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                                {t('neverHaveIEver.mostExperienced', language)}
                            </Text>
                            <Text style={[styles.loserName, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>{loser[0]}</Text>
                        </View>
                    </View>
                )}

                <Text style={[styles.sectionTitle, { color: colors.text.secondary }, isKurdish && { alignSelf: 'flex-end' }, isKurdish && styles.kurdishFont]}>
                    {t('neverHaveIEver.finalStandings', language)}
                </Text>
                <View style={styles.standings}>
                    {sortedPlayers.map(([name, fingers], index) => (
                        <View key={name} style={[styles.standingItem, { backgroundColor: colors.surface }, { flexDirection: rowDirection }]}>
                            <Text style={[styles.standingRank, { color: colors.brand.warning }]}>#{index + 1}</Text>
                            <Text style={[styles.standingName, { color: colors.text.primary }, isKurdish && styles.kurdishFont, { textAlign }]}>{name}</Text>
                            <View style={[styles.fingerDisplay, { flexDirection: rowDirection }]}>
                                {[...Array(5)].map((_, i) => (
                                    <Text key={i} style={styles.fingerEmoji}>
                                        {i < fingers ? '☝️' : '✊'}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>

                <View style={[styles.statsCard, { backgroundColor: colors.surface }, { flexDirection: rowDirection }]}>
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: colors.text.primary }]}>{statementsUsed}</Text>
                        <Text style={[styles.statLabel, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                            {t('neverHaveIEver.statements', language)}
                        </Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: colors.text.primary }]}>{players.length}</Text>
                        <Text style={[styles.statLabel, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                            {t('common.players', language)}
                        </Text>
                    </View>
                </View>

                <View style={[styles.buttonRow, { flexDirection: rowDirection }]}>
                    <Button
                        title={t('common.playAgain', language)}
                        onPress={playAgain}
                        gradient={[colors.brand.warning, colors.brand.warning]}
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
    content: { padding: SPACING.lg, paddingBottom: 100, alignItems: 'center' },
    winnerBanner: {
        width: '100%',
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        alignItems: 'center',
        marginBottom: SPACING.lg,
        borderWidth: 2,
    },
    winnerLabel: { ...FONTS.medium, textTransform: 'uppercase', letterSpacing: 2, marginTop: 8 },
    winnerName: { ...FONTS.large, marginTop: 4 },
    winnerScore: { marginTop: 4 },
    loserBanner: {
        width: '100%',
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        alignItems: 'center',
        gap: SPACING.md,
        marginBottom: SPACING.lg,
    },
    loserLabel: { fontSize: 12 },
    loserName: { ...FONTS.medium },
    sectionTitle: {
        ...FONTS.medium,
        textTransform: 'uppercase', fontSize: 13, letterSpacing: 1,
        marginBottom: SPACING.md,
    },
    standings: { width: '100%', marginBottom: SPACING.lg },
    standingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: 8,
    },
    standingRank: { ...FONTS.bold, width: 30 },
    standingName: { flex: 1, ...FONTS.medium },
    fingerDisplay: { gap: 2 },
    fingerEmoji: { fontSize: 16 },
    statsCard: {
        width: '100%',
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        justifyContent: 'space-around',
        marginBottom: SPACING.lg,
    },
    statItem: { alignItems: 'center' },
    statValue: { ...FONTS.large },
    statLabel: { fontSize: 12, marginTop: 4 },
    statDivider: { width: 1 },
    buttonRow: { width: '100%', marginTop: SPACING.md },
    kurdishFont: { fontFamily: 'Rabar' },
});
