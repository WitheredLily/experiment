import React, {useState} from "react";
import {loadingGrid, PageProps} from "./util/page";
import {Grid, rowsToGrid} from "../../game/nonogram";
import {BacktrackSolve, getBacktrackSolution} from "../../game/solvers/backtracking-solver";
import {VisualGrid} from "../../game/board";
import {boolean} from "zod";

export function Page2({ createLink, useLockableLink }: PageProps) {
    const [gridExample, setGrid1] = useState<Grid | null>(null);
    const [gridSolution, setGrid2] = useState<Grid | null>(null);

    const [gridQuiz, setGridQuiz] = useState<Grid | null>(null);
    const [gridQuizSolution, setGridQuizSolution] = useState<Grid | null>(null);

    const [gridBacktrack, setGridBacktrack] = useState<Grid | null>(null);


    function leftRightMost(clues: number[], size: number): boolean[][] {
        const left = Array(size).fill(false);
        const right = Array(size).fill(false);

        // LEFTMOST
        let pos = 0;
        for (let c = 0; c < clues.length; c++) {
            const len = clues[c];
            for (let i = 0; i < len; i++) {
                left[pos + i] = true;
            }
            pos += len;
            if (c < clues.length - 1) pos += 1; // gap
        }

        // RIGHTMOST
        pos = size;
        for (let c = clues.length - 1; c >= 0; c--) {
            const len = clues[c];
            pos -= len;
            for (let i = 0; i < len; i++) {
                right[pos + i] = true;
            }
            if (c > 0) pos -= 1; // gap
        }

        // COMBINE
        return left.map((_, i) => [left[i], right[i]]);
    }

    gridBacktrack

    const grid1 = rowsToGrid([[true,false],[true,false],[true,true],[true,true],[false,true],[true,true],[true,false],[true,true],[false,true],[false,true]],"simpleSquares")
    const grid2 = rowsToGrid([[false],[false],[true],[true],[false],[false],[false],[true],[false],[false]],"simpleSquaresSolution")

    const [cols1,rows1] = grid1.getSize();


    const quiz = rowsToGrid(leftRightMost([3,4,5], 16),"simpleSquaresQuiz")
    const quizSolution = rowsToGrid([[false],[false],[true],[false],[false],[false],[true],[true],[false],[false],[false],[true],[true],[true],[false],[false]],"simpleSquaresSolution")

    const [cols2,rows2] = grid1.getSize();

    loadingGrid("simpleSquares", cols1, rows1, setGrid1, 0.5, grid1);
    loadingGrid("simpleSquaresSolution", 1, rows1, setGrid2, 0.5, grid2);

    loadingGrid("simpleSquaresQuiz", cols2, rows2, setGridQuiz, 0.5, quiz);
    loadingGrid("simpleSquaresQuizSolution", 1, rows2, setGridQuizSolution, 0.5, quizSolution);

    loadingGrid("backtracking", 4, 4, setGridBacktrack, 0.5);

    let [lockedButton, setLock] = useLockableLink(3,"Forward", true);



    if (!gridSolution || !gridExample || !gridQuiz || !gridQuizSolution || !gridBacktrack) {
        return <div>Loading grid...</div>;
    }

    BacktrackSolve(gridSolution)
    BacktrackSolve(gridExample)

    BacktrackSolve(gridQuiz)
    return (
        <div style={{ padding: "1rem" }} className="tabContent">
            <h1>Hi, this section talks about how to solve a nonogram</h1>

            <h2>Simple Boxes</h2>

            <p>By considering the overlap of the same cell groups in the leftmost and rightmost solutions you can determine that some cells have to be filled</p>
            <VisualGrid grid={gridExample} nonInteractive={true} hideClueColumn={true} />
            <br/>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Eo_circle_green_arrow-down.svg/2048px-Eo_circle_green_arrow-down.svg.png" width="5%" alt="arrow"></img>
            <br/>
            <VisualGrid grid={gridSolution} nonInteractive={true} hideClueColumn={true} />
            <br/>


            <p>here is one to test yourself with</p>
            <VisualGrid grid={gridQuiz} nonInteractive={true} hideClueColumn={true} />
            <br/>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Eo_circle_green_arrow-down.svg/2048px-Eo_circle_green_arrow-down.svg.png" width="5%" alt="arrow"></img>
            <br/>
            <VisualGrid grid={gridQuizSolution} onGridChange={setGridQuizSolution} hideClueColumn={true} hideClueRow={true} lock={setLock}/>

            <h2>Simple Spaces</h2>
            <p>This method involves finding which cells are out of range for being possible</p>

            <h2>Glue</h2>
            <p>When a filled cell is near to an edge either the edge of the board or a cell marked as can't be filled you may be able to determine a minium amount of cells that have to be filled</p>

            <h2>Joining and splitting</h2>
            <p>When marked cells have a single space between them you may be able to determine whether they must be connected or if they cannot be based on the clue size.</p>

            <h2>Punctuating</h2>
            <p>This is simply once you have determined a group filled cells is as big as it can get either side of it should be marked</p>

            <h2>Contradictions</h2>
            <p>This is when you try a possible cell and seeing if you continue filling based on that does it reach a point with contradictions if it does you know that the initial cell is wrong</p>

            <h2>Mathematical approach</h2>
            <p></p>


            <h2>Back Tracking</h2>
            <p>This method involves trying possible solutions and every time you encounter an incorrect solution you take a step back and try the other path. This method is difficult and time consuming for humans to do by hand though certain nonograms may require it. Here is an example of backtracking being used.</p>
            <VisualGrid grid={gridBacktrack} onGridChange={setGridBacktrack} nonInteractive={true} inputGraphic={getBacktrackSolution(gridBacktrack)}/>
            <button onClick={() => {setLock(false)}}>Unlock</button>

            <nav>
                {createLink(1, "Back")} | {lockedButton} {createLink(3, "")}
            </nav>
        </div>
    );
}
