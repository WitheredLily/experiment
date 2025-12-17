import React, {useState} from "react";
import {loadingGrid, PageProps} from "./util/page";
import {VisualGrid} from "../../game/board";
import {Grid} from "../../game/nonogram";
import {getBacktrackSolution, BacktrackSolve} from "../../game/solvers/backtracking-solver";
import {constraintPropagationSolve} from "../../game/solvers/constraint-solver";

export function Page3({ createLink }: PageProps) {
    const [grid1, setGrid1] = useState<Grid | null>(null);
    const [grid2, setGrid2] = useState<Grid | null>(null);

    const cols1 = 10;
    const rows1 = 10;
    const cols2 = 2;
    const rows2 = 3;

    loadingGrid("grid2", cols1, rows1, setGrid1, 0.75);
    loadingGrid("gridGraphic", cols2, rows2, setGrid2, 0.5);

    if (!grid1 || !grid2) {
        return <div>Loading grid...</div>;
    }

    return (
        <div style={{padding: "1rem"}} className="tabcontent">
            <h1>Page 3</h1>
            <VisualGrid grid={grid1} onGridChange={setGrid1} selfSolving={constraintPropagationSolve} />
            <br />
            <VisualGrid grid={grid2} onGridChange={setGrid2} nonInteractive={true} inputGraphic={getBacktrackSolution(grid2)} selfSolving={BacktrackSolve}/>
            <nav>
                {createLink(2, "Back")} | {createLink(4, "Forward")}
            </nav>
        </div>
    );
}
