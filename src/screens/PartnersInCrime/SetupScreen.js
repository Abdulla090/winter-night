import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Users, Play, Heart, Star, Briefcase, Smile } from 'lucide-react-native';
import { AnimatedScreen, BeastButton, GlassCard, BackButton } from '../../components';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../localization/translations';
import { layout } from '../../theme/layout';
import { partnersData } from '../../constants/partnersData';
import { MotiView } from 'moti';

// Map icon string to Lucide component if needed, or update data source.
// Assuming partnersData has icon strings, we might need a mapper or update data.
// For now, I'll use a generic mapper or just render text/emoji from data if provided.
// Actually, let's use Lucide icons for categories if possible.
const getIcon = (id, color) => {
    const props = { size: 24, color };
    switch (id) {
        case 'couples': return <Heart {...props} />;
        case 'friends': return <Smile {...props} />;
        case 'work': return <Briefcase {...props} />;
        default: return <Star {...props} />;
    }
};

export default function PartnersSetupScreen({ navigation }) {
    const { colors, isRTL } = useTheme();
    const { language, isKurdish } = useLanguage();

    const [player1, setPlayer1] = useState('');
    const [player2, setPlayer2] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(partnersData[0]);

    const handleStart = () => {
        if (!player1.trim() || !player2.trim()) return;

        navigation.navigate('PartnersInCrimePlay', {
            p1Name: player1,
            p2Name: player2,
            category: selectedCategory,
        });
    };

    return (
        <AnimatedScreen>
            <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={[styles.headerTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                    {t('partners.title', language)}
                </Text>
                <View style={{ width: 48 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Instructions */}
                <MotiView
                    from={{ opacity: 0, translateY: -20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 400 }}
                >
                    <GlassCard style={{ marginBottom: layout.spacing.xl }}>
                        <Text style={[styles.sectionTitle, { color: colors.accent, marginBottom: 8 }, isKurdish && styles.kurdishFont]}>
                            {t('common.howToPlay', language)}
                        </Text>
                        <Text style={[styles.instructionText, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                            {t('partners.description', language)}
                        </Text>
                    </GlassCard>
                </MotiView>

                {/* Names */}
                <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <Users size={16} color={colors.text.muted} style={{ marginRight: isRTL ? 0 : 8, marginLeft: isRTL ? 8 : 0 }} />
                    <Text style={[styles.sectionHeaderText, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'ناوەکان' : 'NAMES'}
                    </Text>
                </View>

                <View style={{ gap: layout.spacing.md, marginBottom: layout.spacing.xl }}>
                    <View>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                    color: colors.text.primary,
                                    textAlign: isRTL ? 'right' : 'left'
                                },
                                isKurdish && styles.kurdishFont
                            ]}
                            value={player1}
                            onChangeText={setPlayer1}
                            placeholder={isKurdish ? 'ناوی یەکەم' : 'Player 1 Name'}
                            placeholderTextColor={colors.text.muted}
                        />
                    </View>
                    <View>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                    color: colors.text.primary,
                                    textAlign: isRTL ? 'right' : 'left'
                                },
                                isKurdish && styles.kurdishFont
                            ]}
                            value={player2}
                            onChangeText={setPlayer2}
                            placeholder={isKurdish ? 'ناوی دووەم' : 'Player 2 Name'}
                            placeholderTextColor={colors.text.muted}
                        />
                    </View>
                </View>

                {/* Category */}
                <Text style={[styles.sectionHeader, { color: colors.text.muted, textAlign: isRTL ? 'right' : 'left' }, isKurdish && styles.kurdishFont]}>
                    {isKurdish ? 'پرسیارەکان' : 'QUESTIONS'}
                </Text>

                <View style={styles.categoriesGrid}>
                    {partnersData.map((cat, index) => {
                        const isSelected = selectedCategory.id === cat.id;
                        return (
                            <MotiView
                                key={cat.id}
                                from={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'spring', delay: index * 100 }}
                                style={{ width: '48%' }}
                            >
                                <TouchableOpacity
                                    onPress={() => setSelectedCategory(cat)}
                                    activeOpacity={0.8}
                                >
                                    <GlassCard
                                        style={[
                                            styles.categoryCard,
                                            isSelected && { borderColor: colors.accent, borderWidth: 1, backgroundColor: colors.accent + '20' }
                                        ]}
                                        intensity={isSelected ? 30 : 15}
                                    >
                                        {getIcon(cat.id, isSelected ? colors.accent : colors.text.secondary)}
                                        <Text style={[
                                            styles.categoryText,
                                            { color: isSelected ? colors.text.primary : colors.text.secondary, marginTop: 8 },
                                            isKurdish && styles.kurdishFont
                                        ]}>
                                            {cat.title[language]}
                                        </Text>
                                    </GlassCard>
                                </TouchableOpacity>
                            </MotiView>
                        );
                    })}
                </View>

                <MotiView
                    from={{ opacity: 0, translateY: 30 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: 400 }}
                >
                    <BeastButton
                        variant={player1 && player2 ? 'primary' : 'ghost'}
                        title={isKurdish ? 'دەست پێ بکە' : 'Start Game'}
                        onPress={handleStart}
                        disabled={!player1.trim() || !player2.trim()}
                        size="lg"
                        style={{ marginTop: layout.spacing.xl }}
                        icon={Play}
                    />
                </MotiView>

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
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    instructionText: {
        fontSize: 15,
        lineHeight: 22,
    },
    sectionHeader: {
        alignItems: 'center',
        marginBottom: layout.spacing.sm,
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    sectionHeaderText: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryCard: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        height: 100,
    },
    categoryText: {
        fontWeight: '600',
        fontSize: 14,
        textAlign: 'center',
    },
    kurdishFont: {
        fontFamily: 'Rabar_022',
    }
});
