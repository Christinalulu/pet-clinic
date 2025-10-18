import { Link, useLocation } from 'react-router-dom';

export default function NavBar() {
  const location = useLocation();

  return (
    <nav className="navbar-overlay">
      <Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>Home</Link> 
      <Link to="/book" className={location.pathname.startsWith('/book') ? 'active' : ''}>Book</Link>
      <Link to="/search" className={location.pathname === '/search' ? 'active' : ''}>Search</Link>
      <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
      <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact Us</Link>
    </nav>
  );
}
