import {JSX, useEffect} from "react";
import {Grid, loadGrid} from "../../../game/nonogram";
import {boolean} from "zod";

interface PageProps {
    createLink: (num: number, text: string, id?: string) => JSX.Element;
    useLockableLink: (num: number, text: string, initialLocked: boolean) => [JSX.Element, (locked: boolean) => void]
    navigate: (num: number) => void;
}

export type pageLock = {
    lock: boolean;
}

function loadingGrid(gridId:string, cols:number, rows:number, setGrid: (g: any) => void, probability: number, grid?: Grid) {

    useEffect(() => {
        //localStorage.removeItem(gridId); // optional: reset grid
        if (grid) {
            setGrid(grid)
            return
        }
        const load = async () => {
            try {
                const g = await loadGrid(
                    gridId,
                    cols,
                    rows,
                    probability
                );
                setGrid(g);
            } catch (err) {
                console.error("Failed to load grid:", err);
            }
        };
        load();
    }, []);
}

export async function setData(baseUrl: string, id: string, data: unknown) {
    const response = await fetch(`${baseUrl}/api/set`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
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

export {loadingGrid}
export type { PageProps}
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