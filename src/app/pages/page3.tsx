import React, {useState} from "react";
import {loadingGrid, PageProps} from "./util/page";
import {VisualGrid} from "../../game/board";
import {Grid} from "../../game/nonogram";

export function Page3({ createLink }: PageProps) {
    const [grid, setGrid] = useState<Grid | null>(null);
    const image = "https://art.pixilart.com/sr246d63ced6c5c.png"
    const gridId = "grid2";
    const cols = 10; // adjust as needed
    const rows = 10;

    loadingGrid(gridId, cols, rows, setGrid, 0.5)

    if (!grid) return <div>Loading grid...</div>;

    return (
        <div style={{padding: "1rem"}} className="tabcontent">
            <h1>Page 3</h1>
            <VisualGrid grid={grid} onGridChange={setGrid}/>
            <br/>
            <img src={image} alt="Cat" width="500" height="600"/>
            <nav>
                {createLink(2, "Back")} | {createLink(4, "Forward")}
            </nav>
        </div>
    );
}