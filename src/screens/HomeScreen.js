import React, { memo, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    FlatList,
    useWindowDimensions,
    Platform,
    Image,
    ScrollView,
    TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import * as Haptics from 'expo-haptics';
import {
    Bell,
    Search,
    SlidersHorizontal, // Filter icon
    Play,
    Zap,
    Trophy,
    Users,
    Gamepad2,
    Sparkles,
    Flame,
    HelpCircle,
    EyeOff,
    Mic,
    Link,
    Repeat,
    HeartHandshake,
    Aperture,
    Brush,
    ArrowRightLeft,
    Hand,
    MessageSquare,
    Globe,
    User,
    Compass,
    Grid,
    Home,
    LogIn
} from 'lucide-react-native';

import { AnimatedScreen } from '../components/AnimatedScreen';
import { GlassCard } from '../components/GlassCard';
import { BottomNavBar } from '../components/BottomNavBar';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { layout } from '../theme/layout';
import { textShadows } from '../lib/utils';
import { t } from '../localization/translations';
import gameImages from '../assets/gameImages';

// --- COMPONENTS ---

const HeaderSection = ({ isKurdish, colors, isDark, onToggleLanguage, onNotificationPress, userName, isAuthenticated, onLoginPress }) => {
    // ☀️ Theme-aware colors
    const iconBtnBg = isDark ? '#1C0F2E' : '#FFFFFF';
    const iconBtnBorder = isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0';
    const bellColor = isDark ? '#FFF' : colors.primary;
    const avatarBorder = isDark ? '#EAC545' : colors.primary;
    const notificationBadge = isDark ? '#D900FF' : colors.primary;
    const loginBtnBg = isDark ? '#7C3AED' : colors.primary;

    return (
        <View style={styles.headerContainer}>
            {/* Left Side: Notification & Language */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                    style={[styles.iconButton, { backgroundColor: iconBtnBg, borderColor: iconBtnBorder }]}
                    onPress={onNotificationPress}
                >
                    <Bell size={22} color={bellColor} />
                    <View style={[styles.notificationBadge, { backgroundColor: notificationBadge }]} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.iconButton, { backgroundColor: iconBtnBg, borderColor: iconBtnBorder }]}
                    onPress={onToggleLanguage}
                >
                    <Globe size={22} color={colors.text.secondary} />
                </TouchableOpacity>
            </View>

            {/* Profile Info or Login Button */}
            {isAuthenticated ? (
                <View style={styles.profileContainer}>
                    <View style={{ alignItems: isKurdish ? 'flex-start' : 'flex-end', marginHorizontal: 12 }}>
                        <Text style={[styles.welcomeSubtitle, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'بەخێربێیتەوە' : 'Welcome back'}
                        </Text>
                        <Text style={[styles.welcomeTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                            {userName || (isKurdish ? 'میوان' : 'Guest')}
                        </Text>
                    </View>
                    <View style={[styles.avatarCircle, { borderColor: avatarBorder }]}>
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/150?img=11' }}
                            style={styles.avatarImage}
                        />
                    </View>
                </View>
            ) : (
                <TouchableOpacity
                    style={[styles.loginButton, { backgroundColor: loginBtnBg }]}
                    onPress={onLoginPress}
                    activeOpacity={0.8}
                >
                    <LogIn size={18} color="#FFF" />
                    <Text style={[styles.loginButtonText, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'چوونەژوورەوە' : 'Login'}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const SearchBar = ({ isKurdish, colors, isDark, onSearchPress, onFilterPress }) => {
    // ☀️ Theme-aware search bar
    const searchBg = isDark ? '#170B26' : '#FFFFFF';
    const searchBorder = isDark ? '#2D1B4E' : '#E2E8F0';
    const filterColor = isDark ? '#D900FF' : colors.primary;
    const searchIconColor = isDark ? '#6B5A8A' : colors.text.muted;

    return (
        <View style={styles.searchContainer}>
            <TouchableOpacity
                style={[styles.searchBar, { backgroundColor: searchBg, borderColor: searchBorder }]}
                onPress={onSearchPress}
                activeOpacity={0.8}
            >
                {/* Filter Icon (Left) */}
                <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress}>
                    <SlidersHorizontal size={20} color={filterColor} />
                </TouchableOpacity>

                <Text style={[
                    styles.searchPlaceholder,
                    { color: colors.text.muted },
                    isKurdish && { textAlign: 'right', fontFamily: 'Rabar' }
                ]}>
                    {isKurdish ? 'گەڕان بۆ یاری...' : 'Search for games...'}
                </Text>

                {/* Search Icon (Right) */}
                <Search size={20} color={searchIconColor} style={{ marginLeft: 10 }} />
            </TouchableOpacity>
        </View>
    );
};

const ImmersiveFeaturedCard = ({ item, onPress, isKurdish, colors, isDark }) => {
    // ☀️ Theme-appropriate overlay - lighter gradient for light mode
    const cardGradient = isDark
        ? (item.featured
            ? ['transparent', 'rgba(15, 5, 24, 0.4)', 'rgba(15, 5, 24, 0.95)']
            : ['transparent', 'rgba(0,0,0,0.8)'])
        : ['transparent', 'rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.95)'];

    // ☀️ Theme-aware button gradient
    const playBtnGradient = isDark
        ? ['#D900FF', '#B026FF']
        : ['#0EA5E9', '#0284C7']; // Sky Blue gradient

    const badgeBg = isDark ? '#D900FF' : colors.primary;

    // Light mode text should be dark for contrast on light overlay
    const titleColor = isDark ? '#FFF' : colors.text.primary;
    const subtitleColor = isDark ? 'rgba(255,255,255,0.7)' : colors.text.secondary;

    return (
        <View
            style={[styles.featuredCardContainer, !isDark && { borderColor: '#E2E8F0' }]}
        >
            <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={{ flex: 1 }}>

                {/* Game Image Background */}
                {item.image ? (
                    <Image
                        source={item.image}
                        style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
                        resizeMode="cover"
                    />
                ) : (
                    <LinearGradient
                        colors={item.gradient || [colors.surface, colors.surfaceHighlight]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                    />
                )}

                {/* Overlay for text readability */}
                <LinearGradient
                    colors={cardGradient}
                    style={StyleSheet.absoluteFill}
                />

                {/* Content */}
                <View style={styles.featuredContent}>
                    {/* Tags */}
                    <View style={styles.tagRow}>
                        <View style={[styles.newBadge, { backgroundColor: badgeBg }]}>
                            <Text style={[styles.newBadgeText, isKurdish && styles.kurdishFont]}>
                                {isKurdish ? 'تازە' : 'NEW'}
                            </Text>
                        </View>
                        <GlassCard intensity={20} style={styles.playerBadge}>
                            <Text style={[styles.playerBadgeText, isKurdish && styles.kurdishFont]}>
                                {item.players} {isKurdish ? 'یاریزان' : 'Players'}
                            </Text>
                        </GlassCard>
                    </View>

                    <View style={{ flex: 1 }} />

                    {/* Title & Desc */}
                    <Text style={[styles.featuredTitle, { color: titleColor }, isKurdish && styles.kurdishFont]}>
                        {item.title}
                    </Text>
                    <Text style={[styles.featuredSubtitle, { color: subtitleColor }, isKurdish && styles.kurdishFont]} numberOfLines={1}>
                        {item.description}
                    </Text>

                    {/* Play Button */}
                    <TouchableOpacity style={styles.playButton} onPress={onPress}>
                        <LinearGradient
                            colors={playBtnGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.playButtonGradient}
                        >
                            <Play size={18} color="#FFF" fill="#FFF" />
                            <Text style={[styles.playButtonText, isKurdish && styles.kurdishFont]}>
                                {isKurdish ? 'ئێستا یاری بکە' : 'Play Now'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Decorative Icon Background */}
                <View style={styles.bgIconContainer}>
                    {item.Icon && <item.Icon size={200} color="rgba(255,255,255,0.06)" />}
                </View>
            </TouchableOpacity>
        </View>
    );
};

const ContinuePlayingCard = ({ item, onPress, isKurdish, colors, isDark }) => {
    // ☀️ Theme-aware colors
    const cardBg = isDark ? '#1A0B2E' : '#FFFFFF';
    const cardBorder = isDark ? 'rgba(255,255,255,0.05)' : '#E2E8F0';
    const playBtnBg = isDark ? 'rgba(217, 0, 255, 0.15)' : 'rgba(14, 165, 233, 0.1)';
    const playIconColor = isDark ? '#D900FF' : colors.primary;
    const metaColor = isDark ? '#6B5A8A' : colors.text.muted;

    return (
        <View
            style={[styles.continueCardContainer, { backgroundColor: cardBg, borderColor: cardBorder }]}
        >
            <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.continueRow}>

                {/* 1. Play Button on Left */}
                <View style={[styles.miniPlayBtn, { backgroundColor: playBtnBg }]}>
                    <Play size={16} color={playIconColor} fill={playIconColor} />
                </View>

                {/* 2. Text Content (Middle) */}
                <View style={[styles.continueInfo, isKurdish && { alignItems: 'flex-end' }]}>
                    <Text style={[styles.continueTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <View style={styles.continueMetaRow}>
                        <Users size={12} color={metaColor} />
                        <Text style={[styles.continueMetaText, { color: metaColor }, isKurdish && styles.kurdishFont]}>
                            {item.players} {isKurdish ? 'یاریزان' : 'players'} • 2 {isKurdish ? 'کاتژمێر' : 'hrs'}
                        </Text>
                    </View>
                </View>

                {/* 3. Game Image/Gradient Square (Right) */}
                {item.image ? (
                    <Image
                        source={item.image}
                        style={styles.continueImage}
                        resizeMode="cover"
                    />
                ) : (
                    <LinearGradient
                        colors={item.gradient || [colors.surface, colors.surfaceHighlight]}
                        style={styles.continueImage}
                    >
                        {item.Icon && <item.Icon size={28} color="#FFF" opacity={0.8} />}
                    </LinearGradient>
                )}

            </TouchableOpacity>
        </View>
    );
};

const CategoryCard = ({ item, onPress, isKurdish, colors, isDark }) => {
    // ☀️ Theme-aware category card
    const cardBg = isDark ? '#1E1231' : '#FFFFFF';
    const cardBorder = isDark ? 'rgba(255,255,255,0.05)' : '#E2E8F0';

    return (
        <TouchableOpacity
            style={[styles.categoryCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
            onPress={onPress}
        >
            <View style={[styles.categoryIconCircle, { backgroundColor: item.color + '20' }]}>
                {item.Icon && <item.Icon size={26} color={item.color} />}
            </View>
            <Text style={[styles.categoryText, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );
};

// --- MAIN SCREEN ---

export default function HomeScreen({ navigation }) {
    const { language, isKurdish, toggleLanguage } = useLanguage();
    const { colors, isRTL, isDark } = useTheme();
    const { profile, user } = useAuth();
    const { width } = useWindowDimensions();

    // Check if user is authenticated
    const isLoggedIn = !!user;

    // Get user's display name from profile or email
    const userName = profile?.username || user?.user_metadata?.username || (user?.email ? user.email.split('@')[0] : null);

    const getIcon = (name) => {
        const icons = {
            triangle: Zap, 'help-circle': HelpCircle, 'eye-off': EyeOff, search: Search,
            flame: Flame, mic: Mic, link: Link, trophy: Trophy, aperture: Aperture,
            brush: Brush, 'swap-horizontal': ArrowRightLeft, 'hand-left': Hand,
            'message-square': MessageSquare, 'heart-handshake': HeartHandshake,
            default: Gamepad2
        };
        return icons[name] || icons.default;
    };

    const GAMES = [
        // Featured
        { id: 'truthordare', title: t('games.truthOrDare.title', language), description: t('games.truthOrDare.description', language), players: '2-20', icon: 'flame', gradient: ['#F97316', '#C2410C'], screen: 'TruthOrDareSetup', featured: true, image: gameImages.truthordare },
        { id: 'pyramid', title: t('pyramid.title', language), description: t('pyramid.description', language), players: '4+', icon: 'triangle', gradient: ['#F59E0B', '#B45309'], screen: 'PyramidSetup', featured: true, image: gameImages.pyramid },

        // Continue Playing / List - Reordered
        { id: 'quiz', title: t('games.quiz.title', language), description: t('games.quiz.description', language), players: '1-10', icon: 'trophy', gradient: ['#EAB308', '#A16207'], screen: 'QuizSetup', image: gameImages.quiz },
        { id: 'spyfall', title: t('games.spyfall.title', language), description: t('games.spyfall.description', language), players: '3-12', icon: 'search', gradient: ['#10B981', '#064E3B'], screen: 'SpyfallSetup', image: gameImages.spyfall },
        { id: 'whoami', title: t('games.whoAmI.title', language), description: t('games.whoAmI.description', language), players: '2-10', icon: 'help-circle', gradient: ['#3B82F6', '#1E3A8A'], screen: 'WhoAmISetup', image: gameImages.whoami },

        // Categories (Mapped from remaining games)
        { id: 'imposter', title: t('games.imposter.title', language), icon: 'eye-off', color: '#EF4444', screen: 'ImposterSetup', image: gameImages.imposter },
        { id: 'drawguess', title: t('games.drawGuess.title', language), icon: 'brush', color: '#06B6D4', screen: 'DrawGuessSetup', image: gameImages.drawguess },
        { id: 'wheel', title: t('wheel.title', language), icon: 'aperture', color: '#EC4899', screen: 'WheelSetup', image: gameImages.wheel },
        { id: 'partners', title: t('partnersInCrime.title', language), icon: 'heart-handshake', color: '#F43F5E', screen: 'PartnersInCrimeSetup', image: gameImages.partners },
    ];

    const featuredGames = GAMES.filter(g => g.featured).map(g => ({ ...g, Icon: getIcon(g.icon), image: g.image }));
    const continueGames = GAMES.slice(2, 5).map(g => ({ ...g, Icon: getIcon(g.icon), image: g.image }));
    const categoryGames = GAMES.slice(5).map(g => ({
        id: g.id, name: g.title, Icon: getIcon(g.icon), color: g.color || colors.primary, screen: g.screen, image: g.image
    }));

    return (
        <AnimatedScreen>

            <View style={{ flex: 1 }}>

                {/* 1. Header */}
                <HeaderSection
                    isKurdish={isKurdish}
                    colors={colors}
                    isDark={isDark}
                    onToggleLanguage={toggleLanguage}
                    userName={userName}
                    isAuthenticated={isLoggedIn}
                    onLoginPress={() => navigation.navigate('Login')}
                    onNotificationPress={() => {
                        alert(isKurdish ? 'هیچ ئاگادارکردنەوەیەک نییە' : 'No notifications');
                    }}
                />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 120 }}
                    style={{ flex: 1 }}
                    nestedScrollEnabled={true}
                    overScrollMode="never"
                    bounces={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* 2. Search Bar - Navigates to Library */}
                    <SearchBar
                        isKurdish={isKurdish}
                        colors={colors}
                        isDark={isDark}
                        onSearchPress={() => navigation.navigate('AllGames')}
                        onFilterPress={() => navigation.navigate('AllGames')}
                    />

                    {/* PLAY ONLINE - Prominent Card */}
                    <TouchableOpacity
                        style={[styles.playOnlineCard, !isDark && { borderColor: colors.border, borderWidth: 1 }]}
                        activeOpacity={0.9}
                        onPress={() => navigation.navigate('CreateRoom')}
                    >
                        <LinearGradient
                            colors={isDark
                                ? ['#7C3AED', '#4F46E5', '#2563EB']
                                : ['#0EA5E9', '#38BDF8', '#7DD3FC']
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFill}
                        />
                        <View style={styles.playOnlineContent}>
                            <View style={styles.playOnlineLeft}>
                                <View style={styles.playOnlineIconWrap}>
                                    <Globe size={28} color="#FFF" />
                                </View>
                                <View>
                                    <Text style={[styles.playOnlineTitle, isKurdish && styles.kurdishFont]}>
                                        {isKurdish ? 'یاری ئۆنلاین' : 'Play Online'}
                                    </Text>
                                    <Text style={[styles.playOnlineSubtitle, isKurdish && styles.kurdishFont]}>
                                        {isKurdish ? 'لەگەڵ هاوڕێکانت یاری بکە' : 'Play with friends anywhere'}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.playOnlineArrow}>
                                <Sparkles size={24} color="#FFF" />
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* 3. Featured Section */}
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'یارییە باوەکان' : 'Featured Games'}
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('AllGames')}>
                            <Text style={[styles.seeAllText, { color: colors.primary }, isKurdish && styles.kurdishFont]}>
                                {isKurdish ? 'هەمووی ببینە' : 'See All'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        horizontal
                        data={isKurdish ? [...featuredGames].reverse() : featuredGames}
                        keyExtractor={(item) => item.id}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 4 }}
                        decelerationRate="fast"
                        snapToInterval={306}
                        snapToAlignment="start"
                        nestedScrollEnabled={true}
                        disableIntervalMomentum={true}
                        directionalLockEnabled={true}
                        style={{ marginBottom: 28 }}
                        renderItem={({ item, index }) => (
                            <ImmersiveFeaturedCard
                                key={item.id}
                                item={item}
                                index={index}
                                isKurdish={isKurdish}
                                colors={colors}
                                isDark={isDark}
                                onPress={() => navigation.navigate(item.screen)}
                            />
                        )}
                    />

                    {/* 4. Continue Playing */}
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'بەردەوامی یاریەکان' : 'Continue Playing'}
                        </Text>
                    </View>

                    <View style={{ gap: 14, marginBottom: 28 }}>
                        {continueGames.map((item) => (
                            <ContinuePlayingCard
                                key={item.id}
                                item={item}
                                isKurdish={isKurdish}
                                colors={colors}
                                isDark={isDark}
                                onPress={() => navigation.navigate(item.screen)}
                            />
                        ))}
                    </View>

                    {/* 5. Categories */}
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'هاوپۆلەکان' : 'Categories'}
                        </Text>
                    </View>

                    <View style={styles.categoriesGrid}>
                        {categoryGames.map((item) => (
                            <CategoryCard
                                key={item.id}
                                item={item}
                                isKurdish={isKurdish}
                                colors={colors}
                                isDark={isDark}
                                onPress={() => navigation.navigate(item.screen)}
                            />
                        ))}
                    </View>

                </ScrollView>
            </View>

        </AnimatedScreen>
    );
}

// --- STYLES (Pixel Perfect) ---
const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Platform.OS === 'android' ? 16 : 0,
        marginBottom: 20,
        paddingHorizontal: 4,
    },
    iconButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#1C0F2E', // Dark Purple
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    notificationBadge: {
        position: 'absolute',
        top: 14,
        right: 14,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#D900FF', // Neon Pink
        borderWidth: 1.5,
        borderColor: '#1C0F2E',
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    welcomeSubtitle: {
        color: '#6B5A8A', // Muted Purple
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 2,
    },
    welcomeTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    avatarCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#EAC545', // Gold accent from image (or Pink #D900FF)
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    loginButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        gap: 8,
    },
    loginButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },

    // Search Bar
    searchContainer: {
        marginBottom: 24,
        paddingHorizontal: 4,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#170B26', // Very Dark Purple
        borderRadius: 20,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: '#2D1B4E', // Subtle border
    },
    filterBtn: {
        marginRight: 12,
        padding: 4,
    },
    searchInput: {
        flex: 1,
        color: '#FFF',
        fontSize: 15,
        height: '100%',
        fontWeight: '500',
    },
    searchPlaceholder: {
        flex: 1,
        color: '#6B5A8A',
        fontSize: 15,
        fontWeight: '500',
    },

    // Section Headers
    sectionHeader: {
        flexDirection: 'row-reverse', // RTL alignment visual trick
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    sectionTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '800', // Extra bold like image
        letterSpacing: 0.5,
    },
    seeAllText: {
        color: '#D900FF', // Neon Pink
        fontSize: 13,
        fontWeight: '700',
    },

    // Featured Card
    featuredCardContainer: {
        width: 290,
        height: 360,
        borderRadius: 36,
        marginRight: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        backgroundColor: '#1E1231',
    },
    featuredContent: {
        flex: 1,
        padding: 24,
        zIndex: 2,
    },
    tagRow: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    newBadge: {
        backgroundColor: '#D900FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    newBadgeText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '800',
    },
    playerBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 100,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderWidth: 0,
    },
    playerBadgeText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '600',
    },
    featuredTitle: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: '800',
        textAlign: 'right',
        marginBottom: 8,
        lineHeight: 40,
        // Text shadow for readability on image backgrounds
        ...textShadows.strong,
    },
    featuredSubtitle: {
        color: '#FFF',
        fontSize: 14,
        textAlign: 'right',
        marginBottom: 24,
        fontWeight: '500',
        // Text shadow for readability
        ...textShadows.medium,
    },
    playButton: {
        width: '100%',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#D900FF',
        shadowOpacity: 0.6,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 8 },
        elevation: 12,
    },
    playButtonGradient: {
        paddingVertical: 16,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    playButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    bgIconContainer: {
        position: 'absolute',
        top: 20,
        left: -40,
        opacity: 1,
        zIndex: 1,
    },

    // Continue Card Pixel Perfect
    continueCardContainer: {
        width: '100%',
        height: 80, // Taller
        borderRadius: 24,
        backgroundColor: '#1A0B2E', // Dark Purple Surface
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
    },
    continueRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    miniPlayBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(217, 0, 255, 0.15)', // Subtle pink bg
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },
    continueInfo: {
        flex: 1,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    continueTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 6,
    },
    continueMetaRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 6,
    },
    continueMetaText: {
        color: '#6B5A8A',
        fontSize: 12,
        fontWeight: '500',
    },
    continueImage: {
        width: 60,
        height: 60,
        borderRadius: 18, // Squircle
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Categories
    categoriesGrid: {
        flexDirection: 'row-reverse',
        flexWrap: 'wrap',
        gap: 16,
    },
    categoryCard: {
        flex: 1,
        minWidth: '45%',
        aspectRatio: 1.4,
        backgroundColor: '#1E1231',
        borderRadius: 28,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    categoryIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },

    // Bottom Nav Floater
    floatingNavContainer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 100,
    },
    floatingNavBar: {
        flexDirection: 'row',
        backgroundColor: '#150824', // Almost Black Purple
        borderRadius: 40,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 30,
        elevation: 25,
        width: '90%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    navItem: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navItemActive: {
        width: 60,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeNavCircle: {
        width: 54,
        height: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#D900FF',
        shadowOpacity: 0.6,
        shadowRadius: 12,
        elevation: 10,
        marginTop: -20, // Pop out
        borderWidth: 4,
        borderColor: '#0F0518', // Match bg to cut out
    },

    // Play Online Card
    playOnlineCard: {
        marginBottom: 24,
        borderRadius: 20,
        overflow: 'hidden',
        height: 80,
    },
    playOnlineContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    playOnlineLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    playOnlineIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    playOnlineTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '800',
    },
    playOnlineSubtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        fontWeight: '500',
        marginTop: 2,
    },
    playOnlineArrow: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    kurdishFont: {
        fontFamily: 'Rabar',
    },
});
