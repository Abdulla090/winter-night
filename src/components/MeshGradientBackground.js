import React, { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';

// Only import Skia on native platforms
let Canvas, Circle, Blur;
if (Platform.OS !== 'web') {
    const Skia = require('@shopify/react-native-skia');
    Canvas = Skia.Canvas;
    Circle = Skia.Circle;
    Blur = Skia.Blur;
}

import { useSharedValue, useDerivedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';

export const MeshGradientBackground = () => {
    const { width, height } = useWindowDimensions();
    const { colors, isDark } = useTheme();

    // Accent colors for the animated orbs
    const color1 = isDark ? '#4F46E5' : '#60A5FA'; // Indigo / Blue
    const color2 = isDark ? '#C026D3' : '#F472B6'; // Fuchsia / Pink
    const color3 = isDark ? '#F59E0B' : '#FCD34D'; // Amber / Gold
    const bg = isDark ? '#0F172A' : '#F8FAFC';

    // Animation driver
    const t = useSharedValue(0);

    useEffect(() => {
        t.value = withRepeat(
            withTiming(1, { duration: 12000, easing: Easing.inOut(Easing.sin) }),
            -1,
            true
        );
    }, []);

    // Orb 1 Motion (Top Left Area)
    const cx1 = useDerivedValue(() => width * 0.15 + (Math.sin(t.value * Math.PI) * 80));
    const cy1 = useDerivedValue(() => height * 0.15 + (Math.cos(t.value * Math.PI) * 60));

    // Orb 2 Motion (Right Side)
    const cx2 = useDerivedValue(() => width * 0.85 - (Math.sin(t.value * Math.PI * 0.7) * 100));
    const cy2 = useDerivedValue(() => height * 0.45 + (Math.cos(t.value * Math.PI * 0.7) * 70));

    // Orb 3 Motion (Bottom Center)
    const cx3 = useDerivedValue(() => width * 0.5 + (Math.sin(t.value * Math.PI * 1.3) * 120));
    const cy3 = useDerivedValue(() => height * 0.85 - (Math.cos(t.value * Math.PI * 1.3) * 80));

    // Web Fallback - just a static gradient view
    if (Platform.OS === 'web' || !Canvas) {
        return (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: bg }]} />
        );
    }

    // Native - Premium Skia Canvas with animated blurred orbs
    return (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: bg }]}>
            <Canvas style={{ flex: 1 }}>
                {/* Apply heavy blur to merge circles into mesh effect */}
                <Blur blur={80} />

                {/* Animated Orbs */}
                <Circle cx={cx1} cy={cy1} r={width * 0.45} color={color1} opacity={0.5} />
                <Circle cx={cx2} cy={cy2} r={width * 0.5} color={color2} opacity={0.4} />
                <Circle cx={cx3} cy={cy3} r={width * 0.55} color={color3} opacity={0.35} />
            </Canvas>
        </View>
    );
};
