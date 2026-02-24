import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Flag,
    Hash,
    Shuffle,
    Play,
    ChevronLeft,
    Zap,
    Brain,
    Clock,
    Trophy,
    Target,
    Sparkles,
} from 'lucide-react-native';

import { AnimatedScreen } from '../components/AnimatedScreen';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { layout } from '../theme/layout';

// --- MODE CARD COMPONENT ---
const ModeCard = ({ mode, isSelected, onSelect, colors, isDark, isKurdish }) => {
    const modeConfig = {
        flags: {
            icon: Flag,
            title: isKurdish ? 'ئاڵاکان' : 'Flags',
            subtitle: isKurdish ? 'ناسینەوەی ئاڵای وڵاتان' : 'Identify country flags',
            gradient: ['#10B981', '#059669'],
        },
        numbers: {
            icon: Hash,
            title: isKurdish ? 'ژمارەکان' : 'Numbers',
            subtitle: isKurdish ? 'بیرکردنەوەی ژمارە' : 'Remember number sequences',
            gradient: ['#3B82F6', '#2563EB'],
        },
        mixed: {
            icon: Shuffle,
            title: isKurdish ? 'تێکەڵ' : 'Mixed',
            subtitle: isKurdish ? 'هەردووکیان تێکەڵ' : 'Both flags and numbers',
            gradient: ['#8B5CF6', '#7C3AED'],
        },
    };

    const config = modeConfig[mode];
    const Icon = config.icon;
    const cardBg = isDark ? '#1A0B2E' : '#FFFFFF';
    const borderColor = isSelected
        ? config.gradient[0]
        : isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0';

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onSelect(mode)}
            style={{ flex: 1 }}
        >
            <MotiView
                animate={{
                    scale: isSelected ? 1.02 : 1,
                    borderWidth: isSelected ? 2 : 1,
                }}
                transition={{ type: 'timing', duration: 200 }}
                style={[
                    styles.modeCard,
                    {
                        backgroundColor: cardBg,
                        borderColor,
                    }
                ]}
            >
                <LinearGradient
                    colors={isSelected ? config.gradient : [cardBg, cardBg]}
                    style={styles.modeIconWrap}
                >
                    <Icon size={28} color={isSelected ? '#FFF' : config.gradient[0]} />
                </LinearGradient>

                <Text style={[
                    styles.modeTitle,
                    { color: colors.text.primary },
                    isKurdish && styles.kurdishFont
                ]}>
                    {config.title}
                </Text>
                <Text style={[
                    styles.modeSubtitle,
                    { color: colors.text.secondary },
                    isKurdish && styles.kurdishFont
                ]}>
                    {config.subtitle}
                </Text>

                {isSelected && (
                    <View style={[styles.selectedBadge, { backgroundColor: config.gradient[0] }]}>
                        <Sparkles size={12} color="#FFF" />
                    </View>
                )}
            </MotiView>
        </TouchableOpacity>
    );
};

