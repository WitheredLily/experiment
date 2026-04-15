import React from "react";
import {PageProps} from "../util/page";
import {CreateQuestionProps, QuestionProps, QuestionSection} from "../util/question";

export function Page11({ createLink, useLockableLink }: PageProps) {
    const [lockedButton, reportSolved] = useLockableLink(12, "Next", ["quiz1"]);

    const question1: QuestionProps = CreateQuestionProps(
        "What is the main purpose of a search algorithm?",
        [
            "To sort data in ascending order",
            "To find a specific data point within a larger dataset",
            "To compress data for storage",
            "To encrypt information for security"
        ],
        [1])
    const question2: QuestionProps = CreateQuestionProps(
        "How does binary search work?",
        [
            "Checks each element one by one until it finds the target",
            "Divides the list in half and searches the relevant half repeatedly",
            "Jumps fixed steps through the list to find the target",
            "Estimates the position of the target using a formula"
        ],
        [1])
    const question3: QuestionProps = CreateQuestionProps(
        "What is a disadvantage of linear search?",
        [
            "It only works on sorted data",
            "It is complex to implement",
            "It can be very slow for large datasets",
            "It can skip over the target data"
        ],
        [2])
    const question4: QuestionProps = CreateQuestionProps(
        "Which statement is true about binary search?",
        [
            "It works efficiently on both sorted and unsorted data",
            "It is slower than linear search for large datasets",
            "It requires the dataset to be sorted",
            "It checks every element sequentially"
        ],
        [2])
    const question5: QuestionProps = CreateQuestionProps(
        "After Jump Search finds the possible block where the target may exist, what does it do next?",
        [
            "Stops immediately",
            "Performs binary search in that block",
            "Performs linear search within that block",
            "Jumps again by a larger step"
        ],
        [2])
    const question6: QuestionProps = CreateQuestionProps(
        "Which search algorithm uses the value of the target to estimate its likely position?",
        [
            "Linear Search",
            "Jump Search",
            "Binary Search",
            "Interpolation Search"
        ],
        [3])
    return (
        <div>
            <div className="tabContent-header">
                <h1>Algorithm Quiz</h1>
            </div>
            <div style={{padding: "1rem"}} className="tabContent">
                <QuestionSection
                    locks={[(locked) => reportSolved("quiz1", !locked)]}
                    questions={[question1, question2, question6, question3, question4, question5]}
                />
                
                <nav className={"navButton"}>
                    {createLink(10, "Back")} | {lockedButton}
                </nav>
            </div>
        </div>
    );
}
