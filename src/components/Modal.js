import React, { useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Modal as RNModal,
    Platform,
    Pressable,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { layout } from '../theme/layout';

/**
 * ✨ Premium Modal with native-feel animations
 * Uses spring physics for buttery smooth 120fps transitions
 */
export default function Modal({
    visible,
    onClose,
    title,
    children,
    gradient,
    icon: IconComponent,
    showClose = true,
    isKurdish = false,
}) {
    const { colors, mode } = useTheme();
    const isDark = mode === 'dark';

    // Shared animation values
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.85);
    const translateY = useSharedValue(20);

    useEffect(() => {
        if (visible) {
            // Entrance: spring animation for native feel
            opacity.value = withTiming(1, { duration: 150 });
            scale.value = withSpring(1, {
                damping: 20,
                stiffness: 300,
                mass: 0.8,
            });
            translateY.value = withSpring(0, {
                damping: 22,
                stiffness: 280,
            });

            // Haptic feedback on open
            if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
        } else {
            // Exit: quick timing for snappy close
            opacity.value = withTiming(0, { duration: 120 });
            scale.value = withTiming(0.9, { duration: 120 });
            translateY.value = withTiming(10, { duration: 120 });
        }
    }, [visible]);

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const contentStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [
            { scale: scale.value },
            { translateY: translateY.value },
        ],
    }));

    const handleClose = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onClose();
    };

    if (!visible) return null;

    const bgColor = colors.surface;

    return (
        <RNModal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={handleClose}
            statusBarTranslucent
        >
            {/* Backdrop */}
            <Animated.View style={[styles.overlay, backdropStyle]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />

                {/* Modal Content */}
                <Animated.View style={[
                    styles.container,
                    {
                        backgroundColor: bgColor,
                        borderColor: colors.border,
                    },
                    contentStyle
                ]}>
                    {/* Header Gradient Strip */}
                    <LinearGradient
                        colors={gradient || [colors.brand.gold, colors.brand.sun]}
                        style={styles.headerStrip}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    />

                    <View style={styles.contentContainer}>
                        {/* Close Button */}
                        {showClose && (
                            <TouchableOpacity
                                onPress={handleClose}
                                activeOpacity={0.7}
                                style={[
                                    styles.closeButton,
                                    isKurdish ? { left: layout.spacing.md } : { right: layout.spacing.md }
                                ]}
                            >
                                <View style={[styles.closeBtnCircle, { backgroundColor: colors.surfaceHighlight }]}>
                                    <X size={18} color={colors.text.secondary} strokeWidth={2.5} />
                                </View>
                            </TouchableOpacity>
                        )}

                        {/* Icon */}
                        {IconComponent && (
                            <MotiView
                                from={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    type: 'spring',
                                    damping: 15,
                                    stiffness: 200,
                                    delay: 100,
                                }}
                                style={styles.iconContainer}
                            >
                                <View style={[styles.iconCircle, { backgroundColor: colors.brand.mountain + '15', borderColor: colors.brand.mountain }]}>
                                    <IconComponent size={32} color={colors.brand.mountain} />
                                </View>
                            </MotiView>
                        )}

                        {/* Title */}
                        {title && (
                            <MotiView
                                from={{ translateY: 10, opacity: 0 }}
                                animate={{ translateY: 0, opacity: 1 }}
                                transition={{
                                    type: 'spring',
                                    damping: 20,
                                    stiffness: 200,
                                    delay: 50,
                                }}
                                style={styles.titleContainer}
                            >
                                <Text style={[styles.title, { color: colors.text.primary }]}>
                                    {title}
                                </Text>
                            </MotiView>
                        )}

                        {/* Body Content */}
                        <MotiView
                            from={{ translateY: 15, opacity: 0 }}
                            animate={{ translateY: 0, opacity: 1 }}
                            transition={{
                                type: 'spring',
                                damping: 22,
                                stiffness: 180,
                                delay: 100,
                            }}
                            style={styles.body}
                        >
                            {children}
                        </MotiView>
                    </View>
                </Animated.View>
            </Animated.View>
        </RNModal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: layout.spacing.lg,
    },
    container: {
        width: '100%',
        maxWidth: 400,
        borderRadius: layout.radius.xl,
        overflow: 'hidden',
        borderWidth: 1,
        ...layout.shadows.lg,
    },
    headerStrip: {
        height: 6,
        width: '100%',
    },
    contentContainer: {
        padding: layout.spacing.xl,
    },
    closeButton: {
        position: 'absolute',
        top: layout.spacing.md,
        zIndex: 10,
    },
    closeBtnCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: layout.spacing.md,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: layout.spacing.lg,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
    },
    body: {
        width: '100%',
    }
});
