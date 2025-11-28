import {PageProps} from "./util/page";

export function Page0({ createLink }: PageProps) {
    return (
        <div className="tabcontent">
            <h1>Home Page</h1>
            <nav>{createLink(1, "Forward")}</nav>
        </div>
    );
}