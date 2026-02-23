import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Smile, Lightbulb, Gamepad2, Zap, ArrowLeftRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { Button, PlayerInput, BackButton } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { getAllCategories } from '../../constants/wouldYouRatherData';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../localization/translations';

export default function WouldYouRatherSetupScreen({ navigation }) {
    const [players, setPlayers] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('fun');

    const { language, isKurdish } = useLanguage();
    const { colors, isRTL } = useTheme();
    const categories = getAllCategories();
    const canStart = players.length >= 2;

    const rowDirection = isRTL ? 'row-reverse' : 'row';
    const rtlStyles = { textAlign: isRTL ? 'right' : 'left' };

    // Get category name in Kurdish
    const getCategoryName = (key, name) => {
        if (!isKurdish) return name;
        const names = {
            fun: 'خۆشی',
            deep: 'قووڵ',
            gross: 'نەخۆش',
            superpowers: 'توانای زۆر'
        };
        return names[key] || name;
    };

    const startGame = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        navigation.navigate('WouldYouRatherPlay', {
            players,
            category: selectedCategory,
        });
    };

    const handleCategorySelect = (key) => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedCategory(key);
    };

    const getIcon = (iconName, color) => {
        switch (iconName) {
            case 'Smile': return <Smile size={24} color={color} />;
            case 'Lightbulb': return <Lightbulb size={24} color={color} />;
            case 'Gamepad2': return <Gamepad2 size={24} color={color} />;
            case 'Zap': return <Zap size={24} color={color} />;
            default: return <Smile size={24} color={color} />;
        }
    };

    return (
        <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
            <View style={[styles.header, { flexDirection: rowDirection, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={[styles.title, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                    {t('wouldYouRather.title', language)}
                </Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <PlayerInput
                    players={players}
                    setPlayers={setPlayers}
                    minPlayers={2}
                    maxPlayers={20}
                    isKurdish={isKurdish}
                    language={language}
                />

                <Text style={[styles.sectionTitle, { color: colors.text.secondary }, rtlStyles, isKurdish && styles.kurdishFont]}>
                    {t('common.chooseCategory', language)}
                </Text>
                <View style={[styles.categoryGrid, { flexDirection: rowDirection, flexWrap: 'wrap' }]}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.key}
                            style={[
                                styles.categoryCard,
                                { backgroundColor: colors.surface },
                                selectedCategory === cat.key && {
                                    borderColor: cat.color,
                                    backgroundColor: `${cat.color}15`
                                }
                            ]}
                            onPress={() => handleCategorySelect(cat.key)}
                        >
                            {getIcon(cat.icon, cat.color)}
                            <Text style={[
                                styles.categoryName,
                                { color: colors.text.primary },
                                selectedCategory === cat.key && { color: cat.color },
                                isKurdish && styles.kurdishFont
                            ]}>
                                {getCategoryName(cat.key, cat.name)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={[styles.rulesCard, { backgroundColor: colors.surface }]}>
                    <View style={[styles.rulesHeader, { flexDirection: rowDirection }]}>
                        <ArrowLeftRight size={20} color={colors.brand.info} />
                        <Text style={[styles.rulesTitle, { color: colors.brand.info }, isKurdish && styles.kurdishFont]}>
                            {t('common.howToPlay', language)}
                        </Text>
                    </View>
                    <Text style={[styles.rulesText, { color: colors.text.muted }, rtlStyles, isKurdish && styles.kurdishFont]}>
                        {isKurdish
                            ? '• دۆخێک لەگەڵ دوو هەڵبژاردە دەردەکەوێت\n• هەر یاریزانێک A یان B هەڵدەبژێرێت\n• ببینە کێ هاوڕان و کێ جیاوازە\n• سەبارەت بە هەڵبژاردەکانتان مشتومڕ بکەن و خۆشی بکەن!'
                            : "• A dilemma appears with two choices\n• Each player picks Option A or B\n• See who agrees and who disagrees\n• Debate your choices and have fun!"
                        }
                    </Text>
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        title={t('common.start', language)}
                        onPress={startGame}
                        disabled={!canStart}
                        gradient={[colors.brand.info, colors.brand.info]}
                        icon={<ArrowLeftRight size={20} color="#FFF" />}
                        isKurdish={isKurdish}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        minHeight: 60,
    },
    backButton: {
        width: 44, height: 44, borderRadius: 22,
        alignItems: 'center', justifyContent: 'center',
    },
    title: { ...FONTS.title, fontSize: 20 },
    placeholder: { width: 44 },
    scrollView: { flex: 1 },
    scrollContent: { padding: SPACING.lg, paddingBottom: 120 },
    sectionTitle: {
        ...FONTS.medium,
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
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    categoryName: { ...FONTS.medium, marginTop: 8 },
    rulesCard: {
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
    rulesTitle: { ...FONTS.medium },
    rulesText: { lineHeight: 22 },
    buttonContainer: { marginTop: SPACING.xl, marginBottom: 50 },
    kurdishFont: { fontFamily: 'Rabar' },
});
