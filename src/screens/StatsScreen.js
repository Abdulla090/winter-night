import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
    Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
    ChevronRight,
    Users,
    Brain,
    Palette,
    MessageCircle,
    Target,
    BookOpen,
    X,
    Zap,
    Flag,
    Award,
    Clock,
    AlertCircle,
    CheckCircle,
    Trophy
} from 'lucide-react-native';

import { AnimatedScreen } from '../components/AnimatedScreen';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

// Comprehensive game catalog with detailed rules
const GAMES_DATA = [
    {
        id: 1,
        name: 'Spyfall',
        nameKu: 'سپایفاڵ',
        icon: Users,
        color: '#EF4444',
        players: '3-8',
        time: '10-15 min',
        objective: 'Find the spy or survive as the spy',
        objectiveKu: 'سیخوڕەکە بدۆزەرەوە یان وەک سیخوڕ بمێنەرەوە',
        setup: [
            'One player is randomly chosen as the spy',
            'All other players receive the same secret location',
            'The spy receives a blank card with no location',
            'Players take turns asking questions to each other'
        ],
        setupKu: [
            'یەک کەس بە هەڕەمەکی وەک سیخوڕ هەڵدەبژێردرێت',
            'هەموو یاریزانەکانی تر هەمان شوێنی نهێنی وەردەگرن',
            'سیخوڕەکە کارتێکی بەتاڵ وەردەگرێت بەبێ شوێن',
            'یاریزانەکان بە نۆرە پرسیار لە یەکتری دەکەن'
        ],
        howToWin: [
            'Non-spies: Correctly identify who the spy is',
            'Spy: Figure out the location OR avoid detection until time runs out'
        ],
        howToWinKu: [
            'ناسیخوڕەکان: بە دروستی بزانن کێ سیخوڕەکەیە',
            'سیخوڕ: شوێنەکە بزانە یان دەستنەکەوە تا کاتەکە بچێتە کۆتایی'
        ],
        tips: [
            'Ask vague questions that could apply to multiple locations',
            'Pay attention to who is avoiding specific details',
            'As the spy, mirror the behavior of others'
        ],
        tipsKu: [
            'پرسیاری گشتی بکە کە بۆ چەند شوێنێک بگونجێت',
            'سەرنج بدە کێ لە وردەکاری دیاریکراو دوور دەکەوێتەوە',
            'وەک سیخوڕ، ڕەفتاری ئەوانی تر لاسای بکەرەوە'
        ]
    },
    {
        id: 2,
        name: 'Who Am I',
        nameKu: 'من کێم',
        icon: Brain,
        color: '#3B82F6',
        players: '2-10',
        time: '5-10 min',
        objective: 'Guess the character assigned to you',
        objectiveKu: 'کارەکتەرەکەی خۆت بزانە',
        setup: [
            'Each player gets a card with a famous character, person, or thing',
            'You CANNOT see your own card, but you can see everyone else\'s',
            'Place the card on your forehead or hold it facing outward',
            'Take turns asking yes/no questions to figure out who you are'
        ],
        setupKu: [
            'هەر یاریزانێک کارتێک وەردەگرێت کە کارەکتەرێکی بەناوبانگی تێدایە',
            'ناتوانیت کارتی خۆت ببینیت، بەڵام دەتوانیت کارتی ئەوانی تر ببینیت',
            'کارتەکە لەسەر ناوچەوانت دابنێ یان بەرەو دەرەوە بیگرە',
            'بە نۆرە پرسیاری بەڵێ/نەخێر بکە بۆ زانینی ئەوەی کێیت'
        ],
        howToWin: [
            'Be the first to correctly guess your character',
            'OR earn the most points by helping others guess while figuring out yours'
        ],
        howToWinKu: [
            'یەکەم کەس بە کە کارەکتەرەکەی خۆت بە دروستی بزانیت',
            'یان زۆرترین خاڵ بەدەست بهێنە بە یارمەتیدانی ئەوانی تر لە کاتێکدا خۆت دەیزانیت'
        ],
        tips: [
            'Start with broad questions: "Am I a real person?" "Am I alive?"',
            'Narrow down categories before guessing specific names',
            'Listen carefully to others\' questions for clues'
        ],
        tipsKu: [
            'بە پرسیاری گشتی دەست پێ بکە: "من کەسێکی ڕاستەقینەم؟" "زیندووم؟"',
            'پۆلەکان بچووک بکەرەوە پێش ئەوەی ناوی دیاریکراو بزانیت',
            'بە وریاییەوە گوێ لە پرسیارەکانی ئەوانی تر بگرە بۆ سەرنجەکان'
        ]
    },
    {
        id: 3,
        name: 'Truth or Dare',
        nameKu: 'ڕاستی یان ویستی',
        icon: MessageCircle,
        color: '#8B5CF6',
        players: '3-10',
        time: '15-30 min',
        objective: 'Complete challenges or answer honestly',
        objectiveKu: 'چالەنجەکان ئەنجام بدە یان بە ڕاستییەوە وەڵام بدەرەوە',
        setup: [
            'Players sit in a circle',
            'One player starts by choosing Truth or Dare',
            'Truth: Answer a personal question honestly',
            'Dare: Complete a fun or challenging task',
            'After completing, that player chooses the next person'
        ],
        setupKu: [
            'یاریزانەکان لە سووڕێکدا دادەنیشن',
            'یەک کەس دەست پێ دەکات بە هەڵبژاردنی ڕاستی یان ویستی',
            'ڕاستی: وەڵامی پرسیارێکی کەسی بە ڕاستییەوە بدەرەوە',
            'ویستی: ئەرکێکی خۆش یان چالاکی ئەنجام بدە',
            'دوای تەواوکردن، ئەو یاریزانە کەسی داهاتوو هەڵدەبژێرێت'
        ],
        howToWin: [
            'There are no winners - it\'s all about fun and bonding!',
            'Optional: Award points for completing difficult dares'
        ],
        howToWinKu: [
            'هیچ بردنەوەیەک نییە - تەواوی بۆ خۆشی و پەیوەندیکردنە!',
            'دڵخوازانە: خاڵ بدە بۆ ئەنجامدانی ویستی قورس'
        ],
        tips: [
            'Keep dares safe and appropriate for the group',
            'Be respectful with truth questions',
            'It\'s okay to skip if something makes you uncomfortable'
        ],
        tipsKu: [
            'ویستییەکان سەلامەت و گونجاو بە بۆ گروپەکە بهێڵەرەوە',
            'لە پرسیارەکانی ڕاستی ڕێزگرتن بە',
            'باشە پەراوێزی بکەیت ئەگەر شتێک ئێوە هەست بە ناڕەحەتی بکات'
        ]
    },
    {
        id: 4,
        name: 'Draw & Guess',
        nameKu: 'وێنە کێشە و بزانە',
        icon: Palette,
        color: '#F59E0B',
        players: '2-8',
        time: '10-20 min',
        objective: 'Draw words and guess what others draw',
        objectiveKu: 'وشەکان بکێشە و ئەوەی ئەوانی تر دەیکێشن بزانە',
        setup: [
            'One player is the "drawer" and receives a secret word',
            'The drawer has 60-90 seconds to draw the word',
            'Other players try to guess what\'s being drawn',
            'NO letters, numbers, or talking allowed while drawing!',
            'Rotate roles after each round'
        ],
        setupKu: [
            'یەک کەس "وێنەکێش"ە و وشەیەکی نهێنی وەردەگرێت',
            'وێنەکێشەکە ٦٠-٩٠ چرکەی هەیە بۆ کێشانی وشەکە',
            'یاریزانەکانی تر هەوڵ دەدەن بزانن چی دەکێشرێت',
            'هیچ پیت، ژمارە، یان قسەکردنێک ڕێپێنەدراوە لە کاتی کێشاندا!',
            'ڕۆڵەکان بسووڕێنەرەوە دوای هەر خولێک'
        ],
        howToWin: [
            'Drawer: Earn points when someone guesses correctly',
            'Guessers: Earn more points for guessing faster',
            'Player with most points after all rounds wins'
        ],
        howToWinKu: [
            'وێنەکێش: خاڵ بەدەست بهێنە کاتێک کەسێک بە دروستی بیزانێت',
            'بزانەرەکان: خاڵی زیاتر بەدەست بهێنە بە زانینی خێراتر',
            'یاریزان بە زۆرترین خاڵ دوای هەموو خولەکان دەباتەوە'
        ],
        tips: [
            'Start with the basic shape or outline',
            'Use context clues - draw related objects',
            'Simple is better than detailed for speed'
        ],
        tipsKu: [
            'بە شێوە یان دەوری سەرەکی دەست پێ بکە',
            'سەرنجی دەوروبەر بەکاربهێنە - شتە پەیوەندیدارەکان بکێشە',
            'سادەیی باشترە لە وردەکاری بۆ خێرایی'
        ]
    },
    {
        id: 5,
        name: 'Quiz Trivia',
        nameKu: 'کوێز',
        icon: Brain,
        color: '#10B981',
        players: '1-10',
        time: '5-15 min',
        objective: 'Answer questions correctly to earn points',
        objectiveKu: 'وەڵامی پرسیارەکان بە دروستی بدەرەوە بۆ بەدەستهێنانی خاڵ',
        setup: [
            'Choose a category (General, Science, History, Sports, etc.)',
            'Select difficulty level: Easy, Medium, or Hard',
            'Decide on number of questions (10, 15, or 20)',
            'Each question has a time limit',
            'Answer multiple choice questions by tapping your choice'
        ],
        setupKu: [
            'پۆلێک هەڵبژێرە (گشتی، زانست، مێژوو، وەرزش، هتد)',
            'ئاستی قورسی هەڵبژێرە: ئاسان، مامناوەند، یان قورس',
            'بڕیار لەسەر ژمارەی پرسیارەکان بدە (١٠، ١٥، یان ٢٠)',
            'هەر پرسیارێک سنووری کاتی هەیە',
            'وەڵامی پرسیارە فرە هەڵبژاردەییەکان بدەرەوە بە دەستکردن لەسەر هەڵبژاردنەکەت'
        ],
        howToWin: [
            'Earn points for each correct answer',
            'Bonus points for answering quickly',
            'Highest score wins in multiplayer mode',
            'Beat your personal best in solo mode'
        ],
        howToWinKu: [
            'خاڵ بەدەست بهێنە بۆ هەر وەڵامێکی دروست',
            'خاڵی زیادە بۆ وەڵامدانەوەی خێرا',
            'زۆرترین خاڵ لە شێوازی فرە یاریزان دەباتەوە',
            'باشترینی کەسی خۆت تێبپەڕێنە لە شێوازی تاک'
        ],
        tips: [
            'Read the entire question before answering',
            'Eliminate obviously wrong answers first',
            'Don\'t overthink - trust your first instinct'
        ],
        tipsKu: [
            'هەموو پرسیارەکە بخوێنەرەوە پێش وەڵامدانەوە',
            'وەڵامە بەڕوونی هەڵەکان سەرەتا لابە',
            'زۆر مەیر مەکەرەوە - متمانە بە یەکەم هەستی خۆت بکە'
        ]
    },
    {
        id: 6,
        name: 'Speed Challenge',
        nameKu: 'چالاکی خێرایی',
        icon: Zap,
        color: '#06B6D4',
        players: '1+',
        time: '2-5 min',
        objective: 'Memorize and recall numbers or flags instantly',
        objectiveKu: 'ژمارەکان یان ئاڵاکان بیر بخەرەوە و یاد بکەرەوە دەستبەجێ',
        setup: [
            'Choose mode: Numbers, Flags, or Mixed',
            'Select difficulty (number of digits: 2, 4, or 6)',
            'Choose display time: 0.5s, 0.75s, or 1s',
            'Set number of rounds: 5, 10, 15, or 20',
            'A number or flag will flash briefly - memorize it!'
        ],
        setupKu: [
            'شێواز هەڵبژێرە: ژمارەکان، ئاڵاکان، یان تێکەڵ',
            'قورسی هەڵبژێرە (ژمارەی ژمێرەکان: ٢، ٤، یان ٦)',
            'کاتی پیشاندان هەڵبژێرە: ٠.٥ چرکە، ٠.٧٥ چرکە، یان ١ چرکە',
            'ژمارەی خولەکان دابنێ: ٥، ١٠، ١٥، یان ٢٠',
            'ژمارە یان ئاڵایەک بۆ کاتێکی کورت دەردەکەوێت - بیری بخەوە!'
        ],
        howToWin: [
            'Type what you saw EXACTLY',
            'For flags: Type the country name',
            'Each correct answer = 1 point',
            'Build a streak for bonus satisfaction!',
            'Aim for 100% accuracy'
        ],
        howToWinKu: [
            'ئەوەی بینیت بە وردی بینووسە',
            'بۆ ئاڵاکان: ناوی وڵاتەکە بنووسە',
            'هەر وەڵامێکی دروست = ١ خاڵ',
            'زنجیرەیەک دروست بکە بۆ ڕەزامەندی زیادە!',
            'ئامانجت وردی ١٠٠٪ بێت'
        ],
        tips: [
            'Focus immediately when the challenge appears',
            'Say the number/country out loud to aid memory',
            'Start with 2 digits and work your way up',
            'Practice makes perfect - play daily!'
        ],
        tipsKu: [
            'دەستبەجێ سەرنج بدە کاتێک چالەنجەکە دەردەکەوێت',
            'ژمارە/وڵاتەکە بە دەنگێکی بەرز بڵێ بۆ یارمەتیدانی بیرهێنانەوە',
            'بە ٢ ژمێرە دەست پێ بکە و ڕێگای خۆت بگرە بەرەو سەرەوە',
            'مەشق تەواوی دروست دەکات - ڕۆژانە یاری بکە!'
        ]
    },
    {
        id: 7,
        name: 'Impostor Draw',
        nameKu: 'ناسێنەرە وێنە',
        icon: Palette,
        color: '#EC4899',
        players: '3+',
        time: '5-10 min',
        objective: 'Find who got a different word',
        objectiveKu: 'بدۆزەرەوە کێ وشەیەکی جیاوازی وەرگرتووە',
        setup: [
            'All players draw simultaneously',
            'Everyone gets the SAME word... except one impostor!',
            'The impostor gets a different (but related) word',
            'Everyone has 60 seconds to draw',
            'After drawing, players vote on who the impostor is'
        ],
        setupKu: [
            'هەموو یاریزانەکان لە هەمان کاتدا دەکێشن',
            'هەموان هەمان وشە وەردەگرن... بەبێ یەک ناسێنەرە!',
            'ناسێنەرەکە وشەیەکی جیاواز (بەڵام پەیوەندیدار) وەردەگرێت',
            'هەموان ٦٠ چرکەیان هەیە بۆ کێشان',
            'دوای کێشان، یاریزانەکان دەنگ دەدەن کێ ناسێنەرەکەیە'
        ],
        howToWin: [
            'Regular players: Identify the impostor correctly',
            'Impostor: Blend in and avoid getting caught',
            'Points awarded for correct identification or successful deception'
        ],
        howToWinKu: [
            'یاریزانە ئاساییەکان: ناسێنەرەکە بە دروستی بناسنەوە',
            'ناسێنەرە: تێکەڵ بە و خۆت لە گرتن دوور بخەرەوە',
            'خاڵ دەدرێت بۆ ناسینەوەی دروست یان فریودانی سەرکەوتوو'
        ],
        tips: [
            'As impostor: Draw something generic that could fit multiple words',
            'As regular player: Look for drawings that seem off',
            'Don\'t make your drawing too obvious or too vague'
        ],
        tipsKu: [
            'وەک ناسێنەرە: شتێکی گشتی بکێشە کە بۆ چەند وشەیەک بگونجێت',
            'وەک یاریزانی ئاسایی: بگەڕێ بۆ وێنەکان کە وادیارە دەرچوون',
            'وێنەکەت زۆر ڕوون یان زۆر گومان مەکە'
        ]
    },
    {
        id: 8,
        name: 'Forbidden Word',
        nameKu: 'وشەی قەدەغە',
        icon: MessageCircle,
        color: '#F97316',
        players: '4-10',
        time: '10-15 min',
        objective: 'Describe words without using forbidden terms',
        objectiveKu: 'وشەکان باس بکە بەبێ بەکارهێنانی زاراوە قەدەغەکان',
        setup: [
            'Divide into two teams',
            'One player from Team A is the "describer"',
            'They see a word and 3-5 forbidden related words',
            'They must describe the main word WITHOUT saying forbidden words',
            'Team has 60 seconds to guess as many words as possible',
            'Teams alternate turns'
        ],
        setupKu: [
            'بۆ دوو تیم دابەش بکە',
            'یەک کەس لە تیمی A "باسکەر"ە',
            'وشەیەک و ٣-٥ وشەی قەدەغەی پەیوەند دەبینن',
            'دەبێ وشە سەرەکییەکە باس بکەن بەبێ وتنی وشە قەدەغەکان',
            'تیمەکە ٦٠ چرکەی هەیە بۆ زانینی هەرچەندە وشەیەک',
            'تیمەکان نۆرە دەگۆڕن'
        ],
        howToWin: [
            'Earn 1 point for each correctly guessed word',
            'Lose 1 point if forbidden word is said',
            'Team with most points after all rounds wins'
        ],
        howToWinKu: [
            '١ خاڵ بەدەست بهێنە بۆ هەر وشەیەکی بە دروستی زانراو',
            '١ خاڵ لەدەست بدە ئەگەر وشەی قەدەغە بوترێت',
            'تیم بە زۆرترین خاڵ دوای هەموو خولەکان دەباتەوە'
        ],
        tips: [
            'Use synonyms and examples',
            'Think of the category or use the word in a sentence',
            'Teammates: shout out guesses quickly!'
        ],
        tipsKu: [
            'هاوواتا و نموونەکان بەکاربهێنە',
            'بیر لە پۆلەکە بکەرەوە یان وشەکە لە ڕستەیەکدا بەکاربهێنە',
            'هاوتیمەکان: حەدسەکان بە خێرایی هاوار بکەن!'
        ]
    },
    {
        id: 9,
        name: 'Pyramid Game',
        nameKu: 'یاری پیرامید',
        icon: Target,
        color: '#14B8A6',
        players: '2-8',
        time: '15-25 min',
        objective: 'Climb to the top of the pyramid',
        objectiveKu: 'بگە سەرەوەی پیرامیدەکە',
        setup: [
            'Players start at the bottom level of a pyramid',
            'Each level has questions (easy → hard as you climb)',
            'Answer correctly to move UP one level',
            'Answer incorrectly to move DOWN one level',
            'You can challenge the level above for bonus points'
        ],
        setupKu: [
            'یاریزانەکان لە ئاستی خوارەوەی پیرامیدەکە دەست پێ دەکەن',
            'هەر ئاستێک پرسیاری هەیە (ئاسان → قورس کە بەرزدەبیتەوە)',
            'وەڵامی دروست بدەرەوە بۆ چوونە سەرەوە یەک ئاست',
            'وەڵامی هەڵە بدەرەوە بۆ چوونە خوارەوە یەک ئاست',
            'دەتوانیت ئاستی سەرەوە چالەنج بکەیت بۆ خاڵی زیادە'
        ],
        howToWin: [
            'First player to reach the top wins',
            'OR player at highest level when time runs out',
            'Strategic risk-taking is key!'
        ],
        howToWinKu: [
            'یەکەم یاریزان کە دەگاتە سەرەوە دەباتەوە',
            'یان یاریزان لە بەرزترین ئاست کاتێک کاتەکە تەواو دەبێت',
            'ئەو مەترسییەی ستراتیژی کلیلە!'
        ],
        tips: [
            'Don\'t rush - accuracy > speed in this game',
            'Know when to play safe vs. take risks',
            'Study the question categories as you progress'
        ],
        tipsKu: [
            'پەلە مەکە - وردی > خێرایی لەم یارییەدا',
            'بزانە کەی بە سەلامەتی یاری بکەیت بەرامبەر بە مەترسی',
            'پۆلەکانی پرسیار لێکۆڵینەوە بکە کە پێشدەچیت'
        ]
    },
    {
        id: 10,
        name: 'Country Flags',
        nameKu: 'ئاڵای وڵاتان',
        icon: Flag,
        color: '#6366F1',
        players: '1+',
        time: '3-10 min',
        objective: 'Identify country flags as fast as possible',
        objectiveKu: 'ئاڵاکانی وڵاتان هەرچی خێراتر بناسەرەوە',
        setup: [
            'A country flag image appears on screen',
            'You have limited time to type the country name',
            'Flags are from 50+ countries worldwide',
            'Multiple spelling variations accepted (English/Kurdish)',
            'Immediate feedback after each answer'
        ],
        setupKu: [
            'وێنەی ئاڵای وڵاتێک لەسەر شاشە دەردەکەوێت',
            'کاتێکی سنووردارت هەیە بۆ نووسینی ناوی وڵاتەکە',
            'ئاڵاکان لە ٥٠+ وڵات لە سەرانسەری جیهانن',
            'چەند گۆڕانکارییەکی ڕێنووس قبووڵ دەکرێن (ئینگلیزی/کوردی)',
            'وەڵامی دەستبەجێ دوای هەر وەڵامێک'
        ],
        howToWin: [
            'Earn 1 point per correct answer',
            'Build a streak for consecutive correct answers',
            'Aim for 100% accuracy across all rounds',
            'Challenge yourself with more rounds for higher scores'
        ],
        howToWinKu: [
            '١ خاڵ بەدەست بهێنە بۆ هەر وەڵامێکی دروست',
            'زنجیرەیەک دروست بکە بۆ وەڵامە دروستە بەردەوامەکان',
            'ئامانجت وردی ١٠٠٪ بێت لە هەموو خولەکاندا',
            'خۆت چالەنج بکە بە خولی زیاتر بۆ خاڵی بەرزتر'
        ],
        tips: [
            'Learn flag patterns: colors, symbols, arrangements',
            'Focus on unique features (stars, crescents, animals)',
            'Regional knowledge helps (neighboring countries)',
            'Practice regularly to improve recognition speed'
        ],
        tipsKu: [
            'نەخشی ئاڵاکان فێر بە: ڕەنگەکان، هێماکان، ڕێکخستنەکان',
            'سەرنج بدە تایبەتمەندی ناوازەکان (ئەستێرەکان، مانگەکان، ئاژەڵەکان)',
            'زانیاری ناوچەیی یارمەتی دەدات (وڵاتە دراوسێکان)',
            'بە بەردەوامی مەشق بکە بۆ باشترکردنی خێرایی ناسینەوە'
        ]
    },
];

