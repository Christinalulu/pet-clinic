import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchDoctor.css";
import { getDoctors, getClinics, getSpecialities } from "@/api/mockRepo";
export default function SearchDoctor() {
    const navigate = useNavigate();
    const [clinics, setClinics] = useState([]);
    const [specialities, setSpecialities] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [booting, setBooting] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [open, setOpen] = useState(false);
    const [highlight, setHighlight] = useState(-1);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [results, setResults] = useState([]);
    const inputRef = useRef(null);
    const listRef = useRef(null);
    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const [c, s, d] = await Promise.all([
                    getClinics(),
                    getSpecialities(),
                    getDoctors(),
                ]);
                if (!alive)
                    return;
                setClinics(c);
                setSpecialities(s);
                setDoctors(d);
            }
            catch {
                setError("Failed to load search data.");
            }
            finally {
                if (alive)
                    setBooting(false);
            }
        })();
        return () => { alive = false; };
    }, []);
    const clinicById = useMemo(() => new Map(clinics.map(c => [c.id, c])), [clinics]);
    const specById = useMemo(() => new Map(specialities.map(s => [s.id, s.name])), [specialities]);
    const index = useMemo(() => {
        return doctors.map(d => {
            const c = clinicById.get(d.clinicId);
            const clinicName = c?.name ?? "—";
            const clinicAddress = c?.address ?? "—";
            const clinicTelephone = c?.telephone ?? "—";
            const clinicSpecIds = c?.specialityIds ?? [];
            const clinicSpecialities = clinicSpecIds.map(id => specById.get(id) ?? id);
            return {
                id: d.id,
                fullName: `${d.firstName} ${d.lastName}`,
                doctorSpeciality: specById.get(d.specialityId) ?? "—",
                durations: d.durations ?? [],
                clinicId: d.clinicId,
                clinicName,
                clinicAddress,
                clinicTelephone,
                clinicSpecialities,
            };
        });
    }, [doctors, clinicById, specById]);
    function computeSuggestions(term, limit = 8) {
        const q = term.trim().toLowerCase();
        if (!q)
            return index.slice(0, 6);
        const starts = index.filter(s => s.fullName.toLowerCase().startsWith(q));
        const includes = index.filter(s => !s.fullName.toLowerCase().startsWith(q) &&
            (s.fullName.toLowerCase().includes(q) ||
                s.clinicName.toLowerCase().includes(q) ||
                s.doctorSpeciality.toLowerCase().includes(q)));
        return [...starts, ...includes].slice(0, limit);
    }
    function onChange(e) {
        const val = e.target.value;
        setSearchTerm(val);
        setError(null);
        setPreview(null);
        const sugs = computeSuggestions(val);
        setSuggestions(sugs);
        setOpen(true);
        setHighlight(sugs.length ? 0 : -1);
    }
    function onFocus() {
        setSuggestions(computeSuggestions(searchTerm));
        setOpen(true);
    }
    function onKeyDown(e) {
        if (!open)
            setOpen(true);
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlight(h => Math.min((h < 0 ? -1 : h) + 1, suggestions.length - 1));
        }
        else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlight(h => Math.max(h - 1, 0));
        }
        else if (e.key === "Enter") {
            e.preventDefault();
            if (highlight >= 0 && suggestions[highlight]) {
                handleSelect(suggestions[highlight]);
            }
            else if (suggestions[0]) {
                handleSelect(suggestions[0]);
            }
            else {
                handleSearch();
            }
        }
        else if (e.key === "Escape") {
            setOpen(false);
            setHighlight(-1);
        }
    }
    function handleSelect(s) {
        setSearchTerm(s.fullName);
        setOpen(false);
        setPreview(s);
        setResults([]);
    }
    useEffect(() => {
        function onDocClick(e) {
            const t = e.target;
            if (inputRef.current?.contains(t))
                return;
            if (listRef.current?.contains(t))
                return;
            setOpen(false);
        }
        document.addEventListener("click", onDocClick);
        return () => document.removeEventListener("click", onDocClick);
    }, []);
    async function handleSearch() {
        setLoading(true);
        setError(null);
        setPreview(null);
        const q = searchTerm.trim().toLowerCase();
        await new Promise(r => setTimeout(r, 120));
        const matched = index.filter(s => s.fullName.toLowerCase().includes(q) ||
            s.clinicName.toLowerCase().includes(q) ||
            s.doctorSpeciality.toLowerCase().includes(q));
        if (!matched.length)
            setError("No matching doctors found.");
        setResults(matched);
        setLoading(false);
    }
    if (booting) {
        return (_jsx("div", { className: "search-doctor-container", children: _jsx("div", { className: "loader" }) }));
    }
    return (_jsxs("div", { className: "search-doctor-container", children: [_jsx("h2", { children: "\uD83D\uDD0D Search Doctor" }), _jsxs("div", { className: "flex searchbar-wrap", children: [_jsx("input", { ref: inputRef, type: "text", value: searchTerm, onChange: onChange, onFocus: onFocus, onKeyDown: onKeyDown, placeholder: "Type a name, clinic or speciality...", "aria-autocomplete": "list", "aria-expanded": open, "aria-controls": "doctor-suggestions" }), _jsx("button", { onClick: handleSearch, disabled: loading, children: "Search" }), open && suggestions.length > 0 && (_jsx("ul", { id: "doctor-suggestions", className: "autocomplete-list rich", role: "listbox", ref: listRef, children: suggestions.map((s, i) => (_jsxs("li", { role: "option", "aria-selected": i === highlight, className: `autocomplete-item rich ${i === highlight ? "is-active" : ""}`, onMouseDown: (e) => { e.preventDefault(); handleSelect(s); }, onMouseEnter: () => setHighlight(i), children: [_jsxs("div", { className: "row1", children: [_jsx("span", { className: "name", children: s.fullName }), _jsx("span", { className: "pill", children: s.doctorSpeciality })] }), _jsxs("div", { className: "row2", children: [_jsxs("span", { className: "clinic", children: ["\uD83C\uDFE5 ", s.clinicName] }), _jsxs("span", { className: "durations", children: ["\u23F1 ", s.durations.join(" / "), " min"] })] }), _jsxs("div", { className: "row3", children: [_jsxs("span", { className: "address", children: ["\uD83D\uDCCD ", s.clinicAddress] }), _jsxs("span", { className: "tel", children: ["\uD83D\uDCDE ", s.clinicTelephone] })] }), s.clinicSpecialities.length > 0 && (_jsxs("div", { className: "row4", children: [_jsx("span", { className: "label", children: "Clinic specialities:" }), _jsx("span", { className: "chips", children: s.clinicSpecialities.map((n, idx) => (_jsx("em", { className: "chip", children: n }, idx))) })] }))] }, s.id))) }))] }), _jsxs("div", { className: "status-space", children: [loading && _jsx("p", { children: "Searching\u2026" }), !loading && error && _jsx("p", { className: "text-red-500", children: error })] }), preview && (_jsxs("div", { className: "preview-card", role: "region", "aria-live": "polite", children: [_jsxs("p", { children: [_jsx("strong", { children: "\uD83D\uDC68\u200D\u2695\uFE0F Name:" }), " ", preview.fullName] }), _jsxs("p", { children: [_jsx("strong", { children: "\uD83D\uDD2C Speciality:" }), " ", preview.doctorSpeciality] }), _jsxs("p", { children: [_jsx("strong", { children: "\u23F1 Durations:" }), " ", preview.durations.join(" / "), " min"] }), _jsxs("p", { children: [_jsx("strong", { children: "\uD83C\uDFE5 Clinic:" }), " ", preview.clinicName] }), _jsxs("p", { children: [_jsx("strong", { children: "\uD83D\uDCCD Address:" }), " ", preview.clinicAddress] }), _jsxs("p", { children: [_jsx("strong", { children: "\uD83D\uDCDE Telephone:" }), " ", _jsx("a", { href: `tel:${preview.clinicTelephone.replace(/\s+/g, "")}`, children: preview.clinicTelephone })] }), preview.clinicSpecialities.length > 0 && (_jsxs("p", { children: [_jsx("strong", { children: "\uD83C\uDFF7 Clinic specialities:" }), " ", preview.clinicSpecialities.join(", ")] })), _jsx("button", { className: "book-btn", onClick: () => navigate(`/book?doctor=${encodeURIComponent(preview.id)}`), children: "\uD83D\uDC49 Click to book with this doctor" })] })), results.length > 0 && (_jsx("ul", { className: "results-grid", children: results.map(r => (_jsxs("li", { className: "result-card", onClick: () => setPreview(r), children: [_jsxs("div", { className: "title-row", children: [_jsx("strong", { children: r.fullName }), _jsx("span", { className: "pill", children: r.doctorSpeciality })] }), _jsxs("div", { className: "muted", children: ["\uD83C\uDFE5 ", r.clinicName] }), _jsxs("div", { className: "muted", children: ["\uD83D\uDCCD ", r.clinicAddress] }), _jsxs("div", { className: "muted", children: ["\uD83D\uDCDE ", r.clinicTelephone] }), _jsxs("div", { className: "muted", children: ["\u23F1 ", r.durations.join(" / "), " min"] }), r.clinicSpecialities.length > 0 && (_jsx("div", { className: "chips-inline", children: r.clinicSpecialities.map((n, i) => _jsx("span", { className: "chip", children: n }, i)) })), _jsx("div", { className: "hint", children: "Click to preview & book" })] }, r.id))) }))] }));
}
