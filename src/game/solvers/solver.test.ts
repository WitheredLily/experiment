import {BacktrackSolve} from "./backtracking-solver";
import {geneticSolve} from "./genetic-solver";
import {constraintPropagationSolve} from "./constraint-solver";
import {CellState, Grid, makeRandomGrid, rowsToGrid} from "../nonogram";

const solution = makeRandomGrid(20,20,0.5)

function gridCheck(grid:Grid){
    let states = grid.getCellStates()
    let [xSize,ySize] = grid.getSize()
    for (let y = 0; y < ySize; y++){
        for (let x = 0; x < xSize; x++){
            if (states[x][y] != (solution[x][y] ? CellState.Filled : CellState.Marked)) {
                console.log(`Error at ${x},${y} expected ${solution[x][y]} got ${solution[x][y] ? CellState.Filled : CellState.Marked}`)
                return false
            }
        }
    }
    return true
}

test("Backtracking Solver", () => {
    let grid:Grid = rowsToGrid(solution, "backtrack")
    BacktrackSolve(grid)
    expect(gridCheck(grid)).toBe(true);
});
//TODO: Enable constraint solver test
/*
test("Constraint Propagation Solver", () => {
    let grid:Grid = rowsToGrid(solution, "constraint")
    constraintPropagationSolve(grid)
    expect(gridCheck(grid)).toBe(true);
});
*/
test("Genetic Solver", () => {
    for (let i = 0; i < 10; i++) {
        let grid: Grid = rowsToGrid(makeRandomGrid(10,10,0.5), "genetic")
        geneticSolve(grid)
        expect(gridCheck(grid)).toBe(true);
    }
});

test("Genetic Solver Success Rate", () => {
    let gridNum = 100
    let solveRates = new Map<number, [number,number]>()
    for (let n=3; n<=20; n+=1) {
        let solvedGrids = 0
        let solvedIterations = 0
        for (let i = 0; i < gridNum; i++) {
            let grid: Grid = rowsToGrid(makeRandomGrid(n, n, 0.5), "genetic")
            const [solved,gens] = geneticSolve(grid);
            if (solved !== null) {
                solvedGrids += 1
                solvedIterations += gens
            }
        }
        solveRates.set(n, [solvedGrids / gridNum, solvedIterations / solvedGrids])
        console.log(`Solved ${solvedGrids} out of ${gridNum} grids with ${n}x${n} grid. Average solved in ${solvedIterations / solvedGrids} generations.`)
    }
    console.log(solveRates)
});