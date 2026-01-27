import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Crown,
    Trophy,
    Star,
    Medal,
    Home,
    RotateCcw,
    ThumbsDown,
    Sparkles,
} from 'lucide-react-native';

import { AnimatedScreen } from '../../components/AnimatedScreen';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

// Podium Place
const PodiumPlace = ({ player, score, place, delay }) => {
    const config = {
        1: { height: 140, color: '#FFD700', bgColor: ['#FFD700', '#FFA500'], label: '1st' },
        2: { height: 100, color: '#C0C0C0', bgColor: ['#C0C0C0', '#A8A8A8'], label: '2nd' },
        3: { height: 70, color: '#CD7F32', bgColor: ['#CD7F32', '#B8860B'], label: '3rd' },
    };

    const placeConfig = config[place];

    return (
        <MotiView
            from={{ translateY: 100, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ type: 'spring', delay }}
            style={styles.podiumPlace}
        >
            {/* Player Avatar */}
            <MotiView
                from={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: delay + 200 }}
            >
                <View style={[styles.podiumAvatar, { backgroundColor: player.color }]}>
                    <Text style={styles.podiumAvatarText}>{player.name.charAt(0)}</Text>
                    {place === 1 && (
                        <MotiView
                            from={{ rotate: '-20deg', scale: 0 }}
                            animate={{ rotate: '0deg', scale: 1 }}
                            transition={{ type: 'spring', delay: delay + 400 }}
                            style={styles.crownWrapper}
                        >
                            <Crown size={20} color="#FFD700" fill="#FFD700" />
                        </MotiView>
                    )}
                </View>
            </MotiView>

            {/* Player Name */}
            <Text style={styles.podiumName} numberOfLines={1}>{player.name}</Text>

            {/* Score */}
            <View style={styles.podiumScoreContainer}>
                <Star size={14} color="#FFD700" fill="#FFD700" />
                <Text style={styles.podiumScore}>{score}</Text>
            </View>

            {/* Podium Stand */}
            <MotiView
                from={{ height: 0 }}
                animate={{ height: placeConfig.height }}
                transition={{ type: 'timing', duration: 600, delay }}
            >
                <LinearGradient
                    colors={placeConfig.bgColor}
                    style={[styles.podiumStand, { height: placeConfig.height }]}
                >
                    <Text style={styles.podiumPlaceText}>{placeConfig.label}</Text>
                    <ThumbsDown size={16} color="rgba(255,255,255,0.5)" style={{ marginTop: 4 }} />
                </LinearGradient>
            </MotiView>
        </MotiView>
    );
};

// Other Player Card
const OtherPlayerCard = ({ player, score, rank, colors, isDark, delay }) => (
    <MotiView
        from={{ opacity: 0, translateX: -20 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ delay }}
        style={[styles.otherPlayerCard, { backgroundColor: isDark ? '#1A0B2E' : '#FFF' }]}
    >
        <Text style={[styles.otherRank, { color: colors.text.muted }]}>#{rank}</Text>
        <View style={[styles.otherAvatar, { backgroundColor: player.color }]}>
            <Text style={styles.otherAvatarText}>{player.name.charAt(0)}</Text>
        </View>
        <Text style={[styles.otherName, { color: colors.text.primary }]}>{player.name}</Text>
        <View style={styles.otherScore}>
            <Star size={14} color="#FFD700" fill="#FFD700" />
            <Text style={styles.otherScoreText}>{score}</Text>
        </View>
    </MotiView>
);

