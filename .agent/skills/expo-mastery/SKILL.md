---
name: expo-mastery
description: A comprehensive guide for building high-performance, native-feel Expo & React Native applications with robust APK deployment workflows, including sleek Reanimated 3 animation patterns.
---

# 🚀 Expo Mastery: Native Performance, Animations & Deployment

This skill provides a senior-level blueprint for creating Expo apps that feel indistinguishable from high-end native apps, bypassing common performance pitfalls and implementing sleek, non-cheesy animations.

---

## 🏛️ 1. Native Performance Architecture
To avoid the "1-second freeze" and lagginess, always implement these three pillars:

### A. The Native Navigation Stack
Stop using the JS-based `@react-navigation/stack`. Use `@react-navigation/native-stack` instead.
- **Why**: It uses native platform fragments (Android) and view controllers (iOS) for 60fps transitions.
- **Config**: Always set `freezeOnBlur: true` to prevent background screen re-renders.

### B. Screen Optimization
- **Enable Screens**: Call `enableScreens(true)` in your `index.js` before `registerRootComponent`.
- **Lightweight Wrappers**: Let the Native Stack handle slide/fade transitions. Don't wrap entry with Reanimated — it competes with the native animator.

---

## ✨ 2. Reanimated 3 Animation Playbook (Sleek, Non-Cheesy)

This project uses `react-native-reanimated` ^3.x and `moti` ^0.29.x. **All animations run on the UI thread via worklets — zero JS bridge cost.**

### ❌ BANNED Animations (cheesy, amateur)
- Spinning loading indicators in components (use skeleton instead)
- Dancing/bouncing hero elements that move constantly
- Attention-seeking shake animations on errors
- Looping scale pulses on buttons

### ✅ APPROVED Animation Patterns

#### A. Press Feedback — The Gold Standard
Replace all `TouchableOpacity` (activeOpacity) with a Reanimated `Pressable`. This gives a real, native-feel spring press:

```javascript
import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function PressCard({ onPress, children }) {
  const scale = useSharedValue(1);
  
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={animStyle}
      onPressIn={() => { scale.value = withSpring(0.95, { damping: 15, stiffness: 400 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 12, stiffness: 300 }); }}
      onPress={onPress}
    >
      {children}
    </AnimatedPressable>
  );
}
```

**Spring config rules:**
- `damping: 12–18` = natural, not bouncy
- `stiffness: 300–500` = fast response, not sluggish
- Scale range: `0.94–0.97` (subtle, not dramatic)

#### B. Staggered List Entry — Items slide up + fade in sequentially
Use this for any FlatList or mapped list. Each item gets a delay based on index:

```javascript
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { useEffect } from 'react';

function AnimatedListItem({ children, index, maxDelay = 400 }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    const delay = Math.min(index * 60, maxDelay);
    opacity.value = withDelay(delay, withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}
```

**Cap the delay at 400ms so the last item doesn't feel abandoned.**

#### C. Screen Entry — Slide up + fade (replaces old Animated.timing fade)
Upgrade `AnimatedScreen` to use `withTiming` on Reanimated shared values:

```javascript
const opacity = useSharedValue(0);
const translateY = useSharedValue(16);

useEffect(() => {
  opacity.value = withTiming(1, { duration: 220, easing: Easing.out(Easing.ease) });
  translateY.value = withTiming(0, { duration: 220, easing: Easing.out(Easing.ease) });
}, []);

const animStyle = useAnimatedStyle(() => ({
  opacity: opacity.value,
  transform: [{ translateY: translateY.value }],
}));
```

**Duration 180–250ms is ideal. Faster = snappier. Slower = laggy.**

#### D. Tab/Filter Press — Instant feel with spring width/color
When switching filter tabs, use `withSpring` on opacity or scale of the active indicator rather than re-rendering all tabs.

#### E. Moti for Declarative Micro-Animations
Use `moti` for simple entrance animations where you'd otherwise use CSS transitions:

```javascript
import { MotiView } from 'moti';

// Fade + scale in on mount
<MotiView
  from={{ opacity: 0, scale: 0.96 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ type: 'spring', damping: 15, stiffness: 300 }}
>
  {children}
</MotiView>
```

**Moti is perfect for one-shot entrance animations. Use Reanimated directly for gesture-driven or repeated interactions.**

### Performance Rules
- **Only animate**: `opacity`, `transform` (scale, translateX/Y). Never animate `width`, `height`, `margin` — they trigger layout recalculation.
- **useNativeDriver equivalent**: Reanimated 3 worklets run on the UI thread by default. No extra config needed.
- **Avoid animating many items simultaneously**: Cap stagger to max 6–8 visible items at once.
- **Memoize**: Wrap components using `useAnimatedStyle` in `React.memo` to prevent re-renders triggering animation resets.

---

## 📱 3. Modern UI & Layout

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

---

## 🔌 4. Bulletproof Debugging (The "Blue Screen" Fix)
If you see the "Something went wrong" or "Failed to download update" error:
1. **Kill Zombies**: Multiple Expo servers fight over port 8081. Run `taskkill /F /IM node.exe /T`.
2. **Tunnel Mode**: If Wi-Fi is restricted, use `npx expo start --tunnel`.
3. **ADB Reverse**: For USB debugging, always run `adb reverse tcp:8081 tcp:8081`.
4. **Disable New Arch**: If connection fails consistently, set `"newArchEnabled": false` in `app.json`.

---

## 📦 5. APK Production Workflow
1. **Build Profiles**: Define a `preview` profile in `eas.json` with `"buildType": "apk"`.
2. **Optimization**: Run `expo-doctor` before every build to find dependency conflicts.
3. **Asset Optimization**: Use `npx expo-optimize` to compress images and reduce APK size.

---

## 🛠️ Essential Scripts
Use the included scripts in the `scripts/` folder to automate environment resets and connection fixes.
