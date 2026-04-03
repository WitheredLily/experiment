import React, {useEffect, useState} from "react";
import { VisualGrid } from "../../game/board";
import {loadingGrid, PageProps} from "./util/page";
import {Grid} from "../../game/nonogram";
import {getBacktrackSolution} from "../../game/solvers/backtracking-solver";

export function Page4({ createLink }: PageProps) {
    return (
        <div>
            <div className="tabContent-header">
                <h1>Algorithms</h1>
            </div>
        <div style={{padding: "1rem"}} className="tabContent">
            <p>An algorithm is a set of instructions used to solve a problem or complete a task. It tells you exactly what to do and in what order to do it. For example, a recipe for baking a cake or directions for getting to a location are everyday examples of algorithms. In computing, algorithms help programs perform tasks like sorting data, searching for information, or solving puzzles.</p>
            <p>Here is a diagram showing an algorithm for someone's routine:</p>
            <img src="/images/Routine.svg" width={"40%"} alt="Routine" />
            <p>There are various types of algorithms, here are a few examples:</p>
            <ul>
                <li>Sort</li>
                <li>Search</li>
                <li>Classification</li>
                <li>Decision tree</li>
                <li>Greedy</li>
                <li>Brute</li>
                <li>Evolutionary</li>
            </ul>
            <p>It is noteworthy to mention that social media companies recommendations, referred to as "The Algorithm" are a type of algorithm called a heuristic. An algorithm is a precisely defined step-by-step procedure for solving a problem, while a heuristic is a strategy that aims for a good enough solution without guaranteeing the best or correct one.</p>
            <nav className={"navButton"}>
                {createLink(3, "Back")} | {createLink(5, "Forward")}
            </nav>
        </div>
        </div>
    );
}
