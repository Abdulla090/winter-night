import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Eye, EyeOff, Clock, Play, Info } from 'lucide-react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';

import { AnimatedScreen, BeastButton, GlassCard, PlayerInput, BackButton } from '../../components';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../localization/translations';
import { layout } from '../../theme/layout';

const GAME_DURATIONS = [3, 5, 8, 10]; // minutes

export default function SpyfallSetupScreen({ navigation }) {
    const [players, setPlayers] = useState([]);
    const [gameDuration, setGameDuration] = useState(5);
    const [spyCount, setSpyCount] = useState(1);

    const { language, isKurdish } = useLanguage();
    const { colors, isRTL } = useTheme();
    const canStart = players.length >= 3;

    const rowDirection = isRTL ? 'row-reverse' : 'row';

    const startGame = () => {
        navigation.navigate('SpyfallPlay', {
            players,
            gameDuration,
            spyCount,
        });
    };

    return (
        <AnimatedScreen>
            {/* Header */}
            <View style={[styles.header, { flexDirection: rowDirection }]}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={[styles.headerTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                    {t('spyfall.title', language)}
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
                    <View style={[styles.heroIcon, { backgroundColor: colors.brand.mountain + '20' }]}>
                        <Eye size={48} color={colors.brand.mountain} strokeWidth={1.5} />
                    </View>
                </MotiView>

                {/* Players Section */}
                <GlassCard style={{ marginBottom: layout.spacing.lg }}>
                    <View style={[styles.sectionHeader, { flexDirection: rowDirection }]}>
                        <Eye size={18} color={colors.brand.mountain} style={{ marginHorizontal: 8 }} />
                        <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                            {t('common.players', language)}
                        </Text>
                    </View>
                    <PlayerInput
                        players={players}
                        setPlayers={setPlayers}
                        minPlayers={3}
                        maxPlayers={12}
                        isKurdish={isKurdish}
                        language={language}
                    />
                </GlassCard>

                {/* Spy Count */}
                <GlassCard style={{ marginBottom: layout.spacing.lg }}>
                    <View style={[styles.sectionHeader, { flexDirection: rowDirection }]}>
                        <EyeOff size={18} color={colors.brand.mountain} style={{ marginHorizontal: 8 }} />
                        <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                            {isKurdish ? 'ژمارەی جاسوسەکان' : 'Number of Spies'}
                        </Text>
                    </View>
                    <View style={[styles.toggleRow, { flexDirection: rowDirection }]}>
                        {[1, 2].map(count => (
                            <TouchableOpacity
                                key={count}
                                style={[
                                    styles.toggleButton,
                                    {
                                        backgroundColor: spyCount === count ? colors.brand.mountain : colors.surface,
                                        borderColor: spyCount === count ? colors.brand.mountain : colors.border,
                                    }
                                ]}
                                onPress={() => setSpyCount(count)}
                            >
                                <Text style={[
                                    styles.toggleText,
                                    { color: spyCount === count ? '#FFF' : colors.text.secondary }
                                ]}>{count}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </GlassCard>

                {/* Game Duration */}
                <GlassCard style={{ marginBottom: layout.spacing.lg }}>
                    <View style={[styles.sectionHeader, { flexDirection: rowDirection }]}>
                        <Clock size={18} color={colors.accent} style={{ marginHorizontal: 8 }} />
                        <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                            {isKurdish ? 'ماوەی قۆناغ' : 'Round Duration'}
                        </Text>
                    </View>
                    <View style={[styles.durationRow, { flexDirection: rowDirection }]}>
                        {GAME_DURATIONS.map((duration) => (
                            <TouchableOpacity
                                key={duration}
                                style={[
                                    styles.durationPill,
                                    {
                                        backgroundColor: gameDuration === duration ? colors.brand.mountain : colors.surface,
                                        borderColor: gameDuration === duration ? colors.brand.mountain : colors.border,
                                    }
                                ]}
                                onPress={() => setGameDuration(duration)}
                            >
                                <Text style={[
                                    styles.durationText,
                                    { color: gameDuration === duration ? '#FFF' : colors.text.secondary },
                                    isKurdish && styles.kurdishFont
                                ]}>
                                    {duration} {isKurdish ? 'خولەک' : 'min'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </GlassCard>

                {/* How to Play */}
                <GlassCard>
                    <View style={[styles.sectionHeader, { flexDirection: rowDirection }]}>
                        <Info size={18} color={colors.accent} style={{ marginHorizontal: 8 }} />
                        <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                            {t('common.howToPlay', language)}
                        </Text>
                    </View>
                    <Text style={[styles.rulesText, { color: colors.text.muted, textAlign: isRTL ? 'right' : 'left' }, isKurdish && styles.kurdishFont]}>
                        {isKurdish
                            ? '• هەموان شوێنی یەکسانیان دەزانن تەنها جاسوس نەبێت\n• یاریزانەکان نۆرەبەت پرسیار دەکەن\n• جاسوسەکە هەوڵ دەدات شوێنەکە بزانێت\n• کەسەکانی تر هەوڵ دەدەن جاسوسەکە بناسن\n• کاتێک پێتوایە دەزانیت کێ جاسوسە، دەنگ بدە!'
                            : "• Everyone gets the same location except the spy\n• Players take turns asking questions\n• The spy tries to figure out the location\n• Others try to identify the spy\n• Vote when you think you know who the spy is!"
                        }
                    </Text>
                </GlassCard>
            </ScrollView>

            {/* Start Button */}
            <MotiView
                animate={{ translateY: canStart ? 0 : 100, opacity: canStart ? 1 : 0 }}
                style={styles.fabContainer}
            >
                <BeastButton
                    title={t('common.start', language)}
                    onPress={startGame}
                    variant="secondary"
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
    toggleRow: {
        gap: 12,
        justifyContent: 'center',
    },
    toggleButton: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: layout.radius.lg,
        borderWidth: 1,
    },
    toggleText: {
        fontWeight: '700',
        fontSize: 16,
    },
    durationRow: {
        gap: 8,
        flexWrap: 'wrap',
    },
    durationPill: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: layout.radius.full,
        borderWidth: 1,
    },
    durationText: {
        fontWeight: '600',
        fontSize: 14,
    },
    rulesText: {
        lineHeight: 24,
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
