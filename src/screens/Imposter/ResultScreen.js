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

export default function ImposterResultScreen({ navigation, route }) {
    const { imposters, word, players } = route.params;
    const { language, isKurdish } = useLanguage();

    // RTL styles
    const rowDirection = isKurdish ? 'row-reverse' : 'row';

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                <ScrollView contentContainerStyle={styles.content}>

                    <View style={styles.headerIcon}>
                        <Ionicons name="alert-circle" size={64} color={COLORS.accent.danger} />
                    </View>

                    <Text style={[styles.title, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'جاسوسەکە کێ بوو...' : 'The Imposter Was...'}
                    </Text>

                    <View style={[styles.imposterContainer, { flexDirection: rowDirection }]}>
                        {imposters.map((player, index) => (
                            <View key={index} style={styles.imposterTag}>
                                <Text style={[styles.imposterName, isKurdish && styles.kurdishFont]}>
                                    {player}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.divider} />

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
