import {PageProps} from "./util/page";

export function Page0({ navigate }: PageProps) {
    return (
        <div className="tabcontent">
            <h1>Home Page</h1>
            <button onClick={() => navigate(1)}>Start</button>
        </div>
    );
}