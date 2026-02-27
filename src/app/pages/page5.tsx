import React, {useEffect, useState} from "react";
import { VisualGrid } from "../../game/board";
import {loadingGrid, PageProps} from "./util/page";
import {Grid} from "../../game/nonogram";
import {getBacktrackSolution} from "../../game/solvers/backtracking-solver";
import {CreateQuestionProps, QuestionProps, QuestionSection} from "./util/question";

export function Page5({ createLink, useLockableLink }: PageProps) {
    localStorage.removeItem("gridGuide1");
    const [grid, setGrid] = useState<Grid | null>(null);
    const gridId = "gridGuide1";
    useEffect(() => {
        setGrid(new Grid([[1,1],[1,1]], [[1],[1],[1],[1]], gridId));
    }, []);

    let [lockedLink, lock] = useLockableLink(2,"Forward", true);

    let question: QuestionProps = CreateQuestionProps("A, B, or C", ["A","B","C"],[1])

    let questionSect1 = QuestionSection([lock], [question])

    if (!grid) return <div>Loading grid...</div>;
    return (
        <div>
            <div className="tabContent-header">
                <h1>Hello</h1>
            </div>
        <div style={{padding: "1rem"}} className="tabContent">
            <h1>Algorithms</h1>
            <p></p>
            {questionSect1}
            <nav className={"navButton"}>
                {createLink(4, "Back")}
            </nav>
        </div>
        </div>
    );
}
