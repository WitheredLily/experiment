import React, { useState } from "react";
import { ClickableGrid } from "./game/board";
import { createGrid } from "./game/nonogram";

export default function App() {
    const cols = 5;
    const rows = 5;

    // empty clue sets produce a blank grid of the requested size
    const numbersX = Array.from({ length: cols }, () => [] as number[]);
    const numbersY = Array.from({ length: rows }, () => [] as number[]);

    const [grid, setGrid] = useState(() => createGrid(numbersX, numbersY));

    return (
        <div style={{ padding: "1rem" }}>
            <h1>Exclusive Color Grid</h1>
            <ClickableGrid grid={grid} onGridChange={setGrid} />
        </div>
    );
}