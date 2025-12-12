import React from "react";
import {loadingGrid, PageProps} from "./util/page";

export function Page2({ createLink }: PageProps) {
    return (
        <div style={{ padding: "1rem" }} className="tabcontent">
            <h1>Hi, this section talks about how to solve a nonogram</h1>
            <nav>
                {createLink(1, "Back")} | {createLink(3, "Forward")}
            </nav>
        </div>
    );
}
