import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Keyboard,
    Vibration,
    Dimensions,
    Image,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
    X,
    Check,
    RotateCcw,
    Home,
    Trophy,
    Target,
    Zap,
    Star,
    ChevronRight,
} from 'lucide-react-native';

import { AnimatedScreen } from '../components/AnimatedScreen';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

// --- COUNTRY FLAGS DATA - Using flag images from CDN ---
const FLAGS_DATA = [
    // --- NORTH AMERICA ---
    { code: 'us', name: 'USA', namesKu: ['ئەمریکا', 'ئەمەریکا', 'ئەمریكا', 'ویلایەتە یەکگرتووەکان', 'ئەمریکای', 'ئەمەریکی', 'یوئێسئەی', 'ئەمستەردام'] },
    { code: 'ca', name: 'Canada', namesKu: ['کەنەدا', 'کەنەدا', 'کەنەدی', 'کەنادا'] },
    { code: 'mx', name: 'Mexico', namesKu: ['مەکسیک', 'مەکسیکۆ', 'مەکسیکی'] },

    // --- EUROPE ---
    { code: 'gb', name: 'UK', namesKu: ['بەریتانیا', 'بەریتانیا', 'ئینگلتەرا', 'یونایتد کینگدۆم', 'ئینگلستان', 'لەندەن', 'بریتانیا'] },
    { code: 'fr', name: 'France', namesKu: ['فەرەنسا', 'فەرەنسا', 'فەرەنسی', 'فرەنسا', 'پاریس'] },
    { code: 'de', name: 'Germany', namesKu: ['ئەڵمانیا', 'ئەلمانیا', 'ئالمانیا', 'ئەڵمان', 'جەرمەنی', 'ئالمان'] },
    { code: 'it', name: 'Italy', namesKu: ['ئیتالیا', 'ئیتاڵیا', 'ئیتالی', 'ئیتاڵی', 'رۆما'] },
    { code: 'es', name: 'Spain', namesKu: ['ئیسپانیا', 'ئیسپەنیا', 'ئیسپانی', 'ئیسپەنی', 'مەدرید'] },
    { code: 'pt', name: 'Portugal', namesKu: ['پورتوگال', 'پۆرتوگال', 'پورتوغال', 'پۆرتوگاڵ', 'پورتوگال'] },
    { code: 'nl', name: 'Netherlands', namesKu: ['هۆلەندا', 'ھۆڵەندا', 'هۆڵەندا', 'نێزەرلاند', 'ئەمستەردام'] },
    { code: 'be', name: 'Belgium', namesKu: ['بەلجیکا', 'بەلجیکا', 'بەلجیک', 'بەلجیكا'] },
    { code: 'ch', name: 'Switzerland', namesKu: ['سویسرا', 'سویسڕا', 'سویسری', 'سویس'] },
    { code: 'se', name: 'Sweden', namesKu: ['سوید', 'سوید', 'سوێد', 'سود'] },
    { code: 'no', name: 'Norway', namesKu: ['نەرویج', 'نەرویژ', 'نەروێژ', 'نەروەی'] },
    { code: 'pl', name: 'Poland', namesKu: ['پۆڵەندا', 'پۆڵەندا', 'پۆلۆنیا', 'پۆلەندا'] },
    { code: 'gr', name: 'Greece', namesKu: ['یۆنان', 'یۆنان', 'ئەسیما', 'گریس'] },
    { code: 'ru', name: 'Russia', namesKu: ['ڕووسیا', 'ڕوسیا', 'روسیا', 'ڕوسی', 'مۆسکۆ'] },
    { code: 'ua', name: 'Ukraine', namesKu: ['ئۆکرانیا', 'ئۆکراینا', 'ئۆکرانی'] },
    { code: 'hr', name: 'Croatia', namesKu: ['کرۆاتیا', 'کررواتیا', 'کرۆواتیا'] },
    { code: 'dk', name: 'Denmark', namesKu: ['دانیمارک', 'دانمارک', 'دینمارک'] },
    { code: 'fi', name: 'Finland', namesKu: ['فینلاند', 'فینلەندا', 'فێنلاند'] },

    // --- ASIA ---
    { code: 'jp', name: 'Japan', namesKu: ['ژاپۆن', 'یابان', 'جاپان', 'یابانی'] },
    { code: 'cn', name: 'China', namesKu: ['چین', 'سینی', 'چینی', 'سین'] },
    { code: 'kr', name: 'Korea', namesKu: ['کۆریا', 'کۆریای باشوور', 'کۆریا باشور', 'کۆریا باشوور', 'کۆریا'] },
    { code: 'in', name: 'India', namesKu: ['هیندستان', 'هیند', 'هیندی', 'ئیندییا'] },
    { code: 'tr', name: 'Turkey', namesKu: ['تورکیا', 'تورکیە', 'تورکی', 'تەروکیا'] },
    { code: 'th', name: 'Thailand', namesKu: ['تایلەند', 'تایلاند', 'تایڵەند'] },
    { code: 'vn', name: 'Vietnam', namesKu: ['ڤێتنام', 'فێتنام'] },
    { code: 'id', name: 'Indonesia', namesKu: ['ئیندۆنیزیا', 'ئەندەنوسیا', 'ئیندۆنیسیا'] },
    { code: 'pk', name: 'Pakistan', namesKu: ['پاکستان', 'پاکوستان'] },

    // --- MIDDLE EAST & REGIONAL ---
    { code: 'iq-kr', name: 'Kurdistan', namesKu: ['کوردستان', 'ھەرێمی کوردستان', 'کورد'] }, // Using simplified code, might need custom handling if CDN fails for iq-kr
    { code: 'iq', name: 'Iraq', namesKu: ['عێراق', 'عیراق', 'ئیراق', 'ئێراق'] },
    { code: 'ir', name: 'Iran', namesKu: ['ئێران', 'ایران'] },
    { code: 'sa', name: 'Saudi', namesKu: ['سعودی', 'سەعوودی', 'سعودیە', 'عەرەبستانی سعودی', 'سەعودیە'] },
    { code: 'ae', name: 'UAE', namesKu: ['ئیمارات', 'ئیماراتی', 'دوبەی', 'میرنشینە یەکگرتووەکان'] },
    { code: 'qa', name: 'Qatar', namesKu: ['قەتەر', 'قەتر', 'قەتەڕ'] },
    { code: 'jo', name: 'Jordan', namesKu: ['ئەردەن', 'ئوردن', 'ئوردون'] },
    { code: 'lb', name: 'Lebanon', namesKu: ['لوبنان', 'لبنان'] },
    { code: 'ps', name: 'Palestine', namesKu: ['فەلەستین', 'فەلەستين', 'فەلەستینی'] },
    { code: 'sy', name: 'Syria', namesKu: ['سوریا', 'سووریا', 'سوریە'] },

    // --- AFRICA ---
    { code: 'eg', name: 'Egypt', namesKu: ['میسر', 'میسر', 'میسری', 'یجپت'] },
    { code: 'ng', name: 'Nigeria', namesKu: ['نایجیریا', 'نیجیریا', 'نایجێریا'] },
    { code: 'za', name: 'South Africa', namesKu: ['ئەفریقای باشوور', 'ئەفریقای باشور', 'ئەفریقیا', 'باشوری ئەفریقا', 'باشووری ئەفریقا'] },
    { code: 'ma', name: 'Morocco', namesKu: ['مەغریب', 'مەغریب', 'مەغرب'] },
    { code: 'dz', name: 'Algeria', namesKu: ['جەزائیر', 'جەزایر'] },
    { code: 'tn', name: 'Tunisia', namesKu: ['تونس', 'توونس'] },

    // --- SOUTH AMERICA ---
    { code: 'br', name: 'Brazil', namesKu: ['برازیل', 'بەڕازیل', 'بەرازیل', 'بەرازیلیا'] },
    { code: 'ar', name: 'Argentina', namesKu: ['ئارجەنتین', 'ئەرجەنتین', 'ئەرجەنتینا'] },
    { code: 'cl', name: 'Chile', namesKu: ['شیلی', 'چیلی'] },
    { code: 'co', name: 'Colombia', namesKu: ['کۆلۆمبیا', 'کۆلۆمبیا'] },

    // --- OCEANIA ---
    { code: 'au', name: 'Australia', namesKu: ['ئوسترالیا', 'ئوستڕالیا', 'ئوستورالیا', 'ئوستراڵیا'] },
    { code: 'nz', name: 'New Zealand', namesKu: ['نیوزلەندا', 'نیوزلەند', 'نیو زیلاند'] },
];

