import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/BookAppointment/BookAppointment.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookAppointment.css";
import { getClinics, getDoctors, getSpecialities, createAppointment, } from "@/api/mockRepo";
export default function BookAppointment() {
    /* --------------------------- URL (preselect) --------------------------- */
    const { search } = useLocation();
    const urlDoctorId = new URLSearchParams(search).get("doctor") || "";
    const navigate = useNavigate();
    /* ------------------------------- State -------------------------------- */
    const [specialities, setSpecialities] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    // form
    const [owner, setOwner] = useState({
        firstName: "",
        lastName: "",
        email: "",
        telephone: "",
    });
    const [pet, setPet] = useState({
        name: "",
        species: "",
        breed: "",
        age: "",
        notes: "",
    });
    const [clinicId, setClinicId] = useState("");
    const [doctorId, setDoctorId] = useState("");
    const [duration, setDuration] = useState(15);
    const [startISO, setStartISO] = useState("");
    const [specialityId, setSpecialityId] = useState("");
    /* ---------------------- Card auto-fit (no inner scroll) ---------------------- */
    const cardRef = useRef(null);
    const [scale, setScale] = useState(1);
    function fitCardToViewport() {
        const el = cardRef.current;
        if (!el)
            return;
        const nav = document.querySelector(".navbar-overlay");
        const footer = document.querySelector(".footer");
        const navBottom = nav ? nav.getBoundingClientRect().bottom : 0;
        const footerHeight = footer ? footer.getBoundingClientRect().height : 0;
        const available = window.innerHeight - navBottom - footerHeight - 12 /*top*/ - 16 /*bottom*/;
        const prev = el.style.transform;
        el.style.transform = "none";
        const natural = el.scrollHeight;
        el.style.transform = prev;
        const needed = Math.min(1, Math.max(0.66, (available - 2) / natural));
        setScale(needed);
    }
    useEffect(() => {
        const onResize = () => fitCardToViewport();
        window.addEventListener("resize", onResize);
        requestAnimationFrame(fitCardToViewport);
        return () => window.removeEventListener("resize", onResize);
    }, []);
    /* --------------------------- Load + preselect --------------------------- */
    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const [sp, cl, allDocs] = await Promise.all([
                    getSpecialities(),
                    getClinics(),
                    getDoctors({}),
                ]);
                if (!alive)
                    return;
                setSpecialities(sp);
                setClinics(cl);
                if (urlDoctorId) {
                    const d = allDocs.find((x) => x.id === urlDoctorId);
                    if (d) {
                        setClinicId(d.clinicId);
                        setDoctorId(d.id);
                        setDuration(d.durations[0]);
                        const filtered = await getDoctors({ clinicId: d.clinicId });
                        setDoctors(filtered);
                    }
                    else {
                        setDoctors(allDocs);
                    }
                }
                else {
                    setDoctors(allDocs);
                    if (allDocs.length) {
                        setDoctorId(allDocs[0].id);
                        setDuration(allDocs[0].durations[0]);
                    }
                }
            }
            catch {
                setError("Could not load form data.");
            }
            finally {
                setLoading(false);
                requestAnimationFrame(fitCardToViewport);
            }
        })();
        return () => {
            alive = false;
        };
    }, [urlDoctorId]);
    /* ------------------------- Filter doctors on change ------------------------- */
    /* ------------------------- Filter doctors on change ------------------------- */
    useEffect(() => {
        let alive = true;
        (async () => {
            const list = await getDoctors({
                clinicId: clinicId || undefined,
                specialityId: specialityId || undefined,
            });
            if (!alive)
                return;
            setDoctors(list);
            // ✅ NEW: show the red error if there are no doctors
            if (list.length === 0) {
                setError("A doctor is not available for this speciality.");
            }
            else {
                setError(null);
            }
            if (list.length && !list.some((d) => d.id === doctorId)) {
                setDoctorId(list[0].id);
                setDuration(list[0].durations[0]);
            }
            requestAnimationFrame(fitCardToViewport);
        })();
        return () => {
            alive = false;
        };
        // doctorId intentionally excluded to avoid loops when we reset it
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clinicId, specialityId]);
    /* -------------------------------- Derived ------------------------------- */
    const durationsForSelected = useMemo(() => {
        const doc = doctors.find((d) => d.id === doctorId);
        return doc?.durations ?? [15, 30];
    }, [doctorId, doctors]);
    /* -------------------------------- Submit -------------------------------- */
    async function submit(e) {
        e.preventDefault();
        setError(null);
        if (!clinicId || !doctorId || !startISO) {
            setError("Please pick a clinic, doctor and date/time.");
            return;
        }
        try {
            const created = await createAppointment({
                clinicId,
                doctorId,
                startISO,
                duration,
                owner,
                pet,
            });
            const clinicName = clinics.find((c) => c.id === clinicId)?.name ?? "—";
            const d = doctors.find((x) => x.id === doctorId);
            const doctorName = d ? `${d.firstName} ${d.lastName}` : "—";
            const specialityName = (d && specialities.find((s) => s.id === d.specialityId)?.name) || "—";
            const when = new Date(startISO).toLocaleString();
            // Navigate to dedicated confirmation page with all details
            navigate("/confirmation", {
                state: {
                    id: created.id,
                    when,
                    duration,
                    clinicName,
                    doctorName,
                    specialityName,
                    owner,
                    pet,
                },
            });
        }
        catch {
            setError("Booking failed. Try again.");
        }
    }
    /* -------------------------------- Render -------------------------------- */
    if (loading) {
        return (_jsx("div", { className: "book-viewport", children: _jsx("div", { className: "loader" }) }));
    }
    return (_jsx("div", { className: "book-viewport", children: _jsxs("div", { ref: cardRef, className: "book-appointment-container", style: { transform: `scale(${scale})`, transformOrigin: "top center" }, children: [_jsx("h2", { children: "Book an Appointment for Your Pet" }), error && (_jsx("div", { className: "error-wrapper", children: _jsx("div", { className: "error-msg", children: error }) })), _jsxs("form", { onSubmit: submit, children: [_jsxs("fieldset", { className: "fieldset", children: [_jsx("legend", { children: "Owner Information" }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "First Name" }), _jsx("input", { value: owner.firstName, onChange: (e) => setOwner((o) => ({ ...o, firstName: e.target.value })) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Last Name" }), _jsx("input", { value: owner.lastName, onChange: (e) => setOwner((o) => ({ ...o, lastName: e.target.value })) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Email" }), _jsx("input", { type: "email", value: owner.email, onChange: (e) => setOwner((o) => ({ ...o, email: e.target.value })), required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Telephone" }), _jsx("input", { value: owner.telephone, onChange: (e) => setOwner((o) => ({ ...o, telephone: e.target.value })) })] })] }), _jsxs("fieldset", { className: "fieldset", children: [_jsx("legend", { children: "Pet Information" }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Pet Name" }), _jsx("input", { value: pet.name, onChange: (e) => setPet((p) => ({ ...p, name: e.target.value })) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Species" }), _jsx("input", { value: pet.species, onChange: (e) => setPet((p) => ({ ...p, species: e.target.value })) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Breed" }), _jsx("input", { value: pet.breed, onChange: (e) => setPet((p) => ({ ...p, breed: e.target.value })) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Age" }), _jsx("input", { type: "number", value: pet.age, onChange: (e) => setPet((p) => ({ ...p, age: e.target.value.replace(/\D/g, "") })), min: "0" })] }), _jsxs("div", { className: "form-group", style: { gridColumn: "span 2" }, children: [_jsx("label", { children: "Notes" }), _jsx("textarea", { value: pet.notes, onChange: (e) => setPet((p) => ({ ...p, notes: e.target.value })) })] })] }), _jsxs("fieldset", { className: "fieldset", children: [_jsx("legend", { children: "Appointment Details" }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Clinic" }), _jsxs("select", { value: clinicId, onChange: (e) => setClinicId(e.target.value), children: [_jsx("option", { value: "", children: "\u2014 Select Clinic \u2014" }), clinics.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id)))] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Speciality" }), _jsxs("select", { value: specialityId, onChange: (e) => setSpecialityId(e.target.value), children: [_jsx("option", { value: "", children: "\u2014 Any Speciality \u2014" }), specialities.map((s) => (_jsx("option", { value: s.id, children: s.name }, s.id)))] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Doctor" }), _jsxs("select", { value: doctorId, onChange: (e) => setDoctorId(e.target.value), children: [_jsx("option", { value: "", children: "\u2014 Select Doctor \u2014" }), doctors.map((d) => (_jsxs("option", { value: d.id, children: [d.firstName, " ", d.lastName] }, d.id)))] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Duration (minutes)" }), _jsx("select", { value: duration, onChange: (e) => setDuration(Number(e.target.value)), children: durationsForSelected.map((min) => (_jsx("option", { value: min, children: min }, min))) })] }), _jsxs("div", { className: "form-group", style: { gridColumn: "span 2" }, children: [_jsx("label", { children: "Date & Time" }), _jsx("input", { type: "datetime-local", value: startISO, onChange: (e) => setStartISO(e.target.value), className: "custom-datepicker" })] })] }), _jsx("button", { type: "submit", className: "submit-btn", children: "Book Appointment" })] })] }) }));
}
