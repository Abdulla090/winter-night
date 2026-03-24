import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { layout } from '../theme/layout';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
} from 'react-native-reanimated';

/**
 * ✨ AnimatedScreen - Lightweight Reanimated 3 screen wrapper
 * Slide-up + fade entry running fully on the UI thread (zero JS bridge).
 * Native Stack handles screen-to-screen transitions; this handles content reveal.
 */
export const AnimatedScreen = ({
    children,
    style,
    noPadding = false,
    noTopPadding = false,
    noBottomPadding = false,
}) => {
    const { colors, isDark } = useTheme();
    const insets = useSafeAreaInsets();

    // Reanimated shared values — run on UI thread, no bridge cost
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(14);

    useEffect(() => {
        const cfg = { duration: 220, easing: Easing.out(Easing.ease) };
        opacity.value = withTiming(1, cfg);
        translateY.value = withTiming(0, cfg);
    }, []);

    const animStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    // Theme-specific gradient backgrounds
    const gradientColors = isDark
        ? [colors.background, '#1A0B2E', colors.background]
        : ['#F0F8FF', '#E8F4FC', '#F0F8FF'];

    const topPadding = noTopPadding
        ? 0
        : Math.max(insets.top, Platform.select({ ios: 44, android: StatusBar.currentHeight || 24, web: 20 }));
    const bottomPadding = noBottomPadding ? 0 : insets.bottom;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }, Platform.OS === 'web' && styles.webContainer]}>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor="transparent"
                translucent
            />

            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={StyleSheet.absoluteFillObject}
            />

            <Animated.View
                style={[
                    styles.content,
                    {
                        paddingTop: topPadding + (noPadding ? 0 : layout.spacing.md),
                        paddingBottom: bottomPadding,
                        paddingHorizontal: noPadding ? 0 : layout.screen.padding,
                    },
                    Platform.OS === 'web' && styles.webContent,
                    animStyle,
                    style,
                ]}
            >
                {children}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    webContainer: {
        height: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
    },
    webContent: {
        flex: 1,
        overflow: 'auto',
        height: '100%',
    },
});

export default AnimatedScreen;
