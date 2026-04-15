import React, { useState } from "react";
import { loadingGrid, PageProps } from "../util/page";
import { VisualGrid } from "../../../game/board";
import { makeRandomGrid, Grid, rowsToGrid } from "../../../game/nonogram";

export function Page3({ createLink, useLockableLink }: PageProps) {
  const defaultCols = 7;
  const defaultRows = 7;

  const [grid1, setGrid1] = loadingGrid("grid1", defaultCols, defaultRows, 0.75);
  const [lockedButton, reportSolved] = useLockableLink(4, "Next", ["grid1"]);

  // State for custom random grid
  const [customCols, setCustomCols] = useState(defaultCols);
  const [customRows, setCustomRows] = useState(defaultRows);
  const [customGrid, setCustomGrid] = useState<Grid | null>(null);

  const handleGenerateRandomGrid = () => {
    const newGrid = rowsToGrid(makeRandomGrid(customCols, customRows, 0.5));
    setCustomGrid(newGrid);
  };

  if (!grid1) {
    return <div>Loading grid...</div>;
  }

  return (
    <div>
      <div className="tabContent-header">
        <h1>Playing with nonograms</h1>
      </div>
      <div style={{ padding: "1rem" }} className="tabContent">
        <div className="learning-section">
          {/* Default nonogram */}
          <div className="question-container">
            <h2>Here is a nonogram to try:</h2>
            <VisualGrid
              grid={grid1}
              onGridChange={setGrid1}
              lock={locked => reportSolved("grid1", !locked)}
            />
          </div>

          <br />
          <nav className="navButton">
            {createLink(2, "Back")}
            {" "}
            |
            {lockedButton}
          </nav>
          <br />
          {/* Random grid generator */}
          <div className="graphic-container">
            <p>Here is a random nonogram generator you can play with:</p>
            <div style={{ marginBottom: "1rem" }}>
              <label>
                Rows:
                {" "}
                <input
                  type="number"
                  min={1}
                  value={customRows}
                  onChange={e => setCustomRows(Number(e.target.value))}
                />
              </label>
              {"  "}
              <label>
                Columns:
                {" "}
                <input
                  type="number"
                  min={1}
                  value={customCols}
                  onChange={e => setCustomCols(Number(e.target.value))}
                />
              </label>
              {"  "}
              <button onClick={handleGenerateRandomGrid}>Generate</button>
            </div>

            {customGrid && (
              <VisualGrid
                grid={customGrid}
                onGridChange={(newGrid: Grid) => setCustomGrid(newGrid)}
                lock={() => {}}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
