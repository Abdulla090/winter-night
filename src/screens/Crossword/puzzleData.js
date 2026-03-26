/**
 * Crossword Puzzle Data & Engine
 * Supports both English (LTR) and Kurdish Sorani (RTL) puzzles.
 * 
 * For RTL puzzles (Kurdish):
 *  - "across" words go RIGHT-TO-LEFT
 *  - `col` is the RIGHTMOST starting column for across words
 *  - "down" words still go top-to-bottom
 * 
 * Grid cells:
 *  - null = black blocker
 *  - { letter, number, userInput, acrossWord, downWord, ... } = white cell
 */

// ───────── ENGLISH PUZZLES (LTR) ─────────
const ENGLISH_PUZZLES = [
    {
        id: 'en_1',
        title: 'General Knowledge',
        size: 10,
        rtl: false,
        words: [
            // Across (LTR: col is leftmost, letters go right)
            { word: 'PLANET', clue: 'Earth is one of these', row: 0, col: 0, direction: 'across', number: 1 },
            { word: 'RIVER', clue: 'Flows to the sea', row: 2, col: 0, direction: 'across', number: 3 },
            { word: 'TIGER', clue: 'Striped big cat', row: 2, col: 5, direction: 'across', number: 4 },
            { word: 'APPLE', clue: 'A popular fruit', row: 4, col: 0, direction: 'across', number: 5 },
            { word: 'CHESS', clue: 'Board game with kings and queens', row: 4, col: 5, direction: 'across', number: 6 },
            { word: 'GLOBE', clue: 'Model of the Earth', row: 6, col: 0, direction: 'across', number: 7 },
            { word: 'KNIFE', clue: 'Cutting tool', row: 6, col: 5, direction: 'across', number: 8 },
            { word: 'STORM', clue: 'Violent weather', row: 8, col: 0, direction: 'across', number: 9 },
            { word: 'BEACH', clue: 'Sandy shore', row: 8, col: 5, direction: 'across', number: 10 },
            // Down (top-to-bottom)
            { word: 'OCEAN', clue: 'Large body of salt water', row: 0, col: 5, direction: 'down', number: 2 },
            { word: 'PRISM', clue: 'Splits light into colors', row: 0, col: 0, direction: 'down', number: 1 },
            { word: 'RANCH', clue: 'Large farm', row: 0, col: 3, direction: 'down', number: 11 },
            { word: 'IGLOO', clue: 'Ice house', row: 2, col: 1, direction: 'down', number: 12 },
            { word: 'LEMON', clue: 'Sour yellow fruit', row: 0, col: 2, direction: 'down', number: 13 },
            { word: 'EAGLE', clue: 'Bird of prey', row: 4, col: 4, direction: 'down', number: 14 },
            { word: 'TRAIN', clue: 'Runs on tracks', row: 0, col: 7, direction: 'down', number: 15 },
        ],
    },
    {
        id: 'en_2',
        title: 'Animals & Nature',
        size: 10,
        rtl: false,
        words: [
            { word: 'HORSE', clue: 'Animal you can ride', row: 0, col: 0, direction: 'across', number: 1 },
            { word: 'SNAKE', clue: 'Slithering reptile', row: 0, col: 5, direction: 'across', number: 2 },
            { word: 'EAGLE', clue: 'Majestic bird', row: 2, col: 0, direction: 'across', number: 3 },
            { word: 'CORAL', clue: 'Underwater structure', row: 2, col: 5, direction: 'across', number: 4 },
            { word: 'WHALE', clue: 'Largest mammal', row: 4, col: 0, direction: 'across', number: 5 },
            { word: 'TULIP', clue: 'Dutch flower', row: 4, col: 5, direction: 'across', number: 6 },
            { word: 'FROST', clue: 'Ice crystals on surfaces', row: 6, col: 0, direction: 'across', number: 7 },
            { word: 'OLIVE', clue: 'Mediterranean fruit', row: 6, col: 5, direction: 'across', number: 8 },
            { word: 'CRANE', clue: 'Tall wading bird', row: 8, col: 0, direction: 'across', number: 9 },
            { word: 'MOOSE', clue: 'Large antlered animal', row: 8, col: 5, direction: 'across', number: 10 },
            // Down
            { word: 'HERO', clue: 'Saves the day', row: 0, col: 0, direction: 'down', number: 1 },
            { word: 'SCOW', clue: 'Flat-bottomed boat', row: 0, col: 5, direction: 'down', number: 2 },
        ],
    },
];

