import React, { useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Platform, Share, ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Home, Play, Share2, Trophy, Star, Zap } from 'lucide-react-native';
import { AnimatedScreen } from '../../components/AnimatedScreen';
import { GlassCard } from '../../components/GlassCard';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../localization/translations';
import { layout } from '../../theme/layout';
import { MotiView } from 'moti';

export default function ResultScreen({ navigation, route }) {
    const {
        team1Name, team2Name, team1Score, team2Score,
        team1Members, team2Members, winnerTeam,
        fastMoneyTotal, fastMoneyWin,
    } = route.params;
    const { language, isKurdish } = useLanguage();
    const { colors, isDark } = useTheme();

    const winner = team1Score > team2Score ? team1Name : (team2Score > team1Score ? team2Name : null);
    const isTie = team1Score === team2Score;
    const winTeam = winnerTeam || (team1Score > team2Score ? 1 : 2);
    const showFastMoney = fastMoneyTotal !== undefined;

    useEffect(() => {
        if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    }, []);

    const handleShare = async () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        try {
            const msg = isKurdish
                ? `ئەنجامی مشتومڕی خێزانی!\n${team1Name}: ${team1Score}\n${team2Name}: ${team2Score}${showFastMoney ? `\nپارەی خێرا: ${fastMoneyTotal}` : ''}\nلەگەڵ مندا یاری بکە لە ئەپی شەوانی زستان!`
                : `Family Feud Results!\n${team1Name}: ${team1Score}\n${team2Name}: ${team2Score}${showFastMoney ? `\nFast Money: ${fastMoneyTotal}` : ''}\nPlay with me on Winter Nights!`;
            await Share.share({ message: msg });
        } catch (e) { console.error(e); }
    };

    const handleFastMoney = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        navigation.navigate('FamilyFeudFastMoney', {
            winnerTeam: winTeam,
            team1Name, team2Name, team1Score, team2Score,
            team1Members: team1Members || [],
            team2Members: team2Members || [],
        });
    };

    const handlePlayAgain = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate('FamilyFeudSetup');
    };

    const handleHome = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    };

    const textColor = isDark ? '#F9FAFB' : '#111827';
    const subColor = isDark ? '#9CA3AF' : '#6B7280';

    return (
        <AnimatedScreen noPadding>
            <LinearGradient
                colors={isDark ? ['#0F172A', '#020617'] : ['#F8FAFC', '#E2E8F0']}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Trophy */}
                    <MotiView
                        from={{ opacity: 0, scale: 0.5, translateY: 40 }}
                        animate={{ opacity: 1, scale: 1, translateY: 0 }}
                        transition={{ type: 'spring', damping: 12 }}
                        style={styles.trophyWrap}
                    >
                        <View style={styles.trophyCircle}>
                            <Trophy size={72} color="#F59E0B" fill="#F59E0B" />
                        </View>
                    </MotiView>

                    <Text style={[styles.resultLabel, { color: subColor }, isKurdish && styles.kFont]}>
                        {t('common.results', language)}
                    </Text>

                    {isTie ? (
                        <Text style={[styles.winnerName, { color: '#FBBF24' }, isKurdish && styles.kFont]}>
                            {isKurdish ? 'یەکسان بوون!' : "It's a Tie!"}
                        </Text>
                    ) : (
                        <View style={styles.winnerSection}>
                            <Text style={[styles.winnerLabel, { color: subColor }, isKurdish && styles.kFont]}>
                                {isKurdish ? 'براوە' : 'WINNER'}
                            </Text>
                            <Text style={[styles.winnerName, { color: '#FBBF24' }, isKurdish && styles.kFont]}>
                                {winner}
                            </Text>
                        </View>
                    )}

                    {/* Score Cards */}
                    <GlassCard style={styles.scoreCard}>
                        <View style={styles.teamRow}>
                            <View style={[styles.teamDot, { backgroundColor: '#EF4444' }]} />
                            <Text style={[styles.teamNameText, { color: textColor }, isKurdish && styles.kFont]} numberOfLines={1}>
                                {team1Name}
                            </Text>
                            <Text style={[styles.scoreText, { color: textColor }]}>{team1Score}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.teamRow}>
                            <View style={[styles.teamDot, { backgroundColor: '#3B82F6' }]} />
                            <Text style={[styles.teamNameText, { color: textColor }, isKurdish && styles.kFont]} numberOfLines={1}>
                                {team2Name}
                            </Text>
                            <Text style={[styles.scoreText, { color: textColor }]}>{team2Score}</Text>
                        </View>
                    </GlassCard>

                    {/* Fast Money Result (if came from Fast Money) */}
                    {showFastMoney && (
                        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }}
                            transition={{ delay: 300 }}>
                            <GlassCard style={[styles.fmCard, fastMoneyWin && styles.fmCardWin]}>
                                <View style={styles.fmHeader}>
                                    <Zap size={20} color="#F59E0B" />
                                    <Text style={[styles.fmTitle, { color: textColor }, isKurdish && styles.kFont]}>
                                        {isKurdish ? 'پارەی خێرا' : 'Fast Money'}
                                    </Text>
                                </View>
                                <Text style={[styles.fmScore, fastMoneyWin ? { color: '#34D399' } : { color: '#EF4444' }]}>
                                    {fastMoneyTotal} / 200
                                </Text>
                                <Text style={[styles.fmResult, { color: subColor }, isKurdish && styles.kFont]}>
                                    {fastMoneyWin
                                        ? (isKurdish ? '🎉 خەڵاتی گەورەکەتان بردەوە!' : '🎉 Grand Prize Won!')
                                        : (isKurdish ? 'نەگەیشتن بە ئامانج' : 'Did not reach the goal')}
                                </Text>
                            </GlassCard>
                        </MotiView>
                    )}

                    {/* Fast Money Button (only if we haven't done it yet) */}
                    {!showFastMoney && !isTie && (
                        <TouchableOpacity onPress={handleFastMoney} activeOpacity={0.8} style={styles.fmButton}>
                            <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.fmButtonGrad}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                                <Star size={20} color="#FFF" />
                                <Text style={[styles.fmButtonText, isKurdish && styles.kFont]}>
                                    {isKurdish ? '💰 پارەی خێرا!' : '💰 Play Fast Money!'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                </ScrollView>

                {/* Footer Actions */}
                <View style={styles.footer}>
                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={[styles.iconBtn, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}
                            onPress={handleShare}>
                            <Share2 size={22} color={textColor} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.iconBtn, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}
                            onPress={handleHome}>
                            <Home size={22} color={textColor} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={handlePlayAgain} activeOpacity={0.8} style={styles.primaryBtn}>
                        <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.primaryBtnGrad}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                            <Play size={20} color="#FFF" fill="#FFF" />
                            <Text style={[styles.primaryBtnText, isKurdish && styles.kFont]}>
                                {t('common.playAgain', language)}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingBottom: 170, paddingTop: 20 },
    kFont: { fontFamily: 'Rabar' },

    trophyWrap: { marginBottom: 24 },
    trophyCircle: { width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(245,158,11,0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 2.5, borderColor: 'rgba(245,158,11,0.3)' },

    resultLabel: { fontSize: 14, fontWeight: '700', letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 8 },
    winnerSection: { alignItems: 'center', marginBottom: 32 },
    winnerLabel: { fontSize: 14, fontWeight: '600', marginBottom: 6, letterSpacing: 1 },
    winnerName: { fontSize: 40, fontWeight: '900', textAlign: 'center', textShadowColor: 'rgba(251,191,36,0.3)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 10 },

    scoreCard: { width: '100%', padding: 22, borderRadius: 20, marginBottom: 18 },
    teamRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
    teamDot: { width: 14, height: 14, borderRadius: 7, marginRight: 12 },
    teamNameText: { fontSize: 18, fontWeight: '700', flex: 1 },
    scoreText: { fontSize: 34, fontWeight: '900' },
    divider: { height: 1.5, backgroundColor: 'rgba(156,163,175,0.12)' },

    // Fast Money Result
    fmCard: { width: '100%', padding: 22, borderRadius: 20, marginBottom: 18 },
    fmCardWin: { borderWidth: 2.5, borderColor: 'rgba(52,211,153,0.35)' },
    fmHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    fmTitle: { fontSize: 17, fontWeight: '800', marginLeft: 10 },
    fmScore: { fontSize: 40, fontWeight: '900', textAlign: 'center', marginBottom: 6 },
    fmResult: { fontSize: 15, textAlign: 'center', fontWeight: '600' },

    // Fast Money Button
    fmButton: { width: '100%', height: 56, borderRadius: 18, overflow: 'hidden', marginBottom: 14, shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 8 },
    fmButtonGrad: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    fmButtonText: { color: '#FFF', fontSize: 18, fontWeight: '900', marginLeft: 10 },

    // Footer
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 34 : 24, backgroundColor: 'transparent' },
    actionRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 14 },
    iconBtn: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, shadowRadius: 6, marginHorizontal: 8 },
    primaryBtn: { width: '100%', height: 58, borderRadius: 29, overflow: 'hidden', shadowColor: '#F59E0B', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 8 },
    primaryBtnGrad: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    primaryBtnText: { color: '#FFF', fontSize: 18, fontWeight: '900', marginLeft: 10 },
});
