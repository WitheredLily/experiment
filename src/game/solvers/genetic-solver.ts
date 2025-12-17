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

function geneticSolve(grid: Grid): boolean {

    const config: GeneticSearchConfig = {
        populationSize: 100,
        survivalRate: 0.5,
        crossoverRate: 0.5,
    };

    const strategies: GeneticSearchStrategyConfig<ParabolaArgumentGenome> = {
        populate: new ParabolaPopulateStrategy(),
        phenome: new ParabolaMultiprocessingPhenomeStrategy({
            poolSize: 4,
            task: async (data) => [-((data[0] - 12)**2) - 3],
            onTaskResult: () => void 0,
        }),
        fitness: new ParabolaMaxValueFitnessStrategy(),
        sorting: new DescendingSortingStrategy(),
        selection: new RandomSelectionStrategy(2),
        mutation: new ParabolaMutationStrategy(),
        crossover: new ParabolaCrossoverStrategy(),
        cache: new SimplePhenomeCache(),
    }

    const search = new GeneticSearch(config, strategies);

    expect(search.partitions).toEqual([50, 25, 25]);

    await search.fit({
        generationsCount: 100,
        beforeStep: () => void 0,
        afterStep: () => void 0,
    });

    const bestGenome = search.bestGenome;
    console.log('Best genome:', bestGenome);

    console.log("Genetic solver not implemented yet")
    return false
}

export {geneticSolve}