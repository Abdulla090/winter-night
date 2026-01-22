import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Easing } from 'react-native';
import { COLORS, BORDER_RADIUS, FONTS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function Timer({
    duration = 60,
    onComplete,
    isRunning = true,
    size = 120,
}) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const { theme } = useTheme();

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
    }, [timeLeft, isRunning]);

    useEffect(() => {
        if (timeLeft <= 10 && timeLeft > 0) {
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 200,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 200,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const isLow = timeLeft <= 10;

    // Theme colors
    const activeColor = isLow ? theme.colors.danger : theme.colors.primary;
    const bgColor = theme.background.card;
    const textColor = isLow ? theme.colors.danger : theme.text.primary;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                    transform: [{ scale: pulseAnim }],
                    borderColor: activeColor,
                    backgroundColor: bgColor,
                }
            ]}
        >
            <View style={styles.inner}>
                <Text style={[styles.time, { color: textColor }]}>
                    {formatTime(timeLeft)}
                </Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 999,
        borderWidth: 3,
    },
    inner: {
        flex: 1,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    time: {
        ...FONTS.bold,
        fontSize: 28,
    },
});
