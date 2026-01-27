import React, { useState } from 'react';
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
    ScrollView,
} from 'react-native';
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react-native';
import { MotiView } from 'moti';

import { AnimatedScreen, BeastButton, GlassCard, BackButton } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { layout } from '../../theme/layout';

export default function SignUpScreen({ navigation }) {
    const { signUp, loading } = useAuth();
    const { colors, isRTL } = useTheme();
    const { isKurdish } = useLanguage();

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSignUp = async () => {
        if (!email || !username || !password || !confirmPassword) {
            Alert.alert(
                isKurdish ? 'هەڵە' : 'Error',
                isKurdish ? 'تکایە هەموو خانەکان پڕبکەوە' : 'Please fill in all fields'
            );
            return;
        }

        if (username.length < 3) {
            Alert.alert(
                isKurdish ? 'هەڵە' : 'Error',
                isKurdish ? 'ناوی بەکارهێنەر دەبێت لانیکەم ٣ پیت بێت' : 'Username must be at least 3 characters'
            );
            return;
        }

        if (password.length < 6) {
            Alert.alert(
                isKurdish ? 'هەڵە' : 'Error',
                isKurdish ? 'وشەی نهێنی دەبێت لانیکەم ٦ پیت بێت' : 'Password must be at least 6 characters'
            );
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert(
                isKurdish ? 'هەڵە' : 'Error',
                isKurdish ? 'وشە نهێنییەکان یەک ناگرنەوە' : 'Passwords do not match'
            );
            return;
        }

        const { data, error } = await signUp(email, password, username);

        if (error) {
            Alert.alert(
                isKurdish ? 'تۆمارکردن سەرکەوتوو نەبوو' : 'Sign Up Failed',
                error.message
            );
        } else {
            Alert.alert(
                isKurdish ? 'سەرکەوتوو بوو!' : 'Welcome!',
                isKurdish ? 'هەژمارت دروستکرا. ئێستا دەتوانیت یاری بکەیت!' : 'Account created. You can now play!',
                [{ text: 'OK', onPress: () => navigation.replace('Home') }]
            );
        }
    };

    const rowDirection = isRTL ? 'row-reverse' : 'row';

    return (
        <AnimatedScreen>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={[styles.header, { flexDirection: rowDirection }]}>
                        <BackButton onPress={() => navigation.goBack()} />
                        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                            {isKurdish ? 'تۆمارکردن' : 'Sign Up'}
                        </Text>
                        <View style={{ width: 44 }} />
                    </View>

                    {/* Hero */}
                    <MotiView
                        from={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={styles.heroContainer}
                    >
                        <View style={[styles.heroIcon, { backgroundColor: colors.accent + '20' }]}>
                            <UserPlus size={48} color={colors.accent} strokeWidth={1.5} />
                        </View>
                        <Text style={[styles.title, { color: colors.text.primary }]}>
                            {isKurdish ? 'تۆمارکردن' : 'Create Account'}
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                            {isKurdish ? 'هەژمارێک دروستبکە بۆ یاری لەگەڵ هاوڕێکانت' : 'Join to play with friends & family'}
                        </Text>
                    </MotiView>

                    {/* Form */}
                    <GlassCard style={styles.formCard}>
                        <View style={[styles.inputContainer, { flexDirection: rowDirection }]}>
                            <User size={20} color={colors.text.muted} />
                            <TextInput
                                style={[styles.input, { color: colors.text.primary, textAlign: isRTL ? 'right' : 'left' }]}
                                placeholder={isKurdish ? 'ناوی بەکارهێنەر' : 'Username'}
                                placeholderTextColor={colors.text.muted}
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                            />
                        </View>

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

                        <View style={[styles.inputContainer, { flexDirection: rowDirection }]}>
                            <Lock size={20} color={colors.text.muted} />
                            <TextInput
                                style={[styles.input, { color: colors.text.primary, textAlign: isRTL ? 'right' : 'left' }]}
                                placeholder={isKurdish ? 'دووبارەکردنەوەی وشەی نهێنی' : 'Confirm Password'}
                                placeholderTextColor={colors.text.muted}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showPassword}
                            />
                        </View>
                    </GlassCard>

                    <BeastButton
                        title={isKurdish ? 'تۆمارکردن' : 'Create Account'}
                        onPress={handleSignUp}
                        variant="primary"
                        size="lg"
                        icon={UserPlus}
                        style={{ marginTop: layout.spacing.xl }}
                    />

                    {/* Sign In Link */}
                    <View style={[styles.footer, { flexDirection: rowDirection }]}>
                        <Text style={[styles.footerText, { color: colors.text.secondary }]}>
                            {isKurdish ? 'پێشتر هەژمارت هەیە؟' : 'Already have an account?'}
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={[styles.linkText, { color: colors.accent }]}>
                                {isKurdish ? 'چوونەژوورەوە' : 'Sign In'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>
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
        marginVertical: layout.spacing.lg,
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
