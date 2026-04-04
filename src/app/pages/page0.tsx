import {loadingGrid, PageProps} from "./util/page";
import React from "react";
import {BacktrackSolve} from "../../game/solvers/backtracking-solver";
import {VisualGrid} from "../../game/board";
import {constraintPropagationSolve} from "../../game/solvers/constraint-solver";

export function Page0({ createLink }: PageProps) {
    const cols1 = 9;
    const rows1 = 9;

    const [grid1, setGrid1] = loadingGrid("gridA1", cols1, rows1, 0.25)
    const [grid2, setGrid2] = loadingGrid("gridA2", cols1, rows1, 0.75)
    const [grid3, setGrid3] = loadingGrid("gridA3", cols1, rows1, 0.5)

    if (!grid1 || !grid2 || !grid3) {
        return <div>Loading grid...</div>;
    }

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
                <VisualGrid grid={grid3} onGridChange={setGrid3} geneticGraphic={true} graphicSpeed={2} />
            </div>

            <nav className={"navButton"}>
                {createLink(1,"Start")}
            </nav>
        </div>
    );
}