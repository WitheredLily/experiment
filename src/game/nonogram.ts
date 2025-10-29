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
    private readonly numbersX: Clues[];
    private readonly numbersY: Clues[];
    private readonly numbers: number[][][];
    private cellStates: CellState[][];
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
        this.numbersX = numbersToClue(numbersX);
        this.numbersY = numbersToClue(numbersY);
        this.numbers = [numbersX,numbersY]
        this.solved = false;
        this.isSolved()
        this.id = id;
        localStorage.setItem(this.id, JSON.stringify(this));
    }

    public save(): void {
        localStorage.setItem(this.id, JSON.stringify({
            numbers: this.numbers,
            cellStates: this.cellStates,
        }));
    }

    public isSolved(){
        const solved = checkSolvedAxis(this.numbersX) && checkSolvedAxis(this.numbersY);
        this.solved = solved;
        return solved;
    }

    public checkClues(x: number, y: number) {
        this.numbersX[x].checkClue(this.cellStates[x]);
        const yArray: CellState[] = this.cellStates.map(column => column[y]);
        this.numbersY[y].checkClue(yArray);
    }


    public flagCell(x: number, y: number){
        this.cellStates[x][y] = CellState.Flagged;
    }
    public fillCell(x: number, y: number){
        this.cellStates[x][y] = CellState.Filled;
    }
    public blankCell(x: number, y: number){
        this.cellStates[x][y] = CellState.Blank;
    }

    public updateCell(x: number, y: number, newState: CellState){
        this.cellStates[x][y] = newState;
    }

    public getSolved(): boolean {
        return this.solved;
    }

    public getSize(){
        return [this.numbersX.length, this.numbersX.length];
    }

    public getCellStates(): CellState[][] {
        return this.cellStates;
    }

    public getId(): string {
        return this.id;
    }

    public getCluesX(): Clues[] {
        return this.numbersX;
    }

    public getCluesY(): Clues[] {
        return this.numbersY;
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
    private readonly numbers: number[];
    private state: ClueStates;
    private readonly regexSolved: RegExp;
    private readonly regexPossible: RegExp;

    public constructor(numbers: number[]) {
        this.numbers = numbers;
        if (numbers.length === 0) {
            this.state = ClueStates.Correct;
        } else {
            this.state = ClueStates.Unsolved;
        }
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

    public getNumbers(): number[] {
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

function clueToNumbers(clues: Clues[]): Number[][] {
    let numberSet: number[][] = [];
    for (const clue of clues) {
        numberSet.push(clue.getNumbers())
    }
    return numberSet;
}

export { CellState, loadGrid };
export type { Grid };
