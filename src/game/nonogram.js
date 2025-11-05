// typescript
// File: `src/game/nonogram.ts`
var CellState;
(function (CellState) {
    CellState[CellState["Blank"] = 0] = "Blank";
    CellState[CellState["Filled"] = 1] = "Filled";
    CellState[CellState["Marked"] = 2] = "Marked";
})(CellState || (CellState = {}));
var ClueStates;
(function (ClueStates) {
    ClueStates[ClueStates["Correct"] = 0] = "Correct";
    ClueStates[ClueStates["Wrong"] = 1] = "Wrong";
    ClueStates[ClueStates["Unsolved"] = 2] = "Unsolved";
})(ClueStates || (ClueStates = {}));
var loadingErr = new Error("Invalid cell states saved");
var Grid = /** @class */ (function () {
    function Grid(numbersX, numbersY, id, states) {
        var _this = this;
        var cols = numbersX.length;
        var rows = numbersY.length;
        if (states) {
            if (states.length !== cols) {
                throw loadingErr;
            }
            for (var _i = 0, states_1 = states; _i < states_1.length; _i++) {
                var state = states_1[_i];
                if (state.length !== rows) {
                    throw loadingErr;
                }
            }
            this.cellStates = states;
        }
        else {
            this.cellStates = Array.from({ length: cols }, function () {
                return Array.from({ length: rows }, function () { return CellState.Blank; });
            });
        }
        this.cluesArrayX = numbersToClue(numbersX);
        this.cluesArrayY = numbersToClue(numbersY);
        this.numbers = [numbersX, numbersY];
        this.solved = false;
        this.isSolved();
        this.id = id;
        this.cluesArrayX.forEach(function (clue, i) {
            clue.checkClue(_this.cellStates[i]);
        });
        this.cluesArrayY.forEach(function (clue, i) {
            clue.checkClue(_this.cellStates.map(function (column) { return column[i]; }));
        });
        this.save();
    }
    Grid.prototype.save = function () {
        localStorage.setItem(this.id, JSON.stringify({
            numbers: this.numbers,
            cellStates: this.cellStates,
        }));
    };
    Grid.prototype.isSolved = function () {
        var solved = checkSolvedAxis(this.cluesArrayX) && checkSolvedAxis(this.cluesArrayY);
        this.solved = solved;
        return solved;
    };
    Grid.prototype.checkClues = function (x, y) {
        this.cluesArrayX[x].checkClue(this.cellStates[x]);
        var yArray = this.cellStates.map(function (column) { return column[y]; });
        this.cluesArrayY[y].checkClue(yArray);
    };
    Grid.prototype.updateCell = function (x, y, newState) {
        this.cellStates[x][y] = newState;
    };
    Grid.prototype.getSolved = function () {
        return this.solved;
    };
    Grid.prototype.getSize = function () {
        return [this.cluesArrayX.length, this.cluesArrayX.length];
    };
    Grid.prototype.getCellStates = function () {
        return this.cellStates;
    };
    Grid.prototype.getCluesX = function () {
        return this.cluesArrayX;
    };
    Grid.prototype.getCluesY = function () {
        return this.cluesArrayY;
    };
    return Grid;
}());
function loadGrid(id, cols, rows, probability) {
    if (localStorage.getItem(id)) {
        var loadedGrid = JSON.parse(localStorage.getItem(id));
        if (!loadedGrid.solved) {
            return new Grid(loadedGrid.numbers[0], loadedGrid.numbers[1], id, loadedGrid.cellStates);
        }
    }
    return makeRandomGrid(cols, rows, probability, id);
}
var Clues = /** @class */ (function () {
    function Clues(numbers) {
        this.numbers = numbers;
        this.state = ClueStates.Unsolved;
        // m for marked, b for blank, f for filled
        this.regexSolved = RegExp("^[bm]*f{".concat(numbers.join('}[bm]+f{') || '0', "}[bm]*$"));
        this.regexPossible = RegExp("^[bm]*[fb]{".concat(numbers.join('}[bm]+[fb]{') || '0', "}[bm]*$"));
    }
    Clues.prototype.checkClue = function (cells) {
        var row = "";
        for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
            var cell = cells_1[_i];
            switch (cell) {
                case CellState.Marked:
                    row += "m";
                    break;
                case CellState.Filled:
                    row += "f";
                    break;
                case CellState.Blank:
                    row += "b";
                    break;
            }
        }
        if (this.regexSolved.test(row)) {
            this.state = ClueStates.Correct;
        }
        else if (this.regexPossible.test(row)) {
            this.state = ClueStates.Unsolved;
        }
        else {
            this.state = ClueStates.Wrong;
        }
    };
    Clues.prototype.getNumbers = function () {
        return this.numbers;
    };
    Clues.prototype.getState = function () {
        return this.state;
    };
    return Clues;
}());
export function makeRandomGrid(sizeX, sizeY, fillProbability, id) {
    var grid = Array.from({ length: sizeX }, function () {
        return Array.from({ length: sizeY }, function () { return Math.random() < fillProbability; });
    });
    var numbersX = grid.map(function (col) {
        var counts = [];
        var currentCount = 0;
        col.forEach(function (value) {
            if (value) {
                currentCount++;
            }
            else if (currentCount > 0) {
                counts.push(currentCount);
                currentCount = 0;
            }
        });
        if (currentCount > 0)
            counts.push(currentCount);
        return counts;
    });
    var numbersY = Array.from({ length: sizeY }, function (_, y) {
        var counts = [];
        var currentCount = 0;
        for (var x = 0; x < sizeX; x++) {
            if (grid[x][y]) {
                currentCount++;
            }
            else if (currentCount > 0) {
                counts.push(currentCount);
                currentCount = 0;
            }
        }
        if (currentCount > 0)
            counts.push(currentCount);
        return counts;
    });
    return new Grid(numbersX, numbersY, id);
}
function checkSolvedAxis(clues) {
    for (var _i = 0, clues_1 = clues; _i < clues_1.length; _i++) {
        var clue = clues_1[_i];
        if (clue.getState() !== ClueStates.Correct) {
            return false;
        }
    }
    return true;
}
function numbersToClue(numbers) {
    return numbers.map(function (numberSet) { return (new Clues(numberSet)); });
}
export { CellState, loadGrid };
