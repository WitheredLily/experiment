import {Grid, CellState, makeRandomGrid, rowsToGrid, boolToStates, makeGrid, checkSolvedAxis, loadGrid} from "./nonogram";

describe("Nonogram - Grid", () => {
    const simpleBoolGrid = [
        [true, false],
        [true, true],
    ]; // 2x2 (columns)

    describe("Construction", () => {
        it("creates a grid with correct size", () => {
            const grid = makeGrid(simpleBoolGrid);
            const [cols, rows] = grid.getSize();

            expect(cols).toBe(2);
            expect(rows).toBe(2);
        });

        it("throws if provided invalid saved state shape", () => {
            const numbersX = [[1], [2]];
            const numbersY = [[1], [1]];

            expect(() => {
                new Grid(numbersX, numbersY, "id", [[CellState.Blank]]);
            }).toThrow("Invalid cell states saved");
        });
    });

    describe("Cell updates and solving", () => {
        it("marks grid solved when correct solution is filled", () => {
            const grid = makeGrid(simpleBoolGrid);
            const states = boolToStates(simpleBoolGrid);

            grid.setStates(states);
            expect(grid.isSolved()).toBe(true);
        });

        it("is not solved if incorrect", () => {
            const grid = makeGrid(simpleBoolGrid);

            grid.updateCell(0, 0, CellState.Filled);
            expect(grid.isSolved()).toBe(false);
        });

        it("clear resets all cells to blank", () => {
            const grid = makeGrid(simpleBoolGrid);
            grid.clear();

            const states = grid.getCellStates();
            states.forEach(col =>
                col.forEach(cell => expect(cell).toBe(CellState.Blank))
            );
        });

        it("markBlank marks all blank cells", () => {
            const grid = makeGrid(simpleBoolGrid);
            grid.clear();
            grid.markBlank();

            const states = grid.getCellStates();
            states.forEach(col =>
                col.forEach(cell => expect(cell).toBe(CellState.Marked))
            );
        });

        it("blankMarked reverts marked cells to blank", () => {
            const grid = makeGrid(simpleBoolGrid);
            grid.markBlank();
            grid.blankMarked();

            const states = grid.getCellStates();
            states.forEach(col =>
                col.forEach(cell => expect(cell).toBe(CellState.Blank))
            );
        });
    });

    describe("Clone", () => {
        it("clones grid deeply", () => {
            const grid = makeGrid(simpleBoolGrid);
            const clone = grid.clone("new-id");

            clone.updateCell(0, 0, CellState.Filled);

            expect(grid.getCellStates()[0][0]).not.toBe(
                clone.getCellStates()[0][0]
            );
        });
    });

    describe("Serialization", () => {
        it("serializes and deserializes correctly", () => {
            const grid = makeGrid(simpleBoolGrid);
            const json = grid.toJSON();
            const restored = Grid.fromJSON(json);

            expect(restored.getClueNumbers()).toEqual(grid.getClueNumbers());
        });
    });

    describe("Alternate solution", () => {
        it("solves if cell matches one allowed alternate state", () => {
            const numbersX = [[1]];
            const numbersY = [[1]];

            const grid = new Grid(numbersX, numbersY);
            const altSolution = [[[CellState.Filled]]];

            grid.setAlternateSolution(altSolution);
            grid.updateCell(0, 0, CellState.Filled);

            expect(grid.getSolved()).toBe(true);
        });

        it("does not solve if alternate solution mismatch", () => {
            const numbersX = [[1]];
            const numbersY = [[1]];

            const grid = new Grid(numbersX, numbersY);
            const altSolution = [[[CellState.Filled]]];

            grid.setAlternateSolution(altSolution);
            grid.updateCell(0, 0, CellState.Blank);

            expect(grid.getSolved()).toBe(false);
        });
    });
});

describe("Clue + Axis solving", () => {
    it("checkSolvedAxis returns true if all correct", () => {
        const grid = makeGrid([[true]]);
        grid.setStates([[CellState.Filled]]);

        const result = checkSolvedAxis(grid.getCluesX());
        expect(result).toBe(true);
    });

    it("checkSolvedAxis returns false if any wrong", () => {
        const grid = makeGrid([[true]]);
        grid.setStates([[CellState.Blank]]);

        const result = checkSolvedAxis(grid.getCluesX());
        expect(result).toBe(false);
    });
});

describe("Utility functions", () => {
    it("makeRandomGrid respects size", () => {
        const grid = makeRandomGrid(3, 4, 0.5);
        expect(grid.length).toBe(3);
        expect(grid[0].length).toBe(4);
    });

    it("rowsToGrid generates matching clues", () => {
        const boolGrid = [
            [true, true, false],
            [false, true, false],
        ];
        const grid = rowsToGrid(boolGrid);

        const [numbersX, numbersY] = grid.getClueNumbers();

        expect(numbersX).toEqual([[2], [1]]);
        expect(numbersY.length).toBe(3);
    });

    it("boolToStates converts correctly", () => {
        const boolGrid = [[true, false]];
        const states = boolToStates(boolGrid);

        expect(states[0][0]).toBe(CellState.Filled);
        expect(states[0][1]).toBe(CellState.Blank);
    });
});

describe("loadGrid", () => {
    beforeEach(() => {
        localStorage.clear();
        jest.restoreAllMocks();
    });

    it("loads from localStorage if present", async () => {
        const grid = makeGrid([[true]]);
        localStorage.setItem("test-id", JSON.stringify(grid.toJSON()));

        const loaded = await loadGrid("test-id", 1, 1);
        expect(loaded).not.toBeNull();
        expect(loaded?.getClueNumbers()).toEqual(grid.getClueNumbers());
    });

    it("returns null if no storage and no image", async () => {
        const loaded = await loadGrid("missing", 2, 2);
        expect(loaded).toBeNull();
    });
});