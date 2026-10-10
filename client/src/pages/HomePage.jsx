import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

export default function HomePage() {
  const { user } = useAuth();
  const [isNew, setIsNew] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/resources'),
      api.get('/snippets'),
      api.get('/tasks'),
    ])
      .then(([r, s, t]) => {
        setIsNew(r.data.length + s.data.length + t.data.length === 0);
      })
      .catch(() => setIsNew(false));
  }, []);

  if (isNew === null) return <p>Loading...</p>;

  return (
    <div className="home">
      <h2>{isNew ? 'Welcome to DevShelf' : 'Welcome back'}, {user?.userName}</h2>
      <p>
        {isNew
          ? 'Your personal developer workspace. Your shelf is empty, Start by saving a resource.'
          : 'What would you like to work on today?'}
      </p>

      <div className="home-grid">
        <Link to="/resources" className={isNew ? 'home-card highlight' : 'home-card'}>
          <h3>🔖 Resources</h3>
          <p>Bookmarks to docs, articles, videos and tools.</p>
        </Link>
        <Link to="/snippets" className="home-card">
          <h3>📋 Snippets</h3>
          <p>Reusable code, labeled by language.</p>
        </Link>
        <Link to="/tasks" className="home-card">
          <h3>✅ Tasks</h3>
          <p>What to do next, with priority and status.</p>
        </Link>
      </div>
    </div>
  );
}