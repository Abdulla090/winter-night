/**
 * شەش بەش (Shesh Besh) — Kurdish Backgammon Engine
 * 
 * BOARD:
 * - 24 points (triangles), numbered 0-23
 * - Player 1 (White) moves from point 23 → 0 (home: 0-5)
 * - Player 2 (Black) moves from point 0 → 23 (home: 18-23)
 * - Bar: captured pieces waiting to re-enter
 * - BorneOff: pieces successfully removed from the board
 * 
 * RULES:
 * - Roll 2 dice each turn; doubles = 4 moves
 * - Must use both dice values if possible
 * - Landing on a single opponent piece ("blot") sends it to the bar
 * - Must re-enter from bar before any other move
 * - Bear off only when ALL pieces are in home board
 * - First to bear off all 15 pieces wins
 * - Gammon: opponent hasn't borne off any = double win
 * - Backgammon: opponent still has pieces in winner's home or on bar = triple win
 */

// ==================== CONSTANTS ====================

export const PLAYER1 = 1; // White — moves 23 → 0
export const PLAYER2 = 2; // Black — moves 0 → 23

export const TOTAL_CHECKERS = 15;

// ==================== INITIAL STATE ====================

/**
 * Creates the initial game state
 * Standard backgammon starting position
 */
export function createInitialState() {
    // Initialize empty board (24 points)
    const points = Array(24).fill(null).map(() => ({ count: 0, player: 0 }));
    
    // Standard starting positions
    // Player 1 (White, moves toward point 0)
    points[23] = { count: 2, player: 1 };
    points[12] = { count: 5, player: 1 };
    points[7]  = { count: 3, player: 1 };
    points[5]  = { count: 5, player: 1 };
    
    // Player 2 (Black, moves toward point 23)
    points[0]  = { count: 2, player: 2 };
    points[11] = { count: 5, player: 2 };
    points[16] = { count: 3, player: 2 };
    points[18] = { count: 5, player: 2 };
    
    return {
        points,
        bar: { 1: 0, 2: 0 },
        borneOff: { 1: 0, 2: 0 },
        currentPlayer: 1,
        dice: [],
        remainingMoves: [],
        gameOver: false,
        winner: null,
        winType: null, // 'normal', 'gammon', 'backgammon'
    };
}

// ==================== HELPERS ====================

/**
 * Deep clone the game state
 */
export function cloneState(state) {
    return {
        points: state.points.map(p => ({ ...p })),
        bar: { ...state.bar },
        borneOff: { ...state.borneOff },
        currentPlayer: state.currentPlayer,
        dice: [...state.dice],
        remainingMoves: [...state.remainingMoves],
        gameOver: state.gameOver,
        winner: state.winner,
        winType: state.winType,
    };
}

/**
 * Get direction of movement for a player
 * Player 1: decreasing (23 → 0)
 * Player 2: increasing (0 → 23)
 */
function moveDirection(player) {
    return player === 1 ? -1 : 1;
}

/**
 * Get the home board range for a player (6 points)
 * Player 1: points 0-5
 * Player 2: points 18-23
 */
function homeBoard(player) {
    return player === 1 
        ? { start: 0, end: 5 } 
        : { start: 18, end: 23 };
}

/**
 * Get the entry point range for re-entering from bar
 * Player 1 enters at opponent's home (points 18-23)
 * Player 2 enters at opponent's home (points 0-5)
 */
function entryRange(player) {
    return player === 1 
        ? { start: 18, end: 23 }  // Enter at top
        : { start: 0, end: 5 };   // Enter at bottom
}

/**
 * Get the destination point when moving from a point by a dice value
 * Returns -1 if bearing off, or null if out of bounds / invalid
 */
function getDestination(fromPoint, diceValue, player) {
    const dir = moveDirection(player);
    const dest = fromPoint + (dir * diceValue);
    
    if (player === 1) {
        if (dest < 0) return -1; // Bearing off
        if (dest > 23) return null; // Invalid
    } else {
        if (dest > 23) return -1; // Bearing off
        if (dest < 0) return null; // Invalid
    }
    
    return dest;
}

/**
 * Get the entry point index for a specific dice value
 * Player 1 enters from opponent's home (23 - dice + 1) = entry at high points
 * Player 2 enters at low points (dice - 1)
 */
function getEntryPoint(diceValue, player) {
    if (player === 1) {
        return 24 - diceValue; // dice 1 → point 23, dice 6 → point 18
    } else {
        return diceValue - 1;  // dice 1 → point 0, dice 6 → point 5
    }
}

/**
 * Check if a point is safe to land on for a player
 * Can land if: empty, own pieces, or exactly 1 opponent piece (hit)
 */
