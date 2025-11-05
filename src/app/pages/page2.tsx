import React, { useState} from "react";
import { ClickableGrid } from "../../game/board";
import { Grid, loadGrid } from "../../game/nonogram";
import {PageProps} from "./util/page";

const cols = 2;
const rows = 2;

export function Page2({ createLink }: PageProps) {
    const [grid, setGrid] = useState<Grid>(() => {
        const gridId = "grid1";
        return loadGrid(gridId, cols, rows, 0.5);
    });

    return (
        <div style={{ padding: "1rem" }}>
            <h1>Page 2</h1>
            <ClickableGrid grid={grid} onGridChange={setGrid} />
            <nav>
                {createLink(1, "Back")} | {createLink(3, "Forward")}
            </nav>
        </div>
    );
}