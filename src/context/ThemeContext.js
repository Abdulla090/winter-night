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

        // Global RTL text style — use this instead of bare textAlign:'right'
        // Adds left-side breathing room so Kurdish text isn't flush to the right edge
        rtlText: isRTL
            ? { textAlign: 'right', paddingRight: 4, writingDirection: 'rtl' }
            : { textAlign: 'left' },

        // Global RTL container — for wrapping Views that hold RTL text blocks
        rtlContainer: isRTL
            ? { alignItems: 'flex-end', paddingRight: 4 }
            : { alignItems: 'flex-start' },
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
