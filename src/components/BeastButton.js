import React, { useMemo } from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { MotiPressable } from 'moti/interactions';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { layout } from '../theme/layout';

/**
 * ✨ BeastButton - Premium button with native-feel haptics and animations
 * Ultra-responsive with 60fps spring animations
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
        // Light haptic for premium feel
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
                damping: 20,
                stiffness: 400,
                mass: 0.5,
            }}
            style={[
                {
                    borderRadius: layout.radius.xl,
                    overflow: 'hidden',
                    width: style?.width,
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
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Premium Sheen Effect - Only on primary, not disabled */}
                {variant === 'primary' && !disabled && (
                    <MotiView
                        from={{ translateX: -80, opacity: 0 }}
                        animate={{ translateX: 200, opacity: 0.25 }}
                        transition={{
                            type: 'timing',
                            duration: 1200,
                            loop: true,
                            repeatReverse: false,
                            delay: 2500,
                        }}
                        style={{
                            position: 'absolute',
                            width: 16,
                            height: '200%',
                            backgroundColor: '#FFF',
                            transform: [{ skewX: '-20deg' }],
                            zIndex: 0,
                        }}
                    />
                )}

                {loading ? (
                    <MotiView
                        from={{ rotate: '0deg' }}
                        animate={{ rotate: '360deg' }}
                        transition={{
                            type: 'timing',
                            duration: 800,
                            loop: true,
                        }}
                        style={styles.loader}
                    >
                        <View style={[styles.loaderDot, { backgroundColor: textColor }]} />
                    </MotiView>
                ) : (
                    <>
                        {Icon && <Icon size={18} color={textColor} style={{ zIndex: 1 }} />}
                        <Text style={{
                            color: textColor,
                            fontSize,
                            fontWeight: '700',
                            letterSpacing: 0.3,
                            zIndex: 1,
                        }}>
                            {title}
                        </Text>
                    </>
                )}
            </LinearGradient>
        </MotiPressable>
    );
};

const styles = StyleSheet.create({
    loader: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        position: 'absolute',
        top: 0,
    },
});

export default BeastButton;
