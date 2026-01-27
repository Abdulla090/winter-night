import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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
        navigation.navigate('WouldYouRatherPlay', {
            players,
            category: selectedCategory,
        });
    };

    return (
        <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
            <View style={[styles.header, { flexDirection: rowDirection }]}>
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

                <Text style={[styles.sectionTitle, rtlStyles, isKurdish && styles.kurdishFont]}>
                    {t('common.chooseCategory', language)}
                </Text>
                <View style={[styles.categoryGrid, { flexDirection: rowDirection, flexWrap: 'wrap' }]}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.key}
                            style={[
                                styles.categoryCard,
                                selectedCategory === cat.key && {
                                    borderColor: cat.color,
                                    backgroundColor: `${cat.color}15`
                                }
                            ]}
                            onPress={() => setSelectedCategory(cat.key)}
                        >
                            <Ionicons name={cat.icon} size={24} color={cat.color} />
                            <Text style={[
                                styles.categoryName,
                                selectedCategory === cat.key && { color: cat.color },
                                isKurdish && styles.kurdishFont
                            ]}>
                                {getCategoryName(cat.key, cat.name)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.rulesCard}>
                    <View style={[styles.rulesHeader, { flexDirection: rowDirection }]}>
                        <Ionicons name="swap-horizontal" size={20} color={COLORS.accent.info} />
                        <Text style={[styles.rulesTitle, isKurdish && styles.kurdishFont]}>
                            {t('common.howToPlay', language)}
                        </Text>
                    </View>
                    <Text style={[styles.rulesText, rtlStyles, isKurdish && styles.kurdishFont]}>
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
                        gradient={[COLORS.accent.info, COLORS.accent.info]}
                        icon={<Ionicons name="swap-horizontal" size={20} color="#FFF" />}
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
    title: { color: COLORS.text.primary, ...FONTS.title, fontSize: 20 },
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
    categoryName: { color: COLORS.text.primary, ...FONTS.medium, marginTop: 8 },
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
    rulesTitle: { color: COLORS.accent.info, ...FONTS.medium },
    rulesText: { color: COLORS.text.muted, lineHeight: 22 },
    buttonContainer: { marginTop: SPACING.xl, marginBottom: 50 },
    kurdishFont: { fontFamily: 'Rabar' },
});
