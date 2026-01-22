import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../localization/translations';

export default function SpyfallResultScreen({ navigation, route }) {
    const { gameData, players, votedPlayer, spyCaught } = route.params;
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
                <View style={[styles.resultBanner, spyCaught ? styles.winBanner : styles.loseBanner]}>
                    <Ionicons
                        name={spyCaught ? "trophy" : "sad"}
                        size={60}
                        color={spyCaught ? "#FFD700" : COLORS.text.secondary}
                    />
                    <Text style={[styles.resultTitle, isKurdish && styles.kurdishFont]}>
                        {spyCaught ? t('spyfall.spyCaught', language) : t('spyfall.spyWins', language)}
                    </Text>
                    <Text style={[styles.resultSubtitle, isKurdish && styles.kurdishFont]}>
                        {spyCaught
                            ? t('spyfall.spyCaughtDesc', language)
                            : t('spyfall.spyWinsDesc', language)}
                    </Text>
                </View>

                {/* Location Reveal */}
                <View style={[styles.locationCard, { flexDirection: rowDirection }]}>
                    <Ionicons name={gameData.location.icon} size={32} color={COLORS.accent.primary} />
                    <View style={[styles.locationInfo, isKurdish && { alignItems: 'flex-end' }]}>
                        <Text style={[styles.locationLabel, isKurdish && styles.kurdishFont]}>
                            {t('spyfall.theLocationWas', language)}
                        </Text>
                        <Text style={[styles.locationName, isKurdish && styles.kurdishFont]}>{gameData.location.name}</Text>
                    </View>
                </View>

                {/* Voted Player */}
                <View style={styles.votedCard}>
                    <Text style={[styles.votedLabel, isKurdish && styles.kurdishFont]}>
                        {t('spyfall.youVotedFor', language)}
                    </Text>
                    <Text style={[styles.votedName, isKurdish && styles.kurdishFont]}>{players[votedPlayer]}</Text>
                    {spyCaught ? (
                        <View style={[styles.correctBadge, { flexDirection: rowDirection }]}>
                            <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                            <Text style={[styles.correctText, isKurdish && styles.kurdishFont]}>{t('common.correct', language)}</Text>
                        </View>
                    ) : (
                        <View style={[styles.wrongBadge, { flexDirection: rowDirection }]}>
                            <Ionicons name="close-circle" size={20} color="#FFF" />
                            <Text style={[styles.wrongText, isKurdish && styles.kurdishFont]}>{t('common.incorrect', language)}</Text>
                        </View>
                    )}
                </View>

                {/* All Roles Reveal */}
                <Text style={[styles.sectionTitle, isKurdish && { alignSelf: 'flex-end' }, isKurdish && styles.kurdishFont]}>
                    {t('spyfall.roleReveal', language)}
                </Text>
                <View style={styles.rolesList}>
                    {gameData.playerRoles.map((player, index) => (
                        <View
                            key={index}
                            style={[
                                styles.roleItem,
                                { flexDirection: rowDirection },
                                player.isSpy && styles.spyRoleItem
                            ]}
                        >
                            <View style={[styles.roleLeft, { flexDirection: rowDirection }]}>
                                <Ionicons
                                    name={player.isSpy ? "skull" : "person"}
                                    size={20}
                                    color={player.isSpy ? COLORS.accent.danger : COLORS.accent.primary}
                                />
                                <Text style={[styles.roleName, isKurdish && styles.kurdishFont]}>{player.name}</Text>
                            </View>
                            <Text style={[
                                styles.roleValue,
                                player.isSpy && styles.spyRoleValue,
                                isKurdish && styles.kurdishFont
                            ]}>
                                {player.isSpy ? (isKurdish ? 'جاسوس 🕵️' : 'SPY 🕵️') : player.role}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Action Buttons */}
                <View style={[styles.buttonRow, { flexDirection: rowDirection }]}>
                    <Button
                        title={t('common.playAgain', language)}
                        onPress={playAgain}
                        gradient={[COLORS.accent.success, COLORS.accent.success]}
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
