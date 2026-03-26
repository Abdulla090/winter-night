import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, SafeAreaView, TouchableOpacity, useWindowDimensions } from 'react-native';
import Svg, { Line, Path, Circle as SvgCircle, Defs, LinearGradient as SvgGrad, Stop, G } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue, useAnimatedStyle, withSpring, withTiming,
    withSequence, withDelay, runOnJS, Easing
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Dices } from 'lucide-react-native';

import { AnimatedScreen, BackButton } from '../../components';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

// ───────── BOARD CONFIG ─────────
const COLS = 10;
const ROWS = 10;
const TOTAL = 100;

const LADDERS = { 4: 14, 9: 31, 20: 38, 28: 84, 40: 59, 51: 67, 63: 81, 71: 91 };
const SNAKES = { 17: 7, 54: 34, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 99: 78 };

// Dice faces
const DICE_DOTS = {
    1: [[50, 50]],
    2: [[25, 25], [75, 75]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[25, 25], [75, 25], [25, 75], [75, 75]],
    5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
    6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]],
};

// Colors
const B_COLORS = {
    cellEvenLight: '#FFFBEB',
    cellOddLight: '#FDE68A',
    cellEvenDark: '#1E293B',
    cellOddDark: '#0F172A',
};

// ───────── HELPER ─────────
const getCenter = (pos, cellSize) => {
    if (pos < 1) pos = 1;
    if (pos > TOTAL) pos = TOTAL;
    const idx = pos - 1;
    const row = Math.floor(idx / COLS);
    const colRaw = idx % COLS;
    const col = row % 2 === 0 ? colRaw : (COLS - 1) - colRaw;
    return {
        x: col * cellSize + cellSize / 2,
        y: (ROWS - 1 - row) * cellSize + cellSize / 2,
    };
};

// ───────── SVG ART ─────────
function SnakeSVG({ from, to, cellSize }) {
    const start = getCenter(from, cellSize);
    const end = getCenter(to, cellSize);
    const midY = (start.y + end.y) / 2;
    // S-curve for the snake body
    const dist = Math.abs(end.y - start.y);
    const dx = (end.x > start.x ? 1 : -1) * (dist * 0.3);
    
    // Create curving path from head (start) to tail (end)
    const curve = `M ${start.x} ${start.y} C ${start.x + dx} ${start.y + dist * 0.25}, ${end.x - dx} ${midY}, ${start.x} ${midY} S ${end.x + dx} ${end.y - dist * 0.25}, ${end.x} ${end.y}`;

    return (
        <G>
            <Defs>
                <SvgGrad id={`snakeGrad-${from}`} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#16A34A" />   {/* Green Head */}
                    <Stop offset="1" stopColor="#84CC16" />   {/* Lime Tail */}
                </SvgGrad>
            </Defs>
            {/* Shadow */}
            <Path d={curve} stroke="rgba(0,0,0,0.3)" strokeWidth={cellSize * 0.35} fill="none" strokeLinecap="round" />
            
            {/* Outline */}
            <Path d={curve} stroke="#064E3B" strokeWidth={cellSize * 0.3} fill="none" strokeLinecap="round" />
            
            {/* Inner Body */}
            <Path d={curve} stroke={`url(#snakeGrad-${from})`} strokeWidth={cellSize * 0.22} fill="none" strokeLinecap="round" />
            
            {/* Belly Scales (Dashed) */}
            <Path d={curve} stroke="#4ADE80" strokeWidth={cellSize * 0.12} fill="none" strokeLinecap="round" strokeDasharray="4,6" />

            {/* Head */}
            <SvgCircle cx={start.x} cy={start.y} r={cellSize * 0.25} fill="#16A34A" stroke="#064E3B" strokeWidth={2} />
            
            {/* Eyes */}
            <SvgCircle cx={start.x - cellSize*0.1} cy={start.y - cellSize*0.05} r={cellSize*0.06} fill="#FFF" />
            <SvgCircle cx={start.x + cellSize*0.1} cy={start.y - cellSize*0.05} r={cellSize*0.06} fill="#FFF" />
            <SvgCircle cx={start.x - cellSize*0.1} cy={start.y - cellSize*0.05} r={cellSize*0.02} fill="#000" />
            <SvgCircle cx={start.x + cellSize*0.1} cy={start.y - cellSize*0.05} r={cellSize*0.02} fill="#000" />
            
            {/* Forked Tongue */}
            <Path d={`M ${start.x} ${start.y - cellSize*0.25} L ${start.x} ${start.y - cellSize*0.4} M ${start.x} ${start.y - cellSize*0.4} L ${start.x - 3} ${start.y - cellSize*0.5} M ${start.x} ${start.y - cellSize*0.4} L ${start.x + 3} ${start.y - cellSize*0.5}`} 
                  stroke="#DC2626" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </G>
    );
}

