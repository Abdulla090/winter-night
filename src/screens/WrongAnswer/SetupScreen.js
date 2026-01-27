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
    Trash2,
    UserPlus,
    Clock,
    HelpCircle,
    Zap,
    Sparkles,
    AlertTriangle,
    ThumbsDown,
} from 'lucide-react-native';

import { AnimatedScreen } from '../../components/AnimatedScreen';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

// Question categories with questions and correct answers
const QUESTION_CATEGORIES = {
    general: {
        name: { en: 'General Knowledge', ku: 'زانیاری گشتی' },
        icon: '🧠',
        questions: [
            { q: 'What is the capital of France?', a: 'Paris' },
            { q: 'What is the capital of Japan?', a: 'Tokyo' },
            { q: 'What planet do we live on?', a: 'Earth' },
            { q: 'What is the largest mammal?', a: 'Blue Whale' },
            { q: 'How many continents are there?', a: '7' },
            { q: 'What is the currency of USA?', a: 'Dollar' },
            { q: 'Who painted the Mona Lisa?', a: 'Leonardo da Vinci' },
            { q: 'What is H2O?', a: 'Water' },
        ],
    },
    math: {
        name: { en: 'Simple Math', ku: 'بیرکاری ئاسان' },
        icon: '🔢',
        questions: [
            { q: 'What is 2 + 2?', a: '4' },
            { q: 'What is 5 + 5?', a: '10' },
            { q: 'What is 10 - 3?', a: '7' },
            { q: 'What is 3 × 3?', a: '9' },
            { q: 'What is 12 ÷ 4?', a: '3' },
            { q: 'What is 100 - 50?', a: '50' },
            { q: 'What is 7 + 8?', a: '15' },
            { q: 'What is half of 20?', a: '10' },
        ],
    },
    facts: {
        name: { en: 'Common Facts', ku: 'ڕاستییە باوەکان' },
        icon: '📚',
        questions: [
            { q: 'What color is grass?', a: 'Green' },
            { q: 'What is ice made of?', a: 'Water' },
            { q: 'What color is the sky?', a: 'Blue' },
            { q: 'How many months in a year?', a: '12' },
            { q: 'How many days in a week?', a: '7' },
            { q: 'What season comes after winter?', a: 'Spring' },
            { q: 'What do bees make?', a: 'Honey' },
            { q: 'What is the opposite of hot?', a: 'Cold' },
        ],
    },
    animals: {
        name: { en: 'Animals', ku: 'ئاژەڵەکان' },
        icon: '🐾',
        questions: [
            { q: 'What animal says "meow"?', a: 'Cat' },
            { q: 'What do cows say?', a: 'Moo' },
            { q: 'How many legs does a spider have?', a: '8' },
            { q: 'What animal has a trunk?', a: 'Elephant' },
            { q: 'What animal is known as King of the Jungle?', a: 'Lion' },
            { q: 'What bird can\'t fly?', a: 'Penguin' },
            { q: 'What animal gives us milk?', a: 'Cow' },
            { q: 'What animal has stripes and is like a horse?', a: 'Zebra' },
        ],
    },
    geography: {
        name: { en: 'Geography', ku: 'جوگرافیا' },
        icon: '🌍',
        questions: [
            { q: 'What country is the Eiffel Tower in?', a: 'France' },
            { q: 'What is the largest ocean?', a: 'Pacific' },
            { q: 'What continent is Egypt in?', a: 'Africa' },
            { q: 'What country has the most people?', a: 'China' },
            { q: 'What is the longest river?', a: 'Nile' },
            { q: 'What is the tallest mountain?', a: 'Everest' },
            { q: 'What country is pizza from?', a: 'Italy' },
            { q: 'What country is sushi from?', a: 'Japan' },
        ],
    },
};

// Avatar colors
const AVATAR_COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#84CC16'];

