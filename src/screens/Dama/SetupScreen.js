import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Play, Grid3X3, Users, Info } from 'lucide-react-native';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';

import { AnimatedScreen, BeastButton, GlassCard, BackButton } from '../../components';
import { PremiumInput } from '../../components/PremiumInput';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { layout } from '../../theme/layout';

export default function DamaSetupScreen({ navigation }) {
    const [player1Name, setPlayer1Name] = useState('');
    const [player2Name, setPlayer2Name] = useState('');
    const { language, isKurdish } = useLanguage();
    const { colors, isRTL } = useTheme();
    const rowDirection = isRTL ? 'row-reverse' : 'row';

    const handleStart = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        navigation.navigate('DamaPlay', {
            player1Name: player1Name.trim() || (isKurdish ? 'یاریزانی ١' : 'Player 1'),
            player2Name: player2Name.trim() || (isKurdish ? 'یاریزانی ٢' : 'Player 2'),
        });
    };

    return (
        <AnimatedScreen>
            {/* Header */}
            <View style={[styles.header, { flexDirection: rowDirection }]}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={[styles.headerTitle, { color: colors.text.primary }, isKurdish && styles.kf]}>
                    {isKurdish ? 'دامە' : 'Dama'}
                </Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Hero Icon */}
                <MotiView from={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    style={{ alignItems: 'center', marginBottom: layout.spacing.lg }}>
                    <View style={[styles.heroIcon, { backgroundColor: colors.accent + '20' }]}>
                        <Grid3X3 size={48} color={colors.accent} strokeWidth={1.5} />
                    </View>
                    <Text style={[styles.heroSub, { color: colors.text.muted }, isKurdish && styles.kf]}>
                        {isKurdish ? 'یاری تەختەیی کوردی' : 'Kurdish Board Game'}
                    </Text>
                </MotiView>

                {/* Game Info */}
                <GlassCard style={{ marginBottom: layout.spacing.lg }}>
                    <View style={[styles.infoRow, { flexDirection: rowDirection }]}>
                        <View style={styles.infoItem}>
                            <Users size={16} color={colors.accent} />
                            <Text style={[styles.infoText, { color: colors.text.secondary }]}>2</Text>
                            <Text style={[styles.infoLabel, { color: colors.text.muted }, isKurdish && styles.kf]}>
                                {isKurdish ? 'یاریزان' : 'Players'}
                            </Text>
                        </View>
                        <View style={[styles.infoDivider, { backgroundColor: colors.border }]} />
                        <View style={styles.infoItem}>
                            <Grid3X3 size={16} color={colors.accent} />
                            <Text style={[styles.infoText, { color: colors.text.secondary }]}>8×8</Text>
                            <Text style={[styles.infoLabel, { color: colors.text.muted }, isKurdish && styles.kf]}>
                                {isKurdish ? 'تەختە' : 'Board'}
                            </Text>
                        </View>
                        <View style={[styles.infoDivider, { backgroundColor: colors.border }]} />
                        <View style={styles.infoItem}>
                            <Text style={[styles.infoText, { color: colors.text.secondary }]}>16</Text>
                            <Text style={[styles.infoLabel, { color: colors.text.muted }, isKurdish && styles.kf]}>
                                {isKurdish ? 'پاسە' : 'Pieces'}
                            </Text>
                        </View>
                    </View>
                </GlassCard>

                {/* Player 1 */}
                <GlassCard style={{ marginBottom: layout.spacing.md }}>
                    <View style={[styles.sectionHeader, { flexDirection: rowDirection }]}>
                        <View style={[styles.playerDot, { backgroundColor: '#F5F0E8', borderColor: '#C4B59A' }]} />
                        <Text style={[styles.sectionTitle, { color: colors.text.secondary }, isKurdish && styles.kf]}>
                            {isKurdish ? 'یاریزانی یەکەم (سپی)' : 'Player 1 (White)'}
                        </Text>
                    </View>
                    <PremiumInput
                        value={player1Name}
                        onChangeText={setPlayer1Name}
                        placeholder={isKurdish ? 'ناوی یاریزان...' : 'Player name...'}
                        maxLength={20}
                    />
                </GlassCard>

                {/* Player 2 */}
                <GlassCard style={{ marginBottom: layout.spacing.lg }}>
                    <View style={[styles.sectionHeader, { flexDirection: rowDirection }]}>
                        <View style={[styles.playerDot, { backgroundColor: '#2C2C2C', borderColor: '#555' }]} />
                        <Text style={[styles.sectionTitle, { color: colors.text.secondary }, isKurdish && styles.kf]}>
                            {isKurdish ? 'یاریزانی دووەم (ڕەش)' : 'Player 2 (Black)'}
                        </Text>
                    </View>
                    <PremiumInput
                        value={player2Name}
                        onChangeText={setPlayer2Name}
                        placeholder={isKurdish ? 'ناوی یاریزان...' : 'Player name...'}
                        maxLength={20}
                    />
                </GlassCard>

                {/* Rules */}
                <GlassCard>
                    <View style={[styles.sectionHeader, { flexDirection: rowDirection }]}>
                        <Info size={16} color={colors.accent} style={{ marginHorizontal: 6 }} />
                        <Text style={[styles.sectionTitle, { color: colors.text.secondary }, isKurdish && styles.kf]}>
                            {isKurdish ? 'یاسا' : 'Rules'}
                        </Text>
                    </View>
                    {[
                        isKurdish ? '• پاسە ئاسایی تەنها بەرەو پێشەوە و لاوە دەچێ' : '• Regular pieces move forward & sideways only',
                        isKurdish ? '• پاشا بە هەموو ٤ ئاڕاستەدا دەچێ' : '• Kings move in all 4 directions',
                        isKurdish ? '• گرتن واجبە، بەڵام هەڵبژاردنی ڕێگا ئازادە' : '• Capture is mandatory, but path choice is free',
                        isKurdish ? '• گەیشتن بە کۆتایی = بوون بە پاشا' : '• Reaching the end = becoming a King',
                    ].map((rule, i) => (
                        <Text key={i} style={[styles.ruleText, { color: colors.text.muted }, isKurdish && styles.kf]}>{rule}</Text>
                    ))}
                </GlassCard>
            </ScrollView>

            {/* Start Button */}
            <MotiView animate={{ translateY: 0, opacity: 1 }} style={styles.fabContainer}>
                <BeastButton
                    title={isKurdish ? 'دەست پێبکە' : 'Start Game'}
                    onPress={handleStart}
                    variant="primary"
                    size="lg"
                    icon={Play}
                    style={{ width: '100%' }}
                />
            </MotiView>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    header: { alignItems: 'center', justifyContent: 'space-between', marginBottom: layout.spacing.md },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    heroIcon: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
    heroSub: { fontSize: 12, fontWeight: '600', marginTop: 8, textTransform: 'uppercase', letterSpacing: 1 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
    infoItem: { alignItems: 'center', gap: 4 },
    infoText: { fontSize: 20, fontWeight: '800' },
    infoLabel: { fontSize: 11, fontWeight: '600' },
    infoDivider: { width: 1, height: 36 },
    sectionHeader: { alignItems: 'center', marginBottom: 12, gap: 8 },
    sectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
    playerDot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2 },
    ruleText: { fontSize: 13, fontWeight: '500', lineHeight: 22, marginBottom: 2 },
    fabContainer: { position: 'absolute', bottom: 30, left: 20, right: 20 },
    kf: { fontFamily: 'Rabar' },
});
