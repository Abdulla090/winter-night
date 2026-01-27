import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    StatusBar,
    Platform,
    ScrollView,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowRight, Gamepad2, Users, Zap, PartyPopper, Sparkles } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        title: 'Game Night',
        subtitle: '20+ party games in your pocket. No internet needed.',
        Icon: PartyPopper,
        gradient: ['#7C3AED', '#4C1D95'],
        accent: '#A78BFA',
    },
    {
        id: '2',
        title: 'Play Together',
        subtitle: 'Challenge friends, break the ice, create memories.',
        Icon: Users,
        gradient: ['#EC4899', '#BE185D'],
        accent: '#F9A8D4',
    },
    {
        id: '3',
        title: 'Jump In',
        subtitle: 'No ads. No registration. Just fun.',
        Icon: Zap,
        gradient: ['#10B981', '#059669'],
        accent: '#6EE7B7',
    },
];

export default function OnboardingScreen({ navigation }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollViewRef = useRef(null);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const currentSlide = SLIDES[activeIndex];

    const animateTransition = (callback) => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 0.3,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();

        setTimeout(callback, 100);
    };

    const goToSlide = (index) => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        animateTransition(() => setActiveIndex(index));
    };

    const handleNext = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
        finishOnboarding();
    };

    const Icon = currentSlide.Icon;

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            {/* Background Gradient */}
            <LinearGradient
                colors={currentSlide.gradient}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* Decorative Elements */}
            <View style={[styles.circle, styles.circle1, { backgroundColor: currentSlide.accent + '20' }]} />
            <View style={[styles.circle, styles.circle2, { backgroundColor: currentSlide.accent + '15' }]} />
            <View style={[styles.circle, styles.circle3, { backgroundColor: currentSlide.accent + '10' }]} />

            {/* Content */}
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                {/* Icon */}
                <View style={[styles.iconWrapper, { backgroundColor: currentSlide.accent + '30' }]}>
                    <View style={[styles.iconInner, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                        <Icon size={60} color="#FFF" strokeWidth={1.5} />
                    </View>
                </View>

                {/* Text */}
                <Text style={styles.title}>{currentSlide.title}</Text>
                <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>
            </Animated.View>

            {/* Bottom Section */}
            <View style={styles.bottomSection}>
                {/* Dots */}
                <View style={styles.dotsContainer}>
                    {SLIDES.map((_, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => goToSlide(index)}
                            style={[
                                styles.dot,
                                activeIndex === index && styles.dotActive,
                            ]}
                        />
                    ))}
                </View>

                {/* Buttons */}
                <View style={styles.buttonsContainer}>
                    {activeIndex < SLIDES.length - 1 ? (
                        <>
                            <TouchableOpacity
                                onPress={handleSkip}
                                style={styles.skipButton}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.skipText}>Skip</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleNext}
                                style={styles.nextButton}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.nextText}>Next</Text>
                                <ArrowRight size={18} color="#000" />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity
                            onPress={handleNext}
                            style={styles.startButton}
                            activeOpacity={0.8}
                        >
                            <Gamepad2 size={22} color="#000" />
                            <Text style={styles.startText}>Let's Play!</Text>
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
        backgroundColor: '#0F0518',
    },

    // Decorative circles
    circle: {
        position: 'absolute',
        borderRadius: 999,
    },
    circle1: {
        width: 400,
        height: 400,
        top: -150,
        right: -100,
    },
    circle2: {
        width: 300,
        height: 300,
        bottom: 100,
        left: -100,
    },
    circle3: {
        width: 200,
        height: 200,
        top: '40%',
        right: -50,
    },

    // Main content
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingTop: 60,
    },

    iconWrapper: {
        width: 160,
        height: 160,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    iconInner: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },

    title: {
        fontSize: 42,
        fontWeight: '800',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 16,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        lineHeight: 26,
        maxWidth: 300,
    },

    // Bottom section
    bottomSection: {
        paddingHorizontal: 24,
        paddingBottom: Platform.OS === 'ios' ? 50 : 40,
    },

    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
        gap: 10,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    dotActive: {
        width: 32,
        backgroundColor: '#FFF',
    },

    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
    },

    skipButton: {
        paddingVertical: 16,
        paddingHorizontal: 24,
    },
    skipText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 16,
        fontWeight: '600',
    },

    nextButton: {
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 50,
        gap: 8,
    },
    nextText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },

    startButton: {
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 40,
        borderRadius: 50,
        gap: 12,
        flex: 1,
    },
    startText: {
        color: '#000',
        fontSize: 18,
        fontWeight: '800',
    },
});
