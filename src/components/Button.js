import React, { useMemo } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiPressable } from 'moti/interactions';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { layout } from '../theme/layout';

/**
 * ✨ Button - Premium animated button with native-feel interactions
 * Ultra-responsive with smooth spring animations and haptic feedback
 */
export default function Button({
    title,
    onPress,
    variant = 'primary',
    gradient,
    icon,
    disabled = false,
    loading = false,
    style,
    textStyle,
    isKurdish = false,
}) {
    const { colors, isRTL } = useTheme();

    // Map variants to gradient colors
    const gradientColors = useMemo(() => {
        if (disabled) return ['#4A4A4A', '#3A3A3A'];
        if (gradient) return gradient;
        switch (variant) {
            case 'success': return ['#10B981', '#059669'];
            case 'danger': return [colors.brand.crimson, '#991B1B'];
            case 'secondary': return [colors.surfaceHighlight, colors.border];
            case 'outline': return ['transparent', 'transparent'];
            default: return [colors.brand.gold, '#FBBF24'];
        }
    }, [variant, gradient, colors, disabled]);

    const isOutline = variant === 'outline';

    // Text color logic
    const textColor = disabled ? '#888' :
        (isOutline || variant === 'secondary') ? colors.text.primary : '#FFFFFF';

    const handlePress = () => {
        if (disabled || loading) return;
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress?.();
    };

    return (
        <MotiPressable
            onPress={handlePress}
            disabled={disabled || loading}
            animate={({ pressed, hovered }) => {
                'worklet';
                return {
                    scale: disabled ? 1 : pressed ? 0.96 : hovered ? 1.02 : 1,
                    opacity: disabled ? 0.6 : pressed ? 0.9 : 1,
                };
            }}
            transition={{
                type: 'spring',
                damping: 18,
                stiffness: 380,
                mass: 0.5,
            }}
            style={[
                styles.container,
                {
                    borderRadius: layout.radius.xl,
                    backgroundColor: isOutline ? 'transparent' : undefined,
                    borderColor: isOutline ? colors.border : undefined,
                    borderWidth: isOutline ? 1 : 0,
                },
                !isOutline && !disabled && styles.shadow,
                style
            ]}
        >
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                    styles.gradient,
                    { flexDirection: isKurdish ? 'row-reverse' : 'row' }
                ]}
            >
                {icon && (
                    <View style={[
                        styles.icon,
                        isKurdish ? { marginLeft: 8 } : { marginRight: 8 }
                    ]}>
                        {icon}
                    </View>
                )}
                <Text style={[
                    styles.text,
                    { color: textColor },
                    textStyle,
                    isKurdish && styles.kurdishFont
                ]}>
                    {title}
                </Text>
            </LinearGradient>
        </MotiPressable>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
    gradient: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    icon: {},
    shadow: {
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.12,
                shadowRadius: 10,
            },
            android: {
                elevation: 5,
            },
            web: {
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
            },
        }),
    },
    kurdishFont: {
        fontFamily: 'Rabar-SemiBold',
    },
});
