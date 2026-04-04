import React from 'react';
import ReactDOM from 'react-dom/client';
import './index-student.css';
import AppStudent from './app/App-Student';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
//localStorage.setItem("maxPage", "0");
//localStorage.clear();
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <AppStudent />
        </BrowserRouter>
    </React.StrictMode>
);
reportWebVitals();
