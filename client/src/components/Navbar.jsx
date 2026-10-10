import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  if (pathname === '/login' || pathname === '/register') return null;

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <nav className="topbar">
      <Link to="/" className="brand" onClick={() => setOpen(false)}>
        <span className="logo-d">D</span> DevShelf
      </Link>

      {isAuthenticated ? (
        <>
          <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? '✕' : '☰'}
          </button>

          <div className={open ? 'nav-menu open' : 'nav-menu'}>
            <div className="nav-links" onClick={() => setOpen(false)}>
              <NavLink to="/" end>Home</NavLink>
              <NavLink to="/resources">Resources</NavLink>
              <NavLink to="/snippets">Snippets</NavLink>
              <NavLink to="/tasks">Tasks</NavLink>
            </div>

            <div className="nav-user">
              <span className="avatar">{user?.userName?.charAt(0).toUpperCase()}</span>
              <span className="nav-name">{user?.userName}</span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </>
      ) : (
        <div className="nav-user">
          <Link to="/login" className="plain-link">Login</Link>
          <Link to="/register" className="plain-link">Register</Link>
        </div>
      )}
    </nav>
  );
}