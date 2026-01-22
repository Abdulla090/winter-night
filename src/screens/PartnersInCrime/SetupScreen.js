import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground, GlassCard, Button } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { partnersData } from '../../constants/partnersData';

export default function PartnersSetupScreen({ navigation }) {
    const { language, isKurdish } = useLanguage();
    const rowDirection = isKurdish ? 'row-reverse' : 'row';

    const [player1, setPlayer1] = useState('');
    const [player2, setPlayer2] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(partnersData[0]);

    const handleStart = () => {
        if (!player1.trim() || !player2.trim()) return;

        navigation.navigate('PartnersPlay', {
            p1Name: player1,
            p2Name: player2,
            category: selectedCategory,
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
                        <Ionicons name={isKurdish ? "arrow-forward" : "arrow-back"} size={24} color={COLORS.text.primary} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'هاوبەشی تاوان' : 'Partners in Crime'}
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
                                ? '• ٢ یاریزان وەڵامی پرسیارەکان دەدەنەوە\n• بزانن چەند یەکتری دەناسن!'
                                : '• 2 Players answer questions about each other\n• See how well you know your partner!'}
                        </Text>
                    </GlassCard>

                    {/* Names */}
                    <Text style={[styles.sectionTitle, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'ناوەکان' : 'Names'}
                    </Text>

                    <View style={styles.namesContainer}>
                        <View style={styles.inputWrapper}>
                            <Text style={[styles.inputLabel, isKurdish && styles.kurdishFont]}>
                                {isKurdish ? 'یاریزانی ١' : 'Player 1'}
                            </Text>
                            <TextInput
                                style={[styles.input, isKurdish && styles.kurdishFont]}
                                value={player1}
                                onChangeText={setPlayer1}
                                placeholder={isKurdish ? 'ناوی یەکەم' : 'Enter Name'}
                                placeholderTextColor={COLORS.text.muted}
                            />
                        </View>
                        <View style={styles.inputWrapper}>
                            <Text style={[styles.inputLabel, isKurdish && styles.kurdishFont]}>
                                {isKurdish ? 'یاریزانی ٢' : 'Player 2'}
                            </Text>
                            <TextInput
                                style={[styles.input, isKurdish && styles.kurdishFont]}
                                value={player2}
                                onChangeText={setPlayer2}
                                placeholder={isKurdish ? 'ناوی دووەم' : 'Enter Name'}
                                placeholderTextColor={COLORS.text.muted}
                            />
                        </View>
                    </View>

                    {/* Category */}
                    <Text style={[styles.sectionTitle, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'پرسیارەکان' : 'Questions'}
                    </Text>

                    <View style={styles.categoriesGrid}>
                        {partnersData.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                onPress={() => setSelectedCategory(cat)}
                                activeOpacity={0.8}
                                style={[
                                    styles.categoryChip,
                                    selectedCategory.id === cat.id && styles.categorySelected
                                ]}
                            >
                                <Text style={[
                                    styles.categoryText,
                                    selectedCategory.id === cat.id && styles.categoryTextSelected,
                                    isKurdish && styles.kurdishFont
                                ]}>
                                    {cat.title[language]}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={{ marginTop: SPACING.xl }}>
                        <Button
                            title={isKurdish ? 'دەست پێ بکە' : 'Start'}
                            onPress={handleStart}
                            disabled={!player1.trim() || !player2.trim()}
                            gradient={[COLORS.accent.primary, '#2563eb']}
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

    namesContainer: {
        gap: SPACING.md,
    },
    inputWrapper: {
        gap: 8,
    },
    inputLabel: {
        color: COLORS.text.secondary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        color: COLORS.text.primary,
        ...FONTS.medium,
        fontSize: 16,
    },

    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    categoryChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: COLORS.background.card,
        borderWidth: 1,
        borderColor: COLORS.background.border,
    },
    categorySelected: {
        backgroundColor: COLORS.accent.primary,
        borderColor: COLORS.accent.primary,
    },
    categoryText: {
        color: COLORS.text.secondary,
        ...FONTS.medium,
    },
    categoryTextSelected: {
        color: '#FFF',
    },

    kurdishFont: { fontFamily: 'Rabar' },
});
