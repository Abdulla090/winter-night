import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button, PlayerInput } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../localization/translations';

const GAME_DURATIONS = [3, 5, 8, 10]; // minutes

export default function SpyfallSetupScreen({ navigation }) {
    const [players, setPlayers] = useState([]);
    const [gameDuration, setGameDuration] = useState(5);
    const [spyCount, setSpyCount] = useState(1);

    const { language, isKurdish } = useLanguage();
    const canStart = players.length >= 3;

    // RTL styles
    const rtlStyles = {
        textAlign: isKurdish ? 'right' : 'left',
        writingDirection: isKurdish ? 'rtl' : 'ltr',
    };
    const rowDirection = isKurdish ? 'row-reverse' : 'row';

    const startGame = () => {
        navigation.navigate('SpyfallPlay', {
            players,
            gameDuration,
            spyCount,
        });
    };

    return (
        <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View style={[styles.header, { flexDirection: rowDirection }]}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name={isKurdish ? "arrow-forward" : "arrow-back"} size={24} color={COLORS.text.primary} />
                </TouchableOpacity>
                <Text style={[styles.title, isKurdish && styles.kurdishFont]}>
                    {t('spyfall.title', language)}
                </Text>
                <View style={styles.placeholder} />
            </View>

            {/* Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={true}
            >
                {/* Player Input */}
                <PlayerInput
                    players={players}
                    setPlayers={setPlayers}
                    minPlayers={3}
                    maxPlayers={12}
                    isKurdish={isKurdish}
                    language={language}
                />

                {/* Settings Section */}
                <Text style={[styles.sectionTitle, rtlStyles, isKurdish && styles.kurdishFont]}>
                    {t('common.gameSettings', language)}
                </Text>

                {/* Spy Count */}
                <View style={[styles.settingCard, { flexDirection: rowDirection }]}>
                    <View style={[styles.settingHeader, { flexDirection: rowDirection }]}>
                        <View style={[styles.iconBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                            <Ionicons name="eye-off-outline" size={20} color={COLORS.accent.success} />
                        </View>
                        <View style={isKurdish && { alignItems: 'flex-end' }}>
                            <Text style={[styles.settingLabel, isKurdish && styles.kurdishFont]}>
                                {isKurdish ? 'ژمارەی جاسوسەکان' : 'Number of Spies'}
                            </Text>
                            <Text style={[styles.settingDesc, isKurdish && styles.kurdishFont]}>
                                {isKurdish ? 'یاریزانەکانی بێ زانیاری شوێن' : 'Players without location info'}
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.toggleRow, { flexDirection: rowDirection }]}>
                        {[1, 2].map(count => (
                            <TouchableOpacity
                                key={count}
                                style={[
                                    styles.toggleButton,
                                    spyCount === count && styles.toggleActiveGreen
                                ]}
                                onPress={() => setSpyCount(count)}
                            >
                                <Text style={[
                                    styles.toggleText,
                                    spyCount === count && styles.toggleTextActive
                                ]}>{count}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Game Duration */}
                <Text style={[styles.sectionTitle, rtlStyles, isKurdish && styles.kurdishFont]}>
                    {isKurdish ? 'ماوەی قۆناغ' : 'Round Duration'}
                </Text>
                <View style={[styles.durationGrid, { flexDirection: rowDirection }]}>
                    {GAME_DURATIONS.map((duration) => (
                        <TouchableOpacity
                            key={duration}
                            style={[
                                styles.durationItem,
                                gameDuration === duration && styles.durationSelected
                            ]}
                            onPress={() => setGameDuration(duration)}
                        >
                            <Text style={[
                                styles.durationText,
                                gameDuration === duration && styles.durationTextSelected,
                                isKurdish && styles.kurdishFont
                            ]}>
                                {duration} {isKurdish ? 'خولەک' : 'min'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* How to Play */}
                <View style={styles.rulesCard}>
                    <View style={[styles.rulesHeader, { flexDirection: rowDirection }]}>
                        <Ionicons name="information-circle" size={20} color={COLORS.accent.info} />
                        <Text style={[styles.rulesTitle, isKurdish && styles.kurdishFont]}>
                            {t('common.howToPlay', language)}
                        </Text>
                    </View>
                    <Text style={[styles.rulesText, rtlStyles, isKurdish && styles.kurdishFont]}>
                        {isKurdish
                            ? '• هەموان شوێنی یەکسانیان دەزانن تەنها جاسوس نەبێت\n• یاریزانەکان نۆرەبەت پرسیار دەکەن\n• جاسوسەکە هەوڵ دەدات شوێنەکە بزانێت\n• کەسەکانی تر هەوڵ دەدەن جاسوسەکە بناسن\n• کاتێک پێتوایە دەزانیت کێ جاسوسە، دەنگ بدە!'
                            : "• Everyone gets the same location except the spy\n• Players take turns asking questions\n• The spy tries to figure out the location\n• Others try to identify the spy\n• Vote when you think you know who the spy is!"
                        }
                    </Text>
                </View>

                {/* Start Button */}
                <View style={styles.buttonContainer}>
                    <Button
                        title={t('common.start', language)}
                        onPress={startGame}
                        disabled={!canStart}
                        gradient={[COLORS.accent.success, COLORS.accent.success]}
                        icon={<Ionicons name="play" size={20} color="#FFF" />}
                        isKurdish={isKurdish}
                    />
                    {!canStart && (
                        <Text style={[styles.minPlayersHint, rtlStyles, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'لانیکەم ٣ یاریزان زیاد بکە بۆ دەستپێکردن' : 'Add at least 3 players to start'}
                        </Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLORS.background.dark,
    },
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
    scrollContent: {
        padding: SPACING.lg,
        paddingBottom: 120,
    },

    sectionTitle: {
        color: COLORS.text.secondary, ...FONTS.medium,
        marginBottom: SPACING.md, marginTop: SPACING.lg,
        textTransform: 'uppercase', fontSize: 13, letterSpacing: 1,
    },

    settingCard: {
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    settingHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
    iconBox: {
        width: 40, height: 40, borderRadius: 8,
        alignItems: 'center', justifyContent: 'center',
    },
    settingLabel: { color: COLORS.text.primary, ...FONTS.medium },
    settingDesc: { color: COLORS.text.muted, fontSize: 12 },

    toggleRow: { flexDirection: 'row', backgroundColor: COLORS.background.secondary, borderRadius: 8, padding: 2 },
    toggleButton: {
        paddingVertical: 6, paddingHorizontal: 16, borderRadius: 6,
    },
    toggleActiveGreen: { backgroundColor: COLORS.accent.success },
    toggleText: { color: COLORS.text.secondary, fontWeight: '600' },
    toggleTextActive: { color: '#FFF' },

    durationGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    durationItem: {
        flex: 1,
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    durationSelected: {
        borderColor: COLORS.accent.success,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    durationText: { color: COLORS.text.secondary, ...FONTS.medium },
    durationTextSelected: { color: COLORS.accent.success },

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

    buttonContainer: {
        marginTop: SPACING.xl,
        marginBottom: 50,
    },
    minPlayersHint: {
        color: COLORS.text.muted,
        textAlign: 'center',
        marginTop: SPACING.sm,
        fontSize: 13,
    },
    kurdishFont: { fontFamily: 'Rabar' },
});
