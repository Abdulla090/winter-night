/**
 * Family Feud Game Engine
 * TV-show accurate logic: Face-Off, Pass/Play, Main Round, Steal, Multipliers, Sudden Death
 */

// Game phases
export const PHASE = {
    FACE_OFF: 'FACE_OFF',
    PASS_OR_PLAY: 'PASS_OR_PLAY',
    MAIN_ROUND: 'MAIN_ROUND',
    STEAL: 'STEAL',
    ROUND_END: 'ROUND_END',
    SUDDEN_DEATH: 'SUDDEN_DEATH',
    GAME_OVER: 'GAME_OVER',
};

// Total main rounds
export const TOTAL_ROUNDS = 4;
export const WIN_SCORE = 300;

// Get multiplier for the current round (1-indexed)
export function getMultiplier(roundNumber) {
    if (roundNumber <= 2) return 1;
    if (roundNumber === 3) return 2;
    return 3; // Round 4
}

// Get multiplier label
export function getMultiplierLabel(roundNumber, isKurdish) {
    const m = getMultiplier(roundNumber);
    if (m === 1) return isKurdish ? 'خاڵی ئاسایی' : 'Normal Points';
    if (m === 2) return isKurdish ? 'خاڵی دووبرابەر ×٢' : 'Double Points ×2';
    return isKurdish ? 'خاڵی سێبرابەر ×٣' : 'Triple Points ×3';
}

/**
 * Create initial game state
 */
export function createInitialState(team1Name, team2Name, team1Members, team2Members, questions) {
    return {
        phase: PHASE.FACE_OFF,
        round: 1,
        team1: { name: team1Name, members: team1Members, score: 0 },
        team2: { name: team2Name, members: team2Members, score: 0 },
        // Face-off state
        faceOffPlayer1: 0, // index into team1.members
        faceOffPlayer2: 0, // index into team2.members
        faceOffBuzzTeam: null, // 1 or 2
        faceOffAnswer1: null, // { answerIndex, points }
        faceOffAnswer2: null,
        faceOffWinner: null, // 1 or 2
        // Main round state
        controllingTeam: null, // 1 or 2
        currentMemberIndex: 0, // which member is guessing
        strikes: 0,
        bank: 0, // temporary points for this round
        revealedAnswers: [], // boolean array
        // Steal state
        stealAnswer: null,
        // Questions
        questions: questions,
        currentQuestionIndex: 0,
        // Sudden death
        suddenDeathQuestion: null,
    };
}

/**
 * Get current question
 */
export function getCurrentQuestion(state) {
    return state.questions[state.currentQuestionIndex] || null;
}

/**
 * Normalize text for Kurdish/Arabic/English fuzzy matching.
 * Handles: diacritics, letter variants, zero-width chars, spacing.
 */
function normalize(text) {
    if (!text) return '';
    let s = text.trim().toLowerCase();
    // Remove zero-width chars, diacritics, tatweel
    s = s.replace(/[\u200B-\u200F\u202A-\u202E\uFEFF]/g, ''); // zero-width
    s = s.replace(/[\u064B-\u065F\u0670]/g, ''); // Arabic diacritics
    s = s.replace(/\u0640/g, ''); // tatweel ـ
    // Normalize Kurdish/Arabic letter variants
    s = s.replace(/[ئإأآٱ]/g, 'ا');
    s = s.replace(/[ة]/g, 'ه');
    s = s.replace(/[ۆ]/g, 'و');
    s = s.replace(/[ێ]/g, 'ي');
    s = s.replace(/[ک]/g, 'ك');
    s = s.replace(/[ی]/g, 'ي');
    s = s.replace(/[ڕ]/g, 'ر');
    s = s.replace(/[ڤ]/g, 'ف');
    s = s.replace(/[گ]/g, 'گ');
    s = s.replace(/[ژ]/g, 'ز');
    s = s.replace(/[ڵ]/g, 'ل');
    s = s.replace(/[ۊ]/g, 'و');
    // Normalize common punctuation and spacing
    s = s.replace(/[\/\-\(\)،,\.؟?!:;]/g, ' ');
    s = s.replace(/\s+/g, ' ').trim();
    return s;
}

/**
 * Check if two normalized strings are a close enough match.
 * Requires exact match OR substring match only when the shorter
 * string is at least 80% the length of the longer (prevents false positives).
 */
function isCloseMatch(a, b) {
    if (!a || !b || a.length < 2 || b.length < 2) return false;
    if (a === b) return true;
    const shorter = a.length <= b.length ? a : b;
    const longer = a.length > b.length ? a : b;
    // Only allow substring matching if the shorter string is at least 80% of the longer
    if (shorter.length >= 3 && shorter.length / longer.length >= 0.8 && longer.includes(shorter)) return true;
    return false;
}

