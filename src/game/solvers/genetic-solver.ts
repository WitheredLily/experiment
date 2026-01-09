import {Grid, CellState, Clues, makeRandomGrid} from "../nonogram"

// -------------------------------
// CONFIGURATION
// -------------------------------
const POPULATION_SIZE = 50;
const MUTATION_RATE = 0.05;
const NUM_GENERATIONS = 1000;

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
    cluesX.forEach((clue, index) => {
        if (clue.checkClue(testGrid[index])) {
            score++;
        }
    })

    cluesY.forEach((clue, index) => {
        if (clue.checkClue(testGrid.map(column => column[index]))){
            score++;
        }
    })
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
function geneticAlgorithm(grid:Grid): [TestGrid, TestGrid[]] {
    let bestGrids: TestGrid[] = [];
    const [cols, rows] = grid.getSize();
    // Initialize population
    let population: TestGrid[] = [];
    for (let i = 0; i < POPULATION_SIZE; i++) {
        population.push(makeRandomGrid(cols, rows, 0.5).map(col => col.map(cell => cell ? CellState.Filled : CellState.Marked)));
    }

    for (let generation = 0; generation < NUM_GENERATIONS; generation++) {
        const fitnesses = population.map(testGrid => fitness(testGrid, grid.getCluesX(), grid.getCluesY()));

        // Check for solution
        const maxFitness = Math.max(...fitnesses);
        const bestIndex = fitnesses.indexOf(maxFitness);
        bestGrids.push(population[bestIndex]);
        console.log(`Gen ${generation}: Best fitness = ${maxFitness}`);
        if (maxFitness === cols + rows) {
            console.log("Solution found:");
            console.table(population[bestIndex]);
            return [population[bestIndex], bestGrids];
        }

        // Create next generation
        const newPopulation: TestGrid[] = [];
        while (newPopulation.length < POPULATION_SIZE) {
            const parent1 = selectParent(population, fitnesses);
            const parent2 = selectParent(population, fitnesses);
            const child = crossover(parent1, parent2);
            mutate(child);
            newPopulation.push(child);
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