import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from 'react-router-dom';
export default function NavBar() {
    const location = useLocation();
    return (_jsxs("nav", { className: "navbar-overlay", children: [_jsx(Link, { to: "/home", className: location.pathname === '/home' ? 'active' : '', children: "Home" }), _jsx(Link, { to: "/book", className: location.pathname.startsWith('/book') ? 'active' : '', children: "Book" }), _jsx(Link, { to: "/search", className: location.pathname === '/search' ? 'active' : '', children: "Search" }), _jsx(Link, { to: "/about", className: location.pathname === '/about' ? 'active' : '', children: "About" }), _jsx(Link, { to: "/contact", className: location.pathname === '/contact' ? 'active' : '', children: "Contact Us" })] }));
}
