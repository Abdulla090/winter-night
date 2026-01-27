import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { MotiPressable } from 'moti/interactions';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { layout } from '../theme/layout';

/**
 * ✨ PressableCard - Premium animated card with native-feel interactions
 * Smooth press feedback with haptics and spring animations
 */
export const PressableCard = ({
    children,
    onPress,
    style,
    variant = 'default', // 'default' | 'subtle' | 'elevated'
    disabled = false,
    haptic = true,
    scaleAmount = 0.98, // How much to scale on press
}) => {
    const { colors, isDark } = useTheme();

    const handlePress = () => {
        if (disabled) return;
        if (haptic && Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
        }
        onPress?.();
    };

    // Card background based on variant and theme
    const getBackgroundColor = () => {
        if (isDark) {
            switch (variant) {
                case 'elevated': return '#1E1231';
                case 'subtle': return 'rgba(26, 11, 46, 0.6)';
                default: return '#1A0B2E';
            }
        } else {
            switch (variant) {
                case 'elevated': return '#FFFFFF';
                case 'subtle': return 'rgba(255, 255, 255, 0.8)';
                default: return '#FFFFFF';
            }
        }
    };

    const getBorderColor = () => {
        if (isDark) {
            return variant === 'elevated'
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(255, 255, 255, 0.05)';
        }
        return '#E2E8F0';
    };

    return (
        <MotiPressable
            onPress={handlePress}
            disabled={disabled}
            animate={({ pressed, hovered }) => {
                'worklet';
                return {
                    scale: disabled ? 1 : pressed ? scaleAmount : hovered ? 1.01 : 1,
                    opacity: disabled ? 0.6 : pressed ? 0.95 : 1,
                    translateY: pressed ? 1 : 0,
                };
            }}
            transition={{
                type: 'spring',
                damping: 18,
                stiffness: 350,
                mass: 0.5,
            }}
            style={[
                styles.container,
                {
                    backgroundColor: getBackgroundColor(),
                    borderColor: getBorderColor(),
                },
                variant === 'elevated' && styles.elevated,
                style,
            ]}
        >
            {children}
        </MotiPressable>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: layout.radius.xl,
        borderWidth: 1,
        overflow: 'hidden',
    },
    elevated: {
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.15,
                shadowRadius: 16,
            },
            android: {
                elevation: 8,
            },
            web: {
                boxShadow: '0 6px 24px rgba(0, 0, 0, 0.12)',
            },
        }),
    },
});

export default PressableCard;
