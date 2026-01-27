import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Eye, EyeOff, Play } from 'lucide-react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';

import { AnimatedScreen, BeastButton, GlassCard, PlayerInput, BackButton } from '../../components';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../localization/translations';
import { layout } from '../../theme/layout';
import { getAllWordCategories } from '../../constants/imposterWords';

export default function ImposterSetupScreen({ navigation }) {
    const [players, setPlayers] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('food');
    const [imposterCount, setImposterCount] = useState(1);

    const { language, isKurdish } = useLanguage();
    const { colors, isRTL } = useTheme();
    const categories = getAllWordCategories(language);
    const canStart = players.length >= 3;

    const rowDirection = isRTL ? 'row-reverse' : 'row';

    const startGame = () => {
        navigation.navigate('ImposterPlay', {
            players,
            category: selectedCategory,
            imposterCount,
        });
    };

    const getCategoryName = (catKey) => {
        const cat = categories.find(c => c.key === catKey);
        return cat ? cat.name : catKey;
    };

    return (
        <AnimatedScreen>
            {/* Header */}
            <View style={[styles.header, { flexDirection: rowDirection }]}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={[styles.headerTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                    {t('imposter.title', language)}
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
                    <View style={[styles.heroIcon, { backgroundColor: colors.brand.crimson + '20' }]}>
                        <EyeOff size={48} color={colors.brand.crimson} strokeWidth={1.5} />
                    </View>
                </MotiView>

                {/* Players Section */}
                <GlassCard style={{ marginBottom: layout.spacing.lg }}>
                    <View style={[styles.sectionHeader, { flexDirection: rowDirection }]}>
                        <Eye size={18} color={colors.brand.crimson} style={{ marginHorizontal: 8 }} />
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

                {/* Imposter Count */}
                <GlassCard style={{ marginBottom: layout.spacing.lg }}>
                    <View style={[styles.sectionHeader, { flexDirection: rowDirection }]}>
                        <EyeOff size={18} color={colors.brand.crimson} style={{ marginHorizontal: 8 }} />
                        <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                            {t('imposter.imposters', language)}
                        </Text>
                    </View>
                    <View style={[styles.toggleRow, { flexDirection: rowDirection }]}>
                        {[1, 2].map(count => (
                            <TouchableOpacity
                                key={count}
                                style={[
                                    styles.toggleButton,
                                    {
                                        backgroundColor: imposterCount === count ? colors.brand.crimson : colors.surface,
                                        borderColor: imposterCount === count ? colors.brand.crimson : colors.border,
                                    }
                                ]}
                                onPress={() => setImposterCount(count)}
                            >
                                <Text style={[
                                    styles.toggleText,
                                    { color: imposterCount === count ? '#FFF' : colors.text.secondary }
                                ]}>{count}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </GlassCard>

                {/* Category Selection */}
                <Text style={[styles.dividerLabel, { color: colors.text.muted, textAlign: isRTL ? 'right' : 'left' }]}>
                    {t('common.category', language)}
                </Text>
                <View style={[styles.categoryGrid, { flexDirection: rowDirection, flexWrap: 'wrap' }]}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.key}
                            style={[
                                styles.categoryCard,
                                {
                                    backgroundColor: selectedCategory === cat.key ? colors.brand.crimson + '15' : colors.surface,
                                    borderColor: selectedCategory === cat.key ? colors.brand.crimson : 'transparent',
                                    ...layout.shadows.sm,
                                }
                            ]}
                            onPress={() => setSelectedCategory(cat.key)}
                            activeOpacity={0.8}
                        >
                            <View style={[
                                styles.catIcon,
                                {
                                    backgroundColor: selectedCategory === cat.key ? colors.brand.crimson : colors.surfaceHighlight,
                                }
                            ]}>
                                <Ionicons
                                    name={cat.icon}
                                    size={24}
                                    color={selectedCategory === cat.key ? '#FFF' : colors.text.secondary}
                                />
                            </View>
                            <Text style={[
                                styles.categoryText,
                                { color: selectedCategory === cat.key ? colors.brand.crimson : colors.text.primary },
                                isKurdish && styles.kurdishFont
                            ]}>
                                {getCategoryName(cat.key)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Start Button */}
            <MotiView
                animate={{ translateY: canStart ? 0 : 100, opacity: canStart ? 1 : 0 }}
                style={styles.fabContainer}
            >
                <BeastButton
                    title={t('common.start', language)}
                    onPress={startGame}
                    variant="danger"
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
