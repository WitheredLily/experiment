import React, {useEffect, useState} from "react";
import {loadingGrid, PageProps} from "./util/page";
import {Grid} from "../../game/nonogram";

export function Page6({ createLink, useLockableLink }: PageProps) {
    localStorage.removeItem("gridGuide1");
    const [grid, setGrid] = useState<Grid | null>(null);
    const gridId = "gridGuide1";
    useEffect(() => {
        setGrid(new Grid([[1,1],[1,1]], [[1],[1],[1],[1]], gridId));
    }, []);

    if (!grid) return <div>Loading grid...</div>;
    return (
        <div>
            <div className="tabContent-header">
                <h1>State-Space Search</h1>
            </div>
            <div style={{padding: "1rem"}} className="tabContent">
                <p>There are a few different types of state-space search algorithms</p>
                <p>Remember that a state-space search algorithms are different from a search algorithms. A search algorithm is looking for something that already exists while a state-space search is constructing something that doesn't exist yet,</p>
                <div className="learning-section">
                    <h2>Constraint Satisfaction</h2>
                    <p>Constraint Satisfaction can be broken down into three main parts:</p>
                    <ul>
                        <li>The variables. In this case each cell in a grid would be its own variables.</li>
                        <li>A domain. This is the possible values for each variable. In this case it would be filled and empty.</li>
                        <li>The constraints. This is derived from the clues for each row and column.</li>
                    </ul>
                    <p>A constraint satisfaction algorithm is a method used to solve problems where you need to assign values to a set of variables while following specific rules. The goal is to find a combination of values that satisfies all the rules without breaking any of them. It is useful for solving puzzles</p>
                    <p>Constraint satisfaction is how people tend to solve puzzles such as nonograms.</p>
                    <p>A constraint satisfaction algorithm for a nonogram would be about implementing the techniques that were previously covered. Optimising such an algorithm is about figuring out which, when, and where to implement your techniques.</p>
                </div>
                <div className="learning-section">
                    <h2>Backtracking</h2>
                    <p>Backtracking is effectively brute force. As an algorithm it going through the possibilities and each time you encounter an incorrect outcome you go back and change your choice. Think of it like a maze, each time you encounter a dead-end you go back to the last time the path split and pick another choice. Eventually you will find the exit.</p>
                </div>
                <nav className={"navButton"}>
                    {createLink(5, "Back")} | {createLink(7, "Forward")}
                </nav>
            </div>
        </div>
    );
}
