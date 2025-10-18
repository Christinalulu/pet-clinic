/* ---------------------- Domain data (two clinics) ---------------------- */
const specialities = [
    { id: "sp1", name: "General Practice" },
    { id: "sp2", name: "Dentistry" },
    { id: "sp3", name: "Surgery" },
    { id: "sp4", name: "Dermatology" },
    { id: "sp5", name: "Radiology" },
];
const clinics = [
    {
        id: "c1",
        name: "Central Vet Center",
        address: "123 Main Street, Oslo",
        telephone: "+47 22 00 11 10",
        specialityIds: ["sp1", "sp2", "sp3"], // GP, Dentistry, Surgery
    },
    {
        id: "c2",
        name: "North Paw Center",
        address: "12 North Cape Road, Tromsø",
        telephone: "+47 77 00 55 50",
        specialityIds: ["sp1", "sp4", "sp5"], // GP, Derm, Radiology
    },
];
// One doctor for each speciality (5 total) — spread across the two clinics
const doctors = [
    {
        id: "d1",
        clinicId: "c1",
        specialityId: "sp1",
        firstName: "Alice",
        lastName: "Nguyen",
        telephone: "+47 22 10 11 11",
        durations: [15, 30]
    },
    {
        id: "d2",
        clinicId: "c1",
        specialityId: "sp2",
        firstName: "Michael",
        lastName: "Carter",
        telephone: "+47 22 10 22 22",
        durations: [20, 30, 45]
    },
    {
        id: "d3",
        clinicId: "c1",
        specialityId: "sp3",
        firstName: "Sophia",
        lastName: "Chen",
        telephone: "+47 22 10 33 33",
        durations: [30, 45]
    },
    {
        id: "d4",
        clinicId: "c2",
        specialityId: "sp4",
        firstName: "Daniel",
        lastName: "Wright",
        telephone: "+47 77 10 44 44",
        durations: [20, 40, 60]
    },
    {
        id: "d5",
        clinicId: "c2",
        specialityId: "sp5",
        firstName: "Priya",
        lastName: "Kapoor",
        telephone: "+47 77 10 55 55",
        durations: [30, 45, 60]
    },
];
/* ---------------------- Promise-based “API” ---------------------- */
const lag = (ms = 220) => new Promise((res) => setTimeout(res, ms));
const LS_KEY = "petclinic.appointments";
function readAppointments() {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
}
function writeAppointments(list) {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
}
export async function getSpecialities() {
    await lag();
    return specialities;
}
export async function getClinics() {
    await lag();
    return clinics;
}
export async function getDoctors(opts) {
    await lag();
    let res = doctors.slice();
    if (opts?.clinicId)
        res = res.filter((d) => d.clinicId === opts.clinicId);
    if (opts?.specialityId)
        res = res.filter((d) => d.specialityId === opts.specialityId);
    return res;
}
export async function createAppointment(appt) {
    await lag();
    const list = readAppointments();
    const created = { ...appt, id: crypto.randomUUID() };
    list.push(created);
    writeAppointments(list);
    return created;
}
export async function getAppointments() {
    await lag();
    return readAppointments();
}
