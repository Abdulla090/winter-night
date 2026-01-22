import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { COLORS } from '../constants/theme';

// Screens
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';

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

// Auth Screens
import LoginScreen from '../screens/Auth/LoginScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';

// Multiplayer Screens
import CreateRoomScreen from '../screens/Multiplayer/CreateRoomScreen';
import JoinRoomScreen from '../screens/Multiplayer/JoinRoomScreen';
import RoomLobbyScreen from '../screens/Multiplayer/RoomLobbyScreen';

const Stack = createStackNavigator();

const screenOptions = {
    headerShown: false,
    cardStyle: { backgroundColor: COLORS.background.dark },
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    gestureEnabled: true,
};

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={screenOptions}>
                {/* Main */}
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />

                {/* Who Am I - COMPLETE */}
                <Stack.Screen name="WhoAmISetup" component={WhoAmISetup} />
                <Stack.Screen name="WhoAmIPlay" component={WhoAmIPlay} />
                <Stack.Screen name="WhoAmIResults" component={WhoAmIResults} />

                {/* Imposter - COMPLETE */}
                <Stack.Screen name="ImposterSetup" component={ImposterSetup} />
                <Stack.Screen name="ImposterPlay" component={ImposterPlay} />
                <Stack.Screen name="ImposterResult" component={ImposterResult} />

                {/* Spyfall - COMPLETE */}
                <Stack.Screen name="SpyfallSetup" component={SpyfallSetup} />
                <Stack.Screen name="SpyfallPlay" component={SpyfallPlay} />
                <Stack.Screen name="SpyfallResult" component={SpyfallResult} />

                {/* Truth or Dare - COMPLETE */}
                <Stack.Screen name="TruthOrDareSetup" component={TruthOrDareSetup} />
                <Stack.Screen name="TruthOrDarePlay" component={TruthOrDarePlay} />
                <Stack.Screen name="TruthOrDareResult" component={TruthOrDareResult} />

                {/* Never Have I Ever - COMPLETE */}
                <Stack.Screen name="NeverHaveIEverSetup" component={NeverHaveIEverSetup} />
                <Stack.Screen name="NeverHaveIEverPlay" component={NeverHaveIEverPlay} />
                <Stack.Screen name="NeverHaveIEverResult" component={NeverHaveIEverResult} />

                {/* Would You Rather - COMPLETE */}
                <Stack.Screen name="WouldYouRatherSetup" component={WouldYouRatherSetup} />
                <Stack.Screen name="WouldYouRatherPlay" component={WouldYouRatherPlay} />

                {/* Quiz Trivia - COMPLETE */}
                <Stack.Screen name="QuizSetup" component={QuizSetup} />
                <Stack.Screen name="QuizPlay" component={QuizPlay} />
                <Stack.Screen name="QuizResult" component={QuizResult} />

                {/* Draw & Guess - COMPLETE */}
                <Stack.Screen name="DrawGuessSetup" component={DrawGuessSetup} />
                <Stack.Screen name="DrawGuessPlay" component={DrawGuessPlay} />
                <Stack.Screen name="DrawGuessResult" component={DrawGuessResult} />

                {/* Pyramid Game */}
                <Stack.Screen name="PyramidSetup" component={PyramidSetupScreen} />
                <Stack.Screen name="PyramidGameBoard" component={PyramidGameBoardScreen} />
                <Stack.Screen name="PyramidPlay" component={PyramidPlayScreen} />
                <Stack.Screen name="PyramidResult" component={PyramidResultScreen} />

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

                {/* Auth Screens */}
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />

                {/* Multiplayer Screens */}
                <Stack.Screen name="CreateRoom" component={CreateRoomScreen} />
                <Stack.Screen name="JoinRoom" component={JoinRoomScreen} />
                <Stack.Screen name="RoomLobby" component={RoomLobbyScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
