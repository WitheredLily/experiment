// typescript
// File: `src/game/board.tsx`

import React, {useEffect, useState} from "react";
import {CellState, Grid, makeRandomGrid, rowsToGrid} from "./nonogram";
import {geneticSolveSteps} from "./solvers/genetic-solver";

let incorrectInput = false;

interface BoardProps {
    grid: Grid;
    onGridChange?: (newGrid: Grid) => void;
    selfSolving?: (grid: Grid) => boolean;
    nonInteractive?: boolean;
    inputOrder?: [number, number, CellState][][]
    inputGraphic?: [number, number, CellState][][]
    geneticGraphic?: boolean;
    graphicSpeed?: number;
    hideClueColumn?: boolean;
    hideClueRow?: boolean;
    lock?: (locked: boolean) => void
    highlightedCellsArray?: [number, number][];
    noSolve?: boolean;
    shuffle?: boolean;
}

const stateToColor = (s: CellState): "white" | "black" =>
    s === CellState.Filled ? "black" : "white";

const renderClueColumn = (nums: ReadonlyArray<number>) =>
    nums.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem", alignItems: "center" }}>
            {nums.map((n, i) => (
                <div key={i}>{n}</div>
            ))}
        </div>
    ) : (
        <div style={{ opacity: 0.4 }}>·</div>
    );

const renderClueRow = (nums: ReadonlyArray<number>) =>
    nums.length > 0 ? (
        <div style={{ display: "flex", gap: "0.25rem", justifyContent: "flex-end", alignItems: "center", marginRight: "0.25rem" }}>
            {nums.map((n, i) => (
                <div key={i}>{n}</div>
            ))}
        </div>
    ) : (
        <div style={{ opacity: 0.4 }}>·</div>
    );

