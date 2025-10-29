import React, { useState } from "react";
import { ClickableGrid } from "./game/board";
import {Grid, loadGrid} from "./game/nonogram";

export default function App() {
    const cols = 5;
    const rows = 5;

    const [grid, setGrid] = useState((): Grid => {
        //localStorage.clear();
        let gridId = "grid1";
        return loadGrid(gridId, cols, rows, 0.5);
        });

    return (
        <div style={{ padding: "1rem" }}>
            <ClickableGrid grid={grid} onGridChange={setGrid} />
        </div>
    );
}