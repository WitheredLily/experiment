import React from "react";
import {CellState, Grid} from "./nonogram";

interface BoardProps {
    grid: Grid;
    onGridChange?: (newGrid: Grid) => void;
}

const stateToColor = (s: CellState): "white" | "black" | "red" =>
    s === CellState.Filled ? "black" : s === CellState.Flagged ? "red" : "white";

export const ClickableGrid: React.FC<BoardProps> = ({ grid, onGridChange }) => {
    const rows = grid.cellStates.length;
    const cols = rows > 0 ? grid.cellStates[0].length : 0;

    const updateCell = (r: number, c: number, newState: CellState) => {
        // make a shallow copy of rows and each row array
        const cellStates = grid.cellStates.map(row => row.slice());
        cellStates[r][c] = newState;
        onGridChange?.({ ...grid, cellStates });
    };

    const handleLeftClick = (r: number, c: number) => {
        const current = grid.cellStates[r][c];
        updateCell(r, c, current === CellState.Filled ? CellState.Blank : CellState.Filled);
    };

    const handleRightClick = (r: number, c: number, e: React.MouseEvent) => {
        e.preventDefault();
        const current = grid.cellStates[r][c];
        updateCell(r, c, current === CellState.Flagged ? CellState.Blank : CellState.Flagged);
    };

    return (
        <div style={{ display: "inline-block" }}>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `3rem repeat(${cols}, 3rem)`,
                    marginBottom: "4px",
                    gap: "4px",
                }}
            >
                <div />
                {Array.from({ length: cols }, (_, cIdx) => (
                    <div key={`col-${cIdx}`} style={{ textAlign: "center", lineHeight: "3rem", fontWeight: "bold" }}>
                        {cIdx + 1}
                    </div>
                ))}
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `3rem repeat(${cols}, 3rem)`,
                    gap: "4px",
                    width: "fit-content",
                }}
            >
                {grid.cellStates.map((row, rIdx) => (
                    <React.Fragment key={`row-${rIdx}`}>
                        <div style={{ textAlign: "center", lineHeight: "3rem", fontWeight: "bold" }}>{rIdx + 1}</div>
                        {row.map((cellState, cIdx) => (
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
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};
