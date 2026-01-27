import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { ArrowLeft, ArrowRight, Music, Play } from 'lucide-react-native';
import { AnimatedScreen, BeastButton, GlassCard, BackButton } from '../../components';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../localization/translations';
import { layout } from '../../theme/layout';
import { lyricsCategories } from '../../constants/lyricsData';
import { MotiView } from 'moti';

export default function LyricsChallengeSetupScreen({ navigation }) {
    const { colors, isRTL } = useTheme();
    const { language, isKurdish } = useLanguage();

    const handleSelectCategory = (category) => {
        navigation.navigate('LyricsChallengePlay', { category });
    };

    return (
        <AnimatedScreen>
            <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={[styles.headerTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                    {t('lyricsChallenge.title', language)}
                </Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Hero Icon */}
                <MotiView
                    from={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ alignItems: 'center', marginBottom: layout.spacing.xl }}
                >
                    <View style={[styles.heroIconContainer, { backgroundColor: colors.surfaceHighlight }]}>
                        <Music size={48} color={colors.accent} strokeWidth={1.5} />
                    </View>
                </MotiView>

                {/* Instructions */}
                <GlassCard style={{ marginBottom: layout.spacing.xl }}>
                    <Text style={[styles.sectionTitle, { color: colors.accent, marginBottom: 8 }, isKurdish && styles.kurdishFont]}>
                        {t('common.howToPlay', language)}
                    </Text>
                    <Text style={[styles.instructionText, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                        {t('lyricsChallenge.description', language)}
                    </Text>
                </GlassCard>

                {/* Categories */}
                <Text style={[styles.sectionHeader, { color: colors.text.muted, textAlign: isRTL ? 'right' : 'left' }, isKurdish && styles.kurdishFont]}>
                    {isKurdish ? 'جۆرێک هەڵبژێرە' : 'CHOOSE GENRE'}
                </Text>

                <View style={{ gap: layout.spacing.md }}>
                    {lyricsCategories.map((category, index) => (
                        <MotiView
                            key={category.id}
                            from={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            delay={index * 100}
                        >
                            <BeastButton
                                variant="secondary"
                                title={category.title[language]}
                                icon={Music}
                                style={{ justifyContent: isRTL ? 'flex-end' : 'flex-start' }}
                                textStyle={{ fontSize: 16, fontFamily: isKurdish ? 'Rabar' : undefined }}
                                onPress={() => handleSelectCategory(category)}
                            />
                        </MotiView>
                    ))}
                </View>
            </ScrollView>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: layout.spacing.lg,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        paddingBottom: 40,
    },
    heroIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    instructionText: {
        fontSize: 15,
        lineHeight: 22,
    },
    sectionHeader: {
        fontSize: 14,
        uppercase: 'uppercase',
        marginBottom: layout.spacing.md,
        marginTop: layout.spacing.sm,
        letterSpacing: 1,
    },
    kurdishFont: {
        fontFamily: 'Rabar_022',
    }
});
