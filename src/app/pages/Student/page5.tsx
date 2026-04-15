import React from "react";
import { PageProps } from "../util/page";
import { CreateQuestionProps, QuestionProps, QuestionSection } from "../util/question";

export function Page5({ createLink, useLockableLink }: PageProps) {
  const [lockedButton, reportSolved] = useLockableLink(6, "Next", ["quiz1"]);

  const question1: QuestionProps = CreateQuestionProps("What is an algorithm?", ["A random way of solving a problem", "A set of instructions used to solve a problem or complete a task", "A computer program written in code", "A type of artificial intelligence",], [1]);
  const question3: QuestionProps = CreateQuestionProps("Which of the following is an everyday example of an algorithm?", ["A social media profile", "Walking to school or work", "A smartphone", "A video game controller",], [1]);
  const question4: QuestionProps = CreateQuestionProps("In computing, algorithms help programs do which of the following?", ["Create hardware", "Increase internet speed", "Perform tasks like sorting data and searching for information", "Replace human decision-making completely",], [2]);
  const question5: QuestionProps = CreateQuestionProps("Social media recommendations referred to as “The Algorithm” are best described as:", ["Brute force algorithms", "Evolutionary algorithms", "Decision trees", "Heuristics",], [3]);
  return (
    <div>
      <div className="tabContent-header">
        <h1>Algorithm Quiz</h1>
      </div>
      <div style={{ padding: "1rem" }} className="tabContent">
        <QuestionSection
          locks={[locked => reportSolved("quiz1", !locked)]}
          questions={[question1, question3, question4, question5]}
        />

        <nav className="navButton">
          {createLink(4, "Back")}
          {" "}
          |
          {lockedButton}
        </nav>
      </div>
    </div>
  );
}
