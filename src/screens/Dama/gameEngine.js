/**
 * Kurdish Dama (دامە) — Complete Game Engine
 * 
 * 8×8 board, all 64 squares used
 * Orthogonal movement (up, down, left, right)
 * 
 * MOVEMENT RULES:
 * - Regular pieces move FORWARD and SIDEWAYS only (never backward!)
 *   Player 1 (bottom): up + left/right
 *   Player 2 (top): down + left/right
 * - Kings slide any number of squares in ALL 4 orthogonal directions
 * 
 * CAPTURE RULES:
 * - Capturing is mandatory — if any capture exists, must capture
 * - NO majority rule — player can choose which capture to take
 *   (can capture 1, 2, or 3 even if more are available)
 * - Regular pieces can capture in ALL 4 directions (including backward)
 * - Multi-capture: after landing, if another capture is available, continue
 * 
 * SPECIAL:
 * - Swar (سوار): moving adjacent to opponent forces them to capture
 * - King promotion on reaching opponent's back row
 * - If promoted mid-capture, continues as King
 */

// Cell states
export const EMPTY = 0;
export const PLAYER1 = 1;       // Bottom player (white pieces) — moves UP
export const PLAYER2 = 2;       // Top player (black pieces) — moves DOWN
export const PLAYER1_KING = 3;
export const PLAYER2_KING = 4;

// All 4 orthogonal directions
const ALL_DIRECTIONS = [
    { dr: -1, dc: 0 },  // up
    { dr: 1, dc: 0 },   // down
    { dr: 0, dc: -1 },  // left
    { dr: 0, dc: 1 },   // right
];

/**
 * Get movement directions for a regular piece (forward + sideways only)
 * Player 1 is at bottom (rows 6-7), moves UP (dr = -1) + sideways
 * Player 2 is at top (rows 0-1), moves DOWN (dr = 1) + sideways
 */
function getRegularMoveDirections(owner) {
    if (owner === 1) {
        // Player 1 moves UP and sideways (never down/backward)
        return [
            { dr: -1, dc: 0 },  // up (forward)
            { dr: 0, dc: -1 },  // left (sideways)
            { dr: 0, dc: 1 },   // right (sideways)
        ];
    } else {
        // Player 2 moves DOWN and sideways (never up/backward)
        return [
            { dr: 1, dc: 0 },   // down (forward)
            { dr: 0, dc: -1 },  // left (sideways)
            { dr: 0, dc: 1 },   // right (sideways)
        ];
    }
}

/**
 * Creates the initial board state
 * Player 1 (bottom) fills rows 6-7, Player 2 (top) fills rows 0-1
 */
export function createInitialBoard() {
    const board = Array(8).fill(null).map(() => Array(8).fill(EMPTY));
    
    // Player 2 (top) — rows 0-1
    for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 8; c++) {
            board[r][c] = PLAYER2;
        }
    }
    
    // Player 1 (bottom) — rows 6-7
    for (let r = 6; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            board[r][c] = PLAYER1;
        }
    }
    
    return board;
}

/**
 * Returns the owner of a piece (1 or 2), or 0 if empty
 */
export function getOwner(cell) {
    if (cell === PLAYER1 || cell === PLAYER1_KING) return 1;
    if (cell === PLAYER2 || cell === PLAYER2_KING) return 2;
    return 0;
}

/**
 * Check if piece is a king
 */
export function isKing(cell) {
    return cell === PLAYER1_KING || cell === PLAYER2_KING;
}

/**
 * Check if position is within board bounds
 */
function inBounds(r, c) {
    return r >= 0 && r < 8 && c >= 0 && c < 8;
}

/**
 * Get opponent player number
 */
function opponent(player) {
    return player === 1 ? 2 : 1;
}

/**
 * Find all regular (non-capture) moves for a piece at (r, c)
 * Regular pieces: forward + sideways ONLY (no backward)
 * Kings: all 4 directions, any distance
 */
function getRegularMoves(board, r, c) {
    const cell = board[r][c];
    const owner = getOwner(cell);
    const moves = [];
    
    if (isKing(cell)) {
        // King slides orthogonally any number of squares in ALL directions
        for (const { dr, dc } of ALL_DIRECTIONS) {
            let nr = r + dr;
            let nc = c + dc;
            while (inBounds(nr, nc) && board[nr][nc] === EMPTY) {
                moves.push({ from: { r, c }, to: { r: nr, c: nc }, captures: [] });
                nr += dr;
                nc += dc;
            }
        }
    } else {
        // Regular piece: 1 square, forward + sideways only (NO backward)
        const directions = getRegularMoveDirections(owner);
        for (const { dr, dc } of directions) {
            const nr = r + dr;
            const nc = c + dc;
            if (inBounds(nr, nc) && board[nr][nc] === EMPTY) {
                moves.push({ from: { r, c }, to: { r: nr, c: nc }, captures: [] });
            }
        }
    }
    
    return moves;
}