function canLandOn(point, player) {
    if (point.count === 0) return true;
    if (point.player === player) return true;
    if (point.player !== player && point.count === 1) return true; // Can hit
    return false;
}

/**
 * Check if ALL pieces are in the home board (prerequisite for bearing off)
 */
export function allInHome(state, player) {
    // Check bar
    if (state.bar[player] > 0) return false;
    
    const home = homeBoard(player);
    
    // Check all points outside home board
    for (let i = 0; i < 24; i++) {
        if (i >= home.start && i <= home.end) continue;
        if (state.points[i].player === player && state.points[i].count > 0) {
            return false;
        }
    }
    
    return true;
}

/**
 * Check if a bearing off move is valid
 * Must be in home board; dice must exactly match or be higher than the farthest piece
 */
function canBearOff(state, fromPoint, diceValue, player) {
    if (!allInHome(state, player)) return false;
    
    const home = homeBoard(player);
    const dest = getDestination(fromPoint, diceValue, player);
    
    // Exact bear off
    if (dest === -1) return true;
    
    // If dest is negative (past the board), check if this is the farthest piece
    if (dest === null || (player === 1 && dest < 0) || (player === 2 && dest > 23)) {
        // Can only bear off with higher dice if no pieces on farther points
        if (player === 1) {
            // Check if there are pieces on points higher than fromPoint within home
            for (let i = fromPoint + 1; i <= home.end; i++) {
                if (state.points[i].player === player && state.points[i].count > 0) {
                    return false; // There are pieces farther from bearing off
                }
            }
            return true;
        } else {
            // Check if there are pieces on points lower than fromPoint within home
            for (let i = home.start; i < fromPoint; i++) {
                if (state.points[i].player === player && state.points[i].count > 0) {
                    return false;
                }
            }
            return true;
        }
    }
    
    return false;
}

// ==================== DICE ====================

/**
 * Roll two dice (1-6 each)
 */
export function rollDice() {
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    return [d1, d2];
}

/**
 * Get the remaining moves from a dice roll
 * Doubles give 4 moves of the same value
 */
export function getRemainingMoves(dice) {
    if (dice[0] === dice[1]) {
        return [dice[0], dice[0], dice[0], dice[0]]; // Doubles = 4 moves
    }
    return [...dice];
}

// ==================== MOVE GENERATION ====================

/**
 * Get all valid moves for the current player given remaining dice values
 */
export function getValidMoves(state) {
    const player = state.currentPlayer;
    const moves = [];
    
    // Get unique remaining dice values to avoid duplicate moves
    const uniqueDice = [...new Set(state.remainingMoves)];
    
    // If pieces on bar, MUST enter them first
    if (state.bar[player] > 0) {
        for (const diceVal of uniqueDice) {
            const entryPoint = getEntryPoint(diceVal, player);
            if (canLandOn(state.points[entryPoint], player)) {
                moves.push({
                    type: 'enter',
                    from: 'bar',
                    to: entryPoint,
                    diceUsed: diceVal,
                    isHit: state.points[entryPoint].player !== player && state.points[entryPoint].count === 1,
                });
            }
        }
        return moves; // Can't do anything else until bar is cleared
    }
    
    // Normal moves and bearing off
    for (const diceVal of uniqueDice) {
        for (let i = 0; i < 24; i++) {
            if (state.points[i].player !== player || state.points[i].count === 0) continue;
            
            const dest = getDestination(i, diceVal, player);
            
            if (dest === null) continue;
            
            if (dest === -1) {
                // Bearing off
                if (canBearOff(state, i, diceVal, player)) {
                    moves.push({
                        type: 'bearoff',
                        from: i,
                        to: 'off',
                        diceUsed: diceVal,
                        isHit: false,
                    });
                }
            } else if (dest >= 0 && dest <= 23) {
                // Normal move
                if (canLandOn(state.points[dest], player)) {
                    moves.push({
                        type: 'move',
                        from: i,
                        to: dest,
                        diceUsed: diceVal,
                        isHit: state.points[dest].player !== player && state.points[dest].count === 1,
                    });
                }
            }
        }
    }
    
    return moves;
}

/**
 * Check if player has any valid moves
 */
export function hasValidMoves(state) {
    return getValidMoves(state).length > 0;
}

// ==================== MOVE EXECUTION ====================

/**
 * Apply a move to the game state
 * Returns new state
 */
