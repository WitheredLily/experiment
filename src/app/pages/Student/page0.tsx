import { PageProps } from "../util/page";
import React from "react";

export function Page0({ createLink }: PageProps) {
    return (
        <div>
            <div className="tabContent-header">
                <h1>Explore Algorithms Through Nonograms</h1>
            </div>
            <div className="tabContent">
                <p className="sub-header">
                    Learn key computer science concepts by solving interactive puzzles.
                    Observe how algorithms like backtracking, constraint satisfaction,
                    and heuristics tackle the same problem in different ways.
                </p>
                <div className="learning-section">
                    <h2>What You Can Do</h2>
                    <div className="features-cards">
                        <div className="feature-card">
                            <h3>Interactive Tutorials</h3>
                            <p>Step-by-step guides to learn how to solve nonograms efficiently.</p>
                        </div>
                        <div className="feature-card">
                            <h3>Algorithm Visualizations</h3>
                            <p>See different solving strategies in action.</p>
                        </div>
                        <div className="feature-card">
                            <h3>Custom Exercises</h3>
                            <p>Experiment with puzzles of varying complexity to understand problem-solving time.</p>
                        </div>
                    </div>
                </div>

                <div className="learning-section">
                    <h2>What will be covered</h2>
                    <ul>
                        <li>Nonograms</li>
                        <li>Introduction to Algorithms</li>
                        <li>Backtracking</li>
                        <li>State-space Algorithms</li>
                        <li>Genetic Algorithms</li>
                        <li>Search Algorithms</li>
                    </ul>
                </div>
                <nav className="navButton">
                    {createLink(1, "Start")}
                </nav>
            </div>
        </div>
    );
}