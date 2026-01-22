import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button, PlayerInput } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { getAllWordCategories } from '../../constants/imposterWords';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../localization/translations';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ImposterSetupScreen({ navigation }) {
    const [players, setPlayers] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('food');
    const [imposterCount, setImposterCount] = useState(1);

    const { language, isKurdish } = useLanguage();
    const categories = getAllWordCategories(language);
    const canStart = players.length >= 3;

    // RTL styles
    const rtlStyles = {
        textAlign: isKurdish ? 'right' : 'left',
        writingDirection: isKurdish ? 'rtl' : 'ltr',
    };
    const rowDirection = isKurdish ? 'row-reverse' : 'row';

    const startGame = () => {
        navigation.navigate('ImposterPlay', {
            players,
            category: selectedCategory,
            imposterCount,
        });
    };

    // Get translated category name
    const getCategoryName = (catKey) => {
        const cat = categories.find(c => c.key === catKey);
        return cat ? cat.name : catKey;
    };

    return (
        <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View style={[styles.header, { flexDirection: rowDirection }]}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name={isKurdish ? "arrow-forward" : "arrow-back"} size={24} color={COLORS.text.primary} />
                </TouchableOpacity>
                <Text style={[styles.title, isKurdish && styles.kurdishFont]}>
                    {t('imposter.title', language)}
                </Text>
                <View style={styles.placeholder} />
            </View>

            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
                alwaysBounceVertical={true}
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

                {/* Imposter Count */}
                <View style={[styles.settingCard, { flexDirection: rowDirection }]}>
                    <View style={[styles.settingHeader, { flexDirection: rowDirection }]}>
                        <View style={styles.iconBox}>
                            <Ionicons name="eye-off-outline" size={20} color={COLORS.accent.danger} />
                        </View>
                        <View style={isKurdish && { alignItems: 'flex-end' }}>
                            <Text style={[styles.settingLabel, isKurdish && styles.kurdishFont]}>
                                {t('imposter.imposters', language)}
                            </Text>
                            <Text style={[styles.settingDesc, isKurdish && styles.kurdishFont]}>
                                {t('imposter.numberOfImposters', language)}
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.toggleRow, { flexDirection: rowDirection }]}>
                        {[1, 2].map(count => (
                            <TouchableOpacity
                                key={count}
                                style={[
                                    styles.toggleButton,
                                    imposterCount === count && styles.toggleActive
                                ]}
                                onPress={() => setImposterCount(count)}
                            >
                                <Text style={[
                                    styles.toggleText,
                                    imposterCount === count && styles.toggleTextActive
                                ]}>{count}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Category Selection */}
                <Text style={[styles.sectionTitle, rtlStyles, isKurdish && styles.kurdishFont]}>
                    {t('common.category', language)}
                </Text>
                <View style={styles.categoryGrid}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.key}
                            style={[
                                styles.categoryItem,
                                selectedCategory === cat.key && styles.categorySelected
                            ]}
                            onPress={() => setSelectedCategory(cat.key)}
                            activeOpacity={0.7}
                        >
                            <View style={[
                                styles.catIcon,
                                selectedCategory === cat.key && styles.catIconSelected
                            ]}>
                                <Ionicons
                                    name={cat.icon}
                                    size={24}
                                    color={selectedCategory === cat.key ? '#FFF' : COLORS.text.secondary}
                                />
                            </View>
                            <Text style={[
                                styles.categoryText,
                                selectedCategory === cat.key && styles.categoryTextSelected,
                                isKurdish && styles.kurdishFont
                            ]}>
                                {getCategoryName(cat.key)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Start Button */}
                <View style={styles.buttonContainer}>
                    <Button
                        title={t('common.start', language)}
                        onPress={startGame}
                        disabled={!canStart}
                        gradient={[COLORS.accent.danger, COLORS.accent.danger]}
                        icon={<Ionicons name="play" size={20} color="#FFF" />}
                        isKurdish={isKurdish}
                    />
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
        zIndex: 1,
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

    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.lg,
        paddingBottom: 250,
        flexGrow: 1,
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
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        alignItems: 'center', justifyContent: 'center',
    },
    settingLabel: { color: COLORS.text.primary, ...FONTS.medium },
    settingDesc: { color: COLORS.text.muted, fontSize: 12 },

    toggleRow: { flexDirection: 'row', backgroundColor: COLORS.background.secondary, borderRadius: 8, padding: 2 },
    toggleButton: {
        paddingVertical: 6, paddingHorizontal: 16, borderRadius: 6,
    },
    toggleActive: { backgroundColor: COLORS.accent.danger },
    toggleText: { color: COLORS.text.secondary, fontWeight: '600' },
    toggleTextActive: { color: '#FFF' },

    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    categoryItem: {
        width: '47%',
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        alignItems: 'center',
        borderWidth: 1, borderColor: 'transparent',
    },
    categorySelected: {
        borderColor: COLORS.accent.danger,
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
    },
    catIcon: {
        width: 48, height: 48, borderRadius: 24,
        backgroundColor: COLORS.background.secondary,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: SPACING.sm,
    },
    catIconSelected: { backgroundColor: COLORS.accent.danger },
    categoryText: { color: COLORS.text.secondary, ...FONTS.medium },
    categoryTextSelected: { color: COLORS.text.primary },

    buttonContainer: {
        marginTop: SPACING.xl,
        marginBottom: 100,
    },
    kurdishFont: {
        fontFamily: 'Rabar',
    },
});
