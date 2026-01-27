import React, { useMemo } from 'react';
import { StyleSheet, Text, View, Dimensions, Platform } from 'react-native';
import { MotiView } from 'moti';
import { MotiPressable } from 'moti/interactions';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { layout } from '../theme/layout';

const { width } = Dimensions.get('window');

/**
 * ✨ GameCard - Premium animated game card
 * Smooth spring animations with staggered reveals
 */
export default function GameCard({
    title,
    description,
    players,
    icon,
    gradient,
    onPress,
    style,
    index = 0,
    isKurdish = false,
    layout: cardLayout = 'list',
    featured = false,
}) {
    const { colors, isRTL } = useTheme();
    const isGrid = cardLayout === 'grid';

    // Mapped gradient
    const cardGradient = useMemo(() => {
        if (Array.isArray(gradient)) return gradient[0];
        return gradient || colors.brand.primary;
    }, [gradient, colors]);

    const textAlign = isKurdish ? 'right' : 'left';
    const rowDirection = isKurdish ? 'row-reverse' : 'row';

    const handlePress = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress?.();
    };

    // Stagger delay - fast but noticeable
    const staggerDelay = Math.min(index * 40, 300);

    return (
        <MotiView
            from={{ opacity: 0, translateY: 16, scale: 0.98 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            transition={{
                type: 'spring',
                damping: 18,
                stiffness: 200,
                mass: 0.6,
                delay: staggerDelay,
            }}
            style={[
                isGrid ? styles.gridWrapper : styles.listWrapper,
                style
            ]}
        >
            <MotiPressable
                onPress={handlePress}
                animate={({ pressed, hovered }) => {
                    'worklet';
                    return {
                        scale: pressed ? 0.97 : hovered ? 1.02 : 1,
                        opacity: pressed ? 0.95 : 1,
                    };
                }}
                transition={{
                    type: 'spring',
                    damping: 15,
                    stiffness: 350,
                    mass: 0.4,
                }}
                style={[
                    isGrid ? styles.gridContainer : styles.listContainer,
                    {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        borderWidth: 1,
                    },
                    featured && { borderColor: cardGradient, borderWidth: 2 }
                ]}
            >
                <View style={[
                    isGrid ? styles.gridContent : styles.listContent,
                    { flexDirection: isGrid ? 'column' : rowDirection }
                ]}>
                    {/* Icon Box */}
                    <View style={[
                        styles.iconBox,
                        { backgroundColor: cardGradient + '15' },
                        !isGrid && (isKurdish ? { marginLeft: 16 } : { marginRight: 16 }),
                        isGrid && { marginBottom: 12, alignSelf: isRTL ? 'flex-end' : 'flex-start' }
                    ]}>
                        <Ionicons
                            name={icon}
                            size={isGrid ? 28 : 24}
                            color={cardGradient}
                        />
                    </View>

                    {/* Text Container */}
                    <View style={{ flex: 1, alignItems: isGrid ? (isRTL ? 'flex-end' : 'flex-start') : undefined }}>
                        <Text style={[
                            styles.title,
                            { color: colors.text.primary, textAlign },
                            isKurdish && styles.kurdishFont
                        ]} numberOfLines={1}>
                            {title}
                        </Text>
                        <Text style={[
                            styles.desc,
                            { color: colors.text.secondary, textAlign },
                            isKurdish && styles.kurdishFont
                        ]} numberOfLines={2}>
                            {description}
                        </Text>

                        {/* Players Tag */}
                        <View style={[styles.metaRow, { flexDirection: rowDirection, marginTop: 8 }]}>
                            <Ionicons name="people" size={12} color={colors.text.muted} />
                            <Text style={[
                                styles.metaText,
                                { color: colors.text.muted },
                                isKurdish ? { marginRight: 4 } : { marginLeft: 4 }
                            ]}>
                                {players}
                            </Text>
                        </View>
                    </View>

                    {/* Chevron (List only) */}
                    {!isGrid && (
                        <Ionicons
                            name={isKurdish ? "chevron-back" : "chevron-forward"}
                            size={20}
                            color={colors.text.muted}
                        />
                    )}
                </View>
            </MotiPressable>
        </MotiView>
    );
}

const styles = StyleSheet.create({
    gridWrapper: {
        width: '48%',
        marginBottom: 16,
    },
    listWrapper: {
        width: '100%',
        marginBottom: 12,
    },
    gridContainer: {
        borderRadius: layout.radius.xl,
        padding: 16,
        height: 170,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
            },
            android: {
                elevation: 4,
            },
            web: {
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            },
        }),
    },
    listContainer: {
        borderRadius: layout.radius.lg,
        padding: 16,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
            web: {
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
            },
        }),
    },
    gridContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    listContent: {
        alignItems: 'center',
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
        letterSpacing: 0.2,
    },
    desc: {
        fontSize: 12,
        lineHeight: 16,
    },
    metaRow: {
        alignItems: 'center',
    },
    metaText: {
        fontSize: 12,
        fontWeight: '500',
    },
    kurdishFont: {
        fontFamily: 'Rabar',
    },
});
