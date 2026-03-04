import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TextInput,
    Alert,
} from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import {
    ChevronLeft,
    Play,
    Users,
    Plus,
    Minus,
    Palette,
    Clock,
    Trash2,
    UserPlus,
    Sparkles,
    Eye,
    EyeOff,
    Shuffle,
} from 'lucide-react-native';

import { AnimatedScreen } from '../../components/AnimatedScreen';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

// Word categories
const WORD_CATEGORIES = {
    animals: {
        name: { en: 'Animals', ku: 'ئاژەڵەکان' },
        icon: '🐾',
        words: ['Cat', 'Dog', 'Lion', 'Elephant', 'Fish', 'Bird', 'Snake', 'Monkey', 'Bear', 'Rabbit', 'Horse', 'Cow', 'Pig', 'Sheep', 'Chicken', 'Duck', 'Tiger', 'Giraffe', 'Zebra', 'Kangaroo', 'Penguin', 'Dolphin', 'Whale', 'Parrot', 'Owl', 'Crocodile', 'Turtle', 'Octopus', 'Shark', 'Camel', 'Panda', 'Gorilla', 'Wolf', 'Fox', 'Deer', 'Peacock', 'Eagle', 'Scorpion', 'Bat', 'Frog'],
    },
    objects: {
        name: { en: 'Objects', ku: 'شتەکان' },
        icon: '📦',
        words: ['Chair', 'Table', 'Phone', 'Computer', 'Book', 'Cup', 'Bottle', 'Key', 'Watch', 'Lamp', 'Umbrella', 'Bag', 'Shoe', 'Hat', 'Glasses', 'Camera', 'Guitar', 'Ball', 'Clock', 'Mirror', 'Scissors', 'Pencil', 'Candle', 'Pillow', 'Ring', 'Map', 'Brush', 'Ladder', 'Bell', 'Wallet', 'Telescope', 'Compass', 'Drum', 'Crown', 'Sword', 'Shield', 'Anchor', 'Rope', 'Puzzle', 'Trophy'],
    },
    food: {
        name: { en: 'Food', ku: 'خواردن' },
        icon: '🍕',
        words: ['Pizza', 'Burger', 'Apple', 'Banana', 'Cake', 'Ice Cream', 'Bread', 'Egg', 'Cheese', 'Tomato', 'Carrot', 'Orange', 'Grape', 'Cookie', 'Sandwich', 'Hotdog', 'Donut', 'Watermelon', 'Strawberry', 'Popcorn', 'Sushi', 'Pasta', 'Rice', 'Waffle', 'Pancake', 'Mango', 'Pineapple', 'Chocolate', 'Lemon', 'Cherry', 'Corn', 'Mushroom', 'Chicken Leg', 'Taco', 'Pretzel', 'Cupcake', 'Kebab', 'Soup', 'Salad', 'Candy'],
    },
    vehicles: {
        name: { en: 'Vehicles', ku: 'ئۆتۆمبێلەکان' },
        icon: '🚗',
        words: ['Car', 'Bicycle', 'Bus', 'Train', 'Airplane', 'Boat', 'Motorcycle', 'Truck', 'Helicopter', 'Ship', 'Rocket', 'Scooter', 'Taxi', 'Ambulance', 'Fire Truck', 'Submarine', 'Tractor', 'Van', 'Jet', 'Balloon', 'Skateboard', 'Canoe', 'Sailboat', 'Spaceship', 'Police Car', 'Snowmobile', 'Golf Cart', 'Surfboard', 'Segway', 'Wheelchair'],
    },
    places: {
        name: { en: 'Places', ku: 'شوێنەکان' },
        icon: '🏠',
        words: ['House', 'School', 'Hospital', 'Beach', 'Mountain', 'Park', 'Church', 'Castle', 'Bridge', 'Tower', 'Library', 'Museum', 'Restaurant', 'Hotel', 'Airport', 'Stadium', 'Zoo', 'Mall', 'Farm', 'Island', 'Desert', 'Forest', 'Cave', 'Lighthouse', 'Waterfall', 'Volcano', 'City', 'Village', 'Temple', 'Cinema', 'Bakery', 'Gym', 'Garden', 'Market', 'Theater'],
    },
    nature: {
        name: { en: 'Nature', ku: 'سروشت' },
        icon: '🌿',
        words: ['Sun', 'Moon', 'Star', 'Cloud', 'Rain', 'Snow', 'Lightning', 'Rainbow', 'Mountain', 'River', 'Ocean', 'Flower', 'Tree', 'Leaf', 'Rock', 'Volcano', 'Tornado', 'Earthquake', 'Glacier', 'Waterfall', 'Cave', 'Desert', 'Forest', 'Sunset', 'Aurora'],
    },
};

