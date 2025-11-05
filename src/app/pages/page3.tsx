import {PageProps} from "./util/page";
import React from "react";

export function Page3({ createLink }: PageProps) {
    return (
        <div>
            <h1>Page 3</h1>
            <nav>
                {createLink(2,"Back")}
            </nav>
        </div>
    );
}