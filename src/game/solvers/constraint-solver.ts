import { Grid, CellState } from "../nonogram";

function fillArray(array: any[], firstNumber: number, lastNumber: number, value: any) {
  for (let i = firstNumber; i <= lastNumber; i++) {
    array[i] = value;
  }
}

function applyFunctionToAll(grid: Grid, updateGrid: (grid: Grid, x: number, y: number, state: CellState) => void, applyingFunction: (clues: readonly number[], line: CellState[]) => CellState[]): boolean {
  const states = grid.getCellStates();
  const [xSize, ySize] = grid.getSize();
  for (let x = 0; x < xSize; x++) {
    const lineSolution = applyingFunction(grid.getCluesX()[x].getNumbers(), grid.getCellStates()[x]);
    for (let i = 0; i < lineSolution.length; i++) {
      const solution = lineSolution[i];
      if (solution != CellState.Blank) {
        const currentState = states[x][i];
        if (currentState === CellState.Blank) {
          updateGrid(grid, x, i, solution);
        }
        else if (currentState != solution) {
          console.log(`Problem in applying function to column ${x} row ${i}, Column Clues: ${grid.getCluesX()[x].getNumbers().toString()}`);
          return false;
        }
      }
    }
  }
  for (let y = 0; y < ySize; y++) {
    const lineSolution = applyingFunction(grid.getCluesY()[y].getNumbers(), grid.getYCellStates(y));
    for (let i = 0; i < lineSolution.length; i++) {
      const solution = lineSolution[i];
      if (solution != CellState.Blank) {
        const currentState = states[i][y];
        if (currentState === CellState.Blank) {
          updateGrid(grid, i, y, solution);
        }
        else if (currentState != solution) {
          console.log(`Problem in applying function to column ${i} row ${y}, Row Clues: ${grid.getCluesY()[y].getNumbers().toString()}`);
          return false;
        }
      }
    }
  }
  return true;
}

function constraintPropagationSolve(grid: Grid): boolean {
  const updateGrid = (grid: Grid, x: number, y: number, state: CellState) => {
    grid.updateCell(x, y, state);
  };
  // Placeholder for constraint propagation solver
  console.log("Constraint propagation solver not implemented yet");
  // simpleBox(grid, updateGrid)
  simpleSpace(grid, updateGrid);
  return false;
}

function constraintPropagationSteps(grid: Grid): [number, number, CellState][][] {
  const newGrid = grid.clone();
  const steps: [number, number, CellState][][] = [[]];
  const updateGrid = (grid: Grid, x: number, y: number, state: CellState) => {
    grid.updateCell(x, y, state);
    steps[0].push([x, y, state]);
  };
  // Placeholder for constraint propagation solver
  console.log("Constraint propagation solver not implemented yet");
  simpleBox(newGrid, updateGrid);
  // simpleSpace(grid, updateGrid)
  return steps;
}

function simpleBox(grid: Grid, updateGrid: (grid: Grid, x: number, y: number, state: CellState) => void): boolean {
  const [xSize, ySize] = grid.getSize();
  function simpleBoxLine(clues: readonly number[], line: CellState[]): number[] {
    const size = line.length;
    const leftSolution: number[] = new Array(size).fill(-1);
    let position = 0;
    clues.forEach((clue, index) => {
      for (let i = 0; i < clue; i++) {
        leftSolution[position] = index;
        position++;
      }
      position++;
    });
    position = size - 1;
    const rightSolution: number[] = new Array(size).fill(-1);
    clues.toReversed().forEach((clue, index) => {
      for (let i = 0; i < clue; i++) {
        rightSolution[position] = clues.length - index - 1;
        position--;
      }
      position--;
    });
    const finalSolution: number[] = new Array(size).fill(0);
    for (let i = 0; i < size; i++) {
      if (leftSolution[i] > -1 && leftSolution[i] === rightSolution[i]) {
        finalSolution[i] = 1;
      }
    }
    return finalSolution;
  }
  const states = grid.getCellStates();
  return applyFunctionToAll(grid, updateGrid, simpleBoxLine);
}

