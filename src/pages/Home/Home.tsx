import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Home.css";

export default function Home() {
    const [isLoading, setloading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setloading(false), 300);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) return <div className="loader"></div>;

    return (
        <div className="home-content">
            <h1>Welcome to Dyreklinikk</h1>
            <p>Your trusted partner in pet care and veterinary appointments</p>
            <Link to="/book" className="cta-button">Book Appointment</Link>
        </div>
    );
}
