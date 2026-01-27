import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { Trophy, Zap } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';

import { AnimatedScreen, GlassCard, BackButton } from '../../components';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../localization/translations';
import { layout } from '../../theme/layout';
import { getRandomCategories } from '../../constants/pyramidData';

const { width } = Dimensions.get('window');

const PyramidCard = ({ category, index, onPress, isCompleted, colors }) => {
    const scale = useSharedValue(0);

    useEffect(() => {
        scale.value = withDelay(index * 50, withTiming(1, { duration: 300 }));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const pointValue = (index + 1) * 100;

    return (
        <Animated.View style={animatedStyle}>
            <TouchableOpacity
                onPress={onPress}
                disabled={isCompleted}
                activeOpacity={0.8}
            >
                <GlassCard
                    intensity={isCompleted ? 10 : 30}
                    style={[
                        styles.card,
                        isCompleted && { opacity: 0.5, borderColor: colors.brand.mountain }
                    ]}
                >
                    {isCompleted ? (
                        <Trophy size={28} color={colors.brand.mountain} />
                    ) : (
                        <>
                            <Text style={[styles.cardPoints, { color: colors.brand.gold }]}>${pointValue}</Text>
                        </>
                    )}
                </GlassCard>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default function PyramidGameBoardScreen({ navigation, route }) {
    const { teams: initialTeams, currentTeam: initialCurrentTeam } = route.params;
    const { language, isKurdish } = useLanguage();
    const { colors, isRTL } = useTheme();

    const [teams, setTeams] = useState(initialTeams);
    const [currentTeamId, setCurrentTeamId] = useState(initialCurrentTeam);
    const [categories, setCategories] = useState([]);
    const [completedCategories, setCompletedCategories] = useState([]);

    const rowDirection = isRTL ? 'row-reverse' : 'row';

    useEffect(() => {
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
        const newTeams = { ...teams };
        newTeams[currentTeamId].score += score;
        setTeams(newTeams);
        setCompletedCategories(prev => [...prev, categoryIndex]);
        setCurrentTeamId(prev => prev === 'A' ? 'B' : 'A');
    };

    const renderPyramid = () => {
        if (categories.length === 0) return null;

        const top = categories[5];
        const mid = [categories[3], categories[4]];
        const bot = [categories[0], categories[1], categories[2]];

        return (
            <View style={styles.pyramidContainer}>
                {/* Top Row - Highest Value */}
                <View style={[styles.row, { justifyContent: 'center' }]}>
                    <PyramidCard
                        category={top}
                        index={5}
                        isCompleted={completedCategories.includes(5)}
                        onPress={() => handleCategorySelect(top, 5)}
                        colors={colors}
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
                            colors={colors}
                        />
                    ))}
                </View>

                {/* Bottom Row - Lowest Value */}
                <View style={[styles.row, { justifyContent: 'space-between' }]}>
                    {bot.map((cat, i) => (
                        <PyramidCard
                            key={cat.id}
                            category={cat}
                            index={i}
                            isCompleted={completedCategories.includes(i)}
                            onPress={() => handleCategorySelect(cat, i)}
                            colors={colors}
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
        <AnimatedScreen>
            {/* Header with Back Button */}
            <View style={[styles.header, { flexDirection: rowDirection }]}>
                <BackButton onPress={() => navigation.goBack()} />
                <View style={styles.headerCenter}>
                    <Zap size={20} color={colors.brand.gold} />
                    <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                        {t('pyramid.title', language)}
                    </Text>
                </View>
                <View style={{ width: 44 }} />
            </View>

            {/* Scoreboard */}
            <View style={[styles.scoreboard, { flexDirection: rowDirection }]}>
                <GlassCard
                    intensity={currentTeamId === 'A' ? 40 : 15}
                    style={[
                        styles.teamCard,
                        currentTeamId === 'A' && { borderColor: colors.brand.gold, borderWidth: 2 }
                    ]}
                >
                    <Text style={[styles.teamName, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                        {teams.A.name}
                    </Text>
                    <Text style={[styles.teamScore, { color: colors.brand.gold }]}>{teams.A.score}</Text>
                </GlassCard>

                <View style={styles.vsContainer}>
                    <Text style={[styles.vsText, { color: colors.text.muted }]}>VS</Text>
                </View>

                <GlassCard
                    intensity={currentTeamId === 'B' ? 40 : 15}
                    style={[
                        styles.teamCard,
                        currentTeamId === 'B' && { borderColor: colors.brand.gold, borderWidth: 2 }
                    ]}
                >
                    <Text style={[styles.teamName, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                        {teams.B.name}
                    </Text>
                    <Text style={[styles.teamScore, { color: colors.brand.gold }]}>{teams.B.score}</Text>
                </GlassCard>
            </View>

            {/* Instruction */}
            <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 500 }}
                style={styles.instructionContainer}
            >
                <Text style={[styles.instruction, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                    {isKurdish
                        ? `${teams[currentTeamId].name}، پۆلێک هەڵبژێرە!`
                        : `${teams[currentTeamId].name}, select a category!`
                    }
                </Text>
            </MotiView>

            {/* Pyramid */}
            <View style={styles.pyramidArea}>
                {renderPyramid()}
            </View>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: layout.spacing.md,
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    scoreboard: {
        alignItems: 'center',
        gap: 12,
        marginBottom: layout.spacing.lg,
    },
    teamCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: layout.spacing.md,
        paddingHorizontal: layout.spacing.lg,
    },
    teamName: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    teamScore: {
        fontSize: 28,
        fontWeight: '900',
    },
    vsContainer: {
        paddingHorizontal: layout.spacing.sm,
    },
    vsText: {
        fontSize: 14,
        fontWeight: '700',
    },
    instructionContainer: {
        alignItems: 'center',
        marginBottom: layout.spacing.xl,
    },
    instruction: {
        fontSize: 16,
        textAlign: 'center',
    },
    pyramidArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pyramidContainer: {
        gap: 16,
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        width: '100%',
        maxWidth: 350,
    },
    card: {
        width: 100,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: layout.radius.lg,
        borderWidth: 1,
        borderColor: 'rgba(245, 158, 11, 0.3)',
    },
    cardPoints: {
        fontSize: 20,
        fontWeight: '800',
    },
    kurdishFont: {
        fontFamily: 'Rabar',
    },
});
