import React, {useEffect, useState} from "react";
import { ClickableGrid } from "../../game/board";
import { Grid, loadGrid } from "../../game/nonogram";
import {PageProps} from "./util/page";

export function Page3({ createLink }: PageProps) {
    const [grid, setGrid] = useState<Grid | null>(null);
    const image = "https://images2.minutemediacdn.com/image/upload/c_fill,w_1200,ar_1:1,f_auto,q_auto,g_auto/images/voltaxMediaLibrary/mmsport/mentalfloss/01h84ks8b3kn95ybj78q.jpg"
    const gridId = "grid2";
    const cols = 10; // adjust as needed
    const rows = 10;

    useEffect(() => {
        localStorage.removeItem(gridId); // optional: reset grid
        const load = async () => {
            try {
                const g = await loadGrid(
                    gridId,
                    cols,
                    rows,
                    0.5,
                    image
                );
                setGrid(g);
            } catch (err) {
                console.error("Failed to load grid:", err);
            }
        };
        load();
    }, []);

    if (!grid) return <div>Loading grid...</div>;

    return (
        <div style={{padding: "1rem"}}>
            <h1>Page 3</h1>
            <ClickableGrid grid={grid} onGridChange={setGrid}/>
            <br/>
            <img src={image} alt="Cat" width="500" height="600"/>
            <nav>
                {createLink(2, "Back")}
            </nav>
        </div>
    );
}
