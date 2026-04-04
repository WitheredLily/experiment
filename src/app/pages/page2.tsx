import React from "react";
import {blankRow, loadingGrid, PageProps} from "./util/page";
import {CellState} from "../../game/nonogram";
import {getBacktrackSolution} from "../../game/solvers/backtracking-solver";
import {VisualGrid} from "../../game/board";

export function Page2({ createLink, useLockableLink }: PageProps) {
    const puzzleIds = [
        "simpleSquare",
        "simpleSpace",
        "glue",
        "jaS",
        "punctuating"
    ];

    const [lockedButton, reportSolved] = useLockableLink(3, "Forward", puzzleIds);
    // Simple squares
    const simpleSquareQuizSolution = blankRow([[3,4,5]], 16);
    simpleSquareQuizSolution.setAlternateSolution([[[CellState.Blank]],[[CellState.Blank]],[[CellState.Filled]],[[CellState.Blank]],[[CellState.Blank]],[[CellState.Blank]],[[CellState.Filled]],[[CellState.Filled]],[[CellState.Blank]],[[CellState.Blank]],[[CellState.Blank]],[[CellState.Filled]],[[CellState.Filled]],[[CellState.Filled]],[[CellState.Blank]],[[CellState.Blank]]])
    const [colsSquare, rowsSquare] = simpleSquareQuizSolution.getSize();
    const [simpleSquareQuiz, setSimpleSquareQuiz] = loadingGrid("simpleSpaceQuizSolution", colsSquare, rowsSquare, 0.5, simpleSquareQuizSolution);


    // Simple spaces
    const simpleSpaceQuizSolution = blankRow([[1,4]], 10);
    simpleSpaceQuizSolution.setStates([[CellState.Blank],[CellState.Filled],[CellState.Blank],[CellState.Blank],[CellState.Blank],[CellState.Filled],[CellState.Filled],[CellState.Filled],[CellState.Blank],[CellState.Blank]])
    simpleSpaceQuizSolution.setAlternateSolution([[[CellState.Blank, CellState.Marked]],[[CellState.Filled]],[[CellState.Blank, CellState.Marked]],[[CellState.Marked]],[[CellState.Blank]],[[CellState.Filled]],[[CellState.Filled]],[[CellState.Filled]],[[CellState.Blank]],[[CellState.Marked]]])
    const [colsSpace,rowsSpace] = simpleSpaceQuizSolution.getSize();
    const [simpleSpaceQuiz, setSimpleSpaceQuiz] = loadingGrid("simpleSpaceQuizSolution", colsSpace, rowsSpace, 0.5, simpleSpaceQuizSolution);

    // Glue
    const glueQuizSolution = blankRow([[2,4]], 10);
    glueQuizSolution.setStates([[CellState.Blank],[CellState.Filled],[CellState.Blank],[CellState.Marked],[CellState.Blank],[CellState.Blank],[CellState.Blank],[CellState.Blank],[CellState.Filled],[CellState.Blank]])
    glueQuizSolution.setAlternateSolution([[[CellState.Blank]],[[CellState.Filled]],[[CellState.Blank]],[[CellState.Marked]],[[CellState.Blank, CellState.Marked]],[[CellState.Blank]],[[CellState.Filled]],[[CellState.Filled]],[[CellState.Filled]],[[CellState.Blank]]])
    const [colsGlue,rowsGlue] = glueQuizSolution.getSize();
    const [glueQuiz, setGlueQuiz] = loadingGrid("glueQuizSolution", colsGlue, rowsGlue, 0.5, glueQuizSolution);

    // Joining and splitting
    const jaSQuizSolution = blankRow([[4,3]], 10);
    jaSQuizSolution.setStates([[CellState.Blank],[CellState.Filled],[CellState.Filled],[CellState.Blank],[CellState.Filled],[CellState.Blank],[CellState.Filled],[CellState.Blank],[CellState.Filled],[CellState.Blank]])
    jaSQuizSolution.setAlternateSolution([[[CellState.Blank, CellState.Marked]],[[CellState.Filled]],[[CellState.Filled]],[[CellState.Filled]],[[CellState.Filled]],[[CellState.Blank, CellState.Marked]],[[CellState.Filled]],[[CellState.Filled]],[[CellState.Filled]],[[CellState.Blank, CellState.Marked]]])
    const [colsJaS,rowsJaS] = jaSQuizSolution.getSize();
    const [jaSQuiz, setJaSQuiz] = loadingGrid("jaSQuizSolution", colsJaS, rowsJaS, 0.5, jaSQuizSolution);

    // Punctuating
    const punctuatingQuizSolution = blankRow([[1,3,2]], 10);
    punctuatingQuizSolution.setStates([[CellState.Blank],[CellState.Blank],[CellState.Blank],[CellState.Filled],[CellState.Filled],[CellState.Filled],[CellState.Blank],[CellState.Blank],[CellState.Filled],[CellState.Blank]])
    punctuatingQuizSolution.setAlternateSolution([[[CellState.Blank]],[[CellState.Blank]],[[CellState.Marked]],[[CellState.Filled]],[[CellState.Filled]],[[CellState.Filled]],[[CellState.Marked]],[[CellState.Blank]],[[CellState.Filled]],[[CellState.Blank]]])
    const [colsPunct,rowsPunct] = punctuatingQuizSolution.getSize();
    const [punctuatingQuiz, setPunctuatingQuiz] = loadingGrid("punctuatingQuizSolution", colsPunct, rowsPunct, 0.5, punctuatingQuizSolution);

    // Contradictions

    // Backtracking

    const [gridBacktrack,setGridBacktrack] = loadingGrid("backtracking", 4, 4, 0.5);

    if (!simpleSquareQuiz || !gridBacktrack || !simpleSpaceQuiz || !glueQuiz || !jaSQuiz || !punctuatingQuiz) {
        return <div>Loading grid...</div>;
    }
    return (
        <div>
            <div className="tabContent-header">
                <h1>How to solve a nonogram</h1>
            </div>
        <div style={{ padding: "1rem" }} className="tabContent">
            <div className="learning-section">
                <h2>Simple Boxes</h2>

                <p>By considering the overlap of the same cell groups in the leftmost and rightmost solutions you can determine that some cells have to be filled</p>
                <div className="shrink-wrap-container">
                    <img src="/images/SimpleSquareExample.svg" alt="Simple Square Example" />
                    <div className="learning-section">
                        <h2>Mathematical approach</h2>
                        <p></p>
                    </div>
                </div>
                <div className="question-container">
                    <div className="shrink-wrap-container">
                        <h3>Question:</h3>
                        <p>Apply the same logic to the example</p>
                        <img src="/images/SimpleSquareQuiz.svg" alt="Simple Square Quiz"/>
                        <VisualGrid grid={simpleSquareQuiz} onGridChange={setSimpleSquareQuiz} hideClueColumn={true} hideClueRow={true} lock={(locked) => reportSolved("simpleSquare", !locked)}/>
                    </div>
                </div>
            </div>

            <div className="learning-section">
                <h2>Simple Spaces</h2>
                <p>This method involves finding which cells are out of range for being possible</p>
                <div className="shrink-wrap-container">
                    <img src="/images/SimpleSpaceExample.svg" alt="Simple Space Example" />
                </div>
                <div className="question-container">
                    <div className="shrink-wrap-container">
                        <h3>Question:</h3>
                        <p>Apply the same logic to the example</p>
                        <img src="/images/SimpleSpaceQuiz.svg" alt="Simple Space Quiz" />
                        <VisualGrid grid={simpleSpaceQuiz} onGridChange={setSimpleSpaceQuiz} hideClueColumn={true} hideClueRow={false} lock={(locked) => reportSolved("simpleSpace", !locked)}/>
                    </div>
                </div>
            </div>

            <div className="learning-section">
                <h2>Glue</h2>
                <p>When a filled cell is near to an edge either the edge of the board or a cell marked as can't be filled you may be able to determine a minium amount of cells that have to be filled</p>
                <div className="shrink-wrap-container">
                    <img src="/images/GlueExample.svg" alt="Glue Example" />
                </div>
                <div className="question-container">
                    <div className="shrink-wrap-container">
                        <h3>Question:</h3>
                        <p>Apply the same logic to the example</p>
                        <img src="/images/GlueQuiz.svg" alt="Glue Quiz" />
                        <VisualGrid grid={glueQuiz} onGridChange={setGlueQuiz} hideClueColumn={true} hideClueRow={false} lock={(locked) => reportSolved("glue", !locked)}/>
                    </div>
                </div>
            </div>

            <div className="learning-section">
                <h2>Joining and splitting</h2>
                <p>When marked cells have a single space between them you may be able to determine whether they must be connected or if they cannot be based on the clue size.</p>
                <div className="shrink-wrap-container">
                    <img src="/images/JoiningAndSplittingExample.svg" alt="Joining and splitting Example" />
                </div>
                <div className="question-container">
                    <div className="shrink-wrap-container">
                        <h3>Question:</h3>
                        <p>Apply the same logic to the example</p>
                        <img src="/images/JoiningAndSplittingQuiz.svg" alt="Joining and splitting Quiz" />
                        <VisualGrid grid={jaSQuiz} onGridChange={setJaSQuiz} hideClueColumn={true} hideClueRow={false} lock={(locked) => reportSolved("jaS", !locked)}/>
                    </div>
                </div>
            </div>

            <div className="learning-section">
                <h2>Punctuating</h2>
                <p>This is simply once you have determined a group filled cells is as big as it can get either side of it should be marked</p>
                <div className="shrink-wrap-container">
                    <img src="/images/PunctuatingExample.svg" alt="Punctuating Example" />
                </div>
                <div className="question-container">
                    <div className="shrink-wrap-container">
                        <h3>Question:</h3>
                        <p>Apply the same logic to the example</p>
                        <img src="/images/PunctuatingQuiz.svg" alt="Punctuating Quiz" />
                        <VisualGrid grid={punctuatingQuiz} onGridChange={setPunctuatingQuiz} hideClueColumn={true} hideClueRow={false} lock={(locked) => reportSolved("punctuating", !locked)}/>
                    </div>
                </div>
            </div>

            <div className="learning-section">                
                <h2>Contradictions</h2>
                <p>This is when you try a possible cell and seeing if you continue filling based on that does it reach a point with contradictions if it does you know that the initial cell is wrong</p>
            </div>

            <div className="learning-section">                
                <h2>Back Tracking</h2>
                <p>This method involves trying possible solutions and every time you encounter an incorrect solution you take a step back and try the other path. This method is difficult and time consuming for humans to do by hand though certain nonograms may require it. Here is an example of backtracking being used.</p>
                <div className="graphic-container">
                    <VisualGrid grid={gridBacktrack} onGridChange={setGridBacktrack} nonInteractive={true} inputGraphic={getBacktrackSolution(gridBacktrack)}/>
                    <button onClick={() => {reportSolved("all", true)}}>Unlock</button>
                </div>
            </div>

            <nav className={"navButton"}>
                {createLink(1, "Back")} | {lockedButton}
            </nav>
        </div>
        </div>
    );
}
