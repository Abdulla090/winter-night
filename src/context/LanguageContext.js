import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the Language Context
const LanguageContext = createContext();

// Storage key
const LANGUAGE_KEY = '@party_games_language';

// Language Provider Component
export function LanguageProvider({ children }) {
    const [language, setLanguageState] = useState('en'); // 'en' for English, 'ku' for Kurdish Sorani
    const [isLoading, setIsLoading] = useState(true);

    // Load saved language on mount
    useEffect(() => {
        loadLanguage();
    }, []);

    // Load language from AsyncStorage
    const loadLanguage = async () => {
        try {
            const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
            if (savedLanguage) {
                setLanguageState(savedLanguage);
            }
        } catch (error) {
            console.error('Error loading language:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Save and set language
    const setLanguage = async (newLanguage) => {
        try {
            await AsyncStorage.setItem(LANGUAGE_KEY, newLanguage);
            setLanguageState(newLanguage);
        } catch (error) {
            console.error('Error saving language:', error);
        }
    };

    // Toggle between languages
    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'ku' : 'en';
        setLanguage(newLang);
    };

    // Check if current language is Kurdish
    const isKurdish = language === 'ku';

    // Check if RTL (Kurdish is RTL)
    const isRTL = language === 'ku';

    return (
        <LanguageContext.Provider
            value={{
                language,
                setLanguage,
                toggleLanguage,
                isKurdish,
                isRTL,
                isLoading,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

// Hook to use the Language Context
export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

export default LanguageContext;
