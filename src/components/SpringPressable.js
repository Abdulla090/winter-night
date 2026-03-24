import React from 'react';
import { Pressable, Platform } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * ✨ SpringPressable — Drop-in replacement for TouchableOpacity.
 * Gives any element a premium spring-scale press effect on the UI thread.
 *
 * Usage: Replace <TouchableOpacity> with <SpringPressable>
 *
 * Props:
 *  - scaleDown: scale target on press-in (default 0.95)
 *  - damping / stiffness: spring physics tuning
 *  - haptic: whether to trigger light haptic on press (default true)
 *  - All standard Pressable props (onPress, style, disabled, etc.)
 */
const SpringPressable = React.memo(({
    children,
    onPress,
    style,
    scaleDown = 0.95,
    damping = 15,
    stiffness = 400,
    haptic = true,
    disabled = false,
    ...rest
}) => {
    const scale = useSharedValue(1);

    const animStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(scaleDown, { damping, stiffness });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 12, stiffness: 300 });
    };

    const handlePress = () => {
        if (disabled) return;
        if (haptic && Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        }
        onPress?.();
    };

    return (
        <AnimatedPressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            disabled={disabled}
            style={[animStyle, style]}
            {...rest}
        >
            {children}
        </AnimatedPressable>
    );
});

SpringPressable.displayName = 'SpringPressable';

export default SpringPressable;
export { SpringPressable };
