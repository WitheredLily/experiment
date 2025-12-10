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