import {makeGrid} from "../../../../src/game/nonogram.ts";
import {VisualGrid} from "../../../../src/game/board.tsx";
import React, { useRef } from "react";
import domtoimage from "dom-to-image";

//const path = "../src/app/images"

export default function ExportGrid() {
    const gridSimpleSquare1 = makeGrid([[true,false],[true,false],[true,true],[true,true],[false,true],[true,true],[true,false],[true,true],[false,true],[false,true]])
    const gridSimpleSquare2 = makeGrid([[false],[false],[true],[true],[false],[false],[false],[true],[false],[false]])
    console.log(gridSimpleSquare2)


    const divRef = useRef(null);

    const handleExport = () => {
        if (!divRef.current) return;

        domtoimage.toPng(divRef.current)
            .then((dataUrl) => {
                const link = document.createElement("a");
                link.download = "my-image-name.png";
                link.href = dataUrl;
                link.click();
            });
    };

    return (
        <div>
            <div ref={divRef} className="shrink-wrap-container">
                <VisualGrid grid={gridSimpleSquare1} nonInteractive={true} hideClueColumn={true} />
                <br />
                <span className="arrow-symbol">&#8595;</span>
                <br />
                <VisualGrid grid={gridSimpleSquare2} nonInteractive={true} hideClueColumn={true} />
            </div>
            <button onClick={handleExport}>Export</button>
        </div>
    )
}