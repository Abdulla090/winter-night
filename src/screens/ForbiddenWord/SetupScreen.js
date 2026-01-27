import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { ArrowRight, ArrowLeft, Play, PlusCircle, XCircle, Clock, Users, Flame } from 'lucide-react-native';
import { AnimatedScreen, BeastButton, GlassCard, BackButton } from '../../components';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../localization/translations';
import { layout } from '../../theme/layout';
import { forbiddenWordCategories } from '../../constants/forbiddenWordData';
import { MotiView } from 'moti';

export default function ForbiddenWordSetupScreen({ navigation }) {
    const { colors, isRTL, isDark } = useTheme();
    const { language, isKurdish } = useLanguage();

    const [teams, setTeams] = useState(['', '']);
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const [roundTime, setRoundTime] = useState(60);

    const addTeam = () => {
        if (teams.length < 4) {
            setTeams([...teams, '']);
        }
    };

    const removeTeam = (index) => {
        if (teams.length > 2) {
            setTeams(teams.filter((_, i) => i !== index));
        }
    };

    const updateTeam = (index, value) => {
        const newTeams = [...teams];
        newTeams[index] = value;
        setTeams(newTeams);
    };

    const handleStart = () => {
        if (!selectedDifficulty) return;

        const finalTeams = teams.map((t, i) =>
            t.trim() || (isKurdish ? `تیمی ${i + 1}` : `Team ${i + 1}`)
        );

        navigation.navigate('ForbiddenWordPlay', {
            teams: finalTeams,
            difficulty: selectedDifficulty,
            roundTime: roundTime,
        });
    };

    const canStart = selectedDifficulty !== null && teams.length >= 2;

    return (
        <AnimatedScreen>
            <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={[styles.headerTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                    {t('forbiddenWord.title', language)}
                </Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Instructions */}
                <GlassCard style={{ marginBottom: layout.spacing.xl }}>
                    <Text style={[styles.sectionTitle, { color: colors.accent, marginBottom: 8 }, isKurdish && styles.kurdishFont]}>
                        {t('common.howToPlay', language)}
                    </Text>
                    <Text style={[styles.instructionText, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                        {t('forbiddenWord.description', language)}
                    </Text>
                </GlassCard>

                {/* Team Names */}
                <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <Users size={16} color={colors.text.muted} style={{ marginRight: isRTL ? 0 : 8, marginLeft: isRTL ? 8 : 0 }} />
                    <Text style={[styles.sectionHeaderText, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'تیمەکان' : 'TEAMS'}
                    </Text>
                </View>

                <View style={{ gap: layout.spacing.md, marginBottom: layout.spacing.xl }}>
                    {teams.map((team, index) => (
                        <MotiView
                            key={index}
                            from={{ opacity: 0, translateY: 15 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ type: 'timing', duration: 200 }}
                            style={[styles.teamRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                        >
                            <View style={[styles.teamBadge, { backgroundColor: index === 0 ? '#3b82f6' : index === 1 ? '#ef4444' : index === 2 ? '#10b981' : '#f59e0b' }]}>
                                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{index + 1}</Text>
                            </View>
                            <TextInput
                                style={[
                                    styles.teamInput,
                                    {
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                        color: colors.text.primary,
                                        textAlign: isRTL ? 'right' : 'left'
                                    },
                                    isKurdish && styles.kurdishFont
                                ]}
                                value={team}
                                onChangeText={(val) => updateTeam(index, val)}
                                placeholder={isKurdish ? `تیمی ${index + 1}` : `Team ${index + 1}`}
                                placeholderTextColor={colors.text.muted}
                            />
                            {teams.length > 2 && (
                                <TouchableOpacity onPress={() => removeTeam(index)}>
                                    <XCircle size={24} color={colors.text.muted} />
                                </TouchableOpacity>
                            )}
                        </MotiView>
                    ))}
                    {teams.length < 4 && (
                        <BeastButton
                            variant="ghost"
                            title={isKurdish ? 'تیمی تر زیاد بکە' : 'Add Team'}
                            icon={PlusCircle}
                            onPress={addTeam}
                            size="sm"
                        />
                    )}
                </View>

                {/* Difficulty */}
                <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <Flame size={16} color={colors.text.muted} style={{ marginRight: isRTL ? 0 : 8, marginLeft: isRTL ? 8 : 0 }} />
                    <Text style={[styles.sectionHeaderText, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                        {t('common.difficulty', language)}
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: layout.spacing.xl, justifyContent: isRTL ? 'flex-end' : 'flex-start' }}>
                    {forbiddenWordCategories.map((cat) => {
                        const isSelected = selectedDifficulty?.id === cat.id;
                        return (
                            <TouchableOpacity
                                key={cat.id}
                                onPress={() => setSelectedDifficulty(cat)}
                                activeOpacity={0.8}
                                style={{ width: '48%' }}
                            >
                                <GlassCard
                                    style={[
                                        styles.difficultyCard,
                                        isSelected && { borderColor: cat.color, borderWidth: 2, backgroundColor: cat.color + '20' }
                                    ]}
                                    intensity={isSelected ? 40 : 20}
                                >
                                    <Text style={{ fontSize: 24, marginBottom: 4 }}>{cat.icon}</Text>
                                    <Text style={[styles.difficultyTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                                        {cat.title[language]}
                                    </Text>
                                </GlassCard>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Round Time */}
                <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <Clock size={16} color={colors.text.muted} style={{ marginRight: isRTL ? 0 : 8, marginLeft: isRTL ? 8 : 0 }} />
                    <Text style={[styles.sectionHeaderText, { color: colors.text.muted }, isKurdish && styles.kurdishFont]}>
                        {t('common.roundTime', language)}
                    </Text>
                </View>

                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 10, marginBottom: layout.spacing.xl }}>
                    {[30, 45, 60, 90].map((time) => (
                        <TouchableOpacity
                            key={time}
                            onPress={() => setRoundTime(time)}
                            style={{ flex: 1 }}
                        >
                            <GlassCard
                                style={{ alignItems: 'center', paddingVertical: 12, backgroundColor: roundTime === time ? colors.accent + '20' : undefined, borderColor: roundTime === time ? colors.accent : undefined, borderWidth: roundTime === time ? 1 : 0 }}
                            >
                                <Text style={{ color: roundTime === time ? colors.accent : colors.text.muted, fontWeight: 'bold' }}>
                                    {time}s
                                </Text>
                            </GlassCard>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Start Button */}
                <BeastButton
                    variant={canStart ? 'primary' : 'ghost'}
                    title={isKurdish ? 'دەست پێ بکە' : 'Start Game'}
                    onPress={handleStart}
                    disabled={!canStart}
                    size="lg"
                    style={{ marginTop: layout.spacing.lg }}
                    icon={Play}
                />
            </ScrollView>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: layout.spacing.lg,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    instructionText: {
        fontSize: 15,
        lineHeight: 22,
    },
    sectionHeader: {
        alignItems: 'center',
        marginBottom: layout.spacing.sm,
    },
    sectionHeaderText: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    teamRow: {
        alignItems: 'center',
        gap: 12,
    },
    teamBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    teamInput: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
    },
    difficultyCard: {
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
    },
    difficultyTitle: {
        fontWeight: '600',
        fontSize: 14,
        textAlign: 'center',
    },
    kurdishFont: {
        fontFamily: 'Rabar_022',
    }
});
