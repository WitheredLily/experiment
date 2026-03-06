// typescript
// File: `src/game/nonogram.ts`

import {imageToNonogram} from "../images/image-converter";

enum CellState {
    Blank,
    Filled,
    Marked,
}

enum ClueStates {
    Correct,
    Wrong,
    Unsolved,
}

const loadingErr = new Error("Invalid cell states saved");

class Grid {
    private readonly cluesArrayX: Clues[];
    private readonly cluesArrayY: Clues[];
    private readonly numbers: number[][][];
    private readonly cellStates: CellState[][];
    private solved: boolean;
    private readonly id?: string;

    public constructor(numbersX: number[][], numbersY: number[][], id?: string, states?: CellState[][]) {
        const cols = numbersX.length;
        const rows = numbersY.length;
        if (states) {
            if (states.length !== cols) {
                throw loadingErr;
            }
            for (const state of states) {
                if (state.length !== rows) {
                    throw loadingErr;
                }
            }
            this.cellStates = states;
        } else {
            this.cellStates = Array.from({length: cols}, () =>
                Array.from({length: rows}, () => CellState.Blank)
            );
        }
        this.cluesArrayX = numbersToClue(numbersX);
        this.cluesArrayY = numbersToClue(numbersY);
        this.numbers = [numbersX,numbersY]
        this.solved = false;
        this.isSolved()
        this.id = id;
        this.checkAllClues();
        this.save();
    }

    public setStates(states: CellState[][]) {
        if (states.length !== this.cellStates.length || states[0].length !== this.cellStates[0].length) {
            return false;
        }
        for (let i = 0; i < states.length; i++) {
            for (let j = 0; j < states[i].length; j++) {
                this.cellStates[i][j] = states[i][j];
            }
        }
        this.checkAllClues();
    }

    public checkAllClues(): void {
        this.cluesArrayX.forEach((clue, i) => {
            clue.checkClue(this.cellStates[i])
        })
        this.cluesArrayY.forEach((clue, i) => {
            clue.checkClue(this.cellStates.map(column => column[i]))
        })
    }

    public clone(newId?: string): Grid {
        return new Grid(this.numbers[0], this.numbers[1], newId, Object.assign([], this.cellStates.map(function(arr) {
            return arr.slice();
        })))
    }

    public save(): void {
        if (!this.id) return;
        localStorage.setItem(this.id, JSON.stringify({
            numbers: this.numbers,
            cellStates: this.cellStates,
        }));
    }

    public isSolved(){
        const solved = checkSolvedAxis(this.cluesArrayX) && checkSolvedAxis(this.cluesArrayY);
        this.solved = solved;
        return solved;
    }

    public checkClues(x: number, y: number) {
        let xValid = this.cluesArrayX[x].checkClue(this.cellStates[x]);
        const yArray: CellState[] = this.getYCellStates(y);
        let yValid = this.cluesArrayY[y].checkClue(yArray);
        return xValid && yValid;
    }

    public updateCell(x: number, y: number, newState: CellState){
        this.cellStates[x][y] = newState;
    }

    public getSolved(): boolean {
        return this.solved;
    }

    public getSize(){
        return [this.cluesArrayX.length, this.cluesArrayY.length];
    }

    public getCellStates(): CellState[][] {
        return this.cellStates;
    }

    public getCluesX(): Clues[] {
        return this.cluesArrayX;
    }

    public getCluesY(): Clues[] {
        return this.cluesArrayY;
    }

    public getClueNumbers(): [ReadonlyArray<number>[], ReadonlyArray<number>[]] {
        return [this.cluesArrayX.map(clue => clue.getNumbers()), this.cluesArrayY.map(clue => clue.getNumbers())]
    }

    public getYCellStates(y: number): CellState[] {
        return this.cellStates.map(column => column[y]);
    }
}

async function loadGrid(
    id: string,
    cols: number,
    rows: number,
    probability: number,
    image?: string
): Promise<Grid> {
    const stored = localStorage.getItem(id);
    if (stored) {
        const loadedGrid = JSON.parse(stored);
        if (!loadedGrid.solved) {
            return new Grid(
                loadedGrid.numbers[0],
                loadedGrid.numbers[1],
                id,
                loadedGrid.cellStates
            );
        }
    }

    if (image) {
        return imageToNonogram(image, cols, rows, id);
    } else {
        return rowsToGrid(makeRandomGrid(cols, rows, probability), id);
    }
}



class Clues {
    private readonly numbers: ReadonlyArray<number>;
    private state: ClueStates;
    private readonly regexSolved: RegExp;
    private readonly regexPossible: RegExp;

    public constructor(numbers: number[]) {
        this.numbers = numbers;
        this.state = ClueStates.Unsolved;
        // m for marked, b for blank, f for filled
        this.regexSolved = RegExp(`^[bm]*f{${numbers.join('}[bm]+f{') || '0'}}[bm]*$`)
        this.regexPossible = RegExp(`^[bm]*[fb]{${numbers.join('}[bm]+[fb]{') || '0'}}[bm]*$`)
    }

    public checkClue(cells: CellState[]) {
        let row = ""
        for (const cell of cells) {
            switch (cell) {
                case CellState.Marked:
                    row += "m"
                    break;
                case CellState.Filled:
                    row += "f"
                    break;
                case CellState.Blank:
                    row += "b"
                    break;
            }
        }
        if (this.regexSolved.test(row)) {
            this.state =  ClueStates.Correct;
        } else if (this.regexPossible.test(row)) {
            this.state = ClueStates.Unsolved;
        } else {
            this.state = ClueStates.Wrong;
            return false
        }
        return true;
    }

    public getNumbers(): ReadonlyArray<number> {
        return this.numbers;
    }
    public getState(): ClueStates {
        return this.state;
    }
}

export function makeRandomGrid(sizeX: number, sizeY: number, fillProbability: number): boolean[][] {
    return Array.from({ length: sizeX }, () =>
        Array.from({ length: sizeY }, () => Math.random() < fillProbability)
    );
}

export function rowsToGrid(grid: boolean[][], id: string): Grid {
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
    const numbersY: number[][] = Array.from({ length: grid[0].length }, (_, y) => {
        const counts: number[] = [];
        let currentCount = 0;
        for (let x = 0; x < grid.length; x++) {
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

    return new Grid(numbersX, numbersY, id);
}

function checkSolvedAxis(clues: Clues[]) {
    for (const clue of clues) {
        if (clue.getState() !== ClueStates.Correct) {
            return false;
        }
    }
    return true;
}

function numbersToClue(numbers: number[][]): Clues[] {
    return numbers.map(numberSet => (new Clues(numberSet)));
}

export { CellState, loadGrid, checkSolvedAxis, Grid };
export type { Clues };
