import { useState, useEffect } from "react";
import "./About.css";

export default function About() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) return <div className="loader"></div>;

    return (
        <div className="about-page-wrapper">
            <div className="about-container">
                <h1>About Dyreklinikk</h1>
                <p className="intro">
                    <strong>Dyreklinikk</strong> is a modern veterinary appointment platform
                    designed to make pet healthcare simple, fast, and reliable. We believe
                    in bridging the gap between pet owners and veterinary professionals
                    through seamless technology.
                </p>

                <section className="section">
                    <h2>🏥 Our Mission</h2>
                    <p>
                        Our mission is to ensure every pet gets timely access to trusted
                        veterinary care. Whether it’s a routine checkup, vaccination, dental
                        cleaning, or specialized treatment, Dyreklinikk makes it easy to book
                        and manage appointments for your companions.
                    </p>
                </section>

                <section className="section">
                    <h2>💡 What We Offer</h2>
                    <ul>
                        <li>🗓️ Easy and intuitive booking for vet visits</li>
                        <li>🔎 Search for veterinarians by name, clinic, or specialty</li>
                        <li>📅 Personalized dashboard to manage your pets’ appointments</li>
                        <li>🔐 Secure data with privacy-first best practices</li>
                    </ul>
                </section>

                <section className="section">
                    <h2>🌐 Why Choose Us</h2>
                    <p>
                        Dyreklinikk combines modern UX with a robust backend, delivering both
                        reliability and ease of use for pet owners and clinics. Trusted by
                        animal lovers, we’re committed to improving pet healthcare—one paw at
                        a time. 🐾
                    </p>
                </section>
            </div>
        </div>
    );
}
