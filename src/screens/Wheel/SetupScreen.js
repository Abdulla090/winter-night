import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground, Button, PlayerInput } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../localization/translations';

export default function SetupScreen({ navigation }) {
    const { language, isKurdish } = useLanguage();
    const { theme } = useTheme();
    const [options, setOptions] = useState([]);
    const [currentInput, setCurrentInput] = useState('');

    const handleAddOption = (text) => {
        if (!text.trim()) return;
        if (options.length >= 20) {
            Alert.alert('Limit Reached', 'Maximum 20 options allowed');
            return;
        }
        setOptions([...options, text.trim()]);
    };

    const handleRemoveOption = (index) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        setOptions(newOptions);
    };

    const handleStartGame = () => {
        if (options.length < 2) {
            Alert.alert('Error', 'Add at least 2 options to spin');
            return;
        }
        navigation.navigate('WheelPlay', { options });
    };

    const rtlStyles = {
        textAlign: isKurdish ? 'right' : 'left',
        writingDirection: isKurdish ? 'rtl' : 'ltr',
    };
    const rowDirection = isKurdish ? 'row-reverse' : 'row';

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={[styles.header, { flexDirection: rowDirection }]}>
                    <TouchableOpacity
                        style={[styles.backButton, { backgroundColor: theme.background.card }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name={isKurdish ? "arrow-forward" : "arrow-back"} size={24} color={theme.text.primary} />
                    </TouchableOpacity>
                    <Text style={[styles.title, rtlStyles, isKurdish && styles.kurdishFont, { color: theme.text.primary }]}>
                        {t('wheel.title', language) || "Wheel of Fortune"}
                    </Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                    <Text style={[styles.subtitle, rtlStyles, isKurdish && styles.kurdishFont, { color: theme.text.secondary }]}>
                        {t('wheel.setupDescription', language) || "Add names or items to the wheel"}
                    </Text>

                    {/* Input */}
                    <View style={styles.inputContainer}>
                        <PlayerInput
                            placeholder={t('wheel.inputPlaceholder', language) || "Enter option..."}
                            onAdd={handleAddOption}
                            isKurdish={isKurdish}
                        />
                    </View>

                    {/* Options List */}
                    <View style={styles.listContainer}>
                        {options.map((option, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.optionItem,
                                    { flexDirection: rowDirection, backgroundColor: theme.background.card, borderColor: theme.background.border }
                                ]}
                            >
                                <View style={[styles.optionBadge, { backgroundColor: COLORS.games.wheel || '#ec4899' }]}>
                                    <Text style={styles.optionIndex}>{index + 1}</Text>
                                </View>
                                <Text style={[styles.optionText, rtlStyles, { color: theme.text.primary }]}>
                                    {option}
                                </Text>
                                <TouchableOpacity onPress={() => handleRemoveOption(index)}>
                                    <Ionicons name="close-circle" size={24} color={COLORS.accent.danger} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </ScrollView>

                <View style={[styles.footer, { backgroundColor: theme.background.card }]}>
                    <Button
                        title={t('common.start', language)}
                        onPress={handleStartGame}
                        disabled={options.length < 2}
                        gradient={options.length >= 2 ? [COLORS.games.wheel || '#ec4899', '#db2777'] : undefined}
                        isKurdish={isKurdish}
                    />
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholder: { width: 44 },
    title: {
        ...FONTS.title,
        fontSize: 24,
    },
    content: { flex: 1 },
    scrollContent: { padding: SPACING.lg },
    subtitle: {
        ...FONTS.regular,
        fontSize: 16,
        marginBottom: SPACING.xl,
    },
    inputContainer: { marginBottom: SPACING.lg },
    listContainer: { gap: SPACING.sm },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        gap: SPACING.md,
    },
    optionBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionIndex: {
        color: '#FFF',
        ...FONTS.bold,
        fontSize: 14,
    },
    optionText: {
        flex: 1,
        ...FONTS.medium,
        fontSize: 16,
    },
    footer: {
        padding: SPACING.lg,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    kurdishFont: { fontFamily: 'Rabar' },
});
