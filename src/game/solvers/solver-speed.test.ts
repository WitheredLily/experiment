/*
import {Grid, makeRandomGrid, rowsToGrid} from "../nonogram";
import {getBacktrackSolution} from "./backtracking-solver";
import {geneticSolve} from "./genetic-solver";
import Console from "node:console";

test("Backtrack Speed", () => {
  const gridNum = 1000;
  const solveRates = new Map<number, [number, number]>();

  for (let n = 3; n <= 20; n++) {
    let solvedGrids = 0;
    let solvedIterations = 0;

    // Pre-generate grids (not timed)
    const grids: Grid[] = Array.from({ length: gridNum }, () =>
      rowsToGrid(makeRandomGrid(n, n, 0.5)));

    const startTime = performance.now();

    for (const grid of grids) {
      const solution = getBacktrackSolution(grid);

      if (solution !== null) {
        solvedGrids++;
        solvedIterations += solution.length;
      }
    }

    const endTime = performance.now();

    const successRate = solvedGrids / gridNum;
    const avgMoves =
      solvedGrids > 0 ? solvedIterations / solvedGrids : 0;
    const avgTimeMs = (endTime - startTime) / gridNum;

    solveRates.set(n, [successRate, avgMoves]);

    console.log(`n=${n} | ` +
            `Solved ${solvedGrids}/${gridNum} (${(successRate * 100).toFixed(1)}%) | ` +
            `Avg Moves: ${avgMoves.toFixed(2)} | ` +
            `Avg Time: ${avgTimeMs.toFixed(3)} ms`);
  }

  console.log(Object.fromEntries(solveRates));
});

test("Genetic Solver Success Rate", () => {
  const testStartTime = performance.now();
  const gridNum = 100;
  const solveRates = new Map<number, [number, number,number,number, number]>();

  for (let n = 13; n <= 20; n++) {
    let solvedGrids = 0;
    let solvedGenSum = 0;
    let totalGenSum = 0;

    const grids: Grid[] = Array.from({ length: gridNum }, () =>
      rowsToGrid(makeRandomGrid(n, n, 0.5)));

    let timeTotal = 0;

    let successTimeTotal = 0;

    for (const grid of grids) {
      const startTime = performance.now();
      const [solved, gens] = geneticSolve(grid);
      const endTime = performance.now();

      totalGenSum += gens;
      timeTotal += endTime - startTime;

      if (solved) {
        if (!solved.isSolved()) console.log("False Solve Detected");
        successTimeTotal += endTime - startTime;
        solvedGrids++;
        solvedGenSum += gens;
      }
    }

    const endTime = performance.now();

    const successRate = solvedGrids / gridNum;
    const avgGenSuccess =
      solvedGrids > 0 ? solvedGenSum / solvedGrids : 0;
    const avgGenAll = totalGenSum / gridNum;
    const avgTimeMs = timeTotal / gridNum;
    const avgSuccessTimeMs = successTimeTotal / solvedGrids;

    solveRates.set(n, [successRate, avgGenSuccess, avgGenAll, avgTimeMs,avgSuccessTimeMs]);

    console.log(`n=${n} | ` +
            `Solved ${solvedGrids}/${gridNum} (${(successRate * 100)}%) | ` +
            `AvgGen(success): ${avgGenSuccess} | ` +
            `AvgGen(all): ${avgGenAll} | ` +
            `AvgTime: ${avgTimeMs} ms` +
            `AvgSuccessTime: ${avgSuccessTimeMs} ms`);
    const currentTime = new Date(endTime - testStartTime);
    const days = currentTime.getUTCDate() - 1;
    const hours = currentTime.getUTCHours();
    const minutes = currentTime.getUTCMinutes();
    const seconds = currentTime.getUTCSeconds();
    Console.log(`Time Total: ${days}:${hours}:${minutes}:${seconds}`);
  }

  console.log(Object.fromEntries(solveRates));
});
 */

test("Genetic Solver Success Rate", () => {});