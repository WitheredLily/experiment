import {Grid, CellState, Clues} from "./nonogram"

function recursiveSolve(grid: Grid, cellNumber: number, sizeX: number,sizeY: number, updateGrid: (grid: Grid, x: number, y: number, state: CellState) => void): boolean {
    if (cellNumber >= sizeX * sizeY) {
        return grid.isSolved()
    }
    let x = cellNumber % sizeX
    let y = Math.floor(cellNumber / sizeX)
    updateGrid(grid,x,y,CellState.Filled)
    if (grid.checkClues(x,y)) {
        if (recursiveSolve(grid,cellNumber+1,sizeX,sizeY,updateGrid)){
            return true
        }
    }
    updateGrid(grid,x,y,CellState.Marked)
    if (grid.checkClues(x,y)) {
        if (recursiveSolve(grid,cellNumber+1,sizeX,sizeY,updateGrid)){
            return true
        }
    }
    updateGrid(grid,x,y,CellState.Blank)
    return false
}


function BacktrackSolve(grid: Grid): boolean {
    let updateGrid  = (grid:Grid, x:number, y:number, state:CellState) => {
        grid.updateCell(x, y, state)
    }
    let [x,y] = grid.getSize()
    let solved = recursiveSolve(grid,0,x,y,updateGrid)
    if (!solved){
        console.log("No solution found")
    }
    return solved
}

function getBacktrackSolution(inputGrid: Grid): [number, number, CellState][][] {
    let newGrid = inputGrid.clone("temp")
    let steps: [number, number, CellState][][] = []
    let updateGrid  = (grid:Grid, x:number, y:number, state:CellState) => {
        grid.updateCell(x, y, state)
        steps.push([[x,y,state]])
    }
    let [x,y] = inputGrid.getSize()
    let solved = recursiveSolve(newGrid,0,x,y,updateGrid)
    if (!solved){
        console.log("No solution found")
    }
    localStorage.removeItem("temp")
    return steps
}

function geneticSolve(grid: Grid): boolean {
    // Placeholder for genetic algorithm solver
    console.log("Genetic solver not implemented yet")
    return false
}

function constraintPropagationSolve(grid: Grid): boolean {
    // Placeholder for constraint propagation solver
    console.log("Constraint propagation solver not implemented yet")
    return false
}

function simpleBox(grid: Grid): boolean {
    let [xSize,ySize] = grid.getSize()
    function simpleBoxLine(clues: Clues, size: number): CellState[] {
        let leftSolution:CellState[] = new Array(size).fill(CellState.Blank)
        let position = 0
        for(let clue of clues.getNumbers()) {
            for (position; position < clue; position++) {
                leftSolution[position] = CellState.Filled
            }
            position++;
        }
        position = size
        let rightSolution:CellState[] = new Array(size).fill(CellState.Blank)
        for(let clue of clues.getNumbers()) {
            for (position; position >= 0; position--) {
                rightSolution[position] = CellState.Filled
            }
            position--;
        }
        let finalSolution:CellState[] = new Array(size).fill(CellState.Blank)
        for (let i=0;i<size;i++){
            if (leftSolution[i] === CellState.Filled && rightSolution[i] === CellState.Filled){
                finalSolution[i] = CellState.Filled
            }
        }
        return finalSolution
    }
    let states = grid.getCellStates()
    for (let x=0;x<xSize;x++){
        let lineSolution = simpleBoxLine(grid.getCluesX()[x], xSize)
        for (let i = 0; i < lineSolution.length; i++) {
            let currentState = states[x][i]
            if (currentState === CellState.Blank) {
                grid.updateCell(x, i, lineSolution[i])
            } else if (currentState != lineSolution[i]) {
                return false
            }
        }
    }
    for (let y=0;y<ySize;y++){
        let lineSolution = simpleBoxLine(grid.getCluesY()[y], ySize)
        for (let i = 0; i < lineSolution.length; i++) {
            let currentState = states[i][y]
            if (currentState === CellState.Blank) {
                grid.updateCell(i, y, lineSolution[i])
            } else if (currentState != lineSolution[i]) {
                return false
            }
        }
    }
    return true
}
export {BacktrackSolve, getBacktrackSolution}