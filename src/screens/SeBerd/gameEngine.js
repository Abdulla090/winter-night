/**
 * سێ بەرد (Sê Berd) — Three Stones Game Engine
 * 
 * A traditional Kurdish strategy game similar to Three Men's Morris.
 * 
 * BOARD:
 * - 3×3 grid with 9 positions
 * - Lines connect positions orthogonally (up/down/left/right)
 * - Diagonal connections on corners
 * 
 * PHASES:
 * 1. PLACEMENT: Players alternate placing 3 stones each on empty positions
 * 2. MOVEMENT: Players alternate sliding stones to adjacent connected positions
 * 
 * WINNING:
 * - Get 3 stones in a row (horizontal, vertical, or diagonal)
 * - Opponent has no valid moves (blocked)
 * 
 * RULES:
 * - Each player has exactly 3 stones
 * - During placement, cannot place in center if it's your first move (optional variant)
 * - During movement, stones slide to adjacent connected positions only
 * - No jumping, no capturing
 */

// ==================== CONSTANTS ====================

export const EMPTY = 0;
export const PLAYER1 = 1; // Blue stones
export const PLAYER2 = 2; // Red stones

export const PHASE_PLACE = 'place';
export const PHASE_MOVE = 'move';

export const TOTAL_STONES = 3;

// Board positions (0-8):
// 0 | 1 | 2
// ---------
// 3 | 4 | 5
// ---------
// 6 | 7 | 8

// Adjacency map — which positions are connected
// Includes orthogonal + diagonal connections (full connectivity)
const ADJACENCY = {
    0: [1, 3, 4],
    1: [0, 2, 4],
    2: [1, 4, 5],
    3: [0, 4, 6],
    4: [0, 1, 2, 3, 5, 6, 7, 8], // Center connects to all
    5: [2, 4, 8],
    6: [3, 4, 7],
    7: [4, 6, 8],
    8: [4, 5, 7],
};

// All winning lines (3 in a row)
const WINNING_LINES = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonals
    [0, 4, 8],
    [2, 4, 6],
];

// ==================== GAME STATE ====================

/**
 * Create initial game state
 */
export function createInitialState() {
    return {
        board: Array(9).fill(EMPTY),
        currentPlayer: PLAYER1,
        phase: PHASE_PLACE,
        placedCount: { [PLAYER1]: 0, [PLAYER2]: 0 },
        winner: null,
        gameOver: false,
        lastMove: null,
        moveCount: 0,
    };
}

/**
 * Deep clone state
 */
export function cloneState(state) {
    return {
        board: [...state.board],
        currentPlayer: state.currentPlayer,
        phase: state.phase,
        placedCount: { ...state.placedCount },
        winner: state.winner,
        gameOver: state.gameOver,
        lastMove: state.lastMove,
        moveCount: state.moveCount,
    };
}

// ==================== HELPERS ====================

/**
 * Check if a player has won (3 in a row)
 */
export function checkWinner(board) {
    for (const line of WINNING_LINES) {
        const [a, b, c] = line;
        if (board[a] !== EMPTY && board[a] === board[b] && board[b] === board[c]) {
            return { winner: board[a], line };
        }
    }
    return null;
}

/**
 * Get all positions occupied by a player
 */
export function getPlayerPositions(board, player) {
    const positions = [];
    for (let i = 0; i < 9; i++) {
        if (board[i] === player) positions.push(i);
    }
    return positions;
}

/**
 * Check if a position is adjacent to another
 */
export function isAdjacent(from, to) {
    return ADJACENCY[from].includes(to);
}

/**
 * Get adjacent empty positions from a position
 */
export function getAdjacentEmpty(board, pos) {
    return ADJACENCY[pos].filter(adj => board[adj] === EMPTY);
}

// ==================== MOVE GENERATION ====================

/**
 * Get all valid moves for current player
 * In PLACE phase: all empty positions
 * In MOVE phase: all slides from own stones to adjacent empty positions
 */
