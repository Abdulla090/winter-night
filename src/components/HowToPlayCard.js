import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * HowToPlayCard — RTL-aware how-to-play section used by all SetupScreens.
 *
 * Props:
 *  icon         – React element (pre-rendered icon)
 *  title        – already-translated title string
 *  contentEN    – English bullet string ("• step1\n• step2")
 *  contentKU    – Kurdish bullet string ("• ئامانجێک\n• هەنگاوی دووەم")
 *  isKurdish    – boolean
 *  colors       – theme colors from useTheme()
 *  isDark       – boolean from useTheme()
 *  containerStyle – optional extra style for the outer View
 */
export default function HowToPlayCard({
    icon,
    title,
    contentEN,
    contentKU,
    isKurdish,
    colors,
    isDark,
    containerStyle,
}) {
    const raw = isKurdish ? contentKU : contentEN;

    // Split into lines, strip leading "• " and whitespace
    const steps = raw
        .split('\n')
        .map((l) => l.replace(/^[•\s]+/, '').trim())
        .filter(Boolean);

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: isDark ? '#1A0B2E' : '#FFF' },
                containerStyle,
            ]}
        >
            {/* Title row – icon + label, flipped in RTL */}
            <View style={[styles.titleRow, isKurdish && styles.titleRowRTL]}>
                {icon}
                <Text
                    style={[
                        styles.title,
                        { color: colors.text.primary },
                        isKurdish && styles.kurdishFont,
                    ]}
                >
                    {title}
                </Text>
            </View>

            {/* Bullet rows */}
            {steps.map((step, i) => (
                <View
                    key={i}
                    style={[styles.stepRow, isKurdish && styles.stepRowRTL]}
                >
                    {/* Bullet always stays on the outer edge */}
                    <Text style={[styles.bullet, { color: colors.text.muted }]}>
                        •
                    </Text>
                    <Text
                        style={[
                            styles.stepText,
                            { color: colors.text.secondary },
                            isKurdish && styles.kurdishFont,
                            isKurdish && { textAlign: 'right' },
                        ]}
                    >
                        {step}
                    </Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        marginBottom: 24,
        gap: 0,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 14,
    },
    titleRowRTL: {
        flexDirection: 'row-reverse',
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginBottom: 8,
    },
    stepRowRTL: {
        flexDirection: 'row-reverse',
    },
    bullet: {
        fontSize: 16,
        lineHeight: 22,
        width: 14,
    },
    stepText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 22,
    },
    kurdishFont: {
        fontFamily: 'Rabar',
        fontWeight: 'normal',
        fontStyle: 'normal',
    },
});
