import React, { useState } from "react";
import { ClickableGrid } from "./game/board";
import {Grid, makeRandomGrid} from "./game/nonogram";

export default function App() {
    const cols = 5;
    const rows = 5;

    const [grid, setGrid] = useState((): Grid => {
        let gridId = "grid1";
        if(localStorage.getItem(gridId)) {
            let loadedGrid = JSON.parse(localStorage.getItem(gridId)!) as Grid;
            if (!loadedGrid.solved){
                return loadedGrid
            }
        }
        return makeRandomGrid(cols, rows, 0.5, gridId)
        });

    return (
        <div style={{ padding: "1rem" }}>
            <ClickableGrid grid={grid} onGridChange={setGrid} />
        </div>
    );
}