import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import { Users, Clock, Play, Check } from 'lucide-react-native';
import { MotiView } from 'moti';

import { AnimatedScreen, BeastButton, GlassCard, PlayerInput, BackButton } from '../../components';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../localization/translations';
import { getAllCategories } from '../../constants/whoAmIData';
import { layout } from '../../theme/layout';

export default function SetupScreen({ navigation }) {
    const [players, setPlayers] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('celebrities');
    const [roundTime, setRoundTime] = useState(60);

    const { language, isKurdish } = useLanguage();
    const { colors, isRTL } = useTheme();
    const categories = getAllCategories(language);
    const canStart = players.length >= 2;

    const rowStyle = { flexDirection: isRTL ? 'row-reverse' : 'row' };

    const startGame = () => {
        navigation.navigate('WhoAmIPlay', {
            players,
            category: selectedCategory,
            roundTime,
            currentPlayerIndex: 0,
            scores: players.reduce((acc, player) => ({ ...acc, [player]: 0 }), {}),
        });
    };

    const getCategoryName = (catKey) => {
        const cat = categories.find(c => c.key === catKey);
        return cat ? cat.name : catKey;
    };

    return (
        <AnimatedScreen>
            {/* Header */}
            <View style={[styles.header, rowStyle]}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                    {t('whoAmI.title', language)}
                </Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Players Section */}
                <GlassCard style={{ marginTop: layout.spacing.md }}>
                    <View style={[styles.sectionHeader, rowStyle]}>
                        <Users size={18} color={colors.brand.gold} style={{ marginHorizontal: 8 }} />
                        <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                            {t('common.players', language)}
                        </Text>
                    </View>
                    <PlayerInput
                        players={players}
                        setPlayers={setPlayers}
                        minPlayers={2}
                        maxPlayers={10}
                        isKurdish={isKurdish}
                        language={language}
                    // We might need to adjust PlayerInput internals later if checking "themeOverride"
                    />
                </GlassCard>

                {/* Categories */}
                <Text style={[styles.dividerLabel, { color: colors.text.muted, textAlign: isRTL ? 'right' : 'left' }]}>
                    {t('common.chooseCategory', language)}
                </Text>

                <View style={[styles.grid, rowStyle, { flexWrap: 'wrap' }]}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.key}
                            onPress={() => setSelectedCategory(cat.key)}
                            activeOpacity={0.8}
                            style={[
                                styles.catCard,
                                {
                                    backgroundColor: selectedCategory === cat.key ? colors.brand.gold + '15' : colors.surface,
                                    borderColor: selectedCategory === cat.key ? colors.brand.gold : 'transparent',
                                    borderWidth: 1,
                                    ...layout.shadows.sm,
                                }
                            ]}
                        >
                            <Text style={[
                                styles.catTitle,
                                { color: selectedCategory === cat.key ? colors.brand.gold : colors.text.primary }
                            ]}>
                                {getCategoryName(cat.key)}
                            </Text>
                            {selectedCategory === cat.key && (
                                <View style={[styles.checkBadge, { backgroundColor: colors.brand.gold }]}>
                                    <Check size={10} color="#FFF" strokeWidth={3} />
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Time Selection */}
                <GlassCard style={{ marginTop: layout.spacing.xl }}>
                    <View style={[styles.sectionHeader, rowStyle]}>
                        <Clock size={18} color={colors.brand.crimson} style={{ marginHorizontal: 8 }} />
                        <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                            {t('common.roundTime', language)}
                        </Text>
                    </View>
                    <View style={[styles.timeRow, rowStyle]}>
                        {[30, 60, 90, 120].map((time) => (
                            <TouchableOpacity
                                key={time}
                                onPress={() => setRoundTime(time)}
                                style={[
                                    styles.timePill,
                                    {
                                        backgroundColor: roundTime === time ? colors.brand.crimson : 'transparent',
                                        borderColor: colors.border
                                    }
                                ]}
                            >
                                <Text style={{ color: roundTime === time ? '#FFF' : colors.text.secondary, fontWeight: '600' }}>
                                    {time}s
                                </Text>
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
                    title={t('common.start', language)}
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
        marginBottom: layout.spacing.sm,
        marginTop: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
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
        marginTop: layout.spacing.xl,
        marginBottom: layout.spacing.md,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    grid: {
        gap: 8,
    },
    catCard: {
        width: '48%', // Approx
        padding: 16,
        borderRadius: layout.radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    catTitle: {
        fontWeight: '600',
        fontSize: 14,
        textAlign: 'center',
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
    timeRow: {
        justifyContent: 'space-between',
        gap: 8,
    },
    timePill: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
    },
    fabContainer: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
    }
});
