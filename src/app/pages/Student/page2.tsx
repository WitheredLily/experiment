import React, { useMemo } from "react";
import { blankRow, loadingGrid, PageProps } from "../util/page";
import { CellState, Grid } from "../../../game/nonogram";
import { getBacktrackSolution } from "../../../game/solvers/backtracking-solver";
import { VisualGrid } from "../../../game/board";

export function Page2({ createLink, useLockableLink }: PageProps) {
  const puzzleIds = ["simpleSquare", "simpleSpace", "glue", "jaS", "punctuating",];

  const [lockedButton, reportSolved] = useLockableLink(3, "Next", puzzleIds);
  // Simple squares
  const simpleSquareQuizSolution = useMemo(() => {
    const g = blankRow([[3, 4, 5]], 16, "simpleSquareQuizSolution");
    g.setAlternateSolution([[[CellState.Blank]], [[CellState.Blank]], [[CellState.Filled]], [[CellState.Blank]], [[CellState.Blank]], [[CellState.Blank]], [[CellState.Filled]], [[CellState.Filled]], [[CellState.Blank]], [[CellState.Blank]], [[CellState.Blank]], [[CellState.Filled]], [[CellState.Filled]], [[CellState.Filled]], [[CellState.Blank]], [[CellState.Blank]]]);
    return g;
  }, []);
  const [colsSquare, rowsSquare] = simpleSquareQuizSolution.getSize();
  const [simpleSquareQuiz, setSimpleSquareQuiz] = loadingGrid("simpleSquareQuizSolution", colsSquare, rowsSquare, 0.5, simpleSquareQuizSolution);

  // Simple spaces
  const simpleSpaceQuizSolution = useMemo(() => {
    const g = blankRow([[1, 4]], 10, "simpleSpaceQuizSolution");
    g.setStates([[CellState.Blank], [CellState.Filled], [CellState.Blank], [CellState.Blank], [CellState.Blank], [CellState.Filled], [CellState.Filled], [CellState.Filled], [CellState.Blank], [CellState.Blank]]);
    g.setAlternateSolution([[[CellState.Blank, CellState.Marked]], [[CellState.Filled]], [[CellState.Blank, CellState.Marked]], [[CellState.Marked]], [[CellState.Blank]], [[CellState.Filled]], [[CellState.Filled]], [[CellState.Filled]], [[CellState.Blank]], [[CellState.Marked]]]);
    return g;
  }, []);
  const [colsSpace, rowsSpace] = simpleSpaceQuizSolution.getSize();
  const [simpleSpaceQuiz, setSimpleSpaceQuiz] = loadingGrid("simpleSpaceQuizSolution", colsSpace, rowsSpace, 0.5, simpleSpaceQuizSolution);

  // Glue
  const glueQuizSolution = useMemo(() => {
    const g = blankRow([[2, 4]], 10, "glueQuizSolution");
    g.setStates([[CellState.Blank], [CellState.Filled], [CellState.Blank], [CellState.Marked], [CellState.Blank], [CellState.Blank], [CellState.Blank], [CellState.Blank], [CellState.Filled], [CellState.Blank]]);
    g.setAlternateSolution([[[CellState.Blank]], [[CellState.Filled]], [[CellState.Blank]], [[CellState.Marked]], [[CellState.Blank, CellState.Marked]], [[CellState.Blank]], [[CellState.Filled]], [[CellState.Filled]], [[CellState.Filled]], [[CellState.Blank]]]);
    return g;
  }, []);
  const [colsGlue, rowsGlue] = glueQuizSolution.getSize();
  const [glueQuiz, setGlueQuiz] = loadingGrid("glueQuizSolution", colsGlue, rowsGlue, 0.5, glueQuizSolution);

  // Joining and splitting
  const jaSQuizSolution = useMemo(() => {
    const g = blankRow([[4, 3]], 10, "jaSQuizSolution");
    g.setStates([[CellState.Blank], [CellState.Filled], [CellState.Filled], [CellState.Blank], [CellState.Filled], [CellState.Blank], [CellState.Filled], [CellState.Blank], [CellState.Filled], [CellState.Blank]]);
    g.setAlternateSolution([[[CellState.Blank, CellState.Marked]], [[CellState.Filled]], [[CellState.Filled]], [[CellState.Filled]], [[CellState.Filled]], [[CellState.Blank, CellState.Marked]], [[CellState.Filled]], [[CellState.Filled]], [[CellState.Filled]], [[CellState.Blank, CellState.Marked]]]);
    return g;
  }, []);
  const [colsJaS, rowsJaS] = jaSQuizSolution.getSize();
  const [jaSQuiz, setJaSQuiz] = loadingGrid("jaSQuizSolution", colsJaS, rowsJaS, 0.5, jaSQuizSolution);

  // Punctuating
  const punctuatingQuizSolution = useMemo(() => {
    const g = blankRow([[1, 3, 2]], 10, "punctuatingQuizSolution");
    g.setStates([[CellState.Blank], [CellState.Blank], [CellState.Blank], [CellState.Filled], [CellState.Filled], [CellState.Filled], [CellState.Blank], [CellState.Blank], [CellState.Filled], [CellState.Blank]]);
    g.setAlternateSolution([[[CellState.Blank]], [[CellState.Blank]], [[CellState.Marked]], [[CellState.Filled]], [[CellState.Filled]], [[CellState.Filled]], [[CellState.Marked]], [[CellState.Blank]], [[CellState.Filled]], [[CellState.Blank]]]);
    return g;
  }, []);
  const [colsPunct, rowsPunct] = punctuatingQuizSolution.getSize();
  const [punctuatingQuiz, setPunctuatingQuiz] = loadingGrid("punctuatingQuizSolution", colsPunct, rowsPunct, 0.5, punctuatingQuizSolution);

  // Backtracking

  const backTrackSolution = new Grid([[1], [3], [1], [3]], [[2], [3], [1, 1], [1]], "backtrackSolution");
  const [gridBacktrack, setGridBacktrack] = loadingGrid("backtracking", 4, 4, 0.5, backTrackSolution);

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

          <p>By overlapping the leftmost and rightmost placements of the same clue block, you can see which cells must be filled. This rule comes down to if a square is filled in every possible position, it must be black.</p>
          <div className="shrink-wrap-container">
            <img src="/images/SimpleSquareExample.svg" alt="Simple Square Example" />
            <div className="learning-section">
              <h3>Mathematical approach</h3>
              <p>You can determine which rows or columns will benefit from this approach by using this formula:</p>
              <ol>
                <li>Add all the clues together and add 1 for each space between the clues. For example, if the clues are 4 and 3 the total is 8 (4+1+3).</li>
                <li>Take the free space and subtract your number. So for a 10x10 grid, given the example in the previous line: 10-8=2.</li>
                <li>If an individual number in the clue is larger than this (2), you know there will be a number of cells you can fill in equal to the difference. In our example 4 is greater by 2 so 2 cells must filled and 3 is greater by 1 so 1 square must be filled</li>
              </ol>
            </div>
          </div>
          <div className="question-container">
            <div className="shrink-wrap-container">
              <h2>Question:</h2>
              <p>Apply the same logic to the example. Remember left click to fill a cell and right click to mark a cell as can't be filled.</p>
              <img src="/images/SimpleSquareQuiz.svg" alt="Simple Square Quiz" />
              <br />
              <VisualGrid grid={simpleSquareQuiz} onGridChange={setSimpleSquareQuiz} hideClueColumn={true} hideClueRow={true} lock={locked => reportSolved("simpleSquare", !locked)} />
            </div>
          </div>
          <p>In the example below that the where the blocks of 4 overlap is highlighted and where the blocks of 3 overlap is highlighted but not where the block of 3 and 4 overlap. </p>
        </div>

        <div className="learning-section">
          <h2>Simple Spaces</h2>
          <p>This method involves finding which cells cannot be filled.</p>
          <p>To do this, you can note what cells can be filled. We marked those with &#9733;.</p>
          <div className="shrink-wrap-container">
            <img src="/images/SimpleSpaceExample.svg" alt="Simple Space Example" />
          </div>
          <p>Anything that wasn't marked with &#9733; cannot be filled so we mark it as blank</p>
          <div className="question-container">
            <div className="shrink-wrap-container">
              <h2>Question:</h2>
              <p>Apply the same logic to the example</p>
              <img src="/images/SimpleSpaceQuiz.svg" alt="Simple Space Quiz" />
              <br />
              <VisualGrid grid={simpleSpaceQuiz} onGridChange={setSimpleSpaceQuiz} hideClueColumn={true} hideClueRow={false} lock={locked => reportSolved("simpleSpace", !locked)} />
            </div>
          </div>
        </div>

        <div className="learning-section">
          <h2>Glue</h2>
          <p>When a filled cell is near to an edge either the edge of the board or a cell marked with an X you can work out what cells must be filled because the block has no where else to go.</p>
          <div className="shrink-wrap-container">
            <img src="/images/GlueExample.svg" alt="Glue Example" />
          </div>
          <p></p>
          <div className="question-container">
            <div className="shrink-wrap-container">
              <h2>Question:</h2>
              <p>Apply the same logic to the example</p>
              <img src="/images/GlueQuiz.svg" alt="Glue Quiz" />
              <br />
              <VisualGrid grid={glueQuiz} onGridChange={setGlueQuiz} hideClueColumn={true} hideClueRow={false} lock={locked => reportSolved("glue", !locked)} />
            </div>
          </div>
        </div>

        <div className="learning-section">
          <h2>Joining and splitting</h2>
          <p>When marked cells have a single space between them you may be able to tell whether they must be connected or if they cannot based on the clue.</p>
          <div className="shrink-wrap-container">
            <img src="/images/JoiningAndSplittingExample.svg" alt="Joining and splitting Example" />
          </div>
          <div className="question-container">
            <div className="shrink-wrap-container">
              <h2>Question:</h2>
              <p>Apply the same logic to the example</p>
              <img src="/images/JoiningAndSplittingQuiz.svg" alt="Joining and splitting Quiz" />
              <br />
              <VisualGrid grid={jaSQuiz} onGridChange={setJaSQuiz} hideClueColumn={true} hideClueRow={false} lock={locked => reportSolved("jaS", !locked)} />
            </div>
          </div>
        </div>

        <div className="learning-section">
          <h2>Punctuating</h2>
          <p>Once you have determined a group of filled cells is as big as it can get, either side of it should be marked</p>
          <p>Often this won't help immediately but will make it easier to solve the puzzle as a whole.</p>
          <div className="shrink-wrap-container">
            <img src="/images/PunctuatingExample.svg" alt="Punctuating Example" />
          </div>
          <div className="question-container">
            <div className="shrink-wrap-container">
              <h2>Question:</h2>
              <p>Apply the same logic to the example</p>
              <img src="/images/PunctuatingQuiz.svg" alt="Punctuating Quiz" />
              <br />
              <VisualGrid grid={punctuatingQuiz} onGridChange={setPunctuatingQuiz} hideClueColumn={true} hideClueRow={false} lock={locked => reportSolved("punctuating", !locked)} />
            </div>
          </div>
        </div>
        <div className="learning-section">
          <h2>Back Tracking</h2>
          <p>This method involves trying possible solutions and every time you encounter an incorrect solution you take a step back and try the other path. This method is difficult and time consuming for humans to do by hand though certain nonograms may require it. Here is an example of backtracking being used.</p>
          <div className="graphic-container">
            <VisualGrid grid={gridBacktrack} onGridChange={setGridBacktrack} nonInteractive={true} inputGraphic={getBacktrackSolution(gridBacktrack)} />

          </div>
        </div>

        <nav className="navButton">
          {createLink(1, "Back")}
          {" "}
          |
          {lockedButton}
        </nav>
      </div>
    </div>
  );
}
