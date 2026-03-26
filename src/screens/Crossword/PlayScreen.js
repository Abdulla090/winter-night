import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Platform,
    SafeAreaView, useWindowDimensions, ScrollView, TextInput,
    KeyboardAvoidingView, Alert, Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
    CheckCircle, Eye, Clock, RotateCcw, ChevronDown, ChevronUp,
    ArrowRight, ArrowDown, Sparkles, Trophy,
} from 'lucide-react-native';
import { AnimatedScreen } from '../../components/AnimatedScreen';
import { BackButton } from '../../components/BackButton';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
    buildGrid, isGridComplete, checkGrid, revealCell,
    getClues, getWordCells, getRandomPuzzle,
} from './puzzleData';

// ───────── COLORS ─────────
const CELL_WHITE = '#FFFFFF';
const CELL_BLACK = '#1A1A2E';
const CELL_SELECTED = '#4A90D9';
const CELL_WORD_HIGHLIGHT = 'rgba(74, 144, 217, 0.18)';
const CELL_CORRECT = 'rgba(34, 197, 94, 0.25)';
const CELL_WRONG = 'rgba(239, 68, 68, 0.3)';
const CELL_HINT = 'rgba(139, 92, 246, 0.2)';
const CELL_BORDER = '#2A2A3E';
const TEXT_USER = '#0F172A';
const TEXT_HINT = '#8B5CF6';
const TEXT_NUMBER = '#64748B';

