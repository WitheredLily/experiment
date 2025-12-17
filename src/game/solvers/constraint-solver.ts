import {Grid, CellState, Clues} from "../nonogram"
import {findPackageJSON} from "node:module";
import type {
    GeneticSearchConfig,
    GeneticSearchStrategyConfig,
} from "genetic-search";
import {
    GeneticSearch,
    SimplePhenomeCache,
    DescendingSortingStrategy,
    RandomSelectionStrategy,
} from "genetic-search";

function constraintPropagationSolve(grid: Grid): boolean {
    let updateGrid  = (grid:Grid, x:number, y:number, state:CellState) => {
        grid.updateCell(x, y, state)
    }
    // Placeholder for constraint propagation solver
    console.log("Constraint propagation solver not implemented yet")
    //simpleBox(grid, updateGrid)
    //simpleSpace(grid, updateGrid)
    return false
}

function constraintPropagationSteps(grid: Grid): [number, number, CellState][][] {
    let newGrid = grid.clone()
    let steps: [number, number, CellState][][] = [[]]
    let updateGrid  = (grid:Grid, x:number, y:number, state:CellState) => {
        grid.updateCell(x, y, state)
        steps[0].push([x,y,state])
    }
    // Placeholder for constraint propagation solver
    console.log("Constraint propagation solver not implemented yet")
    simpleBox(newGrid, updateGrid)
    simpleSpace(grid, updateGrid)
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
    // TODO: Fix
    function simpleSpaceLine(clues: Clues, line: CellState[]): boolean[] {
        let markedArray:boolean[] = new Array(line.length).fill(false)
        let position = 0
        let nextMinPosition = -1
        let count = 0;
        let found = false;
        let left = true;
        let lastNonBlank = -1;
        let variance = 0;
        clues.getNumbers().forEach((clue, index) => {
            nextMinPosition += clue + 1;
            for (let i = 0; i < clue; i++) {
                switch (line[position]) {
                    case CellState.Blank:
                        count++;
                        if (count > clue && !found){
                            count--;
                            markedArray[index - clue - 1] = true;
                        }
                        break;
                    case CellState.Marked:
                        if (count < clue) {
                            for (let j = lastNonBlank; j < index; j++) {
                                markedArray[j] = true;
                            }
                            nextMinPosition += index;
                        }
                        count = 0;
                        break;
                    case CellState.Filled:
                        if (found) {

                        }
                        count++;
                        break;
                }
            }
        })
        return markedArray;
    }
    return true
}

// function forcing(grid: Grid, updateGrid: (grid: Grid, x: number, y: number, state: CellState) => void): boolean {
//     function forceLine(clues: Clues, line: CellState[]): CellState[] {
//         const n = line.length;
//         const newLine = [...line];
//
//         // Helper: Check if a block of length `length` can fit at position `start`
//         const canFit = (start: number, length: number) => {
//             if (start + length > n) return false;
//             for (let i = start; i < start + length; i++) {
//                 if (newLine[i] === CellState.Marked) return false;
//             }
//             return true;
//         };
//
//         // Step 1: Force blocks to one side if spaces make it necessary
//         let pos = 0;
//         for (const clue of clues.getNumbers()) {
//             // Find the leftmost and rightmost positions where this clue can fit
//             let left = pos;
//             while (left < n && !canFit(left, clue)) left++;
//             let right = n - clue;
//             while (right >= pos && !canFit(right, clue)) right--;
//
//             // If only one position possible, force the block
//             if (left === right) {
//                 for (let i = left; i < left + clue; i++) {
//                     newLine[i] = CellState.Filled;
//                 }
//             }
//
//             pos = left + clue + 1; // move past this block for the next
//         }
//
//         // Step 2: Fill spaces that are too small to fit any clue
//         for (let i = 0; i < n; i++) {
//             if (newLine[i] === CellState.Blank) {
//                 const fitsAny = clues.getNumbers().some(clue => {
//                     // Check if a block of length `clue` could fit starting at i
//                     for (let start = i - clue + 1; start <= i; start++) {
//                         if (start >= 0 && canFit(start, clue)) return true;
//                     }
//                     return false;
//                 });
//                 if (!fitsAny) newLine[i] = CellState.Marked;
//             }
//         }
//
//         // Step 3: Apply simple box logic (overlapping regions)
//         for (const clue of clues.getNumbers()) {
//             const maxStart = n - clue;
//             const minStart = 0;
//
//             const overlap = Array(n).fill(false);
//             for (let start = minStart; start <= maxStart; start++) {
//                 if (canFit(start, clue)) {
//                     for (let i = start; i < start + clue; i++) overlap[i] = true;
//                 }
//             }
//             for (let i = 0; i < n; i++) {
//                 if (overlap[i]) newLine[i] = CellState.Filled;
//             }
//         }
//
//         return newLine;
//     }
//
// }

export {constraintPropagationSolve}