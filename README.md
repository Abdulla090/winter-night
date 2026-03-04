<div align="center">

# 🌙 Winter Night

### *The Ultimate Party Games Platform*

[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo_SDK_54-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-blue?style=for-the-badge)]()

---

**Winter Night** is a stunning cross-platform party games app with **19+ interactive games**, real-time online multiplayer, and full **English & Kurdish** bilingual support. Built for unforgettable social gatherings.

[🎮 Play Now](#installation) · [📖 Documentation](#features) · [🤝 Contribute](#contributing)

</div>

---

## ✨ Highlights

<table>
<tr>
<td width="33%" align="center">

### 🎮 19+ Games
From trivia to social deduction, every party is covered

</td>
<td width="33%" align="center">

### 🌐 Bilingual
Full English & Kurdish (Sorani) with RTL support

</td>
<td width="33%" align="center">

### ⚡ Real-time
Live multiplayer powered by Supabase Realtime

</td>
</tr>
<tr>
<td width="33%" align="center">

### 🎨 Premium UI
Glassmorphism design with dark & light themes

</td>
<td width="33%" align="center">

### 📱 Cross-Platform
Runs on iOS, Android & Web

</td>
<td width="33%" align="center">

### 🔐 Secure Auth
User accounts with Supabase Authentication

</td>
</tr>
</table>

---

## 🎯 Games Library

Winter Night offers an extensive library of party games organized into categories:

### 🕵️ Social Deduction
| Game | Players | Description |
|------|---------|-------------|
| **Imposter** | 4-10 | Find the imposter who doesn't know the secret word |
| **Spyfall** | 3-12 | Detect the spy who doesn't know the location |
| **Who Am I?** | 2-10 | Guess the character on your forehead |
| **Impostor Draw** | 3-8 | Spot the player drawing a different word |

### 🧠 Trivia & Knowledge
| Game | Players | Description |
|------|---------|-------------|
| **Family Feud (پرس ١٠٠)** | 2+ | Guess the most popular survey answers |
| **Trivia Quiz** | 1-10 | Test knowledge across 5+ categories |
| **Emoji Decoder** | 2-10 | Decode emoji puzzles into words |
| **Lyrics Challenge** | 2-8 | Complete the missing song lyrics |
| **Wrong Answer** | 2-10 | Give the funniest wrong answers to simple questions |

### 💬 Word & Verbal
| Game | Players | Description |
|------|---------|-------------|
| **Forbidden Word** | 3-10 | Describe a word without using taboo words |
| **Word Chain** | 2-6 | Chain words before time runs out |
| **Reverse Charades** | 6+ | The group acts, one person guesses |
| **Pyramid** | 4+ | Give clues to guess words in categories |

### 🔥 Icebreakers & Social
| Game | Players | Description |
|------|---------|-------------|
| **Truth or Dare** | 2-20 | Classic party game with 3 intensity levels |
| **Never Have I Ever** | 3-15 | Discover secrets with escalating statements |
| **Would You Rather** | 2-20 | Impossible choices that spark debates |
| **Partners in Crime** | 4+ | How well do you know your partner? |

### 🎲 Casual & Fun
| Game | Players | Description |
|------|---------|-------------|
| **Draw & Guess** | 3-10 | Draw and guess words Pictionary-style |
| **Wheel of Fortune** | 2-8 | Spin the wheel for custom challenges |
| **Speed Challenge** | 1+ | Fast-paced pattern recognition |

---

## 🏗️ Architecture

```
winter-night/
├── 📁 assets/
│   └── 📁 games/           # Game thumbnail images (19 PNGs)
├── 📁 src/
│   ├── 📁 assets/           # Image registry (gameImages.js)
│   ├── 📁 components/       # Reusable UI (AnimatedScreen, GlassCard, BeastButton)
│   ├── 📁 constants/        # Game data files (bilingual question banks)
│   ├── 📁 context/          # React Context (Auth, Language, Theme, GameRoom)
│   ├── 📁 data/             # Extended datasets (Family Feud questions)
│   ├── 📁 lib/              # Supabase client config
│   ├── 📁 localization/     # Translation strings (EN/KU)
│   ├── 📁 navigation/       # Stack Navigator & routes
│   ├── 📁 screens/          # Feature screens
│   │   ├── 📁 Auth/         # Login & Signup
│   │   ├── 📁 Multiplayer/  # Online rooms & lobbies
│   │   ├── 📁 FamilyFeud/   # Family Feud game engine
│   │   ├── 📁 DrawGuess/    # Drawing game
│   │   └── 📁 [GameName]/   # Each game has Setup + Play screens
│   └── 📁 theme/            # Design tokens & layout constants
├── 📄 App.js                # Entry point
├── 📄 app.json              # Expo configuration
└── 📄 package.json          # Dependencies
```

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime** | Expo SDK 54 | Cross-platform React Native |
| **UI Framework** | React Native 0.81 | Native mobile components |
| **Language** | JavaScript (ES6+) | Application logic |
| **Navigation** | React Navigation 7 | Stack-based routing |
| **Backend** | Supabase | Auth, Database, Realtime |
| **Animations** | Moti + Reanimated 3 | Fluid 60fps animations |
| **Icons** | Lucide React Native | 1000+ beautiful icons |
| **Styling** | Linear Gradients + Blur | Glassmorphism design system |
| **Storage** | AsyncStorage | Local persistence |
| **Haptics** | Expo Haptics | Tactile feedback |

</div>

---

## 🚀 Installation

### Prerequisites

- **Node.js** v18+ (LTS recommended)
- **npm** or **yarn**
- **Expo Go** app on your device *or* an emulator

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Abdulla090/winter-night.git
cd winter-night

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials:
# EXPO_PUBLIC_SUPABASE_URL=your_project_url
# EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# 4. Start the development server
npx expo start

# 5. Scan the QR code with Expo Go 📱
```

### Platform-Specific Commands

```bash
# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios

# Run on Web
npx expo start --web

# Build APK (Android)
eas build --platform android --profile preview
```

---

## 🌍 Localization

Winter Night features complete bilingual support:

| Feature | English | Kurdish (Sorani) |
|---------|---------|------------------|
| UI Direction | LTR (Left-to-Right) | RTL (Right-to-Left) |
| Game Content | ✅ Full | ✅ Full |
| Questions & Answers | ✅ 500+ items | ✅ 500+ items |
| System Messages | ✅ Complete | ✅ Complete |

Language switching is instant and persisted across sessions. The entire UI flips direction seamlessly for Kurdish users.

---

## 📊 Game Data Statistics

| Game | Items Count | Categories |
|------|-------------|------------|
| Family Feud | 40+ questions | Standard, Fast Money |
| Quiz | 80+ questions | Science, Geography, Sports, Music, Technology |
| Truth or Dare | 100+ prompts | Mild, Spicy, Extreme |
| Never Have I Ever | 80+ statements | Clean, Spicy, No Filter |
| Would You Rather | 70+ questions | Fun, Deep, Silly, Extreme |
| Imposter Words | 140+ words | Food, Animals, Places, Objects, Activities, Sports |
| Drawing Words | 150+ words | Easy, Medium, Hard, Actions, Places |
| Who Am I | 120+ characters | Celebrities, Cartoons, Movies, Animals, Jobs, Historical, Food |
| Spyfall | 20+ locations | Each with 8 bilingual roles |
| Forbidden Word | 40+ words | Easy, Medium, Hard |
| Emoji Decoder | 30+ puzzles | Movies, Songs, Countries, Food, Phrases |

> All data is available in both **English** and **Kurdish** 🌐

---

## 🎨 Design System

Winter Night uses a custom **glassmorphism-based** design system:

- **🌑 Dark Mode**: Deep purple gradients with neon accents (#D900FF, #7C3AED)
- **☀️ Light Mode**: Clean whites with sky blue accents (#0EA5E9)
- **Glass Cards**: Blur-backed translucent containers
- **Smooth Animations**: Spring-physics powered by Moti/Reanimated
- **Haptic Feedback**: Tactile responses on interactions
- **Custom Typography**: Rabar font for Kurdish, system fonts for English

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

### Contribution Ideas
- 🎮 Add new party games
- 🌍 Add more languages
- 🧪 Write tests
- 📱 Improve platform-specific behavior
- 🎨 Design new game thumbnails

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### Made with ❤️ for unforgettable nights

**[⬆ Back to Top](#-winter-night)**

</div>
