import React, {JSX, useState} from "react";
import {HashRouter, Link, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import {pageLock} from "./pages/util/page";
import * as pages from "./pages";
import "./App-Login.css";
import {v4 as uuidv4} from "uuid";

export default function AppStudent() {

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
            <div className="title" >
                <h1>Welcome to Nonogram</h1>

            </div>
            <div className="login">
                <div className="login-form">
                    <p>Teacher Login</p>
                    <a href="http://localhost:3005/">
                        <button>Login</button>
                    </a>
                </div>
                <div className="login-form">
                    <p>Student Login</p>
                    <a href="http://localhost:3000/">
                        <button>Login</button>
                    </a>
                </div>
            </div>
        </div>
    );
}