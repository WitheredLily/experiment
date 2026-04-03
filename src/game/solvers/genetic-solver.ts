import {Grid, CellState, Clues, makeRandomGrid} from "../nonogram"

const POPULATION_SIZE = 200;
const BASE_MUTATION_RATE = 0.02;
let MUTATION_RATE = BASE_MUTATION_RATE;
const NUM_GENERATIONS = 10000;
const ELITE_COUNT = 1;
const STAGNATION_LIMIT = 500;

export type TestGrid = CellState[][];

type Chromosome = number[];

function generateValidPatterns(
    clue: readonly number[],
    length: number
): CellState[][] {

    const results: CellState[][] = [];

    function backtrack(
        clueIndex: number,
        position: number,
        current: CellState[]
    ) {
        // If all clues placed
        if (clueIndex === clue.length) {
            // Fill remainder with empty
            if (position <= length) {
                const row = [
                    ...current,
                    ...Array(length - position).fill(CellState.Marked)
                ];
                results.push(row);
            }
            return;
        }

        const runLength = clue[clueIndex];

        // Calculate minimum required space remaining after this run
        const remainingRuns = clue.length - clueIndex - 1;
        const minRemainingLength =
            clue
                .slice(clueIndex + 1)
                .reduce((a, b) => a + b, 0)
            + remainingRuns; // spaces between remaining runs

        // Try all valid start positions
        for (
            let start = position;
            start <= length - runLength - minRemainingLength;
            start++
        ) {
            const newRow = [...current];

            // Fill gap before run
            for (let i = position; i < start; i++) {
                newRow.push(CellState.Marked);
            }

            // Fill run
            for (let i = 0; i < runLength; i++) {
                newRow.push(CellState.Filled);
            }

            let nextPos = start + runLength;

            // Add required space after run (if not last run)
            if (clueIndex < clue.length - 1) {
                newRow.push(CellState.Marked);
                nextPos++;
            }

            backtrack(clueIndex + 1, nextPos, newRow);
        }
    }

    // Special case: empty clue
    if (clue.length === 0) {
        return [Array(length).fill(CellState.Marked)];
    }

    backtrack(0, 0, []);
    return results;
}

function chromosomeToGrid(
    chromosome: Chromosome,
    rowOptions: CellState[][][]
): CellState[][] {
    return chromosome.map((gene, r) =>
        [...rowOptions[r][gene]]
    );
}

function columnDistance(
    column: CellState[],
    validPatterns: CellState[][]
): number {

    let best = Infinity;

    for (const pattern of validPatterns) {
        let dist = 0;
        for (let i = 0; i < column.length; i++) {
            if (column[i] !== pattern[i]) dist++;
        }
        best = Math.min(best, dist);
    }

    return best;
}

function fitness(chromosome: Chromosome, rowOptions: CellState[][][],
    colOptions: CellState[][][]
): number {
    let totalPenalty = 0;

    // Columns
    for (let c = 0; c < colOptions.length; c++) {
        const column = chromosome.map((gene, r) =>
            rowOptions[r][gene][c]
        );
        totalPenalty += columnDistance(column, colOptions[c]);
    }

    // // Rows
    // for (let r = 0; r < grid.length; r++) {
    //     const row = grid[r];
    //     totalPenalty += columnDistance(row, rowOptions[r]);
    // }

    return -totalPenalty;
}

function tournamentSelect(
    population: Chromosome[],
    fitnesses: number[],
    k = 3
): Chromosome {

    let bestIndex = -1;

    for (let i = 0; i < k; i++) {
        const idx = Math.floor(Math.random() * population.length);
        if (bestIndex === -1 || fitnesses[idx] > fitnesses[bestIndex]) {
            bestIndex = idx;
        }
    }

    return [...population[bestIndex]];
}

function crossover(p1: Chromosome, p2: Chromosome): Chromosome {
    const point = Math.floor(Math.random() * p1.length);
    return [
        ...p1.slice(0, point),
        ...p2.slice(point)
    ];
}

function rowsConflictingWithBestPattern(
    chromosome: Chromosome,
    rowOptions: CellState[][][],
    colOptions: CellState[][][],
    columnIndex: number
): number[] {

    const column = chromosome.map((gene, r) =>
        rowOptions[r][gene][columnIndex]
    );

    let bestPattern = colOptions[columnIndex][0];
    let bestDist = Infinity;

    for (const pattern of colOptions[columnIndex]) {
        let dist = 0;
        for (let i = 0; i < column.length; i++) {
            if (column[i] !== pattern[i]) dist++;
        }

        if (dist < bestDist) {
            bestDist = dist;
            bestPattern = pattern;
        }
    }

    const conflictingRows: number[] = [];

    for (let r = 0; r < column.length; r++) {
        if (column[r] !== bestPattern[r]) {
            conflictingRows.push(r);
        }
    }

    return conflictingRows;
}

