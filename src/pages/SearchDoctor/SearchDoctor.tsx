import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchDoctor.css";
import { getDoctors, getClinics, getSpecialities } from "@/api/mockRepo";
import type { Clinic, Speciality, Doctor } from "@/types";

type Suggestion = {
    id: string;
    fullName: string;
    doctorSpeciality: string;
    durations: number[];
    clinicId: string;
    clinicName: string;
    clinicAddress: string;
    clinicTelephone: string;
    clinicSpecialities: string[];
};

type Result = Suggestion;

export default function SearchDoctor() {
    const navigate = useNavigate();

    // data
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [specialities, setSpecialities] = useState<Speciality[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [booting, setBooting] = useState(true);

    // ui state
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [open, setOpen] = useState(false);
    const [highlight, setHighlight] = useState<number>(-1);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<Result | null>(null);
    const [results, setResults] = useState<Result[]>([]);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const listRef = useRef<HTMLUListElement | null>(null);

    // load all data
    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const [c, s, d] = await Promise.all([
                    getClinics(),
                    getSpecialities(),
                    getDoctors(),
                ]);
                if (!alive) return;
                setClinics(c);
                setSpecialities(s);
                setDoctors(d);
            } catch {
                setError("Failed to load search data.");
            } finally {
                if (alive) setBooting(false);
            }
        })();
        return () => { alive = false; };
    }, []);

    // helpers
    const clinicById = useMemo(() => new Map(clinics.map(c => [c.id, c])), [clinics]);
    const specById   = useMemo(() => new Map(specialities.map(s => [s.id, s.name])), [specialities]);

    // build a rich index for suggestions/results
    const index: Suggestion[] = useMemo(() => {
        return doctors.map(d => {
            const c = clinicById.get(d.clinicId);
            const clinicName = c?.name ?? "—";
            const clinicAddress = (c as any)?.address ?? "—";
            const clinicTelephone = (c as any)?.telephone ?? "—";
            const clinicSpecIds: string[] = (c as any)?.specialityIds ?? [];
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

    // compute suggestions
    function computeSuggestions(term: string, limit = 8): Suggestion[] {
        const q = term.trim().toLowerCase();
        if (!q) return index.slice(0, 6);
        const starts = index.filter(s => s.fullName.toLowerCase().startsWith(q));
        const includes = index.filter(
            s =>
                !s.fullName.toLowerCase().startsWith(q) &&
                (s.fullName.toLowerCase().includes(q) ||
                    s.clinicName.toLowerCase().includes(q) ||
                    s.doctorSpeciality.toLowerCase().includes(q))
        );
        return [...starts, ...includes].slice(0, limit);
    }

    // events
    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
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
    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!open) setOpen(true);
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlight(h => Math.min((h < 0 ? -1 : h) + 1, suggestions.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlight(h => Math.max(h - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (highlight >= 0 && suggestions[highlight]) {
                handleSelect(suggestions[highlight]);
            } else if (suggestions[0]) {
                handleSelect(suggestions[0]);
            } else {
                handleSearch();
            }
        } else if (e.key === "Escape") {
            setOpen(false);
            setHighlight(-1);
        }
    }
    function handleSelect(s: Suggestion) {
        setSearchTerm(s.fullName);
        setOpen(false);
        setPreview(s);
        setResults([]);
    }

    // click outside to close
    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            const t = e.target as Node;
            if (inputRef.current?.contains(t)) return;
            if (listRef.current?.contains(t)) return;
            setOpen(false);
        }
        document.addEventListener("click", onDocClick);
        return () => document.removeEventListener("click", onDocClick);
    }, []);

    // manual search (kept)
    async function handleSearch() {
        setLoading(true);
        setError(null);
        setPreview(null);
        const q = searchTerm.trim().toLowerCase();
        await new Promise(r => setTimeout(r, 120));
        const matched = index.filter(
            s =>
                s.fullName.toLowerCase().includes(q) ||
                s.clinicName.toLowerCase().includes(q) ||
                s.doctorSpeciality.toLowerCase().includes(q)
        );
        if (!matched.length) setError("No matching doctors found.");
        setResults(matched);
        setLoading(false);
    }

    if (booting) {
        return (
            <div className="search-doctor-container">
                <div className="loader" />
            </div>
        );
    }

    return (
        <div className="search-doctor-container">
            <h2>🔍 Search Doctor</h2>

            <div className="flex searchbar-wrap">
                <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={onChange}
                    onFocus={onFocus}
                    onKeyDown={onKeyDown}
                    placeholder="Type a name, clinic or speciality..."
                    aria-autocomplete="list"
                    aria-expanded={open}
                    aria-controls="doctor-suggestions"
                />
                <button onClick={handleSearch} disabled={loading}>Search</button>

                {open && suggestions.length > 0 && (
                    <ul id="doctor-suggestions" className="autocomplete-list rich" role="listbox" ref={listRef}>
                        {suggestions.map((s, i) => (
                            <li
                                key={s.id}
                                role="option"
                                aria-selected={i === highlight}
                                className={`autocomplete-item rich ${i === highlight ? "is-active" : ""}`}
                                onMouseDown={(e) => { e.preventDefault(); handleSelect(s); }}
                                onMouseEnter={() => setHighlight(i)}
                            >
                                <div className="row1">
                                    <span className="name">{s.fullName}</span>
                                    <span className="pill">{s.doctorSpeciality}</span>
                                </div>
                                <div className="row2">
                                    <span className="clinic">🏥 {s.clinicName}</span>
                                    <span className="durations">⏱ {s.durations.join(" / ")} min</span>
                                </div>
                                <div className="row3">
                                    <span className="address">📍 {s.clinicAddress}</span>
                                    <span className="tel">📞 {s.clinicTelephone}</span>
                                </div>
                                {s.clinicSpecialities.length > 0 && (
                                    <div className="row4">
                                        <span className="label">Clinic specialities:</span>
                                        <span className="chips">
                      {s.clinicSpecialities.map((n, idx) => (
                          <em key={idx} className="chip">{n}</em>
                      ))}
                    </span>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Status */}
            <div className="status-space">
                {loading && <p>Searching…</p>}
                {!loading && error && <p className="text-red-500">{error}</p>}
            </div>

            {/* Preview card after click */}
            {preview && (
                <div className="preview-card" role="region" aria-live="polite">
                    <p><strong>👨‍⚕️ Name:</strong> {preview.fullName}</p>
                    <p><strong>🔬 Speciality:</strong> {preview.doctorSpeciality}</p>
                    <p><strong>⏱ Durations:</strong> {preview.durations.join(" / ")} min</p>
                    <p><strong>🏥 Clinic:</strong> {preview.clinicName}</p>
                    <p><strong>📍 Address:</strong> {preview.clinicAddress}</p>
                    <p><strong>📞 Telephone:</strong> <a href={`tel:${preview.clinicTelephone.replace(/\s+/g,"")}`}>{preview.clinicTelephone}</a></p>
                    {preview.clinicSpecialities.length > 0 && (
                        <p><strong>🏷 Clinic specialities:</strong> {preview.clinicSpecialities.join(", ")}</p>
                    )}
                    <button
                        className="book-btn"
                        onClick={() => navigate(`/book?doctor=${encodeURIComponent(preview.id)}`)}
                    >
                        👉 Click to book with this doctor
                    </button>
                </div>
            )}

            {/* Manual results (also rich) */}
            {results.length > 0 && (
                <ul className="results-grid">
                    {results.map(r => (
                        <li key={r.id} className="result-card" onClick={() => setPreview(r)}>
                            <div className="title-row">
                                <strong>{r.fullName}</strong>
                                <span className="pill">{r.doctorSpeciality}</span>
                            </div>
                            <div className="muted">🏥 {r.clinicName}</div>
                            <div className="muted">📍 {r.clinicAddress}</div>
                            <div className="muted">📞 {r.clinicTelephone}</div>
                            <div className="muted">⏱ {r.durations.join(" / ")} min</div>
                            {r.clinicSpecialities.length > 0 && (
                                <div className="chips-inline">
                                    {r.clinicSpecialities.map((n, i) => <span key={i} className="chip">{n}</span>)}
                                </div>
                            )}
                            <div className="hint">Click to preview & book</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
