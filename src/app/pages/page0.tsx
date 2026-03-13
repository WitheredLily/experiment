import {loadingGrid, PageProps, setData} from "./util/page";
import {ChoiceQuestion} from "./util/question";
import React, {useState} from "react";
import {Grid} from "../../game/nonogram";
import {BacktrackSolve} from "../../game/solvers/backtracking-solver";
import {VisualGrid} from "../../game/board";
import {constraintPropagationSolve} from "../../game/solvers/constraint-solver";
import {geneticSolve, geneticSolveSteps} from "../../game/solvers/genetic-solver";
import {number} from "zod";
import {v4 as uuidv4} from 'uuid';

export function Page0({ createLink }: PageProps) {
    const [grid1, setGrid1] = useState<Grid | null>(null);
    const [grid2, setGrid2] = useState<Grid | null>(null);
    const [grid3, setGrid3] = useState<Grid | null>(null);

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

    const cols1 = 8;
    const rows1 = 8;

    loadingGrid("gridA1", cols1, rows1, setGrid1, 0.5);
    loadingGrid("gridA2", cols1, rows1, setGrid2, 0.75);
    loadingGrid("gridA3", cols1, rows1, setGrid3, 0.75);

    if (!grid1 || !grid2 || !grid3) {
        return <div>Loading grid...</div>;
    }

    return (
        <div>
            <div className="tabContent-header">
                <h1>Hello</h1>
            </div>

            <div className="tabContent">
                <h1>Home Page</h1>

                <button onClick={addRow}>Create Person</button>

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

                <VisualGrid grid={grid1} nonInteractive={true}/>
                <p>Constraint</p>
                <VisualGrid grid={grid1} onGridChange={setGrid1} selfSolving={constraintPropagationSolve} />
                <p>Backtracking</p>
                <VisualGrid grid={grid2} onGridChange={setGrid2} selfSolving={BacktrackSolve} />
                <p>Genetic</p>
                <VisualGrid grid={grid3} onGridChange={setGrid3} selfSolving={geneticSolve} geneticGraphic={true} />
            </div>

            <nav className={"navButton"}>
                {createLink(1,"Start")}
            </nav>
        </div>
    );
}