function mutate(
    chromosome: Chromosome,
    rowOptions: CellState[][][],
    colOptions: CellState[][][]
) {

    const penalties = computeColumnPenalties(
        chromosome,
        rowOptions,
        colOptions
    );

    const worstColumn =
        penalties.indexOf(Math.max(...penalties));

    if (penalties[worstColumn] === 0) return;

    const conflictingRows =
        rowsConflictingWithBestPattern(
            chromosome,
            rowOptions,
            colOptions,
            worstColumn
        );

    if (conflictingRows.length === 0) return;

    // Mutate ONE conflicting row
    const r =
        conflictingRows[
            Math.floor(Math.random() * conflictingRows.length)
            ];

    let bestGene = chromosome[r];
    let bestScore = penalties[worstColumn];

    for (let i = 0; i < rowOptions[r].length; i++) {

        if (i === chromosome[r]) continue;

        chromosome[r] = i;

        const newColumn = chromosome.map((gene, rr) =>
            rowOptions[rr][gene][worstColumn]
        );

        const score = columnDistance(
            newColumn,
            colOptions[worstColumn]
        );

        if (score < bestScore) {
            bestScore = score;
            bestGene = i;
        }
    }

    chromosome[r] = bestGene;
}

function computeColumnPenalties(
    chromosome: Chromosome,
    rowOptions: CellState[][][],
    colOptions: CellState[][][]
): number[] {

    const penalties: number[] = [];

    for (let c = 0; c < colOptions.length; c++) {

        const column = chromosome.map((gene, r) =>
            rowOptions[r][gene][c]
        );

        penalties[c] = columnDistance(column, colOptions[c]);
    }

    return penalties;
}

function geneticAlgorithm(grid: Grid): [TestGrid | null, TestGrid[], number] {
    let bestGrids: TestGrid[] = []
    const [cols, rows] = grid.getSize();

    const cluesX = grid.getCluesX();
    const cluesY = grid.getCluesY();

    // Precompute valid row/column patterns
    const rowOptions = cluesX.map(clue =>
        generateValidPatterns(clue.getNumbers(), cols)
    );

    const colOptions = cluesY.map(clue =>
        generateValidPatterns(clue.getNumbers(), rows)
    );

    // Initialize population
    let population: Chromosome[] = [];

    for (let i = 0; i < POPULATION_SIZE; i++) {
        population.push(
            rowOptions.map(options =>
                Math.floor(Math.random() * options.length)
            )
        );
    }

    let bestEverFitness = -Infinity;
    let stagnationCounter = 0;

    for (let generation = 0; generation < NUM_GENERATIONS; generation++) {
        MUTATION_RATE = BASE_MUTATION_RATE * (1 - generation / NUM_GENERATIONS);
        const fitnesses = population.map(ch =>
            fitness(ch, rowOptions, colOptions)
        );

        const bestFitness = Math.max(...fitnesses);
        const bestIndex = fitnesses.indexOf(bestFitness);

        if (bestFitness > bestEverFitness) {
            bestEverFitness = bestFitness;
            stagnationCounter = 0;
        } else {
            stagnationCounter++;
        }

        let forceInjectDiversity = false;

        if (stagnationCounter >= STAGNATION_LIMIT) {
            forceInjectDiversity = true;
            stagnationCounter = 0;
        }

        //console.log(`Gen ${generation}: Best = ${bestFitness}`);

        let bestGrid = chromosomeToGrid(population[bestIndex], rowOptions)
        if (JSON.stringify(bestGrids[bestGrids.length - 1]) != JSON.stringify(bestGrid)) {
            bestGrids.push(chromosomeToGrid(population[bestIndex], rowOptions))
        }
        if (bestFitness === 0) {
            //console.log("Solved at generation: ", generation, chromosomeToGrid(population[bestIndex], rowOptions), bestGrids);
            return [chromosomeToGrid(population[bestIndex], rowOptions),bestGrids, generation];
        }

        const newPopulation: Chromosome[] = [];

        // Elitism
        for (let i = 0; i < ELITE_COUNT; i++) {
            newPopulation.push([...population[bestIndex]]);
        }

        while (newPopulation.length < POPULATION_SIZE) {

            if (forceInjectDiversity && newPopulation.length > ELITE_COUNT) {
                newPopulation.push(
                    rowOptions.map(options =>
                        Math.floor(Math.random() * options.length)
                    )
                );
                continue;
            }

            const p1 = tournamentSelect(population, fitnesses, 3 + Math.floor(generation / 2000));
            const p2 = tournamentSelect(population, fitnesses, 3 + Math.floor(generation / 2000));
            const child = crossover(p1, p2);
            if (Math.random() < MUTATION_RATE) {
                mutate(child, rowOptions, colOptions);
            }
            newPopulation.push(child);
        }

        population = newPopulation;
    }
    //console.log("No solution found");
    return [null, bestGrids, NUM_GENERATIONS];
}

function geneticSolve(grid: Grid): [Grid | null, number] {
    const [solution, a, gens] = geneticAlgorithm(grid);
    if (!solution) return [null,gens];

    const newGrid = grid.clone(); // You need a clone method

    solution.forEach((row, x) => {
        row.forEach((cell, y) => {
            newGrid.updateCell(x, y, cell);
        });
    });

    return [newGrid,gens];
}



function geneticSolveSteps(grid: Grid):TestGrid[] {
    let solution = geneticAlgorithm(grid)
    return solution[1]
}


export {geneticSolve, geneticSolveSteps}