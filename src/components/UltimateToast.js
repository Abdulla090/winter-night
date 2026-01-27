import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { GlassCard } from './GlassCard';
import { Check, AlertCircle, Info, X } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import * as Haptics from 'expo-haptics';

const ToastContext = createContext({});

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);
    const { colors, isRTL } = useTheme();

    const show = useCallback(({ message, type = 'info', duration = 3000 }) => {
        setToast({ message, type, id: Date.now() });

        if (type === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        else if (type === 'error') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        else Haptics.selectionAsync();

        if (duration > 0) {
            setTimeout(() => {
                setToast(null);
            }, duration);
        }
    }, []);

    const hide = useCallback(() => setToast(null), []);

    return (
        <ToastContext.Provider value={{ show, hide }}>
            {children}
            <AnimatePresence>
                {toast && (
                    <MotiView
                        from={{ opacity: 0, translateY: -100, scale: 0.8 }}
                        animate={{ opacity: 1, translateY: 0, scale: 1 }}
                        exit={{ opacity: 0, translateY: -100, scale: 0.8 }}
                        transition={{ type: 'spring', damping: 15 }}
                        style={styles.container}
                    >
                        <GlassCard
                            intensity={80}
                            style={[
                                styles.card,
                                { flexDirection: isRTL ? 'row-reverse' : 'row' }
                            ]}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: getTypeColor(toast.type, colors) + '20' }]}>
                                {getIcon(toast.type, colors)}
                            </View>
                            <Text style={[
                                styles.message,
                                { color: colors.text.primary, textAlign: isRTL ? 'right' : 'left' }
                            ]}>
                                {toast.message}
                            </Text>
                        </GlassCard>
                    </MotiView>
                )}
            </AnimatePresence>
        </ToastContext.Provider>
    );
};

const getTypeColor = (type, colors) => {
    switch (type) {
        case 'success': return '#10B981';
        case 'error': return '#EF4444';
        case 'warning': return '#F59E0B';
        default: return colors.accent;
    }
};

const getIcon = (type, colors) => {
    const color = getTypeColor(type, colors);
    switch (type) {
        case 'success': return <Check size={20} color={color} strokeWidth={3} />;
        case 'error': return <X size={20} color={color} strokeWidth={3} />;
        case 'warning': return <AlertCircle size={20} color={color} strokeWidth={3} />;
        default: return <Info size={20} color={color} strokeWidth={3} />;
    }
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 40,
        left: 20,
        right: 20,
        alignItems: 'center',
        zIndex: 9999,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 30, // Dynamic Island shape
        minWidth: 200,
        maxWidth: '100%',
        gap: 12,
        backgroundColor: 'rgba(15, 23, 42, 0.95)', // Deep dark look
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    message: {
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
    },
});
