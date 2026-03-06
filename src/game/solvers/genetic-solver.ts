import {Grid, CellState, Clues, makeRandomGrid} from "../nonogram"

const POPULATION_SIZE = 200;
const MUTATION_RATE = 0.03;
const NUM_GENERATIONS = 10000;
const ELITE_COUNT = 1;

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

function fitness(
    chromosome: Chromosome,
    rowOptions: CellState[][][],
    colOptions: CellState[][][]
): number {

    const grid = chromosomeToGrid(chromosome, rowOptions);
    let totalPenalty = 0;

    for (let c = 0; c < grid[0].length; c++) {
        const column = grid.map(row => row[c]);
        totalPenalty += columnDistance(column, colOptions[c]);
    }

    for (let c = 0; c < grid[0].length; c++) {
        const row = grid[c];
        totalPenalty += columnDistance(row, rowOptions[c]);
    }

    return -totalPenalty; // 0 is perfect
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
    const child: Chromosome = [];

    for (let r = 0; r < p1.length; r++) {
        child[r] = Math.random() < 0.5 ? p1[r] : p2[r];
    }

    return child;
}

function mutate(
    chromosome: Chromosome,
    rowOptions: CellState[][][]
) {
    for (let r = 0; r < chromosome.length; r++) {
        if (Math.random() < MUTATION_RATE) {
            chromosome[r] =
                Math.floor(Math.random() * rowOptions[r].length);
        }
    }
}

function geneticAlgorithm(grid: Grid): [TestGrid | null, TestGrid[]] {
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

    for (let generation = 0; generation < NUM_GENERATIONS; generation++) {

        const fitnesses = population.map(ch =>
            fitness(ch, rowOptions, colOptions)
        );

        const bestFitness = Math.max(...fitnesses);
        const bestIndex = fitnesses.indexOf(bestFitness);

        console.log(`Gen ${generation}: Best = ${bestFitness}`);

        if (generation % 100 === 0) {
            //console.log(`Gen ${generation}: Best = ${bestFitness}`);
            bestGrids.push(chromosomeToGrid(population[bestIndex], rowOptions))
        }

        if (bestFitness === 0) {
            console.log("Solved at generation", generation);
            return [chromosomeToGrid(population[bestIndex], rowOptions),bestGrids];
        }

        const newPopulation: Chromosome[] = [];

        // Elitism
        for (let i = 0; i < ELITE_COUNT; i++) {
            newPopulation.push([...population[bestIndex]]);
        }

        while (newPopulation.length < POPULATION_SIZE) {
            const p1 = tournamentSelect(population, fitnesses);
            const p2 = tournamentSelect(population, fitnesses);
            const child = crossover(p1, p2);
            mutate(child, rowOptions);
            newPopulation.push(child);
        }

        population = newPopulation;
    }

    return [null, bestGrids];
}

function geneticSolve(grid: Grid): boolean {
    const solution = geneticAlgorithm(grid);
    if (!solution[0]) return false;

    solution[0].forEach((row, x) => {
        row.forEach((cell, y) => {
            grid.updateCell(x, y, cell);
        });
    });

    return true;
}



function geneticSolveSteps(grid: Grid):TestGrid[] {
    let solution = geneticAlgorithm(grid)
    return solution[1]
}


export {geneticSolve, geneticSolveSteps}