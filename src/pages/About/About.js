import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import "./About.css";
export default function About() {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);
    if (loading)
        return _jsx("div", { className: "loader" });
    return (_jsx("div", { className: "about-page-wrapper", children: _jsxs("div", { className: "about-container", children: [_jsx("h1", { children: "About Dyreklinikk" }), _jsxs("p", { className: "intro", children: [_jsx("strong", { children: "Dyreklinikk" }), " is a modern veterinary appointment platform designed to make pet healthcare simple, fast, and reliable. We believe in bridging the gap between pet owners and veterinary professionals through seamless technology."] }), _jsxs("section", { className: "section", children: [_jsx("h2", { children: "\uD83C\uDFE5 Our Mission" }), _jsx("p", { children: "Our mission is to ensure every pet gets timely access to trusted veterinary care. Whether it\u2019s a routine checkup, vaccination, dental cleaning, or specialized treatment, Dyreklinikk makes it easy to book and manage appointments for your companions." })] }), _jsxs("section", { className: "section", children: [_jsx("h2", { children: "\uD83D\uDCA1 What We Offer" }), _jsxs("ul", { children: [_jsx("li", { children: "\uD83D\uDDD3\uFE0F Easy and intuitive booking for vet visits" }), _jsx("li", { children: "\uD83D\uDD0E Search for veterinarians by name, clinic, or specialty" }), _jsx("li", { children: "\uD83D\uDCC5 Personalized dashboard to manage your pets\u2019 appointments" }), _jsx("li", { children: "\uD83D\uDD10 Secure data with privacy-first best practices" })] })] }), _jsxs("section", { className: "section", children: [_jsx("h2", { children: "\uD83C\uDF10 Why Choose Us" }), _jsx("p", { children: "Dyreklinikk combines modern UX with a robust backend, delivering both reliability and ease of use for pet owners and clinics. Trusted by animal lovers, we\u2019re committed to improving pet healthcare\u2014one paw at a time. \uD83D\uDC3E" })] })] }) }));
}
