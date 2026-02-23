import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, Frown, CheckCircle2, XCircle, Skull, User, RefreshCw } from 'lucide-react-native';
import * as Icons from 'lucide-react-native';
import { MotiView } from 'moti';
import { Button } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../localization/translations';

export default function SpyfallResultScreen({ navigation, route }) {
    const { gameData, players, votedPlayer, spyCaught, spyGuessedLocation = false, spyGuessCorrect = false } = route.params;
    const { language, isKurdish } = useLanguage();

    const rowDirection = isKurdish ? 'row-reverse' : 'row';
    const textAlign = isKurdish ? 'right' : 'left';

    const playAgain = () => {
        navigation.popToTop();
        navigation.navigate('SpyfallSetup');
    };

    const goHome = () => {
        navigation.popToTop();
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Result Banner */}
                <MotiView
                    from={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', delay: 100 }}
                    style={[styles.resultBanner, spyCaught ? styles.winBanner : styles.loseBanner]}
                >
                    {spyCaught ? (
                        <Trophy size={60} color="#FFD700" />
                    ) : (
                        <Frown size={60} color={COLORS.text.secondary} />
                    )}
                    <Text style={[styles.resultTitle, isKurdish && styles.kurdishFont, { textAlign: 'center' }]}>
                        {spyGuessedLocation
                            ? (spyGuessCorrect ? (isKurdish ? 'جاسوس شوێنەکەی زانی!' : 'Spy Guessed Correctly!') : (isKurdish ? 'جاسوس هەڵەی کرد!' : 'Spy Guessed Wrong!'))
                            : (spyCaught ? t('spyfall.spyCaught', language) : t('spyfall.spyWins', language))}
                    </Text>
                    <Text style={[styles.resultSubtitle, isKurdish && styles.kurdishFont]}>
                        {spyGuessedLocation
                            ? (spyGuessCorrect ? (isKurdish ? 'جاسوس سەرکەوتوو بوو لە زانینی شوێنەکە.' : 'The spy successfully figured out the location.') : (isKurdish ? 'جاسوس نەیتوانی شوێنەکە بزانێت.' : 'The spy failed to figure out the correct location.'))
                            : (spyCaught
                                ? t('spyfall.spyCaughtDesc', language)
                                : t('spyfall.spyWinsDesc', language))}
                    </Text>
                </MotiView>

                {/* Location Reveal */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', delay: 300 }}
                    style={[styles.locationCard, { flexDirection: rowDirection }]}
                >
                    {(() => {
                        const LocationIcon = Icons[gameData.location.icon] || Icons.HelpCircle;
                        return <LocationIcon size={32} color={COLORS.accent.primary} />;
                    })()}
                    <View style={[styles.locationInfo, isKurdish && { alignItems: 'flex-end' }]}>
                        <Text style={[styles.locationLabel, isKurdish && styles.kurdishFont]}>
                            {t('spyfall.theLocationWas', language)}
                        </Text>
                        <Text style={[styles.locationName, isKurdish && styles.kurdishFont]}>{gameData.location.name}</Text>
                    </View>
                </MotiView>

                {/* Voted Player */}
                {!spyGuessedLocation && (
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'timing', delay: 500 }}
                        style={styles.votedCard}
                    >
                        <Text style={[styles.votedLabel, isKurdish && styles.kurdishFont]}>
                            {t('spyfall.youVotedFor', language)}
                        </Text>
                        <Text style={[styles.votedName, isKurdish && styles.kurdishFont]}>{players[votedPlayer]}</Text>
                        {spyCaught ? (
                            <View style={[styles.correctBadge, { flexDirection: rowDirection }]}>
                                <CheckCircle2 size={20} color="#FFF" />
                                <Text style={[styles.correctText, isKurdish && styles.kurdishFont]}>{t('common.correct', language)}</Text>
                            </View>
                        ) : (
                            <View style={[styles.wrongBadge, { flexDirection: rowDirection }]}>
                                <XCircle size={20} color="#FFF" />
                                <Text style={[styles.wrongText, isKurdish && styles.kurdishFont]}>{t('common.incorrect', language)}</Text>
                            </View>
                        )}
                    </MotiView>
                )}

                {/* All Roles Reveal */}
                <Text style={[styles.sectionTitle, isKurdish && { alignSelf: 'flex-end' }, isKurdish && styles.kurdishFont]}>
                    {t('spyfall.roleReveal', language)}
                </Text>
                <View style={styles.rolesList}>
                    {gameData.playerRoles.map((player, index) => (
                        <MotiView
                            key={index}
                            from={{ opacity: 0, translateX: isKurdish ? 20 : -20 }}
                            animate={{ opacity: 1, translateX: 0 }}
                            transition={{ type: 'spring', delay: 700 + (index * 150) }}
                            style={[
                                styles.roleItem,
                                { flexDirection: rowDirection },
                                player.isSpy && styles.spyRoleItem
                            ]}
                        >
                            <View style={[styles.roleLeft, { flexDirection: rowDirection }]}>
                                {player.isSpy ? (
                                    <Skull size={20} color={COLORS.accent.danger} />
                                ) : (
                                    <User size={20} color={COLORS.accent.primary} />
                                )}
                                <Text style={[styles.roleName, isKurdish && styles.kurdishFont]}>{player.name}</Text>
                            </View>
                            <Text style={[
                                styles.roleValue,
                                player.isSpy && styles.spyRoleValue,
                                isKurdish && styles.kurdishFont
                            ]}>
                                {player.isSpy ? (isKurdish ? 'جاسوس 🕵️' : 'SPY 🕵️') : player.role}
                            </Text>
                        </MotiView>
                    ))}
                </View>

                {/* Action Buttons */}
                <View style={[styles.buttonRow, { flexDirection: rowDirection }]}>
                    <Button
                        title={t('common.playAgain', language)}
                        onPress={playAgain}
                        gradient={[COLORS.accent.success, COLORS.accent.success]}
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
    content: {
        padding: SPACING.lg,
        paddingBottom: 100,
        alignItems: 'center',
    },

    resultBanner: {
        width: '100%',
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    winBanner: {
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        borderWidth: 2,
        borderColor: COLORS.accent.success,
    },
    loseBanner: {
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        borderWidth: 2,
        borderColor: COLORS.accent.danger,
    },
    resultTitle: { color: COLORS.text.primary, ...FONTS.large, marginTop: SPACING.md },
    resultSubtitle: { color: COLORS.text.muted, textAlign: 'center', marginTop: 8 },

    locationCard: {
        width: '100%',
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        marginBottom: SPACING.md,
    },
    locationInfo: { flex: 1 },
    locationLabel: { color: COLORS.text.muted, fontSize: 12 },
    locationName: { color: COLORS.text.primary, ...FONTS.title },

    votedCard: {
        width: '100%',
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    votedLabel: { color: COLORS.text.muted, fontSize: 12, marginBottom: 4 },
    votedName: { color: COLORS.text.primary, ...FONTS.title, marginBottom: SPACING.sm },
    correctBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: COLORS.accent.success,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    correctText: { color: '#FFF', ...FONTS.medium },
    wrongBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: COLORS.accent.danger,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    wrongText: { color: '#FFF', ...FONTS.medium },

    sectionTitle: {
        color: COLORS.text.secondary,
        ...FONTS.medium,
        textTransform: 'uppercase',
        fontSize: 13,
        letterSpacing: 1,
        alignSelf: 'flex-start',
        marginBottom: SPACING.md,
    },

    rolesList: { width: '100%', marginBottom: SPACING.lg },
    roleItem: {
        width: '100%',
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    spyRoleItem: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 1,
        borderColor: COLORS.accent.danger,
    },
    roleLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    roleName: { color: COLORS.text.primary, ...FONTS.medium },
    roleValue: { color: COLORS.text.muted, ...FONTS.medium },
    spyRoleValue: { color: COLORS.accent.danger, fontWeight: '700' },

    buttonRow: {
        flexDirection: 'row',
        width: '100%',
        marginTop: SPACING.md,
    },
    kurdishFont: { fontFamily: 'Rabar' },
});
