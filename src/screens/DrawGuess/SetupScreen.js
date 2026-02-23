import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Paintbrush } from 'lucide-react-native';
import * as Icons from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { Button, PlayerInput, BackButton } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { getAllDrawingCategories, TIME_OPTIONS } from '../../constants/drawingData';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../localization/translations';

export default function DrawGuessSetupScreen({ navigation }) {
    const [players, setPlayers] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('easy');
    const [roundTime, setRoundTime] = useState(60);

    const { language, isKurdish } = useLanguage();
    const { colors, isRTL } = useTheme();
    const categories = getAllDrawingCategories(language);
    const canStart = players.length >= 2;

    const rowDirection = isRTL ? 'row-reverse' : 'row';
    const rtlStyles = { textAlign: isRTL ? 'right' : 'left' };

    // Get category name - now comes pre-translated from the data
    const getCategoryName = (cat) => {
        return cat.name;
    };

    const startGame = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        navigation.navigate('DrawGuessPlay', {
            players,
            category: selectedCategory,
            roundTime,
        });
    };

    return (
        <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
            <View style={[styles.header, { flexDirection: rowDirection, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={[styles.title, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                    {t('drawGuess.title', language)}
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
                    maxPlayers={10}
                    isKurdish={isKurdish}
                    language={language}
                />

                <Text style={[styles.sectionTitle, { color: colors.text.secondary }, rtlStyles, isKurdish && styles.kurdishFont]}>
                    {isKurdish ? 'ئاستی زەحمەتی وشە' : 'Word Difficulty'}
                </Text>
                <View style={[styles.categoryGrid, { flexDirection: rowDirection, flexWrap: 'wrap' }]}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.key}
                            style={[
                                styles.categoryCard,
                                { backgroundColor: colors.surface },
                                selectedCategory === cat.key && [
                                    styles.categorySelected,
                                    { borderColor: colors.brand.info, backgroundColor: colors.brand.info + '15' }
                                ]
                            ]}
                            onPress={() => {
                                if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setSelectedCategory(cat.key);
                            }}
                        >
                            {(() => {
                                const IconComp = Icons[cat.icon] || Icons.HelpCircle;
                                return (
                                    <IconComp
                                        size={24}
                                        color={selectedCategory === cat.key ? colors.brand.info : colors.text.secondary}
                                    />
                                );
                            })()}
                            <Text style={[
                                styles.categoryName,
                                { color: colors.text.primary },
                                selectedCategory === cat.key && [styles.categoryNameSelected, { color: colors.brand.info }],
                                isKurdish && styles.kurdishFont
                            ]}>
                                {getCategoryName(cat)}
                            </Text>
                            <Text style={[styles.categoryCount, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                                {cat.count} {isKurdish ? 'وشە' : 'words'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={[styles.sectionTitle, { color: colors.text.secondary }, rtlStyles, isKurdish && styles.kurdishFont]}>
                    {isKurdish ? 'کات بۆ هەر قۆناغێک' : 'Time Per Round'}
                </Text>
                <View style={[styles.timeOptions, { flexDirection: rowDirection }]}>
                    {TIME_OPTIONS.map((time) => (
                        <TouchableOpacity
                            key={time}
                            style={[
                                styles.timeOption,
                                { backgroundColor: colors.surface },
                                roundTime === time && [styles.timeOptionSelected, { borderColor: colors.brand.info, backgroundColor: colors.brand.info + '15' }]
                            ]}
                            onPress={() => {
                                if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setRoundTime(time);
                            }}
                        >
                            <Text style={[
                                styles.timeOptionText,
                                { color: colors.text.secondary },
                                roundTime === time && [styles.timeOptionTextSelected, { color: colors.brand.info }]
                            ]}>
                                {time}{isKurdish ? 'چ' : 's'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={[styles.rulesCard, { backgroundColor: colors.surface }]}>
                    <View style={[styles.rulesHeader, { flexDirection: rowDirection }]}>
                        <Paintbrush size={20} color={colors.brand.info} />
                        <Text style={[styles.rulesTitle, { color: colors.brand.info }, isKurdish && styles.kurdishFont]}>
                            {t('common.howToPlay', language)}
                        </Text>
                    </View>
                    <Text style={[styles.rulesText, { color: colors.text.muted }, rtlStyles, isKurdish && styles.kurdishFont]}>
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
                        gradient={[colors.brand.info, colors.brand.info]}
                        icon={<Paintbrush size={20} color="#FFF" />}
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
    title: { ...FONTS.title, fontSize: 24 },
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
    categorySelected: {
        borderWidth: 2,
    },
    categoryName: { ...FONTS.medium, marginTop: 8, textAlign: 'center' },
    categoryNameSelected: {},
    categoryCount: { fontSize: 12, marginTop: 4 },
    timeOptions: {
        flexDirection: 'row',
        gap: 12,
    },
    timeOption: {
        flex: 1,
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    timeOptionSelected: {
        borderWidth: 2,
    },
    timeOptionText: { ...FONTS.bold },
    timeOptionTextSelected: {},
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
