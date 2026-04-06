import { getGeminiApiKey } from '../../utils/geminiConfig';

/**
 * Family Feud Game Engine
 * TV-show accurate logic: Face-Off, Pass/Play, Main Round, Steal, Multipliers, Sudden Death
 * — No duplicate questions in a single game session
 * — Optimized AI answer checking
 */

export const PHASE = {
    FACE_OFF: 'FACE_OFF',
    PASS_OR_PLAY: 'PASS_OR_PLAY',
    MAIN_ROUND: 'MAIN_ROUND',
    STEAL: 'STEAL',
    ROUND_END: 'ROUND_END',
    SUDDEN_DEATH: 'SUDDEN_DEATH',
    GAME_OVER: 'GAME_OVER',
};

export const TOTAL_ROUNDS = 4;
export const WIN_SCORE = 300;

export function getMultiplier(roundNumber) {
    if (roundNumber <= 2) return 1;
    if (roundNumber === 3) return 2;
    return 3;
}

export function getMultiplierLabel(roundNumber, isKurdish) {
    const m = getMultiplier(roundNumber);
    if (m === 1) return isKurdish ? 'خاڵی ئاسایی' : 'Normal Points';
    if (m === 2) return isKurdish ? 'خاڵی دووبرابەر ×٢' : 'Double Points ×2';
    return isKurdish ? 'خاڵی سێبرابەر ×٣' : 'Triple Points ×3';
}

/**
 * Deduplicate questions by their text to avoid repeats,
 * then shuffle and pick enough for TOTAL_ROUNDS + 2 buffer.
 */
export function pickUniqueQuestions(allQuestions) {
    // Deduplicate by normalized question text
    const seen = new Set();
    const unique = [];
    for (const q of allQuestions) {
        const key = q.question.trim().toLowerCase();
        if (!seen.has(key)) {
            seen.add(key);
            unique.push(q);
        }
    }
    // Shuffle (Fisher-Yates)
    for (let i = unique.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [unique[i], unique[j]] = [unique[j], unique[i]];
    }
    return unique.slice(0, TOTAL_ROUNDS + 2);
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
        faceOffPlayer1: 0,
        faceOffPlayer2: 0,
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
        questions: questions,
        currentQuestionIndex: 0,
        usedQuestionIndices: [0], // Track which indices we've used
        suddenDeathQuestion: null,
    };
}

export function getCurrentQuestion(state) {
    return state.questions[state.currentQuestionIndex] || null;
}

// ─── ANSWER MATCHING ───

const KURDISH_STOP_WORDS = new Set([
    'و',
    'يا',
    'یان',
    'لە',
    'له',
    'بە',
    'به',
    'بو',
    'بۆ',
    'bo',
    'ل',
    'ی',
    'a',
    'the',
]);

export function normalizeAnswerText(text) {
    if (!text) return '';
    let s = text.normalize('NFKC').trim().toLowerCase();
    s = s.replace(/[\u200B-\u200F\u202A-\u202E\uFEFF]/g, '');
    s = s.replace(/[\u064B-\u065F\u0670]/g, '');
    s = s.replace(/\u0640/g, '');
    s = s.replace(/[ئإأآٱ]/g, 'ا');
    s = s.replace(/[ؤ]/g, 'و');
    s = s.replace(/[ة]/g, 'ه');
    s = s.replace(/[ۀ]/g, 'ە');
    s = s.replace(/[ھ]/g, 'ه');
    s = s.replace(/[ك]/g, 'ک');
    s = s.replace(/[ى]/g, 'ی');
    s = s.replace(/[ي]/g, 'ی');
    s = s.replace(/[ەه]$/g, '');
    s = s.replace(/[ۊ]/g, 'و');
    s = s.replace(/[٠-٩]/g, (digit) => '٠١٢٣٤٥٦٧٨٩'.indexOf(digit).toString());
    s = s.replace(/[۰-۹]/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit).toString());
    s = s.replace(/[\/\-\(\)،,\.؟?!:;]/g, ' ');
    s = s.replace(/\s+/g, ' ').trim();
    return s;
}

