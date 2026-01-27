import React from 'react';
import { View, Easing } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';
import { BottomNavBar } from '../components/BottomNavBar';

// Screens
import HomeScreen from '../screens/HomeScreen';
import AllGamesScreen from '../screens/AllGamesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StatsScreen from '../screens/StatsScreen';

// Who Am I (COMPLETE)
import WhoAmISetup from '../screens/WhoAmI/SetupScreen';
import WhoAmIPlay from '../screens/WhoAmI/PlayScreen';
import WhoAmIResults from '../screens/WhoAmI/ResultsScreen';

// Imposter (COMPLETE)
import ImposterSetup from '../screens/Imposter/SetupScreen';
import ImposterPlay from '../screens/Imposter/PlayScreen';
import ImposterResult from '../screens/Imposter/ResultScreen';

// Spyfall (COMPLETE)
import SpyfallSetup from '../screens/Spyfall/SetupScreen';
import SpyfallPlay from '../screens/Spyfall/PlayScreen';
import SpyfallResult from '../screens/Spyfall/ResultScreen';

// Truth or Dare (COMPLETE)
import TruthOrDareSetup from '../screens/TruthOrDare/SetupScreen';
import TruthOrDarePlay from '../screens/TruthOrDare/PlayScreen';
import TruthOrDareResult from '../screens/TruthOrDare/ResultScreen';

// Never Have I Ever (COMPLETE)
import NeverHaveIEverSetup from '../screens/NeverHaveIEver/SetupScreen';
import NeverHaveIEverPlay from '../screens/NeverHaveIEver/PlayScreen';
import NeverHaveIEverResult from '../screens/NeverHaveIEver/ResultScreen';

// Would You Rather (COMPLETE)
import WouldYouRatherSetup from '../screens/WouldYouRather/SetupScreen';
import WouldYouRatherPlay from '../screens/WouldYouRather/PlayScreen';

// Quiz Trivia (COMPLETE)
import QuizSetup from '../screens/Quiz/SetupScreen';
import QuizPlay from '../screens/Quiz/PlayScreen';
import QuizResult from '../screens/Quiz/ResultScreen';

// Draw & Guess (COMPLETE)
import DrawGuessSetup from '../screens/DrawGuess/SetupScreen';
import DrawGuessPlay from '../screens/DrawGuess/PlayScreen';
import DrawGuessResult from '../screens/DrawGuess/ResultScreen';

// Pyramid Game (COMPLETE)
import PyramidSetupScreen from '../screens/Pyramid/SetupScreen';
import PyramidGameBoardScreen from '../screens/Pyramid/GameBoardScreen';
import PyramidPlayScreen from '../screens/Pyramid/PlayScreen';
import PyramidResultScreen from '../screens/Pyramid/ResultScreen';

// Wheel of Fortune
import WheelSetupScreen from '../screens/Wheel/SetupScreen';
import WheelPlayScreen from '../screens/Wheel/PlayScreen';

// Emoji Decoder (COMPLETE)
import EmojiDecoderSetup from '../screens/EmojiDecoder/SetupScreen';
import EmojiDecoderPlay from '../screens/EmojiDecoder/PlayScreen';

// Forbidden Word (COMPLETE)
import ForbiddenWordSetup from '../screens/ForbiddenWord/SetupScreen';
import ForbiddenWordPlay from '../screens/ForbiddenWord/PlayScreen';

// Lyrics Challenge (COMPLETE)
import LyricsChallengeSetup from '../screens/LyricsChallenge/SetupScreen';
import LyricsChallengePlay from '../screens/LyricsChallenge/PlayScreen';

// Word Chain (COMPLETE)
import WordChainPlayScreen from '../screens/WordChain/PlayScreen';

// Reverse Charades (COMPLETE)
import ReverseCharadesSetup from '../screens/ReverseCharades/SetupScreen';
import ReverseCharadesPlay from '../screens/ReverseCharades/PlayScreen';

// Partners in Crime (COMPLETE)
import PartnersInCrimeSetup from '../screens/PartnersInCrime/SetupScreen';
import PartnersInCrimePlay from '../screens/PartnersInCrime/PlayScreen';

// Speed Recognition Challenge (COMPLETE)
import SpeedRecognitionSetup from '../screens/SpeedRecognitionSetup';
import SpeedRecognitionPlay from '../screens/SpeedRecognitionPlay';

