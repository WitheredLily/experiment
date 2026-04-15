import React, {JSX, useState} from "react";
import {Route, Routes, Navigate, useNavigate, useLocation} from "react-router-dom";
import {pageList} from "./index"
import "./student.css";

export default function Student() {
    //localStorage.clear();
    const navigate = useNavigate();
    function changeCurrentPage(num: number) {
        if (num > maxPage) {
            setMaxPage(num);
            localStorage.setItem("maxPage", num.toString());
            window.scrollTo(0, 0);
        }
        setCurrentPage(num);
        localStorage.setItem("currentPage", num.toString());
        navigate(`/student/page${num}`);
    }

    function useLockableLink(
        num: number,
        text: string,
        puzzleKeys: string[],
    ): [JSX.Element, (key: string, solved: boolean) => void] {

        const storageKey = `page-${num}-solved`;

        const [solvedStates, setSolvedStates] = React.useState<Record<string, boolean>>(() => {
            const saved = localStorage.getItem(storageKey);
            if (saved) return JSON.parse(saved);

            return Object.fromEntries(puzzleKeys.map(k => [k, false]));
        });

        const [locked, setLocked] = React.useState<boolean>(() => {
            return !Object.values(solvedStates).every(Boolean);
        });

        React.useEffect(() => {
            localStorage.setItem(storageKey, JSON.stringify(solvedStates));
            const allSolved = Object.values(solvedStates).every(Boolean);
            setLocked(!allSolved);
        }, [solvedStates]);

        const reportSolved = (key: string, solved: boolean) => {
            setSolvedStates(prev => ({
                ...prev,
                [key]: solved,
            }));
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

    const [maxPage, setMaxPage] = useState<number>(() => {
        const stored = parseInt(localStorage.getItem("maxPage") ?? "0");
        return isNaN(stored) ? 0 : stored;
    });

    const [currentPage, setCurrentPage] = useState<number>(() => {
        const stored = parseInt(localStorage.getItem("currentPage") ?? "0");
        return isNaN(stored) ? 0 : stored;
    });

    const location = useLocation();

    React.useEffect(() => {
        const match = location.pathname.match(/page(\d+)$/);
        if (match) {
            const pageNum = parseInt(match[1]);
            if (!isNaN(pageNum)) {
                setCurrentPage(pageNum);
                localStorage.setItem("currentPage", pageNum.toString());
            }
        }
    }, [location.pathname]);

    return (
        <div className="App">
            {/* Navigation */}
            <div className="tab" id="nav-bar">
                <nav>
                    {pageList.map(([, title], i) => (
                        maxPage >= i && (
                            <button
                                key={i}
                                className={`tablinks ${currentPage === i ? "active" : ""}`}
                                onClick={() => changeCurrentPage(i)}
                            >
                                {title}
                            </button>
                        )
                    ))}
                </nav>
            </div>

            {/* Routes */}
            <div className="tabContentContainer">
                <Routes>
                    <Route path="" element={<Navigate to="page0" replace />} />
                    {pageList.map(([PageComponent], i) => (
                        <Route
                            key={i}
                            path={`page${i}`}
                            element={
                                i <= maxPage
                                    ? <PageComponent createLink={createLink} navigate={changeCurrentPage} useLockableLink={useLockableLink} />
                                    : <Navigate to={`page${maxPage}`} />
                            }
                        />
                    ))}
                </Routes>
            </div>
        </div>
    );
}