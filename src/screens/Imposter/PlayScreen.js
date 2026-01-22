import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Vibration,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground, Button, GlassCard } from '../../components';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { getRandomWord } from '../../constants/imposterWords';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../localization/translations';

export default function ImposterPlayScreen({ navigation, route }) {
    const { players, category, imposterCount } = route.params;
    const { language, isKurdish } = useLanguage();

    // Game State
    const [gameWord, setGameWord] = useState(null);
    const [imposters, setImposters] = useState([]);
    const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
    const [phase, setPhase] = useState('reveal'); // 'reveal', 'viewing', 'discussion'
    const [showSecret, setShowSecret] = useState(false);

    // RTL styles
    const rtlStyles = {
        textAlign: isKurdish ? 'right' : 'left',
        writingDirection: isKurdish ? 'rtl' : 'ltr',
    };
    const rowDirection = isKurdish ? 'row-reverse' : 'row';

    // Setup Game
    useEffect(() => {
        // 1. Pick Word (with language support)
        const selected = getRandomWord(category, language);
        setGameWord(selected);

        // 2. Assign Imposters
        const shuffledIndices = [...Array(players.length).keys()]
            .sort(() => 0.5 - Math.random());
        const selectedImposters = shuffledIndices.slice(0, imposterCount)
            .map(idx => players[idx]);

        setImposters(selectedImposters);
    }, []);

    const currentPlayer = players[currentPlayerIdx];
    const isImposter = imposters.includes(currentPlayer);

    const handleReveal = () => {
        setShowSecret(true);
        setPhase('viewing');
    };

    const handleNext = () => {
        setShowSecret(false);
        if (currentPlayerIdx < players.length - 1) {
            setCurrentPlayerIdx(prev => prev + 1);
            setPhase('reveal');
        } else {
            setPhase('discussion');
        }
    };

    const handleEndGame = () => {
        navigation.navigate('ImposterResult', {
            imposters,
            word: gameWord,
            players
        });
    };

    // --- RENDER --- (Distribution Phase)
    if (phase === 'reveal' || phase === 'viewing') {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                    <ScrollView
                        style={styles.scrollContainer}
                        contentContainerStyle={styles.centerContent}
                        showsVerticalScrollIndicator={true}
                        bounces={true}
                        alwaysBounceVertical={true}
                        overScrollMode="always"
                    >

                        {/* Player Badge */}
                        <View style={styles.badge}>
                            <Text style={[styles.badgeText, isKurdish && styles.kurdishFont]}>
                                {t('common.player', language)} {currentPlayerIdx + 1}/{players.length}
                            </Text>
                        </View>

                        {phase === 'reveal' ? (
                            <>
                                <Text style={[styles.label, isKurdish && styles.kurdishFont]}>
                                    {t('common.passPhoneTo', language)}
                                </Text>
                                <Text style={[styles.playerName, isKurdish && styles.kurdishFont]}>
                                    {currentPlayer}
                                </Text>
                                <Text style={[styles.instruction, isKurdish && styles.kurdishFont]}>
                                    {t('common.keepItSecret', language)}{'\n'}{t('common.tapToReveal', language)}
                                </Text>

                                <Button
                                    title={t('common.reveal', language)}
                                    onPress={handleReveal}
                                    gradient={[COLORS.accent.danger, COLORS.accent.danger]}
                                    icon={<Ionicons name="finger-print" size={24} color="#FFF" />}
                                    style={{ minWidth: 200 }}
                                    isKurdish={isKurdish}
                                />
                            </>
                        ) : (
                            <>
                                <Text style={[styles.label, isKurdish && styles.kurdishFont]}>
                                    {isKurdish ? 'ڕۆڵی نهێنی تۆ' : 'Your Secret Role'}
                                </Text>

                                {/* Secret Card */}
                                <GlassCard intensity={30} style={[
                                    styles.card,
                                    isImposter ? styles.imposterCard : styles.crewCard
                                ]}>
                                    <Ionicons
                                        name={isImposter ? "eye-off" : "text"}
                                        size={48}
                                        color={isImposter ? COLORS.accent.danger : COLORS.accent.primary}
                                        style={{ marginBottom: 16 }}
                                    />

                                    {isImposter ? (
                                        <>
                                            <Text style={[styles.roleTitle, isKurdish && styles.kurdishFont]}>
                                                {isKurdish ? 'جاسوس' : 'IMPOSTER'}
                                            </Text>
                                            <Text style={[styles.roleDesc, isKurdish && styles.kurdishFont]}>
                                                {isKurdish
                                                    ? 'خۆت بشارەوە. نەهێڵە بزانن کە وشەکەت نازانیت.'
                                                    : "Blend in. Don't let them know you don't know the word."
                                                }
                                            </Text>
                                        </>
                                    ) : (
                                        <>
                                            <Text style={[styles.wordLabel, isKurdish && styles.kurdishFont]}>
                                                {isKurdish ? 'وشەکە:' : 'The Word Is:'}
                                            </Text>
                                            <Text style={[styles.secretWord, isKurdish && styles.kurdishFont]}>
                                                {gameWord?.word}
                                            </Text>
                                            <Text style={[styles.wordHint, isKurdish && styles.kurdishFont]}>
                                                {gameWord?.hint}
                                            </Text>
                                        </>
                                    )}
                                </GlassCard>

                                <Button
                                    title={isKurdish ? 'بیشارەوە و بیدە' : 'Hide & Pass'}
                                    onPress={handleNext}
                                    variant="secondary"
                                    style={{ minWidth: 200 }}
                                    isKurdish={isKurdish}
                                />
                            </>
                        )}
                    </ScrollView>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    // --- RENDER --- (Discussion Phase)
    return (
        <GradientBackground>
            <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, isKurdish && styles.kurdishFont]}>
                        {isKurdish ? 'گفتوگۆ' : 'Discussion'}
                    </Text>
                </View>

                <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.discussionContent}
                    showsVerticalScrollIndicator={true}
                    bounces={true}
                    alwaysBounceVertical={true}
                >
                    <View style={styles.iconCircle}>
                        <Ionicons name="chatbubbles-outline" size={40} color={COLORS.text.primary} />
                    </View>

                    <Text style={[styles.discussTitle, isKurdish && styles.kurdishFont]}>
                        {t('common.findSpy', language)}
                    </Text>
                    <Text style={[styles.discussDesc, isKurdish && styles.kurdishFont]}>
                        {isKurdish
                            ? 'پرسیار بکە، دەنگ بدە، و بزانە کێ وشەکەی نازانێت.'
                            : "Ask questions, vote, and figure out who doesn't know the word."
                        }
                    </Text>

                    <View style={[styles.tipBox, { flexDirection: rowDirection }]}>
                        <Text style={[styles.tipTitle, isKurdish && styles.kurdishFont]}>
                            {t('common.category', language)}:
                        </Text>
                        <Text style={[styles.tipText, isKurdish && styles.kurdishFont]}>
                            {gameWord?.category || 'Unknown'}
                        </Text>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <Button
                        title={isKurdish ? 'جاسوسەکە پیشان بدە' : 'Reveal Imposter'}
                        onPress={handleEndGame}
                        gradient={[COLORS.accent.danger, COLORS.accent.danger]}
                        isKurdish={isKurdish}
                    />
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContainer: { flex: 1 },
    centerContent: {
        flexGrow: 1, alignItems: 'center', padding: SPACING.xl, paddingVertical: 40,
        paddingBottom: 100
    },

    badge: {
        backgroundColor: COLORS.background.card,
        paddingVertical: 6, paddingHorizontal: 16,
        borderRadius: 100, marginBottom: 32,
    },
    badgeText: { color: COLORS.text.secondary, ...FONTS.medium, fontSize: 13 },

    label: {
        color: COLORS.text.secondary, ...FONTS.medium,
        marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1,
    },
    playerName: {
        color: COLORS.text.primary, ...FONTS.large, fontSize: 40,
        marginBottom: 24, textAlign: 'center',
    },
    instruction: {
        color: COLORS.text.muted, textAlign: 'center',
        marginBottom: 48, lineHeight: 24,
    },

    // Card Styles
    card: {
        width: '100%',
        padding: SPACING.xl,
        borderRadius: BORDER_RADIUS.xl,
        alignItems: 'center',
        marginBottom: 48,
        borderWidth: 1,
    },
    imposterCard: { borderColor: COLORS.accent.danger },
    crewCard: { borderColor: COLORS.accent.primary },

    roleTitle: { color: COLORS.accent.danger, ...FONTS.large, fontSize: 32, marginBottom: 12 },
    roleDesc: { color: COLORS.text.secondary, textAlign: 'center', lineHeight: 24 },

    wordLabel: { color: COLORS.text.secondary, marginBottom: 8 },
    secretWord: { color: COLORS.text.primary, ...FONTS.large, fontSize: 36, marginBottom: 8 },
    wordHint: { color: COLORS.text.muted, fontSize: 14 },

    // Discussion
    header: { padding: SPACING.lg, alignItems: 'center' },
    headerTitle: { color: COLORS.text.secondary, textTransform: 'uppercase', letterSpacing: 2 },

    discussionContent: {
        flexGrow: 1, alignItems: 'center', padding: SPACING.xl, paddingVertical: 40,
        paddingBottom: 100
    },
    iconCircle: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: COLORS.background.card,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 24,
    },
    discussTitle: { color: COLORS.text.primary, ...FONTS.title, fontSize: 32, marginBottom: 16 },
    discussDesc: { color: COLORS.text.secondary, textAlign: 'center', lineHeight: 24, marginBottom: 40 },

    footer: { padding: SPACING.lg },

    tipBox: {
        padding: SPACING.md, backgroundColor: COLORS.background.border, borderRadius: 8,
        flexDirection: 'row', gap: 8,
    },
    tipTitle: { color: COLORS.text.muted },
    tipText: { color: COLORS.text.primary, fontWeight: '600' },
    kurdishFont: { fontFamily: 'Rabar' },
});