function normalize(text) {
    return normalizeAnswerText(text);
}

function getMeaningfulTokens(text) {
    return normalize(text)
        .split(' ')
        .map((token) => token.trim())
        .filter((token) => token.length >= 2 && !KURDISH_STOP_WORDS.has(token));
}

function expandCandidatePhrases(answer) {
    const variants = new Set();
    const sources = [answer?.text, ...(answer?.alts || [])].filter(Boolean);

    for (const source of sources) {
        variants.add(source);
        source.split(/[\/,،]/).forEach((part) => {
            const trimmed = part.trim();
            if (trimmed) variants.add(trimmed);
        });
    }

    return [...variants];
}

function tokensAreCompatible(candidateTokens, inputTokens) {
    if (candidateTokens.length === 0 || inputTokens.length === 0) return false;

    const shared = inputTokens.filter((token) => (
        candidateTokens.some((candidateToken) => isCloseMatch(candidateToken, token))
    ));

    if (shared.length === 0) return false;

    const coverage = shared.length / Math.max(inputTokens.length, candidateTokens.length);
    const inputCovered = shared.length / inputTokens.length;

    return inputCovered >= 0.75 || coverage >= 0.6;
}

function isCloseMatch(a, b) {
    if (!a || !b || a.length < 2 || b.length < 2) return false;
    if (a === b) return true;
    const shorter = a.length <= b.length ? a : b;
    const longer = a.length > b.length ? a : b;
    if (shorter.length >= 4 && shorter.length / longer.length >= 0.8 && longer.includes(shorter)) return true;
    // Levenshtein for short words (typo tolerance)
    if (a.length >= 3 && b.length >= 3 && a.length <= 12 && b.length <= 12) {
        const dist = levenshtein(a, b);
        const maxLen = Math.max(a.length, b.length);
        if (dist <= 1 || (maxLen >= 6 && dist <= 2)) return true;
    }
    return false;
}

function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++)
        for (let j = 1; j <= n; j++)
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
            );
    return dp[m][n];
}

export function findAnswerOnBoard(question, answerText) {
    if (!answerText || !question) return -1;
    const input = normalize(answerText);
    if (input.length < 2) return -1;
    const inputTokens = getMeaningfulTokens(answerText);

    return question.answers.findIndex(a => {
        const candidatePhrases = expandCandidatePhrases(a);
        for (const phrase of candidatePhrases) {
            const normalizedPhrase = normalize(phrase);
            if (isCloseMatch(normalizedPhrase, input)) return true;

            const candidateTokens = getMeaningfulTokens(phrase);
            if (tokensAreCompatible(candidateTokens, inputTokens)) return true;
        }
        return false;
    });
}

export function getAnswerRank(question, answerIndex) {
    const sorted = question.answers
        .map((a, i) => ({ ...a, originalIndex: i }))
        .sort((a, b) => b.points - a.points);
    return sorted.findIndex(a => a.originalIndex === answerIndex);
}

export function countRevealed(revealedAnswers) {
    return revealedAnswers.filter(Boolean).length;
}

export function isBoardCleared(revealedAnswers) {
    return revealedAnswers.every(Boolean);
}

export function awardBankToTeam(state, teamNum) {
    const multiplier = getMultiplier(state.round);
    const points = state.bank * multiplier;
    if (teamNum === 1) {
        return { ...state, team1: { ...state.team1, score: state.team1.score + points } };
    }
    return { ...state, team2: { ...state.team2, score: state.team2.score + points } };
}

