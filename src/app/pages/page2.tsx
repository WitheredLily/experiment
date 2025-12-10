import React, {useEffect, useState} from "react";
import { ClickableGrid } from "../../game/board";
import { Grid, loadGrid } from "../../game/nonogram";
import {PageProps} from "./util/page";

export function Page2({ createLink }: PageProps) {
    const [grid, setGrid] = useState<Grid | null>(null);
    const gridId = "grid1";
    const cols = 5; // adjust as needed
    const rows = 4;

    useEffect(() => {
        localStorage.removeItem(gridId); // optional: reset grid
        const load = async () => {
            try {
                const g = await loadGrid(
                    gridId,
                    cols,
                    rows,
                    0.5
                );
                setGrid(g);
            } catch (err) {
                console.error("Failed to load grid:", err);
            }
        };
        load();
    }, []);

    if (!grid) return <div>Loading grid...</div>;

    return (
        <div style={{ padding: "1rem" }} className="tabcontent">
            <h1>Page 2</h1>
            <ClickableGrid grid={grid} onGridChange={setGrid} selfSolving={true} />
            <br/>
            <nav>
                {createLink(1, "Back")} | {createLink(3, "Forward")}
            </nav>
        </div>
    );
}
