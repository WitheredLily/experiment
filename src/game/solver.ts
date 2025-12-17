import {Grid, CellState, Clues} from "./nonogram"
import {findPackageJSON} from "node:module";

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

function geneticSolve(grid: Grid): boolean {
    // Placeholder for genetic algorithm solver
    console.log("Genetic solver not implemented yet")
    return false
}

function constraintPropagationSolve(grid: Grid): boolean {
    let updateGrid  = (grid:Grid, x:number, y:number, state:CellState) => {
        grid.updateCell(x, y, state)
    }
    // Placeholder for constraint propagation solver
    console.log("Constraint propagation solver not implemented yet")
    simpleBox(grid, updateGrid)
    //simpleSpace(grid, updateGrid)
    return false
}

function constraintPropagationSteps(grid: Grid): [number, number, CellState][][] {
    let newGrid = grid.clone()
    let steps: [number, number, CellState][][] = []
    let updateGrid  = (grid:Grid, x:number, y:number, state:CellState) => {
        grid.updateCell(x, y, state)
        steps.push([[x,y,state]])
    }
    // Placeholder for constraint propagation solver
    console.log("Constraint propagation solver not implemented yet")
    simpleBox(newGrid, updateGrid)
    //simpleSpace(grid, updateGrid)
    return steps
}

function simpleBox(grid: Grid, updateGrid: (grid: Grid, x: number, y: number, state: CellState) => void): boolean {
    let [xSize,ySize] = grid.getSize()
    function simpleBoxLine(clues: Clues, size: number): boolean[] {
        let leftSolution:number[] = new Array(size).fill(-1)
        let position = 0
        let cluesNumbers = clues.getNumbers()
        cluesNumbers.forEach((clue, index) => {
            for (let i = 0; i < clue; i++) {
                leftSolution[position] = index
                position++;
            }
            position++;
        })
        position = size - 1
        let rightSolution:number[] = new Array(size).fill(-1)
        cluesNumbers.toReversed().forEach((clue, index) => {
            for (let i = 0; i < clue; i++) {
                rightSolution[position] = cluesNumbers.length - index - 1
                position--;
            }
            position--;
        })
        let finalSolution:boolean[] = new Array(size).fill(false)
        for (let i=0;i<size;i++){
            finalSolution[i] = leftSolution[i] > -1 && leftSolution[i] === rightSolution[i]
        }
        return finalSolution
    }
    let states = grid.getCellStates()
    for (let x=0;x<xSize;x++){
        let lineSolution = simpleBoxLine(grid.getCluesX()[x], ySize)
        for (let i = 0; i < lineSolution.length; i++) {
            if (lineSolution[i]) {
                let currentState = states[x][i]
                if (currentState === CellState.Blank) {
                    updateGrid(grid, x, i, CellState.Filled)
                } else if (currentState != CellState.Filled) {
                    return false
                }
            }
        }
    }
    for (let y=0;y<ySize;y++){
        let lineSolution = simpleBoxLine(grid.getCluesY()[y], xSize)
        for (let i = 0; i < lineSolution.length; i++) {
            if (lineSolution[i]) {
                let currentState = states[i][y]
                if (currentState === CellState.Blank) {
                    updateGrid(grid, i, y, CellState.Filled)
                } else if (currentState != CellState.Filled) {
                    console.log("Problem in solving with simple box")
                    return false
                }
            }
        }
    }
    return true
}

function simpleSpace(grid: Grid, updateGrid: (grid: Grid, x: number, y: number, state: CellState) => void): boolean {
    let [xSize, ySize] = grid.getSize()

    function solveLine(
        states: CellState[],
        clues: Clues
    ): CellState[] | null {
        let size = states.length
        let results: boolean[][] = []

        function placeClues(
            clueIndex: number,
            pos: number,
            line: boolean[]
        ) {
            if (clueIndex === clues.getNumbers().length) {
                // Fill rest with empty
                for (let i = pos; i < size; i++) {
                    if (states[i] === CellState.Filled) return
                    line[i] = false
                }
                results.push([...line])
                return
            }

            let clue = clues.getNumbers()[clueIndex]
            for (let i = pos; i + clue <= size; i++) {
                // Check empty before block
                if (i > pos && states[i - 1] === CellState.Filled) continue

                let valid = true
                for (let j = 0; j < clue; j++) {
                    if (states[i + j] === CellState.Marked) {
                        valid = false
                        break
                    }
                }
                if (!valid) continue

                let newLine = [...line]
                for (let j = 0; j < clue; j++) {
                    newLine[i + j] = true
                }

                if (i + clue < size) {
                    if (states[i + clue] === CellState.Filled) continue
                    newLine[i + clue] = false
                }

                placeClues(clueIndex + 1, i + clue + 1, newLine)
            }
        }

        placeClues(0, 0, new Array(size).fill(false))
        if (results.length === 0) return null

        let final = new Array(size).fill(CellState.Blank)
        for (let i = 0; i < size; i++) {
            let allFilled = results.every(r => r[i])
            let allEmpty = results.every(r => !r[i])

            if (allFilled) final[i] = CellState.Filled
            if (allEmpty) final[i] = CellState.Marked
        }
        return final
    }

    // Columns
    for (let x = 0; x < xSize; x++) {
        let states = grid.getCellStates()[x]
        let result = solveLine(states, grid.getCluesX()[x])
        if (!result) return false

        for (let y = 0; y < ySize; y++) {
            if (states[y] === CellState.Blank && result[y] !== CellState.Blank) {
                grid.updateCell(x, y, result[y])
            }
        }
    }

    // Rows
    for (let y = 0; y < ySize; y++) {
        let states = grid.getYCellStates(y)
        let result = solveLine(states, grid.getCluesY()[y])
        if (!result) return false

        for (let x = 0; x < xSize; x++) {
            if (states[x] === CellState.Blank && result[x] !== CellState.Blank) {
                grid.updateCell(x, y, result[x])
            }
        }
    }

    return true
}

export {BacktrackSolve, getBacktrackSolution, constraintPropagationSolve}