import {PageProps} from "./util/page";
import React from "react";

export function Page1({ createLink }: PageProps) {
    return (
        <div className="tabcontent">
            <h1>Hi this section explains what a nonogram is</h1>
            <nav>
                {createLink(2,"Forward")}
            </nav>
        </div>
    );
}