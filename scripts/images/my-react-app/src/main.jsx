import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../../../src/app/App.css'
import ExportGrid from "./generate-grid.jsx";

createRoot(document.getElementById('root')).render(
    <div style={{ backgroundColor: "white" }}>
        <ExportGrid>Hello</ExportGrid>
    </div>
)