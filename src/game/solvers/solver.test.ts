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