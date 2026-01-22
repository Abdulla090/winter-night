import React, { useEffect } from 'react';
import { StyleSheet, View, Platform, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

// Animated Orb Component to make background less "empty"
const Orb = ({ color, size, delay = 0, initialX, initialY, duration = 10000 }) => {
    const translateX = useSharedValue(initialX);
    const translateY = useSharedValue(initialY);

    useEffect(() => {
        translateX.value = withRepeat(
            withTiming(initialX + 50, { duration: duration, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
        translateY.value = withRepeat(
            withTiming(initialY + 50, { duration: duration * 1.2, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const style = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value }
        ]
    }));

    return (
        <Animated.View style={[
            styles.orb,
            {
                backgroundColor: color,
                width: size,
                height: size,
                borderRadius: size / 2,
                opacity: 0.15
            },
            style
        ]} />
    );
};

export default function GradientBackground({ children, style }) {
    const { theme, isDark } = useTheme();

    // Orbs colors based on theme
    const orbColor1 = isDark ? theme.colors.primary : theme.colors.primary;
    const orbColor2 = isDark ? theme.colors.success : theme.colors.info || theme.colors.success;

    return (
        <View style={[styles.container, { backgroundColor: theme.background.main }, style]}>
            <StatusBar style={isDark ? "light" : "dark"} />

            {/* Ambient Background Elements (Orbs) */}
            <View
                style={[StyleSheet.absoluteFillObject, { pointerEvents: 'none' }]}
            >
                <Orb
                    color={orbColor1}
                    size={width * 1.2}
                    initialX={-width * 0.4}
                    initialY={-height * 0.2}
                    duration={15000}
                />
                <Orb
                    color={orbColor2}
                    size={width}
                    initialX={width * 0.5}
                    initialY={height * 0.6}
                    duration={18000}
                />
                <Orb
                    color={isDark ? '#4c1d95' : '#60a5fa'} // Deep violet or sky blue
                    size={width * 0.8}
                    initialX={width * 0.1}
                    initialY={height * 0.3}
                    duration={20000}
                />
            </View>

            {/* Content */}
            <View style={{ flex: 1, zIndex: 1 }}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        ...Platform.select({
            web: {
                minHeight: '100vh',
                overflow: 'hidden', // changed from visible to hidden to prevent scrollbars from orbs
            },
            default: {
                // Native specific
            }
        })
    },
    orb: {
        position: 'absolute',
        ...Platform.select({
            web: {
                filter: 'blur(60px)',
            },
            default: {
                // Native doesn't support CSS filter. 
                // We rely on opacity and soft shapes.
                // Optionally could add a radial gradient here if we had the library, 
                // but solid low-opacity circles work as "bokeh" too.
            }
        })
    }
});