// Player Card Component
const PlayerCard = ({ player, index, onRemove, colors, isDark, isKurdish }) => (
    <MotiView
        from={{ opacity: 0, translateY: 15 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 200, delay: index * 100 }}
        style={[styles.playerCard, { backgroundColor: isDark ? '#1A0B2E' : '#FFF' }]}
    >
        <View style={[styles.playerAvatar, { backgroundColor: player.color }]}>
            <Text style={styles.playerAvatarText}>{player.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={[styles.playerName, { color: colors.text.primary }]}>{player.name}</Text>
        <TouchableOpacity onPress={() => onRemove(index)} style={styles.removePlayerBtn}>
            <Trash2 size={18} color="#EF4444" />
        </TouchableOpacity>
    </MotiView>
);

// Category Card Component
const CategoryCard = ({ category, isSelected, onSelect, colors, isDark }) => (
    <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onSelect(category)}
        style={[styles.categoryCardWrapper]}
    >
        <MotiView
            animate={{
                scale: isSelected ? 1.05 : 1,
                borderColor: isSelected ? colors.primary : (isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0'),
                borderWidth: isSelected ? 2 : 1,
            }}
            transition={{ type: 'spring' }}
            style={[
                styles.categoryCard,
                { backgroundColor: isDark ? '#1A0B2E' : '#FFF' }
            ]}
        >
            <Text style={styles.categoryIcon}>{WORD_CATEGORIES[category].icon}</Text>
            <Text style={[
                styles.categoryName,
                { color: isSelected ? colors.primary : colors.text.primary }
            ]}>
                {WORD_CATEGORIES[category].name.en}
            </Text>
            {isSelected && (
                <MotiView
                    from={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={[styles.checkBadge, { backgroundColor: colors.primary }]}
                >
                    <Sparkles size={12} color="#FFF" />
                </MotiView>
            )}
        </MotiView>
    </TouchableOpacity>
);

// Setting Row Component
const SettingRow = ({ icon: Icon, title, value, onIncrease, onDecrease, min, max, colors, isDark }) => (
    <View style={[styles.settingRow, { backgroundColor: isDark ? '#1A0B2E' : '#FFF' }]}>
        <View style={styles.settingLeft}>
            <Icon size={22} color={colors.primary} />
            <Text style={[styles.settingTitle, { color: colors.text.primary }]}>{title}</Text>
        </View>
        <View style={styles.settingRight}>
            <TouchableOpacity
                style={[styles.settingBtn, { opacity: value <= min ? 0.3 : 1 }]}
                onPress={onDecrease}
                disabled={value <= min}
            >
                <Minus size={20} color={colors.text.primary} />
            </TouchableOpacity>
            <Text style={[styles.settingValue, { color: colors.text.primary }]}>{value}</Text>
            <TouchableOpacity
                style={[styles.settingBtn, { opacity: value >= max ? 0.3 : 1 }]}
                onPress={onIncrease}
                disabled={value >= max}
            >
                <Plus size={20} color={colors.text.primary} />
            </TouchableOpacity>
        </View>
    </View>
);

// Avatar colors
const AVATAR_COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export default function ImpostorDrawSetup({ navigation }) {
    const { isKurdish } = useLanguage();
    const { colors, isDark } = useTheme();

    // Game settings
    const [players, setPlayers] = useState([
        { name: isKurdish ? 'یاریزان ١' : 'Player 1', color: AVATAR_COLORS[0] },
        { name: isKurdish ? 'یاریزان ٢' : 'Player 2', color: AVATAR_COLORS[1] },
        { name: isKurdish ? 'یاریزان ٣' : 'Player 3', color: AVATAR_COLORS[2] },
    ]);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [selectedCategories, setSelectedCategories] = useState(['animals', 'objects']);
    const [drawTime, setDrawTime] = useState(60); // seconds
    const [discussTime, setDiscussTime] = useState(30); // seconds
    const [voteTime, setVoteTime] = useState(20); // seconds
    const [rounds, setRounds] = useState(5);

    // Add player
    const handleAddPlayer = () => {
        if (players.length >= 8) {
            Alert.alert(isKurdish ? 'زۆر یاریزان' : 'Too Many Players', isKurdish ? 'زۆرترین ٨ یاریزان' : 'Maximum 8 players allowed');
            return;
        }
        if (!newPlayerName.trim()) {
            Alert.alert(isKurdish ? 'ناو داخڵ بکە' : 'Enter Name', isKurdish ? 'ناوی یاریزان داخڵ بکە' : 'Please enter a player name');
            return;
        }
        setPlayers([...players, {
            name: newPlayerName.trim(),
            color: AVATAR_COLORS[players.length % AVATAR_COLORS.length]
        }]);
        setNewPlayerName('');
    };

    // Remove player
    const handleRemovePlayer = (index) => {
        if (players.length <= 3) {
            Alert.alert(isKurdish ? 'کەمترین یاریزان' : 'Minimum Players', isKurdish ? 'کەمترین ٣ یاریزان پێویستە' : 'At least 3 players required');
            return;
        }
        setPlayers(players.filter((_, i) => i !== index));
    };

    // Toggle category
    const handleToggleCategory = (category) => {
        if (selectedCategories.includes(category)) {
            if (selectedCategories.length > 1) {
                setSelectedCategories(selectedCategories.filter(c => c !== category));
            }
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    // Start game
    const handleStartGame = () => {
        if (players.length < 3) {
            Alert.alert(isKurdish ? 'یاریزان کەمە' : 'Not Enough Players', isKurdish ? 'کەمترین ٣ یاریزان پێویستە' : 'At least 3 players required');
            return;
        }

        // Generate words from selected categories
        const allWords = selectedCategories.flatMap(cat => WORD_CATEGORIES[cat].words);

        navigation.navigate('ImpostorDrawRoleReveal', {
            players,
            words: allWords,
            drawTime,
            discussTime,
            voteTime,
            rounds,
        });
    };

    return (
        <AnimatedScreen>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                {/* Header */}
                <MotiView
                    from={{ opacity: 0, translateY: -20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 400 }}
                    style={styles.header}
                >
                    <TouchableOpacity
                        style={[styles.backBtn, { backgroundColor: isDark ? '#1A0B2E' : '#FFF' }]}
                        onPress={() => navigation.goBack()}
                    >
                        <ChevronLeft size={24} color={colors.text.primary} />
                    </TouchableOpacity>

                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={[styles.headerTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'وێنەکێشی دزەکار' : 'Impostor Draw'}
                        </Text>
                        <Text style={[styles.headerSubtitle, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'کێ دزەکارە؟' : 'Who is the impostor?'}
                        </Text>
                    </View>

                    <View style={{ width: 44 }} />
                </MotiView>

                {/* Players Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Users size={20} color={colors.primary} />
                        <Text style={[styles.sectionTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'یاریزانەکان' : 'Players'} ({players.length}/8)
                        </Text>
                    </View>

                    <View style={styles.playersGrid}>
                        {players.map((player, index) => (
                            <PlayerCard
                                key={index}
                                player={player}
                                index={index}
                                onRemove={handleRemovePlayer}
                                colors={colors}
                                isDark={isDark}
                                isKurdish={isKurdish}
                            />
                        ))}
                    </View>

                    {/* Add Player Input */}
                    <View style={[styles.addPlayerRow, { backgroundColor: isDark ? '#1A0B2E' : '#FFF' }]}>
                        <TextInput
                            style={[styles.addPlayerInput, { color: colors.text.primary }]}
                            placeholder={isKurdish ? 'ناوی یاریزان...' : 'Player name...'}
                            placeholderTextColor={colors.text.muted}
                            value={newPlayerName}
                            onChangeText={setNewPlayerName}
                            onSubmitEditing={handleAddPlayer}
                        />
                        <TouchableOpacity onPress={handleAddPlayer}>
                            <LinearGradient colors={['#D900FF', '#7000FF']} style={styles.addPlayerBtn}>
                                <UserPlus size={20} color="#FFF" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Categories Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Palette size={20} color={colors.primary} />
                        <Text style={[styles.sectionTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'جۆرەکان' : 'Word Categories'}
                        </Text>
                    </View>

                    <View style={styles.categoriesGrid}>
                        {Object.keys(WORD_CATEGORIES).map((category) => (
                            <CategoryCard
                                key={category}
                                category={category}
                                isSelected={selectedCategories.includes(category)}
                                onSelect={handleToggleCategory}
                                colors={colors}
                                isDark={isDark}
                            />
                        ))}
                    </View>
                </View>

                {/* Timing Settings */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Clock size={20} color={colors.primary} />
                        <Text style={[styles.sectionTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'ڕێکخستنەکان' : 'Game Settings'}
                        </Text>
                    </View>

                    <View style={styles.settingsContainer}>
                        <SettingRow
                            icon={Palette}
                            title={isKurdish ? 'کاتی کێشان (چرکە)' : 'Draw Time (sec)'}
                            value={drawTime}
                            onIncrease={() => setDrawTime(drawTime + 15)}
                            onDecrease={() => setDrawTime(drawTime - 15)}
                            min={30}
                            max={120}
                            colors={colors}
                            isDark={isDark}
                        />
                        <SettingRow
                            icon={Eye}
                            title={isKurdish ? 'کاتی گفتوگۆ (چرکە)' : 'Discuss Time (sec)'}
                            value={discussTime}
                            onIncrease={() => setDiscussTime(discussTime + 15)}
                            onDecrease={() => setDiscussTime(discussTime - 15)}
                            min={15}
                            max={60}
                            colors={colors}
                            isDark={isDark}
                        />
                        <SettingRow
                            icon={Users}
                            title={isKurdish ? 'کاتی دەنگدان (چرکە)' : 'Vote Time (sec)'}
                            value={voteTime}
                            onIncrease={() => setVoteTime(voteTime + 10)}
                            onDecrease={() => setVoteTime(voteTime - 10)}
                            min={10}
                            max={45}
                            colors={colors}
                            isDark={isDark}
                        />
                        <SettingRow
                            icon={Shuffle}
                            title={isKurdish ? 'ژمارەی خولەکان' : 'Number of Rounds'}
                            value={rounds}
                            onIncrease={() => setRounds(rounds + 1)}
                            onDecrease={() => setRounds(rounds - 1)}
                            min={3}
                            max={10}
                            colors={colors}
                            isDark={isDark}
                        />
                    </View>
                </View>

                {/* How to Play */}
                <View style={[styles.howToPlay, { backgroundColor: isDark ? '#1A0B2E' : '#FFF' }]}>
                    <EyeOff size={20} color="#EF4444" />
                    <Text style={[styles.howToPlayTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'چۆن یاری بکەیت' : 'How to Play'}
                    </Text>
                    <Text style={[styles.howToPlayText, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                        {isKurdish
                            ? '• هەموو یاریزانەکان وشەیەک وەردەگرن بۆ کێشان\n• یەک یاریزان (دزەکار) وشەکە نازانێت\n• هەموو کەس بکێشن - دزەکار هەوڵ دەدات تەقڵید بکات\n• دەنگ بدەن لەسەر دزەکار!'
                            : '• All players receive a word to draw\n• One player (Impostor) doesn\'t know the word\n• Everyone draws - Impostor tries to blend in\n• Vote to find the Impostor!'
                        }
                    </Text>
                </View>

                {/* Start Button */}
                <MotiView
                    from={{ opacity: 0, translateY: 30 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: 400 }}
                >
                    <TouchableOpacity activeOpacity={0.9} onPress={handleStartGame} style={styles.startBtnWrap}>
                        <LinearGradient colors={['#D900FF', '#7000FF']} style={styles.startBtn}>
                            <Play size={24} color="#FFF" fill="#FFF" />
                            <Text style={[styles.startBtnText, isKurdish && styles.kurdishFont]}>
                                {isKurdish ? 'دەستپێکردن' : 'Start Game'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </MotiView>

            </ScrollView>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 20,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
    },
    headerSubtitle: {
        fontSize: 14,
        marginTop: 4,
    },

    // Sections
    section: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
    },

    // Players
    playersGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16,
    },
    playerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        gap: 10,
    },
    playerAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playerAvatarText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    playerName: {
        fontSize: 14,
        fontWeight: '600',
    },
    removePlayerBtn: {
        padding: 4,
    },

    // Add Player
    addPlayerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        gap: 8,
    },
    addPlayerInput: {
        flex: 1,
        height: 44,
        fontSize: 15,
        paddingHorizontal: 12,
    },
    addPlayerBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Categories
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    categoryCardWrapper: {
        width: '47.5%',
    },
    categoryCard: {
        width: '100%',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        position: 'relative',
    },
    categoryIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    categoryName: {
        fontSize: 14,
        fontWeight: '600',
    },
    checkBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Settings
    settingsContainer: {
        gap: 12,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    settingTitle: {
        fontSize: 14,
        fontWeight: '500',
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    settingBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingValue: {
        fontSize: 18,
        fontWeight: '700',
        minWidth: 40,
        textAlign: 'center',
    },

    // How to Play
    howToPlay: {
        marginHorizontal: 16,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        marginBottom: 24,
    },
    howToPlayTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 12,
        marginBottom: 8,
    },
    howToPlayText: {
        fontSize: 13,
        lineHeight: 22,
    },

    // Start Button
    startBtnWrap: {
        paddingHorizontal: 16,
    },
    startBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        borderRadius: 30,
        gap: 12,
    },
    startBtnText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '800',
    },

    kurdishFont: {
        fontFamily: 'System',
    },
});
