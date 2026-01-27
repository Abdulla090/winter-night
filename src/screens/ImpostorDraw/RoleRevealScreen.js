import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Eye,
    EyeOff,
    ChevronRight,
    Check,
} from 'lucide-react-native';

import { AnimatedScreen } from '../../components/AnimatedScreen';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

// Simple instant reveal - NO hold, NO animation
const RoleCard = ({ player, isImpostor, word, onConfirm, isKurdish, colors, isDark }) => {
    const [revealed, setRevealed] = useState(false);

    return (
        <View style={styles.cardWrap}>
            {!revealed ? (
                // Hidden state - just tap to reveal
                <View style={[styles.hiddenCard, { backgroundColor: isDark ? '#1A1A2E' : '#F0F0F0' }]}>
                    <View style={[styles.playerBadge, { backgroundColor: player.color }]}>
                        <Text style={styles.playerBadgeText}>{player.name}</Text>
                    </View>

                    <EyeOff size={48} color={colors.text.muted} style={{ marginVertical: 24 }} />

                    <TouchableOpacity
                        style={styles.tapBtn}
                        onPress={() => setRevealed(true)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.tapBtnText}>
                            {isKurdish ? 'تاپ بکە بۆ بینین' : 'Tap to see your role'}
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                // Revealed state - instant, no animation
                <View style={[styles.revealedCard, { backgroundColor: isImpostor ? '#DC2626' : '#059669' }]}>
                    <View style={[styles.playerBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                        <Text style={styles.playerBadgeText}>{player.name}</Text>
                    </View>

                    {isImpostor ? (
                        <>
                            <EyeOff size={48} color="#FFF" style={{ marginVertical: 20 }} />
                            <Text style={styles.roleTitle}>{isKurdish ? 'دزەکار' : 'IMPOSTOR'}</Text>
                            <Text style={styles.roleDesc}>
                                {isKurdish ? 'نازانیت چی بکێشیت' : "You don't know what to draw"}
                            </Text>
                        </>
                    ) : (
                        <>
                            <Eye size={48} color="#FFF" style={{ marginVertical: 20 }} />
                            <Text style={styles.wordLabel}>{isKurdish ? 'بکێشە:' : 'Draw:'}</Text>
                            <Text style={styles.theWord}>{word}</Text>
                        </>
                    )}

                    <TouchableOpacity style={styles.gotItBtn} onPress={onConfirm} activeOpacity={0.8}>
                        <Check size={18} color="#FFF" />
                        <Text style={styles.gotItText}>{isKurdish ? 'تێگەیشتم' : 'Got it'}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

// Player dots at top
const PlayerDots = ({ players, completedPlayers, currentIndex }) => (
    <View style={styles.dotsRow}>
        {players.map((p, i) => (
            <View
                key={i}
                style={[
                    styles.dot,
                    { backgroundColor: p.color },
                    completedPlayers.includes(i) && styles.dotDone,
                    i === currentIndex && !completedPlayers.includes(i) && styles.dotCurrent,
                ]}
            />
        ))}
    </View>
);

export default function ImpostorDrawRoleReveal({ navigation, route }) {
    const { isKurdish } = useLanguage();
    const { colors, isDark } = useTheme();

    const { players, words, drawTime, discussTime, voteTime, rounds } = route.params;

    const [currentIdx, setCurrentIdx] = useState(0);
    const [impostorIdx] = useState(Math.floor(Math.random() * players.length));
    const [word] = useState(words[Math.floor(Math.random() * words.length)]);
    const [completed, setCompleted] = useState([]);

    const allDone = completed.length === players.length;

    const handleConfirm = () => {
        setCompleted([...completed, currentIdx]);
        if (currentIdx < players.length - 1) {
            setCurrentIdx(currentIdx + 1);
        }
    };

    // Go to play when all done
    useEffect(() => {
        if (allDone) {
            const t = setTimeout(() => {
                navigation.replace('ImpostorDrawPlay', {
                    players,
                    impostorIndex: impostorIdx,
                    word,
                    drawTime,
                    discussTime,
                    voteTime,
                    rounds,
                    currentRound: 1,
                    scores: players.map(() => 0),
                });
            }, 500);
            return () => clearTimeout(t);
        }
    }, [allDone]);

    return (
        <AnimatedScreen>
            <View style={[styles.container, { backgroundColor: isDark ? '#0D0221' : colors.background }]}>
                <Text style={[styles.title, { color: colors.text.primary }]}>
                    {isKurdish ? 'ڕۆڵەکەت ببینە' : 'See Your Role'}
                </Text>

                <PlayerDots players={players} completedPlayers={completed} currentIndex={currentIdx} />

                <View style={styles.cardArea}>
                    {!allDone ? (
                        <RoleCard
                            key={currentIdx}
                            player={players[currentIdx]}
                            isImpostor={currentIdx === impostorIdx}
                            word={word}
                            onConfirm={handleConfirm}
                            isKurdish={isKurdish}
                            colors={colors}
                            isDark={isDark}
                        />
                    ) : (
                        <View style={[styles.allDoneBox, { backgroundColor: isDark ? '#1A1A2E' : '#F0F0F0' }]}>
                            <Check size={48} color="#10B981" />
                            <Text style={[styles.allDoneText, { color: colors.text.primary }]}>
                                {isKurdish ? 'هەمووان ئامادەن!' : 'All Ready!'}
                            </Text>
                        </View>
                    )}
                </View>

                {!allDone && completed.includes(currentIdx) && currentIdx < players.length - 1 && (
                    <View style={styles.passReminder}>
                        <ChevronRight size={20} color="#F59E0B" />
                        <Text style={styles.passText}>
                            {isKurdish ? `بیدە بە ${players[currentIdx + 1].name}` : `Pass to ${players[currentIdx + 1].name}`}
                        </Text>
                    </View>
                )}
            </View>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 16 },

    dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 24 },
    dot: { width: 12, height: 12, borderRadius: 6, opacity: 0.4 },
    dotDone: { opacity: 1 },
    dotCurrent: { opacity: 1, transform: [{ scale: 1.3 }] },

    cardArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    cardWrap: { width: width - 48 },
    hiddenCard: { padding: 32, borderRadius: 20, alignItems: 'center' },
    revealedCard: { padding: 32, borderRadius: 20, alignItems: 'center' },

    playerBadge: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 16 },
    playerBadgeText: { color: '#FFF', fontSize: 15, fontWeight: '700' },

    tapBtn: { backgroundColor: 'rgba(0,0,0,0.1)', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 },
    tapBtnText: { color: '#666', fontSize: 14, fontWeight: '600' },

    roleTitle: { color: '#FFF', fontSize: 28, fontWeight: '900', marginBottom: 8 },
    roleDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 24 },
    wordLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
    theWord: { color: '#FFF', fontSize: 36, fontWeight: '900', marginBottom: 24 },

    gotItBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 },
    gotItText: { color: '#FFF', fontSize: 15, fontWeight: '700' },

    allDoneBox: { padding: 40, borderRadius: 20, alignItems: 'center' },
    allDoneText: { fontSize: 22, fontWeight: '800', marginTop: 16 },

    passReminder: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16 },
    passText: { color: '#F59E0B', fontSize: 15, fontWeight: '600' },
});