// --- DIFFICULTY SELECTOR ---
const DifficultySelector = ({ difficulty, onSelect, colors, isDark, isKurdish }) => {
    const difficulties = [
        {
            id: 'easy',
            digits: 2,
            label: isKurdish ? 'ئاسان' : 'Easy',
            sublabel: isKurdish ? '٢ ژمارە' : '2 digits',
            color: '#10B981'
        },
        {
            id: 'medium',
            digits: 4,
            label: isKurdish ? 'مامناوەند' : 'Medium',
            sublabel: isKurdish ? '٤ ژمارە' : '4 digits',
            color: '#F59E0B'
        },
        {
            id: 'hard',
            digits: 6,
            label: isKurdish ? 'قورس' : 'Hard',
            sublabel: isKurdish ? '٦ ژمارە' : '6 digits',
            color: '#EF4444'
        },
    ];

    return (
        <View style={styles.difficultyContainer}>
            {difficulties.map((diff) => {
                const isSelected = difficulty === diff.id;
                return (
                    <TouchableOpacity
                        key={diff.id}
                        activeOpacity={0.8}
                        onPress={() => onSelect(diff.id)}
                        style={[
                            styles.difficultyCard,
                            {
                                backgroundColor: isDark ? '#1A0B2E' : '#FFFFFF',
                                borderColor: isSelected ? diff.color : (isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0'),
                                borderWidth: isSelected ? 2 : 1,
                            }
                        ]}
                    >
                        <View style={[styles.digitBadge, { backgroundColor: diff.color + '20' }]}>
                            <Text style={[styles.digitNumber, { color: diff.color }]}>
                                {diff.digits}
                            </Text>
                        </View>
                        <Text style={[
                            styles.diffLabel,
                            { color: colors.text.primary },
                            isKurdish && styles.kurdishFont
                        ]}>
                            {diff.label}
                        </Text>
                        <Text style={[
                            styles.diffSublabel,
                            { color: colors.text.muted },
                            isKurdish && styles.kurdishFont
                        ]}>
                            {diff.sublabel}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

// --- DISPLAY TIME SELECTOR ---
const DisplayTimeSelector = ({ displayTime, onSelect, colors, isDark, isKurdish }) => {
    const times = [
        { ms: 500, label: '0.5s', desc: isKurdish ? 'خێرا' : 'Fast' },
        { ms: 750, label: '0.75s', desc: isKurdish ? 'مامناوەند' : 'Medium' },
        { ms: 1000, label: '1s', desc: isKurdish ? 'هێواش' : 'Slow' },
    ];

    return (
        <View style={styles.timeContainer}>
            {times.map((time) => {
                const isSelected = displayTime === time.ms;
                return (
                    <TouchableOpacity
                        key={time.ms}
                        activeOpacity={0.8}
                        onPress={() => onSelect(time.ms)}
                        style={[
                            styles.timeCard,
                            {
                                backgroundColor: isSelected
                                    ? (isDark ? colors.primary : colors.primary)
                                    : (isDark ? '#1A0B2E' : '#FFFFFF'),
                                borderColor: isSelected ? colors.primary : (isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0'),
                            }
                        ]}
                    >
                        <Clock size={18} color={isSelected ? '#FFF' : colors.text.secondary} />
                        <Text style={[
                            styles.timeLabel,
                            { color: isSelected ? '#FFF' : colors.text.primary }
                        ]}>
                            {time.label}
                        </Text>
                        <Text style={[
                            styles.timeDesc,
                            { color: isSelected ? 'rgba(255,255,255,0.7)' : colors.text.muted },
                            isKurdish && styles.kurdishFont
                        ]}>
                            {time.desc}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

// --- INFO CARD ---
const InfoCard = ({ icon: Icon, title, value, color, isDark }) => (
    <View style={[
        styles.infoCard,
        { backgroundColor: isDark ? '#1A0B2E' : '#FFFFFF' }
    ]}>
        <View style={[styles.infoIconWrap, { backgroundColor: color + '20' }]}>
            <Icon size={20} color={color} />
        </View>
        <Text style={[styles.infoValue, { color }]}>{value}</Text>
        <Text style={[styles.infoTitle, { color: isDark ? '#E8E0F0' : '#64748B' }]}>{title}</Text>
    </View>
);

// --- MAIN SCREEN ---
export default function SpeedRecognitionSetup({ navigation }) {
    const { language, isKurdish } = useLanguage();
    const { colors, isDark } = useTheme();

    // Game settings state
    const [gameMode, setGameMode] = useState('numbers'); // flags, numbers, mixed
    const [difficulty, setDifficulty] = useState('easy'); // easy (2), medium (4), hard (6)
    const [displayTime, setDisplayTime] = useState(500); // ms
    const [rounds, setRounds] = useState(10);

    const handleStartGame = () => {
        navigation.navigate('SpeedRecognitionPlay', {
            gameMode,
            difficulty,
            displayTime,
            rounds,
        });
    };

    return (
        <AnimatedScreen>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={[styles.backBtn, { backgroundColor: isDark ? '#1A0B2E' : '#FFF' }]}
                        onPress={() => navigation.goBack()}
                    >
                        <ChevronLeft size={24} color={colors.text.primary} />
                    </TouchableOpacity>

                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={[
                            styles.headerTitle,
                            { color: colors.text.primary },
                            isKurdish && styles.kurdishFont
                        ]}>
                            {isKurdish ? 'چالاکی خێرایی' : 'Speed Challenge'}
                        </Text>
                        <Text style={[
                            styles.headerSubtitle,
                            { color: colors.text.secondary },
                            isKurdish && styles.kurdishFont
                        ]}>
                            {isKurdish ? 'بیرت هەڵبگرە و بیری بخەوە!' : 'See it, remember it!'}
                        </Text>
                    </View>

                    <View style={{ width: 44 }} />
                </View>

                {/* Game Info Cards */}
                <View style={styles.infoRow}>
                    <InfoCard
                        icon={Zap}
                        title={isKurdish ? 'کات' : 'Speed'}
                        value={`${displayTime / 1000}s`}
                        color="#F59E0B"
                        isDark={isDark}
                    />
                    <InfoCard
                        icon={Target}
                        title={isKurdish ? 'خول' : 'Rounds'}
                        value={rounds}
                        color="#10B981"
                        isDark={isDark}
                    />
                    <InfoCard
                        icon={Brain}
                        title={isKurdish ? 'قورسی' : 'Level'}
                        value={difficulty === 'easy' ? '2' : difficulty === 'medium' ? '4' : '6'}
                        color="#8B5CF6"
                        isDark={isDark}
                    />
                </View>

                {/* Section: Game Mode */}
                <View style={styles.section}>
                    <Text style={[
                        styles.sectionTitle,
                        { color: colors.text.primary },
                        isKurdish && styles.kurdishFont
                    ]}>
                        {isKurdish ? 'جۆری یاری' : 'Game Mode'}
                    </Text>

                    <View style={styles.modesRow}>
                        <ModeCard
                            mode="flags"
                            isSelected={gameMode === 'flags'}
                            onSelect={setGameMode}
                            colors={colors}
                            isDark={isDark}
                            isKurdish={isKurdish}
                        />
                        <ModeCard
                            mode="numbers"
                            isSelected={gameMode === 'numbers'}
                            onSelect={setGameMode}
                            colors={colors}
                            isDark={isDark}
                            isKurdish={isKurdish}
                        />
                        <ModeCard
                            mode="mixed"
                            isSelected={gameMode === 'mixed'}
                            onSelect={setGameMode}
                            colors={colors}
                            isDark={isDark}
                            isKurdish={isKurdish}
                        />
                    </View>
                </View>

                {/* Section: Difficulty (for numbers/mixed mode) */}
                {(gameMode === 'numbers' || gameMode === 'mixed') && (
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'timing', duration: 300 }}
                        style={styles.section}
                    >
                        <Text style={[
                            styles.sectionTitle,
                            { color: colors.text.primary },
                            isKurdish && styles.kurdishFont
                        ]}>
                            {isKurdish ? 'ئاستی قورسی' : 'Number Difficulty'}
                        </Text>

                        <DifficultySelector
                            difficulty={difficulty}
                            onSelect={setDifficulty}
                            colors={colors}
                            isDark={isDark}
                            isKurdish={isKurdish}
                        />
                    </MotiView>
                )}

                {/* Section: Display Time */}
                <View style={styles.section}>
                    <Text style={[
                        styles.sectionTitle,
                        { color: colors.text.primary },
                        isKurdish && styles.kurdishFont
                    ]}>
                        {isKurdish ? 'کاتی پیشاندان' : 'Display Time'}
                    </Text>

                    <DisplayTimeSelector
                        displayTime={displayTime}
                        onSelect={setDisplayTime}
                        colors={colors}
                        isDark={isDark}
                        isKurdish={isKurdish}
                    />
                </View>

                {/* Section: Rounds Selector */}
                <View style={styles.section}>
                    <Text style={[
                        styles.sectionTitle,
                        { color: colors.text.primary },
                        isKurdish && styles.kurdishFont
                    ]}>
                        {isKurdish ? 'ژمارەی خولەکان' : 'Number of Rounds'}
                    </Text>

                    <View style={styles.roundsRow}>
                        {[5, 10, 15, 20].map((num) => (
                            <TouchableOpacity
                                key={num}
                                activeOpacity={0.8}
                                onPress={() => setRounds(num)}
                                style={[
                                    styles.roundBtn,
                                    {
                                        backgroundColor: rounds === num
                                            ? colors.primary
                                            : (isDark ? '#1A0B2E' : '#FFFFFF'),
                                        borderColor: rounds === num
                                            ? colors.primary
                                            : (isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0'),
                                    }
                                ]}
                            >
                                <Text style={[
                                    styles.roundBtnText,
                                    { color: rounds === num ? '#FFF' : colors.text.primary }
                                ]}>
                                    {num}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Start Button */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={handleStartGame}
                    style={styles.startBtnWrap}
                >
                    <LinearGradient
                        colors={['#D900FF', '#7000FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.startBtn}
                    >
                        <Play size={24} color="#FFF" fill="#FFF" />
                        <Text style={[styles.startBtnText, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'دەستپێکردن' : 'Start Game'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* How to Play */}
                <View style={[styles.howToPlay, { backgroundColor: isDark ? '#1A0B2E' : '#FFFFFF' }]}>
                    <Trophy size={20} color="#F59E0B" />
                    <Text style={[
                        styles.howToPlayTitle,
                        { color: colors.text.primary },
                        isKurdish && styles.kurdishFont
                    ]}>
                        {isKurdish ? 'چۆن یاری بکەیت؟' : 'How to Play'}
                    </Text>
                    <Text style={[
                        styles.howToPlayText,
                        { color: colors.text.secondary },
                        isKurdish && styles.kurdishFont
                    ]}>
                        {isKurdish
                            ? '• وێنە یان ژمارە بۆ کاتێکی کورت دەردەکەوێت\n• دوای ئەوەی نهێنی بوو، ئەوەی بینیت بنووسە\n• خاڵ وەربگرە بۆ وەڵامی دروست!'
                            : '• An image or number will flash briefly\n• After it disappears, type what you saw\n• Earn points for correct answers!'
                        }
                    </Text>
                </View>

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

    // Info Cards
    infoRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 12,
        marginBottom: 24,
    },
    infoCard: {
        flex: 1,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    infoIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    infoValue: {
        fontSize: 20,
        fontWeight: '800',
    },
    infoTitle: {
        fontSize: 12,
        marginTop: 2,
    },

    // Sections
    section: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },

    // Mode Cards
    modesRow: {
        flexDirection: 'row',
        gap: 12,
    },
    modeCard: {
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        position: 'relative',
    },
    modeIconWrap: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    modeTitle: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 4,
    },
    modeSubtitle: {
        fontSize: 10,
        textAlign: 'center',
    },
    selectedBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Difficulty
    difficultyContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    difficultyCard: {
        flex: 1,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
    },
    digitBadge: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    digitNumber: {
        fontSize: 24,
        fontWeight: '800',
    },
    diffLabel: {
        fontSize: 14,
        fontWeight: '700',
    },
    diffSublabel: {
        fontSize: 11,
        marginTop: 2,
    },

    // Display Time
    timeContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    timeCard: {
        flex: 1,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
    },
    timeLabel: {
        fontSize: 18,
        fontWeight: '800',
        marginTop: 8,
    },
    timeDesc: {
        fontSize: 11,
        marginTop: 2,
    },

    // Rounds
    roundsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    roundBtn: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    roundBtnText: {
        fontSize: 20,
        fontWeight: '800',
    },

    // Start Button
    startBtnWrap: {
        paddingHorizontal: 16,
        marginTop: 8,
        marginBottom: 24,
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

    // How to Play
    howToPlay: {
        marginHorizontal: 16,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
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

    kurdishFont: {
        fontFamily: 'System',
    },
});
