import React, { useState, memo, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Pressable,
    StatusBar,
    FlatList,
    useWindowDimensions,
    Platform,
    TextInput,
    Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { AnimatedListItem } from '../components/AnimatedListItem';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
import * as Haptics from 'expo-haptics';
import {
    User,
    Search,
    Star,
    Clock,
    Users,
    Zap, // Newest
    Sparkles,
    Filter,
    ArrowRight,
    ArrowLeft,
    Gamepad2,
    HelpCircle,
    Copy,
    Puzzle,
    PenTool,
    Dice5,
    AlertTriangle,
    Brush,
    MessageSquare,
    LayoutGrid,
    List
} from 'lucide-react-native';

import { AnimatedScreen } from '../components/AnimatedScreen';
import { BottomNavBar } from '../components/BottomNavBar';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { t } from '../localization/translations';
import { layout } from '../theme/layout';
import gameImages from '../assets/gameImages';
import { BackButton } from '../components/BackButton';

// --- COMPONENTS ---

// 1. Header with Back Button
const Header = ({ isKurdish, navigation, colors, isDark, isTwoColumns, setIsTwoColumns }) => {
    const iconBtnBg = isDark ? '#1C0F2E' : '#FFFFFF';
    const iconBtnBorder = isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0';
    const arrowColor = isDark ? '#FFF' : colors.text.primary;

    const handleGoBack = useCallback(() => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        navigation.goBack();
    }, [navigation]);

    const toggleLayout = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        setIsTwoColumns(!isTwoColumns);
    };

    return (
        <View style={[styles.header, { flexDirection: isKurdish ? 'row-reverse' : 'row' }]}>
            <BackButton onPress={handleGoBack} />

            <Text style={[styles.headerTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                {isKurdish ? 'هەموو یارییەکان' : 'All Games'}
            </Text>

            <TouchableOpacity 
                activeOpacity={0.7} 
                onPress={toggleLayout}
                style={[styles.iconButton, { backgroundColor: iconBtnBg, borderColor: iconBtnBorder }]}
            >
                {isTwoColumns ? <List size={22} color={colors.text.primary} /> : <LayoutGrid size={22} color={colors.text.primary} />}
            </TouchableOpacity>
        </View>
    );
};

// 2. Search Bar with theme support
const SearchInput = ({ isKurdish, value, onChangeText, colors, isDark }) => {
    const searchBg = isDark ? '#170B26' : '#FFFFFF';
    const searchBorder = isDark ? '#2D1B4E' : '#E2E8F0';
    const placeholderColor = isDark ? 'rgba(255,255,255,0.4)' : colors.text.muted;
    const textColor = isDark ? '#FFF' : colors.text.primary;

    return (
        <View style={styles.searchContainer}>
            <TextInput
                placeholder={isKurdish ? 'گەڕان بۆ یارییەکان...' : 'Search for games...'}
                placeholderTextColor={placeholderColor}
                value={value}
                onChangeText={onChangeText}
                style={[
                    styles.searchInput,
                    { backgroundColor: searchBg, borderColor: searchBorder, color: textColor },
                    isKurdish && { textAlign: 'right', fontFamily: 'Rabar', paddingRight: 12 }
                ]}
            />
            <View style={styles.searchIconPos}>
                <Search size={20} color={placeholderColor} />
            </View>
        </View>
    );
};

// 3. Filters - Now with active state and onPress
// 3. Filters with theme support
const FilterTabs = ({ isKurdish, activeFilter, onFilterChange, colors, isDark }) => {
    // Authentic Categories exactly matching HomeScreen
    const tabs = [
        { id: 'all', label: isKurdish ? 'هەمووی' : 'All' },
        { id: 'social', label: isKurdish ? 'کۆمەڵایەتی' : 'Social', icon: Users },
        { id: 'brain', label: isKurdish ? 'مێشک' : 'Brain', icon: Zap },
        { id: 'drawing', label: isKurdish ? 'وێنەکێشان' : 'Drawing', icon: Brush },
        { id: 'classic', label: isKurdish ? 'کلاسیک' : 'Classics', icon: Dice5 },
        { id: 'word', label: isKurdish ? 'وشە' : 'Word Games', icon: MessageSquare },
        { id: 'new', label: isKurdish ? 'نوێترین' : 'Newest', icon: Sparkles },
    ];

    // ☀️ Theme-aware filter colors
    const activeColor = isDark ? '#D900FF' : colors.primary;
    const inactiveColor = isDark ? '#CBA6F7' : colors.text.secondary;
    const inactiveBg = isDark ? 'rgba(28, 15, 46, 0.6)' : 'rgba(14, 165, 233, 0.08)';
    const inactiveBorder = isDark ? '#2D1B4E' : '#E2E8F0';

    return (
        <View style={styles.filterRow}>
            {tabs.map((tab) => {
                const isActive = activeFilter === tab.id;
                const IconComponent = tab.icon;

                return (
                    <TouchableOpacity
                        key={tab.id}
                        onPress={() => onFilterChange(tab.id)}
                        style={[
                            styles.filterPill,
                            isActive
                                ? [styles.filterActive, { backgroundColor: activeColor, borderColor: activeColor }]
                                : { backgroundColor: inactiveBg, borderColor: inactiveBorder }
                        ]}
                    >
                        {IconComponent && (
                            <IconComponent
                                size={14}
                                color={isActive ? '#FFF' : inactiveColor}
                                style={{ marginRight: 6 }}
                            />
                        )}
                        <Text style={[
                            styles.filterText,
                            isKurdish && styles.kurdishFont,
                            { color: isActive ? '#FFF' : inactiveColor }
                        ]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

// 4. Responsive Card with theme support - Memoized for performance
const GameGridCard = memo(({ item, isKurdish, navigation, cardWidth, colors, isDark, isTwoColumns }) => {
    const Icon = item.Icon || Gamepad2;
    const cardBg = isDark ? '#160925' : '#FFFFFF';
    const cardBorder = isDark ? 'rgba(255,255,255,0.05)' : '#E2E8F0';
    const badgeBg = isDark ? '#D900FF' : colors.primary;
    const metaColor = isDark ? '#8A8A8A' : colors.text.muted;

    // ✨ Reanimated spring press — UI thread, zero bridge cost
    const scale = useSharedValue(1);
    const animStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePress = useCallback(async () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        
        // Save to Recent Games Automatically
        try {
            const AsyncStorage = require('@react-native-async-storage/async-storage').default;
            if (AsyncStorage) {
                const saved = await AsyncStorage.getItem('recent_games');
                let recent = saved ? JSON.parse(saved) : [];
                recent = [item.id, ...recent.filter(id => id !== item.id)].slice(0, 3);
                await AsyncStorage.setItem('recent_games', JSON.stringify(recent));
            }
        } catch(e) {}

        navigation.navigate(item.screen);
    }, [navigation, item]);

    return (
        <AnimatedPressable
            onPressIn={() => { scale.value = withSpring(0.96, { damping: 15, stiffness: 450 }); }}
            onPressOut={() => { scale.value = withSpring(1, { damping: 12, stiffness: 300 }); }}
            onPress={handlePress}
            style={[styles.cardContainer, { width: cardWidth, backgroundColor: cardBg, borderColor: cardBorder }, animStyle]}
        >
            {/* Top Visual Box */}
            <View style={[styles.cardVisual, isTwoColumns ? {} : { height: 260 }]}>
                {item.image ? (
                    <Image
                        source={item.image}
                        style={styles.cardImage}
                        resizeMode="cover"
                    />
                ) : (
                    <LinearGradient
                        colors={item.colors || ['#4C1D95', '#5B21B6']}
                        style={StyleSheet.absoluteFill}
                    >
                        <View style={styles.cardIconFallback}>
                            <Icon size={isTwoColumns ? 52 : 72} color="rgba(255,255,255,0.8)" />
                        </View>
                    </LinearGradient>
                )}

                {/* Rating Badge */}
                <View style={styles.ratingBadge}>
                    <Star size={isTwoColumns ? 10 : 12} color="#FFD700" fill="#FFD700" />
                    <Text style={[styles.ratingText, isTwoColumns ? {} : { fontSize: 13 }]}>{item.rating || '4.5'}</Text>
                </View>

                {item.isNew && (
                    <View style={[styles.newBadge, { backgroundColor: badgeBg }]}>
                        <Text style={[styles.newText, isKurdish && styles.kurdishFont, isTwoColumns ? {} : { fontSize: 13, paddingHorizontal: 4 }]}>
                            {isKurdish ? 'نوێ' : 'NEW'}
                        </Text>
                    </View>
                )}
            </View>

            {/* Bottom Info */}
            <View style={[styles.cardInfo, isTwoColumns ? {} : { paddingVertical: 12, paddingHorizontal: 12 }]}>
                <Text style={[styles.cardTitle, { color: colors.text.primary }, isTwoColumns ? {} : { fontSize: 24, marginBottom: 12 }, isKurdish && styles.kurdishFont]} numberOfLines={1}>
                    {item.title}
                </Text>

                <View style={[styles.metaRow, isKurdish && { flexDirection: 'row-reverse' }]}>
                    <View style={styles.metaItem}>
                        <Clock size={isTwoColumns ? 12 : 16} color={metaColor} />
                        <Text style={[styles.metaText, { color: metaColor }, isTwoColumns ? {} : { fontSize: 14 }, isKurdish && styles.kurdishFont]}>
                            {item.time || '10'}m
                        </Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Users size={isTwoColumns ? 12 : 16} color={metaColor} />
                        <Text style={[styles.metaText, { color: metaColor }, isTwoColumns ? {} : { fontSize: 14 }, isKurdish && styles.kurdishFont]}>
                            {item.players || '2-6'}
                        </Text>
                    </View>
                </View>
            </View>
        </AnimatedPressable>
    );
});

// --- MAIN SCREEN ---
export default function AllGamesScreen({ route, navigation }) {
    const { language, isKurdish } = useLanguage();
    const { colors, isDark } = useTheme();
    const { width } = useWindowDimensions();

    const incomingFilterId = route?.params?.filterId;

    // State for search and filters
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState(incomingFilterId || 'all');
    const [isTwoColumns, setIsTwoColumns] = useState(false);

    // Responsive Calculation
    // AnimatedScreen adds layout.screen.padding (24px) on each side = 48px total
    const numColumns = isTwoColumns ? 2 : 1;
    const gap = 8;
    const gridPadding = 0; // no extra padding — let AnimatedScreen handle it
    const screenPadding = 24; // AnimatedScreen's paddingHorizontal (layout.screen.padding)
    const containerWidth = Platform.OS === 'web' ? Math.min(width, 500) : width;
    const availableWidth = containerWidth - (screenPadding * 2) - gap;
    const cardWidth = Math.floor(availableWidth / numColumns);

    // Real Games Data
    const GAMES = [
        {
            id: 'twotruths',
            title: isKurdish ? 'دوو ڕاستی و درۆیەک' : 'Two Truths',
            screen: 'TwoTruthsSetup',
            colors: ['#7C3AED', '#4C1D95'],
            Icon: Dice5,
            rating: '4.9',
            time: '15',
            players: '3+',
            isNew: true,
            category: 'social',
            image: gameImages.twotruths
        },
        {
            id: 'zarumar',
            title: isKurdish ? 'زار و مار' : 'Zar u Mar',
            screen: 'ZarWMarSetup',
            colors: ['#059669', '#064E3B'],
            Icon: Dice5,
            rating: '4.7',
            time: '15',
            players: '2-4',
            isNew: true,
            category: 'social',
            image: gameImages.zarumar
        },
        {
            id: 'familyfeud',
            title: isKurdish ? 'پرس ١٠٠' : 'Family Feud',
            screen: 'FamilyFeudSetup',
            colors: ['#1F2937', '#111827'],
            Icon: Users,
            rating: '4.9',
            time: '20',
            players: '2+',
            isNew: true,
            category: 'social',
            image: gameImages.familyfeud
        },
        {
            id: 'truthordare',
            title: isKurdish ? 'ڕاستی یان ئازار' : 'Truth or Dare',
            screen: 'TruthOrDareSetup',
            colors: ['#F97316', '#C2410C'],
            Icon: Dice5,
            rating: '4.9',
            time: '15',
            players: '2-20',
            isNew: false,
            image: gameImages.truthordare
        },
        {
            id: 'pyramid',
            title: isKurdish ? 'پیرامید' : 'Pyramid',
            screen: 'PyramidSetup',
            colors: ['#F59E0B', '#B45309'],
            Icon: Users,
            rating: '4.8',
            time: '20',
            players: '4+',
            image: gameImages.pyramid
        },
        {
            id: 'quiz',
            title: isKurdish ? 'پێشبڕکێی زانیاری' : 'Trivia Quiz',
            screen: 'QuizSetup',
            colors: ['#EAB308', '#A16207'],
            Icon: HelpCircle,
            rating: '4.7',
            time: '15',
            players: '1-10',
            image: gameImages.quiz
        },
        {
            id: 'spyfall',
            title: isKurdish ? 'سپای' : 'Spyfall',
            screen: 'SpyfallSetup',
            colors: ['#10B981', '#064E3B'],
            Icon: Users,
            rating: '4.9',
            time: '20',
            players: '3-12',
            image: gameImages.spyfall
        },
        {
            id: 'whoami',
            title: isKurdish ? 'من کێم؟' : 'Who Am I?',
            screen: 'WhoAmISetup',
            colors: ['#3B82F6', '#1E3A8A'],
            Icon: HelpCircle,
            rating: '4.6',
            time: '15',
            players: '2-10',
            isNew: true,
            image: gameImages.whoami
        },
        {
            id: 'imposter',
            title: isKurdish ? 'دەستدرێژکار' : 'Imposter',
            screen: 'ImposterSetup',
            colors: ['#EF4444', '#B91C1C'],
            Icon: Users,
            rating: '4.8',
            time: '15',
            players: '4-10',
            image: gameImages.imposter
        },
        {
            id: 'drawguess',
            title: isKurdish ? 'وێنە بکێشە' : 'Draw & Guess',
            screen: 'DrawGuessSetup',
            colors: ['#06B6D4', '#0891B2'],
            Icon: PenTool,
            rating: '4.5',
            time: '20',
            players: '3-10',
            image: gameImages.drawguess
        },
        {
            id: 'wheel',
            title: isKurdish ? 'چەرخی بەخت' : 'Wheel of Fortune',
            screen: 'WheelSetup',
            colors: ['#EC4899', '#BE185D'],
            Icon: Dice5,
            rating: '4.4',
            time: '10',
            players: '2-8',
            image: gameImages.wheel
        },
        {
            id: 'neverhaveiever',
            title: isKurdish ? 'هەرگیز نەمکردووە' : 'Never Have I Ever',
            screen: 'NeverHaveIEverSetup',
            colors: ['#8B5CF6', '#6D28D9'],
            Icon: Users,
            rating: '4.7',
            time: '15',
            players: '3-15',
            image: gameImages.neverhavei
        },
        {
            id: 'wouldyourather',
            title: isKurdish ? 'کامەیان باشترە؟' : 'Would You Rather',
            screen: 'WouldYouRatherSetup',
            colors: ['#14B8A6', '#0D9488'],
            Icon: HelpCircle,
            rating: '4.6',
            time: '10',
            players: '2-20',
            category: 'social',
            image: gameImages.wouldyourather
        },
        {
            id: 'emojidecoder',
            title: isKurdish ? 'مەتەڵی ئیمۆجی' : 'Emoji Decoder',
            screen: 'EmojiDecoderSetup',
            colors: ['#FBBF24', '#F59E0B'],
            Icon: Sparkles,
            rating: '4.5',
            time: '10',
            players: '2-10',
            isNew: true,
            image: gameImages.emojidecoder
        },
        {
            id: 'forbiddenword',
            title: isKurdish ? 'وشەی قەدەغە' : 'Forbidden Word',
            screen: 'ForbiddenWordSetup',
            colors: ['#DC2626', '#991B1B'],
            Icon: Copy,
            rating: '4.7',
            time: '15',
            players: '3-10',
            image: gameImages.forbiddenword
        },
        {
            id: 'lyricschallenge',
            title: isKurdish ? 'چالینجی گۆرانی' : 'Lyrics Challenge',
            screen: 'LyricsChallengeSetup',
            colors: ['#7C3AED', '#5B21B6'],
            Icon: Sparkles,
            rating: '4.4',
            time: '15',
            players: '2-8',
            isNew: true,
            image: gameImages.lyricschallenge
        },
        {
            id: 'wordchain',
            title: isKurdish ? 'زنجیرەی وشە' : 'Word Chain',
            screen: 'WordChainPlay',
            colors: ['#0EA5E9', '#0284C7'],
            Icon: Puzzle,
            rating: '4.3',
            time: '10',
            players: '2-6',
            image: gameImages.wordchain
        },
        {
            id: 'reversecharades',
            title: isKurdish ? 'نواندنی پێچەوانە' : 'Reverse Charades',
            screen: 'ReverseCharadesSetup',
            colors: ['#F472B6', '#DB2777'],
            Icon: Users,
            rating: '4.6',
            time: '20',
            players: '6+',
            category: 'social',
            image: gameImages.reversecharades
        },
        {
            id: 'partnersincrime',
            title: isKurdish ? 'هەوکاڕ لە تاوان' : 'Partners in Crime',
            screen: 'PartnersInCrimeSetup',
            colors: ['#F43F5E', '#E11D48'],
            Icon: Users,
            rating: '4.8',
            time: '15',
            players: '4+',
            isNew: true,
            category: 'social',
            image: gameImages.partners
        },
        {
            id: 'speedrecognition',
            title: isKurdish ? 'چالاکی خێرایی' : 'Speed Challenge',
            screen: 'SpeedRecognitionSetup',
            colors: ['#F59E0B', '#D97706'],
            Icon: Zap,
            rating: '4.7',
            time: '5',
            players: '1+',
            isNew: true,
            category: 'brain',
            image: gameImages.speedchallenge
        },
        {
            id: 'impostordraw',
            title: isKurdish ? 'وێنەکێشی دزەکار' : 'Impostor Draw',
            screen: 'ImpostorDrawSetup',
            colors: ['#EF4444', '#DC2626'],
            Icon: Gamepad2,
            rating: '4.9',
            time: '20',
            players: '3-8',
            isNew: true,
            category: 'social',
            image: gameImages.impostordraw
        },
        {
            id: 'wronganswer',
            title: isKurdish ? 'وەڵامی هەڵە' : 'Wrong Answer',
            screen: 'WrongAnswerSetup',
            colors: ['#F59E0B', '#D97706'],
            Icon: AlertTriangle,
            rating: '4.8',
            time: '10',
            players: '2-10',
            isNew: true,
            category: 'brain',
            image: gameImages.wronganswer
        },
        {
            id: 'dama',
            title: isKurdish ? 'دامە' : 'Dama',
            screen: 'DamaSetup',
            colors: ['#8B4513', '#654321'],
            Icon: Gamepad2,
            rating: '4.9',
            time: '30',
            players: '2',
            isNew: true,
            category: 'brain',
            image: gameImages.dama
        },
        {
            id: 'sheshbesh',
            title: isKurdish ? 'تەولە' : 'Tawla',
            screen: 'SheshBeshSetup',
            colors: ['#0B6623', '#064216'],
            Icon: Gamepad2,
            rating: '4.9',
            time: '20',
            players: '2',
            isNew: true,
            category: 'brain',
            image: gameImages.sheshbesh
        },
        {
            id: 'seberd',
            title: isKurdish ? 'سێ بەرد' : 'Sê Berd',
            screen: 'SeBerdSetup',
            colors: ['#1E40AF', '#1D4ED8'],
            Icon: Gamepad2,
            rating: '4.7',
            time: '5',
            players: '2',
            isNew: true,
            category: 'brain',
            image: gameImages.seberd
        },
    ];

    // Filter games based on search and active filter
    const filteredGames = GAMES.filter(game => {
        // Search filter
        const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());

        // Category filter
        let matchesFilter = true;
        if (activeFilter === 'new') {
            matchesFilter = game.isNew === true;
        } else if (activeFilter !== 'all') {
            // Check if game category array matches, or string matches
            matchesFilter = game.category === activeFilter;
        }

        return matchesSearch && matchesFilter;
    });

    return (
        <AnimatedScreen>
            <View style={{ flex: 1 }}>
                {/* Grid */}
                <FlatList
                    key={isTwoColumns ? 'two-col' : 'one-col'}
                    data={filteredGames}
                    keyExtractor={item => item.id}
                    numColumns={numColumns}
                    columnWrapperStyle={isTwoColumns ? { gap: gap } : undefined}
                    contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}
                    ListHeaderComponent={
                        <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
                            <Header 
                                isKurdish={isKurdish} 
                                navigation={navigation} 
                                colors={colors} 
                                isDark={isDark} 
                                isTwoColumns={isTwoColumns}
                                setIsTwoColumns={setIsTwoColumns}
                            />
                            <SearchInput
                                isKurdish={isKurdish}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                colors={colors}
                                isDark={isDark}
                            />
                            <FilterTabs
                                isKurdish={isKurdish}
                                activeFilter={activeFilter}
                                onFilterChange={setActiveFilter}
                                colors={colors}
                                isDark={isDark}
                            />
                        </View>
                    }
                    renderItem={({ item, index }) => (
                        <AnimatedListItem index={index} maxDelay={350}>
                            <GameGridCard
                                item={item}
                                isKurdish={isKurdish}
                                navigation={navigation}
                                cardWidth={cardWidth}
                                colors={colors}
                                isDark={isDark}
                                isTwoColumns={isTwoColumns}
                            />
                        </AnimatedListItem>
                    )}
                    showsVerticalScrollIndicator={false}
                    // ✨ Native Performance Optimizations
                    removeClippedSubviews={Platform.OS !== 'web'}
                    initialNumToRender={6}
                    maxToRenderPerBatch={4}
                    windowSize={7}
                    ListEmptyComponent={
                        <View style={{ alignItems: 'center', paddingTop: 40 }}>
                            <Text style={{ color: colors.text.muted, fontSize: 16 }}>
                                {isKurdish ? 'هیچ یاریەک نەدۆزرایەوە' : 'No games found'}
                            </Text>
                        </View>
                    }
                />
            </View>

        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0518',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Platform.OS === 'android' ? 16 : 0,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFF',
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1C0F2E',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },

    // Search
    searchContainer: {
        height: 52,
        backgroundColor: '#170B26',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#2D1B4E',
        justifyContent: 'center',
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        color: '#FFF',
        fontSize: 14,
        paddingHorizontal: 44, // Space for icon depending on side
    },
    searchIconPos: {
        position: 'absolute',
        left: 16, // Or right if RTL logic enforced in icon pos
    },

    // Filter
    filterRow: {
        flexDirection: 'row-reverse',
        marginBottom: 24,
        gap: 10,
    },
    filterPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 100,
        borderWidth: 1,
    },
    filterActive: {
        backgroundColor: '#D900FF',
        borderColor: '#D900FF',
    },
    filterInactive: {
        backgroundColor: 'rgba(28, 15, 46, 0.6)',
        borderColor: '#2D1B4E',
    },
    filterText: {
        fontWeight: '700',
        fontSize: 13,
    },

    // Card
    cardContainer: {
        backgroundColor: '#160925',
        borderRadius: 22,
        padding: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        marginBottom: 8,
    },
    cardVisual: {
        height: 160,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
        overflow: 'hidden', // This handles image clipping on Android
        backgroundColor: '#1A0B2E', // Fallback bg while image loads
    },
    cardImage: {
        width: '100%',
        height: '100%',
        // NO borderRadius here — parent overflow:hidden handles clipping on Android
    },
    cardIconFallback: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardInfo: {
        paddingHorizontal: 6,
        paddingBottom: 6,
    },
    cardTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'right', // Default to RTL for this specific look
    },
    ratingBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 3,
        gap: 4,
    },
    ratingText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 10,
    },
    newBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#D900FF',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    newText: {
        color: '#FFF',
        fontWeight: '800',
        fontSize: 10,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        color: '#8A8A8A',
        fontSize: 11,
        fontWeight: '500',
    },

    kurdishFont: { fontFamily: 'Rabar', transform: [{ scale: 1.15 }] },
});