/**
 * Check if an answer text matches any on the board (fuzzy + Kurdish-aware).
 * Checks: main text, alts array, partial matching, normalized matching.
 */
export function findAnswerOnBoard(question, answerText) {
    if (!answerText || !question) return -1;
    const input = normalize(answerText);
    if (input.length < 2) return -1;

    return question.answers.findIndex(a => {
        const mainNorm = normalize(a.text);
        // Direct normalized match
        if (isCloseMatch(mainNorm, input)) return true;
        // Check alts array (variant spellings)
        if (a.alts && a.alts.length > 0) {
            for (const alt of a.alts) {
                const altNorm = normalize(alt);
                if (isCloseMatch(altNorm, input)) return true;
            }
        }
        // Split by "/" for compound answers like "Wallet / Money"
        const parts = a.text.split(/[\/,،]/);
        for (const part of parts) {
            const pn = normalize(part);
            if (pn.length > 1 && isCloseMatch(pn, input)) return true;
        }
        return false;
    });
}

/**
 * Get the rank of an answer (0 = #1 ranked, etc.)
 */
export function getAnswerRank(question, answerIndex) {
    const sorted = question.answers
        .map((a, i) => ({ ...a, originalIndex: i }))
        .sort((a, b) => b.points - a.points);
    return sorted.findIndex(a => a.originalIndex === answerIndex);
}

/**
 * Calculate how many answers are revealed
 */
export function countRevealed(revealedAnswers) {
    return revealedAnswers.filter(Boolean).length;
}

/**
 * Check if all answers are revealed (board cleared)
 */
export function isBoardCleared(revealedAnswers) {
    return revealedAnswers.every(Boolean);
}

/**
 * Award bank points to a team with multiplier
 */
export function awardBankToTeam(state, teamNum) {
    const multiplier = getMultiplier(state.round);
    const points = state.bank * multiplier;
    if (teamNum === 1) {
        return { ...state, team1: { ...state.team1, score: state.team1.score + points } };
    }
    return { ...state, team2: { ...state.team2, score: state.team2.score + points } };
}

/**
 * Advance to next round or game over
 */
export function advanceRound(state) {
    // Check win condition
    if (state.team1.score >= WIN_SCORE || state.team2.score >= WIN_SCORE) {
        return { ...state, phase: PHASE.GAME_OVER };
    }

    if (state.round >= TOTAL_ROUNDS) {
        // Check if someone won
        if (state.team1.score !== state.team2.score) {
            return { ...state, phase: PHASE.GAME_OVER };
        }
        // Tie after 4 rounds → Sudden Death
        return { ...state, phase: PHASE.SUDDEN_DEATH };
    }

    const nextRound = state.round + 1;
    const nextQIdx = state.currentQuestionIndex + 1;

    // Rotate face-off players
    const fo1 = state.faceOffPlayer1 + 1 < state.team1.members.length ? state.faceOffPlayer1 + 1 : 0;
    const fo2 = state.faceOffPlayer2 + 1 < state.team2.members.length ? state.faceOffPlayer2 + 1 : 0;

    return {
        ...state,
        phase: PHASE.FACE_OFF,
        round: nextRound,
        currentQuestionIndex: nextQIdx,
        faceOffPlayer1: fo1,
        faceOffPlayer2: fo2,
        faceOffBuzzTeam: null,
        faceOffAnswer1: null,
        faceOffAnswer2: null,
        faceOffWinner: null,
        controllingTeam: null,
        currentMemberIndex: 0,
        strikes: 0,
        bank: 0,
        revealedAnswers: [],
        stealAnswer: null,
    };
}

/**
 * Get the face-off players for current round
 */
export function getFaceOffPlayers(state) {
    return {
        player1: state.team1.members[state.faceOffPlayer1 % state.team1.members.length],
        player2: state.team2.members[state.faceOffPlayer2 % state.team2.members.length],
    };
}

/**
 * Get current player name during main round
 */
export function getCurrentPlayer(state) {
    const team = state.controllingTeam === 1 ? state.team1 : state.team2;
    return team.members[state.currentMemberIndex % team.members.length];
}

/**
 * Rotate to next member in the controlling team
 */
export function nextMember(state) {
    const team = state.controllingTeam === 1 ? state.team1 : state.team2;
    const next = (state.currentMemberIndex + 1) % team.members.length;
    return { currentMemberIndex: next };
}