// ───────── KURDISH SORANI PUZZLES (RTL) ─────────
// For across words: `col` is the RIGHTMOST starting position
// Letters go RIGHT-TO-LEFT: col, col-1, col-2, ...
const KURDISH_PUZZLES = [
    {
        id: 'ku_1',
        title: 'زانیاری گشتی',
        size: 8,
        rtl: true,
        words: [
            // Across (RTL: col is rightmost, letters go LEFT)
            // Row 0: باران (5 letters) starts at col 7, goes to col 3
            { word: 'باران', clue: 'ئاو لە ئاسمان', row: 0, col: 7, direction: 'across', number: 1 },
            // Row 1: هەتاو (5 letters) starts at col 7, goes to col 3
            { word: 'هەتاو', clue: 'ئەستێرەی ناوەندی', row: 1, col: 7, direction: 'across', number: 2 },
            // Row 2: مانگ (4 letters) starts at col 7, goes to col 4
            { word: 'مانگ', clue: 'لە شەو ڕووناکی دەدات', row: 2, col: 7, direction: 'across', number: 3 },
            // Row 3: ئاو (3 letters) starts at col 7, goes to col 5
            { word: 'ئاو', clue: 'بۆ ژیان پێویستە', row: 3, col: 7, direction: 'across', number: 4 },
            // Row 4: گوڵ (3 letters) starts at col 7, goes to col 5
            { word: 'گوڵ', clue: 'جوانی سروشت', row: 4, col: 7, direction: 'across', number: 5 },
            // Row 5: دار (3 letters) starts at col 7, goes to col 5
            { word: 'دار', clue: 'ڕووەکی گەورە', row: 5, col: 7, direction: 'across', number: 6 },
            // Row 6: خاک (3 letters) starts at col 7, goes to col 5
            { word: 'خاک', clue: 'ڕووی زەوی', row: 6, col: 7, direction: 'across', number: 7 },
            // Row 7: بەرد (4 letters) starts at col 7, goes to col 4
            { word: 'بەرد', clue: 'قورسە و سەختە', row: 7, col: 7, direction: 'across', number: 8 },

            // Left side across words
            // Row 0: شین (3 letters) starts at col 2, goes to col 0
            { word: 'شین', clue: 'ڕەنگی ئاسمان', row: 0, col: 2, direction: 'across', number: 9 },
            // Row 2: چیا (3 letters) starts at col 2, goes to col 0
            { word: 'چیا', clue: 'بەرزایی زەوی', row: 2, col: 2, direction: 'across', number: 10 },

            // Down
            { word: 'بمگد', clue: 'تیپی کوردی', row: 0, col: 7, direction: 'down', number: 1 },
        ],
    },
    {
        id: 'ku_2',
        title: 'ئاژەڵ و سروشت',
        size: 8,
        rtl: true,
        words: [
            // Across (RTL: col is rightmost, letters go LEFT)
            // Row 0: شێر (3 letters) at col 7→5
            { word: 'شێر', clue: 'پاشای دارستان', row: 0, col: 7, direction: 'across', number: 1 },
            // Row 1: مار (3 letters) at col 7→5
            { word: 'مار', clue: 'خشۆک دەکات', row: 1, col: 7, direction: 'across', number: 2 },
            // Row 2: باز (3 letters) at col 7→5
            { word: 'باز', clue: 'باڵندەی ڕاو', row: 2, col: 7, direction: 'across', number: 3 },
            // Row 3: بزن (3 letters) at col 7→5
            { word: 'بزن', clue: 'شیر دەدات', row: 3, col: 7, direction: 'across', number: 4 },
            // Row 4: ماسی (4 letters) at col 7→4
            { word: 'ماسی', clue: 'لە ئاودا دەژی', row: 4, col: 7, direction: 'across', number: 5 },
            // Row 5: ئەسپ (4 letters) at col 7→4
            { word: 'ئەسپ', clue: 'ئاژەڵی سواری', row: 5, col: 7, direction: 'across', number: 6 },
            // Row 6: مێش (3 letters) at col 7→5
            { word: 'مێش', clue: 'مێروی بچووک', row: 6, col: 7, direction: 'across', number: 7 },
            // Row 7: کەوک (4 letters) at col 7→4
            { word: 'کەوک', clue: 'باڵندەی کوردی', row: 7, col: 7, direction: 'across', number: 8 },

            // Left side
            // Row 0: پشیلە (5 letters) at col 4→0
            { word: 'پشیلە', clue: 'ئاژەڵی ماڵی بچووک', row: 0, col: 4, direction: 'across', number: 9 },
            // Row 2: مریشک (5 letters) at col 4→0
            { word: 'مریشک', clue: 'باڵندەی ماڵی', row: 2, col: 4, direction: 'across', number: 10 },
        ],
    },
];

/**
 * Build the grid from puzzle word data.
 * For RTL puzzles, across words go right-to-left (col - i).
 * For LTR puzzles, across words go left-to-right (col + i).
 * Down words always go top-to-bottom.
 */