function simpleSpace(grid: Grid, updateGrid: (grid: Grid, x: number, y: number, state: CellState) => void): boolean {
  function simpleSpaceLine(clues: readonly number[], line: CellState[]): number[] {
    function simpleSpaceDirection(clues: readonly number[], line: CellState[]): CellState[] {
      const solution: CellState[] = new Array(line.length).fill(CellState.Blank);
      let lastMarked = 0;
      let lastFilled = -1;
      let firstFilled = -1;
      let possible = 0;
      let filledFound = false;
      const clueNumber = 0;
      line.forEach((state, index) => {
        switch (state) {
          case CellState.Blank:
            possible++;
            if (filledFound && possible - firstFilled >= clues[clueNumber]) {
              for (let i = lastFilled + 1; i < index; i++) {
                solution[i] = CellState.Marked;
              }
            }
            break;
          case CellState.Filled:
            possible++;
            filledFound = true;
            lastFilled = index;
            if (firstFilled === -1) firstFilled = index;
            break;
          case CellState.Marked:
            if (possible < clues[clueNumber]) {
              if (!filledFound) {
                for (let i = lastMarked; i <= index; i++) {
                  solution[i] = CellState.Marked;
                }
              }
              else {
                console.log("Error in simple box solver, filled found but not possible");
                return solution;
              }
            }
            else if (filledFound) {
              for (let i = lastMarked; i <= index - clues[clueNumber]; i++) {
                solution[i] = CellState.Marked;
              }
            }
            else {
              return solution;
            }
            possible = 0;
            lastMarked = index;
            break;
        }
      });
      return solution;
    }
    const leftSolution = simpleSpaceDirection(clues, line);
    const rightSolution = simpleSpaceDirection(clues.toReversed(), line.toReversed()).toReversed();
    const finalSolution: CellState[] = new Array(line.length).fill(CellState.Blank);
    for (let i = 0; i < leftSolution.length; i++) {
      if (leftSolution[i] != CellState.Blank) {
        if (rightSolution[i] != CellState.Blank) {
          if (leftSolution[i] != rightSolution[i]) {
            console.log("Error in simple box solver, left and right solution differ");
            return finalSolution;
          }
        }
        finalSolution[i] = leftSolution[i];
      }
      else if (rightSolution[i] != CellState.Blank) {
        finalSolution[i] = rightSolution[i];
      }
    }
    return finalSolution;
  }

  return applyFunctionToAll(grid, updateGrid, simpleSpaceLine);
}

function forcing(grid: Grid, updateGrid: (grid: Grid, x: number, y: number, state: CellState) => void): boolean {
  function forcingLine(clues: readonly number[], line: CellState[]): number[] {
    const markedArray: [number, CellState][] = [];
    for (const cell of line) {
      const lastCell = markedArray[markedArray.length - 1] ?? [0, -1];
      if (lastCell[1] === cell) {
        lastCell[0]++;
      }
      else {
        markedArray.push([1, cell]);
      }
    }
    const runningSpace = 0;
    const finalArray: number[] = new Array(line.length).fill(0);
    let cellNumber = 0;
    let lastMarked = -1;
    for (const section of markedArray) {
      if (section[1] === CellState.Marked) {
        const requiredSpace = [0, 0];
        let lastRequiredSpace = [0, 0];
        for (const clue of clues) {
          requiredSpace[0] += clue;
          requiredSpace[1]++;
          if (requiredSpace[0] > runningSpace) {
            if (lastRequiredSpace[1] === 0) {
              fillArray(finalArray, lastMarked + 1, cellNumber - 1, true);
            }
          }

          lastRequiredSpace = requiredSpace.slice();
          requiredSpace[0]++;
        }
        lastMarked = section[0] - 1;
      }
      cellNumber++;
    }
    return finalArray;
  }

  return applyFunctionToAll(grid, updateGrid, forcingLine);
}

/*
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
 */

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

export { constraintPropagationSolve };
