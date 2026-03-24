import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Platform, Alert, TouchableOpacity, TextInput } from 'react-native';
import { Check, ChevronRight, EyeOff } from 'lucide-react-native';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';

import { AnimatedScreen, BeastButton, GlassCard } from '../../components';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../localization/translations';
import { layout } from '../../theme/layout';

export default function TwoTruthsInputScreen({ route, navigation }) {
    const { players, currentTurn } = route.params;
    const { language, isKurdish } = useLanguage();
    const { colors, isRTL } = useTheme();
    const rowDirection = isRTL ? 'row-reverse' : 'row';

    const currentPlayer = players[currentTurn];
    const [statements, setStatements] = useState(['', '', '']);
    const [lieIndex, setLieIndex] = useState(null);
    const isReady = statements.every(s => s.trim().length > 0) && lieIndex !== null;

    const updateStatement = (text, index) => {
        const newArr = [...statements];
        newArr[index] = text;
        setStatements(newArr);
    };

    const handleNext = () => {
        if (!isReady) {
            Alert.alert(
                isKurdish ? 'هەڵە' : 'Error', 
                isKurdish ? 'تکایە هەر سێ ڕستەکە بنووسە و دیاری بکە کامیان درۆیە!' : 'Please fill all 3 statements and select the lie!'
            );
            return;
        }
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        
        const gameData = {
            statements: statements.map((s, i) => ({ text: s.trim(), isLie: i === lieIndex, id: i })),
            currentPlayer
        };
        navigation.replace('TwoTruthsVote', { players, currentTurn, gameData });
    };

    return (
        <AnimatedScreen>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Header */}
                <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} style={styles.header}>
                    <View style={[styles.heroIcon, { backgroundColor: '#EF444420' }]}>
                        <EyeOff size={40} color="#EF4444" strokeWidth={1.5} />
                    </View>
                    <Text style={[styles.title, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                        {t('common.keepItSecret', language)}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                        {currentPlayer.name}{isKurdish ? '، ٢ ڕاستی و ١ درۆ بنووسە!' : ", write 2 truths and 1 lie!"}
                    </Text>
                </MotiView>

                {/* Input Fields */}
                <Text style={[styles.sectionTitle, { color: colors.text.muted, textAlign: isRTL ? 'right' : 'left' }, isKurdish && styles.kurdishFont]}>
                    {t('twotruths.writeLie', language)}
                </Text>

                {[0, 1, 2].map((idx) => {
                    const isSelectedLie = lieIndex === idx;
                    return (
                        <GlassCard key={idx} style={[styles.inputCard, isSelectedLie && { borderColor: '#EF4444', borderWidth: 2 }]}>
                            <TextInput
                                style={[styles.input, { color: colors.text.primary }, isKurdish && { textAlign: 'right', fontFamily: 'Rabar' }]}
                                value={statements[idx]}
                                onChangeText={(t) => updateStatement(t, idx)}
                                placeholder={isKurdish ? `ڕستەی ${idx + 1}...` : `Statement ${idx + 1}...`}
                                placeholderTextColor={colors.text.muted}
                                multiline
                            />
                            <TouchableOpacity 
                                style={[styles.lieToggle, { flexDirection: rowDirection }, isSelectedLie && styles.lieToggleActive]}
                                onPress={() => {
                                    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    setLieIndex(idx);
                                }}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.radioOuter, isSelectedLie && styles.radioOuterActive]}>
                                    {isSelectedLie && <View style={styles.radioInner} />}
                                </View>
                                <Text style={[styles.lieToggleText, { color: isSelectedLie ? '#EF4444' : colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                                    {isKurdish ? 'درۆکە ئەمەیە' : 'This is the Lie'}
                                </Text>
                            </TouchableOpacity>
                        </GlassCard>
                    );
                })}
            </ScrollView>

            {/* Fab Button */}
            <MotiView animate={{ translateY: isReady ? 0 : 100, opacity: isReady ? 1 : 0 }} style={styles.fabContainer}>
                <BeastButton
                    title={isKurdish ? 'ئەنجامدان' : 'DONE'}
                    onPress={handleNext}
                    variant="primary"
                    size="lg"
                    icon={ChevronRight}
                    iconPosition={isRTL ? "left" : "right"}
                    style={{ width: '100%' }}
                />
            </MotiView>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    header: { alignItems: 'center', marginBottom: layout.spacing.xl, marginTop: layout.spacing.md },
    heroIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    title: { fontSize: 24, fontWeight: '900', textAlign: 'center', marginBottom: 8 },
    subtitle: { fontSize: 16, textAlign: 'center' },
    sectionTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: layout.spacing.md },
    inputCard: { marginBottom: layout.spacing.md, padding: layout.spacing.md },
    input: { fontSize: 16, minHeight: 60, textAlignVertical: 'top', marginBottom: 12 },
    lieToggle: { alignItems: 'center', alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 12, borderRadius: layout.radius.sm, backgroundColor: 'rgba(0,0,0,0.2)' },
    lieToggleActive: { backgroundColor: '#EF444420' },
    radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#64748B', justifyContent: 'center', alignItems: 'center', marginHorizontal: 8 },
    radioOuterActive: { borderColor: '#EF4444' },
    radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#EF4444' },
    lieToggleText: { fontSize: 14, fontWeight: '600' },
    fabContainer: { position: 'absolute', bottom: 30, left: 20, right: 20 },
    kurdishFont: { fontFamily: 'Rabar', transform: [{ scale: 1.15 }] },
});
