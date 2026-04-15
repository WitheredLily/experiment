import {BacktrackSolve, getBacktrackSolution} from "./backtracking-solver";
import {geneticSolve, geneticSolveSteps} from "./genetic-solver";
import {CellState, Grid, makeRandomGrid, rowsToGrid} from "../nonogram";

describe("Backtracking Solver", () => {
  it("solves a 1x1 filled puzzle", () => {
    const grid = rowsToGrid([[true]]);

    const solved = BacktrackSolve(grid);

    expect(solved).toBe(true);
    expect(grid.isSolved()).toBe(true);
    expect(grid.getCellStates()[0][0]).toBe(CellState.Filled);
  });

  it("solves a 2x2 puzzle correctly", () => {
    const boolGrid = [[true, false], [true, true]];

    const grid = rowsToGrid(boolGrid);

    const solved = BacktrackSolve(grid);

    expect(solved).toBe(true);
    expect(grid.isSolved()).toBe(true);
  });

  it("returns false for impossible puzzle", () => {
    const numbersX = [[2]]; // impossible for 1x1
    const numbersY = [[1]];

    const grid = new Grid(numbersX, numbersY);

    const solved = BacktrackSolve(grid);

    expect(solved).toBe(false);
  });

  it("tracks steps in getBacktrackSolution", () => {
    const grid = rowsToGrid([[true]]);

    const steps = getBacktrackSolution(grid);

    expect(steps.length).toBeGreaterThan(0);

    // Each step should contain [x,y,state]
    const firstStep = steps[0][0];
    expect(firstStep.length).toBe(3);
  });
});

describe("Genetic Solver", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("solves a simple 1x1 puzzle", () => {
    const grid = rowsToGrid([[true]]);

    const [solution, generations] = geneticSolve(grid);

    expect(solution).not.toBeNull();
    expect(solution?.isSolved()).toBe(true);
    expect(generations).toBeGreaterThanOrEqual(0);
  });

  it("returns null for impossible puzzle", () => {
    const numbersX = [[2]]; // impossible for 1x1
    const numbersY = [[1]];

    const grid = new Grid(numbersX, numbersY);

    const [solution] = geneticSolve(grid);

    expect(solution).toBeNull();
  });

  it("returns intermediate best grids", () => {
    const grid = rowsToGrid([[true]]);

    const steps = geneticSolveSteps(grid);

    expect(Array.isArray(steps)).toBe(true);
    expect(steps.length).toBeGreaterThan(0);
  });

  it("does not mutate original grid", () => {
    const grid = rowsToGrid([[true]]);
    const originalState = JSON.stringify(grid.getCellStates());

    geneticSolve(grid);

    expect(JSON.stringify(grid.getCellStates())).toBe(originalState);
  });
});

test("Genetic Solver Success Rate", () => {
  const gridNum = 100;
  const solveRates = new Map<number, [number, number]>();

  for (let n = 3; n <= 20; n += 1) {
    let solvedGrids = 0;
    let solvedIterations = 0;

    for (let i = 0; i < gridNum; i++) {
      const grid: Grid = rowsToGrid(makeRandomGrid(n, n, 0.5));
      const [solved, gens] = geneticSolve(grid);

      if (solved !== null) {
        solvedGrids++;
        solvedIterations += gens;
      }
    }

    const successRate = solvedGrids / gridNum;
    const avgGenerations =
      solvedGrids > 0 ? solvedIterations / solvedGrids : 0;

    solveRates.set(n, [successRate, avgGenerations]);

    console.log(`Solved ${solvedGrids}/${gridNum} (${(successRate * 100).toFixed(1)}%) ` +
        `for ${n}x${n}. Avg gens: ${avgGenerations.toFixed(2)}`);
  }

  console.log(Object.fromEntries(solveRates));
});

