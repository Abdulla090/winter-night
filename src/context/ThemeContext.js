import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEMES } from '../constants/theme';

const ThemeContext = createContext();
const THEME_KEY = '@app_theme_mode';

export function ThemeProvider({ children }) {
    const systemScheme = useColorScheme();
    const [themeMode, setThemeMode] = useState('dark'); // Default to dark 'pro' mode

    // Load saved theme
    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const saved = await AsyncStorage.getItem(THEME_KEY);
            if (saved) {
                setThemeMode(saved);
            } else if (systemScheme) {
                // Optional: Sync with system if no preference
                // setThemeMode(systemScheme);
            }
        } catch (e) { console.error(e); }
    };

    const toggleTheme = async () => {
        const newMode = themeMode === 'dark' ? 'light' : 'dark';
        setThemeMode(newMode);
        await AsyncStorage.setItem(THEME_KEY, newMode);
    };

    const theme = THEMES[themeMode];

    return (
        <ThemeContext.Provider value={{ theme, themeMode, toggleTheme, isDark: themeMode === 'dark' }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
