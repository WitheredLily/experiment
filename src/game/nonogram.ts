// typescript
// File: `src/game/nonogram.ts`
interface Grid {
    numbersX: Clues[];
    numbersY: Clues[];
    cellStates: CellState[][];
    solved: boolean;
}
interface Clues {
    numbers: number[];
    state: ClueStates;
}
enum CellState {
    Blank,
    Filled,
    Flagged,
}

enum ClueStates {
    Correct,
    Wrong,
    Unsolved,
}

export function makeRandomGrid(sizeX: number, sizeY: number, fillProbability: number): Grid {
    const grid: boolean[][] = Array.from({ length: sizeX }, () =>
        Array.from({ length: sizeY }, () => Math.random() < fillProbability)
    );

    const numbersX: number[][] = grid.map(col => {
        const counts: number[] = [];
        let currentCount = 0;
        col.forEach(value => {
            if (value) {
                currentCount++;
            } else if (currentCount > 0) {
                counts.push(currentCount);
                currentCount = 0;
            }
        });
        if (currentCount > 0) counts.push(currentCount);
        return counts;
    });

    const numbersY: number[][] = Array.from({ length: sizeY }, (_, y) => {
        const counts: number[] = [];
        let currentCount = 0;
        for (let x = 0; x < sizeX; x++) {
            if (grid[x][y]) {
                currentCount++;
            } else if (currentCount > 0) {
                counts.push(currentCount);
                currentCount = 0;
            }
        }
        if (currentCount > 0) counts.push(currentCount);
        return counts;
    });

    return createGrid(numbersX, numbersY);
}

function createGrid(numbersX: number[][], numbersY: number[][]): Grid {
    const cols = numbersX.length;
    const rows = numbersY.length;
    const cells: CellState[][] = Array.from({ length: cols }, () =>
        Array.from({ length: rows }, () => CellState.Blank)
    );

    return {
        numbersX: numbersToClue(numbersX),
        numbersY: numbersToClue(numbersY),
        cellStates: cells,
        solved: false,
    };
}

function changeCellState(grid: Grid, x: number, y: number, newState: CellState): void {
    if (x < 0 || x >= grid.numbersX.length || y < 0 || y >= grid.numbersY.length) {
        throw new Error("Cell coordinates out of bounds");
    }
    grid.cellStates[x][y] = newState;
}

function checkCell(grid: Grid, x: number, y: number) {
    //let originalClueStateX = grid.numbersX[x].state;
    checkClue(grid.cellStates[x], grid.numbersX[x]);
    const yArray: CellState[] = grid.cellStates.map(column => column[y]);
    //let originalClueStateY = grid.numbersY[y].state;
    checkClue(yArray, grid.numbersY[y]);
    return grid;
}

function checkClue(cells: CellState[], clues: Clues) {
    let row = ""
    cells.forEach((cell, index) => {
        switch (cell) {
            case CellState.Flagged:
                row += "c"
                break;
                case CellState.Filled:
                    row += "a"
                break;
                    case CellState.Blank:
                        row += "b"
                break;
        }
    })
    let patternSolved = "^[bc]*";
    let patternValid = "^[bc]*";
    for (let i = 0; i < clues.numbers.length - 1; i++) {
        patternSolved += `a{${clues.numbers[i]}}[bc]+`
        patternValid += `[ab]{${clues.numbers[i]}}[bc]+`
    }
    if (clues.numbers.length > 0) {
        patternSolved += `a{${clues.numbers[clues.numbers.length - 1]}}[bc]*`
        patternValid += `[ab]{${clues.numbers[clues.numbers.length - 1]}}[bc]*`
    }
    patternValid += `$`
    patternSolved += `$`
    if (RegExp(patternSolved).test(row)) {
        clues.state = ClueStates.Correct;
    } else if (RegExp(patternValid).test(row)) {
        clues.state = ClueStates.Unsolved;
    } else {
        clues.state = ClueStates.Wrong;
    }
}

function isSolved(grid: Grid){
    let solved = true;
    for (let i = 0; i < grid.numbersX.length && solved; i++) {
        if (grid.numbersX[i].state !== ClueStates.Correct) {
            solved = false;
        }
    }
    for (let i = 0; i < grid.numbersY.length && solved; i++) {
        if (grid.numbersY[i].state !== ClueStates.Correct) {
            solved = false;
        }
    }
    grid.solved = solved;
    return solved;
}

function numbersToClue(numbers: number[][]): Clues[] {
    return numbers.map(numberSet => ({
        numbers: numberSet,
        state: ClueStates.Unsolved,
    }));
}

// New: compute wrong flags for all clues based on current cellStates and return a new Grid
export function checkAllClues(grid: Grid): Grid {
    // clone clue objects so we return a fresh Grid
    const numbersX = grid.numbersX.map(c => ({ numbers: c.numbers.slice(), state: ClueStates.Unsolved }));
    const numbersY = grid.numbersY.map(c => ({ numbers: c.numbers.slice(), state: ClueStates.Unsolved }));

    // check each column (x)
    for (let x = 0; x < numbersX.length; x++) {
        const colCells = grid.cellStates[x] ?? [];
        checkClue(colCells, numbersX[x]);
    }

    // check each row (y)
    for (let y = 0; y < numbersY.length; y++) {
        const rowCells: CellState[] = grid.cellStates.map(col => col[y]);
        checkClue(rowCells, numbersY[y]);
    }

    return {
        ...grid,
        numbersX,
        numbersY,
    };
}

function solveGrid(grid: Grid): void {}

function checkSolvable(grid: Grid): boolean {
    return true;
}

export { CellState, createGrid, changeCellState, checkCell, isSolved};
export type { Grid };
