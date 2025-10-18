import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import "./Contact.css";
export default function Contact() {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const timeout = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timeout);
    }, []);
    if (isLoading)
        return _jsx("div", { className: "loader" });
    return (_jsx("div", { className: "contact-wrapper", children: _jsxs("div", { className: "contact-box", children: [_jsx("h2", { children: "Contact Us" }), _jsx("p", { className: "contact-info", children: "\uD83D\uDCCD 123 Main Street, Oslo" }), _jsx("p", { className: "contact-info", children: "\uD83D\uDCE7 Email: support@dyreklinikk.no" }), _jsx("p", { className: "contact-info", children: "\uD83D\uDCDE Phone: +47 123 456 78" })] }) }));
}
