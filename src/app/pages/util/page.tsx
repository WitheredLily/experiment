import {JSX} from "react";

interface PageProps {
    createLink: (num: number, text: string) => JSX.Element;
}

export type { PageProps}