import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Circle, X, Plus, Play } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { MotiView } from 'moti';

import { AnimatedScreen, BeastButton, GlassCard, PlayerInput, BackButton } from '../../components';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../localization/translations';
import { layout } from '../../theme/layout';
import { COLORS } from '../../constants/theme';

export default function SetupScreen({ navigation }) {
    const { language, isKurdish } = useLanguage();
    const { colors, isRTL } = useTheme();
    const [options, setOptions] = useState([]);

    const handleAddOption = (text) => {
        if (!text.trim()) return;
        if (options.length >= 20) {
            if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Alert.alert('Limit Reached', 'Maximum 20 options allowed');
            return;
        }
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setOptions([...options, text.trim()]);
    };

    const handleRemoveOption = (index) => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const newOptions = [...options];
        newOptions.splice(index, 1);
        setOptions(newOptions);
    };

    const handleStartGame = () => {
        if (options.length < 2) {
            if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Error', 'Add at least 2 options to spin');
            return;
        }
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        navigation.navigate('WheelPlay', { options });
    };

    const rowDirection = isRTL ? 'row-reverse' : 'row';
    const canStart = options.length >= 2;

    return (
        <AnimatedScreen>
            {/* Header */}
            <View style={[styles.header, { flexDirection: rowDirection }]}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={[styles.headerTitle, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                    {t('wheel.title', language) || "Wheel of Fortune"}
                </Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Hero Icon */}
                <MotiView
                    from={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ alignItems: 'center', marginBottom: layout.spacing.lg }}
                >
                    <View style={[styles.heroIcon, { backgroundColor: (COLORS.games?.wheel || '#ec4899') + '20' }]}>
                        <Circle size={48} color={COLORS.games?.wheel || '#ec4899'} strokeWidth={1.5} />
                    </View>
                </MotiView>

                <Text style={[styles.subtitle, { color: colors.text.secondary, textAlign: isRTL ? 'right' : 'left' }, isKurdish && styles.kurdishFont]}>
                    {t('wheel.setupDescription', language) || "Add names or items to the wheel"}
                </Text>

                {/* Input */}
                <GlassCard style={{ marginBottom: layout.spacing.lg }}>
                    <PlayerInput
                        placeholder={t('wheel.inputPlaceholder', language) || "Enter option..."}
                        onAdd={handleAddOption}
                        isKurdish={isKurdish}
                    />
                </GlassCard>

                {/* Options List */}
                <View style={styles.listContainer}>
                    {options.map((option, index) => (
                        <MotiView
                            key={index}
                            from={{ opacity: 0, translateY: 10 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ delay: index * 50 }}
                        >
                            <GlassCard style={[styles.optionItem, { flexDirection: rowDirection }]}>
                                <View style={[styles.optionBadge, { backgroundColor: COLORS.games?.wheel || '#ec4899' }]}>
                                    <Text style={styles.optionIndex}>{index + 1}</Text>
                                </View>
                                <Text style={[styles.optionText, { color: colors.text.primary, textAlign: isRTL ? 'right' : 'left' }]}>
                                    {option}
                                </Text>
                                <TouchableOpacity onPress={() => handleRemoveOption(index)}>
                                    <X size={20} color={colors.brand?.crimson || '#ef4444'} />
                                </TouchableOpacity>
                            </GlassCard>
                        </MotiView>
                    ))}
                </View>
            </ScrollView>

            {/* Start Button */}
            <MotiView
                animate={{ translateY: canStart ? 0 : 100, opacity: canStart ? 1 : 0 }}
                style={styles.fabContainer}
            >
                <BeastButton
                    title={t('common.start', language)}
                    onPress={handleStartGame}
                    variant="primary"
                    size="lg"
                    icon={Play}
                    style={{ width: '100%' }}
                />
            </MotiView>
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
    heroIcon: {
        width: 96,
        height: 96,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: layout.spacing.lg,
    },
    listContainer: {
        gap: layout.spacing.sm,
    },
    optionItem: {
        alignItems: 'center',
        gap: layout.spacing.md,
        paddingVertical: layout.spacing.sm,
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
        fontWeight: '700',
        fontSize: 14,
    },
    optionText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    fabContainer: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
    },
    kurdishFont: {
        fontFamily: 'Rabar',
    },
});
