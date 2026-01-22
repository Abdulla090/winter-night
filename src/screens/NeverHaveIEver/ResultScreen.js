import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../localization/translations';

export default function NeverHaveIEverResultScreen({ navigation, route }) {
    const { players, fingerCounts, statementsUsed } = route.params;
    const { language, isKurdish } = useLanguage();

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
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.winnerBanner, isKurdish && styles.kurdishBorder]}>
                    <Ionicons name="trophy" size={60} color="#FFD700" />
                    <Text style={[styles.winnerLabel, isKurdish && styles.kurdishFont]}>
                        {t('neverHaveIEver.mostInnocent', language)}
                    </Text>
                    <Text style={[styles.winnerName, isKurdish && styles.kurdishFont]}>{winner[0]}</Text>
                    <Text style={[styles.winnerScore, isKurdish && styles.kurdishFont]}>
                        {winner[1]} {t('neverHaveIEver.fingersRemaining', language)}
                    </Text>
                </View>

                {loser && loser[1] < winner[1] && (
                    <View style={[styles.loserBanner, { flexDirection: rowDirection }]}>
                        <Ionicons name="skull" size={32} color={COLORS.accent.danger} />
                        <View style={isKurdish && { alignItems: 'flex-end' }}>
                            <Text style={[styles.loserLabel, isKurdish && styles.kurdishFont]}>
                                {t('neverHaveIEver.mostExperienced', language)}
                            </Text>
                            <Text style={[styles.loserName, isKurdish && styles.kurdishFont]}>{loser[0]}</Text>
                        </View>
                    </View>
                )}

                <Text style={[styles.sectionTitle, isKurdish && { alignSelf: 'flex-end' }, isKurdish && styles.kurdishFont]}>
                    {t('neverHaveIEver.finalStandings', language)}
                </Text>
                <View style={styles.standings}>
                    {sortedPlayers.map(([name, fingers], index) => (
                        <View key={name} style={[styles.standingItem, { flexDirection: rowDirection }]}>
                            <Text style={styles.standingRank}>#{index + 1}</Text>
                            <Text style={[styles.standingName, isKurdish && styles.kurdishFont, { textAlign }]}>{name}</Text>
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

                <View style={[styles.statsCard, { flexDirection: rowDirection }]}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{statementsUsed}</Text>
                        <Text style={[styles.statLabel, isKurdish && styles.kurdishFont]}>
                            {t('neverHaveIEver.statements', language)}
                        </Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{players.length}</Text>
                        <Text style={[styles.statLabel, isKurdish && styles.kurdishFont]}>
                            {t('common.players', language)}
                        </Text>
                    </View>
                </View>

                <View style={[styles.buttonRow, { flexDirection: rowDirection }]}>
                    <Button
                        title={t('common.playAgain', language)}
                        onPress={playAgain}
                        gradient={[COLORS.accent.warning, COLORS.accent.warning]}
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
    content: { padding: SPACING.lg, paddingBottom: 100, alignItems: 'center' },
    winnerBanner: {
        width: '100%',
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        alignItems: 'center',
        marginBottom: SPACING.lg,
        borderWidth: 2,
        borderColor: COLORS.accent.warning,
    },
    winnerLabel: { color: COLORS.accent.warning, ...FONTS.medium, textTransform: 'uppercase', letterSpacing: 2, marginTop: 8 },
    winnerName: { color: COLORS.text.primary, ...FONTS.large, marginTop: 4 },
    winnerScore: { color: COLORS.text.muted, marginTop: 4 },
    loserBanner: {
        width: '100%',
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        marginBottom: SPACING.lg,
    },
    loserLabel: { color: COLORS.text.muted, fontSize: 12 },
    loserName: { color: COLORS.text.primary, ...FONTS.medium },
    sectionTitle: {
        color: COLORS.text.secondary, ...FONTS.medium,
        textTransform: 'uppercase', fontSize: 13, letterSpacing: 1,
        alignSelf: 'flex-start', marginBottom: SPACING.md,
    },
    standings: { width: '100%', marginBottom: SPACING.lg },
    standingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: 8,
    },
    standingRank: { color: COLORS.accent.warning, ...FONTS.bold, width: 30 },
    standingName: { flex: 1, color: COLORS.text.primary, ...FONTS.medium },
    fingerDisplay: { flexDirection: 'row', gap: 2 },
    fingerEmoji: { fontSize: 16 },
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
});
