// typescript
// File: `src/game/nonogram.ts`

import {imageToNonogram} from "../images/image-converter";

enum CellState {
    Blank,
    Filled,
    Marked,
    Special
}

enum ClueStates {
    Correct,
    Wrong,
    Unsolved,
}

const loadingErr = new Error("Invalid cell states saved");

class Grid {
    private cluesArrayX: Clues[];
    private cluesArrayY: Clues[];
    private readonly numbers: number[][][];
    private readonly cellStates: CellState[][];
    private solved: boolean;
    private readonly id?: string;
    private alternateSolution?: CellState[][][];

    public constructor(numbersX: number[][], numbersY: number[][], id?: string, states?: CellState[][], alternateSolution?: CellState[][][]) {
        const cols = numbersX.length;
        const rows = numbersY.length;

        if (states) {
            if (states.length !== cols) throw loadingErr;
            for (const state of states) {
                if (state.length !== rows) throw loadingErr;
            }
            this.cellStates = states;
        } else {
            this.cellStates = Array.from({ length: cols }, () =>
                Array.from({ length: rows }, () => CellState.Blank)
            );
        }

        this.cluesArrayX = numbersToClue(numbersX);
        this.cluesArrayY = numbersToClue(numbersY);
        this.numbers = [numbersX, numbersY];
        this.id = id;
        this.alternateSolution = alternateSolution;
        this.solved = false;

        this.checkAllClues();
    }

    public toJSON() {
        return {
            numbers: this.numbers,
            cellStates: this.cellStates,
            alternateSolution: this.alternateSolution
        };
    }
    public static fromJSON(data: any, id?: string): Grid {
        return new Grid(
            data.numbers[0],
            data.numbers[1],
            id,
            data.cellStates,
            data.alternateSolution
        );
    }

    public markBlank(){
        for (let i = 0; i < this.cellStates.length; i++) {
            for (let j = 0; j < this.cellStates[i].length; j++) {
                if (this.cellStates[i][j] === CellState.Blank) {
                    this.updateCell(i, j, CellState.Marked);
                }
            }
        }
    }

    public clear(){
        for (let i = 0; i < this.cellStates.length; i++) {
            for (let j = 0; j < this.cellStates[i].length; j++) {
                this.cellStates[i][j] = CellState.Blank;
            }
        }
        this.save()
        this.checkAllClues();
    }

    public shuffle(probability: number) {
        const [cols,rows] = this.getSize();
        const newGrid = rowsToGrid(makeRandomGrid(cols, rows, probability))
        this.cluesArrayX = newGrid.cluesArrayX;
        this.cluesArrayY = newGrid.cluesArrayY;
        this.clear()
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
        if (this.alternateSolution) {
            this.checkAlternateSolution()
            return
        }
        this.cluesArrayX.forEach((clue, i) => {
            clue.checkClue(this.cellStates[i])
        })
        this.cluesArrayY.forEach((clue, i) => {
            clue.checkClue(this.cellStates.map(column => column[i]))
        })
    }

    public checkAlternateSolution(){
        //console.log("Checking alternate solution: ", this.alternateSolution)
        if (this.alternateSolution) {
            for (let i = 0; i < this.alternateSolution.length; i++) {
                for (let j = 0; j < this.alternateSolution[i].length; j++) {
                    if (!this.alternateSolution[i][j].includes(this.cellStates[i][j])) {
                        //console.log("Checking alternate solution: Fail")
                        return;
                    }
                }
            }
            console.log("Checking alternate solution: Success")
            this.solved=true;
        }
    }

    public setAlternateSolution(solution: CellState[][][]) {
        this.alternateSolution = solution;
        this.checkAllClues();
    }

    public clone(newId?: string): Grid {
        const altSolCopy = this.alternateSolution
            ? this.alternateSolution.map(layer => layer.map(col => col.slice()))
            : undefined;

        const cellStatesCopy = this.cellStates.map(col => col.slice());

        return new Grid(
            this.numbers[0],
            this.numbers[1],
            newId,
            cellStatesCopy,
            altSolCopy
        );
    }

    public save(): void {
        if (!this.id) return;
        localStorage.setItem(this.id, JSON.stringify(this.toJSON()));
    }

    public isSolved() {
        if (this.alternateSolution) {
            this.checkAlternateSolution();
            return this.solved;
        }

        const solved =
            checkSolvedAxis(this.cluesArrayX) &&
            checkSolvedAxis(this.cluesArrayY);

        this.solved = solved;
        return solved;
    }

    public checkClues(x: number, y: number) {
        this.checkAlternateSolution()
        const xValid = this.cluesArrayX[x].checkClue(this.cellStates[x]);
        const yArray: CellState[] = this.getYCellStates(y);
        const yValid = this.cluesArrayY[y].checkClue(yArray);
        return xValid && yValid;
    }

    public updateCell(x: number, y: number, newState: CellState){
        this.cellStates[x][y] = newState;
        this.checkAllClues();
        this.isSolved();
        this.save();
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
    image?: string
): Promise<Grid | null> {

    const stored = localStorage.getItem(id);

    if (stored) {
        const parsed = JSON.parse(stored);
        return Grid.fromJSON(parsed, id);
    }

    if (image) {
        return imageToNonogram(image, cols, rows, id);
    }

    return null;
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
                case CellState.Special:
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

export function rowsToGrid(grid: boolean[][], id?: string): Grid {
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

export function boolToStates(grid: boolean[][]): CellState[][] {
    return grid.map(col => col.map(value => (value ? CellState.Filled : CellState.Blank)));
}

export function makeGrid(grid: boolean[][]): Grid {
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
    return new Grid(numbersX, numbersY, undefined, boolToStates(grid));
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
