import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { RotateCcw, Play, Clock, Grid } from 'lucide-react-native';
import { AnimatedScreen, BeastButton, GlassCard, BackButton } from '../../components';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../localization/translations';
import { layout } from '../../theme/layout';
import { charadesCategories } from '../../constants/charadesData';
import { MotiView } from 'moti';

export default function ReverseCharadesSetupScreen({ navigation }) {
    const { colors, isRTL } = useTheme();
    const { language, isKurdish } = useLanguage();

    const [roundTime, setRoundTime] = useState(60);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleStart = () => {
        if (!selectedCategory) return;

        navigation.navigate('ReverseCharadesPlay', {
            category: selectedCategory,
            roundTime,
        });
    };

    return (
        <AnimatedScreen>
            <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={[styles.headerTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                    {t('reverseCharades.title', language)}
                </Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Hero Icon */}
                <MotiView
                    from={{ opacity: 0, rotation: '-180deg' }}
                    animate={{ opacity: 1, rotation: '0deg' }}
                    style={{ alignItems: 'center', marginBottom: layout.spacing.xl }}
                >
                    <View style={[styles.heroIconContainer, { backgroundColor: colors.surfaceHighlight }]}>
                        <RotateCcw size={48} color={colors.accent} strokeWidth={1.5} />
                    </View>
                </MotiView>

                {/* Instructions */}
                <GlassCard style={{ marginBottom: layout.spacing.xl }}>
                    <Text style={[styles.sectionTitle, { color: colors.accent, marginBottom: 8 }, isKurdish && styles.kurdishFont]}>
                        {t('common.howToPlay', language)}
                    </Text>
                    <Text style={[styles.instructionText, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                        {t('reverseCharades.description', language)}
                    </Text>
                </GlassCard>

                {/* Category Selection */}
                <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <Grid size={16} color={colors.text.muted} style={{ marginRight: isRTL ? 0 : 8, marginLeft: isRTL ? 8 : 0 }} />
                    <Text style={[styles.sectionHeaderText, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'بەشێک هەڵبژێرە' : 'CHOOSE CATEGORY'}
                    </Text>
                </View>

                <View style={{ gap: layout.spacing.md, marginBottom: layout.spacing.xl }}>
                    {charadesCategories.map((category, index) => {
                        const isSelected = selectedCategory?.id === category.id;
                        return (
                            <MotiView
                                key={category.id}
                                from={{ opacity: 0, translateY: 20 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                delay={index * 100}
                            >
                                <TouchableOpacity
                                    onPress={() => setSelectedCategory(category)}
                                    activeOpacity={0.8}
                                >
                                    <GlassCard
                                        intensity={isSelected ? 40 : 20}
                                        style={[
                                            styles.categoryCard,
                                            isSelected && { borderColor: category.color, borderWidth: 2, backgroundColor: category.color + '20' }
                                        ]}
                                    >
                                        <Text style={{ fontSize: 24 }}>{category.icon}</Text>
                                        <Text style={[
                                            styles.categoryTitle,
                                            { color: colors.text.primary, flex: 1, textAlign: isRTL ? 'right' : 'left' }, isKurdish && styles.kurdishFont
                                        ]}>
                                            {category.title[language]}
                                        </Text>
                                        {isSelected && (
                                            <Play size={20} color={category.color} fill={category.color} />
                                        )}
                                    </GlassCard>
                                </TouchableOpacity>
                            </MotiView>
                        );
                    })}
                </View>

                {/* Round Time */}
                <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <Clock size={16} color={colors.text.muted} style={{ marginRight: isRTL ? 0 : 8, marginLeft: isRTL ? 8 : 0 }} />
                    <Text style={[styles.sectionHeaderText, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                        {t('common.roundTime', language)}
                    </Text>
                </View>

                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 10, marginBottom: layout.spacing.xl }}>
                    {[60, 90, 120].map((time) => (
                        <TouchableOpacity
                            key={time}
                            onPress={() => setRoundTime(time)}
                            style={{ flex: 1 }}
                        >
                            <GlassCard
                                style={{ alignItems: 'center', paddingVertical: 12, backgroundColor: roundTime === time ? colors.accent + '20' : undefined, borderColor: roundTime === time ? colors.accent : undefined, borderWidth: roundTime === time ? 1 : 0 }}
                            >
                                <Text style={{ color: roundTime === time ? colors.accent : colors.text.muted, fontWeight: 'bold' }}>
                                    {time}s
                                </Text>
                            </GlassCard>
                        </TouchableOpacity>
                    ))}
                </View>

                <BeastButton
                    variant={selectedCategory ? 'primary' : 'ghost'}
                    title={isKurdish ? 'دەست پێ بکە' : 'Start Game'}
                    onPress={handleStart}
                    disabled={!selectedCategory}
                    size="lg"
                    style={{ marginTop: layout.spacing.lg }}
                    icon={Play}
                />
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
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        padding: 16,
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
        alignItems: 'center',
        marginBottom: layout.spacing.sm,
    },
    sectionHeaderText: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    categoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        gap: 16,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    kurdishFont: {
        fontFamily: 'Rabar_022',
    }
});
