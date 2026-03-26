import React from 'react';
import { StyleSheet, View, Text, ScrollView, Platform } from 'react-native';
import { Trophy, RotateCcw, Home, Clock, Eye, Sparkles, Star } from 'lucide-react-native';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';

import { AnimatedScreen, BeastButton, GlassCard } from '../../components';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { layout } from '../../theme/layout';

export default function CrosswordResultScreen({ navigation, route }) {
    const { time, hintsUsed, puzzleTitle } = route.params || {};
    const { language, isKurdish } = useLanguage();
    const { colors, isRTL } = useTheme();
    const rowDirection = isRTL ? 'row-reverse' : 'row';

    const formatTime = (s) => {
        if (!s) return '00:00';
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    // Score: base 1000 - (time penalty) - (hint penalty)
    const baseScore = 1000;
    const timePenalty = Math.floor((time || 0) * 0.5);
    const hintPenalty = (hintsUsed || 0) * 50;
    const finalScore = Math.max(0, baseScore - timePenalty - hintPenalty);

    // Star rating based on score
    const stars = finalScore >= 800 ? 3 : finalScore >= 500 ? 2 : 1;

    const handlePlayAgain = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        navigation.navigate('CrosswordPlay');
    };
    const handleGoHome = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate('Home');
    };

    return (
        <AnimatedScreen>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Trophy Animation */}
                <MotiView
                    from={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                    style={{ alignItems: 'center', marginBottom: layout.spacing.lg }}
                >
                    <View style={[styles.heroIcon, { backgroundColor: colors.accent + '20' }]}>
                        <Sparkles size={48} color="#FFD700" strokeWidth={1.5} />
                    </View>
                </MotiView>

                {/* Title */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 400, delay: 300 }}
                >
                    <Text style={[styles.winLabel, { color: colors.accent }, isKurdish && styles.kf]}>
                        {isKurdish ? 'ئافەرین!' : 'Well Done!'}
                    </Text>
                    <Text style={[styles.puzzleTitle, { color: colors.text.primary }, isKurdish && styles.kf]}>
                        {puzzleTitle || (isKurdish ? 'خاچەوشە' : 'Crossword')}
                    </Text>

                    {/* Stars */}
                    <View style={styles.starsRow}>
                        {[1, 2, 3].map(i => (
                            <MotiView
                                key={i}
                                from={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'spring', delay: 500 + i * 200, damping: 8 }}
                            >
                                <Star
                                    size={32}
                                    color={i <= stars ? '#FFD700' : (colors.text.muted + '40')}
                                    fill={i <= stars ? '#FFD700' : 'transparent'}
                                />
                            </MotiView>
                        ))}
                    </View>
                </MotiView>

                {/* Stats */}
                <GlassCard style={{ marginTop: layout.spacing.lg, marginBottom: layout.spacing.lg }}>
                    <View style={[styles.statsRow, { flexDirection: rowDirection }]}>
                        <View style={styles.statItem}>
                            <Trophy size={22} color="#FFD700" />
                            <Text style={[styles.statValue, { color: colors.text.primary }]}>{finalScore}</Text>
                            <Text style={[styles.statLabel, { color: colors.text.muted }, isKurdish && styles.kf]}>
                                {isKurdish ? 'ئەنجام' : 'Score'}
                            </Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                        <View style={styles.statItem}>
                            <Clock size={22} color="#4A90D9" />
                            <Text style={[styles.statValue, { color: colors.text.primary }]}>{formatTime(time)}</Text>
                            <Text style={[styles.statLabel, { color: colors.text.muted }, isKurdish && styles.kf]}>
                                {isKurdish ? 'کات' : 'Time'}
                            </Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                        <View style={styles.statItem}>
                            <Eye size={22} color="#8B5CF6" />
                            <Text style={[styles.statValue, { color: colors.text.primary }]}>{hintsUsed || 0}</Text>
                            <Text style={[styles.statLabel, { color: colors.text.muted }, isKurdish && styles.kf]}>
                                {isKurdish ? 'ئاماژە' : 'Hints'}
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
                    <BeastButton
                        title={isKurdish ? 'ماڵەوە' : 'Home'}
                        onPress={handleGoHome}
                        variant="secondary"
                        size="md"
                        icon={Home}
                        style={{ width: '100%' }}
                    />
                </View>
            </ScrollView>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    content: { paddingBottom: 40, alignItems: 'center' },
    heroIcon: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
    winLabel: {
        fontSize: 14, fontWeight: '800', textAlign: 'center',
        textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4,
    },
    puzzleTitle: { fontSize: 24, fontWeight: '900', textAlign: 'center', marginBottom: 12 },
    starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 4 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
    statItem: { alignItems: 'center', gap: 6 },
    statValue: { fontSize: 22, fontWeight: '900' },
    statLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
    statDivider: { width: 1, height: 40 },
    actions: { width: '100%' },
    kf: { fontFamily: 'Rabar' },
});
