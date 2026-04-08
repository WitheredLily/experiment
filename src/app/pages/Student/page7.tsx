import React from "react";
import {PageProps} from "../util/page";
import {CreateQuestionProps, QuestionProps, QuestionSection} from "../util/question";

export function Page7({ createLink, useLockableLink }: PageProps) {
    const [lockedButton, reportSolved] = useLockableLink(8, "Forward", ["quiz1"]);

    const question1: QuestionProps = CreateQuestionProps(
        "Which of the following best describes the difference between a state-space search algorithm and a typical search algorithm?",
        [
            "A state-space search algorithm only works for physical spaces, while a search algorithm works for digital data.",
            "A state-space search algorithm constructs solutions that do not exist yet, while a search algorithm looks for something that already exists.",
            "A state-space search algorithm is faster than a search algorithm in all cases.",
            "A search algorithm is only used for puzzles, while a state-space search is used for databases."
        ],
        [1])
    const question2: QuestionProps = CreateQuestionProps(
        "In a constraint satisfaction problem applied to a grid-based puzzle, such as a nonogram, what represents the variables?",
        [
            "The rules of the puzzle",
            "Each individual cell in the grid",
            "The possible values for each cell",
            "The clues for each row and column"
        ],
        [1])
    const question3: QuestionProps = CreateQuestionProps(
        "In the context of constraint satisfaction, the domain refers to:",
        [
            "The set of all rules that must be followed",
            "The possible values each variable can take",
            "The sequence in which variables are solved",
            "The end solution of the puzzle"
        ],
        [1])
    const question4: QuestionProps = CreateQuestionProps(
        "Which statement best describes how a backtracking algorithm works?",
        [
            "It tries all possibilities randomly until it finds a solution.",
            "It follows a path, and when it reaches a dead-end, it goes back and tries a different path.",
            "It uses probability to guess the correct solution.",
            "It modifies the puzzle rules to make solving easier."
        ],
        [1])
    const question5: QuestionProps = CreateQuestionProps(
        "Optimizing a constraint satisfaction algorithm for a nonogram mainly involves:",
        [
            "Reducing the number of cells in the grid",
            "Figuring out the order, timing, and placement of the techniques used",
            "Ignoring constraints that are too complex",
            "Converting the puzzle into a search algorithm"
        ],
        [1])
    return (
        <div>
            <div className="tabContent-header">
                <h1>Constraint Satisfaction Quiz</h1>
            </div>
            <div style={{padding: "1rem"}} className="tabContent">
                <QuestionSection
                    locks={[(locked) => reportSolved("quiz1", !locked)]}
                    questions={[question1, question2, question3, question4, question5]}
                />
                <button onClick={() => {reportSolved("all", true)}}>Unlock</button>
                <nav className={"navButton"}>
                    {createLink(6, "Back")} | {lockedButton}
                </nav>
            </div>
        </div>
    );
}