// Player Card
const PlayerCard = ({ player, index, onRemove, colors, isDark }) => (
    <MotiView
        from={{ opacity: 0, translateY: 15 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 200, delay: index * 80 }}
        style={[styles.playerCard, { backgroundColor: isDark ? '#1A0B2E' : '#FFF' }]}
    >
        <View style={[styles.playerAvatar, { backgroundColor: player.color }]}>
            <Text style={styles.playerAvatarText}>{player.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={[styles.playerName, { color: colors.text.primary }]} numberOfLines={1}>
            {player.name}
        </Text>
        <TouchableOpacity onPress={() => onRemove(index)} style={styles.removePlayerBtn}>
            <Trash2 size={16} color="#EF4444" />
        </TouchableOpacity>
    </MotiView>
);

// Category Card
const CategoryCard = ({ id, category, isSelected, onToggle, colors, isDark }) => (
    <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onToggle(id)}
        style={[
            styles.categoryCard,
            {
                backgroundColor: isDark ? '#1A0B2E' : '#FFF',
                borderColor: isSelected ? colors.primary : (isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0'),
                borderWidth: isSelected ? 2 : 1,
            }
        ]}
    >
        <Text style={styles.categoryIcon}>{category.icon}</Text>
        <Text style={[styles.categoryName, { color: isSelected ? colors.primary : colors.text.primary }]}>
            {category.name.en}
        </Text>
        {isSelected && (
            <View style={[styles.checkBadge, { backgroundColor: colors.primary }]}>
                <Sparkles size={10} color="#FFF" />
            </View>
        )}
    </TouchableOpacity>
);

// Timer Option Card
const TimerOptionCard = ({ seconds, isSelected, onSelect, colors, isDark, isKurdish }) => (
    <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onSelect(seconds)}
        style={[
            styles.timerCard,
            {
                backgroundColor: isSelected ? colors.primary : (isDark ? '#1A0B2E' : '#FFF'),
                borderColor: isSelected ? colors.primary : (isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0'),
            }
        ]}
    >
        <Clock size={20} color={isSelected ? '#FFF' : colors.text.secondary} />
        <Text style={[styles.timerValue, { color: isSelected ? '#FFF' : colors.text.primary }]}>
            {seconds}s
        </Text>
        <Text style={[styles.timerLabel, { color: isSelected ? 'rgba(255,255,255,0.7)' : colors.text.muted }]}>
            {seconds === 3 ? (isKurdish ? 'خێرا' : 'Fast') : seconds === 5 ? (isKurdish ? 'ناوەند' : 'Medium') : (isKurdish ? 'هێواش' : 'Slow')}
        </Text>
    </TouchableOpacity>
);

export default function WrongAnswerSetup({ navigation }) {
    const { isKurdish } = useLanguage();
    const { colors, isDark } = useTheme();

    // Game settings
    const [players, setPlayers] = useState([
        { name: isKurdish ? 'یاریزان ١' : 'Player 1', color: AVATAR_COLORS[0] },
        { name: isKurdish ? 'یاریزان ٢' : 'Player 2', color: AVATAR_COLORS[1] },
        { name: isKurdish ? 'یاریزان ٣' : 'Player 3', color: AVATAR_COLORS[2] },
    ]);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [selectedCategories, setSelectedCategories] = useState(['general', 'math', 'facts']);
    const [answerTime, setAnswerTime] = useState(3); // 3, 5, or 7 seconds
    const [voteTime, setVoteTime] = useState(15);
    const [questionsCount, setQuestionsCount] = useState(10);

    // Add player
    const handleAddPlayer = () => {
        if (players.length >= 10) {
            Alert.alert(isKurdish ? 'زۆر یاریزان' : 'Too Many Players', isKurdish ? 'زۆرترین ١٠ یاریزان' : 'Maximum 10 players allowed');
            return;
        }
        if (!newPlayerName.trim()) return;

        setPlayers([...players, {
            name: newPlayerName.trim(),
            color: AVATAR_COLORS[players.length % AVATAR_COLORS.length]
        }]);
        setNewPlayerName('');
    };

    // Remove player
    const handleRemovePlayer = (index) => {
        if (players.length <= 2) {
            Alert.alert(isKurdish ? 'کەمترین یاریزان' : 'Minimum Players', isKurdish ? 'کەمترین ٢ یاریزان پێویستە' : 'At least 2 players required');
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
        if (players.length < 2) {
            Alert.alert(isKurdish ? 'یاریزان کەمە' : 'Not Enough Players', isKurdish ? 'کەمترین ٢ یاریزان پێویستە' : 'At least 2 players required');
            return;
        }

        // Gather all questions from selected categories
        const allQuestions = selectedCategories.flatMap(cat =>
            QUESTION_CATEGORIES[cat].questions.map(q => ({ ...q, category: cat }))
        );

        // Shuffle and select questions
        const shuffled = allQuestions.sort(() => Math.random() - 0.5);
        const selectedQuestions = shuffled.slice(0, Math.min(questionsCount, shuffled.length));

        navigation.navigate('WrongAnswerPlay', {
            players,
            questions: selectedQuestions,
            answerTime,
            voteTime,
            scores: players.map(() => 0),
        });
    };

    return (
        <AnimatedScreen>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={[styles.backBtn, { backgroundColor: isDark ? '#1A0B2E' : '#FFF' }]}
                        onPress={() => navigation.goBack()}
                    >
                        <ChevronLeft size={24} color={colors.text.primary} />
                    </TouchableOpacity>

                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={[styles.headerTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'وەڵامی هەڵە' : 'Wrong Answer'}
                        </Text>
                        <Text style={[styles.headerSubtitle, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'وەڵامی دروست مەدە!' : 'Don\'t give correct answers!'}
                        </Text>
                    </View>

                    <View style={{ width: 44 }} />
                </View>

                {/* Warning Banner */}
                <View style={styles.warningBanner}>
                    <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.warningGradient}>
                        <AlertTriangle size={24} color="#FFF" />
                        <View style={styles.warningTextContainer}>
                            <Text style={[styles.warningTitle, isKurdish && styles.kurdishFont]}>
                                {isKurdish ? 'یادت بێت!' : 'Remember!'}
                            </Text>
                            <Text style={[styles.warningText, isKurdish && styles.kurdishFont]}>
                                {isKurdish
                                    ? 'وەڵامی هەڵە بدە! وەڵامی دروست دەچێتە سزادان!'
                                    : 'Give WRONG answers! Correct answers get penalties!'
                                }
                            </Text>
                        </View>
                    </LinearGradient>
                </View>

                {/* Players Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Users size={20} color={colors.primary} />
                        <Text style={[styles.sectionTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'یاریزانەکان' : 'Players'} ({players.length}/10)
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
                            />
                        ))}
                    </View>

                    {/* Add Player */}
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

                {/* Answer Time */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Zap size={20} color={colors.primary} />
                        <Text style={[styles.sectionTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'کاتی وەڵام' : 'Answer Time'}
                        </Text>
                    </View>

                    <View style={styles.timerOptionsRow}>
                        {[3, 5, 7].map((seconds) => (
                            <TimerOptionCard
                                key={seconds}
                                seconds={seconds}
                                isSelected={answerTime === seconds}
                                onSelect={setAnswerTime}
                                colors={colors}
                                isDark={isDark}
                                isKurdish={isKurdish}
                            />
                        ))}
                    </View>
                </View>

                {/* Categories */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <HelpCircle size={20} color={colors.primary} />
                        <Text style={[styles.sectionTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'جۆری پرسیارەکان' : 'Question Categories'}
                        </Text>
                    </View>

                    <View style={styles.categoriesGrid}>
                        {Object.entries(QUESTION_CATEGORIES).map(([id, category]) => (
                            <CategoryCard
                                key={id}
                                id={id}
                                category={category}
                                isSelected={selectedCategories.includes(id)}
                                onToggle={handleToggleCategory}
                                colors={colors}
                                isDark={isDark}
                            />
                        ))}
                    </View>
                </View>

                {/* Questions Count */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <HelpCircle size={20} color={colors.primary} />
                        <Text style={[styles.sectionTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'ژمارەی پرسیارەکان' : 'Number of Questions'}
                        </Text>
                    </View>

                    <View style={styles.questionsRow}>
                        {[5, 10, 15, 20].map((num) => (
                            <TouchableOpacity
                                key={num}
                                onPress={() => setQuestionsCount(num)}
                                style={[
                                    styles.questionsBtn,
                                    {
                                        backgroundColor: questionsCount === num ? colors.primary : (isDark ? '#1A0B2E' : '#FFF'),
                                        borderColor: questionsCount === num ? colors.primary : (isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0'),
                                    }
                                ]}
                            >
                                <Text style={[
                                    styles.questionsBtnText,
                                    { color: questionsCount === num ? '#FFF' : colors.text.primary }
                                ]}>
                                    {num}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* How to Play */}
                <View style={[styles.howToPlay, { backgroundColor: isDark ? '#1A0B2E' : '#FFF' }]}>
                    <ThumbsDown size={20} color="#EF4444" />
                    <Text style={[styles.howToPlayTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'چۆن یاری بکەیت' : 'How to Play'}
                    </Text>
                    <Text style={[styles.howToPlayText, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                        {isKurdish
                            ? '• پرسیار دەردەکەوێت - کاتت کەمە!\n• وەڵامی هەڵە بدە - داهێنەرانە و پێکەنیناوی!\n• دەنگ بدە بۆ باشترین وەڵامی هەڵە\n• وەڵامی دروست = سزادان!'
                            : '• Question appears - you have limited time!\n• Give a WRONG answer - be creative & funny!\n• Vote for the best wrong answer\n• Correct answers = penalty!'
                        }
                    </Text>
                </View>

                {/* Start Button */}
                <TouchableOpacity activeOpacity={0.9} onPress={handleStartGame} style={styles.startBtnWrap}>
                    <LinearGradient colors={['#D900FF', '#7000FF']} style={styles.startBtn}>
                        <Play size={24} color="#FFF" fill="#FFF" />
                        <Text style={[styles.startBtnText, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'دەستپێکردن' : 'Start Game'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

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
        paddingBottom: 16,
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

    // Warning Banner
    warningBanner: {
        marginHorizontal: 16,
        marginBottom: 20,
        borderRadius: 16,
        overflow: 'hidden',
    },
    warningGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 14,
    },
    warningTextContainer: {
        flex: 1,
    },
    warningTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    warningText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 13,
        marginTop: 2,
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
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
    },

    // Players
    playersGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 14,
    },
    playerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        gap: 8,
    },
    playerAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playerAvatarText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
    playerName: {
        fontSize: 14,
        fontWeight: '600',
        maxWidth: 80,
    },
    removePlayerBtn: {
        padding: 4,
    },

    // Add Player
    addPlayerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        gap: 8,
    },
    addPlayerInput: {
        flex: 1,
        height: 42,
        fontSize: 15,
        paddingHorizontal: 12,
    },
    addPlayerBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Timer Options
    timerOptionsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    timerCard: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        gap: 6,
    },
    timerValue: {
        fontSize: 24,
        fontWeight: '800',
    },
    timerLabel: {
        fontSize: 11,
    },

    // Categories
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    categoryCard: {
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 14,
        gap: 10,
        position: 'relative',
    },
    categoryIcon: {
        fontSize: 24,
    },
    categoryName: {
        fontSize: 13,
        fontWeight: '600',
        flex: 1,
    },
    checkBadge: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Questions Count
    questionsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    questionsBtn: {
        flex: 1,
        height: 50,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    questionsBtnText: {
        fontSize: 18,
        fontWeight: '700',
    },

    // How to Play
    howToPlay: {
        marginHorizontal: 16,
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        marginBottom: 24,
    },
    howToPlayTitle: {
        fontSize: 15,
        fontWeight: '700',
        marginTop: 10,
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
        height: 58,
        borderRadius: 29,
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
