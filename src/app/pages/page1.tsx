import {PageProps} from "./util/page";
import React from "react";

export function Page1({ createLink }: PageProps) {
    return (
        <div className="tabcontent">
            <h1>Page 1</h1>
            <nav>
                {createLink(2,"Forward")}
            </nav>
        </div>
    );
}