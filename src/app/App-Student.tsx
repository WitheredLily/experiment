import React, {JSX, useState} from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import {pageList} from "./pages";
import "./App-Student.css";

export default function AppStudent() {
    //localStorage.clear();
    const navigate = useNavigate();
    function changeCurrentPage(num: number){
        if (num > maxPage) {
            setMaxPage(num);
            localStorage.setItem("maxPage", num.toString());
            window.scrollTo(0, 0);
        }
        setCurrentPage(num);
        localStorage.setItem("currentPage", num.toString());
        navigate(`/page${num}`);
    }

    function useLockableLink(
        num: number,
        text: string,
        puzzleKeys: string[], // <-- pass identifiers from page
    ): [JSX.Element, (key: string, solved: boolean) => void] {

        const [solvedStates, setSolvedStates] = React.useState<Record<string, boolean>>(
            Object.fromEntries(puzzleKeys.map(k => [k, false]))
        );

        const [locked, setLocked] = React.useState(true);

        const reportSolved = (key: string, solved: boolean) => {
            if (key === "all") {
                // Unlock everything immediately for testing
                setSolvedStates(Object.fromEntries(puzzleKeys.map(k => [k, true])));
                setLocked(false);
                return;
            }
            setSolvedStates(prev => {
                const updated = { ...prev, [key]: solved };

                const allSolved = Object.values(updated).every(Boolean);
                setLocked(!allSolved);

                return updated;
            });
        };

        const button = (
            <button
                disabled={locked}
                onClick={() => changeCurrentPage(num)}
            >
                {text}
            </button>
        );

        return [button, reportSolved];
    }

    function createLink(num: number, text: string, id?: string): JSX.Element{
        if (id) {return <button id={id} onClick={() => changeCurrentPage(num)}>{text}</button>}
        return <button onClick={() => changeCurrentPage(num)}>{text}</button>
    }

    const [maxPage, setMaxPage] = useState<number>(() =>
        parseInt(localStorage.getItem("maxPage") ?? "0")
    );
    const [currentPage, setCurrentPage] = useState<number>(() =>
        parseInt(localStorage.getItem("currentPage") ?? "0")
    );
    return (
        <div className="App">
            {/* Navigation */}
                <div className="tab" id="nav-bar">
                    <nav>
                    {pageList.map((_, i) => (
                        maxPage >= i && (
                            <button
                                key={i}
                                className={`tablinks ${currentPage === i ? "active" : ""}`}
                                onClick={() => changeCurrentPage(i)}
                            >
                                {i}
                            </button>
                        )
                    ))}
                    </nav>
                </div>

            {/* Routes */}
            <div className="tabContentContainer">
            <Routes>
                <Route path="/" element={<Navigate to={`/page${currentPage}`} />} />
                {pageList.map((Page, i) => (
                    <Route
                        key={i}
                        path={`/page${i}`}
                        element={i <= maxPage ? <Page createLink={createLink} navigate={changeCurrentPage} useLockableLink={useLockableLink}/> : <Navigate to={`/page${maxPage}`} />}
                    />
                ))}
            </Routes>
            </div>
        </div>
    );
}