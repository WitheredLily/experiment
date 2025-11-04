import React, {JSX, useState} from "react";
import {BrowserRouter, Link, Route, Routes, Navigate } from "react-router-dom";
import {ClickableGrid} from "../game/board";
import {Grid, loadGrid} from "../game/nonogram";

const cols = 2;
const rows = 2;

export default function App() {
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

    function Page0(){
        return <div>
            <h1>Home Page</h1>
            <nav>
                {createLink(1,"Forward")}
            </nav>
        </div>;
    }

    function Page1(){
        return <div>
            <h1>Page 1</h1>
            <nav>
                {createLink(2,"Forward")}
            </nav>
        </div>;
    }

    function Page2(){
        const [grid, setGrid] = useState((): Grid => {
            let gridId = "grid1";
            return loadGrid(gridId, cols, rows, 0.5);
        });
        return (
            <div style={{padding: "1rem"}}>
                <h1>Page 2</h1>
                <ClickableGrid grid={grid} onGridChange={setGrid}/>
                <nav>
                    {createLink(1,"Back")} |{" "}
                    {createLink(3,"Forward")}
                </nav>
            </div>
        );
    }

    function Page3() {
        return <div>
            <h1>Page 3</h1>
            <nav>
                {createLink(2,"Back")}
            </nav>
        </div>;
    }

    const pages = [Page0, Page1, Page2, Page3];

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
                    {Array.from({ length: pages.length + 1 }, (_, i) => (
                        <span key={i} id={`nav${i}`} hidden={maxPage < i}>
                            {i > 0 && " | "}
                            <Link to={`/page${i}`}>{i}</Link>
                        </span>
                    ))}
                </div>
            </nav>

            {/* Routes */}
            <Routes>
                <Route path="/" element={<Navigate to={`/page${currentPage}`} />} />
                {pages.map((Page, i) => (
                    <Route
                        key={i}
                        path={`/page${i}`}
                        element={i <= maxPage ? <Page /> : <Navigate to={`/page${maxPage}`} />}
                    />
                ))}
            </Routes>
        </BrowserRouter>
    );
}