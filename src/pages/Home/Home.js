import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Home.css";
export default function Home() {
    const [isLoading, setloading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setloading(false), 300);
        return () => clearTimeout(timer);
    }, []);
    if (isLoading)
        return _jsx("div", { className: "loader" });
    return (_jsxs("div", { className: "home-content", children: [_jsx("h1", { children: "Welcome to Dyreklinikk" }), _jsx("p", { children: "Your trusted partner in pet care and veterinary appointments" }), _jsx(Link, { to: "/book", className: "cta-button", children: "Book Appointment" })] }));
}
