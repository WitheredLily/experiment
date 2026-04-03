import React, {useEffect, useState} from "react";
import {loadingGrid, PageProps} from "./util/page";
import {Grid} from "../../game/nonogram";

export function Page10({ createLink, useLockableLink }: PageProps) {
    localStorage.removeItem("gridGuide1");
    const [grid, setGrid] = useState<Grid | null>(null);
    const gridId = "gridGuide1";
    useEffect(() => {
        setGrid(new Grid([[1,1],[1,1]], [[1],[1],[1],[1]], gridId));
    }, []);

    if (!grid) return <div>Loading grid...</div>;
    return (
        <div>
            <div className="tabContent-header">
                <h1>Search Algorithms</h1>
            </div>
            <div style={{padding: "1rem"}} className="tabContent">
                <p>A search algorithm is a method used by computers to find specific data point in larger set of information. It's like looking for a word in a dictionary but done systematically by following a set of rules so the computer can do it efficiently. Search algorithms are fundamental in computing because almost every program needs to locate something, whether it’s a file or a number in a list. There are many types of search algorithms:</p>
                <ul>
                    <li>Linear Search</li>
                    <li>Binary Search</li>
                    <li>Jump Search</li>
                    <li>Interpolation Search</li>
                </ul>
                <h2>Linear Search</h2>
                <p>Linear search is checking each one in order until you find what you are looking for. It is extremely simple but often slow especially in larger data sets. It is best suited for unordered datasets.</p>
                <h2>Binary Search</h2>
                <p>In binary search, you start by looking at the middle of the list and compare it to your target. If your target is smaller, you only search the first half, if it’s larger, you search the second half. Repeat this until you find what you are looking for. It's much faster than linear but isn't always the fastest. It is simple to implement but there are usually more specific search algorithms that would be faster.</p>
                <nav className={"navButton"}>
                    {createLink(9, "Back")} | {createLink(11, "Forward")}
                </nav>
            </div>
        </div>
    );
}