// Impostor Draw (COMPLETE)
import ImpostorDrawSetup from '../screens/ImpostorDraw/SetupScreen';
import ImpostorDrawRoleReveal from '../screens/ImpostorDraw/RoleRevealScreen';
import ImpostorDrawPlay from '../screens/ImpostorDraw/PlayScreen';
import ImpostorDrawVote from '../screens/ImpostorDraw/VoteScreen';
import ImpostorDrawResult from '../screens/ImpostorDraw/ResultScreen';
import ImpostorDrawFinal from '../screens/ImpostorDraw/FinalScreen';

// Wrong Answer Challenge (COMPLETE)
import WrongAnswerSetup from '../screens/WrongAnswer/SetupScreen';
import WrongAnswerPlay from '../screens/WrongAnswer/PlayScreen';
import WrongAnswerVote from '../screens/WrongAnswer/VoteScreen';
import WrongAnswerResult from '../screens/WrongAnswer/ResultScreen';
import WrongAnswerFinal from '../screens/WrongAnswer/FinalScreen';

// Auth Screens
import LoginScreen from '../screens/Auth/LoginScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';

// Multiplayer Screens
import CreateRoomScreen from '../screens/Multiplayer/CreateRoomScreen';
import JoinRoomScreen from '../screens/Multiplayer/JoinRoomScreen';
import RoomLobbyScreen from '../screens/Multiplayer/RoomLobbyScreen';

// Onboarding
import OnboardingScreen from '../screens/OnboardingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

/**
 * ✨ PREMIUM NATIVE TRANSITIONS
 * Ultra-smooth, 60fps animations that feel like iOS native
 */

// iOS-style horizontal slide (sleek, fast, professional)
const forSlideFromRight = ({ current, next, inverted, layouts }) => {
    const progress = current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [layouts.screen.width, 0],
        extrapolate: 'clamp',
    });

    const shadowOpacity = current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.15],
        extrapolate: 'clamp',
    });

    // Subtle parallax for the screen underneath
    const translatePrev = next
        ? next.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -layouts.screen.width * 0.3],
            extrapolate: 'clamp',
        })
        : 0;

    const scalePrev = next
        ? next.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.94],
            extrapolate: 'clamp',
        })
        : 1;

    const opacityPrev = next
        ? next.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.6],
            extrapolate: 'clamp',
        })
        : 1;

    return {
        cardStyle: {
            transform: [
                { translateX: progress },
                { scale: scalePrev },
            ],
            opacity: opacityPrev,
            shadowColor: '#000',
            shadowOpacity,
            shadowRadius: 20,
            shadowOffset: { width: -5, height: 0 },
        },
    };
};

// Subtle fade-scale for modal-like screens
const forFadeScale = ({ current }) => {
    const opacity = current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const scale = current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0.92, 1],
        extrapolate: 'clamp',
    });

    return {
        cardStyle: {
            opacity,
            transform: [{ scale }],
        },
    };
};

