import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { AnimatedScreen, BackButton, Button } from '../../components';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import PlayerInput from '../../components/PlayerInput';
import { Users, Shield, Zap } from 'lucide-react-native';

export default function OkeySetupScreen({ navigation }) {
    const [players, setPlayers] = useState([]);
    const [gameMode, setGameMode] = useState('standard'); // 'standard' (81) or 'hard' (101)
    const { isKurdish } = useLanguage();
    const { colors, isDark } = useTheme();

    const startGame = () => {
        if (players.length === 0) return;
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Pad with bots if < 4 players
        const gamePlayers = [...players];
        while (gamePlayers.length < 4) {
            gamePlayers.push(isKurdish ? `بۆت ${gamePlayers.length}` : `Bot ${gamePlayers.length}`);
        }

        const mappedPlayers = gamePlayers.slice(0, 4).map((p, index) => ({
            id: index.toString(),
            name: p,
            isBot: index >= players.length,
            // Team assignments: 0↔2 are Team A, 1↔3 are Team B
            team: index % 2 === 0 ? 'A' : 'B',
        }));

        navigation.navigate('OkeyPlay', {
            players: mappedPlayers,
            gameMode,
        });
    };

    const ModeOption = ({ mode, icon, title, subtitle, threshold }) => {
        const active = gameMode === mode;
        return (
            <TouchableOpacity
                style={[
                    st.modeCard,
                    {
                        backgroundColor: active
                            ? (isDark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.1)')
                            : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
                        borderColor: active ? '#10B981' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'),
                    },
                ]}
                onPress={() => {
                    setGameMode(mode);
                    if (Platform.OS !== 'web') Haptics.selectionAsync();
                }}
                activeOpacity={0.7}
            >
                <View style={st.modeIconWrap}>
                    {icon}
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[st.modeTitle, { color: active ? '#10B981' : colors.text }, isKurdish && st.kurdishFont]}>
                        {title}
                    </Text>
                    <Text style={[st.modeSubtitle, { color: colors.textSecondary }, isKurdish && st.kurdishFont]}>
                        {subtitle}
                    </Text>
                </View>
                <View style={[st.modeBadge, { backgroundColor: active ? '#10B981' : 'rgba(100,116,139,0.3)' }]}>
                    <Text style={[st.modeBadgeText, isKurdish && st.kurdishFont]}>{threshold}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <AnimatedScreen>
            <LinearGradient
                colors={isDark ? ['#040B16', '#0F172A'] : ['#F8FAFC', '#E2E8F0']}
                style={StyleSheet.absoluteFillObject}
            />
            <SafeAreaView style={st.container}>
                <View style={st.header}>
                    <BackButton onPress={() => navigation.goBack()} />
                </View>

                <View style={st.content}>
                    <Text style={[st.titleText, isKurdish && st.kurdishFont]}>
                        {isKurdish ? 'ئۆکەیی کوردی' : 'Kurdish Okey'}
                    </Text>
                    <Text style={[st.subtitleText, isKurdish && st.kurdishFont]}>
                        {isKurdish ? 'یاری تیم بە تیم — ئەوەی بەرامبەرتە هاوتیمتە' : 'Team-based — player across is your teammate'}
                    </Text>

                    {/* Team Preview */}
                    <View style={[st.teamPreview, { borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }]}>
                        <View style={st.teamRow}>
                            <Users size={14} color="#10B981" />
                            <Text style={[st.teamHint, { color: colors.textSecondary }, isKurdish && st.kurdishFont]}>
                                {isKurdish ? 'تیم A: یاریزانی ١ و ٣ | تیم B: یاریزانی ٢ و ٤' : 'Team A: P1 & P3 | Team B: P2 & P4'}
                            </Text>
                        </View>
                    </View>

                    <View style={[st.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <PlayerInput
                            players={players}
                            setPlayers={setPlayers}
                            minPlayers={1}
                            maxPlayers={4}
                            isKurdish={isKurdish}
                        />

                        {/* Game Mode Selection (Kurdish: دیاریکردنی یاساکان) */}
                        <View style={st.modeSection}>
                            <Text style={[st.modeSectionTitle, { color: colors.text }, isKurdish && st.kurdishFont]}>
                                {isKurdish ? 'یاساکانی دابەزین' : 'Lay Down Rules'}
                            </Text>
                            <ModeOption
                                mode="standard"
                                icon={<Shield size={18} color={gameMode === 'standard' ? '#10B981' : '#64748B'} />}
                                title={isKurdish ? 'یاسای ئاسایی' : 'Standard (81)'}
                                subtitle={isKurdish ? 'دابەزین: ٨١+ | هاوتیم: ٦١+' : 'Lay down: 81+ | Teammate: 61+'}
                                threshold="81"
                            />
                            <ModeOption
                                mode="hard"
                                icon={<Zap size={18} color={gameMode === 'hard' ? '#10B981' : '#64748B'} />}
                                title={isKurdish ? 'یاسای سەخت' : 'Hard Mode (101)'}
                                subtitle={isKurdish ? 'دابەزین: ١٠١+ | هاوتیم: ٨١+' : 'Lay down: 101+ | Teammate: 81+'}
                                threshold="101"
                            />
                        </View>

                        <Button
                            title={isKurdish ? 'دەستپێکردنی یاری' : 'START GAME'}
                            onPress={startGame}
                            disabled={players.length === 0}
                            style={st.startBtn}
                            colors={['#10B981', '#059669']}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </AnimatedScreen>
    );
}

const st = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: 16 },
    content: { flex: 1, padding: 24, justifyContent: 'center' },
    titleText: { fontSize: 36, fontWeight: '900', color: '#10B981', textAlign: 'center', marginBottom: 8 },
    subtitleText: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 16 },
    kurdishFont: { fontFamily: 'Rabar' },

    teamPreview: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    teamRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    teamHint: {
        fontSize: 12,
        fontWeight: '600',
    },

    card: {
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 8,
    },

    modeSection: {
        marginTop: 20,
        gap: 8,
    },
    modeSectionTitle: {
        fontSize: 15,
        fontWeight: '800',
        marginBottom: 4,
    },
    modeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 14,
        borderWidth: 1.5,
        gap: 12,
    },
    modeIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(16,185,129,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modeTitle: {
        fontSize: 14,
        fontWeight: '800',
    },
    modeSubtitle: {
        fontSize: 11,
        fontWeight: '500',
        marginTop: 2,
    },
    modeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    modeBadgeText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '900',
    },

    startBtn: { marginTop: 24, borderRadius: 16 },
});
