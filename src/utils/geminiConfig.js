import AsyncStorage from '@react-native-async-storage/async-storage';

const GEMINI_API_KEY_STORAGE_KEY = '@gemini_api_key';

let cachedGeminiApiKey;

export async function getGeminiApiKey() {
    if (cachedGeminiApiKey !== undefined) {
        return cachedGeminiApiKey;
    }

    try {
        const storedKey = await AsyncStorage.getItem(GEMINI_API_KEY_STORAGE_KEY);
        cachedGeminiApiKey = storedKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
        return cachedGeminiApiKey;
    } catch (error) {
        console.warn('Failed to load Gemini API key:', error);
        cachedGeminiApiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
        return cachedGeminiApiKey;
    }
}

export async function setGeminiApiKey(apiKey) {
    const trimmedKey = (apiKey || '').trim();

    try {
        if (trimmedKey) {
            await AsyncStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, trimmedKey);
        } else {
            await AsyncStorage.removeItem(GEMINI_API_KEY_STORAGE_KEY);
        }
        cachedGeminiApiKey = trimmedKey;
    } catch (error) {
        console.warn('Failed to save Gemini API key:', error);
        throw error;
    }
}

export function maskGeminiApiKey(apiKey) {
    if (!apiKey) return '';
    if (apiKey.length <= 8) return apiKey;
    return `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`;
}
