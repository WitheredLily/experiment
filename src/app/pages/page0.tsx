import {loadingGrid, PageProps} from "./util/page";
import {ChoiceQuestion} from "./util/question";
import React, {useState} from "react";
import {Grid} from "../../game/nonogram";
import {BacktrackSolve} from "../../game/solvers/backtracking-solver";
import {VisualGrid} from "../../game/board";
import {constraintPropagationSolve} from "../../game/solvers/constraint-solver";
import {geneticSolve} from "../../game/solvers/genetic-solver";
import {number} from "zod";

export function Page0({ createLink }: PageProps) {
    const [grid1, setGrid1] = useState<Grid | null>(null);
    const [grid2, setGrid2] = useState<Grid | null>(null);
    const [grid3, setGrid3] = useState<Grid | null>(null);

    const cols1 = 10;
    const rows1 = 10;

    loadingGrid("gridA1", cols1, rows1, setGrid1, 0.5);
    loadingGrid("gridA2", cols1, rows1, setGrid2, 0.75);
    loadingGrid("gridA3", cols1, rows1, setGrid3, 0.75);

    if (!grid1 || !grid2 || !grid3) {
        return <div>Loading grid...</div>;
    }

    BacktrackSolve(grid1)
    return (
        <div>
            <div className="tabContent-header">
                <h1>Hello</h1>
            </div>
            <div className="tabContent">
                <h1>Home Page</h1>
                <VisualGrid grid={grid1} nonInteractive={true}/>
                <p>Constraint</p>
                <VisualGrid grid={grid1} onGridChange={setGrid1} selfSolving={constraintPropagationSolve} />
                <p>Backtracking</p>
                <VisualGrid grid={grid2} onGridChange={setGrid2} selfSolving={BacktrackSolve} />
                <p>Genetic</p>
                <VisualGrid grid={grid3} onGridChange={setGrid3} selfSolving={geneticSolve} />
            </div>
            <nav className={"navButton"}>
                {createLink(1,"Start")}
            </nav>
        </div>
    );
}