import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Platform,
    Dimensions, TextInput, ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Clock, Check, X, Star, ChevronRight, Trophy } from 'lucide-react-native';
import { AnimatedScreen } from '../../components/AnimatedScreen';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { familyFeudQuestions } from '../../data/familyFeudQuestions';
import { checkAnswerWithGemini } from './gameEngine';
import { MotiView } from 'moti';

const { width } = Dimensions.get('window');
const FAST_MONEY_GOAL = 200;
const PLAYER1_TIME = 20;
const PLAYER2_TIME = 25;

const haptic = (type = 'impact') => {
    if (Platform.OS === 'web') return;
    if (type === 'error') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    else if (type === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

// ───────────────────────────────────
// FAST MONEY PHASES
// ───────────────────────────────────
const FM_PHASE = {
    CHOOSE_PLAYERS: 'CHOOSE_PLAYERS',
    PLAYER2_PLAYS: 'PLAYER2_PLAYS', // Player 2 goes first (Player 1 is "out of the room")
    PLAYER2_REVIEW: 'PLAYER2_REVIEW',
    PLAYER1_PLAYS: 'PLAYER1_PLAYS',
    FINAL_REVEAL: 'FINAL_REVEAL',
};

export default function FastMoneyScreen({ navigation, route }) {
    const { winnerTeam, team1Name, team2Name, team1Members, team2Members,
        team1Score, team2Score } = route.params;
    const { language, isKurdish } = useLanguage();
    const { isDark } = useTheme();

    const winTeamMembers = winnerTeam === 1 ? team1Members : team2Members;
    const winTeamName = winnerTeam === 1 ? team1Name : team2Name;

    // Fast money questions
    const [fmQuestions, setFmQuestions] = useState([]);
    const [phase, setPhase] = useState(FM_PHASE.CHOOSE_PLAYERS);
    const [player1, setPlayer1] = useState(null); // index
    const [player2, setPlayer2] = useState(null); // index

    // Player 2 answers (first player to go)
    const [p2Answers, setP2Answers] = useState([]); // [{ text, points }]
    const [p2CurrentQ, setP2CurrentQ] = useState(0);
    const [p2Timer, setP2Timer] = useState(PLAYER1_TIME);
    const [p2Input, setP2Input] = useState('');

    // Player 1 answers
    const [p1Answers, setP1Answers] = useState([]);
    const [p1CurrentQ, setP1CurrentQ] = useState(0);
    const [p1Timer, setP1Timer] = useState(PLAYER2_TIME);
    const [p1Input, setP1Input] = useState('');
    const [p1Duplicate, setP1Duplicate] = useState(false);

    const timerRef = useRef(null);
    const [isChecking, setIsChecking] = useState(false);
    const isCheckingRef = useRef(false);

    useEffect(() => {
        isCheckingRef.current = isChecking;
    }, [isChecking]);

    // Load fast money questions
    useEffect(() => {
        const key = language === 'ku' ? 'kuFastMoney' : 'enFastMoney';
        const sets = familyFeudQuestions[key] || familyFeudQuestions.enFastMoney;
        const randomSet = sets[Math.floor(Math.random() * sets.length)];
        setFmQuestions(randomSet);
    }, []);

    // Timer logic
    useEffect(() => {
        if (phase === FM_PHASE.PLAYER2_PLAYS || phase === FM_PHASE.PLAYER1_PLAYS) {
            timerRef.current = setInterval(() => {
                if (isCheckingRef.current) return;
                
                if (phase === FM_PHASE.PLAYER2_PLAYS) {
                    setP2Timer(prev => {
                        if (prev <= 1) {
                            clearInterval(timerRef.current);
                            finishPlayer(2);
                            return 0;
                        }
                        return prev - 1;
                    });
                } else {
                    setP1Timer(prev => {
                        if (prev <= 1) {
                            clearInterval(timerRef.current);
                            finishPlayer(1);
                            return 0;
                        }
                        return prev - 1;
                    });
                }
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [phase]);

    const finishPlayer = (playerNum) => {
        if (playerNum === 2) {
            setPhase(FM_PHASE.PLAYER2_REVIEW);
        } else {
            setPhase(FM_PHASE.FINAL_REVEAL);
        }
    };

    // Check if answer matches any survey answer
    const scoreAnswer = async (questionIndex, answerText) => {
        if (!answerText || !fmQuestions[questionIndex]) return 0;
        const q = fmQuestions[questionIndex];
        const idx = await checkAnswerWithGemini(q, answerText);
        if (idx >= 0) return q.answers[idx].points;
        return 0;
    };

    // Submit answer for player 2
    const submitP2Answer = async () => {
        if (!p2Input.trim() || isChecking) return;
        setIsChecking(true);
        haptic();
        
        const points = await scoreAnswer(p2CurrentQ, p2Input);
        const newAnswers = [...p2Answers, { text: p2Input.trim() || '---', points }];
        setP2Answers(newAnswers);
        setP2Input('');
        setIsChecking(false);

        if (p2CurrentQ + 1 >= 5 || p2CurrentQ + 1 >= fmQuestions.length) {
            clearInterval(timerRef.current);
            setPhase(FM_PHASE.PLAYER2_REVIEW);
        } else {
            setP2CurrentQ(p2CurrentQ + 1);
        }
    };

    // Submit answer for player 1
    const submitP1Answer = async () => {
        if (!p1Input.trim() || isChecking) return;
        
        // Check for duplicate with player 2
        const p2Ans = p2Answers[p1CurrentQ]?.text?.toLowerCase();
        if (p2Ans && p1Input.trim().toLowerCase() === p2Ans) {
            haptic('error');
            setP1Duplicate(true);
            setP1Input('');
            setTimeout(() => setP1Duplicate(false), 1500);
            return;
        }

        setIsChecking(true);
        haptic();
        const points = await scoreAnswer(p1CurrentQ, p1Input);
        const newAnswers = [...p1Answers, { text: p1Input.trim() || '---', points }];
        setP1Answers(newAnswers);
        setP1Input('');
        setIsChecking(false);

        if (p1CurrentQ + 1 >= 5 || p1CurrentQ + 1 >= fmQuestions.length) {
            clearInterval(timerRef.current);
            setPhase(FM_PHASE.FINAL_REVEAL);
        } else {
            setP1CurrentQ(p1CurrentQ + 1);
        }
    };

    const totalPoints = [...p2Answers, ...p1Answers].reduce((sum, a) => sum + a.points, 0);
    const isWin = totalPoints >= FAST_MONEY_GOAL;
    const kf = isKurdish ? styles.kFont : {};

    // ─── CHOOSE PLAYERS ───
    if (phase === FM_PHASE.CHOOSE_PLAYERS) {
        return (
            <AnimatedScreen noPadding noTopPadding>
                <View style={styles.container}>
                    <LinearGradient colors={['#0F172A', '#1E1B4B']} style={StyleSheet.absoluteFill} />
                    <View style={styles.centerContent}>
                        <MotiView from={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', damping: 12 }}>
                            <Text style={[styles.bigTitle, kf]}>
                                {isKurdish ? '💰 پارەی خێرا!' : '💰 FAST MONEY!'}
                            </Text>
                            <Text style={[styles.subText, kf]}>
                                {winTeamName} — {isKurdish ? '٢ یاریزان هەڵبژێرە' : 'Choose 2 Players'}
                            </Text>
                        </MotiView>

                        <View style={styles.playerGrid}>
                            {winTeamMembers.map((name, idx) => {
                                const isP1 = player1 === idx;
                                const isP2 = player2 === idx;
                                const selected = isP1 || isP2;
                                return (
                                    <TouchableOpacity key={idx}
                                        style={[styles.playerChip, selected && styles.playerChipActive,
                                        isP1 && { borderColor: '#F59E0B' }, isP2 && { borderColor: '#8B5CF6' }]}
                                        onPress={() => {
                                            haptic();
                                            if (isP1) { setPlayer1(null); return; }
                                            if (isP2) { setPlayer2(null); return; }
                                            if (player1 === null) setPlayer1(idx);
                                            else if (player2 === null) setPlayer2(idx);
                                        }}>
                                        <Text style={[styles.playerChipText, selected && { color: '#FFF' }, kf]}>{name}</Text>
                                        {isP1 && <Text style={styles.pLabel}>P1</Text>}
                                        {isP2 && <Text style={[styles.pLabel, { backgroundColor: '#8B5CF6' }]}>P2</Text>}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {player1 !== null && player2 !== null && (
                            <TouchableOpacity style={styles.startFMBtn}
                                onPress={() => { haptic(); setPhase(FM_PHASE.PLAYER2_PLAYS); }}>
                                <Text style={[styles.startFMText, kf]}>
                                    {isKurdish ? 'دەست پێ بکە!' : 'START!'}
                                </Text>
                            </TouchableOpacity>
                        )}

                        <Text style={[styles.ruleNote, kf]}>
                            {isKurdish ? 'یاریزانی ١ لە ژوور دەچێتە دەرەوە. یاریزانی ٢ یەکەم دەیکات.'
                                : 'Player 1 leaves the room. Player 2 goes first.'}
                        </Text>
                    </View>
                </View>
            </AnimatedScreen>
        );
    }

    // ─── PLAYER 2 PLAYS (goes first) ───
    if (phase === FM_PHASE.PLAYER2_PLAYS) {
        const q = fmQuestions[p2CurrentQ];
        return (
            <AnimatedScreen noPadding noTopPadding>
                <View style={styles.container}>
                    <LinearGradient colors={['#0F172A', '#1E1B4B']} style={StyleSheet.absoluteFill} />
                    <View style={styles.timerBar}>
                        <Clock size={18} color={p2Timer <= 5 ? '#EF4444' : '#F59E0B'} />
                        <Text style={[styles.timerText, p2Timer <= 5 && { color: '#EF4444' }]}>{p2Timer}s</Text>
                        <Text style={[styles.timerLabel, kf]}>
                            {winTeamMembers[player2]} — {isKurdish ? `پرسیار ${p2CurrentQ + 1}/5` : `Q${p2CurrentQ + 1}/5`}
                        </Text>
                    </View>
                    <View style={styles.fmContent}>
                        <Text style={[styles.fmQuestion, kf, isKurdish && { textAlign: 'right' }]}>{q?.question}</Text>
                        <View style={styles.fmInputRow}>
                            <TextInput style={[styles.fmInput, kf, isKurdish && { textAlign: 'right' }, isChecking && { opacity: 0.5 }]}
                                editable={!isChecking}
                                placeholder={isKurdish ? 'وەڵامەکەت...' : 'Your answer...'}
                                placeholderTextColor="#6B7280" value={p2Input}
                                onChangeText={setP2Input} autoFocus
                                onSubmitEditing={submitP2Answer} />
                            <TouchableOpacity style={styles.fmSubmitBtn} onPress={submitP2Answer}>
                                <ChevronRight size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </AnimatedScreen>
        );
    }

    // ─── PLAYER 2 REVIEW ───
    if (phase === FM_PHASE.PLAYER2_REVIEW) {
        return (
            <AnimatedScreen noPadding noTopPadding>
                <View style={styles.container}>
                    <LinearGradient colors={['#0F172A', '#1E1B4B']} style={StyleSheet.absoluteFill} />
                    <ScrollView contentContainerStyle={styles.reviewContent}>
                        <Text style={[styles.reviewTitle, kf]}>
                            {winTeamMembers[player2]} {isKurdish ? 'وەڵامەکانی' : "'s Answers"}
                        </Text>
                        {fmQuestions.slice(0, 5).map((q, idx) => (
                            <View key={idx} style={styles.reviewRow}>
                                <Text style={[styles.reviewQ, kf]} numberOfLines={1}>{q.question}</Text>
                                <View style={styles.reviewAns}>
                                    <Text style={[styles.reviewAnsText, kf]}>{p2Answers[idx]?.text || '---'}</Text>
                                    <Text style={[styles.reviewPts, p2Answers[idx]?.points > 0 && { color: '#34D399' }]}>
                                        {p2Answers[idx]?.points || 0}
                                    </Text>
                                </View>
                            </View>
                        ))}
                        <Text style={[styles.reviewSubtotal, kf]}>
                            {isKurdish ? 'کۆی خاڵ:' : 'Subtotal:'} {p2Answers.reduce((s, a) => s + a.points, 0)}
                        </Text>
                        <TouchableOpacity style={styles.startFMBtn}
                            onPress={() => { haptic(); setPhase(FM_PHASE.PLAYER1_PLAYS); }}>
                            <Text style={[styles.startFMText, kf]}>
                                {isKurdish ? `${winTeamMembers[player1]} دەگەڕێتەوە!` : `${winTeamMembers[player1]}'s Turn!`}
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </AnimatedScreen>
        );
    }

    // ─── PLAYER 1 PLAYS ───
    if (phase === FM_PHASE.PLAYER1_PLAYS) {
        const q = fmQuestions[p1CurrentQ];
        return (
            <AnimatedScreen noPadding noTopPadding>
                <View style={styles.container}>
                    <LinearGradient colors={['#0F172A', '#1E1B4B']} style={StyleSheet.absoluteFill} />
                    <View style={styles.timerBar}>
                        <Clock size={18} color={p1Timer <= 5 ? '#EF4444' : '#8B5CF6'} />
                        <Text style={[styles.timerText, p1Timer <= 5 && { color: '#EF4444' }]}>{p1Timer}s</Text>
                        <Text style={[styles.timerLabel, kf]}>
                            {winTeamMembers[player1]} — {isKurdish ? `پرسیار ${p1CurrentQ + 1}/5` : `Q${p1CurrentQ + 1}/5`}
                        </Text>
                    </View>
                    <View style={styles.fmContent}>
                        <Text style={[styles.fmQuestion, kf, isKurdish && { textAlign: 'right' }]}>{q?.question}</Text>
                        {p1Duplicate && (
                            <MotiView from={{ scale: 0.8 }} animate={{ scale: 1 }} style={styles.dupWarning}>
                                <Text style={[styles.dupText, kf]}>
                                    {isKurdish ? '🔊 ئەو وەڵامە دراوە! وەڵامی تر بدە' : '🔊 Already given! Try another answer'}
                                </Text>
                            </MotiView>
                        )}
                        <View style={styles.fmInputRow}>
                            <TextInput style={[styles.fmInput, kf, isKurdish && { textAlign: 'right' }, isChecking && { opacity: 0.5 }]}
                                editable={!isChecking}
                                placeholder={isKurdish ? 'وەڵامەکەت...' : 'Your answer...'}
                                placeholderTextColor="#6B7280" value={p1Input}
                                onChangeText={setP1Input} autoFocus
                                onSubmitEditing={submitP1Answer} />
                            <TouchableOpacity style={[styles.fmSubmitBtn, { backgroundColor: '#8B5CF6' }]}
                                onPress={submitP1Answer}>
                                <ChevronRight size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </AnimatedScreen>
        );
    }

    // ─── FINAL REVEAL ───
    return (
        <AnimatedScreen noPadding noTopPadding>
            <View style={styles.container}>
                <LinearGradient colors={isWin ? ['#064E3B', '#022C22'] : ['#0F172A', '#1E1B4B']}
                    style={StyleSheet.absoluteFill} />
                <ScrollView contentContainerStyle={styles.revealContent}>
                    <MotiView from={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', damping: 10 }}>
                        {isWin ? (
                            <View style={styles.winContainer}>
                                <Trophy size={64} color="#F59E0B" />
                                <Text style={[styles.winTitle, kf]}>
                                    {isKurdish ? '🎉 بردتانەوە!' : '🎉 YOU WON!'}
                                </Text>
                            </View>
                        ) : (
                            <Text style={[styles.loseTitle, kf]}>
                                {isKurdish ? 'نەگەیشتن بە ٢٠٠' : 'Did not reach 200'}
                            </Text>
                        )}
                    </MotiView>

                    <View style={styles.revealTotal}>
                        <Text style={[styles.totalLabel, kf]}>{isKurdish ? 'کۆی خاڵەکان' : 'TOTAL POINTS'}</Text>
                        <Text style={[styles.totalNum, isWin && { color: '#34D399' }]}>{totalPoints}</Text>
                        <Text style={[styles.goalText, kf]}>/ {FAST_MONEY_GOAL}</Text>
                    </View>

                    {/* Player 2 answers */}
                    <Text style={[styles.revealPlayerLabel, kf]}>{winTeamMembers[player2]}</Text>
                    {fmQuestions.slice(0, 5).map((q, idx) => (
                        <View key={`p2-${idx}`} style={styles.revealRow}>
                            <Text style={[styles.revealQ, kf]} numberOfLines={1}>{q.question}</Text>
                            <Text style={[styles.revealAns, kf]}>{p2Answers[idx]?.text || '---'}</Text>
                            <Text style={[styles.revealPts, p2Answers[idx]?.points > 0 && { color: '#34D399' }]}>
                                {p2Answers[idx]?.points || 0}
                            </Text>
                        </View>
                    ))}

                    {/* Player 1 answers */}
                    <Text style={[styles.revealPlayerLabel, kf, { marginTop: 20 }]}>{winTeamMembers[player1]}</Text>
                    {fmQuestions.slice(0, 5).map((q, idx) => (
                        <View key={`p1-${idx}`} style={styles.revealRow}>
                            <Text style={[styles.revealQ, kf]} numberOfLines={1}>{q.question}</Text>
                            <Text style={[styles.revealAns, kf]}>{p1Answers[idx]?.text || '---'}</Text>
                            <Text style={[styles.revealPts, p1Answers[idx]?.points > 0 && { color: '#34D399' }]}>
                                {p1Answers[idx]?.points || 0}
                            </Text>
                        </View>
                    ))}

                    <TouchableOpacity style={styles.finishBtn}
                        onPress={() => {
                            haptic();
                            navigation.replace('FamilyFeudResult', {
                                ...route.params, fastMoneyTotal: totalPoints, fastMoneyWin: isWin,
                            });
                        }}>
                        <Text style={[styles.finishText, kf]}>
                            {isKurdish ? 'بینینی ئەنجام' : 'See Final Results'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: Platform.OS === 'android' ? 10 : 0, overflow: 'hidden' },
    kFont: { fontFamily: 'Rabar' },
    centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },

    bigTitle: { color: '#F59E0B', fontSize: 38, fontWeight: '900', textAlign: 'center', marginBottom: 10, textShadowColor: 'rgba(245,158,11,0.4)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 20 },
    subText: { color: '#94A3B8', fontSize: 17, textAlign: 'center', fontWeight: '700', marginBottom: 28 },

    playerGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 28 },
    playerChip: { paddingHorizontal: 22, paddingVertical: 16, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)', flexDirection: 'row', alignItems: 'center', margin: 5 },
    playerChipActive: { backgroundColor: 'rgba(245,158,11,0.12)' },
    playerChipText: { color: '#94A3B8', fontSize: 16, fontWeight: '700' },
    pLabel: { backgroundColor: '#F59E0B', color: '#FFF', fontSize: 11, fontWeight: '900', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6, marginLeft: 8 },

    startFMBtn: { backgroundColor: '#D97706', paddingVertical: 18, paddingHorizontal: 44, borderRadius: 18, marginBottom: 18, borderWidth: 1.5, borderColor: '#F59E0B', elevation: 6, shadowColor: '#F59E0B', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12 },
    startFMText: { color: '#FFF', fontSize: 19, fontWeight: '900', letterSpacing: 0.5 },
    ruleNote: { color: '#6B7280', fontSize: 13, textAlign: 'center', fontStyle: 'italic' },

    // Timer
    timerBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1.5, borderBottomColor: 'rgba(255,255,255,0.08)' },
    timerText: { color: '#F59E0B', fontSize: 26, fontWeight: '900', marginLeft: 8, textShadowColor: 'rgba(245,158,11,0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6 },
    timerLabel: { color: '#94A3B8', fontSize: 14, fontWeight: '700', flex: 1, marginLeft: 12 },

    // FM Content
    fmContent: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
    fmQuestion: { color: '#FFF', fontSize: 22, fontWeight: '700', textAlign: 'center', lineHeight: 32, marginBottom: 20, backgroundColor: 'rgba(255,255,255,0.04)', paddingVertical: 16, paddingHorizontal: 16, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
    fmInputRow: { flexDirection: 'row', overflow: 'hidden' },
    fmInput: { flex: 1, height: 56, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 16, paddingHorizontal: 18, color: '#FFF', fontSize: 18, fontWeight: '600', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.12)', marginRight: 10 },
    fmSubmitBtn: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#D97706', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F59E0B' },

    // Duplicate warning
    dupWarning: { backgroundColor: '#DC2626', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 12, alignSelf: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#EF4444' },
    dupText: { color: '#FFF', fontSize: 14, fontWeight: '800' },

    // Review
    reviewContent: { padding: 24, paddingTop: 40 },
    reviewTitle: { color: '#F59E0B', fontSize: 26, fontWeight: '900', textAlign: 'center', marginBottom: 24, textShadowColor: 'rgba(245,158,11,0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 },
    reviewRow: { marginBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)', paddingBottom: 12, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 12, overflow: 'hidden' },
    reviewQ: { color: '#64748B', fontSize: 13, marginBottom: 6 },
    reviewAns: { flexDirection: 'row', justifyContent: 'space-between', overflow: 'hidden' },
    reviewAnsText: { color: '#FFF', fontSize: 17, fontWeight: '700', flex: 1, flexShrink: 1 },
    reviewPts: { color: '#6B7280', fontSize: 19, fontWeight: '900' },
    reviewSubtotal: { color: '#F59E0B', fontSize: 22, fontWeight: '900', textAlign: 'center', marginVertical: 24 },

    // Final Reveal
    revealContent: { padding: 24, paddingTop: 40, paddingBottom: 40, overflow: 'hidden' },
    winContainer: { alignItems: 'center', marginBottom: 20 },
    winTitle: { color: '#34D399', fontSize: 34, fontWeight: '900', textAlign: 'center', marginTop: 14, textShadowColor: 'rgba(52,211,153,0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 },
    loseTitle: { color: '#EF4444', fontSize: 26, fontWeight: '900', textAlign: 'center', marginBottom: 18 },
    revealTotal: { alignItems: 'center', marginBottom: 28, padding: 24, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
    totalLabel: { color: '#94A3B8', fontSize: 12, fontWeight: '800', letterSpacing: 2.5 },
    totalNum: { color: '#FFF', fontSize: 60, fontWeight: '900', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 10 },
    goalText: { color: '#6B7280', fontSize: 20, fontWeight: '600' },
    revealPlayerLabel: { color: '#F59E0B', fontSize: 17, fontWeight: '800', marginBottom: 12 },
    revealRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10, overflow: 'hidden' },
    revealQ: { flex: 1, color: '#64748B', fontSize: 12, flexShrink: 1 },
    revealAns: { color: '#FFF', fontSize: 14, fontWeight: '700', maxWidth: 100, marginLeft: 8, flexShrink: 1 },
    revealPts: { color: '#6B7280', fontSize: 17, fontWeight: '900', width: 34, textAlign: 'right', marginLeft: 8, flexShrink: 0 },

    finishBtn: { backgroundColor: '#D97706', paddingVertical: 18, borderRadius: 18, alignItems: 'center', marginTop: 28, borderWidth: 1.5, borderColor: '#F59E0B', elevation: 6, shadowColor: '#F59E0B', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12 },
    finishText: { color: '#FFF', fontSize: 19, fontWeight: '900', letterSpacing: 0.5 },
});
