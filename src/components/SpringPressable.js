import React from 'react';
import { Pressable, Platform } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

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

    return (
        <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            disabled={disabled}
            {...rest}
        >
            <Animated.View style={[animStyle, style]}>
                {children}
            </Animated.View>
        </Pressable>
    );
});

SpringPressable.displayName = 'SpringPressable';

export default SpringPressable;
export { SpringPressable };
