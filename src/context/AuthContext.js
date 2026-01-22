import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            }
            setLoading(false);
            setInitialized(true);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null);
                if (session?.user) {
                    await fetchProfile(session.user.id);
                } else {
                    setProfile(null);
                }
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching profile:', error);
            }
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const signUp = async (email, password, username) => {
        try {
            setLoading(true);

            // Sign up user with username in metadata
            // The database trigger will automatically create the profile
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: username,
                    },
                },
            });

            if (authError) throw authError;

            return { data: authData, error: null };
        } catch (error) {
            return { data: null, error };
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email, password) => {
        try {
            setLoading(true);
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            return { data, error };
        } catch (error) {
            return { data: null, error };
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setUser(null);
            setProfile(null);
        } catch (error) {
            console.error('Error signing out:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (updates) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id)
                .select()
                .single();

            if (error) throw error;
            setProfile(data);
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    };

    const value = {
        user,
        profile,
        loading,
        initialized,
        signUp,
        signIn,
        signOut,
        updateProfile,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
