import React from "react";
import { PageProps} from "../util/page";

export function Page10({ createLink, useLockableLink }: PageProps) {
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
                <p>Here are some examples of search algorithms searching through lists of numbers:</p>
                <h2>Linear Search</h2>
                <p>Linear search is checking each one in order until you find what you are looking for. It is extremely simple but often slow especially in larger data sets. It is best suited for unordered datasets.</p>
                <img src="/images/Linear%20Search.svg" alt="Linear Search" width={"60%"} />

                <h2>Binary Search</h2>
                <p>In binary search, you start by looking at the middle of the list and compare it to your target. If your target is smaller, you only search the first half, if it’s larger, you search the second half. Repeat this until you find what you are looking for. It's much faster than linear but isn't always the fastest. It is simple to implement but there are usually more specific search algorithms that would be faster.</p>
                <img src="/images/Binary%20Search.svg" alt="Binary Search" width={"60%"} />

                <h2>Jump Search</h2>
                <p>Jump search is a searching algorithm for sorted arrays that works by jumping ahead by fixed steps (instead of checking every element one by one) to find the block where the target might be, and then doing a linear search within that block.</p>
                <img src="/images/Jump%20Search.svg" alt="Jump Search" width={"60%"} />

                <h2>Interpolation Search</h2>
                <p>Interpolation search is a searching algorithm for sorted arrays that estimates where a value might be based on its size, instead of always checking the middle like binary search.</p>
                <p>Here is a formula that can be used to determine where to look. High starts as the end of the array and any time the formula gives a result higher than the target you use that position instead. Low starts as the start of the array and any time the formula gives a result lower than the target you use that position instead.</p>
                <img src="/images/Interpolation%20Search.svg" alt="Interpolation Search" width={"60%"} />
                <img src="/images/Interpolation.svg" alt="Interpolation" width={"60%"} />

                <nav className={"navButton"}>
                    {createLink(9, "Back")} | {createLink(11, "Next")}
                </nav>
            </div>
        </div>
    );
}
