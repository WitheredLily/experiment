import { JSX, useEffect, useState } from "react";
import { Grid, loadGrid, makeRandomGrid, rowsToGrid } from "../../../game/nonogram";

interface PageProps {
  createLink: (num: number, text: string, id?: string) => JSX.Element
  useLockableLink: (num: number, text: string, puzzleKeys: string[]) => [JSX.Element, (key: string, solved: boolean) => void]
  navigate: (num: number) => void
}

export type pageLock = {
  lock: boolean
};

function loadingGrid(gridId: string, cols: number, rows: number, probability: number, initialGrid?: Grid, image?: string) {
  const [grid, setGrid] = useState<Grid | null>(null);

  useEffect(() => {
    const load = async () => {
      const g = await loadGrid(gridId, cols, rows, image);
      if (g) {
        console.log("Loaded grid from local storage");
        setGrid(g);
      }
      else {
        if (initialGrid) {
          console.log("Initial grid loaded: ", initialGrid);
          setGrid(initialGrid?.clone(gridId));
        }
        else {
          console.log("Random grid loaded");
          setGrid(rowsToGrid(makeRandomGrid(cols, rows, probability)));
        }
      }
    };

    load();
  }, [gridId, cols, rows, image]);

  return [grid, setGrid] as const;
}

function leftRightMost(clues: number[], size: number): boolean[][] {
  const left = Array(size).fill(false);
  const right = Array(size).fill(false);

  // LEFTMOST
  let pos = 0;
  for (let c = 0; c < clues.length; c++) {
    const len = clues[c];
    for (let i = 0; i < len; i++) {
      left[pos + i] = true;
    }
    pos += len;
    if (c < clues.length - 1) pos += 1; // gap
  }

  // RIGHTMOST
  pos = size;
  for (let c = clues.length - 1; c >= 0; c--) {
    const len = clues[c];
    pos -= len;
    for (let i = 0; i < len; i++) {
      right[pos + i] = true;
    }
    if (c > 0) pos -= 1; // gap
  }

  // COMBINE
  return left.map((_, i) => [left[i], right[i]]);
}

function blankRow(clues: number[][], size: number, id?: string) {
  const yClues = Array.from({ length: size }, () => [1]);
  return new Grid(yClues, clues, id);
}

export async function setData(baseUrl: string, id: string, data: unknown) {
  const response = await fetch(`${baseUrl}/api/set`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      data,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed: ${response.status} ${text}`);
  }

  return response.json();
}

export { loadingGrid, leftRightMost, blankRow };
export type { PageProps };
/*
 export function Page3({ createLink }: PageProps) {
 const [grid, setGrid] = useState<Grid | null>(null);
 const image = "https://art.pixilart.com/sr246d63ced6c5c.png"
 const gridId = "grid2";
 const cols = 10; // adjust as needed
 const rows = 10;

 loadingGrid(gridId, cols, rows, setGrid, 0.5)

 if (!grid) return <div>Loading grid...</div>;

 return (
 <div style={{padding: "1rem"}} className="tabcontent">
 <h1>Page 3</h1>
 <VisualGrid grid={grid} onGridChange={setGrid}/>
 <br/>
 <img src={image} alt="Cat" width="500" height="600"/>
 <nav>
 {createLink(2, "Back")}
 </nav>
 </div>
 );
 }
*/
