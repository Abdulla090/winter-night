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
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export default function SignUpScreen({ navigation }) {
    const { signUp, loading } = useAuth();
    const { theme } = useTheme();
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
            // User is auto-logged-in since email confirmation is disabled
            Alert.alert(
                isKurdish ? 'سەرکەوتوو بوو!' : 'Welcome!',
                isKurdish ? 'هەژمارت دروستکرا. ئێستا دەتوانیت یاری بکەیت!' : 'Account created. You can now play!',
                [{ text: 'OK', onPress: () => navigation.replace('Home') }]
            );
        }
    };

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView showsVerticalScrollIndicator={false}>
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
                            <Ionicons name="person-add" size={60} color={theme.colors.primary} />
                            <Text style={[styles.title, { color: theme.text.primary }]}>
                                {isKurdish ? 'تۆمارکردن' : 'Create Account'}
                            </Text>
                            <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
                                {isKurdish ? 'هەژمارێک دروستبکە بۆ یاری لەگەڵ هاوڕێکانت' : 'Join to play with friends & family'}
                            </Text>
                        </View>

                        {/* Form */}
                        <View style={styles.form}>
                            <View style={[styles.inputContainer, { backgroundColor: theme.background.card, borderColor: theme.background.border }]}>
                                <Ionicons name="person-outline" size={20} color={theme.text.secondary} />
                                <TextInput
                                    style={[styles.input, { color: theme.text.primary }]}
                                    placeholder={isKurdish ? 'ناوی بەکارهێنەر' : 'Username'}
                                    placeholderTextColor={theme.text.secondary}
                                    value={username}
                                    onChangeText={setUsername}
                                    autoCapitalize="none"
                                />
                            </View>

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

                            <View style={[styles.inputContainer, { backgroundColor: theme.background.card, borderColor: theme.background.border }]}>
                                <Ionicons name="lock-closed-outline" size={20} color={theme.text.secondary} />
                                <TextInput
                                    style={[styles.input, { color: theme.text.primary }]}
                                    placeholder={isKurdish ? 'دووبارەکردنەوەی وشەی نهێنی' : 'Confirm Password'}
                                    placeholderTextColor={theme.text.secondary}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showPassword}
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.primaryBtn, { backgroundColor: theme.colors.primary }]}
                                onPress={handleSignUp}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFF" />
                                ) : (
                                    <Text style={styles.primaryBtnText}>
                                        {isKurdish ? 'تۆمارکردن' : 'Create Account'}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Sign In Link */}
                        <View style={styles.footer}>
                            <Text style={[styles.footerText, { color: theme.text.secondary }]}>
                                {isKurdish ? 'پێشتر هەژمارت هەیە؟' : 'Already have an account?'}
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={[styles.linkText, { color: theme.colors.primary }]}>
                                    {isKurdish ? 'چوونەژوورەوە' : 'Sign In'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ height: 40 }} />
                    </ScrollView>
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
        marginTop: SPACING.xl,
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
        textAlign: 'center',
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
