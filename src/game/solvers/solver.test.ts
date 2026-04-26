import {BacktrackSolve, getBacktrackSolution} from "./backtracking-solver";
import {geneticSolve, geneticSolveSteps} from "./genetic-solver";
import {CellState, Grid, rowsToGrid} from "../nonogram";

describe("Backtracking Solver", () => {
  it("solves a 1x1 filled puzzle", () => {
    const grid = rowsToGrid([[true]]);

    const solved = BacktrackSolve(grid);

    expect(solved).toBe(true);
    expect(grid.isSolved()).toBe(true);
    expect(grid.getCellStates()[0][0]).toBe(CellState.Filled);
  });

  it("solves a 1x1 blank puzzle", () => {
    const grid = rowsToGrid([[false]]);

    const solved = BacktrackSolve(grid);

    expect(solved).toBe(true);
    expect(grid.isSolved()).toBe(true);
    expect(grid.getCellStates()[0][0]).toBe(CellState.Marked);
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

    const firstStep = steps[0];
    expect(firstStep.length).toBe(3);
  });

  it("does not mutate the original grid in getBacktrackSolution", () => {
    const grid = rowsToGrid([[true]]);
    const originalState = JSON.stringify(grid.getCellStates());

    getBacktrackSolution(grid);

    expect(JSON.stringify(grid.getCellStates())).toBe(originalState);
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

  it("returns intermediate best grids", () => {
    const grid = rowsToGrid([[true]]);

    const steps = geneticSolveSteps(grid);

    expect(Array.isArray(steps)).toBe(true);
    expect(steps.length).toBeGreaterThan(0);
    expect(Array.isArray(steps[0])).toBe(true);
  });

  it("does not mutate original grid", () => {
    const grid = rowsToGrid([[true]]);
    const originalState = JSON.stringify(grid.getCellStates());

    geneticSolve(grid);

    expect(JSON.stringify(grid.getCellStates())).toBe(originalState);
  });

  it("does not mutate original grid when generating steps", () => {
    const grid = rowsToGrid([[true]]);
    const originalState = JSON.stringify(grid.getCellStates());

    geneticSolveSteps(grid);

    expect(JSON.stringify(grid.getCellStates())).toBe(originalState);
  });

});

describe("Genetic Solver internal-branch coverage", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("does not mutate the input grid when generating steps", () => {
    const grid = rowsToGrid([[true]]);
    const original = JSON.stringify(grid.getCellStates());

    geneticSolveSteps(grid);

    expect(JSON.stringify(grid.getCellStates())).toBe(original);
  });

  it("returns at least one intermediate grid for a simple puzzle", () => {
    const grid = rowsToGrid([[true]]);

    const steps = geneticSolveSteps(grid);

    expect(steps.length).toBeGreaterThan(0);
    expect(steps[0].length).toBe(1);
    expect(steps[0][0].length).toBe(1);
  });

  it("can solve a puzzle with more than one valid row pattern", () => {
    const grid = rowsToGrid([[true, false], [false, true],]);

    const [solution] = geneticSolve(grid);

    expect(solution).not.toBeNull();
    expect(solution?.isSolved()).toBe(true);
  });

  it("handles mocked randomness without breaking step generation", () => {
    jest.spyOn(Math, "random").mockImplementation(() => 0.1);

    const grid = rowsToGrid([[true, false], [false, true],]);

    const steps = geneticSolveSteps(grid);

    expect(Array.isArray(steps)).toBe(true);
    expect(steps.length).toBeGreaterThan(0);
  });
});