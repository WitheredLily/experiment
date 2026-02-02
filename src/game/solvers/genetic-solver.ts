import {Grid, CellState, Clues, makeRandomGrid} from "../nonogram"

// -------------------------------
// CONFIGURATION
// -------------------------------
const POPULATION_SIZE = 100;
const MUTATION_RATE = 0.05;
const NUM_GENERATIONS = 100000;

type TestGrid = CellState[][];

// -------------------------------
// UTILITY FUNCTIONS
// -------------------------------

function cloneGrid(grid: TestGrid, ): TestGrid {
    return grid.map(row => [...row]);
}

// -------------------------------
// FITNESS FUNCTION
// -------------------------------
function fitness(testGrid: TestGrid, cluesX: Clues[], cluesY: Clues[]): number {
    let score = 0;

    // Rows
    for (let r = 0; r < testGrid.length; r++) {
        const runs = getRuns(testGrid[r]);
        score += runFitness(runs, cluesX[r].getNumbers());
    }

    // Columns
    for (let c = 0; c < testGrid[0].length; c++) {
        const column = testGrid.map(row => row[c]);
        const runs = getRuns(column);
        score += runFitness(runs, cluesY[c].getNumbers());
    }

    return score;
}

// -------------------------------
// SELECTION
// -------------------------------
function selectParent(population: TestGrid[], fitnesses: number[]): TestGrid {
    // Simple roulette-wheel selection
    const totalFitness = fitnesses.reduce((a, b) => a + b, 0);
    let pick = Math.random() * totalFitness;
    for (let i = 0; i < population.length; i++) {
        pick -= fitnesses[i];
        if (pick <= 0) return cloneGrid(population[i]);
    }
    return cloneGrid(population[population.length - 1]);
}

// -------------------------------
// CROSSOVER
// -------------------------------
function crossover(parent1: TestGrid, parent2: TestGrid): TestGrid {
    const rows = parent1.length;
    const cols = parent1[0].length;
    const child: TestGrid = [];

    for (let r = 0; r < rows; r++) {
        // Simple row-based crossover
        child.push(Math.random() < 0.5 ? [...parent1[r]] : [...parent2[r]]);
    }

    return child;
}

// -------------------------------
// MUTATION
// -------------------------------
function mutate(grid: TestGrid): void {
    const rows = grid.length;
    const cols = grid[0].length;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (Math.random() < MUTATION_RATE) {
                grid[r][c] = grid[r][c] === 2 ? 1 : 2; // flip cell
            }
        }
    }
}

// -------------------------------
// MAIN GA LOOP
// -------------------------------

function getRuns(line: CellState[]): number[] {
    const runs: number[] = [];
    let current = 0;

    for (const cell of line) {
        if (cell === CellState.Filled) {
            current++;
        } else if (current > 0) {
            runs.push(current);
            current = 0;
        }
    }
    if (current > 0) runs.push(current);

    return runs;
}

function runFitness(runs: number[], clue: readonly number[]): number {
    let score = 0;

    // Penalize run count mismatch
    score -= Math.abs(runs.length - clue.length) * 2;

    // Penalize run length mismatch
    const min = Math.min(runs.length, clue.length);
    for (let i = 0; i < min; i++) {
        score -= Math.abs(runs[i] - clue[i]);
    }

    return score;
}

function isSolved(
    grid: TestGrid,
    cluesX: Clues[],
    cluesY: Clues[]
): boolean {

    // Check all rows
    for (let r = 0; r < grid.length; r++) {
        if (!cluesX[r].checkClue(grid[r])) {
            return false;
        }
    }

    // Check all columns
    for (let c = 0; c < grid[0].length; c++) {
        const column = grid.map(row => row[c]);
        if (!cluesY[c].checkClue(column)) {
            return false;
        }
    }

    return true;
}


function geneticAlgorithm(grid:Grid): [TestGrid, TestGrid[]] {
    let bestGrids: TestGrid[] = [];
    const [cols, rows] = grid.getSize();
    // Initialize population
    let population: TestGrid[] = [];
    for (let i = 0; i < POPULATION_SIZE; i++) {
        population.push(makeRandomGrid(cols, rows, 0.5).map(col => col.map(cell => cell ? CellState.Filled : CellState.Marked)));
    }

    for (let generation = 0; generation < NUM_GENERATIONS; generation++) {
        const rawFitnesses = population.map(testGrid =>
            fitness(testGrid, grid.getCluesX(), grid.getCluesY())
        );
        const minFitness = Math.min(...rawFitnesses);
        const fitnesses = rawFitnesses.map(f => f - minFitness + 1);

        // Check for solution
        const maxFitness = Math.max(...fitnesses);
        const bestIndex = fitnesses.indexOf(maxFitness);
        bestGrids.push(cloneGrid(population[bestIndex]));
        if (generation % 100 === 0) {
            console.log(`Gen ${generation}: Best fitness = ${maxFitness}`);
        }
        for (let i = 0; i < population.length; i++) {
            if (isSolved(population[i], grid.getCluesX(), grid.getCluesY())) {
                console.log("Solved at generation", generation);
                return [population[i], bestGrids];
            }
        }


        // Create next generation
        const newPopulation: TestGrid[] = [];
        while (newPopulation.length < POPULATION_SIZE) {
            const parent1 = selectParent(population, fitnesses);
            const parent2 = selectParent(population, fitnesses);
            const child = crossover(parent1, parent2);
            mutate(child);
            newPopulation.push(child);
            newPopulation.push(cloneGrid(population[bestIndex]));
        }
        population = newPopulation;
    }
    const finalBestIndex = population.map(testGrid => fitness(testGrid, grid.getCluesX(), grid.getCluesY()))
        .indexOf(Math.max(...population.map(testGrid => fitness(testGrid, grid.getCluesX(), grid.getCluesY()))));
    return [population[finalBestIndex], bestGrids];
}

function geneticSolve(grid: Grid) {
    let solution = geneticAlgorithm(grid)
    if (solution) {
        if (solution[0]) {
            solution[0].forEach((col, x) => {
                col.forEach((cell, y) => {
                    grid.updateCell(x, y, cell)
                })
            })
        }
    }
    return solution !== undefined
}

async function geneticSolveSteps(grid: Grid) {
    async function sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    let solution = geneticAlgorithm(grid)
    for (let i = 0; i < solution[1].length; i++) {
        if (solution[1][i]) {
            solution[1][i].forEach((col, x) => {
                col.forEach((cell, y) => {
                    grid.updateCell(x, y, cell)
                })
            })
        }
        await sleep(1000)
    }
}


export {geneticSolve, geneticSolveSteps}