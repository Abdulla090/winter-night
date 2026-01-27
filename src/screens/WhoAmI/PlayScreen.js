import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientBackground, Button, Timer, Modal, GlassCard } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { getRandomCharacter } from '../../constants/whoAmIData';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../localization/translations';

const { width } = Dimensions.get('window');

export default function PlayScreen({ navigation, route }) {
    const { players, category, roundTime, currentPlayerIndex, scores } = route.params;
    const { language, isKurdish } = useLanguage();

    const [character, setCharacter] = useState('');
    const [showCharacter, setShowCharacter] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [guessedCorrect, setGuessedCorrect] = useState(null);

    const currentPlayer = players[currentPlayerIndex];
    const isLastPlayer = currentPlayerIndex === players.length - 1;

    // Ensure we handle array or string for colors
    const gameColors = Array.isArray(COLORS.games.whoAmI) ? COLORS.games.whoAmI : [COLORS.games.whoAmI, COLORS.games.whoAmI];
    const accentColor = gameColors[0];

    useEffect(() => {
        setCharacter(getRandomCharacter(category, language));
    }, []);

    const handleReveal = () => setShowCharacter(true);
    const handleStart = () => {
        setShowCharacter(false);
        setIsPlaying(true);
    };
    const handleTimeUp = () => {
        setIsPlaying(false);
        setShowResultModal(true);
    };

    const handleGuessResult = (correct) => {
        setGuessedCorrect(correct);
        const newScores = { ...scores };
        if (correct) {
            newScores[currentPlayer] = (newScores[currentPlayer] || 0) + 1;
        }
        setTimeout(() => {
            setShowResultModal(false);
            if (isLastPlayer) {
                navigation.replace('WhoAmIResults', { players, scores: newScores, category });
            } else {
                navigation.replace('WhoAmIPlay', {
                    players, category, roundTime, currentPlayerIndex: currentPlayerIndex + 1, scores: newScores,
                });
            }
        }, 1000);
    };

    // Ready Screen
    if (!showCharacter && !isPlaying) {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                    <ScrollView
                        style={styles.scrollContainer}
                        contentContainerStyle={styles.centerContent}
                        showsVerticalScrollIndicator={true}
                    >
                        <View style={styles.badge}>
                            <Text style={[styles.badgeText, isKurdish && styles.kurdishFont]}>
                                {t('common.player', language)} {currentPlayerIndex + 1}/{players.length}
                            </Text>
                        </View>

                        <Text style={[styles.label, isKurdish && styles.kurdishFont]}>
                            {t('common.passPhoneTo', language)}
                        </Text>
                        <Text style={[styles.playerName, isKurdish && styles.kurdishFont]}>
                            {currentPlayer}
                        </Text>

                        <Text style={[styles.instruction, isKurdish && styles.kurdishFont]}>
                            {t('common.tapBelowToSee', language)}{'\n'}{t('common.keepItSecret', language)}
                        </Text>

                        <Button
                            title={t('common.revealCharacter', language)}
                            onPress={handleReveal}
                            gradient={gameColors}
                            icon={<Ionicons name="eye-outline" size={20} color="#FFF" />}
                            isKurdish={isKurdish}
                        />
                    </ScrollView>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    // Character Reveal Screen
    if (showCharacter && !isPlaying) {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                    <ScrollView
                        style={styles.scrollContainer}
                        contentContainerStyle={styles.centerContent}
                    >
                        <Text style={[styles.label, isKurdish && styles.kurdishFont]}>
                            {t('common.youAre', language)}
                        </Text>

                        <GlassCard intensity={30} style={[styles.card, { borderColor: accentColor }]}>
                            <Text style={[styles.cardText, isKurdish && styles.kurdishFont]}>{character}</Text>
                        </GlassCard>

                        <Text style={[styles.instruction, isKurdish && styles.kurdishFont]}>
                            {t('common.placePhoneOnForehead', language)}{'\n'}{t('common.askYesNoQuestions', language)}
                        </Text>

                        <Button
                            title={t('common.startTimer', language)}
                            onPress={handleStart}
                            gradient={[COLORS.accent.success, COLORS.accent.success]}
                            isKurdish={isKurdish}
                        />
                    </ScrollView>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    // Gameplay Screen (Forehead Mode)
    return (
        <LinearGradient
            colors={gameColors}
            style={styles.gameContainer}
        >
            <View style={[styles.rotateContainer]}>
                <Text style={[styles.gameCharacter, isKurdish && styles.kurdishFont]}>{character}</Text>

                <Timer
                    duration={roundTime}
                    onComplete={handleTimeUp}
                    isRunning={isPlaying}
                    size={100}
                />

                <TouchableOpacity style={styles.skipButton} onPress={handleTimeUp}>
                    <Text style={[styles.skipText, isKurdish && styles.kurdishFont]}>
                        {t('common.endTurn', language)}
                    </Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={showResultModal}
                onClose={() => { }}
                title={t('common.didYouGuessIt', language)}
                showClose={false}
                isKurdish={isKurdish}
            >
                <View style={[styles.row, { flexDirection: isKurdish ? 'row-reverse' : 'row' }]}>
                    <Button
                        title={t('common.yes', language)}
                        onPress={() => handleGuessResult(true)}
                        gradient={[COLORS.accent.success, COLORS.accent.success]}
                        style={{ flex: 1, marginRight: isKurdish ? 0 : 8, marginLeft: isKurdish ? 8 : 0 }}
                        isKurdish={isKurdish}
                    />
                    <Button
                        title={t('common.no', language)}
                        onPress={() => handleGuessResult(false)}
                        gradient={[COLORS.accent.danger, COLORS.accent.danger]}
                        style={{ flex: 1, marginLeft: isKurdish ? 0 : 8, marginRight: isKurdish ? 8 : 0 }}
                        isKurdish={isKurdish}
                    />
                </View>
            </Modal>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContainer: { flex: 1 },
    gameContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    centerContent: {
        flexGrow: 1, alignItems: 'center', padding: SPACING.xl, paddingVertical: 40,
        paddingBottom: 100
    },

    badge: { backgroundColor: COLORS.background.card, paddingVertical: 6, paddingHorizontal: 16, borderRadius: 100, marginBottom: 32 },
    badgeText: { color: COLORS.text.secondary, ...FONTS.medium, fontSize: 13 },

    label: { color: COLORS.text.secondary, ...FONTS.medium, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
    playerName: { color: COLORS.text.primary, ...FONTS.large, fontSize: 40, marginBottom: 48, textAlign: 'center' },
    instruction: { color: COLORS.text.muted, textAlign: 'center', marginBottom: 48, lineHeight: 24 },

    card: {
        width: '100%', padding: SPACING.xl,
        borderRadius: BORDER_RADIUS.xl, borderWidth: 1, alignItems: 'center', marginBottom: 48
    },
    cardText: { color: COLORS.text.primary, ...FONTS.large, textAlign: 'center' },

    rotateContainer: { alignItems: 'center', width: '100%' },
    gameCharacter: { color: '#FFF', ...FONTS.large, fontSize: 56, textAlign: 'center', marginBottom: 48 },
    skipButton: { marginTop: 48, padding: 16 },
    skipText: { color: 'rgba(255,255,255,0.6)', ...FONTS.medium },

    row: { flexDirection: 'row', width: '100%' },
    resultText: { color: COLORS.text.primary, ...FONTS.title, marginTop: 16 },
    kurdishFont: { fontFamily: 'Rabar' },
});