// --- GAME PHASES ---
const PHASE = {
    COUNTDOWN: 'countdown',
    DISPLAY: 'display',
    INPUT: 'input',
    FEEDBACK: 'feedback',
    RESULTS: 'results',
};

// --- UTILS ---
const normalizeText = (text) => {
    if (!text) return '';
    return text
        .trim()
        .toLowerCase()
        // Standardize Kurdish characters
        .replace(/[ییێي]/g, 'ی')
        .replace(/[ووۆ]/g, 'و')
        .replace(/[ڕر]/g, 'ر')
        .replace(/[ڵل]/g, 'ل')
        .replace(/[ەهھ]/g, 'ە')
        .replace(/[کك]/g, 'ک')
        .replace(/\s+/g, ''); // Remove all spaces for strict matching
};

// --- GENERATE RANDOM NUMBER ---
const generateNumber = (difficulty) => {
    const digits = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 4 : 6;
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// --- GET RANDOM FLAG ---
const getRandomFlag = () => {
    return FLAGS_DATA[Math.floor(Math.random() * FLAGS_DATA.length)];
};

// --- COUNTDOWN COMPONENT ---
const CountdownDisplay = ({ count, colors }) => (
    <View style={styles.countdownContainer}>
        <LinearGradient
            colors={count === 0 ? ['#10B981', '#059669'] : ['#D900FF', '#7000FF']}
            style={styles.countdownCircle}
        >
            <Text style={styles.countdownText}>
                {count === 0 ? 'GO!' : count}
            </Text>
        </LinearGradient>
    </View>
);

// --- CHALLENGE DISPLAY - Instant, no animation ---
const ChallengeDisplay = ({ type, value, flagData }) => (
    <View style={styles.challengeContainer}>
        {type === 'number' ? (
            <Text style={styles.numberDisplay}>{value}</Text>
        ) : (
            <Image
                source={{ uri: `https://flagcdn.com/w320/${flagData?.code}.png` }}
                style={styles.flagImage}
                resizeMode="contain"
            />
        )}
    </View>
);

// --- FEEDBACK DISPLAY - Instant ---
const FeedbackDisplay = ({ isCorrect, correctAnswer, isKurdish }) => (
    <View style={styles.feedbackContainer}>
        <View style={[
            styles.feedbackCircle,
            { backgroundColor: isCorrect ? '#10B981' : '#EF4444' }
        ]}>
            {isCorrect ? (
                <Check size={60} color="#FFF" strokeWidth={3} />
            ) : (
                <X size={60} color="#FFF" strokeWidth={3} />
            )}
        </View>
        <Text style={[
            styles.feedbackText,
            { color: isCorrect ? '#10B981' : '#EF4444' }
        ]}>
            {isCorrect
                ? (isKurdish ? 'دروستە!' : 'Correct!')
                : (isKurdish ? 'هەڵەیە!' : 'Wrong!')}
        </Text>
        {!isCorrect && (
            <Text style={styles.correctAnswerText}>
                {isKurdish ? 'وەڵامی دروست: ' : 'Answer: '}{correctAnswer}
            </Text>
        )}
    </View>
);

// --- INPUT AREA ---
const InputArea = ({ value, onChange, onSubmit, isKurdish, colors, isDark, type }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        // Auto-focus the input
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    }, []);

    return (
        <View style={styles.inputContainer}>
            <Text style={[
                styles.inputLabel,
                { color: colors.text.secondary },
                isKurdish && styles.kurdishFont
            ]}>
                {type === 'number'
                    ? (isKurdish ? 'ژمارەکە بنووسە:' : 'Enter the number:')
                    : (isKurdish ? 'ناوی وڵاتەکە بنووسە:' : 'Enter country name:')}
            </Text>

            <TextInput
                ref={inputRef}
                style={[
                    styles.textInput,
                    {
                        backgroundColor: isDark ? '#1A0B2E' : '#FFFFFF',
                        color: colors.text.primary,
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
                    }
                ]}
                value={value}
                onChangeText={onChange}
                keyboardType={type === 'number' ? 'number-pad' : 'default'}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder={type === 'number' ? '...' : (isKurdish ? 'ناو...' : 'Name...')}
                placeholderTextColor={colors.text.muted}
                onSubmitEditing={onSubmit}
                returnKeyType="done"
            />

            <TouchableOpacity
                activeOpacity={0.9}
                onPress={onSubmit}
                style={styles.submitBtnWrap}
            >
                <LinearGradient
                    colors={['#D900FF', '#7000FF']}
                    style={styles.submitBtn}
                >
                    <Text style={[styles.submitBtnText, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'ناردن' : 'Submit'}
                    </Text>
                    <ChevronRight size={20} color="#FFF" />
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

// --- RESULTS SCREEN ---
const ResultsScreen = ({ score, totalRounds, streak, onPlayAgain, onHome, isKurdish, colors, isDark }) => {
    const accuracy = Math.round((score / totalRounds) * 100);
    const getGrade = () => {
        if (accuracy >= 90) return { grade: 'S', color: '#FFD700', label: isKurdish ? 'نایاب!' : 'Amazing!' };
        if (accuracy >= 70) return { grade: 'A', color: '#10B981', label: isKurdish ? 'زۆر باش!' : 'Great!' };
        if (accuracy >= 50) return { grade: 'B', color: '#3B82F6', label: isKurdish ? 'باش!' : 'Good!' };
        if (accuracy >= 30) return { grade: 'C', color: '#F59E0B', label: isKurdish ? 'بەردەوام بە!' : 'Keep trying!' };
        return { grade: 'D', color: '#EF4444', label: isKurdish ? 'تەواو نەبوو' : 'Needs work!' };
    };

    const { grade, color, label } = getGrade();

    return (
        <View style={styles.resultsContainer}>
            {/* Grade Circle */}
            <View>
                <LinearGradient
                    colors={[color, color + 'CC']}
                    style={styles.gradeCircle}
                >
                    <Text style={styles.gradeText}>{grade}</Text>
                </LinearGradient>
            </View>

            <Text style={styles.gradeLabel}>{label}</Text>

            {/* Stats */}
            <View style={styles.statsRow}>
                <View style={[styles.statCard, { backgroundColor: isDark ? '#1A0B2E' : '#FFF' }]}>
                    <Trophy size={24} color="#FFD700" />
                    <Text style={[styles.statValue, { color: colors.text.primary }]}>{score}/{totalRounds}</Text>
                    <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                        {isKurdish ? 'دروست' : 'Correct'}
                    </Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: isDark ? '#1A0B2E' : '#FFF' }]}>
                    <Target size={24} color="#10B981" />
                    <Text style={[styles.statValue, { color: colors.text.primary }]}>{accuracy}%</Text>
                    <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                        {isKurdish ? 'ڕێژە' : 'Accuracy'}
                    </Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: isDark ? '#1A0B2E' : '#FFF' }]}>
                    <Zap size={24} color="#F59E0B" />
                    <Text style={[styles.statValue, { color: colors.text.primary }]}>{streak}</Text>
                    <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                        {isKurdish ? 'زنجیرە' : 'Best Streak'}
                    </Text>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.resultActions}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={onPlayAgain}
                    style={styles.playAgainBtnWrap}
                >
                    <LinearGradient
                        colors={['#D900FF', '#7000FF']}
                        style={styles.playAgainBtn}
                    >
                        <RotateCcw size={20} color="#FFF" />
                        <Text style={[styles.playAgainText, isKurdish && styles.kurdishFont]}>
                            {isKurdish ? 'دووبارە' : 'Play Again'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={onHome}
                    style={[styles.homeBtn, { backgroundColor: isDark ? '#1A0B2E' : '#FFF' }]}
                >
                    <Home size={20} color={colors.text.primary} />
                    <Text style={[
                        styles.homeBtnText,
                        { color: colors.text.primary },
                        isKurdish && styles.kurdishFont
                    ]}>
                        {isKurdish ? 'ماڵەوە' : 'Home'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// --- MAIN GAME SCREEN ---
export default function SpeedRecognitionPlay({ navigation, route }) {
    const { isKurdish } = useLanguage();
    const { colors, isDark } = useTheme();

    // Game settings from route params
    const {
        gameMode = 'numbers',
        difficulty = 'easy',
        displayTime = 500,
        rounds = 10
    } = route.params || {};

    // Game state
    const [phase, setPhase] = useState(PHASE.COUNTDOWN);
    const [countdown, setCountdown] = useState(3);
    const [currentRound, setCurrentRound] = useState(1);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);

    // Current challenge
    const [challengeType, setChallengeType] = useState('number');
    const [currentNumber, setCurrentNumber] = useState(null);
    const [currentFlag, setCurrentFlag] = useState(null);
    const [userInput, setUserInput] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);

    // Generate next challenge
    const generateChallenge = useCallback(() => {
        let type = 'number';

        if (gameMode === 'flags') {
            type = 'flag';
        } else if (gameMode === 'mixed') {
            type = Math.random() > 0.5 ? 'number' : 'flag';
        }

        setChallengeType(type);

        if (type === 'number') {
            setCurrentNumber(generateNumber(difficulty));
            setCurrentFlag(null);
        } else {
            setCurrentFlag(getRandomFlag());
            setCurrentNumber(null);
        }
    }, [gameMode, difficulty]);

    // Start countdown
    useEffect(() => {
        if (phase === PHASE.COUNTDOWN) {
            if (countdown > 0) {
                const timer = setTimeout(() => setCountdown(countdown - 1), 800);
                return () => clearTimeout(timer);
            } else {
                // After GO!, start displaying
                const timer = setTimeout(() => {
                    generateChallenge();
                    setPhase(PHASE.DISPLAY);
                }, 500);
                return () => clearTimeout(timer);
            }
        }
    }, [phase, countdown, generateChallenge]);

    // Display timer
    useEffect(() => {
        if (phase === PHASE.DISPLAY) {
            const timer = setTimeout(() => {
                setPhase(PHASE.INPUT);
            }, displayTime);
            return () => clearTimeout(timer);
        }
    }, [phase, displayTime]);

    // Handle submit
    const handleSubmit = () => {
        Keyboard.dismiss();

        let correct = false;
        let correctAnswer = '';

        if (challengeType === 'number') {
            correct = userInput.trim() === String(currentNumber);
            correctAnswer = String(currentNumber);
        } else {
            const normalizedInput = normalizeText(userInput);
            const normalizedEnglish = normalizeText(currentFlag.name);
            const normalizedKurdishList = currentFlag.namesKu.map(n => normalizeText(n));

            correct = normalizedInput === normalizedEnglish || normalizedKurdishList.includes(normalizedInput);
            correctAnswer = isKurdish ? currentFlag.namesKu[0] : currentFlag.name;
        }

        setIsCorrect(correct);

        if (correct) {
            setScore(score + 1);
            setStreak(streak + 1);
            if (streak + 1 > bestStreak) {
                setBestStreak(streak + 1);
            }
            Vibration.vibrate(50);
        } else {
            setStreak(0);
            Vibration.vibrate([0, 100, 50, 100]);
        }

        setPhase(PHASE.FEEDBACK);
    };

    // After feedback, move to next round
    useEffect(() => {
        if (phase === PHASE.FEEDBACK) {
            const timer = setTimeout(() => {
                if (currentRound >= rounds) {
                    setPhase(PHASE.RESULTS);
                } else {
                    setCurrentRound(currentRound + 1);
                    setUserInput('');
                    setCountdown(2); // Shorter countdown between rounds
                    setPhase(PHASE.COUNTDOWN);
                }
            }, 1200);
            return () => clearTimeout(timer);
        }
    }, [phase, currentRound, rounds]);

    // Play again handler
    const handlePlayAgain = () => {
        setPhase(PHASE.COUNTDOWN);
        setCountdown(3);
        setCurrentRound(1);
        setScore(0);
        setStreak(0);
        setBestStreak(0);
        setUserInput('');
    };

    // Get correct answer for display
    const getCorrectAnswer = () => {
        if (challengeType === 'number') {
            return String(currentNumber);
        } else {
            return isKurdish ? currentFlag?.namesKu[0] : currentFlag?.name;
        }
    };

    return (
        <AnimatedScreen>
            <View style={styles.container}>

                {/* Top Bar */}
                {phase !== PHASE.RESULTS && (
                    <View style={styles.topBar}>
                        <TouchableOpacity
                            style={[styles.closeBtn, { backgroundColor: isDark ? '#1A0B2E' : '#FFF' }]}
                            onPress={() => navigation.goBack()}
                        >
                            <X size={24} color={colors.text.primary} />
                        </TouchableOpacity>

                        <View style={styles.progressContainer}>
                            <Text style={[styles.roundText, { color: colors.text.primary }]}>
                                {currentRound}/{rounds}
                            </Text>
                            <View style={[styles.progressBar, { backgroundColor: isDark ? '#2D1B4E' : '#E2E8F0' }]}>
                                <View
                                    style={[styles.progressFill, { backgroundColor: colors.primary, width: `${(currentRound / rounds) * 100}%` }]}
                                />
                            </View>
                        </View>

                        <View style={styles.scoreContainer}>
                            <Star size={18} color="#FFD700" fill="#FFD700" />
                            <Text style={[styles.scoreText, { color: colors.text.primary }]}>{score}</Text>
                        </View>
                    </View>
                )}

                {phase !== PHASE.RESULTS && streak > 1 && (
                    <View style={styles.streakBadge}>
                        <Zap size={16} color="#F59E0B" fill="#F59E0B" />
                        <Text style={styles.streakText}>{streak}x Streak!</Text>
                    </View>
                )}

                <View style={styles.gameArea}>
                    {phase === PHASE.COUNTDOWN && (
                        <CountdownDisplay key="countdown" count={countdown} colors={colors} />
                    )}

                    {phase === PHASE.DISPLAY && (
                        <ChallengeDisplay
                            key="display"
                            type={challengeType}
                            value={currentNumber}
                            flagData={currentFlag}
                        />
                    )}

                    {phase === PHASE.INPUT && (
                        <InputArea
                            key="input"
                            value={userInput}
                            onChange={setUserInput}
                            onSubmit={handleSubmit}
                            isKurdish={isKurdish}
                            colors={colors}
                            isDark={isDark}
                            type={challengeType}
                        />
                    )}

                    {phase === PHASE.FEEDBACK && (
                        <FeedbackDisplay
                            key="feedback"
                            isCorrect={isCorrect}
                            correctAnswer={getCorrectAnswer()}
                            isKurdish={isKurdish}
                        />
                    )}

                    {phase === PHASE.RESULTS && (
                        <ResultsScreen
                            key="results"
                            score={score}
                            totalRounds={rounds}
                            streak={bestStreak}
                            onPlayAgain={handlePlayAgain}
                            onHome={() => navigation.navigate('Home')}
                            isKurdish={isKurdish}
                            colors={colors}
                            isDark={isDark}
                        />
                    )}
                </View>

            </View>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    // Top Bar
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 16,
        gap: 16,
    },
    closeBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    progressContainer: {
        flex: 1,
    },
    roundText: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 6,
        textAlign: 'center',
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    scoreText: {
        fontSize: 18,
        fontWeight: '800',
    },

    // Streak
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
        marginBottom: 16,
    },
    streakText: {
        color: '#F59E0B',
        fontSize: 14,
        fontWeight: '700',
    },

    // Game Area
    gameArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },

    // Countdown
    countdownContainer: {
        alignItems: 'center',
    },
    countdownCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    countdownText: {
        fontSize: 72,
        fontWeight: '900',
        color: '#FFF',
    },

    // Challenge Display
    challengeContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    numberDisplay: {
        fontSize: 80,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: 8,
        // Text shadow - native only (web ignores these)
        ...Platform.select({
            ios: {
                textShadowColor: 'rgba(217, 0, 255, 0.5)',
                textShadowOffset: { width: 0, height: 4 },
                textShadowRadius: 20,
            },
            android: {
                textShadowColor: 'rgba(217, 0, 255, 0.5)',
                textShadowOffset: { width: 0, height: 4 },
                textShadowRadius: 20,
            },
            web: {},
        }),
    },
    flagImage: {
        width: 200,
        height: 150,
    },

    // Feedback
    feedbackContainer: {
        alignItems: 'center',
    },
    feedbackCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    feedbackText: {
        fontSize: 28,
        fontWeight: '800',
    },
    correctAnswerText: {
        fontSize: 18,
        color: '#B8A6D9',
        marginTop: 8,
    },

    // Input Area
    inputContainer: {
        width: '100%',
        alignItems: 'center',
    },
    inputLabel: {
        fontSize: 16,
        marginBottom: 16,
    },
    textInput: {
        width: '100%',
        height: 64,
        borderRadius: 20,
        borderWidth: 2,
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 20,
    },
    submitBtnWrap: {
        width: '100%',
    },
    submitBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderRadius: 28,
        gap: 8,
    },
    submitBtnText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },

    // Results
    resultsContainer: {
        alignItems: 'center',
        width: '100%',
    },
    gradeCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    gradeText: {
        fontSize: 72,
        fontWeight: '900',
        color: '#FFF',
    },
    gradeLabel: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 32,
    },

    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },
    statCard: {
        flex: 1,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '800',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        marginTop: 4,
    },

    resultActions: {
        width: '100%',
        gap: 12,
    },
    playAgainBtnWrap: {
        width: '100%',
    },
    playAgainBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderRadius: 28,
        gap: 10,
    },
    playAgainText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
    homeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderRadius: 28,
        gap: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    homeBtnText: {
        fontSize: 16,
        fontWeight: '600',
    },

    kurdishFont: {
        fontFamily: 'System',
    },
});
