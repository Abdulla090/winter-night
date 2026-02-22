import React from 'react';
import { StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import * as Haptics from 'expo-haptics';

/**
 * ✨ BackButton - Premium back button with native feel
 * Uses TouchableOpacity for reliable cross-platform behavior
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
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
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
        </TouchableOpacity>
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
