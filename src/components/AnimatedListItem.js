import React, { useEffect } from 'react';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    Easing,
} from 'react-native-reanimated';

/**
 * ✨ AnimatedListItem — Staggered fade + slide-up entrance for list items.
 *
 * Wrap any list item with this to get a smooth, sequential reveal effect.
 * Runs fully on the UI thread — zero JS bridge cost.
 *
 * Props:
 *  - index: item index in the list (drives the stagger delay)
 *  - maxDelay: cap the total delay so late items don't feel abandoned (default 350ms)
 *  - duration: animation duration per item in ms (default 280)
 *  - style: additional styles passed to the Animated.View wrapper
 */
const AnimatedListItem = React.memo(({ children, index = 0, maxDelay = 350, duration = 280, style }) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(18);

    useEffect(() => {
        const delay = Math.min(index * 55, maxDelay);
        const cfg = { duration, easing: Easing.out(Easing.ease) };
        opacity.value = withDelay(delay, withTiming(1, cfg));
        translateY.value = withDelay(delay, withTiming(0, cfg));
    }, []);

    const animStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <Animated.View style={[animStyle, style]}>
            {children}
        </Animated.View>
    );
});

AnimatedListItem.displayName = 'AnimatedListItem';

export default AnimatedListItem;
export { AnimatedListItem };
