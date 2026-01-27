import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Vibration,
    Dimensions,
    ScrollView,
} from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import {
    HelpCircle,
    AlertTriangle,
    Check,
    ChevronRight,
    Zap,
    Users,
    Target,
    Award,
    ArrowRight,
} from 'lucide-react-native';

import { AnimatedScreen } from '../../components/AnimatedScreen';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const { width, height } = Dimensions.get('window');

// Number of questions each player answers per turn
const QUESTIONS_PER_PLAYER = 3;

// ============================================
// QUESTION PHASE - Professional Game UI
// ============================================
const QuestionPhase = ({
    currentQuestion,
    currentPlayer,
    currentPlayerRound,
    actualQuestionsPerPlayer,
    timeLeft,
    maxTime,
    onAnswer,
    isKurdish,
    colors,
    isDark
}) => {
    const progress = timeLeft / maxTime;
    const isUrgent = timeLeft <= 3;

    return (
        <View style={styles.questionPhaseContainer}>
            {/* Top Section - Player Info & Timer */}
            <View style={styles.topSection}>
                {/* Player Card */}
                <View style={[styles.playerCard, { backgroundColor: currentPlayer.color }]}>
                    <View style={styles.playerCardAvatar}>
                        <Text style={styles.playerCardAvatarText}>{currentPlayer.name.charAt(0)}</Text>
                    </View>
                    <View style={styles.playerCardInfo}>
                        <Text style={styles.playerCardName}>{currentPlayer.name}</Text>
                        <Text style={styles.playerCardTurn}>
                            {isKurdish ? 'نۆرەی تۆیە' : 'Your Turn'}
                        </Text>
                    </View>
                    <View style={styles.roundBadge}>
                        <Text style={styles.roundBadgeText}>
                            {currentPlayerRound + 1}/{actualQuestionsPerPlayer}
                        </Text>
                    </View>
                </View>

                {/* Timer */}
                <MotiView
                    animate={{
                        scale: isUrgent ? [1, 1.08, 1] : 1,
                    }}
                    transition={{
                        type: 'timing',
                        duration: 400,
                        loop: isUrgent,
                    }}
                    style={[
                        styles.timerContainer,
                        {
                            backgroundColor: isUrgent ? '#EF4444' : (progress > 0.5 ? '#10B981' : '#F59E0B'),
                        }
                    ]}
                >
                    <Text style={styles.timerNumber}>{timeLeft}</Text>
                    <Text style={styles.timerLabel}>{isKurdish ? 'چرکە' : 'sec'}</Text>
                </MotiView>
            </View>

            {/* Question Card */}
            <View style={[styles.questionCard, { backgroundColor: isDark ? 'rgba(217, 0, 255, 0.08)' : 'rgba(217, 0, 255, 0.05)' }]}>
                <LinearGradient
                    colors={['rgba(217, 0, 255, 0.2)', 'rgba(112, 0, 255, 0.1)']}
                    style={styles.questionCardGradient}
                >
                    <View style={styles.questionIconRow}>
                        <View style={styles.questionIconBg}>
                            <HelpCircle size={24} color="#D900FF" />
                        </View>
                        <View style={styles.warningBadge}>
                            <AlertTriangle size={12} color="#F59E0B" />
                            <Text style={styles.warningBadgeText}>
                                {isKurdish ? 'وەڵامی هەڵە!' : 'WRONG Answer!'}
                            </Text>
                        </View>
                    </View>

                    <Text style={[styles.questionLabel, { color: colors.text.secondary }]}>
                        {isKurdish ? 'پرسیار' : 'Question'}
                    </Text>

                    <Text style={styles.questionText}>{currentQuestion.q}</Text>

                    {/* Correct Answer Hint */}
                    <View style={styles.hintContainer}>
                        <Target size={14} color="rgba(255,255,255,0.5)" />
                        <Text style={styles.hintText}>
                            {isKurdish
                                ? 'وەڵامی هەڵە بڵێ، نەک ڕاست!'
                                : 'Say a WRONG answer, not the correct one!'}
                        </Text>
                    </View>
                </LinearGradient>
            </View>

            {/* Action Button */}
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={onAnswer}
                style={styles.actionBtnWrap}
            >
                <LinearGradient
                    colors={['#10B981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.actionBtn}
                >
                    <Check size={28} color="#FFF" strokeWidth={3} />
                    <Text style={styles.actionBtnText}>
                        {isKurdish ? 'وەڵامم دا' : 'Done'}
                    </Text>
                    <ArrowRight size={20} color="rgba(255,255,255,0.7)" />
                </LinearGradient>
            </TouchableOpacity>

            {/* Progress Dots */}
            <View style={styles.progressDots}>
                {Array.from({ length: actualQuestionsPerPlayer }).map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.progressDot,
                            i < currentPlayerRound && styles.progressDotComplete,
                            i === currentPlayerRound && styles.progressDotActive,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

// ============================================
// READY SCREEN - Before Player's Turn
// ============================================
const ReadyScreen = ({ player, onReady, isKurdish, colors, questionsCount, playerNumber, totalPlayers }) => (
    <View style={styles.readyContainer}>
        {/* Header */}
        <View style={styles.readyHeader}>
            <View style={styles.readyPlayerCount}>
                <Users size={16} color="#D900FF" />
                <Text style={styles.readyPlayerCountText}>
                    {isKurdish
                        ? `یاریزان ${playerNumber} لە ${totalPlayers}`
                        : `Player ${playerNumber} of ${totalPlayers}`}
                </Text>
            </View>
        </View>

        {/* Player Avatar - Large */}
        <View style={[styles.readyAvatarLarge, { backgroundColor: player.color }]}>
            <Text style={styles.readyAvatarLargeText}>{player.name.charAt(0)}</Text>
        </View>

        {/* Player Name */}
        <Text style={[styles.readyPlayerName, { color: colors.text.primary }]}>
            {player.name}
        </Text>

        {/* Instructions Card */}
        <View style={[styles.instructionsCard, { backgroundColor: colors.surface }]}>
            <View style={styles.instructionRow}>
                <View style={[styles.instructionIcon, { backgroundColor: 'rgba(217, 0, 255, 0.15)' }]}>
                    <HelpCircle size={20} color="#D900FF" />
                </View>
                <View style={styles.instructionContent}>
                    <Text style={[styles.instructionTitle, { color: colors.text.primary }]}>
                        {isKurdish ? `${questionsCount} پرسیار` : `${questionsCount} Questions`}
                    </Text>
                    <Text style={[styles.instructionDesc, { color: colors.text.secondary }]}>
                        {isKurdish ? 'دەبێت وەڵام بدەیتەوە' : 'You need to answer'}
                    </Text>
                </View>
            </View>

            <View style={styles.instructionDivider} />

            <View style={styles.instructionRow}>
                <View style={[styles.instructionIcon, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                    <AlertTriangle size={20} color="#F59E0B" />
                </View>
                <View style={styles.instructionContent}>
                    <Text style={[styles.instructionTitle, { color: colors.text.primary }]}>
                        {isKurdish ? 'وەڵامی هەڵە' : 'Wrong Answers Only'}
                    </Text>
                    <Text style={[styles.instructionDesc, { color: colors.text.secondary }]}>
                        {isKurdish ? 'وەڵامی ڕاست مەدە!' : 'Don\'t give right answers!'}
                    </Text>
                </View>
            </View>
        </View>

        {/* Start Button */}
        <TouchableOpacity activeOpacity={0.9} onPress={onReady} style={styles.startBtnWrap}>
            <LinearGradient
                colors={['#D900FF', '#7000FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.startBtn}
            >
                <Zap size={24} color="#FFF" />
                <Text style={styles.startBtnText}>
                    {isKurdish ? 'دەستپێبکە!' : 'Start Playing!'}
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    </View>
);

// ============================================
// PASS DEVICE SCREEN
// ============================================
const PassDeviceScreen = ({ nextPlayer, onReady, isKurdish, colors, questionsCount, playerNumber, totalPlayers }) => (
    <View style={styles.passContainer}>
        <View style={styles.passIconWrapper}>
            <ChevronRight size={40} color="#F59E0B" />
        </View>

        <Text style={[styles.passTitle, { color: colors.text.secondary }]}>
            {isKurdish ? 'ئامرازەکە بدە بە' : 'Pass device to'}
        </Text>

        {/* Next Player Avatar */}
        <View style={[styles.passAvatarLarge, { backgroundColor: nextPlayer.color }]}>
            <Text style={styles.passAvatarLargeText}>{nextPlayer.name.charAt(0)}</Text>
        </View>

        <Text style={[styles.passPlayerName, { color: colors.text.primary }]}>
            {nextPlayer.name}
        </Text>

        <View style={styles.passInfoBadge}>
            <Text style={styles.passInfoText}>
                {isKurdish
                    ? `یاریزان ${playerNumber} لە ${totalPlayers} • ${questionsCount} پرسیار`
                    : `Player ${playerNumber} of ${totalPlayers} • ${questionsCount} questions`}
            </Text>
        </View>

        <TouchableOpacity activeOpacity={0.9} onPress={onReady} style={styles.passReadyBtnWrap}>
            <LinearGradient
                colors={['#D900FF', '#7000FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.passReadyBtn}
            >
                <Text style={styles.passReadyBtnText}>
                    {isKurdish ? 'ئامادەم!' : 'I\'m Ready!'}
                </Text>
                <ChevronRight size={22} color="#FFF" />
            </LinearGradient>
        </TouchableOpacity>
    </View>
);

// ============================================
// GAME COMPLETE SCREEN
// ============================================
const GameCompleteScreen = ({ isKurdish, colors, onContinue, players }) => (
    <View style={styles.completeContainer}>
        {/* Success Icon */}
        <View style={styles.completeIconWrapper}>
            <LinearGradient colors={['#10B981', '#059669']} style={styles.completeIconBg}>
                <Award size={50} color="#FFF" />
            </LinearGradient>
        </View>

        <Text style={[styles.completeTitle, { color: colors.text.primary }]}>
            {isKurdish ? 'تەواو بوو!' : 'All Done!'}
        </Text>

        <Text style={[styles.completeSubtitle, { color: colors.text.secondary }]}>
            {isKurdish
                ? 'هەموو یاریزانەکان وەڵامیان دایەوە'
                : 'All players have answered'}
        </Text>

        {/* Player Completion Summary */}
        <View style={[styles.completeSummary, { backgroundColor: colors.surface }]}>
            <View style={styles.completeSummaryHeader}>
                <Users size={18} color="#D900FF" />
                <Text style={[styles.completeSummaryTitle, { color: colors.text.primary }]}>
                    {isKurdish ? 'یاریزانەکان' : 'Players'}
                </Text>
            </View>
            <View style={styles.completePlayers}>
                {players.map((player, i) => (
                    <View key={i} style={[styles.completePlayerBadge, { backgroundColor: player.color }]}>
                        <Text style={styles.completePlayerName}>{player.name}</Text>
                        <Check size={14} color="#FFF" strokeWidth={3} />
                    </View>
                ))}
            </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity activeOpacity={0.9} onPress={onContinue} style={styles.continueBtnWrap}>
            <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.continueBtn}
            >
                <Text style={styles.continueBtnText}>
                    {isKurdish ? 'تەواو کردن' : 'Finish Game'}
                </Text>
                <ChevronRight size={22} color="#FFF" />
            </LinearGradient>
        </TouchableOpacity>
    </View>
);

// ============================================
// MAIN COMPONENT
// ============================================
export default function WrongAnswerPlay({ navigation, route }) {
    const { isKurdish } = useLanguage();
    const { colors, isDark } = useTheme();

    const { players, questions, answerTime, voteTime, scores: initialScores } = route.params;

    // Calculate questions per player
    const questionsPerPlayer = Math.min(QUESTIONS_PER_PLAYER, Math.floor(questions.length / players.length));
    const actualQuestionsPerPlayer = Math.max(1, questionsPerPlayer);

    // Game state
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [currentPlayerRound, setCurrentPlayerRound] = useState(0);
    const [phase, setPhase] = useState('ready'); // ready, question, passDevice, complete
    const [timeLeft, setTimeLeft] = useState(answerTime);
    const [allAnswers, setAllAnswers] = useState([]);

    const getQuestionForRound = () => {
        const questionIndex = (currentPlayerIndex * actualQuestionsPerPlayer + currentPlayerRound) % questions.length;
        return { question: questions[questionIndex], index: questionIndex };
    };

    const { question: currentQuestion, index: currentQuestionIndex } = getQuestionForRound();
    const currentPlayer = players[currentPlayerIndex];

    // Timer
    useEffect(() => {
        if (phase === 'question' && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        handlePlayerAnswered(true);
                        return 0;
                    }
                    if (prev <= 3) Vibration.vibrate(100);
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [phase, timeLeft]);

    const handlePlayerAnswered = (timeout = false) => {
        setAllAnswers(prev => [...prev, {
            playerIndex: currentPlayerIndex,
            questionIndex: currentQuestionIndex,
            answered: true,
            isTimeout: timeout,
        }]);

        if (currentPlayerRound < actualQuestionsPerPlayer - 1) {
            setCurrentPlayerRound(prev => prev + 1);
            setTimeLeft(answerTime);
        } else {
            if (currentPlayerIndex < players.length - 1) {
                setPhase('passDevice');
            } else {
                setPhase('complete');
            }
        }
    };

    const handleStartGame = () => setPhase('question');

    const handleNextPlayer = () => {
        setCurrentPlayerIndex(prev => prev + 1);
        setCurrentPlayerRound(0);
        setTimeLeft(answerTime);
        setPhase('ready');
    };

    const handleFinishGame = () => {
        navigation.navigate('Home');
    };

    return (
        <AnimatedScreen>
            <View style={[styles.container, { backgroundColor: isDark ? '#0D0221' : colors.background }]}>
                {/* Background Gradient */}
                <LinearGradient
                    colors={isDark
                        ? ['rgba(217, 0, 255, 0.08)', 'transparent', 'rgba(112, 0, 255, 0.05)']
                        : ['rgba(217, 0, 255, 0.03)', 'transparent', 'rgba(112, 0, 255, 0.02)']}
                    style={StyleSheet.absoluteFill}
                />

                {phase === 'ready' && (
                    <ReadyScreen
                        player={currentPlayer}
                        onReady={handleStartGame}
                        isKurdish={isKurdish}
                        colors={colors}
                        questionsCount={actualQuestionsPerPlayer}
                        playerNumber={currentPlayerIndex + 1}
                        totalPlayers={players.length}
                    />
                )}

                {phase === 'question' && (
                    <QuestionPhase
                        currentQuestion={currentQuestion}
                        currentPlayer={currentPlayer}
                        currentPlayerRound={currentPlayerRound}
                        actualQuestionsPerPlayer={actualQuestionsPerPlayer}
                        timeLeft={timeLeft}
                        maxTime={answerTime}
                        onAnswer={() => handlePlayerAnswered(false)}
                        isKurdish={isKurdish}
                        colors={colors}
                        isDark={isDark}
                    />
                )}

                {phase === 'passDevice' && (
                    <PassDeviceScreen
                        nextPlayer={players[currentPlayerIndex + 1]}
                        onReady={handleNextPlayer}
                        isKurdish={isKurdish}
                        colors={colors}
                        questionsCount={actualQuestionsPerPlayer}
                        playerNumber={currentPlayerIndex + 2}
                        totalPlayers={players.length}
                    />
                )}

                {phase === 'complete' && (
                    <GameCompleteScreen
                        isKurdish={isKurdish}
                        colors={colors}
                        onContinue={handleFinishGame}
                        players={players}
                    />
                )}
            </View>
        </AnimatedScreen>
    );
}

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    // ========== QUESTION PHASE ==========
    questionPhaseContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24,
    },
    topSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    playerCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        marginRight: 12,
    },
    playerCardAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    playerCardAvatarText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '800',
    },
    playerCardInfo: {
        flex: 1,
        marginLeft: 10,
    },
    playerCardName: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    playerCardTurn: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 12,
        fontWeight: '500',
    },
    roundBadge: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    roundBadgeText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '700',
    },
    timerContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerNumber: {
        color: '#FFF',
        fontSize: 28,
        fontWeight: '900',
    },
    timerLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 10,
        fontWeight: '600',
        marginTop: -2,
    },

    // Question Card
    questionCard: {
        flex: 1,
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 20,
    },
    questionCardGradient: {
        flex: 1,
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(217, 0, 255, 0.2)',
    },
    questionIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    questionIconBg: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(217, 0, 255, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    warningBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    warningBadgeText: {
        color: '#F59E0B',
        fontSize: 12,
        fontWeight: '700',
    },
    questionLabel: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    questionText: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 34,
        flex: 1,
    },
    hintContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 'auto',
        paddingTop: 16,
        gap: 8,
    },
    hintText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13,
        fontWeight: '500',
    },

    // Action Button
    actionBtnWrap: {
        marginBottom: 16,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 64,
        borderRadius: 32,
        gap: 12,
    },
    actionBtnText: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: '800',
    },

    // Progress Dots
    progressDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    progressDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    progressDotActive: {
        backgroundColor: '#D900FF',
        width: 24,
    },
    progressDotComplete: {
        backgroundColor: '#10B981',
    },

    // ========== READY SCREEN ==========
    readyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    readyHeader: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
    },
    readyPlayerCount: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'rgba(217, 0, 255, 0.15)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 8,
    },
    readyPlayerCountText: {
        color: '#D900FF',
        fontSize: 14,
        fontWeight: '600',
    },
    readyAvatarLarge: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    readyAvatarLargeText: {
        color: '#FFF',
        fontSize: 48,
        fontWeight: '900',
    },
    readyPlayerName: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 24,
    },
    instructionsCard: {
        width: '100%',
        borderRadius: 20,
        padding: 20,
        marginBottom: 32,
    },
    instructionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    instructionIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    instructionContent: {
        flex: 1,
        marginLeft: 14,
    },
    instructionTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    instructionDesc: {
        fontSize: 13,
        fontWeight: '500',
        marginTop: 2,
    },
    instructionDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: 14,
    },
    startBtnWrap: {
        width: '100%',
    },
    startBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        borderRadius: 30,
        gap: 12,
    },
    startBtnText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '700',
    },

    // ========== PASS DEVICE SCREEN ==========
    passContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    passIconWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    passTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 20,
    },
    passAvatarLarge: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    passAvatarLargeText: {
        color: '#FFF',
        fontSize: 42,
        fontWeight: '900',
    },
    passPlayerName: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 12,
    },
    passInfoBadge: {
        backgroundColor: 'rgba(217, 0, 255, 0.15)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 40,
    },
    passInfoText: {
        color: '#D900FF',
        fontSize: 13,
        fontWeight: '600',
    },
    passReadyBtnWrap: {
        width: '100%',
    },
    passReadyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        borderRadius: 30,
        gap: 10,
    },
    passReadyBtnText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '700',
    },

    // ========== GAME COMPLETE SCREEN ==========
    completeContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    completeIconWrapper: {
        marginBottom: 24,
    },
    completeIconBg: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    completeTitle: {
        fontSize: 32,
        fontWeight: '900',
        marginBottom: 8,
    },
    completeSubtitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 32,
    },
    completeSummary: {
        width: '100%',
        borderRadius: 20,
        padding: 20,
        marginBottom: 32,
    },
    completeSummaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    completeSummaryTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    completePlayers: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    completePlayerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 8,
    },
    completePlayerName: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    continueBtnWrap: {
        width: '100%',
    },
    continueBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        borderRadius: 30,
        gap: 10,
    },
    continueBtnText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '700',
    },
});
