// 🔧 CRITICAL: Pre-define ALL reanimated web globals BEFORE any module loads
// react-native-reanimated's initializers.js sets these, but Metro's module loading
// order can cause moti/reanimated hooks to run before initializers.js executes.
// We must define them synchronously at the very top of the entry point.
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
    // Core worklet flag — tells reanimated code it's NOT running in a worklet thread
    if (typeof global._WORKLET === 'undefined') {
        global._WORKLET = false;
    }
    // Animation timestamp provider — used by useAnimatedStyle, valueSetter, etc.
    if (typeof global._getAnimationTimestamp === 'undefined') {
        global._getAnimationTimestamp = () => performance.now();
    }
    // Logger function
    if (typeof global._log === 'undefined') {
        global._log = console.log;
    }
    // Frame timestamp (set per-frame by requestAnimationFrame override)
    if (typeof global.__frameTimestamp === 'undefined') {
        global.__frameTimestamp = undefined;
    }
    // Flush animation frame callback
    if (typeof global.__flushAnimationFrame === 'undefined') {
        global.__flushAnimationFrame = (timestamp) => {
            global.__frameTimestamp = timestamp;
        };
    }
}

// Now import reanimated — its initializers.js will run and enhance/override our polyfills
import 'react-native-reanimated';

import { registerRootComponent } from 'expo';

// Note: In some SDK versions, calling enableScreens manually can cause startup hangs
// if the native side isn't fully ready. Native Stack enables this automatically.
console.log('--- INDEX INITIALIZING ---');

import App from './App';

registerRootComponent(App);
