import React from 'react';
import { StyleSheet, View, Text, ScrollView, Platform } from 'react-native';
import { CheckCircle2, Crown, ArrowRight } from 'lucide-react-native';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';

import { AnimatedScreen, BeastButton, GlassCard } from '../../components';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../localization/translations';
import { layout } from '../../theme/layout';

export default function TwoTruthsResultScreen({ route, navigation }) {
    const { players, currentTurn, gameData, fooledCount, winners } = route.params;
    const { language, isKurdish } = useLanguage();
    const { colors, isRTL } = useTheme();

    const currentPlayer = gameData.currentPlayer;
    const isLastTurn = currentTurn >= players.length - 1;
    const rowDirection = isRTL ? 'row-reverse' : 'row';

    const updatedPlayers = players.map(p => {
        let newScore = p.score || 0;
        if (p.id === currentPlayer.id) newScore += fooledCount;
        else if (winners.some(w => w.id === p.id)) newScore += 1;
        return { ...p, score: newScore };
    });

    const theLie = gameData.statements.find(s => s.isLie).text;

    const handleNext = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (isLastTurn) {
            navigation.navigate('Home');
        } else {
            navigation.replace('TwoTruthsInput', { players: updatedPlayers, currentTurn: currentTurn + 1 });
        }
    };

    return (
        <AnimatedScreen>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Reveal Card */}
                <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <GlassCard style={[styles.revealCard, { borderColor: '#EF444450', borderWidth: 2 }]}>
                        <Text style={[styles.revealTitle, isKurdish && styles.kurdishFont]}>
                            {t('twotruths.itWas', language)}
                        </Text>
                        <Text style={[styles.theLieText, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                            "{theLie}"
                        </Text>
                    </GlassCard>
                </MotiView>

                {/* Summary Section */}
                <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 200 }}>
                    <GlassCard style={styles.summarySection}>
                        <Text style={[styles.summaryTitle, { color: colors.brand.primary }, isKurdish && styles.kurdishFont]}>
                            {currentPlayer.name} {t('twotruths.fooled', language)} {fooledCount} {t('common.players', language)}
                        </Text>

                        {winners.length > 0 ? (
                            <View style={styles.winnersList}>
                                <Text style={[styles.winnersHeading, { color: colors.text.muted, textAlign: isRTL ? 'right' : 'left' }, isKurdish && styles.kurdishFont]}>
                                    {isKurdish ? 'ئەوانەی درۆکەیان زانی:' : 'Spotted the lie:'}
                                </Text>
                                {winners.map(w => (
                                    <View key={w.id} style={[styles.winnerRow, { flexDirection: rowDirection }]}>
                                        <CheckCircle2 color="#10B981" size={16} style={{ marginHorizontal: 8 }} />
                                        <Text style={[styles.winnerText, { color: w.color }, isKurdish && styles.kurdishFont]}>{w.name}</Text>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <View style={styles.noWinners}>
                                <Crown color="#F59E0B" size={32} style={{ marginBottom: 12 }} />
                                <Text style={[styles.noWinnersText, isKurdish && styles.kurdishFont]}>
                                    {isKurdish ? 'بە تەواوی هەمویانی خەڵەتاند! زۆر باشە!' : 'Completely fooled everyone! Masterful!'}
                                </Text>
                            </View>
                        )}
                    </GlassCard>
                </MotiView>

                {/* Scoreboard */}
                <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 400 }}>
                    <GlassCard style={styles.scoreBoard}>
                        <Text style={[styles.scoreTitle, { color: colors.text.muted, textAlign: isRTL ? 'right' : 'left' }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'خاڵەکان' : 'Scores'}
                        </Text>
                        {updatedPlayers.sort((a,b) => b.score - a.score).map((p, i) => (
                            <View key={p.id} style={[styles.scoreRow, { flexDirection: rowDirection, backgroundColor: colors.surface }]}>
                                <Text style={[styles.scoreRank, isKurdish && styles.kurdishFont]}>#{i + 1}</Text>
                                <Text style={[styles.scoreName, { color: p.color, textAlign: isRTL ? 'right' : 'left' }, isKurdish && styles.kurdishFont]} numberOfLines={1}>{p.name}</Text>
                                <Text style={[styles.scorePts, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>{p.score} pt</Text>
                            </View>
                        ))}
                    </GlassCard>
                </MotiView>
            </ScrollView>

            {/* Fab Button */}
            <MotiView animate={{ translateY: 0, opacity: 1 }} style={styles.fabContainer}>
                <BeastButton
                    title={isLastTurn 
                        ? (isKurdish ? 'کۆتایی یاری' : 'FINISH GAME')
                        : (isKurdish ? 'یاریزانی دواتر' : 'NEXT PLAYER')}
                    onPress={handleNext}
                    variant="primary"
                    size="lg"
                    icon={ArrowRight}
                    iconPosition={isRTL ? "left" : "right"}
                    style={{ width: '100%' }}
                />
            </MotiView>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    revealCard: { backgroundColor: '#EF444415', padding: layout.spacing.xl, marginTop: layout.spacing.md, marginBottom: layout.spacing.lg, alignItems: 'center' },
    revealTitle: { color: '#EF4444', fontSize: 13, fontWeight: '700', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 2 },
    theLieText: { fontSize: 24, fontWeight: '900', textAlign: 'center', lineHeight: 34 },
    
    summarySection: { marginBottom: layout.spacing.lg, padding: layout.spacing.lg },
    summaryTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: layout.spacing.lg },
    winnersList: { backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: layout.radius.md, padding: layout.spacing.md },
    winnersHeading: { fontSize: 13, fontWeight: '600', marginBottom: layout.spacing.md },
    winnerRow: { alignItems: 'center', marginBottom: layout.spacing.sm },
    winnerText: { fontSize: 16, fontWeight: 'bold' },
    
    noWinners: { alignItems: 'center', backgroundColor: '#F59E0B15', padding: layout.spacing.lg, borderRadius: layout.radius.md },
    noWinnersText: { color: '#FCD34D', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
    
    scoreBoard: { marginBottom: layout.spacing.xl, padding: layout.spacing.lg },
    scoreTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: layout.spacing.md },
    scoreRow: { alignItems: 'center', padding: layout.spacing.md, borderRadius: layout.radius.sm, marginBottom: 8 },
    scoreRank: { color: '#64748B', fontWeight: 'bold', width: 30 },
    scoreName: { flex: 1, fontSize: 16, fontWeight: 'bold', marginHorizontal: 8 },
    scorePts: { fontSize: 16, fontWeight: '900' },
    
    fabContainer: { position: 'absolute', bottom: 30, left: 20, right: 20 },
    kurdishFont: { fontFamily: 'Rabar', transform: [{ scale: 1.15 }] },
});
