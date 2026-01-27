import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import {
    Eraser,
    Undo2,
    Clock,
    Eye,
    EyeOff,
    Users,
    ChevronRight,
    CheckCircle,
} from 'lucide-react-native';

import { AnimatedScreen } from '../../components/AnimatedScreen';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');
const CANVAS_WIDTH = width - 32;
const CANVAS_HEIGHT = CANVAS_WIDTH * 0.65;
const DRAW_TIME = 10;
const VOTE_TIME = 30;

const COLORS = ['#000000', '#EF4444', '#F97316', '#10B981', '#3B82F6', '#8B5CF6'];

// ============================================
// READY SCREEN - Just name, NO impostor hint!
// ============================================
const ReadyScreen = ({ player, playerIndex, totalPlayers, onReady, isKurdish, colors }) => (
    <View style={styles.readyContainer}>
        <Text style={styles.playerNum}>{playerIndex + 1} / {totalPlayers}</Text>

        <View style={[styles.avatar, { backgroundColor: player.color }]}>
            <Text style={styles.avatarText}>{player.name.charAt(0)}</Text>
        </View>

        <Text style={[styles.playerName, { color: colors.text.primary }]}>{player.name}</Text>

        <Text style={[styles.turnText, { color: colors.text.secondary }]}>
            {isKurdish ? 'نۆرەی تۆیە بۆ کێشان' : "Your turn to draw"}
        </Text>

        <TouchableOpacity onPress={onReady} style={styles.goBtn} activeOpacity={0.8}>
            <LinearGradient colors={['#D900FF', '#7000FF']} style={styles.goBtnInner}>
                <Text style={styles.goBtnText}>{isKurdish ? 'دەستپێبکە' : 'GO'}</Text>
            </LinearGradient>
        </TouchableOpacity>
    </View>
);

// ============================================
// DRAWING PHASE - Just player name and timer
// ============================================
const DrawingPhase = ({
    player,
    playerIndex,
    totalPlayers,
    timeLeft,
    strokes,
    currentStroke,
    brushColor,
    isEraser,
    showColors,
    setShowColors,
    setBrushColor,
    setIsEraser,
    onUndo,
    panHandlers,
    colors,
    isDark,
}) => (
    <View style={styles.drawContainer}>
        <View style={styles.drawHeader}>
            <View style={[styles.nameBadge, { backgroundColor: player.color }]}>
                <Text style={styles.nameBadgeText}>{player.name}</Text>
                <Text style={styles.nameBadgeSub}>{playerIndex + 1}/{totalPlayers}</Text>
            </View>
            <View style={[styles.timer, { backgroundColor: timeLeft <= 3 ? '#EF4444' : '#10B981' }]}>
                <Clock size={14} color="#FFF" />
                <Text style={styles.timerText}>{timeLeft}s</Text>
            </View>
        </View>

        <View style={[styles.canvas, { backgroundColor: isDark ? '#1E1E2E' : '#FFF' }]} {...panHandlers}>
            <Svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
                {strokes.map((s, i) => (
                    <Path key={i} d={s.path} stroke={s.color} strokeWidth={s.size} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                ))}
                {currentStroke && (
                    <Path d={currentStroke} stroke={isEraser ? (isDark ? '#1E1E2E' : '#FFF') : brushColor} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                )}
            </Svg>
        </View>

        <View style={styles.tools}>
            <TouchableOpacity style={[styles.tool, showColors && styles.toolOn]} onPress={() => setShowColors(!showColors)}>
                <View style={[styles.colorDot, { backgroundColor: brushColor }]} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tool, isEraser && styles.toolOn]} onPress={() => setIsEraser(!isEraser)}>
                <Eraser size={18} color={isEraser ? '#D900FF' : '#FFF'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.tool} onPress={onUndo}>
                <Undo2 size={18} color="#FFF" />
            </TouchableOpacity>
        </View>

        {showColors && (
            <View style={[styles.colorRow, { backgroundColor: isDark ? '#1A1A2E' : '#FFF' }]}>
                {COLORS.map(c => (
                    <TouchableOpacity key={c} onPress={() => { setBrushColor(c); setShowColors(false); setIsEraser(false); }}>
                        <View style={[styles.colorItem, { backgroundColor: c }, brushColor === c && styles.colorItemOn]} />
                    </TouchableOpacity>
                ))}
            </View>
        )}
    </View>
);

