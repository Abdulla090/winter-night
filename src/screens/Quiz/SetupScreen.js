import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { HelpCircle, Play, Trophy, Check, Lightbulb, FlaskConical, Book, Film, Music } from 'lucide-react-native';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { AnimatedScreen, BeastButton, GlassCard, PlayerInput, BackButton } from '../../components';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../localization/translations';
import { layout } from '../../theme/layout';
import { getAllQuizCategories } from '../../constants/quizData';

export default function QuizSetupScreen({ navigation }) {
    const [players, setPlayers] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('general');
    const [questionCount, setQuestionCount] = useState(10);

    const { language, isKurdish } = useLanguage();
    const { colors, isRTL } = useTheme();
    const categories = getAllQuizCategories();
    const canStart = players.length >= 1;

    const rowDirection = isRTL ? 'row-reverse' : 'row';

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
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        navigation.navigate('QuizPlay', {
            players,
            category: selectedCategory,
            questionCount,
        });
    };

    const handleCategorySelect = (key) => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedCategory(key);
    };

    const handleCountSelect = (count) => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setQuestionCount(count);
    };

    const getCategoryIcon = (key, size, color) => {
        switch (key) {
            case 'general': return <Lightbulb size={size} color={color} />;
            case 'science': return <FlaskConical size={size} color={color} />;
            case 'history': return <Book size={size} color={color} />;
            case 'movies': return <Film size={size} color={color} />;
            case 'sports': return <Trophy size={size} color={color} />;
            case 'music': return <Music size={size} color={color} />;
            default: return <HelpCircle size={size} color={color} />;
        }
    };

    return (
        <AnimatedScreen>
            {/* Header */}
            <View style={[styles.header, { flexDirection: rowDirection }]}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={[styles.headerTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                    {t('quiz.title', language)}
                </Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* Hero Icon */}
                <MotiView
                    from={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ alignItems: 'center', marginBottom: layout.spacing.lg }}
                >
                    <View style={[styles.heroIcon, { backgroundColor: colors.accent + '20' }]}>
                        <HelpCircle size={48} color={colors.accent} strokeWidth={1.5} />
                    </View>
                </MotiView>

                {/* Players Section */}
                <GlassCard style={{ marginBottom: layout.spacing.lg }}>
                    <View style={[styles.sectionHeader, { flexDirection: rowDirection }]}>
                        <Trophy size={18} color={colors.accent} style={{ marginHorizontal: 8 }} />
                        <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                            {t('common.players', language)}
                        </Text>
                    </View>
                    <PlayerInput
                        players={players}
                        setPlayers={setPlayers}
                        minPlayers={1}
                        maxPlayers={10}
                        isKurdish={isKurdish}
                        language={language}
                    />
                </GlassCard>

                {/* Category Selection */}
                <Text style={[styles.dividerLabel, { color: colors.text.muted, textAlign: isRTL ? 'right' : 'left' }]}>
                    {t('common.chooseCategory', language)}
                </Text>
                <View style={[styles.categoryGrid, { flexDirection: rowDirection, flexWrap: 'wrap' }]}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.key}
                            style={[
                                styles.categoryCard,
                                {
                                    backgroundColor: selectedCategory === cat.key ? colors.accent + '15' : colors.surface,
                                    borderColor: selectedCategory === cat.key ? colors.accent : 'transparent',
                                    ...layout.shadows.sm,
                                }
                            ]}
                            onPress={() => handleCategorySelect(cat.key)}
                            activeOpacity={0.8}
                        >
                            <View style={[
                                styles.catIcon,
                                {
                                    backgroundColor: selectedCategory === cat.key ? colors.accent : colors.surfaceHighlight,
                                }
                            ]}>
                                {getCategoryIcon(cat.key, 24, selectedCategory === cat.key ? '#FFF' : colors.text.secondary)}
                            </View>
                            <Text style={[
                                styles.categoryText,
                                { color: selectedCategory === cat.key ? colors.accent : colors.text.primary },
                                isKurdish && styles.kurdishFont
                            ]}>
                                {getCategoryName(cat.key, cat.name)}
                            </Text>
                            <Text style={[styles.categoryCount, { color: colors.text.muted }]}>
                                {cat.count} {isKurdish ? 'پرسیار' : 'questions'}
                            </Text>
                            {selectedCategory === cat.key && (
                                <View style={[styles.checkBadge, { backgroundColor: colors.accent }]}>
                                    <Check size={10} color="#FFF" strokeWidth={3} />
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Question Count */}
                <GlassCard style={{ marginTop: layout.spacing.xl }}>
                    <View style={[styles.sectionHeader, { flexDirection: rowDirection }]}>
                        <HelpCircle size={18} color={colors.accent} style={{ marginHorizontal: 8 }} />
                        <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                            {isKurdish ? 'ژمارەی پرسیارەکان' : 'Number of Questions'}
                        </Text>
                    </View>
                    <View style={[styles.countRow, { flexDirection: rowDirection }]}>
                        {[5, 10, 15, 20].map((count) => (
                            <TouchableOpacity
                                key={count}
                                style={[
                                    styles.countPill,
                                    {
                                        backgroundColor: questionCount === count ? colors.accent : colors.surface,
                                        borderColor: questionCount === count ? colors.accent : colors.border,
                                    }
                                ]}
                                onPress={() => handleCountSelect(count)}
                            >
                                <Text style={[
                                    styles.countText,
                                    { color: questionCount === count ? '#FFF' : colors.text.secondary }
                                ]}>{count}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </GlassCard>
            </ScrollView>

            {/* Start Button */}
            <MotiView
                animate={{ translateY: canStart ? 0 : 100, opacity: canStart ? 1 : 0 }}
                style={styles.fabContainer}
            >
                <BeastButton
                    title={isKurdish ? 'پرسیارەکان دەست پێ بکە' : 'Start Quiz'}
                    onPress={startGame}
                    variant="primary"
                    size="lg"
                    icon={Play}
                    style={{ width: '100%' }}
                />
            </MotiView>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: layout.spacing.md,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    heroIcon: {
        width: 96,
        height: 96,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionHeader: {
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    dividerLabel: {
        marginTop: layout.spacing.md,
        marginBottom: layout.spacing.md,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    categoryGrid: {
        gap: 12,
    },
    categoryCard: {
        width: '47%',
        padding: 16,
        borderRadius: layout.radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        marginBottom: 8,
        position: 'relative',
    },
    catIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    categoryText: {
        fontWeight: '600',
        fontSize: 14,
        textAlign: 'center',
    },
    categoryCount: {
        fontSize: 12,
        marginTop: 4,
    },
    checkBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    countRow: {
        gap: 12,
        justifyContent: 'center',
    },
    countPill: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: layout.radius.lg,
        borderWidth: 1,
    },
    countText: {
        fontWeight: '700',
        fontSize: 16,
    },
    fabContainer: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
    },
    kurdishFont: {
        fontFamily: 'Rabar',
    },
});
