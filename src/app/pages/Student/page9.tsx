import React from "react";
import {PageProps} from "../util/page";
import {CreateQuestionProps, QuestionProps, QuestionSection} from "../util/question";

export function Page9({ createLink, useLockableLink }: PageProps) {
    const [lockedButton, reportSolved] = useLockableLink(10, "Next", ["quiz1"]);

    const question1: QuestionProps = CreateQuestionProps(
        "What is the main inspiration behind a genetic algorithm?",
        [
            "The laws of thermodynamics",
            "Natural evolution and biological reproduction",
            "Quantum mechanics",
            "The social hierarchy of humans"
        ],
        [1])
    const question2: QuestionProps = CreateQuestionProps(
        "In a genetic algorithm, what does “fitness” measure?",
        [
            "How quickly the algorithm runs",
            "How close the solution is to the optimal solution",
            "The size of the solution",
            "The number of generations"
        ],
        [1])
    const question3: QuestionProps = CreateQuestionProps(
        "Which of the following is NOT a typical step in a genetic algorithm?",
        [
            "Creating a population of potential solutions",
            "Measuring the fitness of each solution",
            "Selecting the worst solutions for the next generation",
            "Combining and mutating solutions to form a new generation"
        ],
        [2])
    const question4: QuestionProps = CreateQuestionProps(
        "Why might a genetic algorithm fail to find the best solution?",
        [
            "It always chooses random solutions instead of the best ones",
            "It may get stuck in a locally optimal solution and cannot escape",
            "It cannot handle complex problems",
            "It only works with numeric data"
        ],
        [1])
    const question5: QuestionProps = CreateQuestionProps(
        "In the context of genetic algorithms, what is a “chromosome”?",
        [
            "A sequence representing part of a potential solution",
            "A measure of fitness",
            "The algorithm’s stopping condition",
            "The mutation process"
        ],
        [0])
    const question6: QuestionProps = CreateQuestionProps(
        "What is the purpose of mutation in a genetic algorithm?",
        [
            "To ensure every solution is perfect",
            "To introduce random variations and help escape local optima",
            "To remove the weakest solutions",
            "To calculate the fitness of solutions"
        ],
        [1])
    return (
        <div>
            <div className="tabContent-header">
                <h1>Algorithm Quiz</h1>
            </div>
            <div style={{padding: "1rem"}} className="tabContent">
                <QuestionSection
                    locks={[(locked) => reportSolved("quiz1", !locked)]}
                    questions={[question1, question2, question3, question4, question5, question6]}
                />
                <button onClick={() => {reportSolved("all", true)}}>Unlock</button>
                <nav className={"navButton"}>
                    {createLink(8, "Back")} | {lockedButton}
                </nav>
            </div>
        </div>
    );
}