// ============================================
// ALL DONE - Button to go to voting
// ============================================
const AllDoneScreen = ({ strokes, onGoToVoting, isKurdish, colors, isDark }) => (
    <View style={styles.doneContainer}>
        <CheckCircle size={60} color="#10B981" />

        <Text style={[styles.doneTitle, { color: colors.text.primary }]}>
            {isKurdish ? 'کێشان تەواو بوو!' : 'Drawing Complete!'}
        </Text>

        <Text style={[styles.doneDesc, { color: colors.text.secondary }]}>
            {isKurdish ? 'هەموو یاریزانەکان کێشانیان تەواو کرد' : 'All players have finished drawing'}
        </Text>

        {/* Show final drawing */}
        <View style={[styles.doneCanvas, { backgroundColor: isDark ? '#1E1E2E' : '#FFF' }]}>
            <Svg width="100%" height="100%" viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`} preserveAspectRatio="xMidYMid meet">
                {strokes.map((s, i) => (
                    <Path key={i} d={s.path} stroke={s.color} strokeWidth={s.size} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                ))}
            </Svg>
        </View>

        <TouchableOpacity onPress={onGoToVoting} style={styles.votingBtn} activeOpacity={0.8}>
            <LinearGradient colors={['#D900FF', '#7000FF']} style={styles.votingBtnInner}>
                <Text style={styles.votingBtnText}>
                    {isKurdish ? 'بڕۆ بۆ دەنگدان' : 'Go to Voting'}
                </Text>
                <ChevronRight size={22} color="#FFF" />
            </LinearGradient>
        </TouchableOpacity>
    </View>
);

// ============================================
// VOTING PAGE - Full page with timer + reveal
// ============================================
const VotingPage = ({ timeLeft, strokes, onReveal, isKurdish, colors, isDark }) => (
    <View style={styles.votingContainer}>
        {/* Big Timer Circle */}
        <View style={[styles.bigTimer, { backgroundColor: timeLeft <= 10 ? '#EF4444' : '#D900FF' }]}>
            <Clock size={28} color="#FFF" />
            <Text style={styles.bigTimerText}>{timeLeft}</Text>
            <Text style={styles.bigTimerLabel}>{isKurdish ? 'چرکە' : 'seconds'}</Text>
        </View>

        <Text style={[styles.votingTitle, { color: colors.text.primary }]}>
            {isKurdish ? 'کاتی گفتوگۆ' : 'Discussion Time'}
        </Text>

        <Text style={[styles.votingDesc, { color: colors.text.secondary }]}>
            {isKurdish
                ? 'باس بکەن و بڕیار بدەن کێ دزەکارە'
                : 'Discuss and decide who is the impostor'}
        </Text>

        {/* Final Canvas */}
        <View style={[styles.votingCanvas, { backgroundColor: isDark ? '#1E1E2E' : '#FFF' }]}>
            <Svg width="100%" height="100%" viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`} preserveAspectRatio="xMidYMid meet">
                {strokes.map((s, i) => (
                    <Path key={i} d={s.path} stroke={s.color} strokeWidth={s.size} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                ))}
            </Svg>
        </View>

        {/* Reveal Button */}
        <TouchableOpacity onPress={onReveal} style={styles.revealBtn} activeOpacity={0.8}>
            <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.revealBtnInner}>
                <Eye size={22} color="#FFF" />
                <Text style={styles.revealBtnText}>
                    {isKurdish ? 'دزەکار پیشان بدە' : 'Reveal Impostor'}
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    </View>
);

// ============================================
// RESULT - Shows who was impostor + word
// ============================================
const ResultScreen = ({ impostor, word, onDone, isKurdish, colors }) => (
    <View style={styles.resultContainer}>
        <View style={styles.resultIcon}>
            <EyeOff size={44} color="#FFF" />
        </View>

        <Text style={[styles.resultLabel, { color: colors.text.secondary }]}>
            {isKurdish ? 'دزەکار:' : 'The Impostor was:'}
        </Text>

        <View style={[styles.resultBadge, { backgroundColor: impostor.color }]}>
            <Text style={styles.resultName}>{impostor.name}</Text>
        </View>

        <Text style={[styles.resultWordLabel, { color: colors.text.secondary }]}>
            {isKurdish ? 'وشەکە:' : 'The word was:'}
        </Text>
        <Text style={[styles.resultWord, { color: colors.text.primary }]}>{word}</Text>

        <TouchableOpacity onPress={onDone} style={styles.doneBtn} activeOpacity={0.8}>
            <LinearGradient colors={['#10B981', '#059669']} style={styles.doneBtnInner}>
                <Text style={styles.doneBtnText}>{isKurdish ? 'تەواو' : 'Done'}</Text>
            </LinearGradient>
        </TouchableOpacity>
    </View>
);