/**
 * Find all capture sequences for a piece at (r, c)
 * 
 * IMPORTANT: Regular pieces CAN capture in ALL 4 directions (including backward)
 * but can only MOVE forward + sideways.
 * 
 * Returns arrays of capture chains (multi-captures).
 * Each individual capture in the chain is also returned as a valid move,
 * so the player can choose to stop after 1, 2, or 3 captures.
 */
function getCaptureSequences(board, r, c, alreadyCaptured = [], isPromoted = false) {
    const cell = board[r][c];
    const owner = getOwner(cell);
    const opp = opponent(owner);
    const pieceIsKing = isKing(cell) || isPromoted;
    const sequences = [];
    
    if (pieceIsKing) {
        // King capture: slide over one opponent piece, land on any empty beyond
        for (const { dr, dc } of ALL_DIRECTIONS) {
            let scanR = r + dr;
            let scanC = c + dc;
            let foundOpponent = null;
            
            // Slide until we hit something
            while (inBounds(scanR, scanC)) {
                const scanCell = board[scanR][scanC];
                
                if (scanCell !== EMPTY) {
                    // Check if it's an opponent piece
                    if (getOwner(scanCell) === opp && 
                        !alreadyCaptured.some(cap => cap.r === scanR && cap.c === scanC)) {
                        if (foundOpponent === null) {
                            foundOpponent = { r: scanR, c: scanC };
                        } else {
                            // Two opponent pieces in a row — can't jump
                            break;
                        }
                    } else {
                        // Own piece or already captured — blocked
                        break;
                    }
                    scanR += dr;
                    scanC += dc;
                    continue;
                }
                
                // Empty square
                if (foundOpponent) {
                    // We can land here after capturing
                    const landR = scanR;
                    const landC = scanC;
                    const newCaptured = [...alreadyCaptured, foundOpponent];
                    
                    // THIS single capture is valid on its own (player can stop here)
                    sequences.push({
                        from: { r, c },
                        to: { r: landR, c: landC },
                        captures: [foundOpponent],
                        path: [{ r: landR, c: landC }],
                    });
                    
                    // Also try to continue capturing from new position
                    const savedFrom = board[r][c];
                    const savedOpp = board[foundOpponent.r][foundOpponent.c];
                    board[r][c] = EMPTY;
                    board[foundOpponent.r][foundOpponent.c] = EMPTY;
                    board[landR][landC] = pieceIsKing ? 
                        (owner === 1 ? PLAYER1_KING : PLAYER2_KING) : savedFrom;
                    
                    const continuations = getCaptureSequences(board, landR, landC, newCaptured, pieceIsKing);
                    
                    // Restore board
                    board[r][c] = savedFrom;
                    board[foundOpponent.r][foundOpponent.c] = savedOpp;
                    board[landR][landC] = EMPTY;
                    
                    // Add multi-capture continuations
                    for (const cont of continuations) {
                        sequences.push({
                            from: { r, c },
                            to: cont.to,
                            captures: [foundOpponent, ...cont.captures],
                            path: [{ r: landR, c: landC }, ...cont.path],
                        });
                    }
                }
                
                scanR += dr;
                scanC += dc;
            }
        }
    } else {
        // Regular piece capture: jump adjacent opponent piece, land on empty behind
        // *** Captures can go in ALL 4 directions (including backward!) ***
        for (const { dr, dc } of ALL_DIRECTIONS) {
            const midR = r + dr;
            const midC = c + dc;
            const landR = r + 2 * dr;
            const landC = c + 2 * dc;
            
            if (!inBounds(midR, midC) || !inBounds(landR, landC)) continue;
            
            const midCell = board[midR][midC];
            if (getOwner(midCell) !== opp) continue;
            if (alreadyCaptured.some(cap => cap.r === midR && cap.c === midC)) continue;
            if (board[landR][landC] !== EMPTY) continue;
            
            const captured = { r: midR, c: midC };
            const newCaptured = [...alreadyCaptured, captured];
            
            // Check for promotion during multi-capture
            const promotionRow = owner === 1 ? 0 : 7;
            const willPromote = landR === promotionRow;
            
            // THIS single capture is valid on its own (player can stop here)
            sequences.push({
                from: { r, c },
                to: { r: landR, c: landC },
                captures: [captured],
                path: [{ r: landR, c: landC }],
            });
            
            // Also try to continue capturing from landing position
            const savedFrom = board[r][c];
            const savedMid = board[midR][midC];
            board[r][c] = EMPTY;
            board[midR][midC] = EMPTY;
            
            if (willPromote) {
                board[landR][landC] = owner === 1 ? PLAYER1_KING : PLAYER2_KING;
            } else {
                board[landR][landC] = savedFrom;
            }
            
            const continuations = getCaptureSequences(
                board, landR, landC, newCaptured, willPromote
            );
            
            // Restore board
            board[r][c] = savedFrom;
            board[midR][midC] = savedMid;
            board[landR][landC] = EMPTY;
            
            // Add multi-capture continuations
            for (const cont of continuations) {
                sequences.push({
                    from: { r, c },
                    to: cont.to,
                    captures: [captured, ...cont.captures],
                    path: [{ r: landR, c: landC }, ...cont.path],
                });
            }
        }
    }
    
    return sequences;
}

