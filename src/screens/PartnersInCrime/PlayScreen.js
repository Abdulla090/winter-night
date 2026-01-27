import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Keyboard, ScrollView } from 'react-native';
import { X, Check, Users, Trophy, MessageSquare, AlertCircle } from 'lucide-react-native';
import { MotiView, AnimatePresence } from 'moti';
import { AnimatedScreen } from '../../components/AnimatedScreen';
import { GlassCard } from '../../components/GlassCard';
import { BeastButton } from '../../components/BeastButton';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { layout } from '../../theme/layout';
import { getPartnersQuestions } from '../../constants/partnersData';

export default function PartnersPlayScreen({ navigation, route }) {
    const { p1Name, p2Name, category } = route.params;
    const { colors, isRTL } = useTheme();
    const { language, isKurdish } = useLanguage();

    const questions = useRef(getPartnersQuestions(category.id));
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [phase, setPhase] = useState(1);
    const [p1Answer, setP1Answer] = useState('');
    const [p2Answer, setP2Answer] = useState('');
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const currentQuestion = questions.current[currentQIndex];

    const handlePhase1Submit = () => {
        if (!p1Answer.trim()) return;
        setPhase(2);
    };

    const handlePhase2Submit = (correct) => {
        if (correct) setScore(prev => prev + 1);
        setShowResult(true);
        setTimeout(() => {
            setShowResult(false);
            setPhase(3);
            setP1Answer('');
            setP2Answer('');
        }, 1500);
    };

    const handlePhase3Submit = () => {
        if (!p2Answer.trim()) return;
        setPhase(4);
    };

    const handlePhase4Submit = (correct) => {
        if (correct) setScore(prev => prev + 1);
        setShowResult(true);
        setTimeout(() => {
            setShowResult(false);
            // Check if game over
            if (currentQIndex + 1 >= questions.current.length) {
                setPhase('end');
            } else {
                setCurrentQIndex(prev => prev + 1);
                setPhase(1);
                setP1Answer('');
                setP2Answer('');
            }
        }, 1500);
    };

    // Game Over Screen
    if (phase === 'end') {
        return (
            <AnimatedScreen>
                <MotiView
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={styles.centerContent}
                >
                    <View style={[styles.endIconContainer, { backgroundColor: colors.surfaceHighlight }]}>
                        <Trophy size={64} color={colors.brand.gold} />
                    </View>

                    <Text style={[styles.endTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'ئەنجام' : 'Results'}
                    </Text>

                    <View style={styles.scoreContainer}>
                        <Text style={[styles.scoreBig, { color: colors.brand.primary }]}>{score}</Text>
                        <Text style={[styles.subText, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'خاڵی کۆکراوە' : 'Total Points'}
                        </Text>
                    </View>

                    <View style={{ width: '100%', paddingHorizontal: layout.spacing.xl }}>
                        <BeastButton
                            title={isKurdish ? 'تەواو' : 'Finish'}
                            onPress={() => navigation.navigate('Home')}
                            size="lg"
                            variant="primary"
                        />
                    </View>
                </MotiView>
            </AnimatedScreen>
        );
    }

    if (!currentQuestion) return null;

    const qText = currentQuestion.q[language];
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
        <AnimatedScreen>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                {/* Header */}
                <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <BeastButton
                        size="sm"
                        variant="ghost"
                        icon={X}
                        onPress={() => navigation.goBack()}
                        style={{ width: 40, height: 40 }}
                    />
                    <GlassCard intensity={20} style={styles.scoreBadge}>
                        <Trophy size={14} color={colors.accent} style={{ marginRight: 6 }} />
                        <Text style={{ color: colors.text.primary, fontWeight: 'bold' }}>{score}</Text>
                    </GlassCard>
                </View>

                {/* Score/Success Overlay */}
                <AnimatePresence>
                    {showResult && (
                        <MotiView
                            from={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            style={styles.overlay}
                        >
                            <GlassCard style={styles.resultCard}>
                                <View style={[styles.resultIcon, { backgroundColor: colors.accent }]}>
                                    <Check size={40} color="#FFF" strokeWidth={3} />
                                </View>
                                <Text style={[styles.resultTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                                    {isKurdish ? 'تۆمار کرا!' : 'Recorded!'}
                                </Text>
                            </GlassCard>
                        </MotiView>
                    )}
                </AnimatePresence>

                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                    {/* Question Card */}
                    <Text style={[styles.phaseLabel, { color: colors.text.tertiary }, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? `پرسیاری ${currentQIndex + 1}` : `QUESTION ${currentQIndex + 1}`}
                    </Text>

                    <GlassCard
                        style={[styles.questionCard, { borderColor: colors.border }]}
                        intensity={40}
                    >
                        <AlertCircle size={32} color={colors.brand.secondary} style={{ marginBottom: 16 }} />
                        <Text style={[styles.questionText, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                            {qText}
                        </Text>
                    </GlassCard>

                    {/* Logic Section */}
                    <View style={styles.playerSection}>
                        <View style={[styles.avatarCircle, { backgroundColor: phase % 2 !== 0 ? colors.brand.primary : colors.brand.secondary }]}>
                            <Text style={styles.avatarText}>{activePlayerName.charAt(0)}</Text>
                        </View>
                        <Text style={[styles.playerName, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                            {activePlayerName}
                        </Text>
                        <Text style={[styles.instruction, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                            {instruction}
                        </Text>
                    </View>

                    {!isGuessing ? (
                        <MotiView
                            from={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            style={{ w: '100%' }}
                        >
                            <GlassCard intensity={10} style={{ padding: 0 }}>
                                <TextInput
                                    style={[
                                        styles.input,
                                        { color: colors.text.primary },
                                        isKurdish && styles.kurdishFont,
                                        isRTL && { textAlign: 'right' }
                                    ]}
                                    value={inputValue}
                                    onChangeText={setInputValue}
                                    placeholder={isKurdish ? 'لێرە وەڵام بدەرەوە...' : 'Type answer here...'}
                                    placeholderTextColor={colors.text.muted}
                                    multiline
                                    autoFocus
                                />
                            </GlassCard>
                            <BeastButton
                                title={isKurdish ? 'تەواو' : 'Submit'}
                                onPress={onDone}
                                disabled={!inputValue.trim()}
                                size="lg"
                                style={{ marginTop: layout.spacing.lg }}
                                icon={Check}
                            />
                        </MotiView>
                    ) : (
                        <MotiView
                            from={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            style={styles.revealSection}
                        >
                            <GlassCard style={{ width: '100%', marginBottom: layout.spacing.lg }}>
                                <Text style={[styles.revealLabel, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                                    {isKurdish ? 'وەڵامە ڕاستەکە:' : 'The Real Answer:'}
                                </Text>
                                <Text style={[styles.revealText, { color: colors.brand.primary }, isKurdish && styles.kurdishFont]}>
                                    {phase === 2 ? p1Answer : p2Answer}
                                </Text>
                            </GlassCard>

                            <Text style={[styles.askText, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                                {isKurdish ? 'ڕاستت کرد؟' : 'Did you guess correctly?'}
                            </Text>

                            <View style={styles.decisionRow}>
                                <BeastButton
                                    variant="danger"
                                    icon={X}
                                    onPress={() => phase === 2 ? handlePhase2Submit(false) : handlePhase4Submit(false)}
                                    style={styles.decisionBtn}
                                />
                                <BeastButton
                                    variant="success"
                                    icon={Check}
                                    onPress={() => phase === 2 ? handlePhase2Submit(true) : handlePhase4Submit(true)}
                                    style={styles.decisionBtn}
                                />
                            </View>
                        </MotiView>
                    )}

                </ScrollView>
            </KeyboardAvoidingView>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: layout.spacing.md,
    },
    scoreBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    content: {
        paddingBottom: 40,
    },
    phaseLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
        letterSpacing: 1,
        textAlign: 'center',
    },
    questionCard: {
        alignItems: 'center',
        padding: layout.spacing.xl,
        marginBottom: layout.spacing.xl,
    },
    questionText: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 30,
    },
    playerSection: {
        alignItems: 'center',
        marginBottom: layout.spacing.xl,
    },
    avatarCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        ...layout.shadows.md,
    },
    avatarText: {
        color: '#FFF',
        fontSize: 28,
        fontWeight: 'bold',
    },
    playerName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    instruction: {
        fontSize: 16,
    },
    input: {
        padding: 16,
        fontSize: 18,
        minHeight: 120,
        textAlignVertical: 'top',
    },
    revealSection: {
        width: '100%',
        alignItems: 'center',
    },
    revealLabel: {
        fontSize: 14,
        marginBottom: 8,
        textAlign: 'center',
    },
    revealText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    askText: {
        fontSize: 18,
        marginBottom: 20,
        fontWeight: '600',
    },
    decisionRow: {
        flexDirection: 'row',
        gap: 20,
    },
    decisionBtn: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
    },
    resultIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    resultCard: {
        alignItems: 'center',
        padding: 30,
        minWidth: 200,
    },
    resultTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },

    // End Screen
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    endIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    endTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    scoreContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    scoreBig: {
        fontSize: 80,
        fontWeight: '900',
        lineHeight: 90,
    },
    subText: {
        fontSize: 16,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    kurdishFont: {
        fontFamily: 'Rabar_022',
    }
});
