import React from 'react';
import { StyleSheet, View, Text, ScrollView, Platform } from 'react-native';
import { Trophy, RotateCcw, Home, Crown, Dice5, Swords } from 'lucide-react-native';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';

import { AnimatedScreen, BeastButton, GlassCard } from '../../components';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { layout } from '../../theme/layout';

export default function TawlaResultScreen({ navigation, route }) {
    const { winner, winType, player1Name, player2Name, stats } = route.params;
    const { language, isKurdish } = useLanguage();
    const { colors, isRTL } = useTheme();
    const rowDirection = isRTL ? 'row-reverse' : 'row';

    const winnerName = winner === 1 ? player1Name : player2Name;
    const loserName = winner === 1 ? player2Name : player1Name;

    const getWinTypeLabel = () => {
        if (winType === 'backgammon') return isKurdish ? 'باکگامۆن! (٣×)' : 'Backgammon! (3×)';
        if (winType === 'gammon') return isKurdish ? 'گامۆن! (٢×)' : 'Gammon! (2×)';
        if (winType === 'resign') return isKurdish ? 'بە وازهێنان' : 'By Resignation';
        return isKurdish ? 'بردنەوە!' : 'Win!';
    };

    const handlePlayAgain = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        navigation.navigate('SheshBeshPlay', { player1Name, player2Name });
    };
    const handleNewGame = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate('SheshBeshSetup');
    };
    const handleGoHome = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate('Home');
    };

    return (
        <AnimatedScreen>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Trophy */}
                <MotiView from={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                    style={{ alignItems: 'center', marginBottom: layout.spacing.lg }}>
                    <View style={[styles.heroIcon, { backgroundColor: colors.accent + '20' }]}>
                        <Crown size={48} color={colors.accent} strokeWidth={1.5} />
                    </View>
                </MotiView>

                {/* Winner */}
                <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 400, delay: 300 }}>
                    <Text style={[styles.winLabel, { color: colors.accent }, isKurdish && styles.kf]}>
                        {getWinTypeLabel()}
                    </Text>
                    <Text style={[styles.winnerName, { color: colors.text.primary }, isKurdish && styles.kf]}>
                        {winnerName}
                    </Text>
                    <Text style={[styles.defeatText, { color: colors.text.muted }, isKurdish && styles.kf]}>
                        {isKurdish ? `${loserName} بردەستی هێنا` : `defeated ${loserName}`}
                    </Text>
                </MotiView>

                {/* Stats */}
                <GlassCard style={{ marginTop: layout.spacing.lg, marginBottom: layout.spacing.xl }}>
                    <View style={[styles.statsRow, { flexDirection: rowDirection }]}>
                        <View style={styles.statItem}>
                            <Swords size={20} color={colors.accent} />
                            <Text style={[styles.statValue, { color: colors.text.primary }]}>
                                {stats?.[1]?.borneOff || 0}
                            </Text>
                            <Text style={[styles.statLabel, { color: colors.text.muted }, isKurdish && styles.kf]}>
                                {isKurdish ? `${player1Name}` : `${player1Name}`}
                            </Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                        <View style={styles.statItem}>
                            <Dice5 size={20} color={colors.accent} />
                            <Text style={[styles.statValue, { color: colors.text.primary }]}>
                                {winType === 'backgammon' ? '3×' : winType === 'gammon' ? '2×' : '1×'}
                            </Text>
                            <Text style={[styles.statLabel, { color: colors.text.muted }, isKurdish && styles.kf]}>
                                {isKurdish ? 'جۆری بردنەوە' : 'Win Type'}
                            </Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                        <View style={styles.statItem}>
                            <Trophy size={20} color="#FFD700" />
                            <Text style={[styles.statValue, { color: colors.text.primary }]}>
                                {stats?.[2]?.borneOff || 0}
                            </Text>
                            <Text style={[styles.statLabel, { color: colors.text.muted }, isKurdish && styles.kf]}>
                                {isKurdish ? `${player2Name}` : `${player2Name}`}
                            </Text>
                        </View>
                    </View>
                </GlassCard>

                {/* Actions */}
                <View style={styles.actions}>
                    <BeastButton
                        title={isKurdish ? 'دووبارە یاری بکە' : 'Play Again'}
                        onPress={handlePlayAgain}
                        variant="primary"
                        size="lg"
                        icon={RotateCcw}
                        style={{ width: '100%', marginBottom: 12 }}
                    />
                    <View style={[styles.secondaryRow, { flexDirection: rowDirection }]}>
                        <BeastButton
                            title={isKurdish ? 'یاری نوێ' : 'New Game'}
                            onPress={handleNewGame}
                            variant="secondary"
                            size="md"
                            icon={Trophy}
                            style={{ flex: 1, marginRight: isRTL ? 0 : 6, marginLeft: isRTL ? 6 : 0 }}
                        />
                        <BeastButton
                            title={isKurdish ? 'ماڵەوە' : 'Home'}
                            onPress={handleGoHome}
                            variant="secondary"
                            size="md"
                            icon={Home}
                            style={{ flex: 1, marginLeft: isRTL ? 0 : 6, marginRight: isRTL ? 6 : 0 }}
                        />
                    </View>
                </View>
            </ScrollView>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    content: { paddingBottom: 40, alignItems: 'center' },
    heroIcon: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
    winLabel: { fontSize: 14, fontWeight: '800', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 },
    winnerName: { fontSize: 28, fontWeight: '900', textAlign: 'center', marginBottom: 4 },
    defeatText: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
    statItem: { alignItems: 'center', gap: 6, flex: 1 },
    statValue: { fontSize: 24, fontWeight: '900' },
    statLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', textAlign: 'center' },
    statDivider: { width: 1, height: 40 },
    actions: { width: '100%' },
    secondaryRow: { flexDirection: 'row' },
    kf: { fontFamily: 'Rabar' },
});
