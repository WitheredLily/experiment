import React, {JSX, useState} from "react";
import {HashRouter, Link, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import {pageLock} from "./pages/util/page";
import * as pages from "./pages";
import "./App-Student.css";
import {v4 as uuidv4} from "uuid";

export default function AppStudent() {
    const [rows, setRows] = useState<
        { id: string; name: string; startDate: string; finishDate: string | null }[]
    >([]);

    const addRow = () => {
        const newRow = {
            id: uuidv4(),
            name: `John ${rows.length + 1}`,
            startDate: new Date().toLocaleString(),
            finishDate: null
        };

        setRows([...rows, newRow]);
    };

    const finishRow = (id: string) => {
        setRows(rows.map(row =>
            row.id === id
                ? { ...row, finishDate: new Date().toLocaleString() }
                : row
        ));
    };

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
            <button onClick={addRow}>Create Person</button>
            <br></br>
            <table border={1}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Start Date</th>
                    <th>Finish Date</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {rows.map((row) => (
                    <tr key={row.id}>
                        <td>{row.id}</td>
                        <td>{row.name}</td>
                        <td>{row.startDate}</td>
                        <td>{row.finishDate ?? ""}</td>
                        <td>
                            {!row.finishDate && (
                                <button onClick={() => finishRow(row.id)}>
                                    Finish
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}