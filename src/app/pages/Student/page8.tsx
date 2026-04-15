import React from "react";
import { loadingGrid, PageProps } from "../util/page";
import { VisualGrid } from "../../../game/board";

export function Page8({ createLink }: PageProps) {
  const [graphicGrid, setGraphicGrid] = loadingGrid("gridGraphic", 8, 8, 0.5);

  if (!graphicGrid) return <div>Loading grid...</div>;
  return (
    <div>
      <div className="tabContent-header">
        <h1>Genetic Algorithms</h1>
      </div>
      <div style={{ padding: "1rem" }} className="tabContent">
        <div className="learning-section">
          <p>A genetic algorithm is a problem-solving method inspired by natural evolution. It starts with a group of possible solutions and tests how well each one works (this is called “fitness”). The best solutions are then combined and slightly changed (like reproduction and mutation in biology) to create a new generation of solutions. Over many generations, the solutions improve and get closer to the best possible answer. Genetic algorithms are often used to solve complex problems where trying every possible solution would take too long.</p>
          <p>A genetic algorithm won't always produce a solution. If the algorithm gets stuck in a nearly right solution (one that has high fitness) but the actual solution is significantly different, it will be unable to mutate out of its dead end.</p>
          <p>The steps a genetic algorithm might take is:</p>
          <ol>
            <li>Create a population of random solutions with chromosomes. In my example below I create every potential solution for each column then I combine my potential columns randomly into 200 different potential grids. Each column is a chromosome represented by an array of 0 (empty) and 1 (filled).</li>
            <li>Measure the fitness of each potential solution in the population.</li>
            <li>The best solution goes to the next generation.</li>
            <li>The next generation is created by taking a group of random solutions picking the best 2 and combining them randomly until you have a full new generation</li>
            <li>Potentially mutate by changing a chromosome.</li>
            <li>Repeat steps 2-5 until a perfect solution is found or the maximum number of generations is reached.</li>
          </ol>
          <div className="graphic-container">
            <VisualGrid grid={graphicGrid} onGridChange={setGraphicGrid} geneticGraphic graphicSpeed={2} shuffle />
          </div>
        </div>
        <nav className="navButton">
          {createLink(7, "Back")}
          {" "}
          |
          {createLink(9, "Next")}
        </nav>
      </div>
    </div>
  );
}
