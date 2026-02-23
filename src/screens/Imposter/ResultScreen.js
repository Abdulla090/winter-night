import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertCircle, Trophy, Skull, CheckCircle2, XCircle } from 'lucide-react-native';
import { MotiView } from 'moti';
import { GradientBackground, Button } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../localization/translations';

export default function ImposterResultScreen({ navigation, route }) {
    const { imposters, word, players, votedPlayer, isCaught } = route.params;
    const { language, isKurdish } = useLanguage();

    // RTL styles
    const rowDirection = isKurdish ? 'row-reverse' : 'row';

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                <ScrollView contentContainerStyle={styles.content}>

                    {/* Result Banner */}
                    <MotiView
                        from={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', delay: 100 }}
                        style={[styles.resultBanner, isCaught ? styles.winBanner : styles.loseBanner]}
                    >
                        {isCaught ? (
                            <Trophy size={60} color="#FFD700" />
                        ) : (
                            <Skull size={60} color={COLORS.accent.danger} />
                        )}
                        <Text style={[styles.resultTitle, isKurdish && styles.kurdishFont]}>
                            {isCaught
                                ? (isKurdish ? 'جاسوس دۆزرایەوە!' : 'Imposter Caught!')
                                : (isKurdish ? 'جاسوس سەرکەوت!' : 'Imposter Escaped!')}
                        </Text>
                        <Text style={[styles.resultSubtitle, isKurdish && styles.kurdishFont]}>
                            {isCaught
                                ? (isKurdish ? 'ئێوە توانیتان جاسوسەکە بدۆزنەوە.' : 'You successfully found the imposter.')
                                : (isKurdish ? 'کەسێکی بێتاوانتان دەرکرد، جاسوسەکە سەرکەوت!' : 'An innocent person was voted out. Imposter wins!')}
                        </Text>
                    </MotiView>

                    {/* Voted Player Info */}
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'timing', delay: 300 }}
                        style={styles.votedCard}
                    >
                        <Text style={[styles.votedLabel, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'دەنگتان دا بۆ:' : 'You voted for:'}
                        </Text>
                        <Text style={[styles.votedName, isKurdish && styles.kurdishFont]}>{votedPlayer}</Text>
                        {isCaught ? (
                            <View style={[styles.correctBadge, { flexDirection: rowDirection }]}>
                                <CheckCircle2 size={20} color="#FFF" />
                                <Text style={[styles.correctText, isKurdish && styles.kurdishFont]}>
                                    {isKurdish ? 'ڕاستە' : 'Correct'}
                                </Text>
                            </View>
                        ) : (
                            <View style={[styles.wrongBadge, { flexDirection: rowDirection }]}>
                                <XCircle size={20} color="#FFF" />
                                <Text style={[styles.wrongText, isKurdish && styles.kurdishFont]}>
                                    {isKurdish ? 'هەڵەیە' : 'Incorrect'}
                                </Text>
                            </View>
                        )}
                    </MotiView>

                    <MotiView
                        from={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 500 }}
                        style={{ width: '100%', alignItems: 'center' }}
                    >
                        <Text style={[styles.title, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'جاسوسەکە کێ بوو...' : 'The Imposter Was...'}
                        </Text>

                        <View style={[styles.imposterContainer, { flexDirection: rowDirection }]}>
                            {imposters.map((player, index) => (
                                <MotiView
                                    key={index}
                                    from={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: 'spring', delay: 700 + (index * 150) }}
                                    style={styles.imposterTag}
                                >
                                    <Text style={[styles.imposterName, isKurdish && styles.kurdishFont]}>
                                        {player}
                                    </Text>
                                </MotiView>
                            ))}
                        </View>
                    </MotiView>

                    <View style={styles.divider} />

                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 1000 }}
                        style={{ width: '100%', alignItems: 'center' }}
                    >
                        <Text style={[styles.wordLabel, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'وشەی نهێنی' : 'The Secret Word'}
                        </Text>
                        <View style={styles.wordBox}>
                            <Text style={[styles.wordText, isKurdish && styles.kurdishFont]}>
                                {word?.word}
                            </Text>
                            <Text style={[styles.wordHint, isKurdish && styles.kurdishFont]}>
                                {word?.hint}
                            </Text>
                        </View>
                    </MotiView>

                    {/* Buttons inside scroll */}
                    <View style={{ marginTop: SPACING.xl, width: '100%' }}>
                        <Button
                            title={t('common.playAgain', language)}
                            onPress={() => navigation.navigate('ImposterSetup')}
                            gradient={[COLORS.accent.primary, COLORS.accent.primary]}
                            style={{ marginBottom: 12 }}
                            isKurdish={isKurdish}
                        />
                        <Button
                            title={t('common.backToHome', language)}
                            onPress={() => navigation.navigate('Home')}
                            variant="secondary"
                            isKurdish={isKurdish}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: {
        padding: SPACING.xl, alignItems: 'center', paddingTop: SPACING.xxl, paddingBottom: 100, flexGrow: 1,
    },

    headerIcon: { marginBottom: SPACING.lg },

    title: {
        color: COLORS.text.primary, ...FONTS.title, fontSize: 32,
        textAlign: 'center', marginBottom: SPACING.xl,
    },

    imposterContainer: {
        flexDirection: 'row', flexWrap: 'wrap',
        justifyContent: 'center', gap: SPACING.md,
        marginBottom: SPACING.xl,
        width: '100%',
    },
    imposterTag: {
        backgroundColor: COLORS.accent.danger,
        paddingVertical: 12, paddingHorizontal: 24,
        borderRadius: BORDER_RADIUS.md,
        minWidth: 120, alignItems: 'center',
    },
    imposterName: {
        color: '#FFF', ...FONTS.bold, fontSize: 18,
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
    resultTitle: { color: COLORS.text.primary, ...FONTS.large, marginTop: SPACING.md, textAlign: 'center' },
    resultSubtitle: { color: COLORS.text.muted, textAlign: 'center', marginTop: 8 },

    votedCard: {
        width: '100%',
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        alignItems: 'center',
        marginBottom: SPACING.xl,
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

    divider: {
        height: 1, width: '100%', backgroundColor: COLORS.background.border,
        marginVertical: SPACING.xl,
    },

    wordLabel: {
        color: COLORS.text.secondary, textTransform: 'uppercase', letterSpacing: 1,
        marginBottom: SPACING.md,
    },

    wordBox: {
        width: '100%', alignItems: 'center',
        backgroundColor: COLORS.background.card,
        padding: SPACING.xl, borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1, borderColor: COLORS.accent.primary,
    },
    wordText: {
        color: COLORS.text.primary, ...FONTS.large, fontSize: 32, marginBottom: 8,
    },
    wordHint: {
        color: COLORS.text.muted,
    },

    footer: { padding: SPACING.lg },
    kurdishFont: { fontFamily: 'Rabar' },
});
