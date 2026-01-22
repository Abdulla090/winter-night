import React, { useState, useRef } from 'react';
import {
    StyleSheet, View, Text, TouchableOpacity, Animated, TextInput, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';
import { GradientBackground, GlassCard, Button } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { getPartnersQuestions } from '../../constants/partnersData'; // Fix invalid import if needed, assuming Data file is correct

export default function PartnersPlayScreen({ navigation, route }) {
    const { p1Name, p2Name, category } = route.params;
    const { language, isKurdish } = useLanguage();
    const rowDirection = isKurdish ? 'row-reverse' : 'row';

    // Game Logic
    // Phase 1: Player 1 answers secretly
    // Phase 2: Player 2 guesses P1's answer
    // Phase 3: Player 2 answers secretly
    // Phase 4: Player 1 guesses P2's answer
    // Then Repeat

    const questions = useRef(getPartnersQuestions(category.id));
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [phase, setPhase] = useState(1);
    const [p1Answer, setP1Answer] = useState('');
    const [p2Answer, setP2Answer] = useState('');
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false); // To show if guess was correct

    const currentQuestion = questions.current[currentQIndex];
    if (!currentQuestion) return null; // Or Game Over

    const handlePhase1Submit = () => {
        if (!p1Answer.trim()) return;
        setPhase(2);
    };

    const handlePhase2Submit = (correct) => {
        if (correct) setScore(prev => prev + 1);
        setShowResult(true);
        // Delay then move to next part
        setTimeout(() => {
            setShowResult(false);
            setPhase(3);
            setP1Answer('');
            setP2Answer('');
        }, 2000);
    };

    const handlePhase3Submit = () => {
        if (!p2Answer.trim()) return;
        setPhase(4);
    };

    const handlePhase4Submit = (correct) => {
        if (correct) setScore(prev => prev + 1);
        setShowResult(true);
        // Delay then move to next question or end
        setTimeout(() => {
            setShowResult(false);
            if (currentQIndex + 1 >= questions.current.length) {
                setPhase('end');
            } else {
                setCurrentQIndex(prev => prev + 1);
                setPhase(1);
                setP1Answer('');
                setP2Answer('');
            }
        }, 2000);
    };

    // --- RENDER HELPERS ---

    // Game Over
    if (phase === 'end') {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.safeArea}>
                    <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={styles.centerContent}
                    >
                        <Text style={styles.emoji}>💑</Text>
                        <Text style={[styles.title, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'ئەنجام' : 'Results'}
                        </Text>
                        <Text style={styles.scoreBig}>{score}</Text>
                        <Text style={[styles.subText, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'خاڵی کۆکراوە' : 'Total Points'}
                        </Text>

                        <View style={{ marginTop: SPACING.xl, width: '100%' }}>
                            <Button
                                title={isKurdish ? 'تەواو' : 'Finish'}
                                onPress={() => navigation.navigate('Home')}
                                gradient={[COLORS.accent.primary, '#2563eb']}
                            />
                        </View>
                    </MotiView>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    // Question Text
    const qText = currentQuestion.q[language];

    // Determine who is doing what
    let activePlayerName = '';
    let instruction = '';
    let isGuessing = false;
    let inputValue = '';
    let setInputValue = null;
    let onDone = null;

    if (phase === 1) {
        activePlayerName = p1Name;
        instruction = isKurdish ? 'بە نهێنی وەڵام بدەرەوە' : 'Answer secretly';
        inputValue = p1Answer;
        setInputValue = setP1Answer;
        onDone = handlePhase1Submit;
    } else if (phase === 2) {
        activePlayerName = p2Name;
        instruction = isKurdish ? `بووەستە! وەڵامی ${p1Name} چی بوو؟` : `Guess ${p1Name}'s answer!`;
        isGuessing = true;
        // Logic handled differently for guessing phase UI
    } else if (phase === 3) {
        activePlayerName = p2Name;
        instruction = isKurdish ? 'بە نهێنی وەڵام بدەرەوە' : 'Answer secretly';
        inputValue = p2Answer;
        setInputValue = setP2Answer;
        onDone = handlePhase3Submit;
    } else if (phase === 4) {
        activePlayerName = p1Name;
        instruction = isKurdish ? `بووەستە! وەڵامی ${p2Name} چی بوو؟` : `Guess ${p2Name}'s answer!`;
        isGuessing = true;
    }

    return (
        <GradientBackground>
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    {/* Header */}
                    <View style={[styles.header, { flexDirection: rowDirection }]}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name="close" size={24} color={COLORS.text.primary} />
                        </TouchableOpacity>
                        <View style={styles.scoreBadge}>
                            <Text style={styles.scoreText}>{score}</Text>
                        </View>
                    </View>

                    {/* Result Overlay */}
                    <AnimatePresence>
                        {showResult && (
                            <MotiView
                                from={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={styles.overlay}
                            >
                                <GlassCard intensity={80} style={styles.resultCard}>
                                    <Ionicons name="checkmark-circle" size={60} color={COLORS.accent.success} />
                                    <Text style={[styles.resultTitle, isKurdish && styles.kurdishFont]}>
                                        {isKurdish ? 'تۆمار کرا!' : 'Recorded!'}
                                    </Text>
                                </GlassCard>
                            </MotiView>
                        )}
                    </AnimatePresence>

                    <ScrollView contentContainerStyle={styles.content}>
                        <Text style={[styles.phaseLabel, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? `پرسیاری ${currentQIndex + 1}` : `Question ${currentQIndex + 1}`}
                        </Text>

                        <View style={styles.questionCard}>
                            <Text style={[styles.questionText, isKurdish && styles.kurdishFont]}>
                                {qText}
                            </Text>
                        </View>

                        <View style={styles.playerSection}>
                            <View style={styles.avatarCircle}>
                                <Text style={styles.avatarText}>{activePlayerName.charAt(0)}</Text>
                            </View>
                            <Text style={[styles.playerName, isKurdish && styles.kurdishFont]}>
                                {activePlayerName}
                            </Text>
                            <Text style={[styles.instruction, isKurdish && styles.kurdishFont]}>
                                {instruction}
                            </Text>
                        </View>

                        {!isGuessing ? (
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={[styles.input, isKurdish && styles.kurdishFont]}
                                    value={inputValue}
                                    onChangeText={setInputValue}
                                    placeholder={isKurdish ? 'لێرە  بنوسە...' : 'Type here...'}
                                    placeholderTextColor={COLORS.text.muted}
                                    multiline
                                />
                                <Button
                                    title={isKurdish ? 'تەواو' : 'Done'}
                                    onPress={onDone}
                                    disabled={!inputValue.trim()}
                                    gradient={[COLORS.accent.primary, '#2563eb']}
                                    style={{ marginTop: SPACING.lg }}
                                />
                            </View>
                        ) : (
                            <View style={styles.revealSection}>
                                <Text style={[styles.revealLabel, isKurdish && styles.kurdishFont]}>
                                    {isKurdish ? 'وەڵامە ڕاستەکە:' : 'The Real Answer:'}
                                </Text>
                                <GlassCard intensity={20} style={styles.answerRevealCard}>
                                    <Text style={[styles.revealText, isKurdish && styles.kurdishFont]}>
                                        {phase === 2 ? p1Answer : p2Answer}
                                    </Text>
                                </GlassCard>

                                <Text style={[styles.askText, isKurdish && styles.kurdishFont]}>
                                    {isKurdish ? 'ڕاستت کرد؟' : 'Did you get it right?'}
                                </Text>

                                <View style={styles.decisionRow}>
                                    <TouchableOpacity
                                        style={[styles.decisionBtn, styles.wrongBtn]}
                                        onPress={() => phase === 2 ? handlePhase2Submit(false) : handlePhase4Submit(false)}
                                    >
                                        <Ionicons name="close" size={30} color="#FFF" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.decisionBtn, styles.correctBtn]}
                                        onPress={() => phase === 2 ? handlePhase2Submit(true) : handlePhase4Submit(true)}
                                    >
                                        <Ionicons name="checkmark" size={30} color="#FFF" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: SPACING.md,
    },
    scoreBadge: {
        backgroundColor: COLORS.accent.secondary,
        paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12,
    },
    scoreText: { color: '#FFF', fontWeight: 'bold' },
    content: {
        padding: SPACING.lg,
        paddingBottom: 40,
        alignItems: 'center',
    },
    phaseLabel: {
        color: COLORS.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: SPACING.md,
    },
    questionCard: {
        width: '100%',
        padding: SPACING.xl,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: BORDER_RADIUS.xl,
        marginBottom: SPACING.xl,
        alignItems: 'center',
    },
    questionText: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 32,
    },
    playerSection: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    avatarCircle: {
        width: 60, height: 60, borderRadius: 30,
        backgroundColor: COLORS.accent.primary,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: SPACING.sm,
    },
    avatarText: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
    playerName: { color: COLORS.text.primary, fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
    instruction: { color: COLORS.accent.warning, fontSize: 16 },

    inputContainer: { width: '100%' },
    input: {
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        color: COLORS.text.primary,
        fontSize: 18,
        minHeight: 120,
        textAlignVertical: 'top',
    },

    // Reveal
    revealSection: { width: '100%', alignItems: 'center' },
    revealLabel: { color: COLORS.text.secondary, marginBottom: SPACING.sm },
    answerRevealCard: { width: '100%', padding: SPACING.lg, alignItems: 'center', marginBottom: SPACING.lg },
    revealText: { color: COLORS.text.primary, fontSize: 24, fontWeight: 'bold' },
    askText: { color: COLORS.text.primary, fontSize: 18, marginBottom: SPACING.lg },
    decisionRow: { flexDirection: 'row', gap: SPACING.xl },
    decisionBtn: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
    wrongBtn: { backgroundColor: COLORS.accent.danger },
    correctBtn: { backgroundColor: COLORS.accent.success },

    // Overlay
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    resultCard: { padding: 40, alignItems: 'center', borderRadius: 20 },
    resultTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginTop: 10 },

    // End Screen
    centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
    emoji: { fontSize: 80, marginBottom: SPACING.lg },
    title: { color: COLORS.text.primary, fontSize: 32, fontWeight: 'bold' },
    scoreBig: { fontSize: 100, fontWeight: '900', color: COLORS.accent.primary },
    subText: { color: COLORS.text.secondary, fontSize: 18 },

    kurdishFont: { fontFamily: 'Rabar' },
});
