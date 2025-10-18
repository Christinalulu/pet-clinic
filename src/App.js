import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home/Home";
import About from "@/pages/About/About";
import Contact from "@/pages/Contact/Contact";
import SearchDoctor from "@/pages/SearchDoctor/SearchDoctor";
import BookAppointment from "@/pages/BookAppointment/BookAppointment";
import Confirmation from "@/pages/Confirmation/Confirmation";
import Layout from "@/components/Layout";
export default function App() {
    return (_jsx(Router, { children: _jsx(Layout, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/home", replace: true }) }), _jsx(Route, { path: "/home", element: _jsx(Home, {}) }), _jsx(Route, { path: "/about", element: _jsx(About, {}) }), _jsx(Route, { path: "/contact", element: _jsx(Contact, {}) }), _jsx(Route, { path: "/search", element: _jsx(SearchDoctor, {}) }), _jsx(Route, { path: "/book", element: _jsx(BookAppointment, {}) }), _jsx(Route, { path: "/book/:id", element: _jsx(BookAppointment, {}) }), _jsx(Route, { path: "/confirmation", element: _jsx(Confirmation, {}) })] }) }) }));
}
