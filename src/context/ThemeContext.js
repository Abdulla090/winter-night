import React, { createContext, useContext, useState, useEffect } from 'react';
import { I18nManager } from 'react-native';
import { colors } from '../theme/colors';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // 🌙 Dark mode is default (Winter Nights Vibe)
    // Available themes: 'dark', 'light' (sky blue)
    const [mode, setMode] = useState('dark');

    // USER REQUEST: Priority for Kurdish Design (RTL).
    // We explicitly manage an RTL state helper.
    const [isRTL, setIsRTL] = useState(true);

    // We expose the active color palette based on mode
    const activeColors = {
        ...colors[mode],
        brand: colors.brand,
    };

    // Toggle between dark and light
    const toggleTheme = () => {
        setMode(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    const value = {
        colors: activeColors,
        theme: activeColors, // Alias for backward compatibility
        mode,
        isDark: mode === 'dark', // Dark purple theme
        isLight: mode === 'light', // Sky blue theme
        isDarkBased: mode === 'dark', // For compatibility (same as isDark now)
        isRTL,
        toggleTheme,
        setIsRTL,

        // Helper for conditional styles: theme.rtl(styleLeft, styleRight)
        rtl: (ltr, rtl) => (isRTL ? rtl : ltr),
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
