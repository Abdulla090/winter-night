import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Platform,
    Dimensions, ScrollView, TextInput, KeyboardAvoidingView, SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { X, Send, Trophy } from 'lucide-react-native';
import { AnimatedScreen } from '../../components/AnimatedScreen';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { familyFeudQuestions } from '../../data/familyFeudQuestions';
import { MotiView } from 'moti';
import {
    PHASE, TOTAL_ROUNDS, createInitialState, getCurrentQuestion,
    getMultiplier, getMultiplierLabel, awardBankToTeam, advanceRound,
    getFaceOffPlayers, getCurrentPlayer, nextMember, findAnswerOnBoard, checkAnswerWithGemini,
    pickUniqueQuestions
} from './gameEngine';
import VoiceInputButton from './VoiceInputButton';

const haptic = (type = 'impact') => {
    if (Platform.OS === 'web') return;
    if (type === 'error') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    else if (type === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

// ─── ANSWER TILE ───
const AnswerTile = ({ answer, index, isRevealed, isKurdish }) => (
    <View style={st.answerTile}>
        {isRevealed ? (
            <LinearGradient colors={['#059669', '#047857']} style={st.answerInner}>
                <Text style={[st.answerText, isKurdish && st.kf]} numberOfLines={1} adjustsFontSizeToFit>{answer.text}</Text>
                <View style={st.ptsBadge}><Text style={st.ptsBadgeText}>{answer.points}</Text></View>
            </LinearGradient>
        ) : (
            <LinearGradient colors={['#1E40AF', '#1E3A8A']} style={st.answerInner}>
                <Text style={st.answerNum}>{index + 1}</Text>
            </LinearGradient>
        )}
    </View>
);

// ─── STRIKES ───
const Strikes = ({ count }) => (
    <View style={st.strikesRow}>
        {[1, 2, 3].map(n => (
            <View key={n} style={[st.strikeCircle, count >= n && st.strikeOn]}>
                <X size={20} color={count >= n ? '#EF4444' : '#334155'} strokeWidth={count >= n ? 4 : 2} />
            </View>
        ))}
    </View>
);

// ─── BIG X OVERLAY ───
const BigX = ({ show }) => show ? (
    <View style={[StyleSheet.absoluteFill, st.overlay]} pointerEvents="none">
        <MotiView from={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1.2, opacity: 1 }}
            transition={{ type: 'spring', damping: 8 }}>
            <X size={140} color="#EF4444" strokeWidth={6} />
        </MotiView>
    </View>
) : null;

// ─── CORRECT OVERLAY ───
const Correct = ({ show, text }) => show ? (
    <View style={[StyleSheet.absoluteFill, st.correctOv]} pointerEvents="none">
        <MotiView from={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 10 }}>
            <Text style={{ fontSize: 60, textAlign: 'center' }}>✅</Text>
            <Text style={st.correctTxt}>{text}</Text>
        </MotiView>
    </View>
) : null;

// ─── PLAYER TURN BANNER ───
const TurnBanner = ({ name, team, colors: c, isKurdish }) => (
    <MotiView from={{ opacity: 0, translateY: -8 }} animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 250 }} key={name}>
        <LinearGradient colors={c} style={st.turnBanner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <View style={st.turnAvatar}><Text style={st.turnAvatarTxt}>{name?.[0]?.toUpperCase()}</Text></View>
            <View style={{ flex: 1 }}>
                <Text style={[st.turnName, isKurdish && st.kf]} numberOfLines={1}>{name}</Text>
                <Text style={[st.turnTeam, isKurdish && st.kf]}>{team}</Text>
            </View>
            <Text style={{ fontSize: 20 }}>🎤</Text>
        </LinearGradient>
    </MotiView>
);