function AppStack({ isFirstLaunch }) {
    const { colors } = useTheme();

    // ⚡ ULTRA-SMOOTH TIMING (Native iOS feel)
    const nativeTransitionSpec = {
        open: {
            animation: 'spring',
            config: {
                stiffness: 1000,
                damping: 500,
                mass: 3,
                overshootClamping: true,
                restDisplacementThreshold: 10,
                restSpeedThreshold: 10,
            },
        },
        close: {
            animation: 'spring',
            config: {
                stiffness: 1000,
                damping: 500,
                mass: 3,
                overshootClamping: true,
                restDisplacementThreshold: 10,
                restSpeedThreshold: 10,
            },
        },
    };

    // Faster timing for snappy feel
    const fastTimingSpec = {
        open: {
            animation: 'timing',
            config: {
                duration: 250,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            },
        },
        close: {
            animation: 'timing',
            config: {
                duration: 200,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            },
        },
    };

    const screenOptions = {
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        gestureResponseDistance: 100, // More responsive swipe back
        // Premium transition
        transitionSpec: fastTimingSpec,
        cardStyleInterpolator: forSlideFromRight,
        // Overlay for depth effect
        cardOverlayEnabled: true,
        cardShadowEnabled: true,
    };

    // Modal-style for certain screens
    const modalOptions = {
        ...screenOptions,
        cardStyleInterpolator: forFadeScale,
        gestureDirection: 'vertical',
    };

    return (
        <Stack.Navigator
            initialRouteName={isFirstLaunch ? "Onboarding" : "Home"}
            screenOptions={screenOptions}
        >
            {/* Onboarding */}
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />

            {/* Main */}
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AllGames" component={AllGamesScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Stats" component={StatsScreen} />

            {/* Who Am I - COMPLETE */}
            <Stack.Screen name="WhoAmISetup" component={WhoAmISetup} />
            <Stack.Screen name="WhoAmIPlay" component={WhoAmIPlay} />
            <Stack.Screen name="WhoAmIResults" component={WhoAmIResults} options={modalOptions} />

            {/* Imposter - COMPLETE */}
            <Stack.Screen name="ImposterSetup" component={ImposterSetup} />
            <Stack.Screen name="ImposterPlay" component={ImposterPlay} />
            <Stack.Screen name="ImposterResult" component={ImposterResult} options={modalOptions} />

            {/* Spyfall - COMPLETE */}
            <Stack.Screen name="SpyfallSetup" component={SpyfallSetup} />
            <Stack.Screen name="SpyfallPlay" component={SpyfallPlay} />
            <Stack.Screen name="SpyfallResult" component={SpyfallResult} options={modalOptions} />

            {/* Truth or Dare - COMPLETE */}
            <Stack.Screen name="TruthOrDareSetup" component={TruthOrDareSetup} />
            <Stack.Screen name="TruthOrDarePlay" component={TruthOrDarePlay} />
            <Stack.Screen name="TruthOrDareResult" component={TruthOrDareResult} options={modalOptions} />

            {/* Never Have I Ever - COMPLETE */}
            <Stack.Screen name="NeverHaveIEverSetup" component={NeverHaveIEverSetup} />
            <Stack.Screen name="NeverHaveIEverPlay" component={NeverHaveIEverPlay} />
            <Stack.Screen name="NeverHaveIEverResult" component={NeverHaveIEverResult} options={modalOptions} />

            {/* Would You Rather - COMPLETE */}
            <Stack.Screen name="WouldYouRatherSetup" component={WouldYouRatherSetup} />
            <Stack.Screen name="WouldYouRatherPlay" component={WouldYouRatherPlay} />

            {/* Quiz Trivia - COMPLETE */}
            <Stack.Screen name="QuizSetup" component={QuizSetup} />
            <Stack.Screen name="QuizPlay" component={QuizPlay} />
            <Stack.Screen name="QuizResult" component={QuizResult} options={modalOptions} />

            {/* Draw & Guess - COMPLETE */}
            <Stack.Screen name="DrawGuessSetup" component={DrawGuessSetup} />
            <Stack.Screen name="DrawGuessPlay" component={DrawGuessPlay} />
            <Stack.Screen name="DrawGuessResult" component={DrawGuessResult} options={modalOptions} />

            {/* Pyramid Game */}
            <Stack.Screen name="PyramidSetup" component={PyramidSetupScreen} />
            <Stack.Screen name="PyramidGameBoard" component={PyramidGameBoardScreen} />
            <Stack.Screen name="PyramidPlay" component={PyramidPlayScreen} />
            <Stack.Screen name="PyramidResult" component={PyramidResultScreen} options={modalOptions} />

            {/* Wheel of Fortune */}
            <Stack.Screen name="WheelSetup" component={WheelSetupScreen} />
            <Stack.Screen name="WheelPlay" component={WheelPlayScreen} />

            {/* Emoji Decoder - COMPLETE */}
            <Stack.Screen name="EmojiDecoderSetup" component={EmojiDecoderSetup} />
            <Stack.Screen name="EmojiDecoderPlay" component={EmojiDecoderPlay} />

            {/* Forbidden Word - COMPLETE */}
            <Stack.Screen name="ForbiddenWordSetup" component={ForbiddenWordSetup} />
            <Stack.Screen name="ForbiddenWordPlay" component={ForbiddenWordPlay} />

            {/* Lyrics Challenge - COMPLETE */}
            <Stack.Screen name="LyricsChallengeSetup" component={LyricsChallengeSetup} />
            <Stack.Screen name="LyricsChallengePlay" component={LyricsChallengePlay} />

            {/* Word Chain - COMPLETE */}
            <Stack.Screen name="WordChainPlay" component={WordChainPlayScreen} />

            {/* Reverse Charades - COMPLETE */}
            <Stack.Screen name="ReverseCharadesSetup" component={ReverseCharadesSetup} />
            <Stack.Screen name="ReverseCharadesPlay" component={ReverseCharadesPlay} />

            {/* Partners in Crime - COMPLETE */}
            <Stack.Screen name="PartnersInCrimeSetup" component={PartnersInCrimeSetup} />
            <Stack.Screen name="PartnersInCrimePlay" component={PartnersInCrimePlay} />

            {/* Speed Recognition Challenge - COMPLETE */}
            <Stack.Screen name="SpeedRecognitionSetup" component={SpeedRecognitionSetup} />
            <Stack.Screen name="SpeedRecognitionPlay" component={SpeedRecognitionPlay} />

            {/* Impostor Draw - COMPLETE */}
            <Stack.Screen name="ImpostorDrawSetup" component={ImpostorDrawSetup} />
            <Stack.Screen name="ImpostorDrawRoleReveal" component={ImpostorDrawRoleReveal} options={modalOptions} />
            <Stack.Screen name="ImpostorDrawPlay" component={ImpostorDrawPlay} />
            <Stack.Screen name="ImpostorDrawVote" component={ImpostorDrawVote} />
            <Stack.Screen name="ImpostorDrawResult" component={ImpostorDrawResult} options={modalOptions} />
            <Stack.Screen name="ImpostorDrawFinal" component={ImpostorDrawFinal} options={modalOptions} />

            {/* Wrong Answer Challenge - COMPLETE */}
            <Stack.Screen name="WrongAnswerSetup" component={WrongAnswerSetup} />
            <Stack.Screen name="WrongAnswerPlay" component={WrongAnswerPlay} />
            <Stack.Screen name="WrongAnswerVote" component={WrongAnswerVote} />
            <Stack.Screen name="WrongAnswerResult" component={WrongAnswerResult} options={modalOptions} />
            <Stack.Screen name="WrongAnswerFinal" component={WrongAnswerFinal} options={modalOptions} />

            {/* Auth Screens */}
            <Stack.Screen name="Login" component={LoginScreen} options={modalOptions} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={modalOptions} />

            {/* Multiplayer Screens */}
            <Stack.Screen name="CreateRoom" component={CreateRoomScreen} options={modalOptions} />
            <Stack.Screen name="JoinRoom" component={JoinRoomScreen} options={modalOptions} />
            <Stack.Screen name="RoomLobby" component={RoomLobbyScreen} />
        </Stack.Navigator>
    );
}