export default function CrosswordPlayScreen({ navigation, route }) {
    const { language, isKurdish } = useLanguage();
    const { colors, isDark, isRTL } = useTheme();
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const inputRef = useRef(null);

    // Puzzle state
    const [puzzle] = useState(() => getRandomPuzzle(isKurdish));
    const [grid, setGrid] = useState(() => buildGrid(puzzle));
    const [selectedCell, setSelectedCell] = useState(null);
    const [activeDirection, setActiveDirection] = useState('across');
    const [activeWord, setActiveWord] = useState(null);
    const [hintsUsed, setHintsUsed] = useState(0);
    const [gameWon, setGameWon] = useState(false);
    const [checkedOnce, setCheckedOnce] = useState(false);
    const [clueSection, setClueSection] = useState('across');
    const [showClues, setShowClues] = useState(true);

    // Timer
    const [seconds, setSeconds] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        if (!gameWon) {
            timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [gameWon]);

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    // Clues
    const clues = useMemo(() => getClues(puzzle), [puzzle]);

    // Board sizing
    const gridSize = puzzle.size;
    const boardPadding = 8;
    const maxBoardWidth = Math.min(screenWidth - boardPadding * 2 - 16, 420);
    const cellSize = Math.floor(maxBoardWidth / gridSize);
    const actualBoardSize = cellSize * gridSize;

    // Is this puzzle RTL?
    const puzzleRTL = !!puzzle.rtl;

    // Get the cells of the currently active word
    const activeWordCells = useMemo(() => {
        if (!activeWord) return [];
        return getWordCells(activeWord, gridSize, puzzleRTL);
    }, [activeWord, gridSize, puzzleRTL]);

    // Check if cell is in the active word
    const isInActiveWord = useCallback((r, c) => {
        return activeWordCells.some(cell => cell.r === r && cell.c === c);
    }, [activeWordCells]);

    // Handle cell tap
    const handleCellPress = useCallback((r, c) => {
        const cell = grid[r][c];
        if (!cell || gameWon) return;

        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        // If tapping same cell, toggle direction
        if (selectedCell && selectedCell.r === r && selectedCell.c === c) {
            const newDir = activeDirection === 'across' ? 'down' : 'across';
            setActiveDirection(newDir);
            // Find the word for the new direction
            const wordRef = newDir === 'across' ? cell.acrossWord : cell.downWord;
            if (wordRef) {
                setActiveWord(wordRef);
                setClueSection(newDir);
            }
        } else {
            setSelectedCell({ r, c });
            // Pick the word for current direction, or the other if not available
            let wordRef = activeDirection === 'across' ? cell.acrossWord : cell.downWord;
            let dir = activeDirection;
            if (!wordRef) {
                dir = activeDirection === 'across' ? 'down' : 'across';
                wordRef = dir === 'across' ? cell.acrossWord : cell.downWord;
            }
            if (wordRef) {
                setActiveWord(wordRef);
                setActiveDirection(dir);
                setClueSection(dir);
            }
        }

        // Focus hidden input for keyboard
        setTimeout(() => inputRef.current?.focus(), 50);
    }, [grid, selectedCell, activeDirection, gameWon]);

    // Handle clue tap — select that word on the grid
    const handleClueTap = useCallback((clueObj) => {
        if (gameWon) return;
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        setActiveWord(clueObj);
        setActiveDirection(clueObj.direction);
        setSelectedCell({ r: clueObj.row, c: clueObj.col });
        setTimeout(() => inputRef.current?.focus(), 50);
    }, [gameWon]);

    // Handle keyboard input
    const handleKeyInput = useCallback((text) => {
        if (!selectedCell || gameWon) return;
        const { r, c } = selectedCell;
        const cell = grid[r][c];
        if (!cell || cell.isHint) return;

        const letter = text.length > 0 ? text[text.length - 1] : '';

        // Update grid
        const newGrid = grid.map(row => row.map(cl => cl ? { ...cl, isWrong: false, isCorrect: false } : null));
        newGrid[r][c] = { ...newGrid[r][c], userInput: letter, isWrong: false };
        setGrid(newGrid);

        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        // Move to next cell in the word
        if (letter && activeWord) {
            const wordCells = getWordCells(activeWord, gridSize, puzzleRTL);
            const currentIdx = wordCells.findIndex(wc => wc.r === r && wc.c === c);
            if (currentIdx >= 0 && currentIdx < wordCells.length - 1) {
                const next = wordCells[currentIdx + 1];
                setSelectedCell({ r: next.r, c: next.c });
            }
        }

        // Check win
        if (isGridComplete(newGrid)) {
            setGameWon(true);
            clearInterval(timerRef.current);
            if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            setTimeout(() => {
                navigation.navigate('CrosswordResult', {
                    time: seconds,
                    hintsUsed,
                    puzzleTitle: puzzle.title,
                });
            }, 1200);
        }
    }, [selectedCell, grid, activeWord, gridSize, gameWon, seconds, hintsUsed, puzzle, navigation]);

    // Handle backspace
    const handleBackspace = useCallback(() => {
        if (!selectedCell || gameWon) return;
        const { r, c } = selectedCell;
        const cell = grid[r][c];
        if (!cell || cell.isHint) return;

        if (cell.userInput) {
            // Clear current cell
            const newGrid = grid.map(row => row.map(cl => cl ? { ...cl } : null));
            newGrid[r][c] = { ...newGrid[r][c], userInput: '', isWrong: false };
            setGrid(newGrid);
        } else if (activeWord) {
            // Move back to previous cell
            const wordCells = getWordCells(activeWord, gridSize, puzzleRTL);
            const currentIdx = wordCells.findIndex(wc => wc.r === r && wc.c === c);
            if (currentIdx > 0) {
                const prev = wordCells[currentIdx - 1];
                setSelectedCell({ r: prev.r, c: prev.c });
            }
        }
    }, [selectedCell, grid, activeWord, gridSize, gameWon]);

    // Check button
    const handleCheck = useCallback(() => {
        if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
        const result = checkGrid(grid);
        setGrid(result.grid);
        setCheckedOnce(true);

        if (result.wrongCount === 0) {
            Alert.alert(
                isKurdish ? 'باشە!' : 'Looking Good!',
                isKurdish ? 'هەموو وەڵامەکان ڕاستن!' : 'All filled answers are correct!',
            );
        } else {
            Alert.alert(
                isKurdish ? 'هەڵە!' : 'Oops!',
                isKurdish
                    ? `${result.wrongCount} خانەی هەڵە هەیە`
                    : `${result.wrongCount} cell(s) are wrong`,
            );
        }
    }, [grid, isKurdish]);

    // Reveal button
    const handleReveal = useCallback(() => {
        if (!selectedCell) {
            Alert.alert(
                isKurdish ? 'خانەیەک هەڵبژێرە' : 'Select a Cell',
                isKurdish ? 'سەرەتا خانەیەک دابگرە' : 'Tap a cell first to reveal its letter',
            );
            return;
        }
        const { r, c } = selectedCell;
        const cell = grid[r][c];
        if (!cell || cell.isHint || cell.userInput === cell.letter) return;

        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }

        const newGrid = revealCell(grid, r, c);
        setGrid(newGrid);
        setHintsUsed(h => h + 1);

        // Check win after reveal
        if (isGridComplete(newGrid)) {
            setGameWon(true);
            clearInterval(timerRef.current);
            setTimeout(() => {
                navigation.navigate('CrosswordResult', {
                    time: seconds,
                    hintsUsed: hintsUsed + 1,
                    puzzleTitle: puzzle.title,
                });
            }, 1200);
        }
    }, [selectedCell, grid, isKurdish, seconds, hintsUsed, puzzle, navigation, gameWon]);

    // Reset
    const handleReset = useCallback(() => {
        Alert.alert(
            isKurdish ? 'سڕینەوە' : 'Reset',
            isKurdish ? 'هەموو وەڵامەکان دەسڕێنەوە؟' : 'Clear all your answers?',
            [
                { text: isKurdish ? 'نەخێر' : 'No', style: 'cancel' },
                {
                    text: isKurdish ? 'بەڵێ' : 'Yes',
                    style: 'destructive',
                    onPress: () => {
                        setGrid(buildGrid(puzzle));
                        setSelectedCell(null);
                        setActiveWord(null);
                        setHintsUsed(0);
                        setSeconds(0);
                        setGameWon(false);
                        setCheckedOnce(false);
                    },
                },
            ],
        );
    }, [puzzle, isKurdish]);

    const tc = colors.text.primary;
    const sc = colors.text.muted;
    const darkCell = isDark ? '#0D0D1A' : CELL_BLACK;
    const whiteCell = isDark ? '#1E1E32' : CELL_WHITE;
    const borderC = isDark ? '#2A2A48' : CELL_BORDER;
    const selectedBg = CELL_SELECTED;

    // ───────── RENDER CELL ─────────
    const renderCell = (r, c) => {
        const cell = grid[r][c];
        const isBlocker = !cell;
        const isSelected = selectedCell && selectedCell.r === r && selectedCell.c === c;
        const isWordCell = isInActiveWord(r, c);

        let bgColor = isBlocker ? darkCell : whiteCell;
        if (cell) {
            if (isSelected) bgColor = selectedBg;
            else if (isWordCell) bgColor = isDark ? 'rgba(74,144,217,0.22)' : CELL_WORD_HIGHLIGHT;
            if (cell.isWrong) bgColor = isDark ? 'rgba(239,68,68,0.35)' : CELL_WRONG;
            if (cell.isCorrect && checkedOnce) bgColor = isDark ? 'rgba(34,197,94,0.25)' : CELL_CORRECT;
            if (cell.isHint) bgColor = isDark ? 'rgba(139,92,246,0.25)' : CELL_HINT;
        }

        const textColor = isSelected ? '#FFF' :
            cell?.isHint ? TEXT_HINT :
            isDark ? '#E2E8F0' : TEXT_USER;

        return (
            <TouchableOpacity
                key={`${r}-${c}`}
                activeOpacity={isBlocker ? 1 : 0.7}
                onPress={() => !isBlocker && handleCellPress(r, c)}
                style={[
                    st.cell,
                    {
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: bgColor,
                        borderColor: borderC,
                    },
                ]}
            >
                {/* Cell number — position on right for RTL */}
                {cell?.number && (
                    <Text style={[
                        st.cellNumber,
                        { color: isSelected ? 'rgba(255,255,255,0.7)' : TEXT_NUMBER },
                        puzzleRTL && { left: undefined, right: 2 },
                    ]}>
                        {cell.number}
                    </Text>
                )}

                {/* Letter */}
                {cell && (cell.userInput || cell.isHint) && (
                    <Text style={[
                        st.cellLetter,
                        {
                            color: textColor,
                            fontSize: isKurdish ? cellSize * 0.42 : cellSize * 0.48,
                        },
                        isKurdish && { fontFamily: 'Rabar' },
                    ]}>
                        {cell.isHint ? cell.letter : cell.userInput}
                    </Text>
                )}
            </TouchableOpacity>
        );
    };

    // ───────── RENDER CLUE ITEM ─────────
    const renderClueItem = (clueObj) => {
        const isActive = activeWord &&
            activeWord.number === clueObj.number &&
            activeWord.direction === clueObj.direction;

        return (
            <TouchableOpacity
                key={`${clueObj.direction}-${clueObj.number}`}
                onPress={() => handleClueTap(clueObj)}
                style={[
                    st.clueItem,
                    {
                        backgroundColor: isActive
                            ? (isDark ? 'rgba(74,144,217,0.2)' : 'rgba(74,144,217,0.12)')
                            : 'transparent',
                        borderLeftWidth: isActive ? 3 : 0,
                        borderLeftColor: CELL_SELECTED,
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                    },
                ]}
            >
                <View style={[st.clueNumber, { backgroundColor: isDark ? '#2A2A48' : '#E2E8F0' }]}>
                    <Text style={[st.clueNumberText, { color: isDark ? '#A0AEC0' : '#475569' }]}>
                        {clueObj.number}
                    </Text>
                </View>
                <Text style={[
                    st.clueText,
                    { color: isDark ? '#CBD5E1' : '#334155' },
                    isKurdish && { fontFamily: 'Rabar', textAlign: 'right' },
                ]} numberOfLines={2}>
                    {clueObj.clue}
                </Text>
            </TouchableOpacity>
        );
    };

    // Active clue display
    const activeClueText = activeWord
        ? `${activeWord.number}. ${activeWord.clue}`
        : (isKurdish ? 'خانەیەک هەڵبژێرە' : 'Tap a cell to start');

    return (
        <AnimatedScreen noPadding noTopPadding>
            <View style={st.root}>
                <LinearGradient
                    colors={isDark
                        ? ['#0A0A1A', '#121228', '#0A0A1A']
                        : ['#F0F4F8', '#E8EEF4', '#F0F4F8']
                    }
                    style={StyleSheet.absoluteFill}
                />

                {/* Hidden text input for keyboard */}
                <TextInput
                    ref={inputRef}
                    style={st.hiddenInput}
                    value=""
                    onChangeText={handleKeyInput}
                    onKeyPress={({ nativeEvent }) => {
                        if (nativeEvent.key === 'Backspace') handleBackspace();
                    }}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    blurOnSubmit={false}
                    caretHidden
                />

                <SafeAreaView style={{ flex: 1 }}>
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    >
                        {/* Header */}
                        <View style={[st.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <BackButton onPress={() => navigation.goBack()} />
                            <View style={st.headerCenter}>
                                <Text style={[st.headerTitle, { color: tc }, isKurdish && st.kf]}>
                                    {isKurdish ? 'خاچەوشە' : 'Crossword'}
                                </Text>
                                <Text style={[st.headerSub, { color: sc }, isKurdish && st.kf]}>
                                    {puzzle.title}
                                </Text>
                            </View>
                            <View style={[st.timerBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
                                <Clock size={14} color={sc} />
                                <Text style={[st.timerText, { color: tc }]}>{formatTime(seconds)}</Text>
                            </View>
                        </View>

                        {/* Stats Bar */}
                        <View style={[st.statsBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <View style={[st.statPill, { backgroundColor: isDark ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.1)' }]}>
                                <Eye size={13} color="#8B5CF6" />
                                <Text style={[st.statText, { color: '#8B5CF6' }, isKurdish && st.kf]}>
                                    {hintsUsed} {isKurdish ? 'ئاماژە' : 'hints'}
                                </Text>
                            </View>
                            {gameWon && (
                                <View style={[st.statPill, { backgroundColor: 'rgba(34,197,94,0.15)' }]}>
                                    <Trophy size={13} color="#22C55E" />
                                    <Text style={[st.statText, { color: '#22C55E' }, isKurdish && st.kf]}>
                                        {isKurdish ? 'تەواو بوو!' : 'Complete!'}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 100 }}
                            keyboardShouldPersistTaps="handled"
                        >
                            {/* Active Clue Banner */}
                            <View style={[st.activeClue, {
                                backgroundColor: isDark ? 'rgba(74,144,217,0.12)' : 'rgba(74,144,217,0.08)',
                                borderColor: isDark ? 'rgba(74,144,217,0.3)' : 'rgba(74,144,217,0.2)',
                            }]}>
                                {activeWord && (
                                    <View style={[st.dirBadge, { backgroundColor: CELL_SELECTED }]}>
                                        {activeDirection === 'across'
                                            ? (puzzleRTL ? <ArrowRight size={12} color="#FFF" style={{ transform: [{ scaleX: -1 }] }} /> : <ArrowRight size={12} color="#FFF" />)
                                            : <ArrowDown size={12} color="#FFF" />
                                        }
                                    </View>
                                )}
                                <Text style={[
                                    st.activeClueText,
                                    { color: isDark ? '#93C5FD' : '#1E40AF' },
                                    isKurdish && { fontFamily: 'Rabar', textAlign: 'right' },
                                ]} numberOfLines={2}>
                                    {activeClueText}
                                </Text>
                            </View>

                            {/* ─── Board ─── */}
                            <View style={[st.boardContainer, { paddingHorizontal: boardPadding }]}>
                                <View style={[st.board, {
                                    width: actualBoardSize + 2,
                                    height: actualBoardSize + 2,
                                    borderColor: borderC,
                                    backgroundColor: darkCell,
                                }]}>
                                    {Array(gridSize).fill(null).map((_, r) => (
                                        <View key={r} style={st.row}>
                                            {Array(gridSize).fill(null).map((_, c) => renderCell(r, c))}
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Action Buttons */}
                            <View style={[st.actions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                <TouchableOpacity
                                    onPress={handleCheck}
                                    style={[st.actionBtn, {
                                        backgroundColor: isDark ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.1)',
                                        borderColor: isDark ? 'rgba(34,197,94,0.3)' : 'rgba(34,197,94,0.2)',
                                    }]}
                                >
                                    <CheckCircle size={18} color="#22C55E" />
                                    <Text style={[st.actionText, { color: '#22C55E' }, isKurdish && st.kf]}>
                                        {isKurdish ? 'پشکنین' : 'Check'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={handleReveal}
                                    style={[st.actionBtn, {
                                        backgroundColor: isDark ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.1)',
                                        borderColor: isDark ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.2)',
                                    }]}
                                >
                                    <Eye size={18} color="#8B5CF6" />
                                    <Text style={[st.actionText, { color: '#8B5CF6' }, isKurdish && st.kf]}>
                                        {isKurdish ? 'ئاشکرا' : 'Reveal'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={handleReset}
                                    style={[st.actionBtn, {
                                        backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.1)',
                                        borderColor: isDark ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.2)',
                                    }]}
                                >
                                    <RotateCcw size={18} color="#EF4444" />
                                    <Text style={[st.actionText, { color: '#EF4444' }, isKurdish && st.kf]}>
                                        {isKurdish ? 'سڕینەوە' : 'Reset'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* ─── Clue Panel ─── */}
                            <View style={[st.cluePanel, {
                                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                                borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                            }]}>
                                {/* Clue panel header with toggle */}
                                <TouchableOpacity
                                    onPress={() => setShowClues(!showClues)}
                                    style={[st.cluePanelHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                                >
                                    <Text style={[st.cluePanelTitle, { color: tc }, isKurdish && st.kf]}>
                                        {isKurdish ? 'ئاماژەکان' : 'Clues'}
                                    </Text>
                                    {showClues ? <ChevronUp size={18} color={sc} /> : <ChevronDown size={18} color={sc} />}
                                </TouchableOpacity>

                                {showClues && (
                                    <>
                                        {/* Direction Tabs */}
                                        <View style={[st.dirTabs, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                            <TouchableOpacity
                                                onPress={() => setClueSection('across')}
                                                style={[
                                                    st.dirTab,
                                                    clueSection === 'across' && {
                                                        backgroundColor: isDark ? 'rgba(74,144,217,0.2)' : 'rgba(74,144,217,0.1)',
                                                        borderColor: CELL_SELECTED,
                                                    },
                                                ]}
                                            >
                                                <ArrowRight size={14} color={clueSection === 'across' ? CELL_SELECTED : sc} />
                                                <Text style={[
                                                    st.dirTabText,
                                                    { color: clueSection === 'across' ? CELL_SELECTED : sc },
                                                    isKurdish && st.kf,
                                                ]}>
                                                    {isKurdish ? 'تێپەڕ' : 'Across'}
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => setClueSection('down')}
                                                style={[
                                                    st.dirTab,
                                                    clueSection === 'down' && {
                                                        backgroundColor: isDark ? 'rgba(74,144,217,0.2)' : 'rgba(74,144,217,0.1)',
                                                        borderColor: CELL_SELECTED,
                                                    },
                                                ]}
                                            >
                                                <ArrowDown size={14} color={clueSection === 'down' ? CELL_SELECTED : sc} />
                                                <Text style={[
                                                    st.dirTabText,
                                                    { color: clueSection === 'down' ? CELL_SELECTED : sc },
                                                    isKurdish && st.kf,
                                                ]}>
                                                    {isKurdish ? 'خوارەوە' : 'Down'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>

                                        {/* Clue List */}
                                        <View style={st.clueList}>
                                            {(clueSection === 'across' ? clues.across : clues.down).map(renderClueItem)}
                                            {(clueSection === 'across' ? clues.across : clues.down).length === 0 && (
                                                <Text style={[st.emptyClue, { color: sc }, isKurdish && st.kf]}>
                                                    {isKurdish ? 'هیچ ئاماژەیەک نییە' : 'No clues in this direction'}
                                                </Text>
                                            )}
                                        </View>
                                    </>
                                )}
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </View>

            {/* Win Overlay */}
            {gameWon && (
                <View style={st.winOverlay}>
                    <LinearGradient
                        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.85)']}
                        style={StyleSheet.absoluteFill}
                    />
                    <View style={st.winCard}>
                        <LinearGradient
                            colors={isDark ? ['#1A1A3E', '#242450'] : ['#FFFFFF', '#F0F4F8']}
                            style={StyleSheet.absoluteFill}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        />
                        <Sparkles size={48} color="#FFD700" />
                        <Text style={[st.winTitle, { color: tc }, isKurdish && st.kf]}>
                            {isKurdish ? 'ئافەرین!' : 'Well Done!'}
                        </Text>
                        <Text style={[st.winSub, { color: sc }, isKurdish && st.kf]}>
                            {formatTime(seconds)} · {hintsUsed} {isKurdish ? 'ئاماژە' : 'hints'}
                        </Text>
                    </View>
                </View>
            )}
        </AnimatedScreen>
    );
}

const st = StyleSheet.create({
    root: { flex: 1 },
    kf: { fontFamily: 'Rabar' },

    hiddenInput: {
        position: 'absolute',
        opacity: 0,
        height: 0,
        width: 0,
    },

    // Header
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 14, paddingVertical: 8,
    },
    headerCenter: { alignItems: 'center', flex: 1 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    headerSub: { fontSize: 11, fontWeight: '600', marginTop: 2 },
    timerBox: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12,
    },
    timerText: { fontSize: 13, fontWeight: '700', fontVariant: ['tabular-nums'] },

    // Stats
    statsBar: {
        flexDirection: 'row', paddingHorizontal: 14, gap: 8, marginBottom: 4,
    },
    statPill: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
    },
    statText: { fontSize: 12, fontWeight: '700' },

    // Active Clue
    activeClue: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        marginHorizontal: 14, marginVertical: 6,
        paddingHorizontal: 12, paddingVertical: 10,
        borderRadius: 12, borderWidth: 1,
    },
    dirBadge: {
        width: 24, height: 24, borderRadius: 6,
        alignItems: 'center', justifyContent: 'center',
    },
    activeClueText: { fontSize: 13, fontWeight: '600', flex: 1 },

    // Board
    boardContainer: {
        alignItems: 'center', justifyContent: 'center', marginVertical: 8,
    },
    board: {
        borderWidth: 1, borderRadius: 4, overflow: 'hidden',
    },
    row: { flexDirection: 'row' },

    // Cell
    cell: {
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 0.5, position: 'relative',
    },
    cellNumber: {
        position: 'absolute', top: 1, left: 2,
        fontSize: 8, fontWeight: '700',
    },
    cellLetter: {
        fontWeight: '800', textAlign: 'center',
        textTransform: 'uppercase',
    },

    // Actions
    actions: {
        flexDirection: 'row', justifyContent: 'center', gap: 10,
        marginHorizontal: 14, marginVertical: 10,
    },
    actionBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingHorizontal: 14, paddingVertical: 10,
        borderRadius: 12, borderWidth: 1, flex: 1, justifyContent: 'center',
    },
    actionText: { fontSize: 13, fontWeight: '700' },

    // Clue Panel
    cluePanel: {
        marginHorizontal: 14, borderRadius: 16, borderWidth: 1,
        overflow: 'hidden',
    },
    cluePanelHeader: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 12,
    },
    cluePanelTitle: { fontSize: 15, fontWeight: '800' },
    dirTabs: {
        flexDirection: 'row', paddingHorizontal: 12, gap: 8, marginBottom: 8,
    },
    dirTab: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        paddingHorizontal: 14, paddingVertical: 8,
        borderRadius: 10, borderWidth: 1, borderColor: 'transparent',
        flex: 1, justifyContent: 'center',
    },
    dirTabText: { fontSize: 13, fontWeight: '700' },

    // Clue items
    clueList: { paddingHorizontal: 8, paddingBottom: 12 },
    clueItem: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        paddingHorizontal: 10, paddingVertical: 8,
        borderRadius: 8, marginBottom: 2,
    },
    clueNumber: {
        width: 26, height: 26, borderRadius: 7,
        alignItems: 'center', justifyContent: 'center',
    },
    clueNumberText: { fontSize: 12, fontWeight: '800' },
    clueText: { fontSize: 13, fontWeight: '500', flex: 1, lineHeight: 18 },
    emptyClue: { fontSize: 13, fontWeight: '500', textAlign: 'center', padding: 16 },

    // Win overlay
    winOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center', justifyContent: 'center',
        zIndex: 100,
    },
    winCard: {
        width: 260, paddingVertical: 40, paddingHorizontal: 24,
        borderRadius: 24, alignItems: 'center', overflow: 'hidden',
        gap: 12,
        shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3, shadowRadius: 20, elevation: 15,
    },
    winTitle: { fontSize: 28, fontWeight: '900' },
    winSub: { fontSize: 14, fontWeight: '600' },
});
