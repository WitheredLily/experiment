import {Grid, CellState, Clues} from "../nonogram"

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
    let newGrid = inputGrid.clone()
    let steps: [number, number, CellState][][] = []
    let updateGrid  = (grid:Grid, x:number, y:number, state:CellState) => {
        grid.updateCell(x, y, state)
        steps.push([[x,y,state]])
    }
    let [x,y] = newGrid.getSize()
    let solved = recursiveSolve(newGrid,0,x,y,updateGrid)
    if (!solved){
        console.log("No solution found")
    }
    return steps
}


export {BacktrackSolve, getBacktrackSolution,}