import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import * as Font from 'expo-font';
import {
  useFonts,
  NotoNaskhArabic_400Regular,
  NotoNaskhArabic_500Medium,
  NotoNaskhArabic_600SemiBold,
  NotoNaskhArabic_700Bold,
} from '@expo-google-fonts/noto-naskh-arabic';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/constants/theme';
import { LanguageProvider } from './src/context/LanguageContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { GameRoomProvider } from './src/context/GameRoomContext';
import { ToastProvider } from './src/components/UltimateToast';

// Minimal Loading Screen
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Winter Nights</Text>
      <View style={styles.loadingDots}>
        <View style={styles.dot} />
        <View style={[styles.dot, { opacity: 0.6 }]} />
        <View style={[styles.dot, { opacity: 0.3 }]} />
      </View>
    </View>
  );
}

export default function App() {
  useEffect(() => {
    console.log('--- APP COMPONENT MOUNTED ---');
    // Enable edge-to-edge on Android (transparent system bars)
    if (Platform.OS === 'android') {
      try {
        NavigationBar.setPositionAsync('absolute').catch(err => console.log('NB Position Error:', err));
        NavigationBar.setBackgroundColorAsync('transparent').catch(err => console.log('NB Color Error:', err));
      } catch (e) {
        console.log('NavigationBar configuration error:', e);
      }
    }
  }, []);

  // Load Google Fonts for Kurdish (Noto Naskh Arabic has excellent Kurdish support)
  const [fontsLoaded] = useFonts({
    NotoNaskhArabic_400Regular,
    NotoNaskhArabic_500Medium,
    NotoNaskhArabic_600SemiBold,
    NotoNaskhArabic_700Bold,
    // Alias names for easier use
    'Rabar': NotoNaskhArabic_400Regular,
    'Rabar-Medium': NotoNaskhArabic_500Medium,
    'Rabar-SemiBold': NotoNaskhArabic_600SemiBold,
    'Rabar-Bold': NotoNaskhArabic_700Bold,
  });

  // Timeout fallback: don't stay on splash forever (especially on web)
  const [fontTimeout, setFontTimeout] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!fontsLoaded) {
        console.log('Font loading timed out, proceeding without custom fonts');
        setFontTimeout(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [fontsLoaded]);

  if (!fontsLoaded && !fontTimeout) {
    return <LoadingScreen />;
  }

  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <GameRoomProvider>
            <ToastProvider>
              <SafeAreaProvider>
                <GestureHandlerRootView style={styles.container}>
                  <StatusBar style="auto" />
                  <AppNavigator />
                </GestureHandlerRootView>
              </SafeAreaProvider>
            </ToastProvider>
          </GameRoomProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.dark,
    ...Platform.select({
      web: {
        maxWidth: 500,
        width: '100%',
        alignSelf: 'center',
        boxShadow: '0 0 20px rgba(0,0,0,0.5)',
        minHeight: '100vh',
      }
    })
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: COLORS.text.primary,
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 20,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent.primary,
  },
});
