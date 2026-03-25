import React from 'react';
import ReactDOM from 'react-dom/client';
import './index-teacher.css';
import App from './app/App-Teacher';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, HashRouter} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
//localStorage.setItem("maxPage", "0");
//localStorage.clear();
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <p>Teacher</p>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
reportWebVitals();
