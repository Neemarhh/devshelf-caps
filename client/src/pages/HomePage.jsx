import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

export default function HomePage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([api.get('/resources'), api.get('/snippets'), api.get('/tasks')])
      .then(([r, s, t]) => setData({ resources: r.data, snippets: s.data, tasks: t.data }))
      .catch(() => setData({ resources: [], snippets: [], tasks: [], failed: true }));
  }, []);

  if (!data) return <p>Loading...</p>;

  const { resources, snippets, tasks } = data;
  const isNew = !data.failed && resources.length + snippets.length + tasks.length === 0;
  const openTasks = tasks.filter((t) => t.status !== 'done');

  const cards = [
    { to: '/resources', icon: '🔖', title: 'Resources', text: 'Bookmarks to docs, articles, videos and tools.', count: `${resources.length} saved` },
    { to: '/snippets', icon: '📋', title: 'Snippets', text: 'Reusable code, labeled by language.', count: `${snippets.length} saved` },
    { to: '/tasks', icon: '✅', title: 'Tasks', text: 'What to do next, with priority and status.', count: `${openTasks.length} open` },
  ];

  return (
    <div className="home">
      <p className="eyebrow">Dashboard</p>
      <h2>{isNew ? 'Welcome to DevShelf' : 'Welcome back'}, {user?.userName}</h2>
      <p className="page-sub">
        {isNew
          ? 'Your personal developer workspace. Your shelf is empty. Start by saving a resource.'
          : 'What would you like to work on today?'}
      </p>

      <div className="home-grid">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className={isNew && c.to === '/resources' ? 'home-card highlight' : 'home-card'}
          >
            <span className="home-icon">{c.icon}</span>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
            <span className="home-meta">
              {c.count} <span className="home-open">Open →</span>
            </span>
          </Link>
        ))}
      </div>

      {openTasks.length > 0 && (
        <div className="panel up-next">
          <h3>Up next</h3>
          <p className="panel-sub">Your open tasks.</p>
          {openTasks.slice(0, 4).map((t) => (
            <div key={t.id} className="up-row">
              <span>{t.title}</span>
              <span className={`badge ${t.priority}`}>{t.priority}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}