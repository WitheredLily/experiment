import React from "react";
import { PageProps } from "../util/page";

export function Page4({ createLink }: PageProps) {
  return (
    <div>
      <div className="tabContent-header">
        <h1>Algorithms</h1>
      </div>
      <div style={{ padding: "1rem" }} className="tabContent">
        <p>An algorithm is a set of instructions used to solve a problem or complete a task. It tells you exactly what to do and in what order to do it to achieve a specific result. For example, a recipe for baking a cake or directions for getting to a location are everyday examples of algorithms. In computing, algorithms help programs perform tasks like sorting data, searching for information, or solving puzzles.</p>
        <p>Here is a diagram showing an algorithm for someone's routine:</p>
        <img src="/images/Routine.svg" width="30%" alt="Routine" />
        <p>There are various types of algorithms, here are a few examples:</p>
        <ul>
          <li>Sort               - Arranges data in a specific order</li>
          <li>Search             - Finds a specific date</li>
          <li>Classification     - Assigns items to categories</li>
          <li>Decision tree      - Uses branching logic to reach conclusions</li>
          <li>Greedy             - makes the best immediate choice at each step</li>
          <li>Brute              - tries all possible solutions</li>
          <li>Evolutionary       - inspired by natural selection</li>
        </ul>
        <p>A simple search algorithm might check each item in a list one by one until it finds the target. A more advanced search algorithm might repeatedly divide the list in half to find the item faster.</p>
        <p>It is noteworthy to mention that social media companies recommendations, referred to as "The Algorithm" are a type of algorithm called a heuristic. An algorithm is a precisely defined step-by-step procedure for solving a problem, while a heuristic is a strategy that aims for a good enough solution without guaranteeing the best or correct one.</p>
        <nav className="navButton">
          {createLink(3, "Back")}
          {" "}
          |
          {createLink(5, "Next")}
        </nav>
      </div>
    </div>
  );
}
