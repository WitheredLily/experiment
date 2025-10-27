// src/game/board.tsx
import React from "react";
import {CellState, checkCell, Grid} from "./nonogram";

interface BoardProps {
    grid: Grid;
    onGridChange?: (newGrid: Grid) => void;
}

const stateToColor = (s: CellState): "white" | "black" | "red" =>
    s === CellState.Filled ? "black" : s === CellState.Flagged ? "red" : "white";

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
    const cols = grid.numbersX.length;
    const rows = grid.numbersY.length;

    const updateCell = (r: number, c: number, newState: CellState) => {
        const cellStates = grid.cellStates.map(col => col.slice());
        cellStates[c][r] = newState;
        onGridChange?.({ ...grid, cellStates });
        checkCell(grid,r,c)
    };

    const handleLeftClick = (r: number, c: number) => {
        const current = grid.cellStates[c][r];
        updateCell(r, c, current === CellState.Filled ? CellState.Blank : CellState.Filled);
    };

    const handleRightClick = (r: number, c: number, e: React.MouseEvent) => {
        e.preventDefault();
        const current = grid.cellStates[c][r];
        updateCell(r, c, current === CellState.Flagged ? CellState.Blank : CellState.Flagged);
    };

    return (
        <div style={{ display: "inline-block" }}>
            {/* top clues */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `3rem repeat(${cols}, 3rem)`,
                    marginBottom: "4px",
                    gap: "4px",
                    alignItems: "end",
                }}
            >
                <div />
                {grid.numbersX.map((clue, cIdx) => (
                    <div
                        key={`col-${cIdx}`}
                        style={{
                            textAlign: "center",
                            lineHeight: "1rem",
                            fontWeight: "bold",
                            color: clue.wrong ? "red" : "inherit",
                            paddingTop: "0.25rem",
                        }}
                    >
                        {renderClueColumn(clue.numbers)}
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
                {Array.from({ length: rows }, (_, rIdx) => (
                    <React.Fragment key={`row-${rIdx}`}>
                        <div
                            style={{
                                textAlign: "center",
                                lineHeight: "1rem",
                                fontWeight: "bold",
                                color: grid.numbersY[rIdx]?.wrong ? "red" : "inherit",
                                paddingRight: "0.25rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                                minWidth: "3rem",
                            }}
                        >
                            {renderClueRow(grid.numbersY[rIdx]?.numbers ?? [])}
                        </div>

                        {Array.from({ length: cols }, (_, cIdx) => {
                            const cellState = grid.cellStates[cIdx]?.[rIdx] ?? CellState.Blank;
                            return (
                                <div
                                    key={`${rIdx}-${cIdx}`}
                                    onClick={() => handleLeftClick(rIdx, cIdx)}
                                    onContextMenu={(e) => handleRightClick(rIdx, cIdx, e)}
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
