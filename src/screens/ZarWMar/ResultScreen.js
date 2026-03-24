import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Trophy, RefreshCw, Home } from 'lucide-react-native';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';

import { AnimatedScreen, BeastButton, GlassCard } from '../../components';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { layout } from '../../theme/layout';

export default function ResultScreen({ route, navigation }) {
    const { winner, players } = route.params;
    const { isKurdish } = useLanguage();
    const { colors, isRTL } = useTheme();
    const rowDirection = isRTL ? 'row-reverse' : 'row';

    const handlePlayAgain = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const resetPlayers = players.map(p => ({...p, position: 0}));
        navigation.replace('ZarWMarPlay', { players: resetPlayers });
    };

    const handleGoHome = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate('Home');
    };

    return (
        <AnimatedScreen>
            <View style={styles.container}>
                <MotiView 
                    from={{ scale: 0.5, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    transition={{ type: 'spring', damping: 12 }}
                    style={styles.cardWrapper}
                >
                    <GlassCard style={styles.card}>
                        <MotiView
                            from={{ translateY: -20 }}
                            animate={{ translateY: 0 }}
                            transition={{ type: 'spring', loop: true, duration: 1500 }}
                            style={{ marginBottom: layout.spacing.xl, marginTop: layout.spacing.md }}
                        >
                            <Trophy size={80} color="#FBBF24" fill="#FBBF24" />
                        </MotiView>

                        <Text style={[styles.winnerText, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                            {winner.name}
                        </Text>
                        
                        <Text style={[styles.title, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'براوەیە!' : 'IS THE WINNER!'}
                        </Text>

                        <View style={[styles.statsRow, { flexDirection: rowDirection }]}>
                            <View style={[styles.badge, { backgroundColor: winner.color + '20', borderColor: winner.color }]}>
                                <Text style={[styles.badgeText, { color: winner.color }, isKurdish && styles.kurdishFont]}>
                                    {isKurdish ? 'بە پلەی یەکەم' : '1st Place'}
                                </Text>
                            </View>
                            <View style={[styles.badge, { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }]}>
                                <Text style={[styles.badgeText, { color: '#10B981' }, isKurdish && styles.kurdishFont]}>
                                    100 {isKurdish ? 'خاڵ' : 'Points'}
                                </Text>
                            </View>
                        </View>
                    </GlassCard>
                </MotiView>

                {/* Footer Controls */}
                <MotiView 
                    from={{ translateY: 50, opacity: 0 }} 
                    animate={{ translateY: 0, opacity: 1 }} 
                    transition={{ delay: 300, type: 'timing' }}
                    style={styles.footer}
                >
                    <BeastButton
                        title={isKurdish ? 'دووبارەکردنەوە' : 'PLAY AGAIN'}
                        onPress={handlePlayAgain}
                        variant="success"
                        size="lg"
                        icon={RefreshCw}
                        style={{ marginBottom: layout.spacing.md }}
                    />
                    
                    <BeastButton
                        title={isKurdish ? 'گەڕانەوە بۆ سەرەتا' : 'HOME SCREEN'}
                        onPress={handleGoHome}
                        variant="secondary"
                        size="md"
                        icon={Home}
                    />
                </MotiView>
            </View>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: layout.spacing.lg, justifyContent: 'center' },
    cardWrapper: { alignItems: 'center', marginBottom: layout.spacing.xxl },
    card: { width: '100%', alignItems: 'center', padding: layout.spacing.xl, borderWidth: 2, borderColor: 'rgba(251, 191, 36, 0.3)', backgroundColor: 'rgba(251, 191, 36, 0.05)' },
    
    title: { fontSize: 24, fontWeight: '700', letterSpacing: 2, marginBottom: layout.spacing.xl },
    winnerText: { fontSize: 40, fontWeight: '900', textAlign: 'center', marginBottom: layout.spacing.sm },
    
    statsRow: { gap: 12, marginTop: layout.spacing.md },
    badge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: layout.radius.sm, borderWidth: 1 },
    badgeText: { fontSize: 14, fontWeight: '700' },
    
    footer: { width: '100%', marginTop: layout.spacing.xl },
    kurdishFont: { fontFamily: 'Rabar', transform: [{ scale: 1.15 }] },
});
