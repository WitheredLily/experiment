import React, {JSX, useState} from "react";
import {BrowserRouter, Link, Route, Routes, Navigate } from "react-router-dom";
import * as pages from "./pages";

export default function App() {
    const pageArray = Object.values(pages);
    function changeCurrentPage(num: number){
        if (num > maxPage) {
            setMaxPage(num);
            localStorage.setItem("maxPage", num.toString());
        }
        setCurrentPage(num);
        localStorage.setItem("currentPage", num.toString());
    }

    function createLink(num: number, text: string): JSX.Element{
        return <Link to={"/page" + num} onClick={() => changeCurrentPage(num)}>{text}</Link>
    }
    const [maxPage, setMaxPage] = useState<number>(() =>
        parseInt(localStorage.getItem("maxPage") ?? "0")
    );
    const [currentPage, setCurrentPage] = useState<number>(() =>
        parseInt(localStorage.getItem("currentPage") ?? "0")
    );
    return (
        <BrowserRouter>
            {/* Navigation */}
            <nav>
                <div id={"nav-bar"}>
                    {pageArray.map((_, i) => (
                        <span key={i} id={`nav${i}`} hidden={maxPage < i}>
    {i > 0 && " | "}
                            <Link to={`/page${i}`} onClick={() => changeCurrentPage(i)}>
      {i}
    </Link>
  </span>
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
                        element={i <= maxPage ? <Page createLink={createLink} /> : <Navigate to={`/page${maxPage}`} />}
                    />
                ))}
            </Routes>
        </BrowserRouter>
    );
}