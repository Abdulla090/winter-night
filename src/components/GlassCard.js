import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { layout } from '../theme/layout';

/**
 * GlassCard - Cross-platform glass-effect card component
 * 
 * Uses solid semi-transparent backgrounds that work reliably on all platforms.
 * BlurView was intentionally removed as it causes rendering issues on Android.
 * 
 * Props:
 * - intensity: 0-100, controls opacity (default: 20)
 * - variant: 'default' | 'elevated' | 'subtle' (default: 'default')
 * - noPadding: removes internal padding
 * 
 * Usage:
 *   <GlassCard>
 *     <YourContent />
 *   </GlassCard>
 */
export const GlassCard = ({
    children,
    style,
    intensity = 20,
    variant = 'default',
    noPadding = false,
}) => {
    const { colors, isDark } = useTheme();

    // Calculate glass background based on theme and intensity
    const getGlassBackground = () => {
        const baseOpacity = 0.6 + (intensity / 100) * 0.3;

        if (isDark) {
            switch (variant) {
                case 'elevated':
                    return `rgba(26, 11, 46, ${baseOpacity + 0.1})`; // Purple tint, more opaque
                case 'subtle':
                    return `rgba(15, 5, 24, ${baseOpacity - 0.2})`; // Very subtle
                default:
                    return `rgba(26, 11, 46, ${baseOpacity})`; // Standard purple glass
            }
        } else {
            // ☀️ Sky Blue Light Mode Glass
            switch (variant) {
                case 'elevated':
                    return `rgba(255, 255, 255, ${baseOpacity + 0.15})`; // Pure white elevated
                case 'subtle':
                    return `rgba(224, 242, 254, ${baseOpacity - 0.1})`; // Subtle sky blue tint
                default:
                    return `rgba(255, 255, 255, ${baseOpacity})`; // Clean white glass
            }
        }
    };

    const getBorderColor = () => {
        if (isDark) {
            return variant === 'elevated'
                ? 'rgba(255, 255, 255, 0.12)'
                : 'rgba(255, 255, 255, 0.06)';
        }
        return 'rgba(0, 0, 0, 0.05)';
    };

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: getGlassBackground(),
                    borderColor: getBorderColor(),
                },
                noPadding && styles.noPadding,
                style
            ]}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: layout.radius.xl,
        borderWidth: 1,
        padding: layout.spacing.lg,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.12,
                shadowRadius: 12,
            },
            android: {
                elevation: 4,
            },
            web: {
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
            },
        }),
    },
    noPadding: {
        padding: 0,
    },
});

export default GlassCard;