/**
 * Get all legal moves for a player
 * 
 * Rules:
 * - Capturing is mandatory: if any capture is available, must capture
 * - NO majority rule: player can choose ANY capture path
 *   (can capture 1 piece even if 3 are capturable)
 */
export function getAllLegalMoves(board, player) {
    const allCaptures = [];
    const allMoves = [];
    
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (getOwner(board[r][c]) !== player) continue;
            
            const captures = getCaptureSequences(board, r, c);
            allCaptures.push(...captures);
            
            const moves = getRegularMoves(board, r, c);
            allMoves.push(...moves);
        }
    }
    
    // Mandatory capture: if captures exist, must capture (but can choose which one)
    // NO majority rule — all capture options are valid
    if (allCaptures.length > 0) {
        return allCaptures;
    }
    
    return allMoves;
}

/**
 * Get legal moves for a specific piece
 * Takes into account mandatory capture
 */
export function getLegalMovesForPiece(board, r, c) {
    const player = getOwner(board[r][c]);
    if (player === 0) return [];
    
    const allLegal = getAllLegalMoves(board, player);
    return allLegal.filter(m => m.from.r === r && m.from.c === c);
}

/**
 * Apply a move to the board, returns new board state
 * Also handles king promotion
 */
export function applyMove(board, move) {
    const newBoard = board.map(row => [...row]);
    const piece = newBoard[move.from.r][move.from.c];
    const owner = getOwner(piece);
    
    // Remove piece from origin
    newBoard[move.from.r][move.from.c] = EMPTY;
    
    // Remove all captured pieces
    for (const cap of move.captures) {
        newBoard[cap.r][cap.c] = EMPTY;
    }
    
    // Place piece at destination
    const promotionRow = owner === 1 ? 0 : 7;
    if (move.to.r === promotionRow && !isKing(piece)) {
        // Promote to king
        newBoard[move.to.r][move.to.c] = owner === 1 ? PLAYER1_KING : PLAYER2_KING;
    } else {
        newBoard[move.to.r][move.to.c] = piece;
    }
    
    return newBoard;
}

/**
 * Check game end conditions
 * Returns: null (game continues), 1 (player1 wins), 2 (player2 wins), 'draw'
 */
export function checkGameEnd(board, currentPlayer) {
    let p1Pieces = 0;
    let p2Pieces = 0;
    
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const owner = getOwner(board[r][c]);
            if (owner === 1) p1Pieces++;
            if (owner === 2) p2Pieces++;
        }
    }
    
    // No pieces left = other player wins
    if (p1Pieces === 0) return 2;
    if (p2Pieces === 0) return 1;
    
    // No legal moves = current player loses
    const legalMoves = getAllLegalMoves(board, currentPlayer);
    if (legalMoves.length === 0) {
        return currentPlayer === 1 ? 2 : 1;
    }
    
    return null; // Game continues
}

/**
 * Count pieces for each player
 */
export function countPieces(board) {
    let p1 = 0, p2 = 0, p1Kings = 0, p2Kings = 0;
    
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const cell = board[r][c];
            if (cell === PLAYER1) p1++;
            else if (cell === PLAYER2) p2++;
            else if (cell === PLAYER1_KING) { p1++; p1Kings++; }
            else if (cell === PLAYER2_KING) { p2++; p2Kings++; }
        }
    }
    
    return { p1, p2, p1Kings, p2Kings };
}

/**
 * Check for Swar (سوار) condition
 * After a player moves a piece adjacent to an opponent piece,
 * that piece is declared Swar — the opponent MUST capture it on their next turn
 */
export function checkSwar(board, lastMove, currentPlayer) {
    if (!lastMove) return null;
    
    const { to } = lastMove;
    const opp = opponent(currentPlayer);
    const swarPieces = [];
    
    // Check all 4 orthogonal directions from the piece that just moved
    for (const { dr, dc } of ALL_DIRECTIONS) {
        const adjR = to.r + dr;
        const adjC = to.c + dc;
        
        if (inBounds(adjR, adjC) && getOwner(board[adjR][adjC]) === opp) {
            // The moved piece is adjacent to an opponent piece — it's Swar!
            swarPieces.push({ r: to.r, c: to.c });
            break;
        }
    }
    
    return swarPieces.length > 0 ? swarPieces : null;
}

/**
 * Get pieces that have mandatory capture targets (for highlighting)
 */
export function getPiecesWithCaptures(board, player) {
    const pieces = [];
    
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (getOwner(board[r][c]) !== player) continue;
            const captures = getCaptureSequences(board, r, c);
            if (captures.length > 0) {
                pieces.push({ r, c });
            }
        }
    }
    
    return pieces;
}