export const VisualGrid: React.FC<BoardProps> = ({ grid, onGridChange, selfSolving, nonInteractive, inputOrder, inputGraphic, hideClueColumn, hideClueRow, lock, geneticGraphic, graphicSpeed = 1, highlightedCellsArray, noSolve, shuffle }) => {
    async function sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    //console.log(grid);
    const [highlightedCells, setHighlightedCells] = useState<Set<string>>(new Set());
    const [playing, setPlaying] = useState(false);
    const [loading, setLoading] = useState(false);
    let inputNumber = 0;
    const [cols, rows] = grid.getSize();

    useEffect(() => {
        if (!highlightedCellsArray) {
            setHighlightedCells(new Set());
            return;
        }

        const highlightedCellsSet = new Set(
            highlightedCellsArray.map(cell => `${cell[0]}-${cell[1]}`)
        );

        setHighlightedCells(highlightedCellsSet);
    }, [highlightedCellsArray]);

    const handlePlayGraphic = async () => {
        if (!inputGraphic) return;
        for (const input of inputGraphic){
            updateCell(input[0][0], input[0][1], input[0][2])
            await sleep(graphicSpeed * 1000);
        }
    };

    const handlePlayGeneticGraphic = async () => {
        if (!geneticGraphic || playing || loading) return;

        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 0));

        const grids = geneticSolveSteps(grid.clone());
        setLoading(false);
        setPlaying(true);

        for (const exampleGrid of grids) {
            const previousStates = grid.getCellStates();
            const newStates = exampleGrid;

            const changed = new Set<string>();

            for (let x = 0; x < cols; x++) {
                for (let y = 0; y < rows; y++) {
                    if (previousStates[x][y] !== newStates[x][y]) {
                        changed.add(`${x}-${y}`);
                    }
                }
            }

            setHighlightedCells(changed);

            grid.setStates(exampleGrid);
            onGridChange?.(grid.clone());
            grid.save();

            await sleep(graphicSpeed * 1000);

            setHighlightedCells(new Set()); // remove highlight after step
        }

        setPlaying(false);
    };

    const updateCell = (x: number, y: number, newState: CellState) => {
        grid.updateCell(x, y, newState);
        grid.checkClues(x, y);
        if (lock != undefined) {
            lock(!grid.getSolved());
        }
        const cloned = Object.create(Object.getPrototypeOf(grid), Object.getOwnPropertyDescriptors(grid)) as Grid;
        onGridChange?.(cloned);
        grid.save();
    };

    const solve = () => {
        if (selfSolving) {
            selfSolving(grid);
            grid.checkAllClues();
            const cloned = Object.create(Object.getPrototypeOf(grid), Object.getOwnPropertyDescriptors(grid)) as Grid;
            onGridChange?.(cloned);
            grid.save();
        }
    }

    const shuffleGrid = () => {
        if (!shuffle || playing || loading) return;

        const newGrid = grid.clone();
        newGrid.shuffle(0.5);

        onGridChange?.(newGrid);
        newGrid.save();
    }

    const checkInput = (x: number, y: number, state: CellState):boolean => {
        if (inputOrder) {
            for (const input of inputOrder[inputNumber]) {
                if (input[0] === x && input[1] === y && input[2] === state) {
                    inputNumber++;
                    return true;
                }
            }
            return false;
        }
        return true;
    }

    const handleLeftClick = (x: number, y: number) => {
        if (nonInteractive) return;
        const current = grid.getCellStates()[x][y];
        if (current !== CellState.Marked) {
            updateCell(x, y, current === CellState.Filled ? CellState.Blank : CellState.Filled);
            incorrectInput = !checkInput(x, y, CellState.Filled)
        }
    };

    const handleRightClick = (x: number, y: number, e: React.MouseEvent) => {
        if (nonInteractive) return;
        e.preventDefault();
        const current = grid.getCellStates()[x][y];
        if (current !== CellState.Filled) {
            updateCell(x, y, current === CellState.Marked ? CellState.Blank : CellState.Marked);
            incorrectInput = !checkInput(x, y, CellState.Marked)
        }
    };

        return (
            <div style={{display: "inline-block", }}>
                {/* top clues */}
                {grid.getSolved() && !(nonInteractive || noSolve) && (
                    <div className="solved-message">
                        Puzzle solved! Congratulations!
                    </div>
                )}
                {!hideClueColumn && (<div
                    style={{
                        display: "grid",
                        gridTemplateColumns: `3rem repeat(${cols}, 3rem)`,
                        marginBottom: "4px",
                        alignItems: "end",
                    }}
                >
                    <div/>
                    {grid.getCluesX().map((clue, cIdx) => (
                        <div
                            key={`col-${cIdx}`}
                            style={{
                                textAlign: "center",
                                lineHeight: "1rem",
                                fontWeight: "bold",
                                color:
                                    clue.getState() === 0 // Correct
                                        ? "green"
                                        : clue.getState() === 1// Wrong
                                            ? "red"
                                            : clue.getState() === 2 // Unsolved
                                                ? "black"
                                                : "inherit",
                                paddingTop: "0.25rem",
                            }}
                        >
                            {renderClueColumn(clue.getNumbers())}
                        </div>
                    ))}
                </div>)}

                {/* grid with left clues (rows show horizontal clues) */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: `3rem repeat(${cols}, 3rem)`,
                        width: "fit-content",
                        alignItems: "center",
                    }}
                >
                    {Array.from({length: rows}, (_, yIdx) => (
                        <React.Fragment key={`row-${yIdx}`}>
                            <div
                                style={{
                                    textAlign: "center",
                                    lineHeight: "1rem",
                                    fontWeight: "bold",
                                    color:
                                        grid.getCluesY()[yIdx]?.getState() === 0 // Correct
                                            ? "green"
                                            : grid.getCluesY()[yIdx]?.getState() === 1// Wrong
                                                ? "red"
                                                : grid.getCluesY()[yIdx]?.getState() === 2 // Unsolved
                                                    ? "black"
                                                    : "inherit",
                                    paddingRight: "0.25rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                    minWidth: "3rem",
                                }}
                            >
                                {!hideClueRow &&
                                    renderClueRow(grid.getCluesY()[yIdx]?.getNumbers() ?? [])}
                            </div>

                            {Array.from({length: cols}, (_, xIdx) => {
                                const cellState = grid.getCellStates()[xIdx]?.[yIdx] ?? CellState.Blank;
                                const key = `${xIdx}-${yIdx}`;
                                const isHighlighted = highlightedCells.has(key);
                                return (
                                    <div
                                        key={key}
                                        onClick={() => handleLeftClick(xIdx, yIdx)}
                                        onContextMenu={(e) => handleRightClick(xIdx, yIdx, e)}
                                        style={{
                                            backgroundColor: stateToColor(cellState),
                                        }}
                                        className={`cell ${isHighlighted ? "highlighted" : "non-highlighted"}`}
                                    >{cellState === CellState.Marked && (
                                        <span>X</span>
                                    )}{cellState === CellState.Special && (
                                        <span>&#9733;</span>
                                    )}</div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
                {loading && (
                    <div><p>Loading</p></div>
                )}
                {playing && (
                    <div><p>Playing</p></div>
                )}
                {selfSolving && (
                    <button
                        style={{ marginTop: "1rem", width: "100%" }}
                        onClick={() => solve()}
                    >
                        Solve
                    </button>
                )}
                {inputOrder && (
                    <div hidden={!incorrectInput}>Mistake</div>
                )}
                {inputGraphic && (
                    <button
                        style={{ marginTop: "1rem", width: "100%" }}
                        onClick={() => handlePlayGraphic()}
                    >
                        Play
                    </button>
                )}
                {geneticGraphic && (
                    <button
                        style={{ marginTop: "1rem", width: "100%" }}
                        onClick={() => handlePlayGeneticGraphic()}
                    >
                        Play
                    </button>
                )}
                {shuffle && (
                    <button
                        style={{ marginTop: "1rem", width: "100%" }}
                        onClick={() => shuffleGrid()}
                    >
                        Shuffle
                    </button>
                )}
            </div>
        );
};
