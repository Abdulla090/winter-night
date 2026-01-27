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
    Share2,
} from 'lucide-react-native';

import { AnimatedScreen } from '../../components/AnimatedScreen';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

// Podium Place Component
const PodiumPlace = ({ player, score, place, delay }) => {
    const config = {
        1: { height: 140, color: '#FFD700', icon: Crown, label: '1st' },
        2: { height: 100, color: '#C0C0C0', icon: Medal, label: '2nd' },
        3: { height: 70, color: '#CD7F32', icon: Medal, label: '3rd' },
    };

    const placeConfig = config[place];
    const Icon = placeConfig.icon;

    return (
        <MotiView
            from={{ translateY: 100, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ type: 'spring', delay }}
            style={[styles.podiumPlace, { order: place === 1 ? 0 : place === 2 ? -1 : 1 }]}
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
                        <View style={styles.crownBadge}>
                            <Crown size={16} color="#FFD700" fill="#FFD700" />
                        </View>
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
                transition={{ type: 'timing', duration: 500, delay }}
            >
                <LinearGradient
                    colors={[placeConfig.color, placeConfig.color + '88']}
                    style={[styles.podiumStand, { height: placeConfig.height }]}
                >
                    <Text style={styles.podiumPlaceText}>{placeConfig.label}</Text>
                </LinearGradient>
            </MotiView>
        </MotiView>
    );
};

// Other Player Score Card
const OtherPlayerCard = ({ player, score, rank, colors, isDark }) => (
    <View style={[styles.otherPlayerCard, { backgroundColor: isDark ? '#1A0B2E' : '#FFF' }]}>
        <Text style={[styles.otherRank, { color: colors.text.muted }]}>#{rank}</Text>
        <View style={[styles.otherAvatar, { backgroundColor: player.color }]}>
            <Text style={styles.otherAvatarText}>{player.name.charAt(0)}</Text>
        </View>
        <Text style={[styles.otherName, { color: colors.text.primary }]}>{player.name}</Text>
        <View style={styles.otherScore}>
            <Star size={14} color="#FFD700" fill="#FFD700" />
            <Text style={styles.otherScoreText}>{score}</Text>
        </View>
    </View>
);

export default function ImpostorDrawFinal({ navigation, route }) {
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
                {/* Trophy Header */}
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
                    <Text style={[styles.title, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'یاری تەواو بوو!' : 'Game Over!'}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                        {isKurdish
                            ? `${winner.player.name} بردیەوە!`
                            : `${winner.player.name} wins!`
                        }
                    </Text>
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
                            />
                        ))}
                    </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigation.navigate('ImpostorDrawSetup')}
                        style={styles.playAgainBtnWrap}
                    >
                        <LinearGradient
                            colors={['#D900FF', '#7000FF']}
                            style={styles.playAgainBtn}
                        >
                            <RotateCcw size={20} color="#FFF" />
                            <Text style={[styles.playAgainBtnText, isKurdish && styles.kurdishFont]}>
                                {isKurdish ? 'دووبارە یاری بکە' : 'Play Again'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.homeBtn, { backgroundColor: isDark ? '#1A0B2E' : '#FFF' }]}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Home size={20} color={colors.text.primary} />
                        <Text style={[styles.homeBtnText, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
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
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 30,
    },

    // Podium
    podiumContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    podiumPlace: {
        alignItems: 'center',
        marginHorizontal: 8,
        width: (width - 100) / 3,
    },
    podiumAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: 8,
    },
    podiumAvatarText: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '800',
    },
    crownBadge: {
        position: 'absolute',
        top: -12,
        alignSelf: 'center',
    },
    podiumName: {
        color: '#FFF',
        fontSize: 14,
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
        fontSize: 16,
        fontWeight: '800',
    },
    podiumStand: {
        width: '100%',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 12,
    },
    podiumPlaceText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '800',
    },

    // Others
    othersContainer: {
        width: '100%',
        gap: 10,
        marginBottom: 24,
    },
    otherPlayerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    otherRank: {
        width: 32,
        fontSize: 14,
        fontWeight: '600',
    },
    otherAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    otherAvatarText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    otherName: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
    },
    otherScore: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
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
        height: 52,
        borderRadius: 26,
        gap: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    homeBtnText: {
        fontSize: 16,
        fontWeight: '600',
    },

    kurdishFont: {
        fontFamily: 'System',
    },
});
