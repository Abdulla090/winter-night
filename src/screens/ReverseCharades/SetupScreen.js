import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground, GlassCard, Button } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { charadesCategories } from '../../constants/charadesData';

export default function ReverseCharadesSetupScreen({ navigation }) {
    const { language, isKurdish } = useLanguage();
    const rowDirection = isKurdish ? 'row-reverse' : 'row';

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
        <GradientBackground>
            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                {/* Header */}
                <View style={[styles.header, { flexDirection: rowDirection }]}>
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons
                            name={isKurdish ? "arrow-forward" : "arrow-back"}
                            size={24}
                            color={COLORS.text.primary}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? '🔄 پێچەوانەی چارێد' : '🔄 Reverse Charades'}
                    </Text>
                    <View style={{ width: 44 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    {/* Instructions */}
                    <GlassCard intensity={30} style={styles.instructionCard}>
                        <Text style={[styles.instructionTitle, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'چۆن دەیاریت؟' : 'How to Play'}
                        </Text>
                        <Text style={[styles.instructionText, isKurdish && styles.kurdishFont]}>
                            {isKurdish
                                ? '• هەموو گروپەکە نواندن بۆ ١ کەس دەکەن\n• ئەوەی دەپرسێت دەبێت بزانێت\n• تا دەتوانیت وەڵامی ی زۆر بدەرەوە!'
                                : '• The TEAM acts out the word\n• ONE person guesses\n• Get as many as you can in the time limit!'
                            }
                        </Text>
                    </GlassCard>

                    {/* Category Selection */}
                    <Text style={[styles.sectionTitle, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'بەشێک هەڵبژێرە' : 'Choose Category'}
                    </Text>

                    <View style={styles.categoriesGrid}>
                        {charadesCategories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                activeOpacity={0.8}
                                onPress={() => setSelectedCategory(category)}
                            >
                                <GlassCard
                                    intensity={25}
                                    style={[
                                        styles.categoryCard,
                                        selectedCategory?.id === category.id && {
                                            borderColor: category.color,
                                            borderWidth: 2,
                                            backgroundColor: category.color + '20'
                                        }
                                    ]}
                                >
                                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.categoryTitle, isKurdish && styles.kurdishFont]}>
                                            {category.title[language]}
                                        </Text>
                                    </View>
                                    {selectedCategory?.id === category.id && (
                                        <Ionicons name="checkmark-circle" size={24} color={category.color} />
                                    )}
                                </GlassCard>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Round Time */}
                    <Text style={[styles.sectionTitle, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'کاتی دەور' : 'Round Time'}
                    </Text>

                    <View style={[styles.timeRow, { flexDirection: rowDirection }]}>
                        {[60, 90, 120].map((time) => (
                            <TouchableOpacity
                                key={time}
                                onPress={() => setRoundTime(time)}
                                style={[
                                    styles.timeBtn,
                                    roundTime === time && styles.timeBtnSelected
                                ]}
                            >
                                <Text style={[
                                    styles.timeBtnText,
                                    roundTime === time && styles.timeBtnTextSelected
                                ]}>{time}s</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Start Button */}
                    <View style={{ marginTop: SPACING.xl }}>
                        <Button
                            title={isKurdish ? 'دەست پێ بکە' : 'Start Game'}
                            onPress={handleStart}
                            disabled={!selectedCategory}
                            gradient={selectedCategory ? [selectedCategory.color, '#333'] : ['#666', '#555']}
                            icon={<Ionicons name="play" size={20} color="#FFF" />}
                            isKurdish={isKurdish}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.md,
    },
    backBtn: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: COLORS.background.card,
        alignItems: 'center', justifyContent: 'center',
    },
    headerTitle: {
        color: COLORS.text.primary,
        ...FONTS.title,
        fontSize: 20,
    },
    content: {
        padding: SPACING.lg,
        paddingBottom: 100,
    },
    instructionCard: {
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        borderRadius: BORDER_RADIUS.xl,
    },
    instructionTitle: {
        color: COLORS.text.primary,
        ...FONTS.medium,
        fontSize: 16,
        marginBottom: SPACING.sm,
    },
    instructionText: {
        color: COLORS.text.muted,
        lineHeight: 24,
    },
    sectionTitle: {
        color: COLORS.text.secondary,
        ...FONTS.medium,
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: SPACING.md,
        marginTop: SPACING.md,
    },

    categoriesGrid: {
        gap: SPACING.sm,
    },
    categoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        borderColor: 'transparent',
        gap: SPACING.md,
    },
    categoryIcon: {
        fontSize: 32,
    },
    categoryTitle: {
        color: COLORS.text.primary,
        ...FONTS.medium,
        fontSize: 18,
    },

    // Time
    timeRow: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    timeBtn: {
        flex: 1,
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    timeBtnSelected: {
        borderColor: COLORS.accent.primary,
        backgroundColor: COLORS.accent.primary + '20',
    },
    timeBtnText: {
        color: COLORS.text.muted,
        ...FONTS.medium,
    },
    timeBtnTextSelected: {
        color: COLORS.accent.primary,
    },

    kurdishFont: { fontFamily: 'Rabar' },
});
