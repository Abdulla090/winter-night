export const COLORS = ['yellow', 'blue', 'black', 'red'];

// Creates a full deck of 106 Okey tiles
export function createDeck() {
    let deck = [];
    let idCounter = 1;
    // Two sets of 1-13 in 4 colors
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

// Get the actual Okey tile based on indicator
export function getOkey(indicator) {
    if (indicator.isFake) return { color: 'fake', value: 0 }; // rare case
    const okeyValue = indicator.value === 13 ? 1 : indicator.value + 1;
    return { color: indicator.color, value: okeyValue };
}

// To evaluate a hand, we separate the hand into sets/runs. 
// A fast approximation for "did user group their hand correctly" is to let the user manually arrange them,
// but checking automatically is better. Since writing a full backtracking Okey AI solver is massive,
// we will verify manually grouped combinations!
// Groups: tiles in slots separated by empty slots.
export function validateGroups(slots, okeyObj) {
    const groups = [];
    let currentGroup = [];
    
    for (let i = 0; i < slots.length; i++) {
        // If a rack row wraps, treat it as a break
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

    // Check each group
    // A group must be >= 3 tiles.
    // It is either a SET (same value, different colors) or a RUN (same color, consecutive values, 12-13-1 is valid).
    for (const g of groups) {
        if (g.length < 3) return false;
        
        if (!isValidGroup(g, okeyObj)) {
            return false;
        }
    }

    return true; // All groups valid
}

function isValidGroup(group, okey) {
    // Basic solver handling the Okey (Joker)
    // Okeys can be any tile.
    const isTileOkey = (t) => t.color === okey.color && t.value === okey.value;
    
    // Convert Fake Joker to the Okey tile's properties
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

    // Try treating as SET (same number, diff colors)
    if (realTiles.length <= 4) { // Sets can be max 4 (one of each color)
        let isSet = true;
        let setVal = realTiles.length > 0 ? realTiles[0].value : null;
        let seenColors = new Set();
        
        if (setVal !== null) {
            for (let t of realTiles) {
                if (t.value !== setVal) { isSet = false; break; }
                if (seenColors.has(t.color)) { isSet = false; break; } // duplicate color
                seenColors.add(t.color);
            }
        }
        if (isSet) return true;
    }

    // Try treating as RUN (same color, consecutive)
    // Needs same color for all real tiles.
    let runColor = realTiles.length > 0 ? realTiles[0].color : null;
    let isSameColor = true;
    if (runColor !== null) {
        for (let t of realTiles) {
            if (t.color !== runColor) { isSameColor = false; break; }
        }
    }

    if (isSameColor) {
        // We simulate consecutive numbers. Since order matters in rack grouping, 
        // we check the sequence the user placed them in.
        let neededOkeys = 0;
        for (let i = 0; i < group.length - 1; i++) {
             // To support manual checking easily, if checking strictly left-to-right user placed sequence:
        }
        
        // Actually, to make the app "goated", we just check if it CAN form a valid run.
        let values = realTiles.map(t => t.value).sort((a,b)=>a-b);
        // Special case: 1 can be at the end (12,13,1)
        if (values.includes(1) && values.includes(13)) {
            // treat 1 as 14
            values = values.map(v => v === 1 ? 14 : v).sort((a,b)=>a-b);
        }
        
        let holes = 0;
        for (let i = 0; i < values.length - 1; i++) {
            if (values[i] === values[i+1]) return false; // duplicate value in run is invalid
            holes += (values[i+1] - values[i] - 1);
        }
        
        if (holes <= okeyCount) return true;
    }

    return false;
}

// ----------------------------------------------------
// HEURISTIC BOT AI FOR OKEY
// ----------------------------------------------------

// Calculate how isolated a tile is within a hand.
// An isolated tile has no matching values (for sets) and no nearby consecutive values (for runs).
function getTileIsolationScore(tile, hand, okey) {
    if (tile.color === okey.color && tile.value === okey.value) return -100; // Never discard Okey!
    if (tile.isFake) return -100; // Treat fake joker as valuable (it acts as okey)

    let score = 10; // Base score (higher = more isolated = better to discard)

    // Check for pairs/sets
    const sameValue = hand.filter(t => t.id !== tile.id && t.value === tile.value && t.color !== tile.color);
    if (sameValue.length > 0) score -= (sameValue.length * 4); // Very likely to form a set

    // Check for runs (same color, consecutive value +/- 2)
    const runs = hand.filter(t => t.id !== tile.id && t.color === tile.color && Math.abs(t.value - tile.value) <= 2);
    if (runs.length > 0) score -= (runs.length * 3); 

    // Look for EXACT adjacent
    const exactAdj = hand.filter(t => t.id !== tile.id && t.color === tile.color && Math.abs(t.value - tile.value) === 1);
    if (exactAdj.length > 0) score -= 4;

    return score;
}

// Determines the bot's move
// Returns: { wantsDiscard: boolean, discardTileIndex: number }
export function getBotAction(hand, leftDiscardTile, okey) {
    // 1. Will the left discard highly benefit the bot?
    let wantsDiscard = false;
    if (leftDiscardTile) {
        let tempHand = [...hand]; // test without knowing which we throw yet
        const isolationScore = getTileIsolationScore(leftDiscardTile, tempHand, okey);
        // If it's highly connected (score < 4), consider taking it!
        if (isolationScore < 4) {
            wantsDiscard = true;
        }
    }

    // 2. Decide what to discard from our CURRENT hand (assume we drew a tile)
    // The bot's hand length here will be 15 (after draw).
    let worstScore = -999;
    let worstIndex = 0;

    for (let i = 0; i < hand.length; i++) {
        const s = getTileIsolationScore(hand[i], hand, okey);
        if (s > worstScore) {
            worstScore = s;
            worstIndex = i;
        }
    }

    return {
        wantsDiscard,
        discardIndex: worstIndex
    };
}
