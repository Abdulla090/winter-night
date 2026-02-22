import React, { memo, useCallback } from 'react';
import { View, StyleSheet, Platform, Dimensions, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Home, Compass, HelpCircle, User } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * ✨ BottomNavBar - Premium animated navigation
 * Ultra-smooth 60fps transitions with native-feel haptics
 */

const NavItem = memo(({ tab, isActive, onPress, isDark }) => {
    const Icon = tab.icon;

    const handlePress = useCallback(() => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
        }
        onPress();
    }, [onPress]);

    // Dynamic colors based on theme
    const activeGradient = isDark
        ? ['#D900FF', '#B026FF']
        : ['#0EA5E9', '#38BDF8'];

    const inactiveColor = isDark ? '#6B5A8A' : '#94A3B8';
    const borderColor = isDark ? '#0F0518' : '#F0F8FF';

    return (
        <Pressable
            style={styles.tab}
            onPress={handlePress}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
        >
            {/* Animated indicator background */}
            <MotiView
                animate={{
                    scale: isActive ? 1 : 0.85,
                    opacity: isActive ? 1 : 0,
                }}
                transition={{
                    type: 'spring',
                    damping: 18,
                    stiffness: 300,
                    mass: 0.6,
                }}
                style={[styles.activeCircleWrapper]}
            >
                <LinearGradient
                    colors={activeGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.activeCircle, { borderColor }]}
                />
            </MotiView>

            {/* Icon with animation */}
            <MotiView
                animate={{
                    scale: isActive ? 1.1 : 1,
                    translateY: isActive ? -2 : 0,
                }}
                transition={{
                    type: 'spring',
                    damping: 15,
                    stiffness: 250,
                    mass: 0.5,
                }}
                style={styles.iconWrapper}
            >
                <Icon
                    size={24}
                    color={isActive ? '#FFF' : inactiveColor}
                    strokeWidth={isActive ? 2.5 : 2}
                />
            </MotiView>
        </Pressable>
    );
});

export function BottomNavBar({ currentRoute = 'Home', onNavigate }) {
    const { isDark } = useTheme();
    const { isRTL } = useLanguage();
    const insets = useSafeAreaInsets();

    // Standard order: Home is primary (leftmost in LTR)
    // For RTL: we reverse the array so Home appears on the right
    const baseTabs = [
        { id: 'home', icon: Home, screen: 'Home', activeOn: 'Home' },
        { id: 'explore', icon: Compass, screen: 'AllGames', activeOn: 'AllGames' },
        { id: 'stats', icon: HelpCircle, screen: 'Stats', activeOn: 'Stats' },
        { id: 'profile', icon: User, screen: 'Settings', activeOn: 'Settings' },
    ];

    // Reverse for RTL so Home appears on the right (primary position in RTL)
    const tabs = isRTL ? [...baseTabs].reverse() : baseTabs;

    const handleNavigate = useCallback((screen) => {
        if (currentRoute !== screen && onNavigate) {
            onNavigate(screen);
        }
    }, [currentRoute, onNavigate]);

    // Only show on main screens
    const showOnScreens = ['Home', 'AllGames', 'Settings', 'Stats'];
    if (!showOnScreens.includes(currentRoute)) {
        return null;
    }

    const barStyle = {
        backgroundColor: isDark ? '#150824' : '#FFFFFF',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0',
    };

    // Dynamic bottom position accounting for safe area (gesture bar on Android)
    const bottomPosition = Math.max(insets.bottom, 12) + 12;

    return (
        <MotiView
            from={{ translateY: 100, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{
                type: 'spring',
                damping: 20,
                stiffness: 200,
                mass: 0.8,
                delay: 100,
            }}
            style={[styles.wrapper, { bottom: bottomPosition, pointerEvents: 'box-none' }]}
        >
            <View style={[styles.bar, barStyle]}>
                {tabs.map((tab) => (
                    <NavItem
                        key={tab.id}
                        tab={tab}
                        isActive={currentRoute === tab.activeOn}
                        onPress={() => tab.screen && handleNavigate(tab.screen)}
                        isDark={isDark}
                    />
                ))}
            </View>
        </MotiView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        // bottom is set dynamically using useSafeAreaInsets
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 999,
    },
    bar: {
        height: 72,
        width: Math.min(SCREEN_WIDTH - 40, 400),
        borderRadius: 36,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        borderWidth: 1,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.2,
                shadowRadius: 24,
            },
            android: {
                elevation: 20,
            },
            web: {
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
            },
        }),
    },
    tab: {
        width: 64,
        height: 72,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    iconWrapper: {
        zIndex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeCircleWrapper: {
        position: 'absolute',
        width: 54,
        height: 54,
    },
    activeCircle: {
        width: 54,
        height: 54,
        borderRadius: 27,
        borderWidth: 3,
        ...Platform.select({
            ios: {
                shadowColor: '#0EA5E9',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
            },
            android: {
                elevation: 10,
            },
            web: {
                boxShadow: '0 4px 20px rgba(14, 165, 233, 0.35)',
            },
        }),
    },
});

export default BottomNavBar;
