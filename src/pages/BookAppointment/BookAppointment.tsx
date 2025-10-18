// src/pages/BookAppointment/BookAppointment.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookAppointment.css";
import {
    getClinics,
    getDoctors,
    getSpecialities,
    createAppointment,
} from "@/api/mockRepo";
import type {
    Clinic,
    Doctor,
    Speciality,
    Appointment,
    OwnerInfo,
    PetInfo,
} from "@/types";

export default function BookAppointment() {
    /* --------------------------- URL (preselect) --------------------------- */
    const { search } = useLocation();
    const urlDoctorId = new URLSearchParams(search).get("doctor") || "";
    const navigate = useNavigate();

    /* ------------------------------- State -------------------------------- */
    const [specialities, setSpecialities] = useState<Speciality[]>([]);
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // form
    const [owner, setOwner] = useState<OwnerInfo>({
        firstName: "",
        lastName: "",
        email: "",
        telephone: "",
    });
    const [pet, setPet] = useState<PetInfo>({
        name: "",
        species: "",
        breed: "",
        age: "",
        notes: "",
    });
    const [clinicId, setClinicId] = useState("");
    const [doctorId, setDoctorId] = useState("");
    const [duration, setDuration] = useState<number>(15);
    const [startISO, setStartISO] = useState("");
    const [specialityId, setSpecialityId] = useState("");

    /* ---------------------- Card auto-fit (no inner scroll) ---------------------- */
    const cardRef = useRef<HTMLDivElement | null>(null);
    const [scale, setScale] = useState(1);

    function fitCardToViewport() {
        const el = cardRef.current;
        if (!el) return;

        const nav = document.querySelector<HTMLElement>(".navbar-overlay");
        const footer = document.querySelector<HTMLElement>(".footer");
        const navBottom = nav ? nav.getBoundingClientRect().bottom : 0;
        const footerHeight = footer ? footer.getBoundingClientRect().height : 0;

        const available =
            window.innerHeight - navBottom - footerHeight - 12 /*top*/ - 16 /*bottom*/;

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
                if (!alive) return;

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
                    } else {
                        setDoctors(allDocs);
                    }
                } else {
                    setDoctors(allDocs);
                    if (allDocs.length) {
                        setDoctorId(allDocs[0].id);
                        setDuration(allDocs[0].durations[0]);
                    }
                }
            } catch {
                setError("Could not load form data.");
            } finally {
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
            if (!alive) return;

            setDoctors(list);

            // ✅ NEW: show the red error if there are no doctors
            if (list.length === 0) {
                setError("A doctor is not available for this speciality.");
            } else {
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
    async function submit(e: React.FormEvent) {
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
            } as Omit<Appointment, "id">);

            const clinicName = clinics.find((c) => c.id === clinicId)?.name ?? "—";
            const d = doctors.find((x) => x.id === doctorId);
            const doctorName = d ? `${d.firstName} ${d.lastName}` : "—";
            const specialityName =
                (d && specialities.find((s) => s.id === d.specialityId)?.name) || "—";
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
        } catch {
            setError("Booking failed. Try again.");
        }
    }

    /* -------------------------------- Render -------------------------------- */
    if (loading) {
        return (
            <div className="book-viewport">
                <div className="loader" />
            </div>
        );
    }

    return (
        <div className="book-viewport">
            <div
                ref={cardRef}
                className="book-appointment-container"
                style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}
            >
                <h2>Book an Appointment for Your Pet</h2>

                {error && (
                    <div className="error-wrapper">
                        <div className="error-msg">{error}</div>
                    </div>
                )}

                <form onSubmit={submit}>
                    {/* Owner */}
                    <fieldset className="fieldset">
                        <legend>Owner Information</legend>
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                value={owner.firstName}
                                onChange={(e) =>
                                    setOwner((o) => ({ ...o, firstName: e.target.value }))
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                value={owner.lastName}
                                onChange={(e) =>
                                    setOwner((o) => ({ ...o, lastName: e.target.value }))
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={owner.email}
                                onChange={(e) =>
                                    setOwner((o) => ({ ...o, email: e.target.value }))
                                }
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Telephone</label>
                            <input
                                value={owner.telephone}
                                onChange={(e) =>
                                    setOwner((o) => ({ ...o, telephone: e.target.value }))
                                }
                            />
                        </div>
                    </fieldset>

                    {/* Pet */}
                    <fieldset className="fieldset">
                        <legend>Pet Information</legend>
                        <div className="form-group">
                            <label>Pet Name</label>
                            <input
                                value={pet.name}
                                onChange={(e) => setPet((p) => ({ ...p, name: e.target.value }))}
                            />
                        </div>
                        <div className="form-group">
                            <label>Species</label>
                            <input
                                value={pet.species}
                                onChange={(e) =>
                                    setPet((p) => ({ ...p, species: e.target.value }))
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>Breed</label>
                            <input
                                value={pet.breed}
                                onChange={(e) =>
                                    setPet((p) => ({ ...p, breed: e.target.value }))
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>Age</label>
                            <input
                                type="number"
                                value={pet.age}
                                onChange={(e) =>
                                    setPet((p) => ({ ...p, age: e.target.value.replace(/\D/g, "") }))
                                }
                                min="0"
                            />
                        </div>
                        <div className="form-group" style={{ gridColumn: "span 2" }}>
                            <label>Notes</label>
                            <textarea
                                value={pet.notes}
                                onChange={(e) => setPet((p) => ({ ...p, notes: e.target.value }))}
                            />
                        </div>
                    </fieldset>

                    {/* Appointment */}
                    <fieldset className="fieldset">
                        <legend>Appointment Details</legend>
                        <div className="form-group">
                            <label>Clinic</label>
                            <select
                                value={clinicId}
                                onChange={(e) => setClinicId(e.target.value)}
                            >
                                <option value="">— Select Clinic —</option>
                                {clinics.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Speciality</label>
                            <select
                                value={specialityId}
                                onChange={(e) => setSpecialityId(e.target.value)}
                            >
                                <option value="">— Any Speciality —</option>
                                {specialities.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Doctor</label>
                            <select
                                value={doctorId}
                                onChange={(e) => setDoctorId(e.target.value)}
                            >
                                <option value="">— Select Doctor —</option>
                                {doctors.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.firstName} {d.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Duration (minutes)</label>
                            <select
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                            >
                                {durationsForSelected.map((min) => (
                                    <option key={min} value={min}>
                                        {min}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group" style={{ gridColumn: "span 2" }}>
                            <label>Date &amp; Time</label>
                            <input
                                type="datetime-local"
                                value={startISO}
                                onChange={(e) => setStartISO(e.target.value)}
                                className="custom-datepicker"
                            />
                        </div>
                    </fieldset>

                    <button type="submit" className="submit-btn">
                        Book Appointment
                    </button>
                </form>
            </div>
        </div>
    );
}
