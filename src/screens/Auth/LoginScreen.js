import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export default function LoginScreen({ navigation }) {
    const { signIn, loading } = useAuth();
    const { theme } = useTheme();
    const { isKurdish } = useLanguage();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert(
                isKurdish ? 'هەڵە' : 'Error',
                isKurdish ? 'تکایە هەموو خانەکان پڕبکەوە' : 'Please fill in all fields'
            );
            return;
        }

        const { error } = await signIn(email, password);

        if (error) {
            Alert.alert(
                isKurdish ? 'چوونەژوورەوە سەرکەوتوو نەبوو' : 'Login Failed',
                error.message
            );
        } else {
            navigation.replace('Home');
        }
    };

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    {/* Back Button */}
                    <TouchableOpacity
                        style={[styles.backBtn, { backgroundColor: theme.background.card }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons
                            name={isKurdish ? 'arrow-forward' : 'arrow-back'}
                            size={24}
                            color={theme.text.primary}
                        />
                    </TouchableOpacity>

                    {/* Header */}
                    <View style={styles.header}>
                        <Ionicons name="game-controller" size={60} color={theme.colors.primary} />
                        <Text style={[styles.title, { color: theme.text.primary }]}>
                            {isKurdish ? 'چوونەژوورەوە' : 'Welcome Back'}
                        </Text>
                        <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
                            {isKurdish ? 'بچۆ ژوورەوە بۆ یاری کردن' : 'Sign in to play with friends'}
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <View style={[styles.inputContainer, { backgroundColor: theme.background.card, borderColor: theme.background.border }]}>
                            <Ionicons name="mail-outline" size={20} color={theme.text.secondary} />
                            <TextInput
                                style={[styles.input, { color: theme.text.primary }]}
                                placeholder={isKurdish ? 'ئیمەیڵ' : 'Email'}
                                placeholderTextColor={theme.text.secondary}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={[styles.inputContainer, { backgroundColor: theme.background.card, borderColor: theme.background.border }]}>
                            <Ionicons name="lock-closed-outline" size={20} color={theme.text.secondary} />
                            <TextInput
                                style={[styles.input, { color: theme.text.primary }]}
                                placeholder={isKurdish ? 'وشەی نهێنی' : 'Password'}
                                placeholderTextColor={theme.text.secondary}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color={theme.text.secondary}
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[styles.primaryBtn, { backgroundColor: theme.colors.primary }]}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.primaryBtnText}>
                                    {isKurdish ? 'چوونەژوورەوە' : 'Sign In'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Sign Up Link */}
                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: theme.text.secondary }]}>
                            {isKurdish ? 'هەژمارت نییە؟' : "Don't have an account?"}
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                            <Text style={[styles.linkText, { color: theme.colors.primary }]}>
                                {isKurdish ? 'تۆمارکردن' : 'Sign Up'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    keyboardView: { flex: 1, paddingHorizontal: SPACING.lg },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SPACING.md,
    },
    header: {
        alignItems: 'center',
        marginTop: SPACING.xl * 2,
        marginBottom: SPACING.xl,
    },
    title: {
        ...FONTS.bold,
        fontSize: 28,
        marginTop: SPACING.lg,
    },
    subtitle: {
        ...FONTS.regular,
        fontSize: 15,
        marginTop: SPACING.sm,
    },
    form: {
        gap: SPACING.md,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        height: 56,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        gap: SPACING.sm,
    },
    input: {
        flex: 1,
        ...FONTS.regular,
        fontSize: 16,
    },
    primaryBtn: {
        height: 56,
        borderRadius: BORDER_RADIUS.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SPACING.sm,
    },
    primaryBtnText: {
        ...FONTS.bold,
        fontSize: 16,
        color: '#FFF',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.xl,
        gap: SPACING.xs,
    },
    footerText: {
        ...FONTS.regular,
        fontSize: 14,
    },
    linkText: {
        ...FONTS.bold,
        fontSize: 14,
    },
});
