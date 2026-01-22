import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, MotiText } from 'moti';
import { Clock, Users, Play, ChevronLeft, ChevronRight, Check } from 'lucide-react-native';

import { GradientBackground, Button, PlayerInput } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, GLASS } from '../../constants/theme';
import { getAllCategories } from '../../constants/whoAmIData';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../localization/translations';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

// --- MODERN COMPONENTS ---

const GlassSection = ({ children, style, delay = 0 }) => (
    <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400, delay }}
        style={[styles.glassCardWrapper, style]}
    >
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.glassContent}>{children}</View>
    </MotiView>
);

const SelectionCard = ({ label, icon, selected, onPress, isKurdish }) => {
    const { theme } = useTheme();
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={[styles.selectionCardOuter]}
        >
            <MotiView
                animate={{
                    borderColor: selected ? COLORS.games.whoAmI[0] : 'rgba(255,255,255,0.1)',
                    backgroundColor: selected ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.03)',
                    scale: selected ? 1.02 : 1,
                }}
                transition={{ type: 'timing', duration: 200 }}
                style={styles.selectionCardInner}
            >
                <Ionicons
                    name={icon}
                    size={24}
                    color={selected ? COLORS.games.whoAmI[1] : theme.text.secondary}
                    style={{ marginBottom: 8 }}
                />
                <Text style={[
                    styles.selectionText,
                    selected && { color: COLORS.games.whoAmI[1], fontWeight: '700' },
                    isKurdish && styles.kurdishFont
                ]}>
                    {label}
                </Text>

                {selected && (
                    <View style={styles.checkBadge}>
                        <Check size={10} color="#FFF" strokeWidth={4} />
                    </View>
                )}
            </MotiView>
        </TouchableOpacity>
    );
};

