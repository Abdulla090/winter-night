---
name: expo-mastery
description: A comprehensive guide for building high-performance, native-feel Expo & React Native applications with robust APK deployment workflows.
---

# 🚀 Expo Mastery: Native Performance & Deployment

This skill provides a senior-level blueprint for creating Expo apps that feel indistinguishable from high-end native apps, bypassing common performance pitfalls and connection issues.

## 🏛️ 1. Native Performance Architecture
To avoid the "1-second freeze" and lagginess, always implement these three pillars:

### A. The Native Navigation Stack
Stop using the JS-based `@react-navigation/stack`. Use `@react-navigation/native-stack` instead.
- **Why**: It uses native platform fragments (Android) and view controllers (iOS) for 60fps transitions.
- **Config**: Always set `freezeOnBlur: true` to prevent background screen re-renders.

### B. Screen Optimization
- **Enable Screens**: Call `enableScreens(true)` in your `index.js` before `registerRootComponent`.
- **Lightweight Wrappers**: Avoid nesting heavy JS animations (like Moti/Reanimated) directly on the screen's entry transition. Let the Native Stack handle the slide/fade.

## 📱 2. Modern UI & Layout
### A. Edge-to-Edge Design
Standard apps have a black bar at the bottom. Premium apps draw behind the navigation bar.
- **Action**: Set `"edgeToEdgeEnabled": true` in `app.json`.
- **Inset Handling**: Use `useSafeAreaInsets()` from `react-native-safe-area-context` to add padding to your custom footers/navbars.

### B. The Performance-First Navbar
Dynamic positioning is key:
```javascript
const insets = useSafeAreaInsets();
const dynamicBottom = Math.max(insets.bottom, 12) + 12;
// Use dynamicBottom as the 'bottom' style for your floating navbar
```

## 🔌 3. Bulletproof Debugging (The "Blue Screen" Fix)
If you see the "Something went wrong" or "Failed to download update" error:
1. **Kill Zombies**: Multiple Expo servers (via bun/npm) fight over port 8081. Running `taskkill /F /IM node.exe /T` resets the environment.
2. **Tunnel Mode**: If your Wi-Fi is restricted, use `npx expo start --tunnel`.
3. **ADB Reverse**: For USB debugging, always run `adb reverse tcp:8081 tcp:8081`.
4. **Disable New Arch**: If connection fails consistently, set `"newArchEnabled": false` in `app.json`.

## 📦 4. APK Production Workflow
1. **Build Profiles**: Define a `preview` profile in `eas.json` with `"buildType": "apk"`.
2. **Optimization**: Run `expo-doctor` before every build to find dependency conflicts.
3. **Asset Optimization**: Use `npx expo-optimize` to compress images and reduce APK size.

## 🛠️ Essential Scripts
Use the included scripts in the `scripts/` folder to automate environment resets and connection fixes.
