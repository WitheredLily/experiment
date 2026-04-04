import React from "react";
import { PageProps} from "./util/page";

export function Page12({ createLink }: PageProps) {

    return (
        <div>
        <div className="tabContent-header">
            <h1>Playing with nonograms</h1>
        </div>
        <div style={{padding: "1rem"}} className="tabContent">
            <div className="learning-section">
                <h2>Congratulations</h2>
                <p>Please complete my survey below:</p>
                <p><a href={"https://docs.google.com/forms/d/e/1FAIpQLSf8tN8hKdKhNOvYBOBAa6ZhrVOffJnvVy-Y-_zzXkhwCa7asA/viewform?usp=publish-editor"}>Survey</a></p>
            </div>
        </div>
        </div>
    );
}
