import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS, SPACING, FONTS } from '../constants/theme';
import { t } from '../localization/translations';

export default function PlayerInput({
    players,
    setPlayers,
    maxPlayers = 10,
    minPlayers = 2,
    isKurdish = false,
    language = 'en',
    onAdd, // New prop for generic adding
    placeholder, // New prop for placeholder text
}) {
    const [newName, setNewName] = useState('');

    // RTL styles
    const rtlStyles = {
        textAlign: isKurdish ? 'right' : 'left',
        writingDirection: isKurdish ? 'rtl' : 'ltr',
    };
    const rowDirection = isKurdish ? 'row-reverse' : 'row';

    const handleAdd = () => {
        if (newName.trim()) {
            if (onAdd) {
                // If generic onAdd is provided (e.g. Wheel Game)
                onAdd(newName.trim());
            } else if (setPlayers) {
                // Legacy support for player list
                if (players.length < maxPlayers) {
                    setPlayers([...players, newName.trim()]);
                }
            }
            setNewName('');
        }
    };

    // Calculate length safely
    const count = players ? players.length : 0;

    const removePlayer = (index) => {
        setPlayers(players.filter((_, i) => i !== index));
    };

    // Get hint text
    const getHintText = () => {
        const remaining = minPlayers - players.length;
        if (isKurdish) {
            return `${remaining} یاریزانی تر زیاد بکە`;
        }
        return `Add at least ${remaining} more player${remaining > 1 ? 's' : ''}`;
    };

    return (
        <View style={styles.container}>
            {/* Standard Label only if players list is used */}
            {players && (
                <Text style={[styles.label, rtlStyles, isKurdish && styles.kurdishFont]}>
                    {isKurdish ? `یاریزانەکان (${count}/${maxPlayers})` : `Players (${count}/${maxPlayers})`}
                </Text>
            )}

            <View style={[styles.inputRow, { flexDirection: rowDirection }]}>
                <TextInput
                    style={[
                        styles.input,
                        rtlStyles,
                        isKurdish && styles.kurdishFont
                    ]}
                    placeholder={placeholder || t('common.enterName', language)}
                    placeholderTextColor={COLORS.text.muted}
                    value={newName}
                    onChangeText={setNewName}
                    onSubmitEditing={handleAdd}
                />
                <TouchableOpacity
                    style={[styles.addButton, (!newName.trim() || (players && count >= maxPlayers)) && styles.disabled]}
                    onPress={handleAdd}
                    disabled={!newName.trim() || (players && count >= maxPlayers)}
                >
                    <Ionicons name="add" size={24} color={COLORS.text.primary} />
                </TouchableOpacity>
            </View>

            {players && (
                <View style={[styles.playersList, { flexDirection: rowDirection, flexWrap: 'wrap' }]}>
                    {players.map((player, index) => (
                        <View key={index} style={[styles.playerChip, { flexDirection: rowDirection }]}>
                            <Text style={[styles.playerName, isKurdish && styles.kurdishFont]}>{player}</Text>
                            <TouchableOpacity onPress={() => removePlayer(index)}>
                                <Ionicons name="close-circle" size={20} color={COLORS.text.secondary} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}

            {players && count < minPlayers && (
                <Text style={[styles.hint, rtlStyles, isKurdish && styles.kurdishFont]}>
                    {getHintText()}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.lg,
    },
    label: {
        color: COLORS.text.secondary,
        ...FONTS.medium,
        marginBottom: SPACING.sm,
    },
    inputRow: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    input: {
        flex: 1,
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        color: COLORS.text.primary,
        ...FONTS.regular,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    addButton: {
        backgroundColor: COLORS.accent.primary,
        width: 50,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabled: {
        opacity: 0.5,
    },
    playersList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
        marginTop: SPACING.md,
    },
    playerChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background.card,
        paddingVertical: SPACING.xs,
        paddingLeft: SPACING.md,
        paddingRight: SPACING.sm,
        borderRadius: BORDER_RADIUS.round,
        gap: SPACING.xs,
    },
    playerName: {
        color: COLORS.text.primary,
        ...FONTS.medium,
    },
    hint: {
        color: COLORS.accent.warning,
        ...FONTS.caption,
        marginTop: SPACING.sm,
    },
    kurdishFont: {
        fontFamily: 'Rabar',
    },
});
