import React, { useState } from "react";
import { ClickableGrid } from "./game/board";
import { makeRandomGrid } from "./game/nonogram";

export default function App() {
    const cols = 5;
    const rows = 5;

    const [grid, setGrid] = useState(() => makeRandomGrid(cols, rows, 0.5));

    return (
        <div style={{ padding: "1rem" }}>
            <h1>Exclusive Color Grid</h1>
            <ClickableGrid grid={grid} onGridChange={setGrid} />
        </div>
    );
}