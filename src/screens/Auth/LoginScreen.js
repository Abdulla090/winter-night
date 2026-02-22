import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
    Animated,
} from 'react-native';
import { Mail, Lock, Eye, EyeOff, Gamepad2 } from 'lucide-react-native';

import { AnimatedScreen, BeastButton, GlassCard, BackButton } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { layout } from '../../theme/layout';

export default function LoginScreen({ navigation }) {
    const { signIn, loading } = useAuth();
    const { colors, isRTL } = useTheme();
    const { isKurdish } = useLanguage();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert(
                isKurdish ? 'هەڵە' : 'Error',
                isKurdish ? 'تکایە هەموو خانەکان پڕبکەوە' : 'Please fill in all fields'
            );
            return;
        }

        console.log('Attempting login with:', email);
        setIsLoggingIn(true);

        try {
            const { data, error } = await signIn(email, password);
            console.log('Login result:', { data, error });

            if (error) {
                console.log('Login error:', error);
                Alert.alert(
                    isKurdish ? 'چوونەژوورەوە سەرکەوتوو نەبوو' : 'Login Failed',
                    error.message || 'Invalid credentials'
                );
            } else if (data?.user) {
                console.log('Login successful! User:', data.user.email);
                Alert.alert(
                    isKurdish ? 'سەرکەوتوو' : 'Success',
                    isKurdish ? 'چوویتەوە ژوورەوە' : 'Login successful!',
                    [{ text: 'OK', onPress: () => navigation.replace('Home') }]
                );
            } else {
                console.log('No user returned, but no error either');
                navigation.replace('Home');
            }
        } catch (err) {
            console.log('Caught error during login:', err);
            Alert.alert('Error', err.message || 'Something went wrong');
        } finally {
            setIsLoggingIn(false);
        }
    };

    const rowDirection = isRTL ? 'row-reverse' : 'row';

    // Native fade-in animation (replaces MotiView)
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <AnimatedScreen>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                {/* Header */}
                <View style={[styles.header, { flexDirection: rowDirection }]}>
                    <BackButton onPress={() => navigation.goBack()} />
                    <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                        {isKurdish ? 'چوونەژوورەوە' : 'Sign In'}
                    </Text>
                    <View style={{ width: 44 }} />
                </View>

                {/* Hero */}
                <Animated.View
                    style={[styles.heroContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
                >
                    <View style={[styles.heroIcon, { backgroundColor: colors.accent + '20' }]}>
                        <Gamepad2 size={48} color={colors.accent} strokeWidth={1.5} />
                    </View>
                    <Text style={[styles.title, { color: colors.text.primary }]}>
                        {isKurdish ? 'بەخێربێیتەوە' : 'Welcome Back'}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                        {isKurdish ? 'بچۆ ژوورەوە بۆ یاری کردن' : 'Sign in to play with friends'}
                    </Text>
                </Animated.View>

                {/* Form */}
                <GlassCard style={styles.formCard}>
                    <View style={[styles.inputContainer, { flexDirection: rowDirection }]}>
                        <Mail size={20} color={colors.text.muted} />
                        <TextInput
                            style={[styles.input, { color: colors.text.primary, textAlign: isRTL ? 'right' : 'left' }]}
                            placeholder={isKurdish ? 'ئیمەیڵ' : 'Email'}
                            placeholderTextColor={colors.text.muted}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={[styles.inputContainer, { flexDirection: rowDirection }]}>
                        <Lock size={20} color={colors.text.muted} />
                        <TextInput
                            style={[styles.input, { color: colors.text.primary, textAlign: isRTL ? 'right' : 'left' }]}
                            placeholder={isKurdish ? 'وشەی نهێنی' : 'Password'}
                            placeholderTextColor={colors.text.muted}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            {showPassword ?
                                <EyeOff size={20} color={colors.text.muted} /> :
                                <Eye size={20} color={colors.text.muted} />
                            }
                        </TouchableOpacity>
                    </View>
                </GlassCard>

                <BeastButton
                    title={isLoggingIn ? (isKurdish ? 'چاوەڕوان بە...' : 'Signing In...') : (isKurdish ? 'چوونەژوورەوە' : 'Sign In')}
                    onPress={handleLogin}
                    variant="primary"
                    size="lg"
                    disabled={isLoggingIn}
                    style={{ marginTop: layout.spacing.xl, opacity: isLoggingIn ? 0.7 : 1 }}
                />

                {/* Sign Up Link */}
                <View style={[styles.footer, { flexDirection: rowDirection }]}>
                    <Text style={[styles.footerText, { color: colors.text.secondary }]}>
                        {isKurdish ? 'هەژمارت نییە؟' : "Don't have an account?"}
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <Text style={[styles.linkText, { color: colors.accent }]}>
                            {isKurdish ? 'تۆمارکردن' : 'Sign Up'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: layout.spacing.md,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    heroContainer: {
        alignItems: 'center',
        marginVertical: layout.spacing.xl,
    },
    heroIcon: {
        width: 96,
        height: 96,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: layout.spacing.lg,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: layout.spacing.sm,
    },
    subtitle: {
        fontSize: 15,
        textAlign: 'center',
    },
    formCard: {
        gap: layout.spacing.md,
    },
    inputContainer: {
        alignItems: 'center',
        gap: layout.spacing.sm,
        paddingVertical: layout.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    footer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: layout.spacing.xl,
        gap: layout.spacing.xs,
    },
    footerText: {
        fontSize: 14,
    },
    linkText: {
        fontSize: 14,
        fontWeight: '700',
    },
});
