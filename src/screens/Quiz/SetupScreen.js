import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button, PlayerInput } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { getAllQuizCategories } from '../../constants/quizData';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../localization/translations';

export default function QuizSetupScreen({ navigation }) {
    const [players, setPlayers] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('general');
    const [questionCount, setQuestionCount] = useState(10);

    const { language, isKurdish } = useLanguage();
    const categories = getAllQuizCategories();
    const canStart = players.length >= 1;

    // RTL styles
    const rtlStyles = {
        textAlign: isKurdish ? 'right' : 'left',
        writingDirection: isKurdish ? 'rtl' : 'ltr',
    };
    const rowDirection = isKurdish ? 'row-reverse' : 'row';

    // Get category name in Kurdish
    const getCategoryName = (key, name) => {
        if (!isKurdish) return name;
        const names = {
            general: 'گشتی',
            science: 'زانست',
            history: 'مێژوو',
            geography: 'جوگرافیا',
            sports: 'وەرزش',
            entertainment: 'ڕازاندنەوە'
        };
        return names[key] || name;
    };

    const startGame = () => {
        navigation.navigate('QuizPlay', {
            players,
            category: selectedCategory,
            questionCount,
        });
    };

    return (
        <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
            <View style={[styles.header, { flexDirection: rowDirection }]}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name={isKurdish ? "arrow-forward" : "arrow-back"} size={24} color={COLORS.text.primary} />
                </TouchableOpacity>
                <Text style={[styles.title, isKurdish && styles.kurdishFont]}>
                    {t('quiz.title', language)}
                </Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <PlayerInput
                    players={players}
                    setPlayers={setPlayers}
                    minPlayers={1}
                    maxPlayers={10}
                    isKurdish={isKurdish}
                    language={language}
                />

                <Text style={[styles.sectionTitle, rtlStyles, isKurdish && styles.kurdishFont]}>
                    {t('common.chooseCategory', language)}
                </Text>
                <View style={[styles.categoryGrid, { flexDirection: rowDirection, flexWrap: 'wrap' }]}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.key}
                            style={[
                                styles.categoryCard,
                                selectedCategory === cat.key && styles.categorySelected
                            ]}
                            onPress={() => setSelectedCategory(cat.key)}
                        >
                            <View style={[
                                styles.categoryIcon,
                                selectedCategory === cat.key && styles.categoryIconSelected
                            ]}>
                                <Ionicons
                                    name={cat.icon}
                                    size={24}
                                    color={selectedCategory === cat.key ? '#FFF' : COLORS.text.secondary}
                                />
                            </View>
                            <Text style={[
                                styles.categoryName,
                                selectedCategory === cat.key && styles.categoryNameSelected,
                                isKurdish && styles.kurdishFont
                            ]}>
                                {getCategoryName(cat.key, cat.name)}
                            </Text>
                            <Text style={[styles.categoryCount, isKurdish && styles.kurdishFont]}>
                                {cat.count} {isKurdish ? 'پرسیار' : 'questions'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={[styles.sectionTitle, rtlStyles, isKurdish && styles.kurdishFont]}>
                    {isKurdish ? 'ژمارەی پرسیارەکان' : 'Number of Questions'}
                </Text>
                <View style={[styles.questionOptions, { flexDirection: rowDirection }]}>
                    {[5, 10, 15, 20].map((count) => (
                        <TouchableOpacity
                            key={count}
                            style={[
                                styles.questionOption,
                                questionCount === count && styles.questionOptionSelected
                            ]}
                            onPress={() => setQuestionCount(count)}
                        >
                            <Text style={[
                                styles.questionOptionText,
                                questionCount === count && styles.questionOptionTextSelected
                            ]}>
                                {count}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.rulesCard}>
                    <View style={[styles.rulesHeader, { flexDirection: rowDirection }]}>
                        <Ionicons name="trophy" size={20} color={COLORS.accent.success} />
                        <Text style={[styles.rulesTitle, isKurdish && styles.kurdishFont]}>
                            {t('common.howToPlay', language)}
                        </Text>
                    </View>
                    <Text style={[styles.rulesText, rtlStyles, isKurdish && styles.kurdishFont]}>
                        {isKurdish
                            ? '• وەڵامی پرسیارە چەند هەڵبژاردنییەکان بدەوە\n• وەڵامی دروستی خێراتر خاڵی زیاتر دەبات\n• یاریزانی خاوەنی زۆرترین خاڵ دەباتەوە!\n• هەموو پرسیارەکان ١٠٠٪ ئۆفلاین کاردەکەن'
                            : "• Answer multiple choice questions\n• Fastest correct answer wins more points\n• The player with most points wins!\n• All questions work 100% offline"
                        }
                    </Text>
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        title={isKurdish ? 'پرسیارەکان دەست پێ بکە' : 'Start Quiz'}
                        onPress={startGame}
                        disabled={!canStart}
                        gradient={[COLORS.accent.success, COLORS.accent.success]}
                        icon={<Ionicons name="play" size={20} color="#FFF" />}
                        isKurdish={isKurdish}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: COLORS.background.dark },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.background.dark,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.background.border,
        minHeight: 60,
    },
    backButton: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: COLORS.background.card,
        alignItems: 'center', justifyContent: 'center',
    },
    title: { color: COLORS.text.primary, ...FONTS.title, fontSize: 24 },
    placeholder: { width: 44 },
    scrollView: { flex: 1 },
    scrollContent: { padding: SPACING.lg, paddingBottom: 120 },
    sectionTitle: {
        color: COLORS.text.secondary, ...FONTS.medium,
        marginBottom: SPACING.md, marginTop: SPACING.lg,
        textTransform: 'uppercase', fontSize: 13, letterSpacing: 1,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    categoryCard: {
        width: '47%',
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    categorySelected: {
        borderColor: COLORS.accent.success,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    categoryIcon: {
        width: 48, height: 48, borderRadius: 24,
        backgroundColor: COLORS.background.secondary,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 8,
    },
    categoryIconSelected: {
        backgroundColor: COLORS.accent.success,
    },
    categoryName: { color: COLORS.text.primary, ...FONTS.medium, textAlign: 'center' },
    categoryNameSelected: { color: COLORS.accent.success },
    categoryCount: { color: COLORS.text.muted, fontSize: 12, marginTop: 4 },
    questionOptions: {
        flexDirection: 'row',
        gap: 12,
    },
    questionOption: {
        flex: 1,
        backgroundColor: COLORS.background.card,
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    questionOptionSelected: {
        borderColor: COLORS.accent.success,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    questionOptionText: { color: COLORS.text.secondary, ...FONTS.bold },
    questionOptionTextSelected: { color: COLORS.accent.success },
    rulesCard: {
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        marginTop: SPACING.lg,
    },
    rulesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.sm,
    },
    rulesTitle: { color: COLORS.accent.success, ...FONTS.medium },
    rulesText: { color: COLORS.text.muted, lineHeight: 22 },
    buttonContainer: { marginTop: SPACING.xl, marginBottom: 50 },
    kurdishFont: { fontFamily: 'Rabar' },
});