export function applyMove(state, move) {
    const newState = cloneState(state);
    const player = newState.currentPlayer;
    const opp = player === 1 ? 2 : 1;
    
    if (move.type === 'enter') {
        // Remove from bar
        newState.bar[player]--;
        
        // Hit opponent if present
        if (move.isHit) {
            newState.points[move.to].count = 0;
            newState.points[move.to].player = 0;
            newState.bar[opp]++;
        }
        
        // Place on entry point
        newState.points[move.to].count++;
        newState.points[move.to].player = player;
        
    } else if (move.type === 'bearoff') {
        // Remove from point
        newState.points[move.from].count--;
        if (newState.points[move.from].count === 0) {
            newState.points[move.from].player = 0;
        }
        
        // Add to borne off
        newState.borneOff[player]++;
        
    } else if (move.type === 'move') {
        // Remove from source
        newState.points[move.from].count--;
        if (newState.points[move.from].count === 0) {
            newState.points[move.from].player = 0;
        }
        
        // Hit opponent if present
        if (move.isHit) {
            newState.points[move.to].count = 0;
            newState.points[move.to].player = 0;
            newState.bar[opp]++;
        }
        
        // Place on destination
        newState.points[move.to].count++;
        newState.points[move.to].player = player;
    }
    
    // Remove used dice value
    const diceIdx = newState.remainingMoves.indexOf(move.diceUsed);
    if (diceIdx !== -1) {
        newState.remainingMoves.splice(diceIdx, 1);
    }
    
    // Check for win
    if (newState.borneOff[player] >= TOTAL_CHECKERS) {
        newState.gameOver = true;
        newState.winner = player;
        
        // Determine win type
        if (newState.borneOff[opp] === 0) {
            // Check for backgammon (opponent has pieces in winner's home or on bar)
            const winnerHome = homeBoard(player);
            let oppInWinnerHome = newState.bar[opp] > 0;
            for (let i = winnerHome.start; i <= winnerHome.end; i++) {
                if (newState.points[i].player === opp && newState.points[i].count > 0) {
                    oppInWinnerHome = true;
                    break;
                }
            }
            newState.winType = oppInWinnerHome ? 'backgammon' : 'gammon';
        } else {
            newState.winType = 'normal';
        }
    }
    
    return newState;
}

// ==================== TURN MANAGEMENT ====================

/**
 * Start a new turn: roll dice and set up remaining moves
 */
export function startTurn(state) {
    const newState = cloneState(state);
    const dice = rollDice();
    newState.dice = dice;
    newState.remainingMoves = getRemainingMoves(dice);
    return newState;
}

/**
 * End the current turn and switch to the other player
 */
export function endTurn(state) {
    const newState = cloneState(state);
    newState.currentPlayer = newState.currentPlayer === 1 ? 2 : 1;
    newState.dice = [];
    newState.remainingMoves = [];
    return newState;
}

/**
 * Check if the current turn is over
 * (no remaining moves or no valid moves)
 */
export function isTurnOver(state) {
    if (state.remainingMoves.length === 0) return true;
    if (!hasValidMoves(state)) return true;
    return false;
}

// ==================== SCORING ====================

/**
 * Count pieces on the board, bar, and borne off for both players
 */
export function getPlayerStats(state) {
    const stats = {
        1: { onBoard: 0, onBar: state.bar[1], borneOff: state.borneOff[1], pips: 0 },
        2: { onBoard: 0, onBar: state.bar[2], borneOff: state.borneOff[2], pips: 0 },
    };
    
    for (let i = 0; i < 24; i++) {
        const p = state.points[i];
        if (p.player === 1 && p.count > 0) {
            stats[1].onBoard += p.count;
            stats[1].pips += p.count * (i + 1); // Distance to bearing off
        }
        if (p.player === 2 && p.count > 0) {
            stats[2].onBoard += p.count;
            stats[2].pips += p.count * (24 - i); // Distance to bearing off
        }
    }
    
    // Bar pips (25 pips from home for pieces on bar)
    stats[1].pips += stats[1].onBar * 25;
    stats[2].pips += stats[2].onBar * 25;
    
    return stats;
}

/**
 * Get pip count for display
 */
export function getPipCount(state, player) {
    const stats = getPlayerStats(state);
    return stats[player].pips;
}

// ==================== INITIAL DICE ROLL ====================

/**
 * Roll for first turn - higher roll goes first
 * Returns { player1Die, player2Die, firstPlayer }
 */
export function rollForFirst() {
    let d1, d2;
    do {
        d1 = Math.floor(Math.random() * 6) + 1;
        d2 = Math.floor(Math.random() * 6) + 1;
    } while (d1 === d2); // Re-roll ties
    
    return {
        player1Die: d1,
        player2Die: d2,
        firstPlayer: d1 > d2 ? 1 : 2,
        dice: d1 > d2 ? [d1, d2] : [d2, d1],
    };
}
