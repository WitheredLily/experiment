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
    let lastFlagged = -1;
    let firstFilled = 0;
    let filledFound = false;
    let numberFound = false;
    let numbersFound: number = 0;
    let clue = grid.numbersX[x];
    let breakFlag = false;
    for (let i = 0; (i < x && numbersFound < clue.numbers.length && !breakFlag) ; i++) {
        const cell = grid.cellStates[x][i];
        switch (cell) {
            case CellState.Flagged:
                numberFound = false;
                if(filledFound){
                    breakFlag = true;
                }
                lastFlagged = i
                filledFound = false
                break;
            case CellState.Filled:
                if(numberFound){}
                if(lastFlagged+2+i > clue.numbers[numbersFound]){
                    numbersFound++;
                    numberFound = true;
                    filledFound = false;
                }
                if(!filledFound){
                    firstFilled = i;
                    filledFound = true;
                }
                break;
            case CellState.Blank:
                numberFound = false;
                break;

        }
    }
    for (let i = 0; i < y; i++) {
        const cell = grid.cellStates[i][y];
    }
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


export {CellState, createGrid, changeCellState};
