import {JSX, useEffect} from "react";
import {loadGrid} from "../../../game/nonogram";

interface PageProps {
    createLink: (num: number, text: string) => JSX.Element;
    navigate: (num: number) => void;
}

function loadingGrid(gridId:string, cols:number, rows:number, setGrid: (g: any) => void, probability: number) {
    useEffect(() => {
        localStorage.removeItem(gridId); // optional: reset grid
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