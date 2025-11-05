import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { BrowserRouter, Link, Route, Routes, Navigate } from "react-router-dom";
import * as pages from "./pages";
export default function App() {
    var pageArray = Object.values(pages);
    function changeCurrentPage(num) {
        if (num > maxPage) {
            setMaxPage(num);
            localStorage.setItem("maxPage", num.toString());
        }
        setCurrentPage(num);
        localStorage.setItem("currentPage", num.toString());
    }
    function createLink(num, text) {
        return _jsx(Link, { to: "/page" + num, onClick: function () { return changeCurrentPage(num); }, children: text });
    }
    var _a = useState(function () { var _a; return parseInt((_a = localStorage.getItem("maxPage")) !== null && _a !== void 0 ? _a : "0"); }), maxPage = _a[0], setMaxPage = _a[1];
    var _b = useState(function () { var _a; return parseInt((_a = localStorage.getItem("currentPage")) !== null && _a !== void 0 ? _a : "0"); }), currentPage = _b[0], setCurrentPage = _b[1];
    return (_jsxs(BrowserRouter, { children: [_jsx("nav", { children: _jsx("div", { id: "nav-bar", children: pageArray.map(function (_, i) { return (_jsxs("span", { id: "nav".concat(i), hidden: maxPage < i, children: [i > 0 && " | ", _jsx(Link, { to: "/page".concat(i), onClick: function () { return changeCurrentPage(i); }, children: i })] }, i)); }) }) }), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/page".concat(currentPage) }) }), pageArray.map(function (Page, i) { return (_jsx(Route, { path: "/page".concat(i), element: i <= maxPage ? _jsx(Page, { createLink: createLink }) : _jsx(Navigate, { to: "/page".concat(maxPage) }) }, i)); })] })] }));
}
