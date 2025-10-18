
import { useLocation, useNavigate } from "react-router-dom";
import "./Confirmation.css";

type OwnerInfo = { firstName: string; lastName: string; email: string; telephone: string };
type PetInfo   = { name: string; species: string; breed: string; age: string; notes: string };
type ConfirmInfo = {
    id: string;
    when: string;
    duration: number;
    clinicName: string;
    doctorName: string;
    specialityName: string;
    owner: OwnerInfo;
    pet: PetInfo;
};

export default function Confirmation() {
    const nav = useNavigate();
    const { state } = useLocation() as { state?: ConfirmInfo };
    const data = state;

    if (!data) {
        return (
            <div className="confirm-page">
                <div className="confirm-card">
                    <div className="confirm-title">No confirmation data</div>
                    <p>Go back and book an appointment first.</p>
                    <div className="confirm-actions">
                        <button className="btn-primary" onClick={() => nav("/book")}>Back to Booking</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="confirm-page">
            <div className="confirm-card">
                <div className="confirm-title"> Appointment Confirmed ✅</div>

                <div className="confirm-grid">
                    <div><div className="k">Doctor</div><div className="v">{data.doctorName}</div></div>
                    <div><div className="k">Clinic</div><div className="v">{data.clinicName}</div></div>
                    <div><div className="k">Speciality</div><div className="v">{data.specialityName}</div></div>
                    <div><div className="k">Date & Time</div><div className="v">{data.when}</div></div>
                    <div><div className="k">Duration</div><div className="v">{data.duration} min</div></div>
                    <div><div className="k">Owner</div><div className="v">{data.owner.firstName} {data.owner.lastName}</div></div>
                    <div><div className="k">Contact</div><div className="v">{data.owner.email} · {data.owner.telephone}</div></div>
                    <div className="span2">
                        <div className="k">Pet</div>
                        <div className="v">
                            {data.pet.name || "—"} • {data.pet.species || "—"} • {data.pet.breed || "—"}
                            {data.pet.age ? ` • age: ${data.pet.age}` : ""}
                            {data.pet.notes ? <><br/>{data.pet.notes}</> : null}
                        </div>
                    </div>
                </div>

                <div className="confirm-actions">
                    <button className="btn-secondary" onClick={() => nav(-1)}>Back</button>
                    <button className="btn-primary" onClick={() => nav("/book")}>Book Another</button>
                </div>
            </div>
        </div>
    );
}
