import React, { useState } from "react";

interface GridProps {
    rows: number;
    cols: number;
}

type CellColor = "white" | "black" | "red";

export const ClickableGrid: React.FC<GridProps> = ({ rows, cols }) => {
    const [grid, setGrid] = useState<CellColor[][]>(
        Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => "white")
        )
    );

    const handleLeftClick = (row: number, col: number) => {
        setGrid((prev) => {
            const newGrid = prev.map((r) => [...r]);
            const current = newGrid[row][col];
            if (current === "white") newGrid[row][col] = "black";
            else if (current === "black") newGrid[row][col] = "white";
            return newGrid;
        });
    };

    const handleRightClick = (row: number, col: number, event: React.MouseEvent) => {
        event.preventDefault();
        setGrid((prev) => {
            const newGrid = prev.map((r) => [...r]);
            const current = newGrid[row][col];
            if (current === "white") newGrid[row][col] = "red";
            else if (current === "red") newGrid[row][col] = "white";
            return newGrid;
        });
    };

    return (
        <div style={{ display: "inline-block" }}>
            {/* Column numbers */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `3rem repeat(${cols}, 3rem)`,
                    marginBottom: "4px",
                    gap: "4px",
                }}
            >
                <div /> {/* empty top-left corner */}
                {Array.from({ length: cols }, (_, cIdx) => (
                    <div
                        key={`col-${cIdx}`}
                        style={{
                            textAlign: "center",
                            lineHeight: "3rem",
                            fontWeight: "bold",
                        }}
                    >
                        {cIdx + 2}
                    </div>
                ))}
            </div>

            {/* Grid with row numbers */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `3rem repeat(${cols}, 3rem)`,
                    gap: "4px",
                    width: "fit-content",
                }}
            >
                {grid.map((row, rIdx) => (
                    <React.Fragment key={`row-${rIdx}`}>
                        {/* Row number */}
                        <div
                            style={{
                                textAlign: "center",
                                lineHeight: "3rem",
                                fontWeight: "bold",
                            }}
                        >
                            {rIdx + 1}
                        </div>

                        {/* Row cells */}
                        {row.map((color, cIdx) => (
                            <div
                                key={`${rIdx}-${cIdx}`}
                                onClick={() => handleLeftClick(rIdx, cIdx)}
                                onContextMenu={(e) => handleRightClick(rIdx, cIdx, e)}
                                style={{
                                    width: "3rem",
                                    height: "3rem",
                                    border: "1px solid #999",
                                    backgroundColor: color,
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
