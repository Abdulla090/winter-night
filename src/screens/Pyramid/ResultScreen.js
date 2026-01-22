import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../localization/translations';

export default function PyramidResultScreen({ navigation, route }) {
    const { teams } = route.params;
    const { language, isKurdish } = useLanguage();

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
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.winnerBanner}>
                    <Ionicons name="trophy" size={60} color={COLORS.games.pyramid} />
                    <Text style={[styles.title, isKurdish && styles.kurdishFont]}>
                        {isTie ? t('common.gameOver', language) : t('common.winnerExclaim', language)}
                    </Text>
                    {!isTie && (
                        <Text style={[styles.winnerName, isKurdish && styles.kurdishFont]}>
                            {winner.name}
                        </Text>
                    )}
                </View>

                <View style={styles.scoreContainer}>
                    <View style={styles.teamResult}>
                        <Text style={[styles.scoreLabel, isKurdish && styles.kurdishFont]}>{teams.A.name}</Text>
                        <Text style={styles.scoreValue}>{teams.A.score}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.teamResult}>
                        <Text style={[styles.scoreLabel, isKurdish && styles.kurdishFont]}>{teams.B.name}</Text>
                        <Text style={styles.scoreValue}>{teams.B.score}</Text>
                    </View>
                </View>

                <View style={styles.buttons}>
                    <Button
                        title={t('common.playAgain', language)}
                        onPress={playAgain}
                        gradient={[COLORS.games.pyramid, '#b45309']}
                        icon={<Ionicons name="refresh" size={20} color="#FFF" />}
                        style={{ marginBottom: SPACING.md }}
                        isKurdish={isKurdish}
                    />
                    <Button
                        title={t('common.home', language)}
                        onPress={goHome}
                        variant="secondary"
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
        flexGrow: 1,
        alignItems: 'center',
        padding: SPACING.xl,
        justifyContent: 'center',
    },
    winnerBanner: {
        alignItems: 'center',
        marginBottom: SPACING.xxl,
    },
    title: {
        color: COLORS.games.pyramid,
        ...FONTS.large,
        marginTop: SPACING.md,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    winnerName: {
        color: COLORS.text.primary,
        ...FONTS.title,
        fontSize: 32,
        marginTop: SPACING.sm,
    },
    scoreContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        width: '100%',
        justifyContent: 'space-around',
        marginBottom: SPACING.xxl,
        borderWidth: 1,
        borderColor: COLORS.background.border,
    },
    teamResult: {
        alignItems: 'center',
    },
    scoreLabel: {
        color: COLORS.text.secondary,
        ...FONTS.medium,
        marginBottom: 8,
    },
    scoreValue: {
        color: COLORS.text.primary,
        ...FONTS.large,
        fontSize: 40,
    },
    divider: {
        width: 1,
        backgroundColor: COLORS.background.border,
    },
    buttons: {
        width: '100%',
    },
    kurdishFont: { fontFamily: 'Rabar' },
});
