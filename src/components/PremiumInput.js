import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { useTheme } from '../context/ThemeContext';
import { layout } from '../theme/layout';

export const PremiumInput = ({ label, value, onChangeText, placeholder, ...props }) => {
    const { colors, isRTL } = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.container}>
            {label && (
                <Text style={[
                    styles.label,
                    {
                        color: isFocused ? colors.brand.gold : colors.text.secondary,
                        textAlign: isRTL ? 'right' : 'left'
                    }
                ]}>
                    {label}
                </Text>
            )}
            <MotiView
                animate={{
                    borderColor: isFocused ? colors.brand.gold : colors.border,
                    borderWidth: isFocused ? 2 : 1,
                    scale: isFocused ? 1.01 : 1,
                    backgroundColor: colors.surface,
                }}
                transition={{ type: 'timing', duration: 200 }}
                style={[
                    styles.inputContainer,
                    {
                        borderRadius: layout.radius.xl, // Rounder for Beast mode
                        paddingHorizontal: layout.spacing.md,
                        paddingVertical: layout.spacing.sm + 4,
                    }
                ]}
            >
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.text.muted}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    selectionColor={colors.brand.gold}
                    style={[
                        styles.input,
                        {
                            color: colors.text.primary,
                            textAlign: isRTL ? 'right' : 'left',
                            fontFamily: 'System',
                        }
                    ]}
                    {...props}
                />
            </MotiView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: layout.spacing.lg,
    },
    label: {
        marginBottom: layout.spacing.xs + 2,
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    inputContainer: {
        // styles handled by Moti
    },
    input: {
        fontSize: 16,
        fontWeight: '500',
    }
});
