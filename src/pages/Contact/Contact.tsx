import { useEffect, useState } from "react";
import "./Contact.css";

export default function Contact() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timeout);
    }, []);

    if (isLoading) return <div className="loader" />;

    return (
        <div className="contact-wrapper">
            <div className="contact-box">
                <h2>Contact Us</h2>
                <p className="contact-info">📍 123 Main Street, Oslo</p>
                <p className="contact-info">📧 Email: support@dyreklinikk.no</p>
                <p className="contact-info">📞 Phone: +47 123 456 78</p>
            </div>
        </div>
    );
}