function LadderSVG({ from, to, cellSize }) {
    const start = getCenter(from, cellSize);
    const end = getCenter(to, cellSize);
    
    const dx = cellSize * 0.15; // Rail offset
    const steps = Math.max(3, Math.floor(Math.abs(end.y - start.y) / (cellSize * 0.5)));
    
    const rails = [];
    const rungs = [];

    // Left Rail (shadow + wood)
    rails.push(<Line key="ls" x1={start.x - dx} y1={start.y} x2={end.x - dx} y2={end.y} stroke="rgba(0,0,0,0.3)" strokeWidth={cellSize*0.18} strokeLinecap="round" />);
    rails.push(<Line key="l" x1={start.x - dx} y1={start.y} x2={end.x - dx} y2={end.y} stroke="#B45309" strokeWidth={cellSize*0.12} strokeLinecap="round" />);
    // Right Rail
    rails.push(<Line key="rs" x1={start.x + dx} y1={start.y} x2={end.x + dx} y2={end.y} stroke="rgba(0,0,0,0.3)" strokeWidth={cellSize*0.18} strokeLinecap="round" />);
    rails.push(<Line key="r" x1={start.x + dx} y1={start.y} x2={end.x + dx} y2={end.y} stroke="#B45309" strokeWidth={cellSize*0.12} strokeLinecap="round" />);

    // Rungs
    for (let i = 1; i < steps; i++) {
        const t = i / steps;
        const rx = start.x + (end.x - start.x) * t;
        const ry = start.y + (end.y - start.y) * t;
        rungs.push(
            <Line key={`rung-${i}-s`} x1={rx - dx} y1={ry + 2} x2={rx + dx} y2={ry + 2} stroke="rgba(0,0,0,0.2)" strokeWidth={cellSize*0.08} strokeLinecap="round" />
        );
        rungs.push(
            <Line key={`rung-${i}`} x1={rx - dx} y1={ry} x2={rx + dx} y2={ry} stroke="#D97706" strokeWidth={cellSize*0.08} strokeLinecap="round" />
        );
    }
    return <G>{rails}{rungs}</G>;
}

// ───────── ANIMATED PAWN ─────────
function Pawn({ position, color, name, offset = 0, cellSize }) {
    const animX = useSharedValue(0);
    const animY = useSharedValue(0);
    const bounceScale = useSharedValue(1);
    
    const prev = React.useRef(position);

    useEffect(() => {
        const { x, y } = getCenter(position, cellSize);
        const radius = cellSize * 0.4;
        const targetX = x - radius + offset;
        const targetY = y - radius + offset * 0.5;

        // Custom Trajectory detection based on distance moved
        if (prev.current > position && prev.current - position > 5) {
            // SNAKE SLIDE! (S-Curve path matching the SVG)
            const { x: oldX, y: oldY } = getCenter(prev.current, cellSize);
            const dist = Math.abs(y - oldY);
            const dx = (x > oldX ? 1 : -1) * (dist * 0.3);

            animY.value = withTiming(targetY, { duration: 1200, easing: Easing.inOut(Easing.cubic) });
            animX.value = withSequence(
                withTiming(oldX + dx - radius + offset, { duration: 600, easing: Easing.out(Easing.ease) }),
                withTiming(targetX, { duration: 600, easing: Easing.inOut(Easing.ease) })
            );
            
            bounceScale.value = withSequence(
                withTiming(1.2, { duration: 200 }),
                withDelay(1000, withTiming(1.4, { duration: 150 })),
                withDelay(1150, withSpring(1))
            );
        } else if (position > prev.current && position - prev.current > 5) {
            // LADDER CLIMB! (Straight smooth line up)
            animY.value = withTiming(targetY, { duration: 1000, easing: Easing.out(Easing.ease) });
            animX.value = withTiming(targetX, { duration: 1000, easing: Easing.out(Easing.ease) });
            bounceScale.value = withSequence(
                withTiming(1.2, { duration: 100 }),
                withDelay(900, withSpring(1))
            );
        } else {
            // NORMAL STEP (Hops precisely step-by-step)
            animX.value = withSpring(targetX, { damping: 14, stiffness: 120 });
            animY.value = withSpring(targetY, { damping: 14, stiffness: 120 });
            
            bounceScale.value = withSequence(
                withTiming(1.4, { duration: 150 }),
                withSpring(1, { damping: 6, stiffness: 200 })
            );
        }

        prev.current = position;
    }, [position, cellSize]);

    const animStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: animX.value },
            { translateY: animY.value },
            { scale: bounceScale.value },
        ],
    }));

    const size = cellSize * 0.8;

    return (
        <Animated.View style={[st.pawnWrap, animStyle, { width: size, height: size }]}>
            {/* 3D Pin representation */}
            <View style={[st.pawnBody, { backgroundColor: color, shadowColor: color }]}>
                <View style={st.pawnHighlight} />
                <Text style={[st.pawnText, { fontSize: size * 0.4 }]}>{name?.[0]}</Text>
            </View>
        </Animated.View>
    );
}

