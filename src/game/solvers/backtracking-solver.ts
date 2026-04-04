import {Grid, CellState} from "../nonogram"

function recursiveSolve(grid: Grid, cellNumber: number, sizeX: number,sizeY: number, updateGrid: (grid: Grid, x: number, y: number, state: CellState) => void): boolean {
    if (cellNumber >= sizeX * sizeY) {
        return grid.isSolved()
    }
    const x = cellNumber % sizeX
    const y = Math.floor(cellNumber / sizeX)
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
    const updateGrid  = (grid:Grid, x:number, y:number, state:CellState) => {
        grid.updateCell(x, y, state)
    }
    const [x,y] = grid.getSize()
    const solved = recursiveSolve(grid,0,x,y,updateGrid)
    if (!solved){
        console.log("No solution found")
    }
    return solved
}

function getBacktrackSolution(inputGrid: Grid): [number, number, CellState][][] {
    const newGrid = inputGrid.clone()
    const steps: [number, number, CellState][][] = []
    const updateGrid  = (grid:Grid, x:number, y:number, state:CellState) => {
        grid.updateCell(x, y, state)
        steps.push([[x,y,state]])
    }
    const [x,y] = newGrid.getSize()
    const solved = recursiveSolve(newGrid,0,x,y,updateGrid)
    if (!solved){
        console.log("No solution found")
    }
    return steps
}


export {BacktrackSolve, getBacktrackSolution,}