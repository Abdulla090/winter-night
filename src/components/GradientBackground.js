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
    const { colors, mode } = useTheme();

    // Force "Winter Night" Professional Dark Palette
    // Deep Purple -> Darker Purple -> Almost Black
    const gradientColors = ['#2D1B4E', '#1A0B2E', '#0F0518'];

    return (
        <View style={[styles.container, { backgroundColor: '#0F0518' }, style]}>
            <StatusBar style="light" backgroundColor="#0F0518" />

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
