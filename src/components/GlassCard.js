import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS, BORDER_RADIUS } from '../constants/theme';

export default function GlassCard({ children, style, intensity = 20, tint = 'dark' }) {
    // Android Support: BlurView support on Android is sometimes tricky or requires specific setup.
    // If it fails or looks bad, we fallback to a semi-transparent view.
    // However, expo-blur works reasonably well on modern Expo Go.

    const isWeb = Platform.OS === 'web';

    if (isWeb) {
        return (
            <View style={[styles.webGlass, style]}>
                {children}
            </View>
        );
    }

    return (
        <BlurView intensity={intensity} tint={tint} style={[styles.container, style]}>
            <View style={styles.childContainer}>
                {children}
            </View>
        </BlurView>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: BORDER_RADIUS.xl,
        overflow: 'hidden',
        backgroundColor: 'rgba(20, 20, 25, 0.6)', // Fallback/Tint
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
    },
    webGlass: {
        borderRadius: BORDER_RADIUS.xl,
        backgroundColor: 'rgba(20, 20, 25, 0.6)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
    },
    childContainer: {
        backgroundColor: 'transparent',
    }
});
