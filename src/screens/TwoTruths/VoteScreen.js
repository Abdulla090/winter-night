import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { Eye } from 'lucide-react-native';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';

import { AnimatedScreen, BeastButton, GlassCard } from '../../components';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../localization/translations';
import { layout } from '../../theme/layout';

export default function TwoTruthsVoteScreen({ route, navigation }) {
    const { players, currentTurn, gameData } = route.params;
    const { language, isKurdish } = useLanguage();
    const { colors, isRTL } = useTheme();

    const [shuffledStatements, setShuffledStatements] = useState([]);
    const [votes, setVotes] = useState({});
    
    const currentPlayer = players[currentTurn];
    const otherPlayers = players.filter(p => p.id !== currentPlayer.id);
    const rowDirection = isRTL ? 'row-reverse' : 'row';

    useEffect(() => {
        const shuffled = [...gameData.statements].sort(() => 0.5 - Math.random());
        setShuffledStatements(shuffled);
    }, []);

    const toggleVote = (playerId, statementId) => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setVotes({ ...votes, [playerId]: statementId });
    };

    const handleReveal = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        let fooledCount = 0;
        let winners = [];
        
        otherPlayers.forEach(p => {
            const votedId = votes[p.id];
            const actualLieId = gameData.statements.find(s => s.isLie).id;
            if (votedId === actualLieId) winners.push(p);
            else fooledCount++;
        });

        navigation.replace('TwoTruthsResult', { players, currentTurn, gameData, fooledCount, winners, votes });
    };

    const allVoted = Object.keys(votes).length === otherPlayers.length;

    return (
        <AnimatedScreen>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Header */}
                <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} style={styles.header}>
                    <Text style={[styles.title, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                        {currentPlayer.name}{isKurdish ? ' ڕستەکانی' : "'s Statements"}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.brand.primary }, isKurdish && styles.kurdishFont]}>
                        {t('twotruths.voteLie', language)}
                    </Text>
                </MotiView>

                {/* Statements List */}
                {shuffledStatements.map((stmt, idx) => (
                    <MotiView
                        key={stmt.id}
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: idx * 100 }}
                    >
                        <GlassCard style={styles.statementCard}>
                            <View style={styles.stmtIndex}>
                                <Text style={styles.stmtIdxText}>{idx + 1}</Text>
                            </View>
                            <Text style={[styles.stmtText, { color: colors.text.primary }, isKurdish && { fontFamily: 'Rabar', textAlign: 'right' }]}>
                                {stmt.text}
                            </Text>

                            <View style={[styles.votersWrap, { flexDirection: rowDirection }]}>
                                {otherPlayers.map(p => {
                                    const hasVoted = votes[p.id] === stmt.id;
                                    return (
                                        <TouchableOpacity 
                                            key={p.id}
                                            style={[styles.voterBadge, { borderColor: p.color }, hasVoted && { backgroundColor: p.color }]}
                                            onPress={() => toggleVote(p.id, stmt.id)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={[styles.voterName, { color: hasVoted ? '#FFF' : colors.text.secondary }, isKurdish && styles.kurdishFont]} numberOfLines={1}>
                                                {p.name}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </GlassCard>
                    </MotiView>
                ))}
            </ScrollView>

            {/* Fab Button */}
            <MotiView animate={{ translateY: allVoted ? 0 : 100, opacity: allVoted ? 1 : 0 }} style={styles.fabContainer}>
                <BeastButton
                    title={isKurdish ? 'ئاشکراکردنی درۆکە' : 'REVEAL LIE'}
                    onPress={handleReveal}
                    variant="success"
                    size="lg"
                    icon={Eye}
                    style={{ width: '100%' }}
                />
            </MotiView>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    header: { alignItems: 'center', marginBottom: layout.spacing.xl, marginTop: layout.spacing.md },
    title: { fontSize: 26, fontWeight: '900', textAlign: 'center', marginBottom: 8 },
    subtitle: { fontSize: 16, fontWeight: '700', textAlign: 'center' },
    
    statementCard: { marginBottom: layout.spacing.lg, padding: 20 },
    stmtIndex: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(139, 92, 246, 0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    stmtIdxText: { color: '#8B5CF6', fontWeight: 'bold' },
    stmtText: { fontSize: 18, fontWeight: '500', lineHeight: 28, marginBottom: 20 },
    
    votersWrap: { flexWrap: 'wrap', gap: 8 },
    voterBadge: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: layout.radius.sm, borderWidth: 1, backgroundColor: 'rgba(0,0,0,0.1)' },
    voterName: { fontSize: 12, fontWeight: '700' },
    
    fabContainer: { position: 'absolute', bottom: 30, left: 20, right: 20 },
    kurdishFont: { fontFamily: 'Rabar', transform: [{ scale: 1.15 }] },
});
