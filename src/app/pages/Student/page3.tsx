import React from "react";
import {loadingGrid, PageProps} from "../util/page";
import {VisualGrid} from "../../../game/board";

export function Page3({ createLink, useLockableLink }: PageProps) {
    const cols1 = 7;
    const rows1 = 7;

    const [grid1, setGrid1] = loadingGrid("grid1", cols1, rows1, 0.75);
    const [lockedButton, reportSolved] = useLockableLink(4, "Forward", ["grid1"]);

    if (!grid1) {
        return <div>Loading grid...</div>;
    }

    return (
        <div>
        <div className="tabContent-header">
            <h1>Playing with nonograms</h1>
        </div>
        <div style={{padding: "1rem"}} className="tabContent">
            <div className="learning-section">
                <div className="question-container">
                    <p>Here is a nonogram to try:</p>
                    <VisualGrid grid={grid1} onGridChange={setGrid1} lock={(locked) => reportSolved("grid1", !locked)}/>
                    <button onClick={() => {reportSolved("all", true)}}>Unlock</button>
                </div>
                <br/>
                <nav className={"navButton"}>
                    {createLink(2, "Back")} | {lockedButton}
                </nav>
            </div>
        </div>
        </div>
    );
}