export default function WrongAnswerFinal({ navigation, route }) {
    const { isKurdish } = useLanguage();
    const { colors, isDark } = useTheme();

    const { players, scores } = route.params;

    // Sort players by score
    const sortedPlayers = players
        .map((player, index) => ({ player, score: scores[index], index }))
        .sort((a, b) => b.score - a.score);

    const winner = sortedPlayers[0];
    const topThree = sortedPlayers.slice(0, 3);
    const others = sortedPlayers.slice(3);

    return (
        <AnimatedScreen>
            <View style={styles.container}>
                {/* Trophy Animation */}
                <MotiView
                    from={{ scale: 0, rotate: '-30deg' }}
                    animate={{ scale: 1, rotate: '0deg' }}
                    transition={{ type: 'spring', delay: 200 }}
                    style={styles.trophyContainer}
                >
                    <LinearGradient
                        colors={['#FFD700', '#FFA500']}
                        style={styles.trophyCircle}
                    >
                        <Trophy size={50} color="#FFF" fill="#FFF" />
                    </LinearGradient>
                </MotiView>

                {/* Title */}
                <MotiView
                    from={{ opacity: 0, translateY: -20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 400 }}
                >
                    <Text style={[styles.title, { color: colors.text.primary }]}>
                        {isKurdish ? 'یاری تەواو بوو!' : 'Game Over!'}
                    </Text>
                    <View style={styles.winnerNameContainer}>
                        <Sparkles size={20} color="#FFD700" />
                        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                            {isKurdish
                                ? `${winner.player.name} شاری وەڵامی هەڵە!`
                                : `${winner.player.name} is the Wrong Answer Champion!`
                            }
                        </Text>
                        <Sparkles size={20} color="#FFD700" />
                    </View>
                </MotiView>

                {/* Podium */}
                <View style={styles.podiumContainer}>
                    {topThree.length >= 2 && (
                        <PodiumPlace
                            player={topThree[1].player}
                            score={topThree[1].score}
                            place={2}
                            delay={600}
                        />
                    )}
                    {topThree.length >= 1 && (
                        <PodiumPlace
                            player={topThree[0].player}
                            score={topThree[0].score}
                            place={1}
                            delay={400}
                        />
                    )}
                    {topThree.length >= 3 && (
                        <PodiumPlace
                            player={topThree[2].player}
                            score={topThree[2].score}
                            place={3}
                            delay={800}
                        />
                    )}
                </View>

                {/* Other Players */}
                {others.length > 0 && (
                    <View style={styles.othersContainer}>
                        {others.map(({ player, score }, index) => (
                            <OtherPlayerCard
                                key={index}
                                player={player}
                                score={score}
                                rank={index + 4}
                                colors={colors}
                                isDark={isDark}
                                delay={1000 + index * 100}
                            />
                        ))}
                    </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigation.navigate('WrongAnswerSetup')}
                        style={styles.playAgainBtnWrap}
                    >
                        <LinearGradient
                            colors={['#D900FF', '#7000FF']}
                            style={styles.playAgainBtn}
                        >
                            <RotateCcw size={20} color="#FFF" />
                            <Text style={styles.playAgainBtnText}>
                                {isKurdish ? 'دووبارە یاری بکە' : 'Play Again'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.homeBtn, { backgroundColor: isDark ? '#1A0B2E' : '#FFF' }]}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Home size={20} color={colors.text.primary} />
                        <Text style={[styles.homeBtnText, { color: colors.text.primary }]}>
                            {isKurdish ? 'ماڵەوە' : 'Home'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        alignItems: 'center',
    },

    // Trophy
    trophyContainer: {
        marginTop: 20,
        marginBottom: 16,
    },
    trophyCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Title
    title: {
        fontSize: 32,
        fontWeight: '900',
        textAlign: 'center',
    },
    winnerNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 8,
        marginBottom: 30,
        paddingHorizontal: 16,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
    },

    // Podium
    podiumContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    podiumPlace: {
        alignItems: 'center',
        marginHorizontal: 6,
        width: (width - 100) / 3,
    },
    podiumAvatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: 8,
    },
    podiumAvatarText: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: '800',
    },
    crownWrapper: {
        position: 'absolute',
        top: -14,
    },
    podiumName: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 4,
    },
    podiumScoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 8,
    },
    podiumScore: {
        color: '#FFD700',
        fontSize: 15,
        fontWeight: '800',
    },
    podiumStand: {
        width: '100%',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
    },
    podiumPlaceText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
    },

    // Others
    othersContainer: {
        width: '100%',
        gap: 8,
        marginBottom: 24,
    },
    otherPlayerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    otherRank: {
        width: 28,
        fontSize: 13,
        fontWeight: '600',
    },
    otherAvatar: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    otherAvatarText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    },
    otherName: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
    },
    otherScore: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    otherScoreText: {
        color: '#FFD700',
        fontSize: 16,
        fontWeight: '800',
    },

    // Actions
    actionsContainer: {
        width: '100%',
        gap: 12,
        marginTop: 'auto',
        paddingBottom: 24,
    },
    playAgainBtnWrap: {
        width: '100%',
    },
    playAgainBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderRadius: 28,
        gap: 10,
    },
    playAgainBtnText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
    homeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderRadius: 25,
        gap: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    homeBtnText: {
        fontSize: 15,
        fontWeight: '600',
    },

    kurdishFont: {
        fontFamily: 'System',
    },
});