// ───────── DICE COMPONENT ─────────
function DiceFace({ value, color, rolling }) {
    const rotation = useSharedValue(0);
    const scale = useSharedValue(1);

    useEffect(() => {
        if (rolling) {
            rotation.value = withSequence(
                withTiming(180, { duration: 150 }),
                withTiming(360, { duration: 150 }),
                withTiming(720, { duration: 250, easing: Easing.out(Easing.ease) })
            );
            scale.value = withSequence(
                withTiming(1.2, { duration: 200 }),
                withSpring(1, { damping: 10, stiffness: 200 })
            );
        } else {
            rotation.value = 0; // reset
        }
    }, [rolling, value]);

    const style = useAnimatedStyle(() => ({
        transform: [{ rotateZ: `${rotation.value}deg` }, { scale: scale.value }],
    }));

    const dots = DICE_DOTS[value] || DICE_DOTS[1];

    return (
        <Animated.View style={[st.dice, style, { borderColor: color }]}>
            <View style={st.diceInner}>
                <Svg width="100%" height="100%" viewBox="0 0 100 100">
                    {dots.map(([cx, cy], i) => (
                        <SvgCircle key={i} cx={cx} cy={cy} r={10} fill="#0F172A" />
                    ))}
                </Svg>
            </View>
        </Animated.View>
    );
}

