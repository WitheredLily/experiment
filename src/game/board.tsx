// typescript
// File: `src/game/board.tsx`
import React from "react";
import { CellState, Grid} from "./nonogram";

interface BoardProps {
    grid: Grid;
    onGridChange?: (newGrid: Grid) => void;
}

const stateToColor = (s: CellState): "white" | "black" | "gray" =>
    s === CellState.Filled ? "black" : s === CellState.Flagged ? "gray" : "white";

const renderClueColumn = (nums: number[]) =>
    nums.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem", alignItems: "center" }}>
            {nums.map((n, i) => (
                <div key={i}>{n}</div>
            ))}
        </div>
    ) : (
        <div style={{ opacity: 0.4 }}>·</div>
    );

const renderClueRow = (nums: number[]) =>
    nums.length > 0 ? (
        <div style={{ display: "flex", gap: "0.25rem", justifyContent: "flex-end", alignItems: "center" }}>
            {nums.map((n, i) => (
                <div key={i}>{n}</div>
            ))}
        </div>
    ) : (
        <div style={{ opacity: 0.4 }}>·</div>
    );

export const ClickableGrid: React.FC<BoardProps> = ({ grid, onGridChange }) => {
    const [cols, rows] = grid.getSize();

    const updateCell = (x: number, y: number, newState: CellState) => {
        grid.updateCell(x, y, newState);
        grid.checkClues(x, y);
        grid.isSolved();
        const cloned = Object.create(Object.getPrototypeOf(grid), Object.getOwnPropertyDescriptors(grid)) as Grid;
        onGridChange?.(cloned);
        grid.save();
    };

    const handleLeftClick = (x: number, y: number) => {
        const current = grid.getCellStates()[x][y];
        if (current !== CellState.Flagged) {
            updateCell(x, y, current === CellState.Filled ? CellState.Blank : CellState.Filled);
        }
    };

    const handleRightClick = (x: number, y: number, e: React.MouseEvent) => {
        e.preventDefault();
        const current = grid.getCellStates()[x][y];
        if (current !== CellState.Filled) {
            updateCell(x, y, current === CellState.Flagged ? CellState.Blank : CellState.Flagged);
        }
    };

        return (
            <div style={{display: "inline-block"}}>
                {/* top clues */}
                {grid.getSolved() && (
                    <div style={{
                        padding: "1rem",
                        marginBottom: "1rem",
                        backgroundColor: "#e6ffe6",
                        border: "1px solid #00cc00",
                        borderRadius: "4px",
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#006600"
                    }}>
                        Puzzle solved! Congratulations!
                    </div>
                )}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: `3rem repeat(${cols}, 3rem)`,
                        marginBottom: "4px",
                        gap: "4px",
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
                </div>

                {/* grid with left clues (rows show horizontal clues) */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: `3rem repeat(${cols}, 3rem)`,
                        gap: "4px",
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
                                {renderClueRow(grid.getCluesY()[yIdx]?.getNumbers() ?? [])}
                            </div>

                            {Array.from({length: cols}, (_, xIdx) => {
                                const cellState = grid.getCellStates()[xIdx]?.[yIdx] ?? CellState.Blank;
                                return (
                                    <div
                                        key={`${yIdx}-${xIdx}`}
                                        onClick={() => handleLeftClick(xIdx, yIdx)}
                                        onContextMenu={(e) => handleRightClick(xIdx, yIdx, e)}
                                        style={{
                                            width: "3rem",
                                            height: "3rem",
                                            border: "1px solid #999",
                                            backgroundColor: stateToColor(cellState),
                                            cursor: "pointer",
                                            transition: "background-color 0.15s",
                                        }}
                                    />
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        );
};
