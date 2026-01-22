import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    runOnJS,
    withDecay
} from 'react-native-reanimated';
import Svg, { Path, G, Text as SvgText } from 'react-native-svg';
import { GradientBackground, Button } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../localization/translations';

const { width } = Dimensions.get('window');
const WHEEL_SIZE = width * 0.9;
const RADIUS = WHEEL_SIZE / 2;
const CENTER = WHEEL_SIZE / 2;

// Colors for segments
const SEGMENT_COLORS = [
    '#ef4444', '#f97316', '#f59e0b', '#84cc16',
    '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6',
    '#d946ef', '#f43f5e'
];

export default function PlayScreen({ navigation, route }) {
    const { options } = route.params;
    const { language, isKurdish } = useLanguage();
    const { theme } = useTheme();

    // Ensure we have enough options to look good (duplicate if needed for visual only? No, just keep logic simple)
    // Actually, wheel math is easier if we just map options directly.

    const [winner, setWinner] = useState(null);
    const [isSpinning, setIsSpinning] = useState(false);

    const rotation = useSharedValue(0);

    const anglePerSegment = 360 / options.length;

    const spinWheel = () => {
        if (isSpinning) return;
        setIsSpinning(true);
        setWinner(null);

        // Random rotation: 5-10 full spins + random offset
        const randomOffset = Math.random() * 360;
        const totalRotation = 360 * 5 + randomOffset;

        // We want to land on a specific index? calculated purely by physics
        const finalAngle = (rotation.value + totalRotation) % 360;

        rotation.value = withTiming(rotation.value + totalRotation, {
            duration: 4000,
            easing: Easing.out(Easing.cubic)
        }, (finished) => {
            if (finished) {
                runOnJS(calculateWinner)(rotation.value);
            }
        });
    };

    const calculateWinner = (finalRotation) => {
        // Normalize angle to 0-360
        const normalizedRotation = finalRotation % 360;

        // The pointer is at 270 degrees (top) or 0 (right)?
        // Let's assume pointer is at TOP (270deg in standard circle, or -90).
        // If we rotate container clockwise, the segment at TOP changes.

        // Easier math: 
        // pointer is fixed at top.
        // degrees rotated = normalizedRotation.
        // Top index = ?

        // If 0 rotation => Index 0 is at right (0 deg) -> No, depends on drawing.
        // Let's assume we draw segment 0 from -angle/2 to +angle/2 ?

        // Let's assume standard detailed logic:
        // Segment i starts at i * anglePerSegment
        // Top is at 270deg (or -90deg).
        // (StartAngle + Rotation) % 360 acts on the segment.

        // To find which segment intersect 270:
        // (i * size + rotation) % 360 overlaps 270?

        // Simplified: The effective angle at the pointer (top = 270)
        // effective = (270 - rotation) % 360
        // if effective < 0 += 360.

        let effectiveAngle = (270 - normalizedRotation) % 360;
        if (effectiveAngle < 0) effectiveAngle += 360;

        const winningIndex = Math.floor(effectiveAngle / anglePerSegment);

        setWinner(options[winningIndex]);
        setIsSpinning(false);
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }]
        };
    });

    // Helper to create circle path
    const makeSectorPath = (startAngle, endAngle) => {
        const x1 = CENTER + RADIUS * Math.cos(startAngle * Math.PI / 180);
        const y1 = CENTER + RADIUS * Math.sin(startAngle * Math.PI / 180);
        const x2 = CENTER + RADIUS * Math.cos(endAngle * Math.PI / 180);
        const y2 = CENTER + RADIUS * Math.sin(endAngle * Math.PI / 180);

        return `M${CENTER},${CENTER} L${x1},${y1} A${RADIUS},${RADIUS} 0 0,1 ${x2},${y2} Z`;
    };

    const rtlStyles = {
        textAlign: isKurdish ? 'right' : 'left',
        writingDirection: isKurdish ? 'rtl' : 'ltr',
    };

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={[styles.backButton, { backgroundColor: theme.background.card }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    {/* Wheel Container */}
                    <View style={styles.wheelContainer}>
                        {/* Pointer */}
                        <View style={styles.pointerContainer}>
                            <Ionicons name="caret-down" size={50} color={theme.colors.text} style={styles.pointerShadow} />
                            <Ionicons name="caret-down" size={44} color="#FFF" style={styles.pointer} />
                        </View>

                        <Animated.View style={[styles.wheel, animatedStyle]}>
                            <Svg width={WHEEL_SIZE} height={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}>
                                <G>
                                    {options.map((option, index) => {
                                        const startAngle = index * anglePerSegment;
                                        const endAngle = startAngle + anglePerSegment;
                                        // Text position: middle angle, radius * 0.7
                                        const midAngle = startAngle + anglePerSegment / 2;
                                        const textRad = RADIUS * 0.65;
                                        const tx = CENTER + textRad * Math.cos(midAngle * Math.PI / 180);
                                        const ty = CENTER + textRad * Math.sin(midAngle * Math.PI / 180);

                                        // Rotate text to align with radius?
                                        // Rotation = midAngle + 180 (to face outward? or inward?)
                                        const textRot = midAngle;

                                        return (
                                            <G key={index}>
                                                <Path
                                                    d={makeSectorPath(startAngle, endAngle)}
                                                    fill={SEGMENT_COLORS[index % SEGMENT_COLORS.length]}
                                                    stroke="#fff"
                                                    strokeWidth="2"
                                                />
                                                <G transform={`translate(${tx}, ${ty}) rotate(${textRot}, 0, 0)`}>
                                                    <SvgText
                                                        x="0"
                                                        y="5"
                                                        fill="white"
                                                        fontSize="14"
                                                        fontWeight="bold"
                                                        textAnchor="end" // Align outward
                                                        alignmentBaseline="middle"
                                                    >
                                                        {option.length > 12 ? option.substring(0, 10) + '..' : option}
                                                    </SvgText>
                                                </G>
                                            </G>
                                        );
                                    })}
                                </G>
                            </Svg>
                        </Animated.View>

                        {/* Center Cap */}
                        <View style={[styles.centerCap, { backgroundColor: theme.background.card, borderColor: theme.background.border }]}>
                            <View style={[styles.centerKnob, { backgroundColor: COLORS.games.wheel || '#ec4899' }]} />
                        </View>
                    </View>

                    {/* Result */}
                    {winner && (
                        <View style={styles.resultContainer}>
                            <Text style={[styles.winnerLabel, { color: theme.text.secondary }, isKurdish && styles.kurdishFont]}>
                                {t('wheel.winner', language) || "Winner:"}
                            </Text>
                            <Text style={[styles.winnerText, { color: theme.colors.primary }, isKurdish && styles.kurdishFont]}>
                                {winner}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.footer}>
                    <Button
                        title={isSpinning ? (t('wheel.spinning', language) || "Spinning...") : (t('wheel.spin', language) || "SPIN")}
                        onPress={spinWheel}
                        disabled={isSpinning}
                        gradient={[COLORS.games.wheel || '#ec4899', '#db2777']}
                        style={styles.spinButton}
                        isKurdish={isKurdish}
                    />
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: SPACING.md },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    wheelContainer: {
        width: WHEEL_SIZE,
        height: WHEEL_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    wheel: {
        width: WHEEL_SIZE,
        height: WHEEL_SIZE,
    },
    pointerContainer: {
        position: 'absolute',
        top: -25,
        zIndex: 10,
        alignItems: 'center',
    },
    pointer: {
        marginTop: -50,
        // textShadowColor: 'rgba(0,0,0,0.5)',
        // textShadowOffset: { width: 0, height: 2 },
        // textShadowRadius: 4,
    },
    centerCap: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 4,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.medium,
        elevation: 5,
    },
    centerKnob: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    resultContainer: {
        marginTop: SPACING.xl,
        alignItems: 'center',
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        backgroundColor: 'rgba(0,0,0,0.05)',
        minWidth: 200,
    },
    winnerLabel: {
        ...FONTS.bold,
        fontSize: 14,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    winnerText: {
        ...FONTS.large,
        fontSize: 32,
    },
    footer: {
        padding: SPACING.xxl,
    },
    spinButton: {
        width: '100%',
    },
    kurdishFont: { fontFamily: 'Rabar' },
});
