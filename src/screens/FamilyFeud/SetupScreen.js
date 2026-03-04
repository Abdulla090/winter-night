import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    KeyboardAvoidingView, Platform, ScrollView, SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, ArrowRight, Play, Users, Crown } from 'lucide-react-native';
import { AnimatedScreen } from '../../components/AnimatedScreen';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../localization/translations';
import { MotiView } from 'moti';

const DEFAULT_MEMBERS_EN = ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5'];
const DEFAULT_MEMBERS_KU = ['یاریزان ١', 'یاریزان ٢', 'یاریزان ٣', 'یاریزان ٤', 'یاریزان ٥'];

export default function SetupScreen({ navigation }) {
    const { language, isKurdish } = useLanguage();
    const { colors, isDark } = useTheme();

    const [team1Name, setTeam1Name] = useState('');
    const [team2Name, setTeam2Name] = useState('');
    const [team1Members, setTeam1Members] = useState(['', '', '', '', '']);
    const [team2Members, setTeam2Members] = useState(['', '', '', '', '']);

    const updateMember = (team, index, value) => {
        if (team === 1) {
            const u = [...team1Members]; u[index] = value; setTeam1Members(u);
        } else {
            const u = [...team2Members]; u[index] = value; setTeam2Members(u);
        }
    };

    const handleStart = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const d1 = isKurdish ? 'تیمی سوور' : 'Red Team';
        const d2 = isKurdish ? 'تیمی شین' : 'Blue Team';
        const defs = isKurdish ? DEFAULT_MEMBERS_KU : DEFAULT_MEMBERS_EN;
        navigation.navigate('FamilyFeudPlay', {
            team1Name: team1Name.trim() || d1,
            team2Name: team2Name.trim() || d2,
            team1Members: team1Members.map((m, i) => m.trim() || defs[i]),
            team2Members: team2Members.map((m, i) => m.trim() || defs[i]),
        });
    };

    const tc = isDark ? '#F9FAFB' : '#111827';
    const sc = isDark ? '#9CA3AF' : '#6B7280';
    const ib = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';
    const ph = isDark ? '#6B7280' : '#9CA3AF';

    const renderTeamCard = (num, name, setName, members, color, grad) => (
        <MotiView from={{ opacity: 0, translateY: 16 }} animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 350, delay: num === 1 ? 150 : 300 }}>
            <View style={st.teamCard}>
                <LinearGradient colors={grad} style={st.teamHeader} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <View style={st.teamHeaderRow}>
                        <View style={st.teamBadge}><Crown size={14} color="#FFF" /></View>
                        <Text style={[st.teamLabel, isKurdish && st.kf]}>
                            {isKurdish ? (num === 1 ? 'تیمی یەکەم' : 'تیمی دووەم') : (num === 1 ? 'TEAM 1' : 'TEAM 2')}
                        </Text>
                    </View>
                </LinearGradient>
                <View style={st.teamBody}>
                    <TextInput style={[st.teamInput, { backgroundColor: ib, color: tc }, isKurdish && { textAlign: 'right', fontFamily: 'Rabar' }]}
                        placeholder={isKurdish ? 'ناوی تیم...' : 'Team name...'} placeholderTextColor={ph}
                        value={name} onChangeText={setName} maxLength={20} />
                    <Text style={[st.memLabel, { color: sc }, isKurdish && st.kf]}>{isKurdish ? 'ئەندامەکان' : 'Members'}</Text>
                    {members.map((m, i) => (
                        <View key={i} style={st.memRow}>
                            <View style={[st.memNum, { backgroundColor: color + '25' }]}>
                                <Text style={[st.memNumTxt, { color }]}>{i + 1}</Text>
                            </View>
                            <TextInput style={[st.memInput, { backgroundColor: ib, color: tc }, isKurdish && { textAlign: 'right', fontFamily: 'Rabar' }]}
                                placeholder={`${isKurdish ? 'یاریزان' : 'Player'} ${i + 1}`} placeholderTextColor={ph}
                                value={m} onChangeText={(v) => updateMember(num, i, v)} maxLength={15} />
                        </View>
                    ))}
                </View>
            </View>
        </MotiView>
    );

    return (
        <AnimatedScreen noPadding noTopPadding>
            <View style={st.root}>
                <LinearGradient colors={isDark ? ['#0F172A', '#020617'] : ['#F8FAFC', '#E2E8F0']} style={StyleSheet.absoluteFill} />
                <SafeAreaView style={{ flex: 1 }}>
                    {/* Header */}
                    <View style={st.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}
                            style={[st.backBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                            {isKurdish ? <ArrowRight size={22} color={tc} /> : <ArrowLeft size={22} color={tc} />}
                        </TouchableOpacity>
                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <Text style={[st.headerTitle, { color: tc }, isKurdish && st.kf]}>{t('familyFeud.title', language)}</Text>
                            <Text style={[st.headerSub, { color: sc }, isKurdish && st.kf]}>{isKurdish ? 'تیمەکان دابنێ' : 'Set Up Your Teams'}</Text>
                        </View>
                        <View style={{ width: 40 }} />
                    </View>

                    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                        <ScrollView contentContainerStyle={st.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                            {/* Rules */}
                            <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing', duration: 250 }}>
                                <LinearGradient colors={['#F59E0B', '#D97706']} style={st.rules} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                                    <Users size={20} color="#FFF" style={{ marginRight: 10 }} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={[st.ruleTitle, isKurdish && st.kf]}>
                                            {isKurdish ? '٤ قۆناغ • نمرەی دووبرابەر و سێبرابەر' : '4 Rounds • Double & Triple Points'}
                                        </Text>
                                        <Text style={[st.ruleSub, isKurdish && st.kf]}>
                                            {isKurdish ? 'فەیس-ئۆف، دزی خاڵ، و پارەی خێرا!' : 'Face-Off, Steal, & Fast Money!'}
                                        </Text>
                                    </View>
                                </LinearGradient>
                            </MotiView>

                            {renderTeamCard(1, team1Name, setTeam1Name, team1Members, '#EF4444', ['#DC2626', '#991B1B'])}

                            {/* VS */}
                            <View style={st.vs}>
                                <View style={[st.vsLine, { backgroundColor: isDark ? '#334155' : '#D1D5DB' }]} />
                                <View style={st.vsCircle}><Text style={st.vsTxt}>VS</Text></View>
                                <View style={[st.vsLine, { backgroundColor: isDark ? '#334155' : '#D1D5DB' }]} />
                            </View>

                            {renderTeamCard(2, team2Name, setTeam2Name, team2Members, '#3B82F6', ['#2563EB', '#1D4ED8'])}

                            {/* Start Button inside scroll */}
                            <TouchableOpacity onPress={handleStart} activeOpacity={0.8} style={st.startWrap}>
                                <LinearGradient colors={['#F59E0B', '#D97706']} style={st.startGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                                    <Play size={20} color="#FFF" fill="#FFF" style={{ marginRight: 8 }} />
                                    <Text style={[st.startTxt, isKurdish && st.kf]}>{t('familyFeud.startGame', language)}</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <View style={{ height: 30 }} />
                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </View>
        </AnimatedScreen>
    );
}

const st = StyleSheet.create({
    root: { flex: 1 },
    kf: { fontFamily: 'Rabar' },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10 },
    backBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 20, fontWeight: '900', letterSpacing: 0.5 },
    headerSub: { fontSize: 12, fontWeight: '600', marginTop: 2, letterSpacing: 0.3 },

    // Scroll
    scroll: { paddingHorizontal: 14, paddingTop: 6 },

    // Rules
    rules: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
    ruleTitle: { color: '#FFF', fontSize: 14, fontWeight: '800' },
    ruleSub: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '600', marginTop: 2 },

    // Team Card
    teamCard: { borderRadius: 16, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)' },
    teamHeader: { paddingVertical: 12, paddingHorizontal: 16 },
    teamHeaderRow: { flexDirection: 'row', alignItems: 'center' },
    teamBadge: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 10, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)' },
    teamLabel: { color: '#FFF', fontSize: 14, fontWeight: '900', letterSpacing: 0.8, textTransform: 'uppercase' },
    teamBody: { padding: 14 },
    teamInput: { height: 46, borderRadius: 12, paddingHorizontal: 14, fontSize: 15, fontWeight: '600', marginBottom: 12, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)' },
    memLabel: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
    memRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 7 },
    memNum: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    memNumTxt: { fontSize: 12, fontWeight: '900' },
    memInput: { flex: 1, height: 42, borderRadius: 10, paddingHorizontal: 12, fontSize: 14, fontWeight: '500', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.08)' },

    // VS
    vs: { flexDirection: 'row', alignItems: 'center', marginVertical: 14 },
    vsLine: { flex: 1, height: 1.5 },
    vsCircle: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#D97706', alignItems: 'center', justifyContent: 'center', marginHorizontal: 14, borderWidth: 2, borderColor: '#F59E0B' },
    vsTxt: { color: '#FFF', fontSize: 14, fontWeight: '900' },

    // Start Button
    startWrap: { marginTop: 20, height: 54, borderRadius: 27, overflow: 'hidden', elevation: 8, shadowColor: '#F59E0B', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16 },
    startGrad: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    startTxt: { color: '#FFF', fontSize: 17, fontWeight: '900', letterSpacing: 0.5 },
});
