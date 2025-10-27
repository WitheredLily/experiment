interface Grid {
    numbersX: Clues[];
    numbersY: Clues[];
    cellStates: CellState[][];
}
interface Clues {
    numbers: number[];
    wrong: boolean;
}
enum CellState {
    Blank,
    Filled,
    Flagged,
}

function makeRandomGrid(sizeX: number, sizeY: number, fillProbability: number): Grid {
    let grid: boolean[][] = [];
    for (let i = 0; i < sizeX; i++) {
        const array: boolean[] = Array.from({ length: sizeY }, () => Math.random() < 0.5);
        grid.push(array)
    }


    let numbersX: number[][] = new Array<number[]>(sizeX);
    let numbersY: number[][] = new Array<number[]>(sizeY);

    grid.forEach(array => {
        const counts: number[] = [];
        let currentCount = 0;
        array.forEach(value => {
            if (value) {
                currentCount++;
            } else if (currentCount > 0) {
                counts.push(currentCount);
                currentCount = 0;
            }
        })
        if (currentCount > 0) {
            counts.push(currentCount)
        }
        numbersX.push(counts)
    })

    for (let y = 0; y < sizeY; y++) {
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
        if (currentCount > 0) {
            counts.push(currentCount);
        }

        numbersY.push(counts);
    }
    return createGrid(numbersX, numbersY);
    }

function createGrid(numbersX: number[][], numbersY: number[][]) :Grid {
    let cells: CellState[][] = new Array<CellState[]>(numbersX.length).fill(Array<CellState>(numbersY.length).fill(CellState.Blank));
    const grid: Grid = {
        numbersX: numbersToClue(numbersX),
        numbersY: numbersToClue(numbersY),
        cellStates: cells,
    };
    return grid;
}
function changeCellState(grid: Grid, x: number, y: number, newState: CellState): void {
    if (x < 0 || x >= grid.numbersX.length || y < 0 || y >= grid.numbersY.length) {
        throw new Error("Cell coordinates out of bounds");
    }
    grid.cellStates[x][y] = newState;
}

function checkCell(grid: Grid, x: number, y: number){
    checkClue(grid.cellStates[x], grid.numbersX[x])
    let yArray = new Array<number>(grid.numbersY.length);
    grid.cellStates.forEach(column => {
        yArray.push(column[y])
    })
    checkClue(yArray, grid.numbersY[y])
}
function checkClue(cells: CellState[], clue: Clues){
    clue.wrong = false;
    let lastFlagged = -1;
    let firstFilled = 0;
    let filledFound = false;
    let numberFound = false;
    let numbersFound: number = 0;
    let breakFlag = false;
    for (let i = 0; (i < cells.length && numbersFound < clue.numbers.length && !breakFlag) ; i++) {
        const cell = cells[i];
        switch (cell) {
            case CellState.Flagged:
                if(numberFound){
                    numberFound = false;
                    numbersFound++;
                }
                if(filledFound){
                    breakFlag = true;
                    clue.wrong = true;
                    break;
                }
                lastFlagged = i
                filledFound = false
                break;
            case CellState.Filled:
                if(numberFound && i-firstFilled+1 > clue.numbers[numbersFound]){
                    breakFlag = true;
                    clue.wrong = true;
                    break;
                }
                if(i-lastFlagged >= clue.numbers[numbersFound]){
                    numbersFound++;
                    numberFound = true;
                    filledFound = false;
                    lastFlagged = i+1;
                }else if(!filledFound){
                    firstFilled = i;
                    filledFound = true;
                }
                break;
            case CellState.Blank:
                if(numberFound){
                    numberFound = false;
                    numbersFound++;
                }
                break;

        }
    }
    return clue.wrong;
}
function numbersToClue(numbers: number[][]):Clues[]{
    let cluesSet: Clues[] = new Array<Clues>(numbers.length);
    numbers.forEach(numberSet => {
        cluesSet.push({
            numbers: numberSet,
            wrong: false,
        })
    })
    return cluesSet;
}

function solveGrid(grid: Grid): void {

}

function checkSolvable(grid: Grid): boolean {
    return true;
}


export {CellState, createGrid, changeCellState};    export type { Grid };