export default function SetupScreen({ navigation }) {
    const [players, setPlayers] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('celebrities');
    const [roundTime, setRoundTime] = useState(60);

    const { language, isKurdish } = useLanguage();
    const { theme } = useTheme();
    const categories = getAllCategories(language);
    const canStart = players.length >= 2;

    const rtlStyles = {
        textAlign: isKurdish ? 'right' : 'left',
        writingDirection: isKurdish ? 'rtl' : 'ltr',
    };
    const rowDirection = isKurdish ? 'row-reverse' : 'row';

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
        <GradientBackground>
            {/* Sticky Glass Header */}
            <BlurView intensity={80} tint="dark" style={styles.stickyHeader}>
                <SafeAreaView edges={['top']} style={{ flex: 1 }}>
                    <View style={[styles.headerContent, { flexDirection: rowDirection }]}>
                        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                            {isKurdish ? <ChevronRight color="#FFF" size={24} /> : <ChevronLeft color="#FFF" size={24} />}
                        </TouchableOpacity>
                        <Text style={[styles.headerTitle, isKurdish && styles.kurdishFont]}>
                            {t('whoAmI.title', language)}
                        </Text>
                        <View style={{ width: 40 }} />
                    </View>
                </SafeAreaView>
            </BlurView>

            <ScrollView
                contentContainerStyle={[styles.scrollContent]}
                showsVerticalScrollIndicator={false}
            >
                {/* 1. Players Section (Glass) */}
                <GlassSection delay={100}>
                    <View style={[styles.sectionHeader, { flexDirection: rowDirection }]}>
                        <Users size={18} color={COLORS.games.whoAmI[0]} style={{ marginRight: 8 }} />
                        <Text style={[styles.sectionTitle, isKurdish && styles.kurdishFont]}>
                            {t('common.players', language)}
                        </Text>
                    </View>

                    {/* We need to update PlayerInput to be transparent/glass friendly or wrap it */}
                    {/* For now, we assume PlayerInput handles its own transparency or we simply contain it */}
                    <PlayerInput
                        players={players}
                        setPlayers={setPlayers}
                        minPlayers={2}
                        maxPlayers={10}
                        isKurdish={isKurdish}
                        language={language}
                        themeOverride="glass"
                    />
                </GlassSection>

                {/* 2. Categories Grid */}
                <Text style={[styles.sectionLabel, rtlStyles, isKurdish && styles.kurdishFont]}>
                    {t('common.chooseCategory', language)}
                </Text>

                <View style={[styles.gridContainer, { flexDirection: rowDirection, flexWrap: 'wrap' }]}>
                    {categories.map((cat) => (
                        <SelectionCard
                            key={cat.key}
                            label={getCategoryName(cat.key)}
                            icon={cat.icon}
                            selected={selectedCategory === cat.key}
                            onPress={() => setSelectedCategory(cat.key)}
                            isKurdish={isKurdish}
                        />
                    ))}
                </View>

                {/* 3. Timer Selection */}
                <GlassSection delay={200} style={{ marginTop: SPACING.xl }}>
                    <View style={[styles.sectionHeader, { flexDirection: rowDirection }]}>
                        <Clock size={18} color={COLORS.games.whoAmI[0]} style={{ marginRight: 8 }} />
                        <Text style={[styles.sectionTitle, isKurdish && styles.kurdishFont]}>
                            {t('common.roundTime', language)}
                        </Text>
                    </View>

                    <View style={[styles.timeRow, { flexDirection: rowDirection }]}>
                        {[30, 60, 90, 120].map((time) => (
                            <TouchableOpacity
                                key={time}
                                onPress={() => setRoundTime(time)}
                                style={[
                                    styles.timePill,
                                    roundTime === time && { backgroundColor: COLORS.games.whoAmI[0], borderColor: COLORS.games.whoAmI[0] }
                                ]}
                            >
                                <Text style={[
                                    styles.timeText,
                                    roundTime === time && { color: '#FFF' }
                                ]}>
                                    {time}s
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </GlassSection>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Floating Action Button (FAB) for Start */}
            <MotiView
                from={{ translateY: 100 }}
                animate={{ translateY: canStart ? 0 : 100 }}
                style={styles.fabContainer}
            >
                <TouchableOpacity onPress={startGame} activeOpacity={0.9} style={{ width: '100%' }}>
                    <LinearGradient
                        colors={COLORS.games.whoAmI}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.startButton, { flexDirection: rowDirection }]}
                    >
                        <Text style={[styles.startText, isKurdish && styles.kurdishFont]}>
                            {t('common.start', language)}
                        </Text>
                        <Play size={20} color="#FFF" fill="#FFF" style={isKurdish ? { marginRight: 8 } : { marginLeft: 8 }} />
                    </LinearGradient>
                </TouchableOpacity>
            </MotiView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    stickyHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        paddingBottom: SPACING.md,
    },
    headerContent: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        justifyContent: 'space-between',
        height: 50,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    backBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },

    scrollContent: {
        paddingTop: 120, // Space for header
        paddingHorizontal: SPACING.lg,
        paddingBottom: 40,
    },

    // Glass Section
    glassCardWrapper: {
        borderRadius: BORDER_RADIUS.xl,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginBottom: SPACING.lg,
    },
    glassContent: {
        padding: SPACING.lg,
    },
    sectionHeader: {
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    sectionLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: SPACING.lg,
        marginBottom: SPACING.md,
    },

    // Grid
    gridContainer: {
        gap: SPACING.sm,
    },
    selectionCardOuter: {
        width: '48%', // Approx 2 columns
        marginBottom: SPACING.sm,
    },
    selectionCardInner: {
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        minHeight: 100,
    },
    selectionText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
    },
    checkBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: COLORS.games.whoAmI[0],
        borderRadius: 10,
        width: 16,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Time Selection
    timeRow: {
        justifyContent: 'space-between',
    },
    timePill: {
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        minWidth: 60,
        alignItems: 'center',
    },
    timeText: {
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '600',
    },

    // FAB
    fabContainer: {
        position: 'absolute',
        bottom: 40,
        left: SPACING.lg,
        right: SPACING.lg,
    },
    startButton: {
        height: 56,
        borderRadius: BORDER_RADIUS.pill, // Make it very round
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.games.whoAmI[0],
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
    startText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },

    kurdishFont: {
        fontFamily: 'Rabar',
    },
});
