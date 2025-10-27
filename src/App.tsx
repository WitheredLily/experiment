import React from "react";
import { ClickableGrid } from "./game/board";

export default function App() {
    return (
        <div style={{ padding: "1rem" }}>
            <h1>Exclusive Color Grid</h1>
            <ClickableGrid rows={5} cols={5} />
        </div>
    );
}
