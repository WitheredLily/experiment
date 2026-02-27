import {loadingGrid, PageProps} from "./util/page";
import React, {useState} from "react";
import {Grid, makeRandomGrid} from "../../game/nonogram";
import {BacktrackSolve} from "../../game/solvers/backtracking-solver";
import {VisualGrid} from "../../game/board";
import {ChoiceQuestion, CreateQuestionProps, QuestionProps, QuestionSection} from "./util/question";

export function Page1({ createLink, useLockableLink}: PageProps) {
    const [grid, setGrid] = useState<Grid | null>(null);
    const cols1 = 13;
    const rows1 = 13;
    //TODO: swap to using build function
    const grid1 = new Grid(
        [[0],[3],[2,2],[2,1,2],[8],[8],[8],[8],[8],[7],[5],[3],[0]],
        [[0],[2,2],[4,4],[2,8],[1,9],[2,8],[9],[7],[5],[3],[1]],
        "gridA1"
    );

    loadingGrid("gridA1", cols1, rows1, setGrid, 0.5, grid1);

    //let [lockedLink, lock] = createLockableLink(2,"Forward", true, "LinkA1");

    //let question: QuestionProps = CreateQuestionProps("A, B, or C", ["A","B","C"],[1])

    //let questionSect1 = QuestionSection([lock], [question])



    if (!grid) {
        return <div>Loading grid...</div>;
    }

    BacktrackSolve(grid)
    return (
        <div>
            <div className="tabContent-header">
                <h1>Hello</h1>
            </div>
        <div className="tabContent">
            <h1>What is a nonogram?</h1>
            <p>A nonogram is logic puzzle consisting of a grid of black and white squares with each row and column giving the number of black squares and their groupings,</p>
            <VisualGrid grid={grid} nonInteractive={true}/>
            <nav className={"navButton"}>
                {createLink(2,"Forward")}
            </nav>
        </div>
        </div>
    );
}