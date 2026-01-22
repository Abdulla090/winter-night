import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { ChevronLeft, ChevronRight, Zap, Play, Users } from 'lucide-react-native';

import { GradientBackground } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../localization/translations';

// Custom Glass Input for Premium Feel
const GlassInput = ({ label, value, onChangeText, placeholder, isKurdish }) => (
    <View style={{ marginBottom: SPACING.lg }}>
        <Text style={[styles.inputLabel, isKurdish && styles.kurdishFont]}>{label}</Text>
        <BlurView intensity={20} tint="dark" style={styles.glassInputContainer}>
            <TextInput
                style={[
                    styles.glassInput,
                    isKurdish && styles.kurdishFont,
                    isKurdish ? { textAlign: 'right' } : { textAlign: 'left' }
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="rgba(255,255,255,0.4)"
            />
        </BlurView>
    </View>
);

export default function PyramidSetupScreen({ navigation }) {
    const { language, isKurdish } = useLanguage();
    const [teamA, setTeamA] = useState('');
    const [teamB, setTeamB] = useState('');

    const rowDirection = isKurdish ? 'row-reverse' : 'row';

    const canStart = teamA.trim().length > 0 && teamB.trim().length > 0;

    const startGame = () => {
        if (canStart) {
            navigation.navigate('PyramidGameBoard', {
                teams: {
                    A: { name: teamA, score: 0 },
                    B: { name: teamB, score: 0 }
                },
                currentTeam: 'A'
            });
        }
    };

    return (
        <GradientBackground>
            {/* Sticky Glass Header */}
            <BlurView intensity={80} tint="dark" style={styles.stickyHeader}>
                <SafeAreaView edges={['top']} style={{ flex: 1 }}>
                    <View style={[styles.headerContent, { flexDirection: rowDirection }]}>
                        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                            {isKurdish ? <ChevronRight color="#FFF" size={24} /> : <ChevronLeft color="#FFF" size={24} />}
                        </TouchableOpacity>
                        <Text style={[styles.headerTitle, isKurdish && styles.kurdishFont]}>
                            {t('pyramid.title', language)}
                        </Text>
                        <View style={{ width: 40 }} />
                    </View>
                </SafeAreaView>
            </BlurView>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Hero Icon */}
                <MotiView
                    from={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={styles.heroContainer}
                >
                    <View style={styles.heroCircle}>
                        <Zap size={64} color={COLORS.games.pyramid[0]} fill={COLORS.games.pyramid[0]} />
                    </View>
                    <Text style={[styles.heroDesc, isKurdish && styles.kurdishFont]}>
                        {t('pyramid.description', language)}
                    </Text>
                </MotiView>

                {/* Team Inputs (Glass) */}
                <MotiView
                    from={{ translateY: 50, opacity: 0 }}
                    animate={{ translateY: 0, opacity: 1 }}
                    delay={200}
                    style={styles.formSection}
                >
                    <View style={[styles.sectionHeader, { flexDirection: rowDirection }]}>
                        <Users size={20} color={COLORS.games.pyramid[1]} style={{ marginRight: 8 }} />
                        <Text style={[styles.sectionTitle, isKurdish && styles.kurdishFont]}>
                            {t('common.teams', language) || "TEAMS"}
                        </Text>
                    </View>

                    <GlassInput
                        label={`${t('pyramid.teamName', language)} A`}
                        placeholder={t('pyramid.enterTeamName', language)}
                        value={teamA}
                        onChangeText={setTeamA}
                        isKurdish={isKurdish}
                    />

                    <GlassInput
                        label={`${t('pyramid.teamName', language)} B`}
                        placeholder={t('pyramid.enterTeamName', language)}
                        value={teamB}
                        onChangeText={setTeamB}
                        isKurdish={isKurdish}
                    />
                </MotiView>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Floating Start Button */}
            <MotiView
                from={{ translateY: 100 }}
                animate={{ translateY: canStart ? 0 : 100 }}
                style={styles.fabContainer}
            >
                <TouchableOpacity onPress={startGame} activeOpacity={0.9}>
                    <LinearGradient
                        colors={COLORS.games.pyramid}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.startButton, { flexDirection: rowDirection }]}
                    >
                        <Text style={[styles.startText, isKurdish && styles.kurdishFont]}>
                            {t('pyramid.startGame', language)}
                        </Text>
                        <Play size={20} color="#FFF" fill="#FFF" style={isKurdish ? { marginRight: 8 } : { marginLeft: 8 }} />
                    </LinearGradient>
                </TouchableOpacity>
            </MotiView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    stickyHeader: {
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
        borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)',
        paddingBottom: SPACING.md,
    },
    headerContent: {
        flex: 1, alignItems: 'center', paddingHorizontal: SPACING.lg,
        justifyContent: 'space-between', height: 50,
    },
    headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 },
    backBtn: {
        width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
        borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)',
    },
    scrollContent: { paddingTop: 120, paddingHorizontal: SPACING.lg },

    heroContainer: { alignItems: 'center', marginBottom: SPACING.xl },
    heroCircle: {
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: 'rgba(234, 179, 8, 0.1)', // Gold tint
        alignItems: 'center', justifyContent: 'center',
        marginBottom: SPACING.lg,
        borderWidth: 1, borderColor: COLORS.games.pyramid[0],
        shadowColor: COLORS.games.pyramid[0],
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5, shadowRadius: 20,
    },
    heroDesc: {
        color: 'rgba(255,255,255,0.7)', textAlign: 'center',
        maxWidth: '80%', lineHeight: 22, fontSize: 14,
    },

    formSection: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    },
    sectionHeader: { alignItems: 'center', marginBottom: SPACING.lg },
    sectionTitle: {
        color: COLORS.games.pyramid[0], fontSize: 14, fontWeight: '700',
        textTransform: 'uppercase', letterSpacing: 1,
    },

    // Glass Input Styles
    inputLabel: {
        color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600',
        marginBottom: 8, marginLeft: 4, letterSpacing: 0.5,
    },
    glassInputContainer: {
        borderRadius: BORDER_RADIUS.lg, overflow: 'hidden',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    glassInput: {
        padding: SPACING.md, color: '#FFF', fontSize: 16,
        fontWeight: '500', minHeight: 50,
    },

    fabContainer: { position: 'absolute', bottom: 40, left: SPACING.lg, right: SPACING.lg },
    startButton: {
        height: 56, borderRadius: 30,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: COLORS.games.pyramid[0],
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4, shadowRadius: 16, elevation: 8,
    },
    startText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },
    kurdishFont: { fontFamily: 'Rabar' },
});
