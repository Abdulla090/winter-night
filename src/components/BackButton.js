import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { MotiPressable } from 'moti/interactions';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import * as Haptics from 'expo-haptics';

/**
 * ✨ BackButton - Premium animated back button with native feel
 * Smooth spring animations and haptic feedback
 */
export const BackButton = ({ onPress, style }) => {
    const { colors, isRTL } = useTheme();

    const handlePress = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress?.();
    };

    const Icon = isRTL ? ChevronRight : ChevronLeft;

    return (
        <MotiPressable
            onPress={handlePress}
            animate={({ pressed, hovered }) => {
                'worklet';
                return {
                    scale: pressed ? 0.9 : hovered ? 1.05 : 1,
                    opacity: pressed ? 0.8 : 1,
                };
            }}
            transition={{
                type: 'spring',
                damping: 15,
                stiffness: 400,
                mass: 0.4,
            }}
            style={[
                styles.button,
                {
                    backgroundColor: colors.surfaceGlass,
                    borderColor: colors.border,
                },
                style
            ]}
        >
            <Icon size={24} color={colors.text.primary} strokeWidth={2.5} />
        </MotiPressable>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 6,
            },
            android: {
                elevation: 3,
            },
            web: {
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            },
        }),
    },
});

export default BackButton;
