import React from 'react';
import { Pressable, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import * as Haptics from 'expo-haptics';
import { layout } from '../theme/layout';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

/**
 * ✨ PressableCard — Spring press feedback running on the UI thread.
 * Replaces TouchableOpacity.activeOpacity with a real physics spring scale,
 * giving a premium, native-feel interaction at zero JS-thread cost.
 *
 * Props:
 *  - scaleDown: how much to shrink on press (default 0.96)
 *  - variant: 'default' | 'subtle' | 'elevated'
 */
export const PressableCard = ({
    children,
    onPress,
    style,
    variant = 'default',
    disabled = false,
    haptic = true,
    scaleDown = 0.96,
}) => {
    const { colors, isDark } = useTheme();
    const scale = useSharedValue(1);

    const animStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withTiming(scaleDown, { duration: 100 });
    };

    const handlePressOut = () => {
        scale.value = withTiming(1, { duration: 150 });
    };

    const handlePress = () => {
        if (disabled) return;
        if (haptic && Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        }
        onPress?.();
    };

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
        <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            disabled={disabled}
        >
            <Animated.View
                style={[
                    styles.container,
                    {
                        backgroundColor: getBackgroundColor(),
                        borderColor: getBorderColor(),
                        opacity: disabled ? 0.6 : 1,
                    },
                    variant === 'elevated' && styles.elevated,
                    animStyle,
                    style,
                ]}
            >
                {children}
            </Animated.View>
        </Pressable>
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