const GameCard = ({ game, onPress, isDark, isKurdish }) => (
    <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPress(game)}
        style={[
            styles.gameCard,
            {
                backgroundColor: isDark ? '#1A0B2E' : '#FFF',
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0'
            }
        ]}
    >
        <View style={styles.gameCardLeft}>
            <LinearGradient
                colors={[game.color, game.color + 'CC']}
                style={styles.gameIcon}
            >
                <game.icon size={22} color="#FFF" />
            </LinearGradient>
            <View style={styles.gameInfo}>
                <Text style={[styles.gameName, { color: isDark ? '#FFF' : '#1E293B' }, isKurdish && styles.kurdishFont]}>
                    {isKurdish ? game.nameKu : game.name}
                </Text>
                <Text style={[styles.gameDetails, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                    {game.players} players • {game.time}
                </Text>
            </View>
        </View>
        <ChevronRight size={20} color={isDark ? '#6B5A8A' : '#94A3B8'} />
    </TouchableOpacity>
);

const GameDetailModal = ({ game, visible, onClose, isDark, isKurdish }) => {
    if (!game) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={onClose}
                    style={styles.modalBackdrop}
                />
                <View style={[styles.modalContent, { backgroundColor: isDark ? '#150824' : '#FFF' }]}>
                    {/* Header */}
                    <LinearGradient
                        colors={[game.color, game.color + 'CC']}
                        style={styles.modalHeader}
                    >
                        <View style={styles.modalHeaderTop}>
                            <View style={styles.modalHeaderLeft}>
                                <game.icon size={28} color="#FFF" />
                                <Text style={[styles.modalTitle, isKurdish && styles.kurdishFont]}>
                                    {isKurdish ? game.nameKu : game.name}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                <X size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalMeta}>
                            <View style={styles.metaItem}>
                                <Users size={14} color="rgba(255,255,255,0.9)" />
                                <Text style={styles.metaText}>{game.players}</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <Clock size={14} color="rgba(255,255,255,0.9)" />
                                <Text style={styles.metaText}>{game.time}</Text>
                            </View>
                        </View>
                    </LinearGradient>

                    {/* Body */}
                    <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                        {/* Objective */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Award size={18} color={game.color} />
                                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#1E293B' }, isKurdish && styles.kurdishFont]}>
                                    {isKurdish ? 'ئامانج' : 'Objective'}
                                </Text>
                            </View>
                            <Text style={[styles.objectiveText, { color: isDark ? '#E2E8F0' : '#334155' }, isKurdish && styles.kurdishFont]}>
                                {isKurdish ? game.objectiveKu : game.objective}
                            </Text>
                        </View>

                        {/* Setup */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <AlertCircle size={18} color={game.color} />
                                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#1E293B' }, isKurdish && styles.kurdishFont]}>
                                    {isKurdish ? 'ئامادەکاری' : 'Setup'}
                                </Text>
                            </View>
                            {(isKurdish ? game.setupKu : game.setup).map((step, index) => (
                                <View key={index} style={styles.stepRow}>
                                    <View style={[styles.stepNumber, { backgroundColor: game.color + '20' }]}>
                                        <Text style={[styles.stepNumberText, { color: game.color }]}>{index + 1}</Text>
                                    </View>
                                    <Text style={[styles.stepText, { color: isDark ? '#CBD5E1' : '#475569' }, isKurdish && styles.kurdishFont]}>
                                        {step}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        {/* How to Win */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Trophy size={18} color={game.color} />
                                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#1E293B' }, isKurdish && styles.kurdishFont]}>
                                    {isKurdish ? 'چۆن بباتەوە' : 'How to Win'}
                                </Text>
                            </View>
                            {(isKurdish ? game.howToWinKu : game.howToWin).map((rule, index) => (
                                <View key={index} style={styles.bulletRow}>
                                    <CheckCircle size={16} color={game.color} />
                                    <Text style={[styles.bulletText, { color: isDark ? '#CBD5E1' : '#475569' }, isKurdish && styles.kurdishFont]}>
                                        {rule}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        {/* Tips */}
                        <View style={[styles.section, { marginBottom: 24 }]}>
                            <View style={styles.sectionHeader}>
                                <Zap size={18} color={game.color} />
                                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#1E293B' }, isKurdish && styles.kurdishFont]}>
                                    {isKurdish ? 'ئامۆژگارییەکان' : 'Pro Tips'}
                                </Text>
                            </View>
                            {(isKurdish ? game.tipsKu : game.tips).map((tip, index) => (
                                <View key={index} style={styles.bulletRow}>
                                    <View style={[styles.tipDot, { backgroundColor: game.color }]} />
                                    <Text style={[styles.bulletText, { color: isDark ? '#CBD5E1' : '#475569' }, isKurdish && styles.kurdishFont]}>
                                        {tip}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default function StatsScreen() {
    const { colors, isDark } = useTheme();
    const { isKurdish } = useLanguage();
    const [selectedGame, setSelectedGame] = useState(null);

    return (
        <AnimatedScreen>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.title, { color: colors.text.primary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'چۆن یاری بکەیت' : 'How to Play'}
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.text.secondary }, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'فێربە لە هەموو یارییەکان' : 'Complete guides for all games'}
                        </Text>
                    </View>
                    <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
                        <BookOpen size={24} color={colors.primary} />
                    </View>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {GAMES_DATA.map((game) => (
                        <GameCard
                            key={game.id}
                            game={game}
                            onPress={setSelectedGame}
                            isDark={isDark}
                            isKurdish={isKurdish}
                        />
                    ))}

                    <View style={{ height: 100 }} />
                </ScrollView>

                <GameDetailModal
                    game={selectedGame}
                    visible={!!selectedGame}
                    onClose={() => setSelectedGame(null)}
                    isDark={isDark}
                    isKurdish={isKurdish}
                />
            </View>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 20,
    },
    title: { fontSize: 32, fontWeight: '800' },
    subtitle: { fontSize: 14, marginTop: 4 },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },

    scrollContent: { paddingHorizontal: 24 },

    gameCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 12,
    },
    gameCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
    gameIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gameInfo: { flex: 1 },
    gameName: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
    gameDetails: { fontSize: 12 },

    // Modal - Slide in from bottom, no popup
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalContent: {
        maxHeight: '90%',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        overflow: 'hidden',
    },
    modalHeader: { paddingBottom: 20 },
    modalHeaderTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    modalHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFF',
    },
    closeBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalMeta: {
        flexDirection: 'row',
        gap: 16,
        paddingHorizontal: 24,
        marginTop: 12,
    },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    metaText: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '600' },

    modalBody: { paddingHorizontal: 24, paddingTop: 24 },

    section: { marginBottom: 28 },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    sectionTitle: { fontSize: 18, fontWeight: '700' },

    objectiveText: {
        fontSize: 15,
        lineHeight: 24,
        fontWeight: '600',
    },

    stepRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    stepNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepNumberText: { fontSize: 13, fontWeight: '700' },
    stepText: { fontSize: 14, lineHeight: 22, flex: 1 },

    bulletRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
        alignItems: 'flex-start',
    },
    bulletText: { fontSize: 14, lineHeight: 22, flex: 1 },
    tipDot: { width: 6, height: 6, borderRadius: 3, marginTop: 8 },

    kurdishFont: {
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },
});