export function buildGrid(puzzle) {
    const { size, words, rtl } = puzzle;
    
    // Initialize grid with nulls (all blockers)
    const grid = Array(size).fill(null).map(() => Array(size).fill(null));
    
    // Place each word
    for (const wordData of words) {
        const { word, row, col, direction, number } = wordData;
        const letters = [...word]; // Handles Kurdish multi-byte/combined chars
        
        for (let i = 0; i < letters.length; i++) {
            let r, c;
            if (direction === 'across') {
                r = row;
                c = rtl ? col - i : col + i; // RTL goes left, LTR goes right
            } else {
                r = row + i;
                c = col;
            }
            
            if (r < 0 || r >= size || c < 0 || c >= size) continue;
            
            if (!grid[r][c]) {
                grid[r][c] = {
                    letter: letters[i],
                    userInput: '',
                    number: null,
                    isHint: false,
                    isWrong: false,
                    isCorrect: false,
                    acrossWord: null,
                    downWord: null,
                };
            }
            
            // Update the letter (in case of intersection, both words share the cell)
            // Keep the letter from whichever word was placed (they should match at intersections)
            
            // Assign the word reference (across or down)
            if (direction === 'across') {
                grid[r][c].acrossWord = wordData;
            } else {
                grid[r][c].downWord = wordData;
            }
            
            // Set number for the starting cell
            if (i === 0) {
                grid[r][c].number = number;
            }
        }
    }
    
    return grid;
}

/**
 * Check if the grid is completely and correctly filled
 */
export function isGridComplete(grid) {
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            const cell = grid[r][c];
            if (cell && cell.letter && !cell.isHint) {
                if (cell.userInput !== cell.letter &&
                    cell.userInput.toUpperCase() !== cell.letter.toUpperCase()) {
                    return false;
                }
            }
            if (cell && cell.letter && !cell.userInput && !cell.isHint) {
                return false;
            }
        }
    }
    return true;
}

/**
 * Check all cells and mark wrong ones
 */
export function checkGrid(grid) {
    let wrongCount = 0;
    const newGrid = grid.map(row => row.map(cell => {
        if (!cell) return null;
        if (!cell.userInput && !cell.isHint) return { ...cell, isWrong: false, isCorrect: false };
        
        const isCorrect = cell.isHint || 
            cell.userInput === cell.letter ||
            cell.userInput.toUpperCase() === cell.letter.toUpperCase();
        
        if (!isCorrect && cell.userInput) wrongCount++;
        
        return {
            ...cell,
            isWrong: !isCorrect && !!cell.userInput,
            isCorrect: isCorrect,
        };
    }));
    
    return { grid: newGrid, wrongCount };
}

/**
 * Reveal a specific cell (hint penalty)
 */
export function revealCell(grid, row, col) {
    const newGrid = grid.map(r => r.map(c => c ? { ...c } : null));
    if (newGrid[row][col]) {
        newGrid[row][col].userInput = newGrid[row][col].letter;
        newGrid[row][col].isHint = true;
        newGrid[row][col].isWrong = false;
        newGrid[row][col].isCorrect = true;
    }
    return newGrid;
}

/**
 * Get all clues from puzzle data, split into Across and Down
 */
export function getClues(puzzle) {
    const across = [];
    const down = [];
    
    for (const wordData of puzzle.words) {
        const clueObj = {
            number: wordData.number,
            clue: wordData.clue,
            word: wordData.word,
            row: wordData.row,
            col: wordData.col,
            direction: wordData.direction,
        };
        
        if (wordData.direction === 'across') {
            across.push(clueObj);
        } else {
            down.push(clueObj);
        }
    }
    
    across.sort((a, b) => a.number - b.number);
    down.sort((a, b) => a.number - b.number);
    
    return { across, down };
}

/**
 * Get cells belonging to a word (for highlighting & navigation).
 * RTL across words go right-to-left.
 */
export function getWordCells(wordData, gridSize, isRTL) {
    const cells = [];
    const letters = [...wordData.word];
    
    for (let i = 0; i < letters.length; i++) {
        let r, c;
        if (wordData.direction === 'across') {
            r = wordData.row;
            c = isRTL ? wordData.col - i : wordData.col + i;
        } else {
            r = wordData.row + i;
            c = wordData.col;
        }
        if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
            cells.push({ r, c });
        }
    }
    
    return cells;
}

/**
 * Get a random puzzle
 */
export function getRandomPuzzle(isKurdish) {
    const puzzles = isKurdish ? KURDISH_PUZZLES : ENGLISH_PUZZLES;
    return puzzles[Math.floor(Math.random() * puzzles.length)];
}

/**
 * Get all puzzles for selection
 */
export function getAllPuzzles(isKurdish) {
    return isKurdish ? KURDISH_PUZZLES : ENGLISH_PUZZLES;
}
