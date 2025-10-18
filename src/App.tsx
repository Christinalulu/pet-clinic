import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// PAGES
import Home from "@/pages/Home/Home";
import About from "@/pages/About/About";
import Contact from "@/pages/Contact/Contact";
import SearchDoctor from "@/pages/SearchDoctor/SearchDoctor";
import BookAppointment from "@/pages/BookAppointment/BookAppointment";
import Confirmation from "@/pages/Confirmation/Confirmation";

// LAYOUT (correct path)
import Layout from "@/components/Layout";


export default function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/search" element={<SearchDoctor />} />
                    <Route path="/book" element={<BookAppointment />} />
                    <Route path="/book/:id" element={<BookAppointment />} />
                    <Route path="/confirmation" element={<Confirmation />} />
                </Routes>
            </Layout>
        </Router>
    );
}