// ============================================
// MAIN
// ============================================
export default function ImpostorDrawPlay({ navigation, route }) {
    const { isKurdish } = useLanguage();
    const { colors, isDark } = useTheme();
    const { players, impostorIndex, word } = route.params;

    // Phases: ready → drawing → allDone → voting → result
    const [phase, setPhase] = useState('ready');
    const [playerIdx, setPlayerIdx] = useState(0);
    const [timeLeft, setTimeLeft] = useState(DRAW_TIME);
    const [brushColor, setBrushColor] = useState('#000000');
    const [isEraser, setIsEraser] = useState(false);
    const [showColors, setShowColors] = useState(false);

    const strokesRef = useRef([]);
    const currentStrokeRef = useRef('');
    const [, forceUpdate] = useState(0);

    const player = players[playerIdx];

    // Timer for drawing and voting
    useEffect(() => {
        if (phase === 'drawing' && timeLeft > 0) {
            const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearTimeout(t);
        } else if (phase === 'drawing' && timeLeft <= 0) {
            finishTurn();
        }

        if (phase === 'voting' && timeLeft > 0) {
            const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearTimeout(t);
        }
    }, [phase, timeLeft]);

    const finishTurn = useCallback(() => {
        if (currentStrokeRef.current) {
            strokesRef.current = [...strokesRef.current, {
                path: currentStrokeRef.current,
                color: isEraser ? (isDark ? '#1E1E2E' : '#FFF') : brushColor,
                size: 6,
            }];
            currentStrokeRef.current = '';
        }

        if (playerIdx < players.length - 1) {
            // Next player
            setPlayerIdx(prev => prev + 1);
            setTimeLeft(DRAW_TIME);
            setPhase('ready');
        } else {
            // All done - go to "all done" screen with button
            setPhase('allDone');
        }
        forceUpdate(n => n + 1);
    }, [playerIdx, players.length, brushColor, isEraser, isDark]);

    const startDrawing = () => {
        setPhase('drawing');
        setTimeLeft(DRAW_TIME);
    };

    const goToVoting = () => {
        setPhase('voting');
        setTimeLeft(VOTE_TIME);
    };

    const revealImpostor = () => {
        setPhase('result');
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (e) => {
                const { locationX, locationY } = e.nativeEvent;
                currentStrokeRef.current = `M${locationX.toFixed(0)},${locationY.toFixed(0)}`;
                forceUpdate(n => n + 1);
            },
            onPanResponderMove: (e) => {
                const { locationX, locationY } = e.nativeEvent;
                currentStrokeRef.current += ` L${locationX.toFixed(0)},${locationY.toFixed(0)}`;
                forceUpdate(n => n + 1);
            },
            onPanResponderRelease: () => {
                if (currentStrokeRef.current) {
                    strokesRef.current = [...strokesRef.current, {
                        path: currentStrokeRef.current,
                        color: isEraser ? (isDark ? '#1E1E2E' : '#FFF') : brushColor,
                        size: 6,
                    }];
                    currentStrokeRef.current = '';
                    forceUpdate(n => n + 1);
                }
            },
        })
    ).current;

    // Update panResponder release handler when colors change
    useEffect(() => {
        panResponder.panHandlers.onResponderRelease = () => {
            if (currentStrokeRef.current) {
                strokesRef.current = [...strokesRef.current, {
                    path: currentStrokeRef.current,
                    color: isEraser ? (isDark ? '#1E1E2E' : '#FFF') : brushColor,
                    size: 6,
                }];
                currentStrokeRef.current = '';
                forceUpdate(n => n + 1);
            }
        };
    }, [brushColor, isEraser, isDark]);

    const handleUndo = () => {
        strokesRef.current = strokesRef.current.slice(0, -1);
        forceUpdate(n => n + 1);
    };

    return (
        <AnimatedScreen>
            <View style={[styles.main, { backgroundColor: isDark ? '#0D0221' : colors.background }]}>
                {phase === 'ready' && (
                    <ReadyScreen
                        player={player}
                        playerIndex={playerIdx}
                        totalPlayers={players.length}
                        onReady={startDrawing}
                        isKurdish={isKurdish}
                        colors={colors}
                    />
                )}

                {phase === 'drawing' && (
                    <DrawingPhase
                        player={player}
                        playerIndex={playerIdx}
                        totalPlayers={players.length}
                        timeLeft={timeLeft}
                        strokes={strokesRef.current}
                        currentStroke={currentStrokeRef.current}
                        brushColor={brushColor}
                        isEraser={isEraser}
                        showColors={showColors}
                        setShowColors={setShowColors}
                        setBrushColor={setBrushColor}
                        setIsEraser={setIsEraser}
                        onUndo={handleUndo}
                        panHandlers={panResponder.panHandlers}
                        colors={colors}
                        isDark={isDark}
                    />
                )}

                {phase === 'allDone' && (
                    <AllDoneScreen
                        strokes={strokesRef.current}
                        onGoToVoting={goToVoting}
                        isKurdish={isKurdish}
                        colors={colors}
                        isDark={isDark}
                    />
                )}

                {phase === 'voting' && (
                    <VotingPage
                        timeLeft={timeLeft}
                        strokes={strokesRef.current}
                        onReveal={revealImpostor}
                        isKurdish={isKurdish}
                        colors={colors}
                        isDark={isDark}
                    />
                )}

                {phase === 'result' && (
                    <ResultScreen
                        impostor={players[impostorIndex]}
                        word={word}
                        onDone={() => navigation.navigate('Home')}
                        isKurdish={isKurdish}
                        colors={colors}
                    />
                )}
            </View>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    main: { flex: 1 },

    // Ready - Just name, no impostor hint
    readyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    playerNum: { color: '#D900FF', fontSize: 14, fontWeight: '700', marginBottom: 20 },
    avatar: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    avatarText: { color: '#FFF', fontSize: 36, fontWeight: '900' },
    playerName: { fontSize: 28, fontWeight: '800', marginBottom: 8 },
    turnText: { fontSize: 16, marginBottom: 32 },
    goBtn: { width: '100%' },
    goBtnInner: { height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
    goBtnText: { color: '#FFF', fontSize: 22, fontWeight: '800' },

    // Drawing
    drawContainer: { flex: 1, alignItems: 'center', paddingTop: 16 },
    drawHeader: { flexDirection: 'row', alignItems: 'center', width: '100%', paddingHorizontal: 16, marginBottom: 12, justifyContent: 'space-between' },
    nameBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
    nameBadgeText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
    nameBadgeSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
    timer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, gap: 6 },
    timerText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
    canvas: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT, borderRadius: 16, borderWidth: 2, borderColor: 'rgba(255,255,255,0.15)' },
    tools: { flexDirection: 'row', marginTop: 20, gap: 16 },
    tool: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
    toolOn: { borderWidth: 2, borderColor: '#D900FF' },
    colorDot: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: '#FFF' },
    colorRow: { flexDirection: 'row', gap: 12, marginTop: 16, padding: 16, borderRadius: 16 },
    colorItem: { width: 40, height: 40, borderRadius: 20 },
    colorItemOn: { borderWidth: 3, borderColor: '#D900FF' },

    // All Done Screen
    doneContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    doneTitle: { fontSize: 26, fontWeight: '800', marginTop: 20, marginBottom: 8 },
    doneDesc: { fontSize: 15, marginBottom: 24 },
    doneCanvas: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT * 0.7, borderRadius: 16, marginBottom: 32, borderWidth: 2, borderColor: 'rgba(255,255,255,0.15)' },
    votingBtn: { width: '100%' },
    votingBtnInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, height: 60, borderRadius: 30 },
    votingBtnText: { color: '#FFF', fontSize: 20, fontWeight: '700' },

    // Voting Page - Full page
    votingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    bigTimer: { width: 140, height: 140, borderRadius: 70, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    bigTimerText: { color: '#FFF', fontSize: 48, fontWeight: '900', marginTop: 4 },
    bigTimerLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' },
    votingTitle: { fontSize: 26, fontWeight: '800', marginBottom: 8 },
    votingDesc: { fontSize: 15, textAlign: 'center', marginBottom: 20 },
    votingCanvas: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT * 0.6, borderRadius: 16, marginBottom: 24, borderWidth: 2, borderColor: 'rgba(255,255,255,0.15)' },
    revealBtn: { width: '100%' },
    revealBtnInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, height: 60, borderRadius: 30 },
    revealBtnText: { color: '#FFF', fontSize: 20, fontWeight: '700' },

    // Result
    resultContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    resultIcon: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    resultLabel: { fontSize: 16, marginBottom: 12 },
    resultBadge: { paddingHorizontal: 36, paddingVertical: 18, borderRadius: 30, marginBottom: 36 },
    resultName: { color: '#FFF', fontSize: 28, fontWeight: '900' },
    resultWordLabel: { fontSize: 15, marginBottom: 6 },
    resultWord: { fontSize: 36, fontWeight: '900', marginBottom: 48 },
    doneBtn: { width: '100%' },
    doneBtnInner: { height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
    doneBtnText: { color: '#FFF', fontSize: 20, fontWeight: '700' },
});