export function getValidMoves(state) {
    const { board, currentPlayer, phase } = state;
    const moves = [];

    if (phase === PHASE_PLACE) {
        // Can place on any empty position
        for (let i = 0; i < 9; i++) {
            if (board[i] === EMPTY) {
                moves.push({ type: 'place', to: i });
            }
        }
    } else {
        // Move phase: slide to adjacent empty
        const positions = getPlayerPositions(board, currentPlayer);
        for (const from of positions) {
            const adjacent = getAdjacentEmpty(board, from);
            for (const to of adjacent) {
                moves.push({ type: 'move', from, to });
            }
        }
    }

    return moves;
}

/**
 * Get valid moves for a specific stone position (move phase)
 */
export function getMovesForStone(state, pos) {
    if (state.phase !== PHASE_MOVE) return [];
    if (state.board[pos] !== state.currentPlayer) return [];

    return getAdjacentEmpty(state.board, pos).map(to => ({
        type: 'move', from: pos, to,
    }));
}

/**
 * Check if player has any valid moves
 */
export function hasValidMoves(state) {
    return getValidMoves(state).length > 0;
}

// ==================== MOVE EXECUTION ====================

/**
 * Apply a move and return new state
 */
export function applyMove(state, move) {
    const newState = cloneState(state);
    const { currentPlayer } = newState;

    if (move.type === 'place') {
        // Place stone
        newState.board[move.to] = currentPlayer;
        newState.placedCount[currentPlayer]++;

        // Check if placement phase is done (both players placed 3)
        if (newState.placedCount[PLAYER1] >= TOTAL_STONES && 
            newState.placedCount[PLAYER2] >= TOTAL_STONES) {
            newState.phase = PHASE_MOVE;
        }
    } else {
        // Move stone
        newState.board[move.from] = EMPTY;
        newState.board[move.to] = currentPlayer;
    }

    newState.lastMove = move;
    newState.moveCount++;

    // Check for winner
    const result = checkWinner(newState.board);
    if (result) {
        newState.winner = result.winner;
        newState.gameOver = true;
        newState.winningLine = result.line;
        return newState;
    }

    // Switch player
    const nextPlayer = currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1;
    newState.currentPlayer = nextPlayer;

    // Check if next player has no moves (in move phase)
    if (newState.phase === PHASE_MOVE) {
        const nextMoves = getValidMoves(newState);
        if (nextMoves.length === 0) {
            // Current player wins since next player is blocked
            newState.winner = currentPlayer;
            newState.gameOver = true;
        }
    }

    return newState;
}

// ==================== POSITION COORDINATES ====================

/**
 * Get the visual (x, y) position for each board position
 * Returns normalized coordinates (0-1 range)
 * This is used by the UI to render the positions
 */
export function getPositionCoords() {
    return {
        0: { x: 0, y: 0 },
        1: { x: 0.5, y: 0 },
        2: { x: 1, y: 0 },
        3: { x: 0, y: 0.5 },
        4: { x: 0.5, y: 0.5 },
        5: { x: 1, y: 0.5 },
        6: { x: 0, y: 1 },
        7: { x: 0.5, y: 1 },
        8: { x: 1, y: 1 },
    };
}

/**
 * Get the lines to draw on the board (connections between positions)
 */
export function getBoardLines() {
    const lines = [];
    const drawn = new Set();

    for (const [pos, neighbors] of Object.entries(ADJACENCY)) {
        for (const neighbor of neighbors) {
            const key = [Math.min(pos, neighbor), Math.max(pos, neighbor)].join('-');
            if (!drawn.has(key)) {
                drawn.add(key);
                lines.push([parseInt(pos), neighbor]);
            }
        }
    }

    return lines;
}

/**
 * Get the winning line positions (for animation)
 */
export function getWinningLine(state) {
    if (!state.gameOver || !state.winningLine) return null;
    return state.winningLine;
}
