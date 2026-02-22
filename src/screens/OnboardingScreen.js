import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    StatusBar,
    Platform,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    ArrowRight,
    Gamepad2,
    Users,
    Zap,
    Swords,
    Crown,
    Trophy,
    Flame,
    Shield,
    Target,
    ChevronRight,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

// ⚡ ELITE ONBOARDING — Dark, Bold, Powerful
const SLIDES = [
    {
        id: '1',
        title: 'GAME\nNIGHT',
        subtitle: '20+ party games in your pocket.\nNo internet. No excuses.',
        Icon: Swords,
        SecondaryIcon: Crown,
        gradientBg: ['#0A0A0F', '#12111A', '#0D0C15'],
        accentGradient: ['#FF6B00', '#FF3D00'],
        accentColor: '#FF6B00',
        glowColor: 'rgba(255, 107, 0, 0.15)',
        particleColor: '#FF6B00',
    },
    {
        id: '2',
        title: 'SQUAD\nUP',
        subtitle: 'Challenge your crew.\nBreak the ice. Own the night.',
        Icon: Shield,
        SecondaryIcon: Users,
        gradientBg: ['#0A0A0F', '#0F1118', '#0A0D14'],
        accentGradient: ['#00D4FF', '#0088FF'],
        accentColor: '#00D4FF',
        glowColor: 'rgba(0, 212, 255, 0.15)',
        particleColor: '#00D4FF',
    },
    {
        id: '3',
        title: 'ZERO\nBS',
        subtitle: 'No ads. No sign-ups.\nJust raw fun.',
        Icon: Target,
        SecondaryIcon: Flame,
        gradientBg: ['#0A0A0F', '#11140D', '#0C0F0A'],
        accentGradient: ['#00FF88', '#00CC6A'],
        accentColor: '#00FF88',
        glowColor: 'rgba(0, 255, 136, 0.12)',
        particleColor: '#00FF88',
    },
];

// Floating particle component
const FloatingParticle = ({ delay, size, startX, startY, color, fadeAnim }) => {
    const translateY = useRef(new Animated.Value(0)).current;
    const translateX = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animate = () => {
            translateY.setValue(0);
            translateX.setValue(0);
            opacity.setValue(0);

            Animated.sequence([
                Animated.delay(delay),
                Animated.parallel([
                    Animated.timing(translateY, {
                        toValue: -120 - Math.random() * 80,
                        duration: 3000 + Math.random() * 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(translateX, {
                        toValue: (Math.random() - 0.5) * 60,
                        duration: 3000 + Math.random() * 2000,
                        useNativeDriver: true,
                    }),
                    Animated.sequence([
                        Animated.timing(opacity, {
                            toValue: 0.6 + Math.random() * 0.4,
                            duration: 800,
                            useNativeDriver: true,
                        }),
                        Animated.delay(1500),
                        Animated.timing(opacity, {
                            toValue: 0,
                            duration: 1200,
                            useNativeDriver: true,
                        }),
                    ]),
                ]),
            ]).start(() => animate());
        };
        animate();
    }, []);

    return (
        <Animated.View
            style={{
                position: 'absolute',
                left: startX,
                top: startY,
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: color,
                opacity: Animated.multiply(opacity, fadeAnim),
                transform: [{ translateY }, { translateX }],
            }}
        />
    );
};

