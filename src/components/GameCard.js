import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming, Easing } from 'react-native-reanimated';
import { COLORS, BORDER_RADIUS, SPACING, FONTS, SHADOWS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

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
    playersLabel = 'players',
    layout = 'list',
    featured = false,
}) {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(10); // Subtle 10px slide
    const { theme } = useTheme();

    const isGrid = layout === 'grid';
    const isFeatured = featured;

    // Linear Professional Animation
    useEffect(() => {
        opacity.value = withDelay(index * 30, withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) }));
        translateY.value = withDelay(index * 30, withTiming(0, { duration: 300, easing: Easing.out(Easing.quad) }));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [
            { translateY: translateY.value },
            { scale: scale.value }
        ]
    }));

    // Tighter press feedback (No wobble)
    const handlePressIn = () => {
        scale.value = withTiming(0.98, { duration: 50 });
    };

    const handlePressOut = () => {
        scale.value = withTiming(1, { duration: 100 });
    };

    const rowDirection = isKurdish ? 'row-reverse' : 'row';
    const textAlign = isKurdish ? 'right' : 'left';
    const alignItems = isKurdish ? 'flex-end' : 'flex-start';

    // Styles based on theme
    const themeStyles = {
        card: { backgroundColor: theme.background.card, borderColor: theme.background.border },
        text: { color: theme.text.primary },
        desc: { color: theme.text.secondary },
        iconBg: featured ? gradient : gradient, // Keep gradient for icon
        badge: { backgroundColor: theme.background.main }
    };

    const containerStyle = isGrid ? styles.gridContainer : styles.listContainer;
    const contentStyle = isGrid ? styles.gridContent : [styles.listContent, { flexDirection: rowDirection }];

    return (
        <Animated.View style={[
            animatedStyle,
            isGrid ? styles.gridWrapper : { marginBottom: SPACING.md },
            isFeatured && styles.featuredWrapper,
            style
        ]}>
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.9} // Slight opacity change
                style={[
                    containerStyle,
                    themeStyles.card,
                    isFeatured && styles.featuredContainer,
                    { borderColor: isFeatured ? gradient : themeStyles.card.borderColor }
                ]}
            >
                <View style={[contentStyle, isGrid && { alignItems }]}>
                    {/* Icon Box */}
                    <View style={[
                        isGrid ? styles.gridIcon : styles.listIcon,
                        { backgroundColor: gradient },
                        !isGrid && (isKurdish ? { marginLeft: SPACING.md } : { marginRight: SPACING.md })
                    ]}>
                        <Ionicons name={icon} size={isGrid || isFeatured ? 32 : 24} color="#FFF" />
                    </View>

                    {/* Text Container */}
                    <View style={[
                        styles.textContainer,
                        !isGrid && { flex: 1 },
                        isGrid && { width: '100%', marginTop: SPACING.md, alignItems }
                    ]}>
                        <Text
                            style={[
                                isGrid || isFeatured ? styles.gridTitle : styles.listTitle,
                                { textAlign, color: themeStyles.text.color },
                                isKurdish && styles.kurdishFont
                            ]}
                            numberOfLines={1}
                        >
                            {title}
                        </Text>

                        <Text
                            style={[
                                styles.description,
                                { textAlign, color: themeStyles.desc.color },
                                isKurdish && styles.kurdishFont
                            ]}
                            numberOfLines={2}
                        >
                            {description}
                        </Text>

                        {/* Meta Tags */}
                        <View style={[
                            styles.metaContainer,
                            { flexDirection: rowDirection, marginTop: 8 }
                        ]}>
                            <View style={[styles.badge, themeStyles.badge, { flexDirection: rowDirection }]}>
                                <Ionicons name="people" size={12} color={themeStyles.desc.color} />
                                <Text style={[
                                    styles.playersText,
                                    isKurdish ? { marginRight: 4 } : { marginLeft: 4 },
                                    isKurdish && styles.kurdishFont,
                                    { color: themeStyles.desc.color }
                                ]}>
                                    {players}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Arrow for List View Only */}
                    {!isGrid && !isFeatured && (
                        <Ionicons
                            name={isKurdish ? "chevron-back" : "chevron-forward"}
                            size={20}
                            color={themeStyles.desc.color}
                        />
                    )}
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    // Grid Styles
    gridWrapper: {
        width: '48%',
        marginBottom: SPACING.md,
    },
    featuredWrapper: {
        width: '100%',
        marginBottom: SPACING.md,
    },
    gridContainer: {
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.md,
        height: 180,
        borderWidth: 1,
        ...SHADOWS.medium,
        elevation: 4,
    },
    featuredContainer: {
        height: 'auto',
        padding: SPACING.lg,
        borderWidth: 1,
    },
    gridContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    gridIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.small,
        elevation: 4,
    },
    gridTitle: {
        ...FONTS.bold,
        fontSize: 16,
        marginBottom: 4,
    },

    // List Styles
    listContainer: {
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        ...SHADOWS.small,
    },
    listContent: {
        alignItems: 'center',
        padding: SPACING.md,
    },
    listIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listTitle: {
        ...FONTS.semibold,
        fontSize: 16,
        marginBottom: 2,
    },

    // Shared
    container: {
        overflow: 'hidden',
    },
    textContainer: {
        justifyContent: 'center',
    },
    description: {
        fontSize: 12,
        lineHeight: 16,
        opacity: 0.8,
    },
    metaContainer: {
        alignItems: 'center',
    },
    badge: {
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    playersText: {
        fontSize: 11,
        fontWeight: '600',
    },
    kurdishFont: {
        fontFamily: 'Rabar',
    },
});
