import {
    CellState,
    Grid,
    makeRandomGrid,
    rowsToGrid,
    loadGrid,
    checkSolvedAxis,
} from "./nonogram";

// Mock imageToNonogram
jest.mock("../images/image-converter", () => ({
    imageToNonogram: jest.fn(),
}));

import { imageToNonogram } from "../images/image-converter";

describe("Nonogram Grid", () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    describe("Grid construction", () => {
        it("initializes blank cell states by default", () => {
            const numbersX = [[1], []];
            const numbersY = [[1]];

            const grid = new Grid(numbersX, numbersY);

            const states = grid.getCellStates();
            expect(states.length).toBe(2);
            expect(states[0][0]).toBe(CellState.Blank);
            expect(states[1][0]).toBe(CellState.Blank);
        });

        it("throws error when provided invalid saved state dimensions", () => {
            const numbersX = [[1], []];
            const numbersY = [[1]];
            const invalidStates = [[CellState.Blank]]; // wrong size

            expect(() => {
                new Grid(numbersX, numbersY, "id", invalidStates);
            }).toThrow("Invalid cell states saved");
        });

        it("returns correct grid size", () => {
            const grid = new Grid([[1], [1]], [[2]]);
            expect(grid.getSize()).toEqual([2, 1]);
        });
    });

    describe("Cell updates and clues", () => {
        it("updates a cell state", () => {
            const grid = new Grid([[1]], [[1]]);
            grid.updateCell(0, 0, CellState.Filled);

            expect(grid.getCellStates()[0][0]).toBe(CellState.Filled);
        });

        it("checks clues correctly for a filled cell", () => {
            const grid = new Grid([[1]], [[1]]);
            grid.updateCell(0, 0, CellState.Filled);

            const valid = grid.checkClues(0, 0);
            expect(valid).toBe(true);
        });

        it("marks clue as wrong when invalid pattern is used", () => {
            const grid = new Grid([[1]], [[1]]);
            grid.updateCell(0, 0, CellState.Marked);

            const valid = grid.checkClues(0, 0);
            expect(valid).toBe(false);
        });
    });

    describe("Solved state", () => {
        it("is not solved when clues are unsatisfied", () => {
            const grid = new Grid([[1]], [[1]]);
            expect(grid.getSolved()).toBe(false);
        });

        it("is solved when all clues are correct", () => {
            const grid = new Grid([[1]], [[1]]);
            grid.updateCell(0, 0, CellState.Filled);

            grid.checkAllClues();
            expect(grid.isSolved()).toBe(true);
            expect(grid.getSolved()).toBe(true);
        });
    });

    describe("Cloning", () => {
        it("creates a deep clone with same cell states", () => {
            const grid = new Grid([[1]], [[1]], "original");
            grid.updateCell(0, 0, CellState.Filled);

            const clone = grid.clone("clone");

            expect(clone).not.toBe(grid);
            expect(clone.getCellStates()).not.toBe(grid.getCellStates());
            expect(clone.getCellStates()[0][0]).toBe(CellState.Filled);
        });
    });

    describe("Persistence (localStorage)", () => {
        it("saves grid state when id is provided", () => {
            const grid = new Grid([[1]], [[1]], "test-grid");
            grid.updateCell(0, 0, CellState.Filled);
            grid.save();

            const stored = JSON.parse(localStorage.getItem("test-grid")!);
            expect(stored.cellStates[0][0]).toBe(CellState.Filled);
        });

        it("loads grid from localStorage if available", async () => {
            const grid = new Grid([[1]], [[1]], "stored");
            grid.updateCell(0, 0, CellState.Filled);
            grid.save();

            const loaded = await loadGrid("stored", 1, 1, 0.5);
            expect(loaded.getCellStates()[0][0]).toBe(CellState.Filled);
        });
    });

    describe("Random and generated grids", () => {
        it("makeRandomGrid returns correct dimensions", () => {
            const grid = makeRandomGrid(3, 2, 1);
            expect(grid.length).toBe(3);
            expect(grid[0].length).toBe(2);
        });

        it("rowsToGrid generates correct clues", () => {
            const boolGrid = [
                [true, false, true],
                [true, true, false],
            ];

            const grid = rowsToGrid(boolGrid, "rows");

            const [cluesX, cluesY] = grid.getClueNumbers();
            expect(cluesX).toEqual([[1, 1], [2]]);
            expect(cluesY).toEqual([[2], [1], [1]]);
        });
    });

    describe("loadGrid with image", () => {
        it("uses imageToNonogram when image is provided", async () => {
            (imageToNonogram as jest.Mock).mockResolvedValue(
                new Grid([[1]], [[1]], "img")
            );

            const grid = await loadGrid("img", 1, 1, 0.5, "image-data");

            expect(imageToNonogram).toHaveBeenCalled();
            expect(grid).toBeInstanceOf(Grid);
        });
    });

    describe("checkSolvedAxis", () => {
        it("returns false if any clue is not correct", () => {
            const grid = new Grid([[1]], [[1]]);
            expect(checkSolvedAxis(grid.getCluesX())).toBe(false);
        });
    });
});
