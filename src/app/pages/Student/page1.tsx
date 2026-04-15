import { loadingGrid, PageProps } from "../util/page";
import React, { JSX, useMemo } from "react";
import { Grid, makeGrid } from "../../../game/nonogram";
import { BacktrackSolve } from "../../../game/solvers/backtracking-solver";
import { VisualGrid } from "../../../game/board";

export function Page1({ createLink }: PageProps): JSX.Element {
  const heartGridSolution = useMemo(() => {
    const g = new Grid([[0], [3], [2, 2], [2, 1, 2], [8], [8], [8], [8], [8], [7], [5], [3], [0]], [[0], [2, 2], [4, 4], [2, 8], [1, 9], [2, 8], [9], [7], [5], [3], [1]], "gridA1",);
    BacktrackSolve(g);
    return g;
  }, []);
  const [colsHeart, rowsHeart] = heartGridSolution.getSize();
  const [heartGrid, setHeartGrid] = loadingGrid("heartGrid", colsHeart, rowsHeart, 0.5, heartGridSolution);

  const amongSolution = useMemo(() => {
    const g = makeGrid([[false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,], [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,], [false, false, false, false, false, true, true, true, true, true, true, false, false, false, false, false,], [false, false, false, false, true, true, false, false, false, false, false, true, false, false, false, false,], [false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true,], [false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, true,], [false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, true,], [false, true, false, false, false, true, true, false, false, false, false, false, true, true, true, true,], [false, true, false, false, true, false, false, true, false, false, false, false, true, false, false, false,], [false, true, false, false, true, false, false, true, false, false, false, false, true, false, false, false,], [false, true, false, false, true, false, false, true, false, false, false, false, true, true, true, true,], [false, true, false, false, true, false, false, true, false, false, false, false, false, false, false, true,], [false, false, true, false, true, false, false, true, false, false, false, false, false, false, false, true,], [false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true,], [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,], [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,]]);
    return g;
  }, []);
  const [colsAmong, rowsAmong] = amongSolution.getSize();
  const [amongGrid, setAmongGrid] = loadingGrid("amongGrid", colsAmong, rowsAmong, 0.5, amongSolution);

  if (!heartGrid || !amongGrid) {
    return <div>Loading grid...</div>;
  }

  // BacktrackSolve(amongGrid)
  return (
    <div>
      <div className="tabContent-header">
        <h1>What is a nonogram?</h1>
      </div>
      <div className="tabContent">
        <p>A nonogram is a logic puzzle where you fill in squares on a grid to create a picture. Numbers are given at the start of each row and column, showing how many consecutive filled squares appear in that line.</p>
        <img src="/images/Key.svg" alt="Key" width="20%" />
        <p>Left click a cell to mark it as filled. Right click a cell to mark it as blank</p>
        <VisualGrid grid={heartGrid} onGridChange={setHeartGrid} noSolve />
        <VisualGrid grid={amongGrid} onGridChange={setAmongGrid} noSolve />
        <nav className="navButton">
          {createLink(2, "Next")}
        </nav>
      </div>
    </div>
  );
}
