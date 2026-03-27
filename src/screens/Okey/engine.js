// ══════════════════════════════════════════════════════════════
// KURDISH OKEY ENGINE — کوردی ئۆکەیی
// Implements: Team play, دابەزین, کۆنکان, left-discard rules
// ══════════════════════════════════════════════════════════════

export const COLORS = ['yellow', 'blue', 'black', 'red'];
export const COLOR_NAMES_KU = { yellow: 'زەرد', blue: 'شین', black: 'ڕەش', red: 'سوور' };

// ─── DECK CREATION ───
export function createDeck() {
    let deck = [];
    let idCounter = 1;
    for (let set = 0; set < 2; set++) {
        for (let c of COLORS) {
            for (let v = 1; v <= 13; v++) {
                deck.push({ id: idCounter++, color: c, value: v, isFake: false });
            }
        }
    }
    // Two Fake Jokers
    deck.push({ id: idCounter++, color: 'fake', value: 0, isFake: true });
    deck.push({ id: idCounter++, color: 'fake', value: 0, isFake: true });

    // Shuffle Fisher-Yates
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// ─── OKEY TILE DETERMINATION ───
export function getOkey(indicator) {
    if (indicator.isFake) return { color: 'fake', value: 0 };
    const okeyValue = indicator.value === 13 ? 1 : indicator.value + 1;
    return { color: indicator.color, value: okeyValue };
}

// ─── TEAM HELPERS ───
// Players: 0, 1, 2, 3 seated clockwise.
// Teammate is the player directly across: 0↔2, 1↔3
export function getTeammateIndex(playerIndex) {
    return (playerIndex + 2) % 4;
}

export function areTeammates(p1, p2) {
    return getTeammateIndex(p1) === p2;
}

// ─── KURDISH CARD VALUE CALCULATION ───
// Cards 2-10 = face value, Cards 1, 11, 12, 13 = 10 points each
export function getCardPoints(tile) {
    if (!tile || tile.isFake) return 0; // Jokers don't count for point calc
    const v = tile.value;
    if (v >= 2 && v <= 10) return v;
    // 1, 11, 12, 13 are all worth 10
    return 10;
}

// Calculate total points of a list of tiles
export function calculateHandPoints(tiles) {
    return tiles.reduce((sum, t) => sum + getCardPoints(t), 0);
}

// ─── GROUP VALIDATION (Sets & Runs) ───
// Extract groups from a rack: tiles separated by empty slots are groups.
// Row break at index 11 also separates groups.
export function extractGroups(slots) {
    const groups = [];
    let currentGroup = [];

    for (let i = 0; i < slots.length; i++) {
        if (i === 11) {
            if (currentGroup.length > 0) {
                groups.push([...currentGroup]);
                currentGroup = [];
            }
        }
        const t = slots[i];
        if (t) {
            currentGroup.push(t);
        } else {
            if (currentGroup.length > 0) {
                groups.push([...currentGroup]);
                currentGroup = [];
            }
        }
    }
    if (currentGroup.length > 0) groups.push([...currentGroup]);
    return groups;
}

// Validate that ALL groups in a rack are valid sets/runs (≥3 tiles)
export function validateGroups(slots, okeyObj) {
    const groups = extractGroups(slots);
    for (const g of groups) {
        if (g.length < 3) return false;
        if (!isValidGroup(g, okeyObj)) return false;
    }
    return true;
}

// Validate a single group is a valid run or set
function isValidGroup(group, okey) {
    const isTileOkey = (t) => t.color === okey.color && t.value === okey.value;
    const normalize = (t) => {
        if (t.isFake) return { color: okey.color, value: okey.value };
        return t;
    };

    let okeyCount = 0;
    const realTiles = [];

    for (let t of group) {
        if (isTileOkey(t)) {
            okeyCount++;
        } else {
            realTiles.push(normalize(t));
        }
    }

    // ── Try SET (same number, different colors, max 4) ──
    if (realTiles.length <= 4) {
        let isSet = true;
        let setVal = realTiles.length > 0 ? realTiles[0].value : null;
        let seenColors = new Set();

        if (setVal !== null) {
            for (let t of realTiles) {
                if (t.value !== setVal) { isSet = false; break; }
                if (seenColors.has(t.color)) { isSet = false; break; }
                seenColors.add(t.color);
            }
        }
        if (isSet) return true;
    }

    // ── Try RUN (same color, consecutive) ──
    let runColor = realTiles.length > 0 ? realTiles[0].color : null;
    let isSameColor = true;
    if (runColor !== null) {
        for (let t of realTiles) {
            if (t.color !== runColor) { isSameColor = false; break; }
        }
    }

    if (isSameColor) {
        let values = realTiles.map(t => t.value).sort((a, b) => a - b);
        // Special: 1 can wrap after 13 (12,13,1)
        if (values.includes(1) && values.includes(13)) {
            values = values.map(v => v === 1 ? 14 : v).sort((a, b) => a - b);
        }
        let holes = 0;
        for (let i = 0; i < values.length - 1; i++) {
            if (values[i] === values[i + 1]) return false; // duplicate in run
            holes += (values[i + 1] - values[i] - 1);
        }
        if (holes <= okeyCount) return true;
    }

    return false;
}

// ═══════════════════════════════════════════════════════════
// دابەزین (DABEZEEEN) — LAYING DOWN LOGIC
// ═══════════════════════════════════════════════════════════

// Get the threshold for a player to lay down
// mode: 'standard' (81) or 'hard' (101)
// teammateHasLaidDown: if teammate already laid down, threshold is reduced by 20
export function getLayDownThreshold(mode, teammateHasLaidDown) {
    const base = mode === 'hard' ? 101 : 81;
    if (teammateHasLaidDown) return base - 20; // 61 for standard, 81 for hard
    return base;
}

// Calculate points ONLY from valid groups (3+ tiles forming a valid set or run).
// Unpaired / isolated / groups of 2 or invalid groups are IGNORED.
// This is the real Kurdish rule: only properly paired groups count.
export function calculateValidGroupPoints(slots, okeyObj) {
    const groups = extractGroups(slots);
    let totalPoints = 0;
    const validGroups = [];
    const invalidTiles = [];

    for (const g of groups) {
        if (g.length >= 3 && isValidGroup(g, okeyObj)) {
            // This group is valid — count its points
            totalPoints += calculateHandPoints(g);
            validGroups.push(g);
        } else {
            // Not a valid group — these tiles don't count
            invalidTiles.push(...g);
        }
    }

    return { totalPoints, validGroups, invalidTiles };
}

// Check if a player CAN lay down (دابەزین)
// IMPORTANT: Only tiles in valid groups of 3+ count toward the threshold.
// The player CAN have leftover tiles that aren't grouped — those just stay in hand.
// Returns: { canLayDown, totalPoints, validGroups, invalidTiles, threshold }
export function canLayDown(slots, okeyObj, mode, teammateHasLaidDown) {
    const { totalPoints, validGroups, invalidTiles } = calculateValidGroupPoints(slots, okeyObj);
    const threshold = getLayDownThreshold(mode, teammateHasLaidDown);

    // Must have at least one valid group
    if (validGroups.length === 0) {
        return { canLayDown: false, totalPoints: 0, validGroups: [], invalidTiles, threshold, reason: 'no_valid_groups' };
    }

    return {
        canLayDown: totalPoints >= threshold,
        totalPoints,
        groups: validGroups,
        validGroups,
        invalidTiles,
        threshold,
        reason: totalPoints < threshold ? 'insufficient_points' : 'ok'
    };
}

// ═══════════════════════════════════════════════════════════
// ADDING TO EXISTING LAID-DOWN SETS
// ═══════════════════════════════════════════════════════════

// Check if a tile can be added to an existing group on the table
export function canAddToGroup(existingGroup, newTile, okeyObj) {
    const extended = [...existingGroup, newTile];
    return isValidGroup(extended, okeyObj);
}

// ═══════════════════════════════════════════════════════════
// LEFT DISCARD RESTRICTION
// ═══════════════════════════════════════════════════════════

// Can the player pick from the left player's discard?
// ONLY if picking it allows immediate دابەزین
export function canPickLeftDiscard(rackSlots, leftDiscardTile, okeyObj, mode, teammateHasLaidDown) {
    if (!leftDiscardTile) return false;

    // Simulate adding the tile to the rack and check if we can lay down
    const emptyIndex = rackSlots.indexOf(null);
    if (emptyIndex === -1) return false;

    const testRack = [...rackSlots];
    testRack[emptyIndex] = leftDiscardTile;

    // Must be able to lay down immediately (all tiles form valid groups ≥ threshold)
    const result = canLayDown(testRack, okeyObj, mode, teammateHasLaidDown);
    return result.canLayDown;
}

// ═══════════════════════════════════════════════════════════
// کۆنکان (KONKAN) — SPECIAL WIN CONDITION
// ═══════════════════════════════════════════════════════════

// Check if a hand achieves کۆنکان:
// - All cards of a single color in ascending order
// - Exactly 4 cards remain separate
// - From those 4, player forms a valid group of 3, discards 1
export function checkKonkan(slots, okeyObj) {
    const tiles = slots.filter(t => t !== null && !t.isFake);
    if (tiles.length < 13) return { isKonkan: false };

    // Try each color
    for (const color of COLORS) {
        const colorTiles = tiles.filter(t => t.color === color);
        const otherTiles = tiles.filter(t => t.color !== color);
        const jokers = slots.filter(t => t !== null && t.isFake);

        // Need all 13 values of one color (or close with joker substitution)
        const colorValues = new Set(colorTiles.map(t => t.value));

        // Count missing values
        let missingCount = 0;
        for (let v = 1; v <= 13; v++) {
            if (!colorValues.has(v)) missingCount++;
        }

        // Jokers can fill missing spots
        const availableJokers = jokers.length;
        if (missingCount > availableJokers) continue;

        // Total tiles used for the sequence = colorTiles + jokers used
        const sequenceTiles = colorTiles.length + missingCount; // missingCount jokers used
        const remainingJokers = availableJokers - missingCount;

        // The remaining tiles (not part of the sequence) must be exactly 4
        const remainingTiles = [...otherTiles];
        // Add back remaining jokers
        for (let i = 0; i < remainingJokers; i++) {
            remainingTiles.push(jokers[i]);
        }

        // Also, if we have duplicate color tiles (from the 2nd set), they go to remaining
        const usedColorValues = new Set();
        const excessColorTiles = [];
        for (const t of colorTiles) {
            if (usedColorValues.has(t.value)) {
                excessColorTiles.push(t);
            } else {
                usedColorValues.add(t.value);
            }
        }

        const allRemaining = [...remainingTiles, ...excessColorTiles];

        if (allRemaining.length !== 4) continue;

        // From those 4, check if 3 can form a valid group
        for (let skip = 0; skip < 4; skip++) {
            const groupOf3 = allRemaining.filter((_, i) => i !== skip);
            if (isValidGroup(groupOf3, okeyObj)) {
                return {
                    isKonkan: true,
                    sequenceColor: color,
                    remainingTiles: allRemaining,
                    validGroup: groupOf3,
                    discardTile: allRemaining[skip]
                };
            }
        }
    }

    return { isKonkan: false };
}

// ═══════════════════════════════════════════════════════════
// HEURISTIC BOT AI — KURDISH VARIANT
// ═══════════════════════════════════════════════════════════

function getTileIsolationScore(tile, hand, okey) {
    if (tile.color === okey.color && tile.value === okey.value) return -100;
    if (tile.isFake) return -100;

    let score = 10;

    // Check for pairs/sets
    const sameValue = hand.filter(t => t.id !== tile.id && t.value === tile.value && t.color !== tile.color);
    if (sameValue.length > 0) score -= (sameValue.length * 4);

    // Check for runs
    const runs = hand.filter(t => t.id !== tile.id && t.color === tile.color && Math.abs(t.value - tile.value) <= 2);
    if (runs.length > 0) score -= (runs.length * 3);

    // Exact adjacent
    const exactAdj = hand.filter(t => t.id !== tile.id && t.color === tile.color && Math.abs(t.value - tile.value) === 1);
    if (exactAdj.length > 0) score -= 4;

    // In Kurdish variant, high-value tiles (1, 11-13 = 10pts) are more valuable for laying down
    const pts = getCardPoints(tile);
    if (pts === 10) score -= 2; // Slightly prefer keeping high-value tiles

    return score;
}

// Bot action: determines what a bot should do
// Returns: { wantsDiscard, discardIndex, wantsLayDown, wantsKonkan, layDownData, konkanData }
export function getBotAction(hand, leftDiscardTile, okey, gameState = {}) {
    const {
        mode = 'standard',
        teammateHasLaidDown = false,
        playerHasLaidDown = false,
        tableGroups = [],
    } = gameState;

    let wantsDiscard = false;

    // 1. Consider picking from left discard
    if (leftDiscardTile) {
        const isolationScore = getTileIsolationScore(leftDiscardTile, hand, okey);
        if (isolationScore < 4) {
            wantsDiscard = true;
        }
    }

    // 2. Find worst tile to discard
    let worstScore = -999;
    let worstIndex = 0;

    for (let i = 0; i < hand.length; i++) {
        const s = getTileIsolationScore(hand[i], hand, okey);
        if (s > worstScore) {
            worstScore = s;
            worstIndex = i;
        }
    }

    // 3. Check if bot can lay down (if not already done)
    let wantsLayDown = false;
    let layDownData = null;

    if (!playerHasLaidDown && hand.length >= 14) {
        // Simulate grouping: simple strategy — sort and group
        const sortedHand = [...hand].sort((a, b) => {
            if (a.color !== b.color) return a.color.localeCompare(b.color);
            return a.value - b.value;
        });

        // Try to form valid groups
        const testSlots = Array(22).fill(null);
        sortedHand.forEach((t, i) => { if (i < 22) testSlots[i] = t; });

        const result = canLayDown(testSlots, okey, mode, teammateHasLaidDown);
        if (result.canLayDown) {
            wantsLayDown = true;
            layDownData = result;
        }
    }

    // 4. Check for کۆنکان
    let wantsKonkan = false;
    let konkanData = null;

    if (!playerHasLaidDown && hand.length >= 14) {
        const testSlots = Array(22).fill(null);
        hand.forEach((t, i) => { if (i < 22) testSlots[i] = t; });

        const kResult = checkKonkan(testSlots, okey);
        if (kResult.isKonkan) {
            wantsKonkan = true;
            konkanData = kResult;
        }
    }

    return {
        wantsDiscard,
        discardIndex: worstIndex,
        wantsLayDown,
        wantsKonkan,
        layDownData,
        konkanData,
    };
}

// ═══════════════════════════════════════════════════════════
// SCORING HELPERS
// ═══════════════════════════════════════════════════════════

// Calculate penalty points for remaining tiles in hand (tiles not laid down)
export function calculatePenaltyPoints(remainingTiles) {
    return remainingTiles.reduce((sum, t) => sum + getCardPoints(t), 0);
}

// Check if a tile fits into an existing table group
export function findValidAdditions(handTile, tableGroups, okeyObj) {
    const validTargets = [];
    for (let i = 0; i < tableGroups.length; i++) {
        // Try adding at the end
        if (canAddToGroup(tableGroups[i], handTile, okeyObj)) {
            validTargets.push(i);
        }
    }
    return validTargets;
}
