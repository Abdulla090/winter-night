import { Platform } from 'react-native';

/**
 * ✨ CROSS-PLATFORM UTILITIES
 * Handles differences between iOS, Android, and Web
 * Priority: Android and iOS (web is secondary)
 */

/**
 * Creates a text shadow that works on native but doesn't trigger 
 * deprecation warnings on web
 */
export const createTextShadow = (color, offsetX, offsetY, radius) => {
    return Platform.select({
        ios: {
            textShadowColor: color,
            textShadowOffset: { width: offsetX, height: offsetY },
            textShadowRadius: radius,
        },
        android: {
            textShadowColor: color,
            textShadowOffset: { width: offsetX, height: offsetY },
            textShadowRadius: radius,
        },
        web: {
            textShadow: `${offsetX}px ${offsetY}px ${radius}px ${color}`,
        },
    });
};

/**
 * Creates a box shadow that works cross-platform
 */
export const createShadow = (color, offsetX, offsetY, radius, opacity = 1) => {
    return Platform.select({
        ios: {
            shadowColor: color,
            shadowOffset: { width: offsetX, height: offsetY },
            shadowOpacity: opacity,
            shadowRadius: radius,
        },
        android: {
            elevation: Math.max(1, Math.round(radius / 2)),
        },
        web: {
            boxShadow: `${offsetX}px ${offsetY}px ${radius}px rgba(0,0,0,${opacity})`,
        },
    });
};

/**
 * Platform-specific shadow presets
 */
export const shadows = {
    sm: createShadow('#000', 0, 2, 4, 0.08),
    md: createShadow('#000', 0, 4, 12, 0.12),
    lg: createShadow('#000', 0, 8, 24, 0.15),
    xl: createShadow('#000', 0, 12, 40, 0.2),
};

/**
 * Text shadow presets for readability on images
 */
export const textShadows = {
    light: createTextShadow('rgba(0,0,0,0.5)', 0, 1, 4),
    medium: createTextShadow('rgba(0,0,0,0.7)', 0, 2, 6),
    strong: createTextShadow('rgba(0,0,0,0.8)', 0, 2, 8),
};

/**
 * Normalize style props for web compatibility
 * Use this wrapper when you need pointerEvents on a View
 */
export const normalizeWebStyles = (style) => {
    if (Platform.OS !== 'web') return style;

    // Handle deprecated props
    const normalized = { ...style };

    return normalized;
};

export default {
    createTextShadow,
    createShadow,
    shadows,
    textShadows,
    normalizeWebStyles,
};
