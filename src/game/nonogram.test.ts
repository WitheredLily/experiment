import { Grid, CellState, makeRandomGrid, rowsToGrid, boolToStates, checkSolvedAxis, loadGrid } from "./nonogram";

describe("Nonogram - Grid", () => {
  const simpleBoolGrid = [[true, false, true, true], [true, true,false, false],]; // 2x2 (columns)

  describe("Construction", () => {
    it("creates a grid with correct size", () => {
      const grid = rowsToGrid(simpleBoolGrid);
      const [cols, rows] = grid.getSize();

      expect(rows).toBe(simpleBoolGrid[0].length);
      expect(cols).toBe(simpleBoolGrid.length);
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
      const grid = rowsToGrid(simpleBoolGrid);
      const states = boolToStates(simpleBoolGrid);

      grid.setStates(states);
      expect(grid.isSolved()).toBe(true);
    });

    it("is not solved if incorrect", () => {
      const grid = rowsToGrid(simpleBoolGrid);

      grid.updateCell(0, 0, CellState.Filled);
      expect(grid.isSolved()).toBe(false);
    });

    it("clear resets all cells to blank", () => {
      const grid = rowsToGrid(simpleBoolGrid);
      grid.clear();

      const states = grid.getCellStates();
      states.forEach(col =>
        col.forEach(cell => expect(cell).toBe(CellState.Blank)),);
    });

    it("markBlank marks all blank cells", () => {
      const grid = rowsToGrid(simpleBoolGrid);
      grid.clear();
      grid.markBlank();

      const states = grid.getCellStates();
      states.forEach(col =>
        col.forEach(cell => expect(cell).toBe(CellState.Marked)),);
    });

    it("blankMarked reverts marked cells to blank", () => {
      const grid = rowsToGrid(simpleBoolGrid);
      grid.markBlank();
      grid.blankMarked();

      const states = grid.getCellStates();
      states.forEach(col =>
        col.forEach(cell => expect(cell).toBe(CellState.Blank)),);
    });
  });

  describe("Clone", () => {
    it("clones grid deeply", () => {
      const grid = rowsToGrid(simpleBoolGrid);
      const clone = grid.clone("new-id");

      clone.updateCell(0, 0, CellState.Filled);

      expect(grid.getCellStates()[0][0]).not.toBe(clone.getCellStates()[0][0],);
    });
  });

  describe("Serialization", () => {
    it("serializes and deserializes correctly", () => {
      const grid = rowsToGrid(simpleBoolGrid);
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
    const grid = rowsToGrid([[true]]);
    grid.setStates([[CellState.Filled]]);

    const result = checkSolvedAxis(grid.getCluesX());
    expect(result).toBe(true);
  });

  it("checkSolvedAxis returns false if any wrong", () => {
    const grid = rowsToGrid([[true]]);
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
    const boolGrid = [[true, true, false], [false, true, false],];
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
    const grid = rowsToGrid([[true]]);
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

jest.mock("../images/image-converter", () => ({
  imageToNonogram: jest.fn(),
}));

describe("Nonogram - Grid", () => {
  const simpleBoolGrid = [[true, false, true, true], [true, true, false, false],];

  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  describe("Construction", () => {
    it("creates a grid with correct size", () => {
      const grid = rowsToGrid(simpleBoolGrid);
      const [cols, rows] = grid.getSize();

      expect(rows).toBe(simpleBoolGrid[0].length);
      expect(cols).toBe(simpleBoolGrid.length);
    });

    it("initializes all cells as blank when no saved state is provided", () => {
      const grid = rowsToGrid(simpleBoolGrid);

      grid.getCellStates().forEach(col => {
        col.forEach(cell => {
          expect(cell).toBe(CellState.Blank);
        });
      });
    });

    it("throws if provided invalid saved state shape", () => {
      const numbersX = [[1], [2]];
      const numbersY = [[1], [1]];

      expect(() => {
        new Grid(numbersX, numbersY, "id", [[CellState.Blank]]);
      }).toThrow("Invalid cell states saved");
    });

    it("accepts a valid saved state shape", () => {
      const numbersX = [[1], [1]];
      const numbersY = [[2]];
      const states = [[CellState.Filled], [CellState.Blank],];

      const grid = new Grid(numbersX, numbersY, "id", states);

      expect(grid.getCellStates()).toEqual(states);
    });
  });

  describe("Cell updates and solving", () => {
    it("marks grid solved when correct solution is filled", () => {
      const grid = rowsToGrid(simpleBoolGrid);
      const states = boolToStates(simpleBoolGrid);

      grid.setStates(states);

      expect(grid.isSolved()).toBe(true);
      expect(grid.getSolved()).toBe(true);
    });

    it("is not solved if incorrect", () => {
      const grid = rowsToGrid(simpleBoolGrid);

      grid.updateCell(0, 0, CellState.Filled);

      expect(grid.isSolved()).toBe(false);
      expect(grid.getSolved()).toBe(false);
    });

    it("setStates returns false when dimensions do not match", () => {
      const grid = rowsToGrid(simpleBoolGrid);
      const before = JSON.stringify(grid.getCellStates());

      const result = grid.setStates([[CellState.Filled]] as CellState[][]);

      expect(result).toBe(false);
      expect(JSON.stringify(grid.getCellStates())).toBe(before);
    });

    it("setStates updates all cells when dimensions match", () => {
      const grid = rowsToGrid(simpleBoolGrid);
      const states = boolToStates(simpleBoolGrid);

      const result = grid.setStates(states);

      expect(result).not.toBe(false);
      expect(grid.getCellStates()).toEqual(states);
    });

    it("updateCell updates only the targeted cell", () => {
      const grid = rowsToGrid(simpleBoolGrid);
      const before = JSON.stringify(grid.getCellStates());

      grid.updateCell(0, 0, CellState.Filled);

      expect(grid.getCellStates()[0][0]).toBe(CellState.Filled);
      expect(JSON.stringify(grid.getCellStates())).not.toBe(before);
      expect(grid.getCellStates()[1][1]).toBe(CellState.Blank);
    });

    it("clear resets all cells to blank", () => {
      const grid = rowsToGrid(simpleBoolGrid);
      grid.setStates(boolToStates(simpleBoolGrid));

      grid.clear();

      const states = grid.getCellStates();
      states.forEach(col =>
        col.forEach(cell => expect(cell).toBe(CellState.Blank)));
    });

    it("markBlank marks all blank cells", () => {
      const grid = rowsToGrid(simpleBoolGrid);
      grid.clear();
      grid.markBlank();

      const states = grid.getCellStates();
      states.forEach(col =>
        col.forEach(cell => expect(cell).toBe(CellState.Marked)));
    });

    it("markBlank does not change filled cells", () => {
      const grid = rowsToGrid(simpleBoolGrid);
      grid.updateCell(0, 0, CellState.Filled);
      grid.markBlank();

      expect(grid.getCellStates()[0][0]).toBe(CellState.Filled);
      expect(grid.getCellStates()[0][1]).toBe(CellState.Marked);
    });

    it("blankMarked reverts marked cells to blank", () => {
      const grid = rowsToGrid(simpleBoolGrid);
      grid.markBlank();
      grid.blankMarked();

      const states = grid.getCellStates();
      states.forEach(col =>
        col.forEach(cell => expect(cell).toBe(CellState.Blank)));
    });

    it("blankMarked does not change filled cells", () => {
      const grid = rowsToGrid(simpleBoolGrid);
      grid.updateCell(0, 0, CellState.Filled);
      grid.markBlank();
      grid.blankMarked();

      expect(grid.getCellStates()[0][0]).toBe(CellState.Filled);
    });

    it("supports alternate solution solving", () => {
      const grid = new Grid([[1]], [[1]]);
      grid.setAlternateSolution([[[CellState.Filled]]]);

      grid.updateCell(0, 0, CellState.Filled);

      expect(grid.getSolved()).toBe(true);
      expect(grid.isSolved()).toBe(true);
    });

    it("does not solve if alternate solution does not match", () => {
      const grid = new Grid([[1]], [[1]]);
      grid.setAlternateSolution([[[CellState.Filled]]]);

      grid.updateCell(0, 0, CellState.Blank);

      expect(grid.getSolved()).toBe(false);
      expect(grid.isSolved()).toBe(false);
    });
  });

  describe("Clone", () => {
    it("clones grid deeply", () => {
      const grid = rowsToGrid(simpleBoolGrid);
      const clone = grid.clone("new-id");

      clone.updateCell(0, 0, CellState.Filled);

      expect(grid.getCellStates()[0][0]).toBe(CellState.Blank);
      expect(clone.getCellStates()[0][0]).toBe(CellState.Filled);
    });

    it("preserves clue numbers and cell states in clone", () => {
      const grid = rowsToGrid(simpleBoolGrid);
      grid.setStates(boolToStates(simpleBoolGrid));

      const clone = grid.clone("clone-id");

      expect(clone.getClueNumbers()).toEqual(grid.getClueNumbers());
      expect(clone.getCellStates()).toEqual(grid.getCellStates());
    });

    it("deep copies alternate solution", () => {
      const grid = new Grid([[1]], [[1]], "grid-id");
      const alt = [[[CellState.Filled]]];
      grid.setAlternateSolution(alt);

      const clone = grid.clone("clone-id");

      expect(clone.toJSON().alternateSolution).toEqual(alt);

      (clone.toJSON().alternateSolution as CellState[][][])[0][0][0] = CellState.Blank;
      expect(grid.toJSON().alternateSolution).toEqual(alt);
    });
  });

  describe("Serialization", () => {
    it("serializes and deserializes correctly", () => {
      const grid = rowsToGrid(simpleBoolGrid);
      grid.setStates(boolToStates(simpleBoolGrid));

      const json = grid.toJSON();
      const restored = Grid.fromJSON(json);

      expect(restored.getClueNumbers()).toEqual(grid.getClueNumbers());
      expect(restored.getCellStates()).toEqual(grid.getCellStates());
    });

    it("preserves alternate solution after round-trip serialization", () => {
      const grid = new Grid([[1]], [[1]]);
      grid.setAlternateSolution([[[CellState.Filled]]]);

      const restored = Grid.fromJSON(grid.toJSON());

      expect(restored.toJSON().alternateSolution).toEqual(grid.toJSON().alternateSolution);
    });
  });

  describe("Clue + Axis solving", () => {
    it("checkSolvedAxis returns true if all correct", () => {
      const grid = rowsToGrid([[true]]);
      grid.setStates([[CellState.Blank]]);

      grid.updateCell(0, 0, CellState.Filled);

      const result = checkSolvedAxis(grid.getCluesX());
      expect(result).toBe(true);
    });

    it("checkSolvedAxis returns false if any wrong", () => {
      const grid = rowsToGrid([[true]]);
      grid.setStates([[CellState.Blank]]);

      const result = checkSolvedAxis(grid.getCluesX());
      expect(result).toBe(false);
    });

    it("checkClues returns true when row and column clues are both valid", () => {
      const grid = rowsToGrid([[true]]);
      grid.setStates([[CellState.Filled]]);

      expect(grid.checkClues(0, 0)).toBe(true);
    });

    it("checkClues returns false when the cell breaks the clue", () => {
      const grid = rowsToGrid([[true]]);
      grid.setStates([[CellState.Marked]]);
      console.log(grid.getClueNumbers(), grid.getCellStates());

      expect(grid.checkClues(0, 0)).toBe(false);
    });

    it("treats special cells like blank in clue evaluation", () => {
      const grid = rowsToGrid([[true]]);
      grid.setStates([[CellState.Special]]);

      expect(grid.checkClues(0, 0)).toBe(true);
    });
  });

  describe("Utility functions", () => {
    it("makeRandomGrid respects size", () => {
      const grid = makeRandomGrid(3, 4, 0.5);
      expect(grid.length).toBe(3);
      expect(grid[0].length).toBe(4);
    });

    it("makeRandomGrid returns only booleans", () => {
      const grid = makeRandomGrid(3, 4, 0.5);

      grid.forEach(col => {
        col.forEach(cell => {
          expect(typeof cell).toBe("boolean");
        });
      });
    });

    it("makeRandomGrid with probability 0 returns all false", () => {
      const grid = makeRandomGrid(3, 4, 0);

      expect(grid.flat().every(cell => !cell)).toBe(true);
    });

    it("makeRandomGrid with probability 1 returns all true", () => {
      const grid = makeRandomGrid(3, 4, 1);

      expect(grid.flat().every(cell => cell)).toBe(true);
    });

    it("rowsToGrid generates matching clues", () => {
      const boolGrid = [[true, true, false], [false, true, false],];
      const grid = rowsToGrid(boolGrid);

      const [numbersX, numbersY] = grid.getClueNumbers();

      expect(numbersX).toEqual([[2], [1]]);
      expect(numbersY).toEqual([[1], [2], []]);
    });

    it("boolToStates converts correctly", () => {
      const boolGrid = [[true, false]];
      const states = boolToStates(boolGrid);

      expect(states[0][0]).toBe(CellState.Filled);
      expect(states[0][1]).toBe(CellState.Blank);
    });

    it("boolToStates preserves shape", () => {
      const boolGrid = [[true, false], [false, true],];
      const states = boolToStates(boolGrid);

      expect(states.length).toBe(boolGrid.length);
      expect(states[0].length).toBe(boolGrid[0].length);
      expect(states[1].length).toBe(boolGrid[1].length);
    });
  });

  describe("loadGrid", () => {
    it("loads from localStorage if present", async () => {
      const grid = rowsToGrid([[true]]);
      localStorage.setItem("test-id", JSON.stringify(grid.toJSON()));

      const loaded = await loadGrid("test-id", 1, 1);

      expect(loaded).not.toBeNull();
      expect(loaded?.getClueNumbers()).toEqual(grid.getClueNumbers());
      expect(loaded?.getCellStates()).toEqual(grid.getCellStates());
    });

    it("returns null if no storage and no image", async () => {
      const loaded = await loadGrid("missing", 2, 2);
      expect(loaded).toBeNull();
    });

    it("prefers localStorage over image input", async () => {
      const { imageToNonogram } = await import("../images/image-converter");
      const converter = imageToNonogram as jest.Mock;

      const grid = rowsToGrid([[true]]);
      localStorage.setItem("test-id", JSON.stringify(grid.toJSON()));

      const loaded = await loadGrid("test-id", 1, 1, "fake-image.png");

      expect(loaded).not.toBeNull();
      expect(loaded?.getClueNumbers()).toEqual(grid.getClueNumbers());
      expect(converter).not.toHaveBeenCalled();
    });

    it("falls back to image conversion when storage is missing", async () => {
      const { imageToNonogram } = await import("../images/image-converter");
      const converter = imageToNonogram as jest.Mock;

      const fallbackGrid = rowsToGrid([[true]]);
      converter.mockResolvedValue(fallbackGrid);

      const loaded = await loadGrid("missing", 1, 1, "fake-image.png");

      expect(converter).toHaveBeenCalledWith("fake-image.png", 1, 1, "missing");
      expect(loaded).toBe(fallbackGrid);
    });
  });
});
