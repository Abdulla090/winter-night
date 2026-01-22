import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { COLORS, BORDER_RADIUS, SPACING, FONTS, SHADOWS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function Button({
    title,
    onPress,
    variant = 'primary',
    gradient,
    icon,
    disabled = false,
    style,
    textStyle,
    isKurdish = false,
}) {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);
    const { theme } = useTheme();

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
            opacity: opacity.value,
        };
    });

    // STRICT PROFESSIONAL ANIMATION: No Spring. Fast linear timing.
    const handlePressIn = () => {
        if (disabled) return;
        scale.value = withTiming(0.98, { duration: 50 }); // Barely shrinks
        opacity.value = withTiming(0.95, { duration: 50 });
    };

    const handlePressOut = () => {
        if (disabled) return;
        scale.value = withTiming(1, { duration: 100 });
        opacity.value = withTiming(1, { duration: 100 });
    };

    const getGradientColors = () => {
        if (gradient) return gradient;
        switch (variant) {
            case 'success': return [theme.colors.success, '#059669'];
            case 'danger': return [theme.colors.danger, '#b91c1c'];
            case 'secondary': return [theme.background.card, theme.background.border]; // Subtle gray
            case 'outline': return ['transparent', 'transparent'];
            default: return [theme.colors.primary, '#2563eb'];
        }
    };

    const isOutline = variant === 'outline';

    // Theme Logic for Text Color
    const getTextColor = () => {
        if (isOutline) return theme.text.primary;
        if (variant === 'secondary') return theme.text.primary;
        return '#FFFFFF';
    };

    return (
        <TouchableWithoutFeedback
            onPress={disabled ? null : onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <Animated.View style={[
                styles.container,
                animatedStyle,
                disabled && styles.disabled,
                isOutline && { borderWidth: 1, borderColor: theme.background.border },
                style
            ]}>
                <LinearGradient
                    colors={getGradientColors()}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.gradient, isOutline && styles.outlineGradient]}
                >
                    <View style={[styles.content, { flexDirection: isKurdish ? 'row-reverse' : 'row' }]}>
                        {icon && (
                            <View style={[
                                styles.icon,
                                isKurdish ? { marginLeft: SPACING.sm, marginRight: 0 } : { marginRight: SPACING.sm, marginLeft: 0 }
                            ]}>
                                {icon}
                            </View>
                        )}
                        <Text style={[
                            styles.text,
                            textStyle,
                            { color: getTextColor() },
                            isKurdish && styles.kurdishFont
                        ]}>
                            {title}
                        </Text>
                    </View>
                </LinearGradient>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: BORDER_RADIUS.xl,
        overflow: 'hidden',
    },
    gradient: {
        paddingVertical: 18,
        paddingHorizontal: SPACING.xl,
    },
    outlineGradient: {
        backgroundColor: 'transparent',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginRight: SPACING.sm,
    },
    text: {
        ...FONTS.semibold,
        fontSize: 17,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    disabled: {
        opacity: 0.5,
    },
    kurdishFont: {
        fontFamily: 'Rabar',
    },
});