export default function OnboardingScreen({ navigation }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const iconScale = useRef(new Animated.Value(1)).current;
    const iconRotate = useRef(new Animated.Value(0)).current;
    const lineWidth = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const currentSlide = SLIDES[activeIndex];

    // Pulse animation for the icon
    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, []);

    // Line reveal animation
    useEffect(() => {
        lineWidth.setValue(0);
        Animated.timing(lineWidth, {
            toValue: 1,
            duration: 800,
            delay: 300,
            useNativeDriver: false,
        }).start();
    }, [activeIndex]);

    const animateTransition = (callback) => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: -30,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(iconScale, {
                toValue: 0.8,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            callback();
            slideAnim.setValue(30);
            iconScale.setValue(0.6);

            Animated.parallel([
                Animated.spring(fadeAnim, {
                    toValue: 1,
                    tension: 80,
                    friction: 10,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 80,
                    friction: 10,
                    useNativeDriver: true,
                }),
                Animated.spring(iconScale, {
                    toValue: 1,
                    tension: 60,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]).start();
        });
    };

    const goToSlide = (index) => {
        if (index === activeIndex) return;
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        animateTransition(() => setActiveIndex(index));
    };

    const handleNext = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }

        if (activeIndex < SLIDES.length - 1) {
            animateTransition(() => setActiveIndex(activeIndex + 1));
        } else {
            finishOnboarding();
        }
    };

    const finishOnboarding = async () => {
        try {
            await AsyncStorage.setItem('hasLaunched', 'true');
        } catch (e) {
            console.log('Storage error', e);
        }
        navigation.replace('Home');
    };

    const handleSkip = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        finishOnboarding();
    };

    const Icon = currentSlide.Icon;
    const SecondaryIcon = currentSlide.SecondaryIcon;

    const lineAnimatedWidth = lineWidth.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            {/* Deep Dark Background */}
            <LinearGradient
                colors={currentSlide.gradientBg}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.5, y: 1 }}
            />

            {/* Grid Pattern Overlay */}
            <View style={styles.gridOverlay}>
                {[...Array(8)].map((_, i) => (
                    <View
                        key={`h-${i}`}
                        style={[
                            styles.gridLine,
                            styles.gridLineH,
                            { top: `${(i + 1) * 12}%`, opacity: 0.03 },
                        ]}
                    />
                ))}
                {[...Array(5)].map((_, i) => (
                    <View
                        key={`v-${i}`}
                        style={[
                            styles.gridLine,
                            styles.gridLineV,
                            { left: `${(i + 1) * 20}%`, opacity: 0.03 },
                        ]}
                    />
                ))}
            </View>

            {/* Accent Glow */}
            <View style={[styles.accentGlow, { backgroundColor: currentSlide.glowColor }]} />
            <View style={[styles.accentGlowBottom, { backgroundColor: currentSlide.glowColor }]} />

            {/* Floating Particles */}
            {[...Array(6)].map((_, i) => (
                <FloatingParticle
                    key={`p-${activeIndex}-${i}`}
                    delay={i * 500}
                    size={2 + Math.random() * 3}
                    startX={width * 0.2 + Math.random() * width * 0.6}
                    startY={height * 0.3 + Math.random() * height * 0.3}
                    color={currentSlide.particleColor}
                    fadeAnim={fadeAnim}
                />
            ))}

            {/* Slide Counter */}
            <Animated.View style={[styles.slideCounter, { opacity: fadeAnim }]}>
                <Text style={[styles.slideCounterText, { color: currentSlide.accentColor }]}>
                    0{activeIndex + 1}
                </Text>
                <View style={styles.slideCounterDivider}>
                    <View style={[styles.slideCounterLine, { backgroundColor: currentSlide.accentColor + '40' }]} />
                </View>
                <Text style={styles.slideCounterTotal}>0{SLIDES.length}</Text>
            </Animated.View>

            {/* Main Content */}
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            >
                {/* Icon Section */}
                <Animated.View
                    style={[
                        styles.iconSection,
                        {
                            transform: [{ scale: Animated.multiply(iconScale, pulseAnim) }],
                        },
                    ]}
                >
                    {/* Outer ring */}
                    <View style={[styles.iconOuterRing, { borderColor: currentSlide.accentColor + '15' }]}>
                        {/* Inner ring */}
                        <View style={[styles.iconMiddleRing, { borderColor: currentSlide.accentColor + '25' }]}>
                            {/* Icon container */}
                            <View style={styles.iconContainer}>
                                <LinearGradient
                                    colors={[currentSlide.accentColor + '20', currentSlide.accentColor + '08']}
                                    style={StyleSheet.absoluteFill}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                />
                                <Icon size={52} color={currentSlide.accentColor} strokeWidth={1.5} />
                            </View>
                        </View>
                    </View>

                    {/* Secondary floating icon */}
                    <View style={[styles.secondaryIconWrap, { backgroundColor: currentSlide.accentColor + '12' }]}>
                        <SecondaryIcon size={20} color={currentSlide.accentColor} strokeWidth={2} />
                    </View>
                </Animated.View>

                {/* Title */}
                <View style={styles.titleSection}>
                    <Animated.View
                        style={[
                            styles.accentLine,
                            {
                                backgroundColor: currentSlide.accentColor,
                                width: lineAnimatedWidth,
                            },
                        ]}
                    />
                    <Text style={styles.title}>{currentSlide.title}</Text>
                </View>

                {/* Subtitle */}
                <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>
            </Animated.View>

            {/* Bottom Section */}
            <View style={styles.bottomSection}>
                {/* Progress Indicator */}
                <View style={styles.progressContainer}>
                    {SLIDES.map((slide, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => goToSlide(index)}
                            style={styles.progressTouchArea}
                            activeOpacity={0.7}
                        >
                            <View style={styles.progressTrack}>
                                <Animated.View
                                    style={[
                                        styles.progressFill,
                                        {
                                            backgroundColor: activeIndex === index
                                                ? currentSlide.accentColor
                                                : 'rgba(255,255,255,0.15)',
                                            width: activeIndex === index ? 40 : 12,
                                        },
                                    ]}
                                />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonsContainer}>
                    {activeIndex < SLIDES.length - 1 ? (
                        <>
                            <TouchableOpacity
                                onPress={handleSkip}
                                style={styles.skipButton}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.skipText}>SKIP</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleNext}
                                style={styles.nextButton}
                                activeOpacity={0.85}
                            >
                                <LinearGradient
                                    colors={currentSlide.accentGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.nextButtonGradient}
                                >
                                    <Text style={styles.nextText}>NEXT</Text>
                                    <ChevronRight size={20} color="#000" strokeWidth={3} />
                                </LinearGradient>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity
                            onPress={handleNext}
                            style={styles.startButton}
                            activeOpacity={0.85}
                        >
                            <LinearGradient
                                colors={currentSlide.accentGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.startButtonGradient}
                            >
                                <Gamepad2 size={24} color="#000" strokeWidth={2.5} />
                                <Text style={styles.startText}>LET'S GO</Text>
                                <ArrowRight size={22} color="#000" strokeWidth={2.5} />
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0F',
    },

    // Grid pattern
    gridOverlay: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    gridLine: {
        position: 'absolute',
        backgroundColor: '#FFF',
    },
    gridLineH: {
        left: 0,
        right: 0,
        height: 1,
    },
    gridLineV: {
        top: 0,
        bottom: 0,
        width: 1,
    },

    // Accent glow
    accentGlow: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        top: height * 0.15,
        left: width * 0.5 - 150,
        opacity: 0.8,
    },
    accentGlowBottom: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        bottom: height * 0.1,
        right: -60,
        opacity: 0.4,
    },

    // Slide counter (top right)
    slideCounter: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 64 : 52,
        right: 28,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    slideCounterText: {
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: 2,
    },
    slideCounterDivider: {
        width: 24,
        height: 2,
        justifyContent: 'center',
    },
    slideCounterLine: {
        height: 2,
        width: '100%',
        borderRadius: 1,
    },
    slideCounterTotal: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.25)',
        letterSpacing: 2,
    },

    // Main content
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 36,
    },

    // Icon section
    iconSection: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 48,
    },
    iconOuterRing: {
        width: 180,
        height: 180,
        borderRadius: 90,
        borderWidth: 1,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconMiddleRing: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    secondaryIconWrap: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },

    // Title
    titleSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    accentLine: {
        height: 3,
        borderRadius: 2,
        marginBottom: 20,
        maxWidth: 80,
    },
    title: {
        fontSize: 52,
        fontWeight: '900',
        color: '#FFF',
        textAlign: 'center',
        letterSpacing: 4,
        lineHeight: 58,
    },

    // Subtitle
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        lineHeight: 24,
        letterSpacing: 0.5,
        fontWeight: '500',
    },

    // Bottom
    bottomSection: {
        paddingHorizontal: 28,
        paddingBottom: Platform.OS === 'ios' ? 52 : 36,
    },

    // Progress
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 36,
        gap: 8,
    },
    progressTouchArea: {
        padding: 6,
    },
    progressTrack: {
        height: 4,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },

    // Buttons
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
    },
    skipButton: {
        paddingVertical: 18,
        paddingHorizontal: 24,
    },
    skipText: {
        color: 'rgba(255,255,255,0.35)',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 2,
    },
    nextButton: {
        borderRadius: 50,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
    },
    nextButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 36,
        gap: 8,
    },
    nextText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 2,
    },
    startButton: {
        flex: 1,
        borderRadius: 50,
        overflow: 'hidden',
        elevation: 12,
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
    },
    startButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        gap: 14,
    },
    startText: {
        color: '#000',
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: 3,
    },
});
