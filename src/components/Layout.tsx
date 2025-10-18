// Layout.tsx
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import './Layout.css';

type Props = { children: ReactNode };

export default function Layout({ children }: Props) {
  return (
    <div className="layout-container">
      {/* always show the background video */}
      <video autoPlay muted loop playsInline className="background-video">
        <source src="/clinic-bg.mp4" type="video/mp4" />
        Your browser doesn’t support the video tag.
      </video>

      {/* Logo */}
      <Link to="/home">
        <img src="/logo.png" alt="Dyreklinikk Logo" className="logo" />
      </Link>
    
      {/* Navigation */}
       <NavBar />

      {/* Main content */}
      <div className="overlay">
        {children}
      </div>

    {/* Sticky footer */}
    <footer className="footer">
       &copy; {new Date().getFullYear()} Dyreklinikk. All rights reserved.
       
    </footer>
      
      
    </div>
  );
}
