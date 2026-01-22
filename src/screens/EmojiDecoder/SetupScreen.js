import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground, GlassCard, Button } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../localization/translations';
import { emojiCategories } from '../../constants/emojiPuzzles';

export default function EmojiDecoderSetupScreen({ navigation }) {
    const { language, isKurdish } = useLanguage();
    const rowDirection = isKurdish ? 'row-reverse' : 'row';

    const handleSelectCategory = (category) => {
        navigation.navigate('EmojiDecoderPlay', { category });
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
                        {isKurdish ? '🎯 دەربازی ئیمۆجی' : '🎯 Emoji Decoder'}
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
                                ? '• ئیمۆجییەکان دەبینیت\n• پێتوانی بزانیت چی مانا دەدەن\n• وەڵام بنووسە پێش تەواوبوونی کات!'
                                : '• See the emoji sequence\n• Figure out what it represents\n• Type your answer before time runs out!'
                            }
                        </Text>
                    </GlassCard>

                    {/* Category Selection */}
                    <Text style={[styles.sectionTitle, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'بەشێک هەڵبژێرە' : 'Choose a Category'}
                    </Text>

                    <View style={styles.categoriesGrid}>
                        {emojiCategories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                activeOpacity={0.8}
                                onPress={() => handleSelectCategory(category)}
                            >
                                <GlassCard
                                    intensity={25}
                                    style={[
                                        styles.categoryCard,
                                        { borderColor: category.color + '40' }
                                    ]}
                                >
                                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                                    <Text style={[styles.categoryTitle, isKurdish && styles.kurdishFont]}>
                                        {category.title[language]}
                                    </Text>
                                    <View style={[styles.categoryBadge, { backgroundColor: category.color + '30' }]}>
                                        <Ionicons
                                            name={isKurdish ? "arrow-back" : "arrow-forward"}
                                            size={16}
                                            color={category.color}
                                        />
                                    </View>
                                </GlassCard>
                            </TouchableOpacity>
                        ))}
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
    },
    categoriesGrid: {
        gap: SPACING.md,
    },
    categoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        gap: SPACING.md,
    },
    categoryIcon: {
        fontSize: 32,
    },
    categoryTitle: {
        flex: 1,
        color: COLORS.text.primary,
        ...FONTS.medium,
        fontSize: 16,
    },
    categoryBadge: {
        width: 32, height: 32, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center',
    },
    kurdishFont: { fontFamily: 'Rabar' },
});
