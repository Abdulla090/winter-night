import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground, GlassCard, Button, PlayerInput } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../localization/translations';
import { forbiddenWordCategories } from '../../constants/forbiddenWordData';

export default function ForbiddenWordSetupScreen({ navigation }) {
    const { language, isKurdish } = useLanguage();
    const rowDirection = isKurdish ? 'row-reverse' : 'row';

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

        // Use team names or defaults
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
        <GradientBackground>
            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                {/* Header */}
                <View style={[styles.header, { flexDirection: rowDirection }]}>
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons
                            name={isKurdish ? "arrow-forward" : "arrow-back"}
                            size={24}
                            color={COLORS.text.primary}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? '🚫 وشەی قەدەغە' : '🚫 Forbidden Word'}
                    </Text>
                    <View style={{ width: 44 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    {/* Instructions */}
                    <GlassCard intensity={30} style={styles.instructionCard}>
                        <Text style={[styles.instructionTitle, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'چۆن دەیاریت؟' : 'How to Play'}
                        </Text>
                        <Text style={[styles.instructionText, isKurdish && styles.kurdishFont]}>
                            {isKurdish
                                ? '• وشەیەک بۆ تیمەکەت باس بکە\n• نابێت وشە قەدەغەکان بەکاربهێنیت!\n• تیمەکەت دەبێت بیزانێت'
                                : '• Describe a word to your team\n• You CANNOT use the forbidden words!\n• Your team must guess correctly'
                            }
                        </Text>
                    </GlassCard>

                    {/* Team Names */}
                    <Text style={[styles.sectionTitle, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'تیمەکان' : 'Teams'}
                    </Text>

                    <View style={styles.teamsContainer}>
                        {teams.map((team, index) => (
                            <View key={index} style={[styles.teamRow, { flexDirection: rowDirection }]}>
                                <View style={[styles.teamBadge, { backgroundColor: index === 0 ? '#3b82f6' : index === 1 ? '#ef4444' : index === 2 ? '#10b981' : '#f59e0b' }]}>
                                    <Text style={styles.teamBadgeText}>{index + 1}</Text>
                                </View>
                                <TextInput
                                    style={[styles.teamInput, isKurdish && styles.kurdishFont]}
                                    value={team}
                                    onChangeText={(val) => updateTeam(index, val)}
                                    placeholder={isKurdish ? `تیمی ${index + 1}` : `Team ${index + 1}`}
                                    placeholderTextColor={COLORS.text.muted}
                                />
                                {teams.length > 2 && (
                                    <TouchableOpacity onPress={() => removeTeam(index)}>
                                        <Ionicons name="close-circle" size={24} color={COLORS.accent.danger} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                        {teams.length < 4 && (
                            <TouchableOpacity style={styles.addTeamBtn} onPress={addTeam}>
                                <Ionicons name="add-circle-outline" size={24} color={COLORS.accent.primary} />
                                <Text style={[styles.addTeamText, isKurdish && styles.kurdishFont]}>
                                    {isKurdish ? 'تیمی تر زیاد بکە' : 'Add Team'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Difficulty Selection */}
                    <Text style={[styles.sectionTitle, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'ئاستی قورسی' : 'Difficulty'}
                    </Text>

                    <View style={styles.difficultyGrid}>
                        {forbiddenWordCategories.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                activeOpacity={0.8}
                                onPress={() => setSelectedDifficulty(cat)}
                            >
                                <GlassCard
                                    intensity={25}
                                    style={[
                                        styles.difficultyCard,
                                        selectedDifficulty?.id === cat.id && {
                                            borderColor: cat.color,
                                            borderWidth: 2,
                                            backgroundColor: cat.color + '20'
                                        }
                                    ]}
                                >
                                    <Text style={styles.difficultyIcon}>{cat.icon}</Text>
                                    <Text style={[styles.difficultyTitle, isKurdish && styles.kurdishFont]}>
                                        {cat.title[language]}
                                    </Text>
                                </GlassCard>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Round Time */}
                    <Text style={[styles.sectionTitle, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'کاتی دەور' : 'Round Time'}
                    </Text>

                    <View style={[styles.timeRow, { flexDirection: rowDirection }]}>
                        {[30, 45, 60, 90].map((time) => (
                            <TouchableOpacity
                                key={time}
                                onPress={() => setRoundTime(time)}
                                style={[
                                    styles.timeBtn,
                                    roundTime === time && styles.timeBtnSelected
                                ]}
                            >
                                <Text style={[
                                    styles.timeBtnText,
                                    roundTime === time && styles.timeBtnTextSelected
                                ]}>{time}s</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Start Button */}
                    <View style={{ marginTop: SPACING.xl }}>
                        <Button
                            title={isKurdish ? 'دەست پێ بکە' : 'Start Game'}
                            onPress={handleStart}
                            disabled={!canStart}
                            gradient={canStart ? [COLORS.accent.danger, '#dc2626'] : ['#666', '#555']}
                            icon={<Ionicons name="play" size={20} color="#FFF" />}
                            isKurdish={isKurdish}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.md,
    },
    backBtn: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: COLORS.background.card,
        alignItems: 'center', justifyContent: 'center',
    },
    headerTitle: {
        color: COLORS.text.primary,
        ...FONTS.title,
        fontSize: 20,
    },
    content: {
        padding: SPACING.lg,
        paddingBottom: 100,
    },
    instructionCard: {
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        borderRadius: BORDER_RADIUS.xl,
    },
    instructionTitle: {
        color: COLORS.text.primary,
        ...FONTS.medium,
        fontSize: 16,
        marginBottom: SPACING.sm,
    },
    instructionText: {
        color: COLORS.text.muted,
        lineHeight: 24,
    },
    sectionTitle: {
        color: COLORS.text.secondary,
        ...FONTS.medium,
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: SPACING.md,
        marginTop: SPACING.md,
    },

    // Teams
    teamsContainer: {
        gap: SPACING.sm,
    },
    teamRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    teamBadge: {
        width: 32, height: 32, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center',
    },
    teamBadgeText: {
        color: '#FFF',
        ...FONTS.bold,
    },
    teamInput: {
        flex: 1,
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        color: COLORS.text.primary,
        ...FONTS.medium,
    },
    addTeamBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        padding: SPACING.md,
    },
    addTeamText: {
        color: COLORS.accent.primary,
        ...FONTS.medium,
    },

    // Difficulty
    difficultyGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    difficultyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        borderColor: 'transparent',
        gap: SPACING.sm,
    },
    difficultyIcon: {
        fontSize: 24,
    },
    difficultyTitle: {
        color: COLORS.text.primary,
        ...FONTS.medium,
    },

    // Time
    timeRow: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    timeBtn: {
        flex: 1,
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    timeBtnSelected: {
        borderColor: COLORS.accent.primary,
        backgroundColor: COLORS.accent.primary + '20',
    },
    timeBtnText: {
        color: COLORS.text.muted,
        ...FONTS.medium,
    },
    timeBtnTextSelected: {
        color: COLORS.accent.primary,
    },

    kurdishFont: { fontFamily: 'Rabar' },
});
