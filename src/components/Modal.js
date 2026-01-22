import React, { useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Modal as RNModal,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { COLORS, BORDER_RADIUS, SPACING, FONTS, SHADOWS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function Modal({
    visible,
    onClose,
    title,
    children,
    gradient,
    icon,
    showClose = true,
    isKurdish = false,
}) {
    const { theme, isDark } = useTheme();
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.9);

    useEffect(() => {
        if (visible) {
            opacity.value = withTiming(1, { duration: 200 });
            scale.value = withTiming(1, { duration: 200 });
        } else {
            opacity.value = withTiming(0, { duration: 150 });
            scale.value = withTiming(0.95, { duration: 150 });
        }
    }, [visible]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
    }));

    if (!visible && opacity.value === 0) return null;

    // Use theme-based colors for glassmorphism
    const defaultGradient = isDark
        ? ['rgba(39, 39, 42, 0.95)', 'rgba(24, 24, 27, 0.98)']
        : ['rgba(255, 255, 255, 0.98)', 'rgba(244, 244, 245, 1)'];

    const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';

    return (
        <RNModal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <Animated.View style={[styles.container, { borderColor: borderColor }, animatedStyle]}>
                            <LinearGradient
                                colors={gradient || defaultGradient}
                                style={styles.gradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <LinearGradient
                                    colors={isDark ? ['rgba(255,255,255,0.05)', 'transparent'] : ['rgba(255,255,255,0.5)', 'transparent']}
                                    style={styles.shine}
                                />

                                {showClose && (
                                    <TouchableOpacity
                                        style={[
                                            styles.closeButton,
                                            isKurdish ? { left: SPACING.md, right: undefined } : { right: SPACING.md, left: undefined }
                                        ]}
                                        onPress={onClose}
                                    >
                                        <View style={[styles.closeBtnCircle, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                                            <Ionicons name="close" size={20} color={theme.text.secondary} />
                                        </View>
                                    </TouchableOpacity>
                                )}

                                {icon && (
                                    <View style={styles.iconContainer}>
                                        <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)' }]}>
                                            <Ionicons name={icon} size={32} color={theme.colors.success} />
                                        </View>
                                    </View>
                                )}

                                {title && (
                                    <View style={styles.titleContainer}>
                                        <Text style={[styles.title, { color: theme.text.primary }, isKurdish && styles.kurdishFont]}>
                                            {title}
                                        </Text>
                                        <View style={[styles.separator, { backgroundColor: theme.colors.primary }]} />
                                    </View>
                                )}

                                <View style={styles.content}>
                                    {children}
                                </View>
                            </LinearGradient>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </RNModal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.lg,
    },
    container: {
        width: '100%',
        maxWidth: 400,
        borderRadius: BORDER_RADIUS.xl,
        overflow: 'hidden',
        ...SHADOWS.medium,
        elevation: 10,
        borderWidth: 1,
    },
    gradient: {
        padding: SPACING.xl,
    },
    shine: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 100,
    },
    closeButton: {
        position: 'absolute',
        top: SPACING.md,
        zIndex: 10,
    },
    closeBtnCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    title: {
        ...FONTS.title,
        fontSize: 22,
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
    separator: {
        width: 40,
        height: 3,
        borderRadius: 2,
        opacity: 0.5,
    },
    content: {
        alignItems: 'center',
    },
    kurdishFont: {
        fontFamily: 'Rabar',
    },
});