// ═══════════ MAIN SCREEN ═══════════
export default function PlayScreen({ route, navigation }) {
    const { players: initialPlayers } = route.params;
    const { isKurdish } = useLanguage();
    const { colors, isDark, isRTL } = useTheme();
    
    // Compute strictly bounded board sizes
    const { width } = useWindowDimensions();
    const boardPadding = 16;
    const maxBoardSize = Math.min(width - (boardPadding * 2), 480); // Cap at 480px for tablets
    const cellSize = Math.floor(maxBoardSize / COLS);
    const actualBoardSize = cellSize * COLS;

    const [players, setPlayers] = useState(() => 
        initialPlayers.map((p, i) => {
            const isObj = typeof p === 'object' && p !== null;
            return {
                id: isObj ? (p.id || String(i)) : String(i),
                name: isObj ? p.name : p,
                color: isObj && p.color ? p.color : ['#EF4444', '#3B82F6', '#10B981', '#F59E0B'][i % 4],
                position: 1,
                offset: (i * 4) - 4
            };
        })
    );
    const [turn, setTurn] = useState(0);
    const [diceVal, setDiceVal] = useState(1);
    const [isRolling, setIsRolling] = useState(false);
    const [status, setStatus] = useState('');

    const rowDir = isRTL ? 'row-reverse' : 'row';

    useEffect(() => {
        setStatus(isKurdish ? `نۆرەی دیاریکراوە: ${players[0].name}` : `${players[0].name}'s Turn`);
    }, []);

    const rollDice = useCallback(() => {
        if (isRolling) return;
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        
        setIsRolling(true);
        setStatus(isKurdish ? 'زار لێ دەدرێت...' : 'Rolling...');

        setTimeout(() => {
            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            const roll = Math.floor(Math.random() * 6) + 1;
            setDiceVal(roll);
            setStatus(isKurdish ? `${roll} هێنا!` : `Rolled a ${roll}!`);
            
            // Allow user to see the dice number for half a second before piece moves
            setTimeout(() => {
                movePlayer(roll);
            }, 600);
        }, 600);
    }, [isRolling, turn, players]);

    const movePlayer = (roll) => {
        const cp = players[turn];
        
        setStatus(isKurdish ? `${cp.name} دەڕوات...` : `${cp.name} is walking...`);

        // Walk cell-by-cell smoothly
        let step = cp.position;
        let stepCount = 0;
        // Big rolls move faster, small rolls move slower for feel
        const delayPerStep = Math.max(220, 450 - (roll * 35));

        const walkStep = () => {
            stepCount++;
            step++;
            
            // Rebound if passing 100
            const bouncePos = step > 100 ? 100 - (step - 100) : step;
            
            setPlayers(prev => {
                const copy = [...prev];
                copy[turn] = { ...copy[turn], position: bouncePos };
                return copy;
            });

            if (stepCount < roll) {
                setTimeout(walkStep, delayPerStep);
            } else {
                setTimeout(() => checkSpecials(bouncePos, roll), 400);
            }
        };

        walkStep();
    };

    const updatePos = (pos, cb, animationDelay = 600) => {
        setPlayers(prev => {
            const copy = [...prev];
            copy[turn] = { ...copy[turn], position: pos };
            return copy;
        });
        setTimeout(cb, animationDelay);
    };

    const checkSpecials = (pos, roll) => {
        if (LADDERS[pos]) {
            if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setStatus(isKurdish ? `پەیژە! بەرزدەبێتەوە!` : `Ladder! Going up!`);
            // Wait 1200ms for the climbing animation
            updatePos(LADDERS[pos], () => checkWin(LADDERS[pos], roll), 1200);
        } else if (SNAKES[pos]) {
            if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            setStatus(isKurdish ? `مار! داکەوتن!` : `Snake! Going down!`);
            // Wait 1400ms for the S-curve slide
            updatePos(SNAKES[pos], () => checkWin(SNAKES[pos], roll), 1400);
        } else {
            checkWin(pos, roll);
        }
    };

    const checkWin = (pos, roll) => {
        if (pos === 100) {
            if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setStatus(isKurdish ? `براوە کارت پێ دەدات!` : `Winner!`);
            setTimeout(() => navigation.replace('ZarWMarResult', { winner: players[turn], players }), 1200);
        } else {
            endTurn(roll);
        }
    };

    const endTurn = (roll) => {
        if (roll === 6) {
            setStatus(isKurdish ? '٦ت هێنا! جارێکی تر لێبدە!' : 'Rolled 6! Roll again!');
            setIsRolling(false);
        } else {
            setTimeout(() => {
                const next = (turn + 1) % players.length;
                setTurn(next);
                setStatus(isKurdish ? `نۆرەی دیاریکراوە: ${players[next].name}` : `${players[next].name}'s Turn`);
                setIsRolling(false);
            }, 800);
        }
    };

    const renderGrid = () => {
        const cells = [];
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const isEven = r % 2 === 0;
                const cellId = (ROWS - r - 1) * COLS + (isEven ? (COLS - c) : (c + 1));
                
                let bg;
                if ((r + c) % 2 === 0) bg = isDark ? B_COLORS.cellEvenDark : B_COLORS.cellEvenLight;
                else bg = isDark ? B_COLORS.cellOddDark : B_COLORS.cellOddLight;

                if (cellId === 100) bg = '#BBF7D0';

                cells.push(
                    <View key={cellId} style={[
                        st.gridCell,
                        { width: '10%', height: '10%', backgroundColor: bg }
                    ]}>
                        <Text style={[st.cellNum, { color: isDark ? '#64748B' : '#94A3B8' }]}>{cellId}</Text>
                        {cellId === 100 && <Text style={st.cellIcon}>👑</Text>}
                    </View>
                );
            }
        }
        return cells;
    };

    const cp = players[turn];

    return (
        <AnimatedScreen noPadding noTopPadding>
            <LinearGradient
                colors={isDark ? ['#040B16', '#0F172A'] : ['#F8FAFC', '#E2E8F0']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={st.safeArea}>
                {/* Header */}
                <View style={[st.header, { flexDirection: rowDir }]}>
                    <BackButton onPress={() => navigation.goBack()} />
                    <Text style={[st.headerTitle, { color: colors.text.primary }, isKurdish && st.kf]}>
                        {isKurdish ? 'زار و مار' : 'Snakes & Ladders'}
                    </Text>
                    <View style={{ width: 44 }} />
                </View>

                {/* Score / Player Bar */}
                <View style={[st.playersBar, { flexDirection: rowDir }]}>
                    {players.map((p, i) => (
                        <View key={p.id} style={[
                            st.pBadge,
                            turn === i && { backgroundColor: p.color + '25', borderColor: p.color }
                        ]}>
                            <View style={[st.pDot, { backgroundColor: p.color }]} />
                            <Text style={[st.pName, { color: turn === i ? colors.text.primary : colors.text.muted }, isKurdish && st.kf]}>
                                {p.name}
                            </Text>
                            <Text style={[st.pPos, { color: p.color }]}>{p.position}</Text>
                        </View>
                    ))}
                </View>

                {/* Status Bar */}
                <View style={[st.statusWrap, { backgroundColor: isDark ? '#1E293B' : '#FFF' }]}>
                    <Text style={[st.statusText, { color: colors.text.primary }, isKurdish && st.kf]}>
                        {status}
                    </Text>
                </View>

                {/* Board Area */}
                <View style={st.boardContainer}>
                    <View style={[
                        st.boardInner,
                        { 
                            width: actualBoardSize, 
                            height: actualBoardSize,
                            borderColor: isDark ? '#334155' : '#CBD5E1'
                        }
                    ]}>
                        <View style={st.cellsWrapper}>{renderGrid()}</View>

                        <Svg width={actualBoardSize} height={actualBoardSize} style={StyleSheet.absoluteFill}>
                            {Object.entries(LADDERS).map(([from, to]) => (
                                <LadderSVG key={`lad-${from}`} from={+from} to={+to} cellSize={cellSize} />
                            ))}
                            {Object.entries(SNAKES).map(([from, to]) => (
                                <SnakeSVG key={`snk-${from}`} from={+from} to={+to} cellSize={cellSize} />
                            ))}
                        </Svg>

                        {/* Pawns Overlay */}
                        <View style={StyleSheet.absoluteFill} pointerEvents="none">
                            {players.map(p => (
                                <Pawn key={p.id} position={p.position} color={p.color} name={p.name} offset={p.offset} cellSize={cellSize} />
                            ))}
                        </View>
                    </View>
                </View>

                {/* Footer Controls */}
                <View style={[st.footer, { flexDirection: rowDir }]}>
                    <DiceFace value={diceVal} color={cp.color} rolling={isRolling} />
                    
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={rollDice}
                        disabled={isRolling}
                        style={[
                            st.rollBtn,
                            { backgroundColor: isRolling ? (isDark ? '#475569' : '#CBD5E1') : cp.color }
                        ]}
                    >
                        <Dices size={24} color="#FFF" />
                        <Text style={[st.rollBtnText, isKurdish && st.kf]}>
                            {isRolling ? (isKurdish ? 'بەڕێوەیە...' : 'Rolling...') : (isKurdish ? 'لێدان' : 'ROLL')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </AnimatedScreen>
    );
}

const st = StyleSheet.create({
    safeArea: { flex: 1 },
    kf: { fontFamily: 'Rabar' },

    header: { paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center', justifyContent: 'space-between' },
    headerTitle: { fontSize: 20, fontWeight: '800' },

    playersBar: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingHorizontal: 12, paddingBottom: 6 },
    pBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, borderWidth: 1.5, borderColor: 'transparent' },
    pDot: { width: 10, height: 10, borderRadius: 5 },
    pName: { fontSize: 13, fontWeight: '700' },
    pPos: { fontSize: 13, fontWeight: '900' },

    statusWrap: { alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
    statusText: { fontSize: 15, fontWeight: '800' },

    boardContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    boardInner: { position: 'relative', borderWidth: 3, borderRadius: 8, overflow: 'hidden', backgroundColor: 'transparent', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 10 },
    cellsWrapper: { flexDirection: 'row', flexWrap: 'wrap', width: '100%', height: '100%' },
    gridCell: { alignItems: 'flex-start', justifyContent: 'flex-end', padding: 2, borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(0,0,0,0.08)' },
    cellNum: { fontSize: 8, fontWeight: '800' },
    cellIcon: { position: 'absolute', top: 4, right: 4, fontSize: 12 },

    pawnWrap: { position: 'absolute', top: 0, left: 0 },
    pawnBody: { flex: 1, borderRadius: 99, borderWidth: 2, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 4, elevation: 6 },
    pawnHighlight: { position: 'absolute', top: '10%', left: '20%', width: '30%', height: '30%', borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.4)' },
    pawnText: { color: '#FFF', fontWeight: '900' },

    footer: { paddingHorizontal: 20, paddingBottom: 20, paddingTop: 10, alignItems: 'center', gap: 16 },
    dice: { width: 64, height: 64, borderRadius: 16, backgroundColor: '#FFF', borderWidth: 3, padding: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
    diceInner: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 10 },
    
    rollBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
    rollBtnText: { color: '#FFF', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
});
