import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../../../src/app/App-Student.css'
import ExportGrid from "./generate-images.jsx";

createRoot(document.getElementById('root')).render(
    <div style={{ backgroundColor: "white" }}>
        <ExportGrid>Hello</ExportGrid>
    </div>
)