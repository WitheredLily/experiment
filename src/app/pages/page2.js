import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ClickableGrid } from "../../game/board";
import { loadGrid } from "../../game/nonogram";
var cols = 2;
var rows = 2;
export function Page2(_a) {
    var createLink = _a.createLink;
    var _b = useState(function () {
        var gridId = "grid1";
        return loadGrid(gridId, cols, rows, 0.5);
    }), grid = _b[0], setGrid = _b[1];
    return (_jsxs("div", { style: { padding: "1rem" }, children: [_jsx("h1", { children: "Page 2" }), _jsx(ClickableGrid, { grid: grid, onGridChange: setGrid }), _jsxs("nav", { children: [createLink(1, "Back"), " | ", createLink(3, "Forward")] })] }));
}
