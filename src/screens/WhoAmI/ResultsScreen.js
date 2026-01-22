import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground, Button } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../localization/translations';

export default function ResultsScreen({ navigation, route }) {
    const { players, scores } = route.params;
    const { language, isKurdish } = useLanguage();

    // Sort players by score
    const sortedPlayers = [...players].sort((a, b) => (scores[b] || 0) - (scores[a] || 0));
    const winner = sortedPlayers[0];
    const winnerScore = scores[winner] || 0;

    // RTL styles
    const rtlStyles = {
        textAlign: isKurdish ? 'right' : 'left',
        writingDirection: isKurdish ? 'rtl' : 'ltr',
    };
    const rowDirection = isKurdish ? 'row-reverse' : 'row';

    // Get correct guess text based on language and count
    const getGuessText = (score) => {
        if (isKurdish) {
            return `${score} ${t('common.correctGuess', language)}`;
        }
        return `${score} correct guess${score !== 1 ? 'es' : ''}`;
    };

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Trophy */}
                    <View style={styles.trophyContainer}>
                        <View style={styles.trophyCircle}>
                            <Ionicons name="trophy" size={60} color={COLORS.accent.warning} />
                        </View>
                    </View>

                    {/* Winner */}
                    <Text style={[styles.winnerLabel, isKurdish && styles.kurdishFont]}>
                        {t('common.winnerExclaim', language)}
                    </Text>
                    <Text style={[styles.winnerName, isKurdish && styles.kurdishFont]}>{winner}</Text>
                    <Text style={[styles.winnerScore, isKurdish && styles.kurdishFont]}>
                        {getGuessText(winnerScore)}
                    </Text>

                    {/* All Scores */}
                    <View style={styles.scoresContainer}>
                        <Text style={[styles.scoresTitle, isKurdish && styles.kurdishFont]}>
                            {t('common.finalScores', language)}
                        </Text>

                        {sortedPlayers.map((player, index) => (
                            <View key={player} style={[styles.scoreRow, { flexDirection: rowDirection }]}>
                                <View style={styles.rankContainer}>
                                    <Text style={[
                                        styles.rank,
                                        index === 0 && styles.rankFirst,
                                    ]}>
                                        #{index + 1}
                                    </Text>
                                </View>
                                <Text style={[styles.playerName, rtlStyles, isKurdish && styles.kurdishFont]}>
                                    {player}
                                </Text>
                                <View style={styles.scoreContainer}>
                                    <Text style={styles.score}>{scores[player] || 0}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Buttons inside scroll */}
                    <View style={styles.footer}>
                        <Button
                            title={t('common.playAgain', language)}
                            onPress={() => navigation.replace('WhoAmISetup')}
                            gradient={[COLORS.games.whoAmI, COLORS.games.whoAmI]}
                            isKurdish={isKurdish}
                        />
                        <Button
                            title={t('common.backToHome', language)}
                            onPress={() => navigation.navigate('Home')}
                            variant="secondary"
                            style={styles.secondaryButton}
                            isKurdish={isKurdish}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.xl,
        alignItems: 'center',
        paddingBottom: SPACING.xxl,
        flexGrow: 1,
        paddingBottom: 100,
    },
    trophyContainer: {
        marginTop: SPACING.xl,
        marginBottom: SPACING.lg,
    },
    trophyCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.background.card,
        borderWidth: 3,
        borderColor: COLORS.accent.warning,
    },
    winnerLabel: {
        color: COLORS.accent.warning,
        ...FONTS.medium,
        fontSize: 18,
    },
    winnerName: {
        color: COLORS.text.primary,
        ...FONTS.title,
        fontSize: 36,
        marginBottom: SPACING.xs,
    },
    winnerScore: {
        color: COLORS.text.secondary,
        ...FONTS.regular,
        marginBottom: SPACING.xl,
    },
    scoresContainer: {
        width: '100%',
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
    },
    scoresTitle: {
        color: COLORS.text.secondary,
        ...FONTS.medium,
        marginBottom: SPACING.md,
        textAlign: 'center',
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    rankContainer: {
        width: 40,
    },
    rank: {
        color: COLORS.text.muted,
        ...FONTS.bold,
    },
    rankFirst: {
        color: COLORS.accent.warning,
    },
    playerName: {
        flex: 1,
        color: COLORS.text.primary,
        ...FONTS.medium,
    },
    scoreContainer: {
        backgroundColor: COLORS.background.secondary,
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.md,
        borderRadius: BORDER_RADIUS.sm,
    },
    score: {
        color: COLORS.accent.success,
        ...FONTS.bold,
    },
    footer: {
        marginTop: SPACING.xl,
        width: '100%',
        gap: SPACING.sm,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
    },
    kurdishFont: {
        fontFamily: 'Rabar',
    },
});
