import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import './Layout.css';
export default function Layout({ children }) {
    return (_jsxs("div", { className: "layout-container", children: [_jsxs("video", { autoPlay: true, muted: true, loop: true, playsInline: true, className: "background-video", children: [_jsx("source", { src: "/clinic-bg.mp4", type: "video/mp4" }), "Your browser doesn\u2019t support the video tag."] }), _jsx(Link, { to: "/home", children: _jsx("img", { src: "/logo.png", alt: "Dyreklinikk Logo", className: "logo" }) }), _jsx(NavBar, {}), _jsx("div", { className: "overlay", children: children }), _jsxs("footer", { className: "footer", children: ["\u00A9 ", new Date().getFullYear(), " Dyreklinikk. All rights reserved."] })] }));
}
