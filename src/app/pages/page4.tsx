import React, {useEffect, useState} from "react";
import { VisualGrid } from "../../game/board";
import {loadingGrid, PageProps} from "./util/page";
import {Grid} from "../../game/nonogram";
import {getBacktrackSolution} from "../../game/solver";

export function Page4({ createLink }: PageProps) {
    localStorage.removeItem("gridGuide1");
    const [grid, setGrid] = useState<Grid | null>(null);
    const gridId = "gridGuide1";
    useEffect(() => {
        setGrid(new Grid([[1,1],[1,1]], [[1],[1],[1],[1]], gridId));
    }, []);

    if (!grid) return <div>Loading grid...</div>;
    return (
        <div style={{padding: "1rem"}} className="tabcontent">
            <h1>Hi, this section tests your back tracking</h1>
            <VisualGrid grid={grid} onGridChange={setGrid} inputOrder={getBacktrackSolution(grid)}/>
            <nav>
                {createLink(3, "Back")}
            </nav>
        </div>
    );
}
