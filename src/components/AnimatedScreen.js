import React from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { layout } from '../theme/layout';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * ✨ AnimatedScreen - Lightweight screen wrapper
 * Optimized for Native Stack - no JS animations that would block transitions
 * Native Stack handles all screen transition animations natively at 60fps
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

    // Theme-specific gradient backgrounds
    const gradientColors = isDark
        ? [colors.background, '#1A0B2E', colors.background] // Purple for dark
        : ['#F0F8FF', '#E8F4FC', '#F0F8FF']; // Softer sky blue for light

    const topPadding = noTopPadding ? 0 : Math.max(insets.top, Platform.select({ ios: 44, android: StatusBar.currentHeight || 24, web: 20 }));
    const bottomPadding = noBottomPadding ? 0 : insets.bottom;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }, Platform.OS === 'web' && styles.webContainer]}>
            <StatusBar
                barStyle={isDark ? "light-content" : "dark-content"}
                backgroundColor="transparent"
                translucent
            />

            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={StyleSheet.absoluteFillObject}
            />

            <View
                style={[
                    styles.content,
                    {
                        paddingTop: topPadding + (noPadding ? 0 : layout.spacing.md),
                        paddingBottom: bottomPadding,
                        paddingHorizontal: noPadding ? 0 : layout.screen.padding,
                    },
                    // Web-specific: enable scrolling
                    Platform.OS === 'web' && styles.webContent,
                    style
                ]}
            >
                {children}
            </View>
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
    // Web-specific styles for proper scrolling
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
