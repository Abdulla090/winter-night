import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { layout } from '../theme/layout';

/**
 * GradientBackground - Cross-platform background component
 * Works identically on Web and Android with solid gradient backgrounds
 */
export default function GradientBackground({ children, style }) {
    const { colors, mode, isDark } = useTheme();

    // Theme-aware gradient backgrounds
    const gradientColors = isDark
        ? ['#2D1B4E', '#1A0B2E', '#0F0518'] // Deep Purple -> Almost Black (dark mode)
        : ['#E0F2FE', '#F0F8FF', '#F8FAFC']; // Sky Blue -> Alice Blue (light mode)

    const bgColor = isDark ? '#0F0518' : '#F0F8FF';

    return (
        <View style={[styles.container, { backgroundColor: bgColor }, style]}>
            <StatusBar style={isDark ? "light" : "dark"} backgroundColor={bgColor} />

            <LinearGradient
                colors={gradientColors}
                start={{ x: 0.2, y: 0.1 }}
                end={{ x: 0.9, y: 0.9 }}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Content layer */}
            <View style={{ flex: 1, zIndex: 1, padding: layout.screen.padding }}>
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
                maxWidth: 480,
                alignSelf: 'center',
                width: '100%',
                boxShadow: '0 0 40px rgba(0,0,0,0.1)',
            }
        })
    },
});
