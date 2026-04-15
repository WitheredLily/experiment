import React from "react";
import { PageProps } from "../util/page";

export function Page6({ createLink }: PageProps) {
  return (
    <div>
      <div className="tabContent-header">
        <h1>State-Space Search</h1>
      </div>
      <div style={{ padding: "1rem" }} className="tabContent">
        <p>A state-space search algorithm is a way of solving a problem by looking at all the possible situations you could be in and figuring out how to move from one situation to another until you reach your goal. It starts at the beginning, checks what moves are possible, tries one, and then repeats the process from the new situation. It keeps doing this, carefully exploring different possibilities, until it finds a solution.</p>
        <p>There are a few different types of state-space search algorithms</p>
        <p>Remember that state-space search algorithms are different from search algorithms. A search algorithm is looking for something that already exists while a state-space search is constructing something that doesn't exist yet.</p>
        <p>Here are some examples of state-space search algorithms: </p>
        <div className="learning-section">
          <h2>Constraint Satisfaction</h2>
          <p>Constraint satisfaction can be broken down into three main parts:</p>
          <ul>
            <li>The variables. In this case each cell in a grid would be its own variable</li>
            <li>A domain. This represents the possible values for each variable. In this case it would be filled and empty.</li>
            <li>The constraints. This is derived from the clues for each row and column.</li>
          </ul>
          <p>A constraint satisfaction algorithm is a method used to solve problems where you need to assign values to a set of variables while following specific rules. The goal is to find a combination of values that satisfies all the rules without breaking any of them. It is useful for solving puzzles.</p>
          <p>Constraint satisfaction is how people tend to solve puzzles such as nonograms.</p>
          <p>A constraint satisfaction algorithm for a nonogram would be about implementing the techniques that were previously covered. Optimising such an algorithm is about figuring out which to use, when and where to implement your techniques.</p>
        </div>
        <div className="learning-section">
          <h2>Backtracking</h2>
          <p>Backtracking is effectively brute force. It involves going through the possibilities and each time you encounter an incorrect outcome you go back and change your choice. Think of it like a maze, each time you encounter a dead-end you go back to the last time the path split and pick another choice. Eventually you will find the exit.</p>
        </div>
        <nav className="navButton">
          {createLink(5, "Back")}
          {" "}
          |
          {createLink(7, "Next")}
        </nav>
      </div>
    </div>
  );
}
