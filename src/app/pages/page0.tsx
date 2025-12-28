import {loadingGrid, PageProps} from "./util/page";
import React, {useState} from "react";
import {Grid} from "../../game/nonogram";
import {BacktrackSolve} from "../../game/solvers/backtracking-solver";
import {VisualGrid} from "../../game/board";
import {constraintPropagationSolve} from "../../game/solvers/constraint-solver";
import {geneticSolve} from "../../game/solvers/genetic-solver";

export function Page0({ navigate }: PageProps) {
    const [grid1, setGrid1] = useState<Grid | null>(null);
    const [grid2, setGrid2] = useState<Grid | null>(null);
    const [grid3, setGrid3] = useState<Grid | null>(null);

    const cols1 = 20;
    const rows1 = 20;

    loadingGrid("gridA1", cols1, rows1, setGrid1, 0.5);
    loadingGrid("gridA2", cols1, rows1, setGrid2, 0.75);
    loadingGrid("gridA3", cols1, rows1, setGrid3, 0.75);

    if (!grid1 || !grid2 || !grid3) {
        return <div>Loading grid...</div>;
    }
    return (
        <div className="tabcontent">
            <h1>Home Page</h1>
            <p>Constraint</p>
            <VisualGrid grid={grid1} onGridChange={setGrid1} selfSolving={constraintPropagationSolve} />
            <p>Backtracking</p>
            <VisualGrid grid={grid2} onGridChange={setGrid2} selfSolving={BacktrackSolve} />
            <p>Genetic</p>
            <VisualGrid grid={grid3} onGridChange={setGrid3} selfSolving={geneticSolve} />
            <button onClick={() => navigate(1)}>Start</button>
        </div>
    );
}