import {makeGrid, Grid, CellState} from "../../../../src/game/nonogram.ts";
import {VisualGrid} from "../../../../src/game/board.tsx";
import React, { useRef } from "react";
import domtoimage from "dom-to-image";
import {blankRow, leftRightMost} from "../../../../src/app/pages/util/page.tsx";

export default function ExportGrid() {
    // Simple Square
    const gridSimpleSquareExample1 = makeGrid(leftRightMost([4,3], 10))
    const gridSimpleSquareExample2 = makeGrid([[false],[false],[true],[true],[false],[false],[false],[true],[false],[false]])
    const gridSimpleSquareExample3 = blankRow([[4,3]], 10)

    const gridSimpleSquareQuiz1 = makeGrid(leftRightMost([3,4,5], 16))

    // Simple Space

    const gridSimpleSpaceExample1 = blankRow([[2,3]], 10)
    const gridSimpleSpaceExample2 = gridSimpleSpaceExample1.clone()
    const gridSimpleSpaceExample3 = gridSimpleSpaceExample1.clone()
    gridSimpleSpaceExample1.setStates([[CellState.Blank], [CellState.Blank], [CellState.Filled], [CellState.Blank], [CellState.Blank], [CellState.Blank], [CellState.Blank], [CellState.Filled], [CellState.Filled], [CellState.Blank]])
    gridSimpleSpaceExample2.setStates([[CellState.Blank], [CellState.Special], [CellState.Filled], [CellState.Special], [CellState.Blank], [CellState.Blank], [CellState.Special], [CellState.Filled], [CellState.Filled], [CellState.Special]])
    gridSimpleSpaceExample3.setStates([[CellState.Marked], [CellState.Blank], [CellState.Filled], [CellState.Blank], [CellState.Marked], [CellState.Marked], [CellState.Blank], [CellState.Filled], [CellState.Filled], [CellState.Blank]])

    const gridSimpleSpaceQuiz1 = blankRow([[1,4]], 10)
    gridSimpleSpaceQuiz1.setStates([[CellState.Blank], [CellState.Filled], [CellState.Blank], [CellState.Blank], [CellState.Blank], [CellState.Filled], [CellState.Filled], [CellState.Filled], [CellState.Blank], [CellState.Blank]])

    // Forcing

    //[CellState.Blank], [CellState.Blank], [CellState.Blank], [CellState.Blank], [CellState.Blank], [CellState.Blank], [CellState.Blank], [CellState.Blank], [CellState.Blank], [CellState.Blank]
    const gridForcingExample1 = blankRow([[2,3]], 10)
    const gridForcingExample2 = gridForcingExample1.clone()
    gridForcingExample1.setStates([[CellState.Blank], [CellState.Blank], [CellState.Blank], [CellState.Marked], [CellState.Blank], [CellState.Marked], [CellState.Blank], [CellState.Blank], [CellState.Blank], [CellState.Blank]])
    gridForcingExample2.setStates([[CellState.Blank], [CellState.Filled], [CellState.Blank], [CellState.Marked], [CellState.Marked], [CellState.Marked], [CellState.Blank], [CellState.Filled], [CellState.Filled], [CellState.Blank]])

    const gridForcingQuiz = blankRow([[1,2,2]], 10)
    gridForcingQuiz.setStates([[CellState.Blank], [CellState.Marked], [CellState.Blank], [CellState.Blank], [CellState.Blank], [CellState.Marked], [CellState.Blank], [CellState.Marked], [CellState.Blank], [CellState.Blank]])

    // Glue

    const gridGlueExample1 = blankRow([[6]], 10)
    const gridGlueExample2 = gridGlueExample1.clone()
    gridGlueExample1.setStates([[CellState.Blank], [CellState.Filled], [CellState.Blank], [CellState.Blank], [CellState.Blank], [CellState.Blank], [CellState.Blank], [CellState.Blank], [CellState.Blank], [CellState.Blank]])
    gridGlueExample2.setStates([[CellState.Blank], [CellState.Filled], [CellState.Filled], [CellState.Filled], [CellState.Filled], [CellState.Filled], [CellState.Blank], [CellState.Blank], [CellState.Blank], [CellState.Blank]])

    const gridGlueQuiz = blankRow([[2,4]], 10)
    gridGlueQuiz.setStates([[CellState.Blank], [CellState.Filled], [CellState.Blank], [CellState.Marked], [CellState.Blank], [CellState.Blank], [CellState.Blank], [CellState.Blank], [CellState.Filled], [CellState.Blank]])

    // Joining and splitting

    const gridJaSExample1 = blankRow([[2,2,3]], 10)
    const gridJaSExample2 = gridJaSExample1.clone()
    gridJaSExample1.setStates([[CellState.Blank], [CellState.Filled], [CellState.Blank], [CellState.Filled], [CellState.Blank], [CellState.Blank], [CellState.Filled], [CellState.Blank], [CellState.Filled], [CellState.Blank]])
    gridJaSExample2.setStates([[CellState.Filled], [CellState.Filled], [CellState.Marked], [CellState.Filled], [CellState.Filled], [CellState.Marked], [CellState.Filled], [CellState.Filled], [CellState.Filled], [CellState.Marked]])

    const gridJaSQuiz = blankRow([[4,3]], 10)
    gridJaSQuiz.setStates([[CellState.Blank], [CellState.Filled], [CellState.Filled], [CellState.Blank], [CellState.Filled], [CellState.Blank], [CellState.Filled], [CellState.Blank], [CellState.Filled], [CellState.Blank]])


    // Punctuating

    const gridPunctuatingExample1 = blankRow([[4,3]], 10)
    const gridPunctuatingExample2 = gridPunctuatingExample1.clone()
    gridPunctuatingExample1.setStates([[CellState.Blank], [CellState.Filled], [CellState.Filled], [CellState.Filled], [CellState.Filled], [CellState.Blank], [CellState.Blank], [CellState.Blank], [CellState.Blank], [CellState.Blank]])
    gridPunctuatingExample2.setStates([[CellState.Marked], [CellState.Filled], [CellState.Filled], [CellState.Filled], [CellState.Filled], [CellState.Marked], [CellState.Blank], [CellState.Blank], [CellState.Blank], [CellState.Blank]])

    const gridPunctuatingQuiz = blankRow([[1,3,2]], 10)
    gridPunctuatingQuiz.setStates([[CellState.Blank], [CellState.Blank], [CellState.Blank], [CellState.Filled], [CellState.Filled], [CellState.Filled], [CellState.Blank], [CellState.Blank], [CellState.Filled], [CellState.Blank]])

    const refs = useRef([]);

    const blocks = [
        {
            id: "SimpleSquareExample",
            content: (
                <>
                    <VisualGrid grid={gridSimpleSquareExample3} nonInteractive hideClueColumn />
                    <span className="arrow-symbol">&#8595;</span>
                    <br />
                    <VisualGrid grid={gridSimpleSquareExample1} nonInteractive hideClueColumn />
                    <br />
                    <span className="arrow-symbol">&#8595;</span>
                    <br />
                    <VisualGrid grid={gridSimpleSquareExample2} nonInteractive hideClueColumn />
                </>
            )
        },
        {
            id: "SimpleSquareQuiz",
            content: (
                <>
                    <VisualGrid grid={gridSimpleSquareQuiz1} nonInteractive hideClueColumn />
                    <br />
                    <span className="arrow-symbol">&#8595;</span>
                </>
            )
        },
        {
            id: "SimpleSpaceExample",
            content: (
                <>
                    <VisualGrid grid={gridSimpleSpaceExample1} nonInteractive hideClueColumn />
                    <br />
                    <span className="arrow-symbol">&#8595;</span>
                    <VisualGrid grid={gridSimpleSpaceExample2} nonInteractive hideClueColumn />
                    <br />
                    <span className="arrow-symbol">&#8595;</span>
                    <VisualGrid grid={gridSimpleSpaceExample3} nonInteractive hideClueColumn />
                </>
            )
        },
        {
            id: "SimpleSpaceQuiz",
            content: (
                <>
                    <VisualGrid grid={gridSimpleSpaceQuiz1} nonInteractive hideClueColumn />
                    <br />
                    <span className="arrow-symbol">&#8595;</span>
                </>
            )
        },
        {
            id: "ForcingExample",
            content: (
                <>
                    <VisualGrid grid={gridForcingExample1} nonInteractive hideClueColumn />
                    <br />
                    <span className="arrow-symbol">&#8595;</span>
                    <VisualGrid grid={gridForcingExample2} nonInteractive hideClueColumn />
                </>
            )
        },
        {
            id: "ForcingQuiz",
            content: (
                <>
                    <VisualGrid grid={gridForcingQuiz} nonInteractive hideClueColumn />
                    <br />
                    <span className="arrow-symbol">&#8595;</span>
                </>
            )
        },
        {
            id: "GlueExample",
            content: (
                <>
                    <VisualGrid grid={gridGlueExample1} nonInteractive hideClueColumn />
                    <br />
                    <span className="arrow-symbol">&#8595;</span>
                    <VisualGrid grid={gridGlueExample2} nonInteractive hideClueColumn />
                </>
            )
        },
        {
            id: "GlueQuiz",
            content: (
                <>
                    <VisualGrid grid={gridGlueQuiz} nonInteractive hideClueColumn />
                    <br />
                    <span className="arrow-symbol">&#8595;</span>
                </>
            )
        },
        {
            id: "JoiningAndSplittingExample",
            content: (
                <>
                    <VisualGrid grid={gridJaSExample1} nonInteractive hideClueColumn />
                    <br />
                    <span className="arrow-symbol">&#8595;</span>
                    <VisualGrid grid={gridJaSExample2} nonInteractive hideClueColumn />
                </>
            )
        },
        {
            id: "JoiningAndSplittingQuiz",
            content: (
                <>
                    <VisualGrid grid={gridJaSQuiz} nonInteractive hideClueColumn />
                    <br />
                    <span className="arrow-symbol">&#8595;</span>
                </>
            )
        },
        {
            id: "PunctuatingExample",
            content: (
                <>
                    <VisualGrid grid={gridPunctuatingExample1} nonInteractive hideClueColumn />
                    <br />
                    <span className="arrow-symbol">&#8595;</span>
                    <VisualGrid grid={gridPunctuatingExample2} nonInteractive hideClueColumn />
                </>
            )
        },
        {
            id: "PunctuatingQuiz",
            content: (
                <>
                    <VisualGrid grid={gridPunctuatingQuiz} nonInteractive hideClueColumn />
                    <br />
                    <span className="arrow-symbol">&#8595;</span>
                </>
            )
        },
    ];

    const handleExport = async () => {
        for (let i = 0; i < refs.current.length; i++) {
            const node = refs.current[i];
            if (!node) continue;

            const dataUrl = await domtoimage.toSvg(node);

            const link = document.createElement("a");
            const id = node.id || `grid-${i + 1}`;

            link.download = `${id}.svg`;
            link.href = dataUrl;
            link.click();

            await new Promise(res => setTimeout(res, 300));
        }
    };


    return (
        <>
            {blocks.map((block, i) => (
                <div>
                    <h2>{block.id}</h2>
                    <div
                        key={i}
                        id={block.id}
                        ref={(el) => (refs.current[i] = el)}
                        className="shrink-wrap-container"
                    >
                        {block.content}
                        <hr/>
                    </div>
                </div>
            ))}

            <button onClick={handleExport}>Export</button>
        </>
    );
}