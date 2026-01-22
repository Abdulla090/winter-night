import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button, PlayerInput } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { getAllDrawingCategories, TIME_OPTIONS } from '../../constants/drawingData';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../localization/translations';

export default function DrawGuessSetupScreen({ navigation }) {
    const [players, setPlayers] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('easy');
    const [roundTime, setRoundTime] = useState(60);

    const { language, isKurdish } = useLanguage();
    const categories = getAllDrawingCategories(language);
    const canStart = players.length >= 2;

    // RTL styles
    const rtlStyles = {
        textAlign: isKurdish ? 'right' : 'left',
        writingDirection: isKurdish ? 'rtl' : 'ltr',
    };
    const rowDirection = isKurdish ? 'row-reverse' : 'row';

    // Get category name - now comes pre-translated from the data
    const getCategoryName = (cat) => {
        return cat.name;
    };

    const startGame = () => {
        navigation.navigate('DrawGuessPlay', {
            players,
            category: selectedCategory,
            roundTime,
        });
    };

    return (
        <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
            <View style={[styles.header, { flexDirection: rowDirection }]}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name={isKurdish ? "arrow-forward" : "arrow-back"} size={24} color={COLORS.text.primary} />
                </TouchableOpacity>
                <Text style={[styles.title, isKurdish && styles.kurdishFont]}>
                    {t('drawGuess.title', language)}
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
                    minPlayers={2}
                    maxPlayers={10}
                    isKurdish={isKurdish}
                    language={language}
                />

                <Text style={[styles.sectionTitle, rtlStyles, isKurdish && styles.kurdishFont]}>
                    {isKurdish ? 'ئاستی زەحمەتی وشە' : 'Word Difficulty'}
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
                            <Ionicons
                                name={cat.icon}
                                size={24}
                                color={selectedCategory === cat.key ? COLORS.accent.primary : COLORS.text.secondary}
                            />
                            <Text style={[
                                styles.categoryName,
                                selectedCategory === cat.key && styles.categoryNameSelected,
                                isKurdish && styles.kurdishFont
                            ]}>
                                {getCategoryName(cat)}
                            </Text>
                            <Text style={[styles.categoryCount, isKurdish && styles.kurdishFont]}>
                                {cat.count} {isKurdish ? 'وشە' : 'words'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={[styles.sectionTitle, rtlStyles, isKurdish && styles.kurdishFont]}>
                    {isKurdish ? 'کات بۆ هەر قۆناغێک' : 'Time Per Round'}
                </Text>
                <View style={[styles.timeOptions, { flexDirection: rowDirection }]}>
                    {TIME_OPTIONS.map((time) => (
                        <TouchableOpacity
                            key={time}
                            style={[
                                styles.timeOption,
                                roundTime === time && styles.timeOptionSelected
                            ]}
                            onPress={() => setRoundTime(time)}
                        >
                            <Text style={[
                                styles.timeOptionText,
                                roundTime === time && styles.timeOptionTextSelected
                            ]}>
                                {time}{isKurdish ? 'چ' : 's'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.rulesCard}>
                    <View style={[styles.rulesHeader, { flexDirection: rowDirection }]}>
                        <Ionicons name="brush" size={20} color={COLORS.accent.info} />
                        <Text style={[styles.rulesTitle, isKurdish && styles.kurdishFont]}>
                            {t('common.howToPlay', language)}
                        </Text>
                    </View>
                    <Text style={[styles.rulesText, rtlStyles, isKurdish && styles.kurdishFont]}>
                        {isKurdish
                            ? '• یەک یاریزان وشەی نهێنی وێنەدەکێشێت\n• کەسەکانی تر هەوڵ دەدەن بیزانن\n• ئەمە وەکو تەختەی وێنە بەکاربهێنە!\n• پیت و ژمارە قەدەغەیە!'
                            : "• One player draws a secret word\n• Others try to guess what it is\n• Use this as your drawing board!\n• No letters or numbers allowed!"
                        }
                    </Text>
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        title={t('common.start', language)}
                        onPress={startGame}
                        disabled={!canStart}
                        gradient={[COLORS.accent.info, COLORS.accent.info]}
                        icon={<Ionicons name="brush" size={20} color="#FFF" />}
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
        borderColor: COLORS.accent.info,
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
    },
    categoryName: { color: COLORS.text.primary, ...FONTS.medium, marginTop: 8, textAlign: 'center' },
    categoryNameSelected: { color: COLORS.accent.info },
    categoryCount: { color: COLORS.text.muted, fontSize: 12, marginTop: 4 },
    timeOptions: {
        flexDirection: 'row',
        gap: 12,
    },
    timeOption: {
        flex: 1,
        backgroundColor: COLORS.background.card,
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    timeOptionSelected: {
        borderColor: COLORS.accent.info,
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
    },
    timeOptionText: { color: COLORS.text.secondary, ...FONTS.bold },
    timeOptionTextSelected: { color: COLORS.accent.info },
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