// ─── SCOREBOARD ───
const Score = ({ state, isKurdish, mult }) => (
    <View style={st.scoreRow}>
        <LinearGradient colors={['#DC2626', '#991B1B']}
            style={[st.scoreBox, state.controllingTeam === 1 && st.scoreActive]}>
            <Text style={[st.scoreTeamName, isKurdish && st.kf]} numberOfLines={1}>{state.team1.name}</Text>
            <Text style={st.scoreVal}>{state.team1.score}</Text>
        </LinearGradient>
        <View style={st.scoreCenter}>
            <Text style={st.scoreRound}>R{state.round}/{TOTAL_ROUNDS}</Text>
            <Text style={st.scoreBank}>{state.bank}</Text>
            {mult > 1 && <View style={[st.multBadge, mult === 3 && { backgroundColor: '#7C3AED' }]}>
                <Text style={st.multTxt}>×{mult}</Text>
            </View>}
        </View>
        <LinearGradient colors={['#2563EB', '#1D4ED8']}
            style={[st.scoreBox, state.controllingTeam === 2 && st.scoreActive]}>
            <Text style={[st.scoreTeamName, isKurdish && st.kf]} numberOfLines={1}>{state.team2.name}</Text>
            <Text style={st.scoreVal}>{state.team2.score}</Text>
        </LinearGradient>
    </View>
);

