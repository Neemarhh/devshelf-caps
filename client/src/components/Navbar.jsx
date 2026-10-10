import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#1e293b', color: '#fff' }}>
      <strong>DevShelf</strong>
      {isAuthenticated ? (
        <>
          <Link to="/resources" style={{ color: '#fff' }}>Resources</Link>
          <Link to="/snippets" style={{ color: '#fff' }}>Snippets</Link>
          <Link to="/tasks" style={{ color: '#fff' }}>Tasks</Link>
          <span>Hello, {user?.userName}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ color: '#fff' }}>Login</Link>
          <Link to="/register" style={{ color: '#fff' }}>Register</Link>
        </>
      )}
    </nav>
  );
}