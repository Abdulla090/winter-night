# Winter Night

Winter Night is a cross-platform mobile application designed for social gatherings and party entertainment. Built with React Native and Expo, it aggregates over 15 interactive games ranging from social deduction and trivia to word puzzles and icebreakers. The application supports both offline interactions and real-time online multiplayer capabilities powered by Supabase.

## Features

### Game Architecture
The platform implements a modular game engine allowing for distinct rulesets and UI states for each game mode.
*   **Social Deduction**: Imposter, Spyfall, Who Am I.
*   **Verbal & Word Games**: Forbidden Word (Taboo-style), Word Chain, Reverse Charades.
*   **Trivia & Knowledge**: Quiz Trivia, Lyrics Challenge, Emoji Decoder.
*   **Icebreakers**: Truth or Dare, Never Have I Ever, Would You Rather, Partners in Crime.
*   **Casual**: Draw & Guess, Pyramid, Wheel of Fortune.

### Core Systems
*   **Real-time Multiplayer**: Uses Supabase Realtime channels for low-latency state synchronization. Features include room creation, lobby management, player presence tracking, and dynamic host controls.
*   **Localization**: Full internationalization support with dynamic switching between English and Kurdish. Includes automatic LayoutAnimation handling for RTL (Right-to-Left) text direction.
*   **Authentication**: Secure user authentication and profile management via Supabase Auth.
*   **Design System**: A custom glassmorphism interface implementation using linear gradients and blur views, ensuring consistent visual identity across iOS and Android.

## Technology Stack

*   **Runtime**: [Expo SDK](https://expo.dev) (React Native)
*   **Language**: JavaScript (ES6+)
*   **Navigation**: React Navigation v6 (Stack)
*   **Backend & Realtime**: [Supabase](https://supabase.com)
*   **Animations**: Moti (powered by Reanimated 2)
*   **Icons**: Lucide React Native
*   **Storage**: Async Storage

## Installation

### Prerequisites
*   Node.js (LTS version recommended)
*   npm or yarn
*   Expo Go application on a mobile device or an Android/iOS emulator

### Setup Steps

1.  Clone the repository:
    ```bash
    git clone https://github.com/Abdulla090/winter-night.git
    cd winter-night
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Environment Configuration:
    Create a `.env` file in the root directory and add your Supabase configuration:
    ```env
    EXPO_PUBLIC_SUPABASE_URL=your_project_url
    EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
    ```

4.  Start the development server:
    ```bash
    npx expo start
    ```

5.  Scan the QR code with the Expo Go app.

## Project Structure

```text
src/
├── components/      # Reusable UI components (Buttons, Cards, Inputs)
├── constants/       # Static data, theme definitions, and game assets
├── context/         # React Context providers (Auth, Language, GameRoom)
├── lib/             # External service configurations (Supabase client)
├── navigation/      # Stack navigator and route definitions
├── screens/         # Screen components grouped by feature/game
│   ├── Auth/        # Login and Signup screens
│   ├── Multiplayer/ # Lobby, Room Creation, and Join screens
│   └── [GameName]/  # Individual game implementation folders
└── utils/           # Helper functions and logic utilities
```

## Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/NewFeature`).
3.  Commit your changes (`git commit -m 'Add NewFeature'`).
4.  Push to the branch (`git push origin feature/NewFeature`).
5.  Open a Pull Request.

## License

This project is licensed under the MIT License.
