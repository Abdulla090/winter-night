import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay } from 'react-native-reanimated';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../localization/translations';
import { getRandomCategories } from '../../constants/pyramidData';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - SPACING.xl * 2) / 3 - 8;

const PyramidCard = ({ category, index, onPress, isCompleted }) => {
    const scale = useSharedValue(0);

    useEffect(() => {
        scale.value = withDelay(index * 100, withSpring(1));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    return (
        <Animated.View style={[animatedStyle]}>
            <TouchableOpacity
                style={[
                    styles.card,
                    isCompleted && styles.cardCompleted
                ]}
                onPress={onPress}
                disabled={isCompleted}
                activeOpacity={0.8}
            >
                {isCompleted ? (
                    <Ionicons name="checkmark" size={32} color={COLORS.accent.success} />
                ) : (
                    <Text style={styles.cardRank}>${(index + 1) * 100}</Text>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

export default function PyramidGameBoardScreen({ navigation, route }) {
    const { teams: initialTeams, currentTeam: initialCurrentTeam } = route.params;
    const { language, isKurdish } = useLanguage();

    // State
    const [teams, setTeams] = useState(initialTeams);
    const [currentTeamId, setCurrentTeamId] = useState(initialCurrentTeam);
    const [categories, setCategories] = useState([]);
    const [completedCategories, setCompletedCategories] = useState([]);

    const rowDirection = isKurdish ? 'row-reverse' : 'row';

    useEffect(() => {
        // Load categories on mount
        const cats = getRandomCategories(6);
        setCategories(cats);
    }, []);

    const handleCategorySelect = (category, index) => {
        navigation.navigate('PyramidPlay', {
            category,
            teamName: teams[currentTeamId].name,
            onComplete: (score) => handleRoundComplete(score, index)
        });
    };

    const handleRoundComplete = (score, categoryIndex) => {
        // Update score
        const newTeams = { ...teams };
        newTeams[currentTeamId].score += score;
        setTeams(newTeams);

        // Mark category as completed
        setCompletedCategories(prev => [...prev, categoryIndex]);

        // Switch team
        setCurrentTeamId(prev => prev === 'A' ? 'B' : 'A');
    };

    const renderPyramid = () => {
        if (categories.length === 0) return null;

        // Pyramid Layout: 1 Top, 2 Middle, 3 Bottom
        // Indexes: Top(5), Mid(3,4), Bottom(0,1,2)
        // Adjusting layout to build UP:
        // Row 1 (Top): [5]
        // Row 2 (Mid): [3, 4]
        // Row 3 (Bot): [0, 1, 2]

        const top = categories[5];
        const mid = [categories[3], categories[4]];
        const bot = [categories[0], categories[1], categories[2]];

        return (
            <View style={styles.pyramidContainer}>
                {/* Top Row */}
                <View style={[styles.row, { justifyContent: 'center' }]}>
                    <PyramidCard
                        category={top}
                        index={5}
                        isCompleted={completedCategories.includes(5)}
                        onPress={() => handleCategorySelect(top, 5)}
                    />
                </View>

                {/* Middle Row */}
                <View style={[styles.row, { justifyContent: 'center', gap: 16 }]}>
                    {mid.map((cat, i) => (
                        <PyramidCard
                            key={cat.id}
                            category={cat}
                            index={3 + i}
                            isCompleted={completedCategories.includes(3 + i)}
                            onPress={() => handleCategorySelect(cat, 3 + i)}
                        />
                    ))}
                </View>

                {/* Bottom Row */}
                <View style={[styles.row, { justifyContent: 'space-between' }]}>
                    {bot.map((cat, i) => (
                        <PyramidCard
                            key={cat.id}
                            category={cat}
                            index={i}
                            isCompleted={completedCategories.includes(i)}
                            onPress={() => handleCategorySelect(cat, i)}
                        />
                    ))}
                </View>
            </View>
        );
    };

    const isGameOver = completedCategories.length === 6;

    useEffect(() => {
        if (isGameOver) {
            navigation.replace('PyramidResult', { teams });
        }
    }, [isGameOver]);

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            {/* Scoreboard */}
            <View style={[styles.scoreboard, { flexDirection: rowDirection }]}>
                <View style={[styles.teamScore, currentTeamId === 'A' && styles.activeTeam]}>
                    <Text style={[styles.teamName, isKurdish && styles.kurdishFont]}>{teams.A.name}</Text>
                    <Text style={styles.teamPoints}>{teams.A.score}</Text>
                </View>
                <View style={styles.vsContainer}>
                    <Text style={styles.vsText}>VS</Text>
                </View>
                <View style={[styles.teamScore, currentTeamId === 'B' && styles.activeTeam]}>
                    <Text style={[styles.teamName, isKurdish && styles.kurdishFont]}>{teams.B.name}</Text>
                    <Text style={styles.teamPoints}>{teams.B.score}</Text>
                </View>
            </View>

            <View style={styles.centerArea}>
                <Text style={[styles.instruction, isKurdish && styles.kurdishFont]}>
                    {isKurdish
                        ? `${teams[currentTeamId].name}، پۆلێک هەڵبژێرە!`
                        : `${teams[currentTeamId].name}, select a category!`
                    }
                </Text>
                {renderPyramid()}
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background.dark },
    scoreboard: {
        flexDirection: 'row',
        padding: SPACING.md,
        backgroundColor: COLORS.background.card,
        elevation: 4,
    },
    teamScore: {
        flex: 1,
        alignItems: 'center',
        padding: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
        opacity: 0.5,
    },
    activeTeam: {
        backgroundColor: 'rgba(234, 179, 8, 0.15)',
        borderWidth: 1,
        borderColor: COLORS.games.pyramid,
        opacity: 1,
    },
    teamName: { color: COLORS.text.primary, ...FONTS.bold, fontSize: 16 },
    teamPoints: { color: COLORS.games.pyramid, ...FONTS.large, fontSize: 24 },
    vsContainer: { justifyContent: 'center', paddingHorizontal: SPACING.md },
    vsText: { color: COLORS.text.muted, ...FONTS.bold },
    centerArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.lg,
    },
    instruction: {
        color: COLORS.text.secondary,
        ...FONTS.medium,
        marginBottom: SPACING.xl,
        textAlign: 'center',
    },
    pyramidContainer: {
        gap: 16,
    },
    row: {
        flexDirection: 'row',
        width: '100%',
        maxWidth: 350,
    },
    card: {
        width: 100,
        height: 80,
        backgroundColor: COLORS.games.pyramid,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 2,
        borderColor: '#fef3c7', // light amber
    },
    cardCompleted: {
        backgroundColor: COLORS.background.card,
        borderColor: COLORS.accent.success,
    },
    cardRank: {
        color: '#000', // Black text on gold
        ...FONTS.bold,
        fontSize: 20,
    },
    kurdishFont: { fontFamily: 'Rabar' },
});
