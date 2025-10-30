// typescript
// File: `src/game/nonogram.ts`

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

const loadingErr = new Error("Invalid cell states saved");

class Grid {
    private readonly cluesArrayX: Clues[];
    private readonly cluesArrayY: Clues[];
    private readonly numbers: number[][][];
    private readonly cellStates: CellState[][];
    private solved: boolean;
    private readonly id: string;

    public constructor(numbersX: number[][], numbersY: number[][], id: string, states?: CellState[][]) {
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
        this.cluesArrayX.forEach((clue, i) => {
            clue.checkClue(this.cellStates[i])
        })
        this.cluesArrayY.forEach((clue, i) => {
            clue.checkClue(this.cellStates.map(column => column[i]))
        })
        this.save();
    }

    public save(): void {
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
        this.cluesArrayX[x].checkClue(this.cellStates[x]);
        const yArray: CellState[] = this.cellStates.map(column => column[y]);
        this.cluesArrayY[y].checkClue(yArray);
    }

    public updateCell(x: number, y: number, newState: CellState){
        this.cellStates[x][y] = newState;
    }

    public getSolved(): boolean {
        return this.solved;
    }

    public getSize(){
        return [this.cluesArrayX.length, this.cluesArrayX.length];
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
}
function loadGrid(id: string, cols: number, rows: number, probability: number){
    if(localStorage.getItem(id)) {
        let loadedGrid = JSON.parse(localStorage.getItem(id)!);
        if (!loadedGrid.solved){
            return new Grid(loadedGrid.numbers[0], loadedGrid.numbers[1], id, loadedGrid.cellStates);
        }

    }
    return makeRandomGrid(cols, rows, probability, id)
}


class Clues {
    private readonly numbers: ReadonlyArray<number>;
    private state: ClueStates;
    private readonly regexSolved: RegExp;
    private readonly regexPossible: RegExp;

    public constructor(numbers: number[]) {
        this.numbers = numbers;
        this.state = ClueStates.Unsolved;
        this.regexSolved = RegExp(`^[bc]*a{${numbers.join('}[bc]+a{') || '0'}}[bc]*$`)
        this.regexPossible = RegExp(`^[bc]*[ab]{${numbers.join('}[bc]+[ab]{') || '0'}}[bc]*$`)
    }

    public checkClue(cells: CellState[]) {
        let row = ""
        for (const cell of cells) {
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
        }
        if (this.regexSolved.test(row)) {
            this.state =  ClueStates.Correct;
        } else if (this.regexPossible.test(row)) {
            this.state = ClueStates.Unsolved;
        } else {
            this.state = ClueStates.Wrong;
        }
    }

    public getNumbers(): ReadonlyArray<number> {
        return this.numbers;
    }
    public getState(): ClueStates {
        return this.state;
    }
}

export function makeRandomGrid(sizeX: number, sizeY: number, fillProbability: number, id: string): Grid {
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

export { CellState, loadGrid };
export type { Grid };