// ════════════════════════════
// MAIN SCREEN
// ════════════════════════════
export default function PlayScreen({ navigation, route }) {
    const { team1Name, team2Name, team1Members, team2Members } = route.params;
    const { language, isKurdish } = useLanguage();
    const { isDark } = useTheme();

    const [gs, setGs] = useState(null);
    const [showX, setShowX] = useState(false);
    const [showOk, setShowOk] = useState(false);
    const [okText, setOkText] = useState('');
    const [input, setInput] = useState('');
    const [cdCount, setCdCount] = useState(5);
    const [cdActive, setCdActive] = useState(true);
    const [isChecking, setIsChecking] = useState(false);
    const [stealInput, setStealInput] = useState('');
    const xRef = useRef(null);
    const cdRef = useRef(null);

    useEffect(() => {
        const pool = familyFeudQuestions[language] || familyFeudQuestions.en;
        const q = pickUniqueQuestions(pool);
        const init = createInitialState(team1Name, team2Name, team1Members, team2Members, q);
        init.revealedAnswers = new Array(q[0]?.answers.length || 0).fill(false);
        setGs(init);
        runCountdown();
    }, []);

    const runCountdown = () => {
        setCdCount(5); setCdActive(true);
        if (cdRef.current) clearInterval(cdRef.current);
        cdRef.current = setInterval(() => {
            setCdCount(p => {
                if (p <= 1) { clearInterval(cdRef.current); setCdActive(false); return 0; }
                return p - 1;
            });
        }, 1000);
    };

    useEffect(() => () => { clearInterval(cdRef.current); clearTimeout(xRef.current); }, []);

    if (!gs) return null;
    const q = getCurrentQuestion(gs);
    const mult = getMultiplier(gs.round);
    if (!q) return null;

    const flashX = () => {
        setShowX(true);
        if (xRef.current) clearTimeout(xRef.current);
        xRef.current = setTimeout(() => setShowX(false), 1100);
    };

    // ─── SUBMIT ANSWER (Gemini AI + local match) ───
    const submitAnswer = async () => {
        if (!input.trim() || isChecking) return;
        setIsChecking(true);
        const idx = await checkAnswerWithGemini(q, input, gs.revealedAnswers);
        setIsChecking(false);

        if (idx >= 0 && !gs.revealedAnswers[idx]) {
            // Correct, unrevealed answer
            haptic('success');
            setOkText(q.answers[idx].text); setShowOk(true);
            setTimeout(() => setShowOk(false), 1000);
            if (gs.phase === PHASE.FACE_OFF) doFaceOffReveal(idx);
            else if (gs.phase === PHASE.MAIN_ROUND) doReveal(idx);
        } else if (idx >= 0 && gs.revealedAnswers[idx]) {
            // Already revealed — just flash, no strike
            haptic('error');
            setOkText(isKurdish ? 'ئەم وەڵامە پێشتر گوتراوە!' : 'Already guessed!');
            setShowOk(true);
            setTimeout(() => setShowOk(false), 800);
        } else {
            // Truly wrong answer — count as strike
            haptic('error');
            if (gs.phase === PHASE.MAIN_ROUND) doStrike();
            else if (gs.phase === PHASE.FACE_OFF) doFaceOffWrong();
        }
        setInput('');
    };

    // ─── FACE-OFF ───
    const doBuzz = (team) => { haptic('success'); setGs(s => ({ ...s, faceOffBuzzTeam: team })); };

    const doFaceOffReveal = (ai) => {
        const pts = q.answers[ai].points;
        const is1 = q.answers.every((a, i) => i === ai || a.points <= pts);
        setGs(s => {
            const rv = [...s.revealedAnswers]; rv[ai] = true;
            const bk = s.bank + pts;
            if (!s.faceOffAnswer1) {
                if (is1) return { ...s, faceOffAnswer1: { answerIndex: ai, points: pts }, faceOffWinner: s.faceOffBuzzTeam, revealedAnswers: rv, bank: bk, phase: PHASE.PASS_OR_PLAY };
                return { ...s, faceOffAnswer1: { answerIndex: ai, points: pts }, revealedAnswers: rv, bank: bk };
            }
            const w = pts > s.faceOffAnswer1.points ? (s.faceOffBuzzTeam === 1 ? 2 : 1) : s.faceOffBuzzTeam;
            return { ...s, faceOffAnswer2: { answerIndex: ai, points: pts }, faceOffWinner: w, revealedAnswers: rv, bank: bk, phase: PHASE.PASS_OR_PLAY };
        });
    };

    const doFaceOffWrong = () => {
        flashX();
        setGs(s => {
            if (!s.faceOffAnswer1) return { ...s, faceOffAnswer1: { answerIndex: -1, points: 0 } };
            return { ...s, faceOffAnswer2: { answerIndex: -1, points: 0 }, faceOffWinner: s.faceOffBuzzTeam, phase: PHASE.PASS_OR_PLAY };
        });
    };

    // ─── PASS/PLAY ───
    const doPassPlay = (c) => {
        haptic();
        setGs(s => ({ ...s, phase: PHASE.MAIN_ROUND, controllingTeam: c === 'play' ? s.faceOffWinner : (s.faceOffWinner === 1 ? 2 : 1), currentMemberIndex: 0, strikes: 0 }));
    };

    // ─── MAIN ROUND ───
    const doReveal = (ai) => {
        setGs(s => {
            const rv = [...s.revealedAnswers]; rv[ai] = true;
            const bk = s.bank + q.answers[ai].points;
            if (rv.every(Boolean)) {
                const u = awardBankToTeam({ ...s, revealedAnswers: rv, bank: bk }, s.controllingTeam);
                return { ...u, bank: 0, phase: PHASE.ROUND_END, revealedAnswers: rv };
            }
            return { ...s, revealedAnswers: rv, bank: bk, ...nextMember(s) };
        });
    };

    const doStrike = () => {
        flashX();
        setGs(s => {
            const ns = s.strikes + 1;
            if (ns >= 3) return { ...s, strikes: ns, phase: PHASE.STEAL };
            return { ...s, strikes: ns, ...nextMember(s) };
        });
    };

    // ─── STEAL ───
    const doSteal = async () => {
        if (!stealInput.trim() || isChecking) return;
        setIsChecking(true);
        const idx = await checkAnswerWithGemini(q, stealInput, gs.revealedAnswers);
        setIsChecking(false);
        setStealInput('');

        const isCorrect = idx >= 0 && !gs.revealedAnswers[idx];

        if (isCorrect) {
            haptic('success');
            setOkText(q.answers[idx].text); setShowOk(true);
            setTimeout(() => setShowOk(false), 1200);
        } else {
            haptic('error');
            flashX();
        }

        // Short delay so player sees the result
        setTimeout(() => {
            setGs(s => {
                const stealTeam = s.controllingTeam === 1 ? 2 : 1;
                const winner = isCorrect ? stealTeam : s.controllingTeam;
                const a = awardBankToTeam(s, winner);
                const allRevealed = new Array(s.revealedAnswers.length).fill(true);
                return { ...a, bank: 0, phase: PHASE.ROUND_END, revealedAnswers: allRevealed };
            });
        }, isCorrect ? 1200 : 1100);
    };

    // ─── NEXT ROUND ───
    const doNext = () => {
        haptic();
        setGs(s => {
            const adv = advanceRound(s);
            if (adv.phase === PHASE.GAME_OVER) { goResult(adv); return adv; }
            if (adv.phase === PHASE.FACE_OFF) runCountdown();
            const nq = adv.questions[adv.currentQuestionIndex];
            return { ...adv, revealedAnswers: new Array(nq?.answers.length || 0).fill(false) };
        });
    };

    const goResult = (s) => {
        navigation.replace('FamilyFeudResult', {
            team1Name: s.team1.name, team2Name: s.team2.name,
            team1Score: s.team1.score, team2Score: s.team2.score,
            team1Members: s.team1.members, team2Members: s.team2.members,
            winnerTeam: s.team1.score > s.team2.score ? 1 : 2,
        });
    };

    const doSudden = (t) => {
        haptic('success');
        setGs(s => {
            const u = t === 1 ? { ...s, team1: { ...s.team1, score: s.team1.score + 100 } } : { ...s, team2: { ...s.team2, score: s.team2.score + 100 } };
            goResult(u); return { ...u, phase: PHASE.GAME_OVER };
        });
    };

    const fo = getFaceOffPlayers(gs);
    const stealName = gs.controllingTeam === 1 ? gs.team2.name : gs.team1.name;
    const ctrlName = gs.controllingTeam === 1 ? gs.team1.name : gs.team2.name;
    const ctrlClr = gs.controllingTeam === 1 ? ['#DC2626', '#991B1B'] : ['#2563EB', '#1D4ED8'];

    // ════════ RENDER ════════
    return (
        <AnimatedScreen noPadding noTopPadding>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={st.root}>
                    <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFill} />
                    <SafeAreaView style={{ flex: 1 }}>

                        {/* COUNTDOWN */}
                        {gs.phase === PHASE.FACE_OFF && cdActive ? (
                            <View style={st.cdWrap}>
                                <MotiView key={cdCount} from={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: 'spring', damping: 12 }}>
                                    <Text style={st.cdNum}>{cdCount}</Text>
                                </MotiView>
                                <Text style={[st.cdLabel, isKurdish && st.kf]}>
                                    {isKurdish ? `قۆناغی ${gs.round}` : `Round ${gs.round}`}
                                </Text>
                                <Text style={[st.cdSub, isKurdish && st.kf]}>
                                    {getMultiplierLabel(gs.round, isKurdish)}
                                </Text>
                            </View>
                        ) : (
                            <>
                                <Score state={gs} isKurdish={isKurdish} mult={mult} />

                                {/* FACE-OFF */}
                                {gs.phase === PHASE.FACE_OFF && (
                                    <ScrollView contentContainerStyle={st.pad} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                                        <Text style={[st.phTitle, isKurdish && st.kf]}>🔔 {isKurdish ? 'فەیس-ئۆف' : 'FACE-OFF'}</Text>
                                        {/* First-time instruction note */}
                                        {gs.round === 1 && !gs.faceOffBuzzTeam && (
                                            <View style={st.infoNote}>
                                                <Text style={st.infoEmoji}>💡</Text>
                                                <Text style={[st.infoText, isKurdish && st.kf]}>
                                                    {isKurdish
                                                        ? 'یەکێک لە هەر تیم لە پۆدیۆم دێت. یەکەم کەس لێ دەدات و وەڵام دەداتەوە — ئەگەر وەڵامی #١ بووایت، تیمەکەت کۆنترۆڵ دەبات! ئەگەر نا، یاریزانی دووەم هەڵدەستێت.'
                                                        : 'One player from each team steps up. First to buzz in answers — if you guess the #1 answer, your team wins control! If not, the other player gets a chance to beat it.'}
                                                </Text>
                                            </View>
                                        )}
                                        <Text style={[st.qText, isKurdish && { fontFamily: 'Rabar', textAlign: 'right' }]}>{q.question}</Text>
                                        {!gs.faceOffBuzzTeam ? (
                                            <>
                                                <Text style={[st.hint, isKurdish && st.kf]}>{isKurdish ? 'کێ یەکەم لێ دەدات؟' : 'Who buzzes in first?'}</Text>
                                                <View style={st.buzzRow}>
                                                    <TouchableOpacity style={[st.buzzBtn, { backgroundColor: '#DC2626' }]} onPress={() => doBuzz(1)}>
                                                        <Text style={[st.buzzName, isKurdish && st.kf]} numberOfLines={1}>{fo.player1}</Text>
                                                        <Text style={st.buzzSub}>{gs.team1.name}</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={[st.buzzBtn, { backgroundColor: '#2563EB' }]} onPress={() => doBuzz(2)}>
                                                        <Text style={[st.buzzName, isKurdish && st.kf]} numberOfLines={1}>{fo.player2}</Text>
                                                        <Text style={st.buzzSub}>{gs.team2.name}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </>
                                        ) : (
                                            <>
                                                <TurnBanner
                                                    name={!gs.faceOffAnswer1 ? (gs.faceOffBuzzTeam === 1 ? fo.player1 : fo.player2) : (gs.faceOffBuzzTeam === 1 ? fo.player2 : fo.player1)}
                                                    team={!gs.faceOffAnswer1 ? (gs.faceOffBuzzTeam === 1 ? gs.team1.name : gs.team2.name) : (gs.faceOffBuzzTeam === 1 ? gs.team2.name : gs.team1.name)}
                                                    colors={!gs.faceOffAnswer1 ? (gs.faceOffBuzzTeam === 1 ? ['#DC2626', '#991B1B'] : ['#2563EB', '#1D4ED8']) : (gs.faceOffBuzzTeam === 1 ? ['#2563EB', '#1D4ED8'] : ['#DC2626', '#991B1B'])}
                                                    isKurdish={isKurdish}
                                                />
                                                <View style={st.board}>
                                                    {q.answers.map((a, i) => <AnswerTile key={i} answer={a} index={i} isRevealed={gs.revealedAnswers[i]} isKurdish={isKurdish} />)}
                                                </View>
                                                <View style={st.inputRow}>
                                                    <VoiceInputButton isKurdish={isKurdish} onTranscribed={setInput} />
                                                    <TextInput style={[st.inputBox, isKurdish && { textAlign: 'right', fontFamily: 'Rabar' }]}
                                                        value={input} onChangeText={setInput} onSubmitEditing={submitAnswer}
                                                        placeholder={isKurdish ? 'وەڵامەکەت بنووسە...' : 'Type your answer...'} placeholderTextColor="#6B7280" returnKeyType="send" />
                                                    <TouchableOpacity style={st.sendBtn} onPress={submitAnswer}><Send size={20} color="#FFF" /></TouchableOpacity>
                                                </View>
                                            </>
                                        )}
                                    </ScrollView>
                                )}

                                {/* PASS OR PLAY */}
                                {gs.phase === PHASE.PASS_OR_PLAY && (
                                    <View style={st.center}>
                                        <Text style={[st.phTitle, isKurdish && st.kf]}>🎯 {isKurdish ? 'یاری یان پاس؟' : 'PLAY or PASS?'}</Text>
                                        <Text style={[st.hint, isKurdish && st.kf]}>
                                            {(gs.faceOffWinner === 1 ? gs.team1.name : gs.team2.name) + (isKurdish ? ' بردیەوە!' : ' won!')}
                                        </Text>
                                        <View style={st.popRow}>
                                            <TouchableOpacity style={[st.popBtn, { backgroundColor: '#059669' }]} onPress={() => doPassPlay('play')}>
                                                <Text style={{ fontSize: 28 }}>▶️</Text>
                                                <Text style={[st.popLabel, isKurdish && st.kf]}>{isKurdish ? 'یاری بکە' : 'PLAY'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[st.popBtn, { backgroundColor: '#DC2626' }]} onPress={() => doPassPlay('pass')}>
                                                <Text style={{ fontSize: 28 }}>➡️</Text>
                                                <Text style={[st.popLabel, isKurdish && st.kf]}>{isKurdish ? 'پاس بکە' : 'PASS'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}

                                {/* MAIN ROUND */}
                                {gs.phase === PHASE.MAIN_ROUND && (
                                    <ScrollView contentContainerStyle={st.pad} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                                        <TurnBanner name={getCurrentPlayer(gs)} team={ctrlName} colors={ctrlClr} isKurdish={isKurdish} />
                                        <Text style={[st.qText, isKurdish && { fontFamily: 'Rabar', textAlign: 'right' }]}>{q.question}</Text>
                                        <View style={st.board}>
                                            {q.answers.map((a, i) => <AnswerTile key={i} answer={a} index={i} isRevealed={gs.revealedAnswers[i]} isKurdish={isKurdish} />)}
                                        </View>
                                        <Strikes count={gs.strikes} />
                                        <View style={st.inputRow}>
                                            <VoiceInputButton isKurdish={isKurdish} onTranscribed={setInput} />
                                            <TextInput style={[st.inputBox, isKurdish && { textAlign: 'right', fontFamily: 'Rabar' }]}
                                                value={input} onChangeText={setInput} onSubmitEditing={submitAnswer}
                                                placeholder={isKurdish ? 'وەڵامەکەت بنووسە...' : 'Type your answer...'} placeholderTextColor="#6B7280" returnKeyType="send" />
                                            <TouchableOpacity style={st.sendBtn} onPress={submitAnswer}><Send size={20} color="#FFF" /></TouchableOpacity>
                                        </View>
                                    </ScrollView>
                                )}

                                {/* STEAL — other team gets ONE chance to answer */}
                                {gs.phase === PHASE.STEAL && (
                                    <ScrollView contentContainerStyle={st.pad} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                                        <Text style={[st.phTitle, { color: '#F59E0B' }, isKurdish && st.kf]}>🏴‍☠️ {isKurdish ? 'دزینی خاڵ!' : 'STEAL!'}</Text>
                                        <Text style={[st.hint, isKurdish && st.kf]}>
                                            {stealName} — {isKurdish ? 'یەک هەل بۆ دزینی' : 'one chance to steal'} {gs.bank} {isKurdish ? 'خاڵ' : 'pts'}
                                        </Text>
                                        <Strikes count={3} />
                                        <Text style={[st.qText, isKurdish && { fontFamily: 'Rabar', textAlign: 'right' }]}>{q.question}</Text>
                                        <View style={st.board}>
                                            {q.answers.map((a, i) => <AnswerTile key={i} answer={a} index={i} isRevealed={gs.revealedAnswers[i]} isKurdish={isKurdish} />)}
                                        </View>
                                        <View style={st.inputRow}>
                                            <VoiceInputButton isKurdish={isKurdish} onTranscribed={setStealInput} />
                                            <TextInput style={[st.inputBox, isKurdish && { textAlign: 'right', fontFamily: 'Rabar' }, isChecking && { opacity: 0.5 }]}
                                                editable={!isChecking}
                                                placeholder={isKurdish ? 'وەڵامەکەت بنووسە...' : 'Type your steal answer...'}
                                                placeholderTextColor="#6B7280" value={stealInput}
                                                onChangeText={setStealInput}
                                                onSubmitEditing={doSteal} autoFocus />
                                            <TouchableOpacity style={[st.sendBtn, { backgroundColor: '#F59E0B' }]} onPress={doSteal} disabled={isChecking}>
                                                <Send size={20} color="#FFF" />
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={[st.stealNote, isKurdish && st.kf]}>
                                            {isKurdish ? 'ئەگەر ڕاستە خاڵەکان بۆ ئێوەن، ئەگەر هەڵەیە خاڵەکان بۆ ' + ctrlName + ' دەمێنن' : 'Correct = steal points. Wrong = ' + ctrlName + ' keeps them.'}
                                        </Text>
                                    </ScrollView>
                                )}

                                {/* ROUND END — show ALL answers as proof */}
                                {gs.phase === PHASE.ROUND_END && (
                                    <ScrollView contentContainerStyle={st.pad} showsVerticalScrollIndicator={false}>
                                        <MotiView from={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 12 }}>
                                            <Text style={[st.endTitle, isKurdish && st.kf]}>
                                                {isKurdish ? `قۆناغی ${gs.round} تەواو بوو!` : `Round ${gs.round} Complete!`}
                                            </Text>
                                        </MotiView>

                                        {/* Show the question */}
                                        <Text style={[st.qText, isKurdish && { fontFamily: 'Rabar', textAlign: 'right' }]}>{q.question}</Text>

                                        {/* Reveal ALL answers on the board as proof */}
                                        <Text style={[st.revealLabel, isKurdish && st.kf]}>
                                            {isKurdish ? '📋 هەموو وەڵامەکان:' : '📋 All Answers:'}
                                        </Text>
                                        <View style={st.board}>
                                            {q.answers.map((a, i) => <AnswerTile key={i} answer={a} index={i} isRevealed={true} isKurdish={isKurdish} />)}
                                        </View>

                                        <View style={st.endScores}>
                                            <View style={st.endTeam}>
                                                <View style={[st.endDot, { backgroundColor: '#DC2626' }]} />
                                                <Text style={[st.endName, isKurdish && st.kf]}>{gs.team1.name}</Text>
                                                <Text style={st.endVal}>{gs.team1.score}</Text>
                                            </View>
                                            <Text style={st.endVs}>VS</Text>
                                            <View style={st.endTeam}>
                                                <View style={[st.endDot, { backgroundColor: '#2563EB' }]} />
                                                <Text style={[st.endName, isKurdish && st.kf]}>{gs.team2.name}</Text>
                                                <Text style={st.endVal}>{gs.team2.score}</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity onPress={doNext} activeOpacity={0.8} style={{ marginTop: 8 }}>
                                            <LinearGradient colors={['#F59E0B', '#D97706']} style={st.nextBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                                                <Text style={[st.nextTxt, isKurdish && st.kf]}>
                                                    {gs.round >= TOTAL_ROUNDS ? (isKurdish ? 'بینینی ئەنجام' : 'See Results') : (isKurdish ? `قۆناغی ${gs.round + 1} →` : `Round ${gs.round + 1} →`)}
                                                </Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </ScrollView>
                                )}

                                {/* SUDDEN DEATH */}
                                {gs.phase === PHASE.SUDDEN_DEATH && (
                                    <View style={st.center}>
                                        <Text style={[st.phTitle, { color: '#EF4444' }, isKurdish && st.kf]}>⚡ {isKurdish ? 'مردنی لەناکاو!' : 'SUDDEN DEATH!'}</Text>
                                        <Text style={[st.hint, isKurdish && st.kf]}>{isKurdish ? 'کام تیم بردیەوە؟' : 'Which team won?'}</Text>
                                        <View style={st.buzzRow}>
                                            <TouchableOpacity style={[st.buzzBtn, { backgroundColor: '#DC2626' }]} onPress={() => doSudden(1)}>
                                                <Trophy size={22} color="#FFF" />
                                                <Text style={[st.buzzName, isKurdish && st.kf]}>{gs.team1.name}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[st.buzzBtn, { backgroundColor: '#2563EB' }]} onPress={() => doSudden(2)}>
                                                <Trophy size={22} color="#FFF" />
                                                <Text style={[st.buzzName, isKurdish && st.kf]}>{gs.team2.name}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </>
                        )}

                        <BigX show={showX} />
                        <Correct show={showOk} text={okText} />
                    </SafeAreaView>
                </View>
            </KeyboardAvoidingView>
        </AnimatedScreen>
    );
}

// ════════════════════════════
// STYLES — Premium Game Show
// ════════════════════════════
const st = StyleSheet.create({
    root: { flex: 1 },
    kf: { fontFamily: 'Rabar' },

    // Countdown
    cdWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
    cdNum: { color: '#F59E0B', fontSize: 80, fontWeight: '900', textShadowColor: 'rgba(245,158,11,0.4)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 20 },
    cdLabel: { color: '#FFF', fontSize: 20, fontWeight: '800', marginTop: 8, letterSpacing: 1 },
    cdSub: { color: '#94A3B8', fontSize: 13, fontWeight: '600', marginTop: 4 },

    // Scoreboard
    scoreRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, marginBottom: 6, marginTop: 4 },
    scoreBox: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.12)', overflow: 'hidden' },
    scoreActive: { borderColor: '#F59E0B', borderWidth: 2.5 },
    scoreTeamName: { color: 'rgba(255,255,255,0.85)', fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, paddingHorizontal: 4 },
    scoreVal: { color: '#FFF', fontSize: 26, fontWeight: '900', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
    scoreCenter: { alignItems: 'center', marginHorizontal: 6, minWidth: 44 },
    scoreRound: { color: '#64748B', fontSize: 9, fontWeight: '700', letterSpacing: 1 },
    scoreBank: { color: '#FBBF24', fontSize: 24, fontWeight: '900', textShadowColor: 'rgba(251,191,36,0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 },
    multBadge: { backgroundColor: '#B45309', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginTop: 3, borderWidth: 1, borderColor: '#F59E0B' },
    multTxt: { color: '#FFF', fontSize: 10, fontWeight: '900' },

    // Common
    pad: { paddingHorizontal: 12, paddingBottom: 20, flexGrow: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 },
    phTitle: { color: '#FFF', fontSize: 18, fontWeight: '900', textAlign: 'center', marginBottom: 6, letterSpacing: 0.5, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
    hint: { color: '#94A3B8', fontSize: 13, textAlign: 'center', marginBottom: 10, fontWeight: '600' },
    qText: { color: '#FFF', fontSize: 15, fontWeight: '700', textAlign: 'center', lineHeight: 23, marginBottom: 12, backgroundColor: 'rgba(255,255,255,0.05)', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },

    // Turn Banner
    turnBanner: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
    turnAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 10, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
    turnAvatarTxt: { color: '#FFF', fontSize: 15, fontWeight: '900' },
    turnName: { color: '#FFF', fontSize: 15, fontWeight: '800' },
    turnTeam: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '600' },

    // Board
    board: { marginBottom: 8, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 14, padding: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
    answerTile: { height: 48, borderRadius: 10, overflow: 'hidden', borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 5 },
    answerInner: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
    answerNum: { color: '#FBBF24', fontSize: 18, fontWeight: '900' },
    answerText: { color: '#FFF', fontSize: 14, fontWeight: '700', flex: 1, marginLeft: 6 },
    ptsBadge: { backgroundColor: '#064E3B', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1.5, borderColor: '#34D399' },
    ptsBadgeText: { color: '#34D399', fontWeight: '900', fontSize: 14 },

    // Input
    inputRow: { flexDirection: 'row', marginTop: 6, paddingHorizontal: 2 },
    inputBox: { flex: 1, height: 44, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, paddingHorizontal: 10, color: '#FFF', fontSize: 14, fontWeight: '600', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.12)', marginRight: 6 },
    sendBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#D97706', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F59E0B' },

    // Strikes
    strikesRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: 8 },
    strikeCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(15,23,42,0.8)', alignItems: 'center', justifyContent: 'center', borderWidth: 2.5, borderColor: '#334155', marginHorizontal: 6 },
    strikeOn: { backgroundColor: '#450A0A', borderColor: '#EF4444' },

    // Buzz
    buzzRow: { flexDirection: 'row', width: '100%' },
    buzzBtn: { flex: 1, paddingVertical: 22, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginHorizontal: 5, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)' },
    buzzName: { color: '#FFF', fontSize: 16, fontWeight: '900', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
    buzzSub: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '600', marginTop: 3 },

    // Pass/Play
    popRow: { flexDirection: 'row', marginTop: 16, width: '100%' },
    popBtn: { flex: 1, paddingVertical: 24, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginHorizontal: 5, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)' },
    popLabel: { color: '#FFF', fontSize: 17, fontWeight: '900', marginTop: 4 },

    // Steal
    stealNote: { color: '#6B7280', fontSize: 11, fontWeight: '600', textAlign: 'center', marginTop: 10, fontStyle: 'italic' },

    // Round End
    revealLabel: { color: '#94A3B8', fontSize: 14, fontWeight: '800', textAlign: 'center', marginBottom: 8, letterSpacing: 0.5 },
    endTitle: { color: '#F59E0B', fontSize: 22, fontWeight: '900', textAlign: 'center', marginBottom: 12, letterSpacing: 0.5, textShadowColor: 'rgba(245,158,11,0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 10 },
    endScores: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 28, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, paddingVertical: 20, paddingHorizontal: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
    endTeam: { alignItems: 'center', flex: 1 },
    endDot: { width: 10, height: 10, borderRadius: 5, marginBottom: 4 },
    endName: { color: '#94A3B8', fontSize: 13, fontWeight: '700' },
    endVal: { color: '#FFF', fontSize: 36, fontWeight: '900', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
    endVs: { color: '#475569', fontSize: 14, fontWeight: '900', marginHorizontal: 8 },
    nextBtn: { paddingVertical: 14, paddingHorizontal: 36, borderRadius: 14, alignItems: 'center' },
    nextTxt: { color: '#FFF', fontSize: 16, fontWeight: '800' },

    // Overlays
    overlay: { backgroundColor: 'rgba(0,0,0,0.8)', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
    correctOv: { backgroundColor: 'rgba(5,150,105,0.9)', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
    correctTxt: { color: '#FFF', fontSize: 20, fontWeight: '900', marginTop: 8, textAlign: 'center' },

    // Info Note
    infoNote: { flexDirection: 'row', backgroundColor: 'rgba(245,158,11,0.12)', borderWidth: 1.5, borderColor: 'rgba(245,158,11,0.25)', borderRadius: 12, padding: 12, marginBottom: 12, alignItems: 'flex-start' },
    infoEmoji: { fontSize: 18, marginRight: 10, marginTop: 1 },
    infoText: { color: '#FBBF24', fontSize: 12, fontWeight: '600', flex: 1, lineHeight: 18 },
});
