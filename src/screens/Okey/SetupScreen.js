import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { AnimatedScreen, BackButton, Button } from '../../components';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import PlayerInput from '../../components/PlayerInput';

export default function OkeySetupScreen({ navigation }) {
    const [players, setPlayers] = useState([]);
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
            isBot: index >= players.length
        }));

        navigation.navigate('OkeyPlay', { players: mappedPlayers });
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
                        {isKurdish ? 'ئۆکەیی' : 'Okey'}
                    </Text>
                    <Text style={[st.subtitleText, isKurdish && st.kurdishFont]}>
                        {isKurdish ? 'کێشە نەبێت، لەگەڵ بۆتەکان یاری دەکەیت' : 'Play against bots or friends'}
                    </Text>

                    <View style={[st.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <PlayerInput
                            players={players}
                            setPlayers={setPlayers}
                            minPlayers={1}
                            maxPlayers={4}
                            isKurdish={isKurdish}
                        />

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
    subtitleText: { fontSize: 16, color: '#64748B', textAlign: 'center', marginBottom: 32 },
    kurdishFont: { fontFamily: 'Rabar' },
    card: { padding: 24, borderRadius: 24, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 8 },
    startBtn: { marginTop: 24, borderRadius: 16 },
});
