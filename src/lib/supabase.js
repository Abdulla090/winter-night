import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

export const supabaseUrl = 'https://babwvpzevcyaltmslqfu.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhYnd2cHpldmN5YWx0bXNscWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MTUzNzYsImV4cCI6MjA4NDQ5MTM3Nn0.RKqoiiPo-HTnyGgSTrRzt8_eGbtGrld7uyEnLgifcWM';

// Web storage adapter using localStorage
const webStorageAdapter = {
    getItem: (key) => {
        try {
            return Promise.resolve(localStorage.getItem(key));
        } catch {
            return Promise.resolve(null);
        }
    },
    setItem: (key, value) => {
        try {
            localStorage.setItem(key, value);
            return Promise.resolve();
        } catch {
            return Promise.resolve();
        }
    },
    removeItem: (key) => {
        try {
            localStorage.removeItem(key);
            return Promise.resolve();
        } catch {
            return Promise.resolve();
        }
    },
};
// No-op lock function for web - immediately executes the callback
// This bypasses the Web Locks API which causes AbortError on web
const noopLock = async (name, acquireTimeout, callback) => {
    // Immediately execute the callback without any locking
    return await callback();
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        // Use AsyncStorage for native, localStorage wrapper for web
        storage: Platform.OS === 'web' ? webStorageAdapter : AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        // Use no-op lock function on web to prevent AbortError
        ...(Platform.OS === 'web' && { lock: noopLock }),
        // Disable debug logs in production
        debug: false,
    },
    realtime: {
        params: {
            eventsPerSecond: 10,
        },
    },
});

// Generate a random 6-character room code
export const generateRoomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};
