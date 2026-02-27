import React, {JSX, useState} from "react";
import {HashRouter, Link, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import {pageLock} from "./pages/util/page";
import * as pages from "./pages";
import "./App.css";

export default function App() {
    localStorage.clear();
    let navigate = useNavigate();
    const pageArray = Object.values(pages);
    function changeCurrentPage(num: number){
        if (num > maxPage) {
            setMaxPage(num);
            localStorage.setItem("maxPage", num.toString());
        }
        setCurrentPage(num);
        localStorage.setItem("currentPage", num.toString());
        navigate(`/page${num}`);
    }

    function useLockableLink(
        num: number,
        text: string,
        initialLocked: boolean,
    ): [JSX.Element, (locked: boolean) => void] {

        const [locked, setLocked] = useState(initialLocked);
        const button = (
            <button
                disabled={locked}
                onClick={() => changeCurrentPage(num)}
            >
                {text}
            </button>
        );

        return [button, setLocked];
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
                    {pageArray.map((_, i) => (
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
                {pageArray.map((Page, i) => (
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