import React, { useState, useCallback, memo } from 'react';
import { StyleSheet, View, TextInput, Text, Platform, Pressable } from 'react-native';
import { MotiView } from 'moti';
import { MotiPressable } from 'moti/interactions';
import { Plus, X, UserPlus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { layout } from '../theme/layout';
import { SPRING_SNAPPY, PRESS_SCALE } from '../lib/animations';

// Memoized player chip for performance
const PlayerChip = memo(({ player, isCurrentUser, isKurdish, colors, onRemove, rowDirection }) => {
    const handlePress = useCallback(() => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onRemove();
    }, [onRemove]);

    return (
        <MotiPressable
            onPress={handlePress}
            animate={({ pressed }) => {
                'worklet';
                return {
                    scale: pressed ? 0.92 : 1,
                    opacity: pressed ? 0.8 : 1,
                };
            }}
            transition={SPRING_SNAPPY}
            style={[
                styles.playerChip,
                {
                    flexDirection: rowDirection,
                    backgroundColor: isCurrentUser ? colors.accent + '20' : colors.surfaceHighlight,
                    borderColor: isCurrentUser ? colors.accent : colors.border,
                }
            ]}
        >
            <Text style={[
                styles.playerName,
                { color: isCurrentUser ? colors.accent : colors.text.primary }
            ]}>
                {player}{isCurrentUser ? (isKurdish ? ' (من)' : ' (me)') : ''}
            </Text>
            <X size={14} color={isCurrentUser ? colors.accent : colors.text.muted} style={{ marginHorizontal: 4 }} />
        </MotiPressable>
    );
});

export default function PlayerInput({
    players,
    setPlayers,
    maxPlayers = 10,
    minPlayers = 2,
    isKurdish = false,
    placeholder,
    onAdd,
}) {
    const [newName, setNewName] = useState('');
    const { colors, isRTL } = useTheme();
    const { profile, user } = useAuth();

    const currentUserName = profile?.username || user?.user_metadata?.username || (user?.email ? user.email.split('@')[0] : null);

    const rowDirection = isKurdish ? 'row-reverse' : 'row';
    const alignStyle = isKurdish ? 'right' : 'left';

    const addPlayer = useCallback((name) => {
        if (onAdd) {
            onAdd(name);
        } else if (setPlayers) {
            if (players.length < maxPlayers && !players.includes(name)) {
                setPlayers([...players, name]);
            }
        }
        setNewName('');
    }, [onAdd, setPlayers, players, maxPlayers]);

    const handleAdd = useCallback(() => {
        if (newName.trim()) {
            if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            addPlayer(newName.trim());
        }
    }, [newName, addPlayer]);

    const handleAddMe = useCallback(() => {
        if (currentUserName && !players.includes(currentUserName) && players.length < maxPlayers) {
            if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            addPlayer(currentUserName);
        }
    }, [currentUserName, players, maxPlayers, addPlayer]);

    const removePlayer = useCallback((index) => {
        setPlayers(players.filter((_, i) => i !== index));
    }, [players, setPlayers]);

    const count = players ? players.length : 0;
    const canAddMe = currentUserName && !players.includes(currentUserName) && count < maxPlayers;
    const canAdd = newName.trim() && (!players || count < maxPlayers);

    return (
        <View style={styles.container}>
            {players && (
                <View style={[styles.labelRow, { flexDirection: rowDirection }]}>
                    <Text style={[styles.label, { color: colors.text.secondary }]}>
                        {isKurdish
                            ? `یاریزانەکان (${count}/${maxPlayers})`
                            : `Players (${count}/${maxPlayers})`
                        }
                    </Text>
                    {canAddMe && (
                        <MotiPressable
                            onPress={handleAddMe}
                            animate={({ pressed }) => {
                                'worklet';
                                return {
                                    scale: pressed ? 0.95 : 1,
                                    opacity: pressed ? 0.8 : 1,
                                };
                            }}
                            transition={SPRING_SNAPPY}
                            style={[styles.addMeButton, { backgroundColor: colors.accent + '20', borderColor: colors.accent }]}
                        >
                            <UserPlus size={14} color={colors.accent} />
                            <Text style={[styles.addMeText, { color: colors.accent }]}>
                                {isKurdish ? 'خۆم زیاد بکە' : 'Add Me'}
                            </Text>
                        </MotiPressable>
                    )}
                </View>
            )}

            <View style={[styles.inputRow, { flexDirection: rowDirection }]}>
                <TextInput
                    style={[
                        styles.input,
                        {
                            textAlign: alignStyle,
                            backgroundColor: colors.surface,
                            color: colors.text.primary,
                            borderColor: colors.border
                        },
                        isKurdish && { fontFamily: 'System' }
                    ]}
                    placeholder={placeholder || (isKurdish ? "ناوی یاریزان" : "Enter name")}
                    placeholderTextColor={colors.text.muted}
                    value={newName}
                    onChangeText={setNewName}
                    onSubmitEditing={handleAdd}
                    returnKeyType="done"
                />
                <MotiPressable
                    onPress={handleAdd}
                    disabled={!canAdd}
                    animate={({ pressed }) => {
                        'worklet';
                        return {
                            scale: pressed && canAdd ? PRESS_SCALE : 1,
                            opacity: !canAdd ? 0.5 : pressed ? 0.9 : 1,
                        };
                    }}
                    transition={SPRING_SNAPPY}
                    style={[styles.addButton, { backgroundColor: colors.brand.gold }]}
                >
                    <Plus size={24} color="#FFF" />
                </MotiPressable>
            </View>

            {players && (
                <MotiView
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: 'timing', duration: 200 }}
                    style={[styles.playersList, { flexDirection: rowDirection, flexWrap: 'wrap' }]}
                >
                    {players.map((player, index) => (
                        <PlayerChip
                            key={`${player}-${index}`}
                            player={player}
                            isCurrentUser={player === currentUserName}
                            isKurdish={isKurdish}
                            colors={colors}
                            rowDirection={rowDirection}
                            onRemove={() => removePlayer(index)}
                        />
                    ))}
                </MotiView>
            )}

            {players && count < minPlayers && (
                <Text style={[styles.hint, { textAlign: alignStyle, color: colors.brand.crimson }]}>
                    {isKurdish
                        ? `${minPlayers - count} یاریزانی تر زیاد بکە`
                        : `Add ${minPlayers - count} more player${(minPlayers - count) > 1 ? 's' : ''}`
                    }
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: layout.spacing.lg,
    },
    labelRow: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
    addMeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: layout.radius.full,
        borderWidth: 1,
        gap: 6,
    },
    addMeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    inputRow: {
        gap: 8,
    },
    input: {
        flex: 1,
        borderRadius: layout.radius.lg,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        borderWidth: 1,
    },
    addButton: {
        width: 48,
        height: 48,
        borderRadius: layout.radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playersList: {
        marginTop: 12,
        gap: 8,
    },
    playerChip: {
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: layout.radius.full,
        borderWidth: 1,
    },
    playerName: {
        fontSize: 14,
        fontWeight: '500',
    },
    hint: {
        fontSize: 12,
        marginTop: 8,
    }
});