export default function AppNavigator() {
    const navigationRef = React.useRef(null);
    const [isFirstLaunch, setIsFirstLaunch] = React.useState(null);
    const [currentRoute, setCurrentRoute] = React.useState(null);

    React.useEffect(() => {
        AsyncStorage.getItem('hasLaunched').then(value => {
            if (value === null) {
                setIsFirstLaunch(true);
                setCurrentRoute('Onboarding');
            } else {
                setIsFirstLaunch(false);
                setCurrentRoute('Home');
            }
        });
    }, []);

    const handleNavigate = (screen) => {
        navigationRef.current?.navigate(screen);
    };

    if (isFirstLaunch === null) {
        return null; // Loading
    }

    // Hide navbar on these screens
    const hideNavbarScreens = ['Onboarding', 'Login', 'SignUp'];
    const showNavbar = currentRoute && !hideNavbarScreens.includes(currentRoute);

    return (
        <NavigationContainer
            ref={navigationRef}
            onReady={() => {
                const route = navigationRef.current?.getCurrentRoute();
                if (route) {
                    setCurrentRoute(route.name);
                }
            }}
            onStateChange={() => {
                const route = navigationRef.current?.getCurrentRoute();
                if (route) {
                    setCurrentRoute(route.name);
                }
            }}
        >
            <View style={{ flex: 1 }}>
                <AppStack isFirstLaunch={isFirstLaunch} />
                {showNavbar && (
                    <BottomNavBar
                        currentRoute={currentRoute}
                        onNavigate={handleNavigate}
                    />
                )}
            </View>
        </NavigationContainer>
    );
}

