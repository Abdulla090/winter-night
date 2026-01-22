import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { Button, GradientBackground, GlassCard } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { getRandomWord } from '../../constants/drawingData';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../localization/translations';

const { width } = Dimensions.get('window');
const CANVAS_SIZE = width - 48;

const DRAW_COLORS = ['#FFFFFF', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#000000'];

export default function DrawGuessPlayScreen({ navigation, route }) {
    const { players, category, roundTime } = route.params;
    const { language, isKurdish } = useLanguage();

    const [phase, setPhase] = useState('reveal'); // 'reveal', 'drawing', 'result'
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [currentWord, setCurrentWord] = useState('');
    const [paths, setPaths] = useState([]);
    const [currentPath, setCurrentPath] = useState([]);
    const [currentColor, setCurrentColor] = useState('#FFFFFF');
    const [timeLeft, setTimeLeft] = useState(roundTime);
    const [scores, setScores] = useState(players.reduce((acc, p) => ({ ...acc, [p]: 0 }), {}));
    const [roundNumber, setRoundNumber] = useState(1);

    const timerRef = useRef(null);
    const rowDirection = isKurdish ? 'row-reverse' : 'row';
    const textAlign = isKurdish ? 'right' : 'left';

    useEffect(() => {
        if (phase === 'reveal') {
            setCurrentWord(getRandomWord(category, language));
        }
    }, [currentPlayerIndex, phase, language]);

    useEffect(() => {
        if (phase === 'drawing') {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        setPhase('result');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [phase]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (e) => {
                const { locationX, locationY } = e.nativeEvent;
                setCurrentPath([`M${locationX},${locationY}`]);
            },
            onPanResponderMove: (e) => {
                const { locationX, locationY } = e.nativeEvent;
                setCurrentPath((prev) => [...prev, `L${locationX},${locationY}`]);
            },
            onPanResponderRelease: () => {
                if (currentPath.length > 0) {
                    setPaths((prev) => [...prev, { d: currentPath.join(' '), color: currentColor }]);
                    setCurrentPath([]);
                }
            },
        })
    ).current;

    const handleStartDrawing = () => {
        setPhase('drawing');
        setTimeLeft(roundTime);
        setPaths([]);
    };

    const handleGuessed = (correct) => {
        clearInterval(timerRef.current);
        if (correct) {
            setScores(prev => ({
                ...prev,
                [players[currentPlayerIndex]]: prev[players[currentPlayerIndex]] + 1
            }));
        }
        setPhase('result');
    };

    const handleNext = () => {
        const nextIndex = (currentPlayerIndex + 1) % players.length;
        if (nextIndex === 0) {
            setRoundNumber(prev => prev + 1);
        }
        setCurrentPlayerIndex(nextIndex);
        setPhase('reveal');
        setPaths([]);
        setCurrentPath([]);
    };

    const handleEndGame = () => {
        navigation.replace('DrawGuessResult', {
            players,
            scores,
            rounds: roundNumber,
        });
    };

    const clearCanvas = () => {
        setPaths([]);
    };

    const currentPlayer = players[currentPlayerIndex];

    // ========================
    // REVEAL PHASE
    // ========================
    if (phase === 'reveal') {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                    <ScrollView contentContainerStyle={styles.centerContent}>
                        <View style={styles.badge}>
                            <Text style={[styles.badgeText, isKurdish && styles.kurdishFont]}>
                                {t('common.round', language)} {roundNumber}
                            </Text>
                        </View>

                        <Text style={[styles.label, isKurdish && styles.kurdishFont]}>
                            {t('common.passPhoneTo', language)}
                        </Text>
                        <Text style={[styles.playerName, isKurdish && styles.kurdishFont]}>{currentPlayer}</Text>

                        <GlassCard intensity={30} style={styles.wordCard}>
                            <Text style={[styles.wordLabel, isKurdish && styles.kurdishFont]}>
                                {t('common.yourWord', language)}
                            </Text>
                            <Text style={[styles.wordText, isKurdish && styles.kurdishFont]}>{currentWord}</Text>
                        </GlassCard>

                        <Text style={[styles.instruction, isKurdish && styles.kurdishFont]}>
                            {isKurdish
                                ? `ڕێگەمەدە کەسەکانی‌تر بیبینن!\nتۆ ${roundTime} چرکەت هەیە بۆ وێنەکێشان.`
                                : `Don't let others see!\nYou have ${roundTime} seconds to draw.`
                            }
                        </Text>

                        <Button
                            title={t('drawGuess.draw', language)}
                            onPress={handleStartDrawing}
                            gradient={[COLORS.accent.info, COLORS.accent.info]}
                            icon={<Ionicons name="brush" size={20} color="#FFF" />}
                            isKurdish={isKurdish}
                        />
                    </ScrollView>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    // ========================
    // DRAWING PHASE
    // ========================
    if (phase === 'drawing') {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                    {/* Header */}
                    <View style={[styles.drawHeader, { flexDirection: rowDirection }]}>
                        <View style={[styles.timerBadge, { flexDirection: rowDirection }]}>
                            <Ionicons
                                name="time"
                                size={18}
                                color={timeLeft <= 10 ? COLORS.accent.danger : COLORS.text.primary}
                            />
                            <Text style={[
                                styles.timerText,
                                timeLeft <= 10 && styles.timerDanger
                            ]}>{timeLeft}{isKurdish ? 'چ' : 's'}</Text>
                        </View>

                        <TouchableOpacity style={styles.clearBtn} onPress={clearCanvas}>
                            <Ionicons name="trash" size={20} color={COLORS.accent.danger} />
                        </TouchableOpacity>
                    </View>

                    {/* Canvas */}
                    <View style={styles.canvasContainer} {...panResponder.panHandlers}>
                        <Svg width={CANVAS_SIZE} height={CANVAS_SIZE}>
                            {paths.map((path, index) => (
                                <Path
                                    key={index}
                                    d={path.d}
                                    stroke={path.color}
                                    strokeWidth={4}
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            ))}
                            {currentPath.length > 0 && (
                                <Path
                                    d={currentPath.join(' ')}
                                    stroke={currentColor}
                                    strokeWidth={4}
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            )}
                        </Svg>
                    </View>

                    {/* Color Picker */}
                    <View style={[styles.colorPicker, { flexDirection: rowDirection }]}>
                        {DRAW_COLORS.map((color) => (
                            <TouchableOpacity
                                key={color}
                                style={[
                                    styles.colorBtn,
                                    { backgroundColor: color },
                                    currentColor === color && styles.colorBtnSelected
                                ]}
                                onPress={() => setCurrentColor(color)}
                            />
                        ))}
                    </View>

                    {/* Actions */}
                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={[styles.guessBtn, { flexDirection: rowDirection }]}
                            onPress={() => handleGuessed(true)}
                        >
                            <Ionicons name="checkmark-circle" size={24} color={COLORS.accent.success} />
                            <Text style={[styles.guessBtnText, isKurdish && styles.kurdishFont]}>
                                {t('drawGuess.someoneGuessed', language)}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    // ========================
    // RESULT PHASE
    // ========================
    if (phase === 'result') {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                    <ScrollView contentContainerStyle={styles.centerContent}>
                        <View style={styles.resultBanner}>
                            <Ionicons name="brush" size={48} color={COLORS.accent.info} />
                            <Text style={[styles.resultTitle, isKurdish && styles.kurdishFont]}>
                                {t('drawGuess.roundComplete', language)}
                            </Text>
                            <Text style={[styles.wordReveal, isKurdish && styles.kurdishFont]}>
                                {t('drawGuess.theWordWas', language)}
                                <Text style={styles.wordHighlight}>{currentWord}</Text>
                            </Text>
                        </View>

                        {/* Scores */}
                        <GlassCard intensity={20} style={styles.scoresCard}>
                            <Text style={[styles.scoresTitle, isKurdish && styles.kurdishFont, { textAlign }]}>
                                {isKurdish ? 'خاڵەکانی ئێستا' : 'Current Scores'}
                            </Text>
                            {Object.entries(scores)
                                .sort(([, a], [, b]) => b - a)
                                .map(([name, score]) => (
                                    <View key={name} style={[styles.scoreRow, { flexDirection: rowDirection }]}>
                                        <Text style={[styles.scoreName, isKurdish && styles.kurdishFont]}>{name}</Text>
                                        <Text style={styles.scoreValue}>{score}</Text>
                                    </View>
                                ))
                            }
                        </GlassCard>

                        <View style={styles.actionButtons}>
                            <Button
                                title={t('drawGuess.nextRound', language)}
                                onPress={handleNext}
                                gradient={[COLORS.accent.info, COLORS.accent.info]}
                                icon={<Ionicons name={isKurdish ? "arrow-back" : "arrow-forward"} size={20} color="#FFF" />}
                                style={{ marginBottom: SPACING.md }}
                                isKurdish={isKurdish}
                            />
                            <TouchableOpacity style={styles.endGameBtn} onPress={handleEndGame}>
                                <Text style={[styles.endGameText, isKurdish && styles.kurdishFont]}>
                                    {t('drawGuess.endGameResults', language)}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    centerContent: {
        flexGrow: 1,
        alignItems: 'center',
        padding: SPACING.xl,
        justifyContent: 'center',
        paddingBottom: 100,
    },
    badge: {
        backgroundColor: COLORS.background.card,
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 100,
        marginBottom: 32
    },
    badgeText: { color: COLORS.text.secondary, ...FONTS.medium, fontSize: 13 },
    label: { color: COLORS.text.secondary, ...FONTS.medium, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
    playerName: { color: COLORS.text.primary, ...FONTS.large, fontSize: 36, marginBottom: 32, textAlign: 'center' },
    wordCard: {
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.accent.info,
        alignItems: 'center',
    },
    wordLabel: { color: COLORS.accent.info, ...FONTS.medium, marginBottom: 8 },
    wordText: { color: COLORS.text.primary, ...FONTS.large, fontSize: 32 },
    instruction: { color: COLORS.text.muted, textAlign: 'center', marginBottom: 32, lineHeight: 24 },

    // Drawing Phase
    drawHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
    },
    timerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: COLORS.background.card,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    timerText: { color: COLORS.text.primary, ...FONTS.bold, fontSize: 18 },
    timerDanger: { color: COLORS.accent.danger },
    clearBtn: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: COLORS.background.card,
        alignItems: 'center', justifyContent: 'center',
    },
    canvasContainer: {
        width: CANVAS_SIZE,
        height: CANVAS_SIZE,
        backgroundColor: 'rgba(255,255,255,0.05)', // Semi-transparent for glass effect
        borderRadius: BORDER_RADIUS.lg,
        alignSelf: 'center',
        marginVertical: SPACING.md,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    colorPicker: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        paddingVertical: SPACING.md,
    },
    colorBtn: {
        width: 36, height: 36, borderRadius: 18,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    colorBtnSelected: {
        borderColor: '#FFF',
        transform: [{ scale: 1.2 }],
    },
    actionRow: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.lg,
    },
    guessBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 2,
        borderColor: COLORS.accent.success,
    },
    guessBtnText: { color: COLORS.accent.success, ...FONTS.medium },

    // Result Phase
    resultBanner: {
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    resultTitle: { color: COLORS.text.primary, ...FONTS.large, marginTop: SPACING.md },
    wordReveal: { color: COLORS.text.muted, marginTop: 8 },
    wordHighlight: { color: COLORS.accent.info, ...FONTS.bold },
    scoresCard: {
        width: '100%',
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
    },
    scoresTitle: { color: COLORS.text.muted, fontSize: 12, textTransform: 'uppercase', marginBottom: SPACING.md },
    scoreRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.background.border,
    },
    scoreName: { color: COLORS.text.primary, ...FONTS.medium },
    scoreValue: { color: COLORS.accent.success, ...FONTS.bold },
    actionButtons: { width: '100%' },
    endGameBtn: { alignSelf: 'center', padding: SPACING.sm },
    endGameText: { color: COLORS.accent.danger, ...FONTS.medium },
    kurdishFont: { fontFamily: 'Rabar' },
});
