import React, { useMemo } from 'react';
import { Text, View, StyleSheet, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { layout } from '../theme/layout';

/**
 * ✨ BeastButton - Premium button with native-feel haptics
 * Uses TouchableOpacity for reliable cross-platform behavior
 */
export const BeastButton = ({
    onPress,
    title,
    variant = 'primary',
    size = 'md',
    style,
    icon: Icon,
    disabled = false,
    loading = false,
}) => {
    const { colors, isRTL } = useTheme();

    const gradientColors = useMemo(() => {
        if (disabled) return ['#4A4A4A', '#3A3A3A'];
        switch (variant) {
            case 'primary': return [colors.brand.sun, colors.brand.gold];
            case 'secondary': return [colors.brand.mountain, '#166534'];
            case 'danger': return [colors.brand.crimson, '#991B1B'];
            case 'ghost': return ['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.08)'];
            default: return [colors.brand.sun, colors.brand.gold];
        }
    }, [variant, colors, disabled]);

    const getTextColor = () => {
        if (disabled) return '#888';
        if (variant === 'primary' || variant === 'ghost') return colors.text.primary;
        return '#FFFFFF';
    };

    const textColor = getTextColor();

    // Size configurations
    const sizeConfig = {
        sm: { height: 40, paddingHorizontal: 18, fontSize: 14 },
        md: { height: 48, paddingHorizontal: 24, fontSize: 16 },
        lg: { height: 56, paddingHorizontal: 32, fontSize: 18 },
    };
    const { height, paddingHorizontal, fontSize } = sizeConfig[size];

    const handlePress = () => {
        if (disabled || loading) return;
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress?.();
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={disabled || loading}
            activeOpacity={disabled ? 1 : 0.85}
            style={[
                {
                    borderRadius: layout.radius.xl,
                    overflow: 'hidden',
                    opacity: disabled ? 0.6 : 1,
                    ...layout.shadows.gold,
                    shadowColor: variant === 'primary' && !disabled ? colors.brand.gold : 'transparent',
                },
                style
            ]}
        >
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    height,
                    paddingHorizontal,
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                }}
            >
                {loading ? (
                    <ActivityIndicator size="small" color={textColor} />
                ) : (
                    <>
                        {Icon && <Icon size={18} color={textColor} />}
                        <Text style={{
                            color: textColor,
                            fontSize,
                            fontWeight: '700',
                            letterSpacing: 0.3,
                        }}>
                            {title}
                        </Text>
                    </>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({});

export default BeastButton;
