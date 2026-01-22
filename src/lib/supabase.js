import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://babwvpzevcyaltmslqfu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhYnd2cHpldmN5YWx0bXNscWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MTUzNzYsImV4cCI6MjA4NDQ5MTM3Nn0.RKqoiiPo-HTnyGgSTrRzt8_eGbtGrld7uyEnLgifcWM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
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
