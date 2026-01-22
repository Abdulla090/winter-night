import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    FlatList,
    Platform,
    Dimensions
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, MotiText } from 'moti';
import {
    Settings,
    Globe,
    Zap,
    Trophy,
    Users,
    Play,
    Plus,
    Gamepad2,
    Sparkles,
    Flame,
    HelpCircle,
    EyeOff,
    Search,
    Mic,
    Link,
    Repeat,
    HeartHandshake
} from 'lucide-react-native';

import { GradientBackground } from '../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, GLASS } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { t } from '../localization/translations';

const { width } = Dimensions.get('window');

// --- MODERN COMPONENTS ---

const GlassCard = ({ children, style, intensity = 20, tint = 'dark' }) => (
    <View style={[styles.glassCardWrapper, style]}>
        <BlurView intensity={intensity} tint={tint} style={StyleSheet.absoluteFill} />
        <View style={styles.glassContent}>{children}</View>
    </View>
);

const SectionHeader = ({ title, icon: Icon, color }) => (
    <View style={styles.sectionHeader}>
        {Icon && <Icon size={18} color={color || '#FFF'} style={{ marginRight: 8, opacity: 0.8 }} />}
        <Text style={styles.sectionTitle}>{title}</Text>
    </View>
);

const GameCardModern = ({ item, index, onPress, isKurdish, featured }) => {
    const { theme } = useTheme();

    // Map internal IDs to Lucide Icons
    const getIcon = (iconName) => {
        switch (iconName) {
            case 'triangle': return Zap;
            case 'help-circle': return HelpCircle;
            case 'eye-off': return EyeOff;
            case 'search': return Search;
            case 'flame': return Flame;
            case 'mic': return Mic;
            case 'link': return Link;
            case 'repeat': return Repeat;
            case 'heart-handshake': return HeartHandshake;
            default: return Gamepad2;
        }
    };

    const Icon = getIcon(item.icon);
    const gradientColors = Array.isArray(item.gradient) ? item.gradient : [item.gradient, item.gradient];

    return (
        <MotiView
            from={{ opacity: 0, scale: 0.9, translateY: 20 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400, delay: index * 100 }}
            style={[
                featured ? styles.featuredCardContainer : styles.gridCardContainer,
                isKurdish && { direction: 'rtl' }
            ]}
        >
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={onPress}
                style={{ flex: 1 }}
            >
                <LinearGradient
                    colors={featured ? [...gradientColors] : [theme.background.card, theme.background.card]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                        styles.cardGradient,
                        featured && { padding: SPACING.lg },
                        !featured && { borderWidth: 1, borderColor: theme.background.border }
                    ]}
                >
                    {/* Featured Background Decor */}
                    {featured && (
                        <View style={styles.featuredDecor}>
                            <Icon size={180} color="#FFF" style={{ opacity: 0.1, transform: [{ rotate: '-15deg' }] }} />
                        </View>
                    )}

                    {!featured && (
                        <View style={[styles.miniIcon, { backgroundColor: gradientColors[0] + '20' }]}>
                            <Icon size={24} color={gradientColors[0]} />
                        </View>
                    )}

                    <View style={styles.cardContent}>
                        {featured && (
                            <View style={[styles.featuredBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                                <Sparkles size={12} color="#FFF" style={{ marginRight: 4 }} />
                                <Text style={styles.featuredBadgeText}>{isKurdish ? 'نوێترین' : 'FEATURED'}</Text>
                            </View>
                        )}

                        <Text
                            style={[
                                featured ? styles.featuredTitle : styles.cardTitle,
                                isKurdish && styles.kurdishFont,
                                !featured && { color: theme.text.primary }
                            ]}
                            numberOfLines={1}
                        >
                            {item.title}
                        </Text>

                        <Text
                            style={[
                                featured ? styles.featuredDesc : styles.cardDesc,
                                isKurdish && styles.kurdishFont,
                                !featured && { color: theme.text.secondary }
                            ]}
                            numberOfLines={2}
                        >
                            {item.description}
                        </Text>

                        {/* Footer / Meta */}
                        <View style={[styles.cardFooter, { marginTop: 'auto', paddingTop: SPACING.sm }]}>
                            <View style={styles.playerTag}>
                                <Users size={12} color={featured ? 'rgba(255,255,255,0.7)' : theme.text.muted} />
                                <Text style={[
                                    styles.playerText,
                                    { color: featured ? 'rgba(255,255,255,0.9)' : theme.text.secondary }
                                ]}>
                                    {item.players}
                                </Text>
                            </View>
                            {featured && (
                                <View style={styles.playBtn}>
                                    <Play size={16} color={gradientColors[0]} fill={gradientColors[0]} />
                                </View>
                            )}
                        </View>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        </MotiView>
    );
};

export default function HomeScreen({ navigation }) {
    const { language, isKurdish, toggleLanguage } = useLanguage();
    const { theme } = useTheme();

    const GAMES = [
        { id: 'pyramid', title: t('pyramid.title', language), description: t('pyramid.description', language), players: '4+', icon: 'triangle', gradient: COLORS.games.pyramid, screen: 'PyramidSetup', featured: true },
        { id: 'whoami', title: t('games.whoAmI.title', language), description: t('games.whoAmI.description', language), players: '2-10', icon: 'help-circle', gradient: COLORS.games.whoAmI, screen: 'WhoAmISetup' },
        { id: 'imposter', title: t('games.imposter.title', language), description: t('games.imposter.description', language), players: '3-10', icon: 'eye-off', gradient: COLORS.games.imposter, screen: 'ImposterSetup' },
        { id: 'spyfall', title: t('games.spyfall.title', language), description: t('games.spyfall.description', language), players: '3-12', icon: 'search', gradient: COLORS.games.spyfall, screen: 'SpyfallSetup' },
        { id: 'truthordare', title: t('games.truthOrDare.title', language), description: t('games.truthOrDare.description', language), players: '2-20', icon: 'flame', gradient: COLORS.games.truthOrDare, screen: 'TruthOrDareSetup' },
        { id: 'neverhaveiever', title: t('games.neverHaveIEver.title', language), description: t('games.neverHaveIEver.description', language), players: '2-20', icon: 'hand-left', gradient: COLORS.games.neverHaveIEver, screen: 'NeverHaveIEverSetup' },
        { id: 'wouldyourather', title: t('games.wouldYouRather.title', language), description: t('games.wouldYouRather.description', language), players: '2-20', icon: 'swap-horizontal', gradient: COLORS.games.wouldYouRather, screen: 'WouldYouRatherSetup' },
        { id: 'quiz', title: t('games.quiz.title', language), description: t('games.quiz.description', language), players: '1-10', icon: 'trophy', gradient: COLORS.games.quiz, screen: 'QuizSetup' },
        { id: 'drawguess', title: t('games.drawGuess.title', language), description: t('games.drawGuess.description', language), players: '2-10', icon: 'brush', gradient: COLORS.games.drawGuess, screen: 'DrawGuessSetup' },
        { id: 'wheel', title: t('wheel.title', language), description: t('wheel.description', language) || "Spin the wheel", players: '2+', icon: 'aperture', gradient: COLORS.games.wheel, screen: 'WheelSetup' },
        { id: 'emojidecoder', title: isKurdish ? 'دەربازی ئیمۆجی' : 'Emoji Decoder', description: isKurdish ? 'ئیمۆجییەکان چی دەڵێن؟' : 'Guess the word from emojis!', players: '1-10', icon: 'help-circle', gradient: ['#ec4899', '#8b5cf6'], screen: 'EmojiDecoderSetup' },
        { id: 'forbiddenword', title: isKurdish ? 'وشەی قەدەغە' : 'Forbidden Word', description: isKurdish ? 'باسی بکە بەبێ وشە قەدەغەکان!' : 'Describe without forbidden words!', players: '4+', icon: 'eye-off', gradient: ['#ef4444', '#dc2626'], screen: 'ForbiddenWordSetup' },
        { id: 'lyricschallenge', title: isKurdish ? 'تەحەدای گۆرانی' : 'Lyrics Challenge', description: isKurdish ? 'ئەمە گۆرانی کێیە؟' : 'Guess the song from lyrics!', players: '1-10', icon: 'mic', gradient: ['#ec4899', '#db2777'], screen: 'LyricsChallengeSetup' },
        { id: 'wordchain', title: isKurdish ? 'زنجیرەی وشە' : 'Word Chain', description: isKurdish ? 'وشەی داهاتوو بڵێ، خێرا!' : 'Say the next word, fast!', players: '2+', icon: 'link', gradient: ['#f59e0b', '#d97706'], screen: 'WordChainPlay' },
        { id: 'reversecharades', title: isKurdish ? 'پێچەوانەی چارێد' : 'Reverse Charades', description: isKurdish ? 'گروپەکە نواندن دەکات!' : 'Team acts, one guesses!', players: '4+', icon: 'repeat', gradient: ['#8b5cf6', '#7c3aed'], screen: 'ReverseCharadesSetup' },
        { id: 'partnersincrime', title: isKurdish ? 'هاوبەشی تاوان' : 'Partners in Crime', description: isKurdish ? 'چەند یەکتری دەناسن؟' : 'How well do you know them?', players: '2', icon: 'heart-handshake', gradient: ['#db2777', '#be185d'], screen: 'PartnersInCrimeSetup' },
    ];

    const featuredGame = GAMES.find(g => g.featured);
    const otherGames = GAMES.filter(g => !g.featured);

    const renderHeader = () => (
        <View style={{ paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl }}>
            {/* Greeting */}
            <MotiView
                from={{ opacity: 0, translateY: -20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 500 }}
                style={styles.greetingContainer}
            >
                <View>
                    <Text style={[styles.greetingSub, { color: theme.text.muted }]}>
                        {isKurdish ? 'بەخێربێیت بۆ' : 'WELCOME TO'}
                    </Text>
                    <Text style={[styles.greetingTitle, { color: theme.text.primary }]}>
                        Winter Nights
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={toggleLanguage}
                    style={[styles.langBtn, { borderColor: theme.background.border }]}
                >
                    <Text style={[styles.langText, { color: theme.colors.primary }]}>
                        {isKurdish ? 'EN' : 'KU'}
                    </Text>
                </TouchableOpacity>
            </MotiView>

            {/* Online Play Card (Glass) */}
            <GlassCard style={styles.onlineCard} intensity={30} tint="dark">
                <View style={[styles.onlineHeader, isKurdish && { flexDirection: 'row-reverse' }]}>
                    <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary }]}>
                        <Globe size={24} color="#FFF" />
                    </View>
                    <View style={{ flex: 1, paddingHorizontal: 12 }}>
                        <Text style={[styles.onlineTitle, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'یاری ئۆنلاین' : 'Online Multiplayer'}
                        </Text>
                        <Text style={[styles.onlineDesc, { color: 'rgba(255,255,255,0.6)' }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'یاری بکە لەگەڵ هاوڕێکانت' : 'Play with friends remotely'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.joinBtn}
                        onPress={() => navigation.navigate('JoinRoom')}
                    >
                        <Text style={styles.joinBtnText}>{isKurdish ? 'جۆین' : 'JOIN'}</Text>
                    </TouchableOpacity>
                </View>
            </GlassCard>

            {/* Featured Section */}
            <SectionHeader title={isKurdish ? 'نوێترین یاری' : 'FEATURED GAME'} icon={Sparkles} color={theme.colors.warning} />
            {featuredGame && (
                <GameCardModern
                    item={featuredGame}
                    featured={true}
                    onPress={() => navigation.navigate(featuredGame.screen)}
                    index={0}
                    isKurdish={isKurdish}
                />
            )}

            <View style={{ height: SPACING.lg }} />

            {/* All Games Label */}
            <SectionHeader title={isKurdish ? 'هەموو یارییەکان' : 'ALL GAMES'} icon={Gamepad2} color={theme.colors.info} />
        </View>
    );

    return (
        <GradientBackground>
            <StatusBar barStyle="light-content" />

            {/* Sticky Glass Header */}
            <BlurView intensity={80} tint="dark" style={[styles.stickyHeader, { borderBottomColor: theme.background.border }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                    <Sparkles size={20} color={theme.colors.primary} />
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                        <Settings size={24} color={theme.text.primary} />
                    </TouchableOpacity>
                </View>
            </BlurView>

            <FlatList
                data={otherGames}
                renderItem={({ item, index }) => (
                    <GameCardModern
                        item={item}
                        index={index + 1} // Offset by 1 for animation delay
                        onPress={() => navigation.navigate(item.screen)}
                        isKurdish={isKurdish}
                    />
                )}
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: SPACING.lg }}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={{ paddingTop: 80, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    stickyHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 80, // Covers status bar + simple nav
        zIndex: 100,
        paddingTop: 40,
        paddingHorizontal: SPACING.lg,
        borderBottomWidth: 1,
    },
    greetingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xl,
        marginTop: SPACING.sm,
    },
    greetingSub: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1.5,
        marginBottom: 4,
    },
    greetingTitle: {
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        fontWeight: '800',
        fontSize: 32,
        letterSpacing: -1,
    },
    langBtn: {
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    langText: {
        fontWeight: '700',
        fontSize: 12,
    },

    // Cards
    gridCardContainer: {
        width: (width - SPACING.lg * 2 - SPACING.md) / 2,
        height: 180,
        marginBottom: SPACING.md,
    },
    featuredCardContainer: {
        width: '100%',
        height: 220,
        marginBottom: SPACING.md,
    },
    cardGradient: {
        flex: 1,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.md,
        justifyContent: 'space-between',
        overflow: 'hidden',
    },
    featuredDecor: {
        position: 'absolute',
        right: -40,
        bottom: -40,
    },
    miniIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 12,
        lineHeight: 16,
    },
    featuredTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 8,
    },
    featuredDesc: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        maxWidth: '70%',
    },

    // Featured Badge
    featuredBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    featuredBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
    },

    // Footer
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    playerTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    playerText: {
        fontSize: 12,
        fontWeight: '600',
    },
    playBtn: {
        backgroundColor: '#FFF',
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Online Card
    onlineCard: {
        marginBottom: SPACING.xl,
        borderRadius: BORDER_RADIUS.xl,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    glassCardWrapper: {
        overflow: 'hidden',
    },
    glassContent: {
        padding: SPACING.md,
    },
    onlineHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    onlineTitle: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    onlineDesc: {
        fontSize: 12,
    },
    joinBtn: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    joinBtnText: {
        fontWeight: 'bold',
        fontSize: 12,
        color: '#000',
    },

    // Section Header
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
        opacity: 0.9,
    },
    sectionTitle: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },

    kurdishFont: {
        fontFamily: 'Rabar',
    },
});
