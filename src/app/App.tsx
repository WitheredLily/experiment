import React, {JSX, useState} from "react";
import {HashRouter, Link, Route, Routes, Navigate, useNavigate } from "react-router-dom";
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

    function createLockableLink(num: number, text: string, locked: boolean, id: string):[JSX.Element, {lock: boolean;}] {
            const lock = {
                lock: locked,
            };

            const pLock = new Proxy(lock, {
                set: (target, prop, value) => {
                    target[prop as keyof typeof target] = value;
                    let element = document.getElementById(id);
                    if (element) {
                        if (target.lock) {
                            element.setAttribute('disabled', '');
                        } else {
                            element.removeAttribute('disabled');
                        }
                    }
                    return true;
                },

            });

            return [<button id={id} disabled={locked} onClick={() => changeCurrentPage(num)}>{text}</button>, pLock]
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
        <div>
            {/* Navigation */}
            <nav>
                <div className="tab" id="nav-bar">
                    {pageArray.map((_, i) => (
                        <button
                            key={i}
                            className={`tablinks ${currentPage === i ? "active" : ""}`}
                            onClick={() => changeCurrentPage(i)}
                            hidden={maxPage < i}
                        >
                            {i}
                        </button>
                    ))}
                </div>
            </nav>

            {/* Routes */}
            <Routes>
                <Route path="/" element={<Navigate to={`/page${currentPage}`} />} />
                {pageArray.map((Page, i) => (
                    <Route
                        key={i}
                        path={`/page${i}`}
                        element={i <= maxPage ? <Page createLink={createLink} navigate={changeCurrentPage} createLockableLink={createLockableLink}/> : <Navigate to={`/page${maxPage}`} />}
                    />
                ))}
            </Routes>
        </div>
    );
}