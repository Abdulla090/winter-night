import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground, GlassCard, Button } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { lyricsCategories } from '../../constants/lyricsData';

export default function LyricsChallengeSetupScreen({ navigation }) {
    const { language, isKurdish } = useLanguage();
    const rowDirection = isKurdish ? 'row-reverse' : 'row';

    const handleSelectCategory = (category) => {
        navigation.navigate('LyricsChallengePlay', { category });
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
                        {isKurdish ? '🎵 تەحەدای گۆرانی' : '🎵 Lyrics Challenge'}
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
                                ? '• بەشێک لە گۆرانییەکە دەبینیت\n• هەوڵبدە ناوی گۆرانییەکە بزانیت\n• خاڵ کۆبکەرەوە!'
                                : '• Read the lyrics snippet\n• Guess the song title or artist\n• Score points for correct guesses!'
                            }
                        </Text>
                    </GlassCard>

                    {/* Category Selection */}
                    <Text style={[styles.sectionTitle, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'جۆرێک هەڵبژێرە' : 'Choose Genre'}
                    </Text>

                    <View style={styles.categoriesGrid}>
                        {lyricsCategories.map((category) => (
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
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.categoryTitle, isKurdish && styles.kurdishFont]}>
                                            {category.title[language]}
                                        </Text>
                                        <Text style={[styles.categorySubtitle, isKurdish && styles.kurdishFont]}>
                                            {isKurdish ? 'کلیک بکە بۆ یاری' : 'Tap to play'}
                                        </Text>
                                    </View>
                                    <View style={[styles.categoryBadge, { backgroundColor: category.color + '30' }]}>
                                        <Ionicons
                                            name="play"
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
        color: COLORS.text.primary,
        ...FONTS.medium,
        fontSize: 18,
    },
    categorySubtitle: {
        color: COLORS.text.muted,
        fontSize: 12,
        marginTop: 2,
    },
    categoryBadge: {
        width: 36, height: 36, borderRadius: 18,
        alignItems: 'center', justifyContent: 'center',
    },
    kurdishFont: { fontFamily: 'Rabar' },
});
