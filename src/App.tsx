import React, { useState } from "react";
import { ClickableGrid } from "./game/board";
import { makeRandomGrid } from "./game/nonogram";

export default function App() {
    const cols = 10;
    const rows = 10;

    const [grid, setGrid] = useState(() => makeRandomGrid(cols, rows, 0.5));

    return (
        <div style={{ padding: "1rem" }}>
            <ClickableGrid grid={grid} onGridChange={setGrid} />
        </div>
    );
}