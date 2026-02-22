/**
 * ✨ PREMIUM 120FPS ANIMATION PRESETS
 * Native-feel, buttery smooth animations for a professional app experience
 * Optimized for Android & iOS native performance
 */

import { Easing, Platform } from 'react-native';

// ============================================
// SPRING CONFIGS (Buttery smooth, 120fps)
// ============================================

/**
 * Ultra-responsive spring - for button presses, micro-interactions
 * Feels instant but with satisfying bounce
 */
export const SPRING_SNAPPY = {
    type: 'spring',
    damping: 20,
    stiffness: 400,
    mass: 0.8,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
};

/**
 * Quick spring - for UI elements, toggles, switches
 */
export const SPRING_QUICK = {
    type: 'spring',
    damping: 18,
    stiffness: 300,
    mass: 0.9,
};

/**
 * Smooth spring - for cards, modals, larger elements
 */
export const SPRING_SMOOTH = {
    type: 'spring',
    damping: 22,
    stiffness: 200,
    mass: 1,
};

/**
 * Bouncy spring - for playful interactions, celebrations
 */
export const SPRING_BOUNCY = {
    type: 'spring',
    damping: 12,
    stiffness: 180,
    mass: 0.8,
};

/**
 * Gentle spring - for page transitions, large movements
 */
export const SPRING_GENTLE = {
    type: 'spring',
    damping: 25,
    stiffness: 150,
    mass: 1.2,
};

// ============================================
// TIMING CONFIGS (Precise, predictable)
// ============================================

/**
 * Ultra-fast timing - for micro-interactions (< 100ms feel)
 */
export const TIMING_INSTANT = {
    type: 'timing',
    duration: 80,
    easing: Easing.out(Easing.cubic),
};

/**
 * Fast timing - for quick feedback
 */
export const TIMING_FAST = {
    type: 'timing',
    duration: 150,
    easing: Easing.out(Easing.cubic),
};

/**
 * Normal timing - for standard transitions
 */
export const TIMING_NORMAL = {
    type: 'timing',
    duration: 250,
    easing: Easing.inOut(Easing.cubic),
};

/**
 * Slow timing - for dramatic reveals
 */
export const TIMING_SLOW = {
    type: 'timing',
    duration: 400,
    easing: Easing.out(Easing.exp),
};

// ============================================
// PRESS ANIMATION CONFIGS (safe, no worklets)
// ============================================

/**
 * Native-feel press scale values
 * iOS: subtle 0.97 scale
 * Android: slightly more dramatic 0.95 scale
 */
export const PRESS_SCALE = Platform.select({
    ios: 0.97,
    android: 0.95,
    default: 0.96,
});

export const PRESS_SCALE_SUBTLE = Platform.select({
    ios: 0.985,
    android: 0.98,
    default: 0.98,
});

export const PRESS_SCALE_DRAMATIC = Platform.select({
    ios: 0.94,
    android: 0.92,
    default: 0.93,
});

// ============================================
// ENTRANCE ANIMATIONS (for initial mount)
// ============================================

export const fadeIn = {
    from: { opacity: 0 },
    animate: { opacity: 1 },
    transition: TIMING_FAST,
};

export const fadeInUp = {
    from: { opacity: 0, translateY: 20 },
    animate: { opacity: 1, translateY: 0 },
    transition: SPRING_SMOOTH,
};

export const fadeInDown = {
    from: { opacity: 0, translateY: -20 },
    animate: { opacity: 1, translateY: 0 },
    transition: SPRING_SMOOTH,
};

export const scaleIn = {
    from: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: SPRING_QUICK,
};

export const slideInRight = {
    from: { translateX: 50, opacity: 0 },
    animate: { translateX: 0, opacity: 1 },
    transition: SPRING_SMOOTH,
};

export const slideInLeft = {
    from: { translateX: -50, opacity: 0 },
    animate: { translateX: 0, opacity: 1 },
    transition: SPRING_SMOOTH,
};

// ============================================
// STAGGER HELPERS
// ============================================

/**
 * Create staggered delay for list items
 * @param {number} index - Item index
 * @param {number} baseDelay - Base delay in ms (default 50)
 * @param {number} maxDelay - Maximum total delay (default 300)
 */
export const staggerDelay = (index, baseDelay = 50, maxDelay = 300) => {
    return Math.min(index * baseDelay, maxDelay);
};

// ============================================
// ACTIVE OPACITY VALUES
// ============================================

/**
 * Native-feel opacity for TouchableOpacity
 * iOS uses lower opacity; Android is a bit more subtle
 */
export const ACTIVE_OPACITY = Platform.select({
    ios: 0.7,
    android: 0.8,
    default: 0.75,
});

export const ACTIVE_OPACITY_SUBTLE = Platform.select({
    ios: 0.85,
    android: 0.9,
    default: 0.85,
});

// ============================================
// HAPTIC PRESETS
// ============================================

export const HAPTIC_LIGHT = 'impactLight';
export const HAPTIC_MEDIUM = 'impactMedium';
export const HAPTIC_HEAVY = 'impactHeavy';
export const HAPTIC_SUCCESS = 'notificationSuccess';
export const HAPTIC_WARNING = 'notificationWarning';
export const HAPTIC_ERROR = 'notificationError';
export const HAPTIC_SELECTION = 'selection';

// ============================================
// SCROLL CONFIGS
// ============================================

export const SCROLL_CONFIG = {
    decelerationRate: Platform.select({
        ios: 'normal',
        android: 0.985,
        default: 'normal',
    }),
    scrollEventThrottle: 16, // 60fps
    overScrollMode: 'never',
    bounces: Platform.OS === 'ios',
    showsVerticalScrollIndicator: false,
    showsHorizontalScrollIndicator: false,
};

export const HORIZONTAL_SCROLL_CONFIG = {
    ...SCROLL_CONFIG,
    horizontal: true,
    pagingEnabled: false,
    snapToAlignment: 'start',
    nestedScrollEnabled: true,
    directionalLockEnabled: true,
    disableIntervalMomentum: true,
};

// ============================================
// EXPORT ALL
// ============================================

export default {
    // Springs
    SPRING_SNAPPY,
    SPRING_QUICK,
    SPRING_SMOOTH,
    SPRING_BOUNCY,
    SPRING_GENTLE,

    // Timings
    TIMING_INSTANT,
    TIMING_FAST,
    TIMING_NORMAL,
    TIMING_SLOW,

    // Press scales
    PRESS_SCALE,
    PRESS_SCALE_SUBTLE,
    PRESS_SCALE_DRAMATIC,

    // Entrances
    fadeIn,
    fadeInUp,
    fadeInDown,
    scaleIn,
    slideInRight,
    slideInLeft,

    // Helpers
    staggerDelay,
    ACTIVE_OPACITY,
    ACTIVE_OPACITY_SUBTLE,

    // Scroll
    SCROLL_CONFIG,
    HORIZONTAL_SCROLL_CONFIG,
};
