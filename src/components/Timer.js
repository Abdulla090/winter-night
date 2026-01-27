import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';

/**
 * ✨ Premium Timer with native-feel spring animations
 * Smooth 120fps pulse animation with haptic feedback on low time
 */
export default function Timer({
    duration = 60,
    onComplete,
    isRunning = true,
    size = 120,
    showText = true,
}) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isPulsing, setIsPulsing] = useState(false);

    const { colors, mode } = useTheme();
    const isDark = mode === 'dark';

    // Countdown logic
    useEffect(() => {
        if (!isRunning) return;

        if (timeLeft <= 0) {
            onComplete && onComplete();
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft, isRunning, onComplete]);

    // Pulse and haptic on low time
    useEffect(() => {
        if (timeLeft <= 10 && timeLeft > 0 && isRunning) {
            setIsPulsing(true);

            // Haptic feedback on each tick when low
            if (Platform.OS !== 'web') {
                Haptics.impactAsync(
                    timeLeft <= 3
                        ? Haptics.ImpactFeedbackStyle.Heavy
                        : Haptics.ImpactFeedbackStyle.Light
                );
            }

            // Reset pulse after animation
            const timeout = setTimeout(() => setIsPulsing(false), 200);
            return () => clearTimeout(timeout);
        }
    }, [timeLeft, isRunning]);

    const formatTime = useCallback((seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }, []);

    const isLow = timeLeft <= 10;
    const isCritical = timeLeft <= 3;
    const activeColor = isLow ? colors.brand.crimson : colors.brand.gold;

    // Calculate border width based on size
    const borderWidth = size < 40 ? 2 : size < 80 ? 3 : 4;

    return (
        <MotiView
            animate={{
                scale: isPulsing ? 1.08 : 1,
                borderColor: activeColor,
            }}
            transition={{
                type: 'spring',
                damping: 15,
                stiffness: 400,
                mass: 0.6,
            }}
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                    borderWidth,
                    borderColor: activeColor,
                    backgroundColor: isDark
                        ? (isLow ? 'rgba(239, 68, 68, 0.1)' : colors.surface)
                        : (isLow ? 'rgba(239, 68, 68, 0.05)' : colors.surface),
                }
            ]}
        >
            {/* Inner glow effect for low time */}
            {isLow && (
                <MotiView
                    from={{ opacity: 0 }}
                    animate={{ opacity: isPulsing ? 0.3 : 0.15 }}
                    transition={{ type: 'timing', duration: 100 }}
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            borderRadius: size / 2,
                            backgroundColor: colors.brand.crimson,
                        }
                    ]}
                />
            )}

            <View style={styles.inner}>
                {showText && (
                    <MotiView
                        animate={{
                            scale: isPulsing ? 1.1 : 1,
                        }}
                        transition={{
                            type: 'spring',
                            damping: 20,
                            stiffness: 500,
                        }}
                    >
                        <Text style={[
                            styles.time,
                            {
                                color: isLow ? colors.brand.crimson : colors.text.primary,
                                fontSize: size * 0.25,
                            }
                        ]}>
                            {formatTime(timeLeft)}
                        </Text>
                    </MotiView>
                )}
            </View>
        </MotiView>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    inner: {
        flex: 1,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    time: {
        fontWeight: '700',
    },
});