export function advanceRound(state) {
    if (state.team1.score >= WIN_SCORE || state.team2.score >= WIN_SCORE) {
        return { ...state, phase: PHASE.GAME_OVER };
    }
    if (state.round >= TOTAL_ROUNDS) {
        if (state.team1.score !== state.team2.score) {
            return { ...state, phase: PHASE.GAME_OVER };
        }
        return { ...state, phase: PHASE.SUDDEN_DEATH };
    }

    const nextRound = state.round + 1;
    // Find next unused question index
    let nextQIdx = state.currentQuestionIndex + 1;
    const usedSet = new Set(state.usedQuestionIndices || []);
    while (nextQIdx < state.questions.length && usedSet.has(nextQIdx)) {
        nextQIdx++;
    }
    if (nextQIdx >= state.questions.length) nextQIdx = state.currentQuestionIndex + 1; // fallback

    const fo1 = (state.faceOffPlayer1 + 1) % state.team1.members.length;
    const fo2 = (state.faceOffPlayer2 + 1) % state.team2.members.length;

    return {
        ...state,
        phase: PHASE.FACE_OFF,
        round: nextRound,
        currentQuestionIndex: nextQIdx,
        usedQuestionIndices: [...(state.usedQuestionIndices || []), nextQIdx],
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

export function getFaceOffPlayers(state) {
    return {
        player1: state.team1.members[state.faceOffPlayer1 % state.team1.members.length],
        player2: state.team2.members[state.faceOffPlayer2 % state.team2.members.length],
    };
}

export function getCurrentPlayer(state) {
    const team = state.controllingTeam === 1 ? state.team1 : state.team2;
    return team.members[state.currentMemberIndex % team.members.length];
}

export function nextMember(state) {
    const team = state.controllingTeam === 1 ? state.team1 : state.team2;
    const next = (state.currentMemberIndex + 1) % team.members.length;
    return { currentMemberIndex: next };
}

// ─── GEMINI AI CHECK (optimized) ───

const GEMINI_MODEL = "gemini-3.1-flash-lite-preview";

export async function checkAnswerWithGemini(question, answerText, revealedAnswers) {
    if (!answerText || !question) return -1;
    const input = answerText.trim();
    if (input.length < 2) return -1;

    // 1. Fast local check first
    const localIdx = findAnswerOnBoard(question, input);
    if (localIdx !== -1) return localIdx;
    if (input.length < 3) return -1;
    const geminiApiKey = await getGeminiApiKey();
    if (!geminiApiKey) return -1;

    // 2. Build only unrevealed answers list for Gemini (skip already revealed)
    const unrevealed = question.answers
        .map((a, i) => ({ ...a, idx: i }))
        .filter((_, i) => !revealedAnswers || !revealedAnswers[i]);

    if (unrevealed.length === 0) return -1;

    try {
        const answersList = unrevealed
            .map(a => `${a.idx}: ${a.text}${a.alts ? ' | alternates: ' + a.alts.slice(0, 6).join(', ') : ''}`)
            .join('\n');

        const prompt = `You are a strict Kurdish Sorani Family Feud judge.
Question: "${question.question}"
Official board answers:
${answersList}
Player answer: "${input}"

Rules:
- Accept only if the player answer is the same answer concept as one board answer.
- Accept Kurdish Sorani spelling variants, common Kurdish cultural names, Arabic-script variants, and direct synonyms.
- Accept singular/plural and very small spelling mistakes only when the meaning is still clearly identical.
- Reject broader or narrower categories, related items, neighboring concepts, examples from a different answer bucket, or guesses that only fit the topic.
- Reject if the answer changes to a different Kurdish word with a different meaning.
- If there is any doubt, return -1.

Return ONLY the matching ID number or -1.`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiApiKey}`;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.0, topP: 0.1, maxOutputTokens: 4 }
            })
        });

        clearTimeout(timeout);

        if (response.ok) {
            const data = await response.json();
            const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
            const matchedIdx = parseInt(raw, 10);
            if (!isNaN(matchedIdx) && matchedIdx >= 0 && matchedIdx < question.answers.length) {
                return matchedIdx;
            }
        }
    } catch (e) {
        if (e.name !== 'AbortError') console.warn("Gemini check error:", e);
    }

    return -1;
}
