import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

/**
 * 🚀 High-Performance Native Stack Configuration
 * 
 * - animation: 'slide_from_right' (Fast platform animation)
 * - freezeOnBlur: true (Prevents background rendering)
 * - fullScreenGestureEnabled: true (Better UX)
 */
export const StackNavigator = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: 200,
            freezeOnBlur: true,
            fullScreenGestureEnabled: true,
            contentStyle: { backgroundColor: '#0F0518' },
        }}
    >
        {/* Your Screens Here */}
    </Stack.Navigator>
);
