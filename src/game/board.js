import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// typescript
// File: `src/game/board.tsx`
import React from "react";
import { CellState } from "./nonogram";
var stateToColor = function (s) {
    return s === CellState.Filled ? "black" : s === CellState.Marked ? "gray" : "white";
};
var renderClueColumn = function (nums) {
    return nums.length > 0 ? (_jsx("div", { style: { display: "flex", flexDirection: "column", gap: "0.125rem", alignItems: "center" }, children: nums.map(function (n, i) { return (_jsx("div", { children: n }, i)); }) })) : (_jsx("div", { style: { opacity: 0.4 }, children: "\u00B7" }));
};
var renderClueRow = function (nums) {
    return nums.length > 0 ? (_jsx("div", { style: { display: "flex", gap: "0.25rem", justifyContent: "flex-end", alignItems: "center" }, children: nums.map(function (n, i) { return (_jsx("div", { children: n }, i)); }) })) : (_jsx("div", { style: { opacity: 0.4 }, children: "\u00B7" }));
};
export var ClickableGrid = function (_a) {
    var grid = _a.grid, onGridChange = _a.onGridChange;
    var _b = grid.getSize(), cols = _b[0], rows = _b[1];
    var updateCell = function (x, y, newState) {
        grid.updateCell(x, y, newState);
        grid.checkClues(x, y);
        grid.isSolved();
        var cloned = Object.create(Object.getPrototypeOf(grid), Object.getOwnPropertyDescriptors(grid));
        onGridChange === null || onGridChange === void 0 ? void 0 : onGridChange(cloned);
        grid.save();
    };
    var handleLeftClick = function (x, y) {
        var current = grid.getCellStates()[x][y];
        if (current !== CellState.Marked) {
            updateCell(x, y, current === CellState.Filled ? CellState.Blank : CellState.Filled);
        }
    };
    var handleRightClick = function (x, y, e) {
        e.preventDefault();
        var current = grid.getCellStates()[x][y];
        if (current !== CellState.Filled) {
            updateCell(x, y, current === CellState.Marked ? CellState.Blank : CellState.Marked);
        }
    };
    return (_jsxs("div", { style: { display: "inline-block" }, children: [grid.getSolved() && (_jsx("div", { style: {
                    padding: "1rem",
                    marginBottom: "1rem",
                    backgroundColor: "#e6ffe6",
                    border: "1px solid #00cc00",
                    borderRadius: "4px",
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#006600"
                }, children: "Puzzle solved! Congratulations!" })), _jsxs("div", { style: {
                    display: "grid",
                    gridTemplateColumns: "3rem repeat(".concat(cols, ", 3rem)"),
                    marginBottom: "4px",
                    gap: "4px",
                    alignItems: "end",
                }, children: [_jsx("div", {}), grid.getCluesX().map(function (clue, cIdx) { return (_jsx("div", { style: {
                            textAlign: "center",
                            lineHeight: "1rem",
                            fontWeight: "bold",
                            color: clue.getState() === 0 // Correct
                                ? "green"
                                : clue.getState() === 1 // Wrong
                                    ? "red"
                                    : clue.getState() === 2 // Unsolved
                                        ? "black"
                                        : "inherit",
                            paddingTop: "0.25rem",
                        }, children: renderClueColumn(clue.getNumbers()) }, "col-".concat(cIdx))); })] }), _jsx("div", { style: {
                    display: "grid",
                    gridTemplateColumns: "3rem repeat(".concat(cols, ", 3rem)"),
                    gap: "4px",
                    width: "fit-content",
                    alignItems: "center",
                }, children: Array.from({ length: rows }, function (_, yIdx) {
                    var _a, _b, _c, _d, _e;
                    return (_jsxs(React.Fragment, { children: [_jsx("div", { style: {
                                    textAlign: "center",
                                    lineHeight: "1rem",
                                    fontWeight: "bold",
                                    color: ((_a = grid.getCluesY()[yIdx]) === null || _a === void 0 ? void 0 : _a.getState()) === 0 // Correct
                                        ? "green"
                                        : ((_b = grid.getCluesY()[yIdx]) === null || _b === void 0 ? void 0 : _b.getState()) === 1 // Wrong
                                            ? "red"
                                            : ((_c = grid.getCluesY()[yIdx]) === null || _c === void 0 ? void 0 : _c.getState()) === 2 // Unsolved
                                                ? "black"
                                                : "inherit",
                                    paddingRight: "0.25rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                    minWidth: "3rem",
                                }, children: renderClueRow((_e = (_d = grid.getCluesY()[yIdx]) === null || _d === void 0 ? void 0 : _d.getNumbers()) !== null && _e !== void 0 ? _e : []) }), Array.from({ length: cols }, function (_, xIdx) {
                                var _a, _b;
                                var cellState = (_b = (_a = grid.getCellStates()[xIdx]) === null || _a === void 0 ? void 0 : _a[yIdx]) !== null && _b !== void 0 ? _b : CellState.Blank;
                                return (_jsx("div", { onClick: function () { return handleLeftClick(xIdx, yIdx); }, onContextMenu: function (e) { return handleRightClick(xIdx, yIdx, e); }, style: {
                                        width: "3rem",
                                        height: "3rem",
                                        border: "1px solid #999",
                                        backgroundColor: stateToColor(cellState),
                                        cursor: "pointer",
                                        transition: "background-color 0.15s",
                                    } }, "".concat(yIdx, "-").concat(xIdx)));
                            })] }, "row-".concat(yIdx)));
                }) })] }));
};
