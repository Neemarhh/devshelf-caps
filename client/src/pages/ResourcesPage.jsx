import { useState, useEffect } from 'react';
import api from '../api/client';

const emptyForm = { title: '', url: '', type: 'docs', notes: '' };

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    api.get('/resources').then((res) => setResources(res.data));
  }, []);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      const res = await api.put(`/resources/${editingId}`, form);
      setResources(resources.map((r) => (r.id === editingId ? res.data : r)));
    } else {
      const res = await api.post('/resources', form);
      setResources([res.data, ...resources]);
    }
    resetForm();
  };

  const handleEdit = (r) => {
    setForm({ title: r.title, url: r.url, type: r.type || 'docs', notes: r.notes || '' });
    setEditingId(r.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    await api.delete(`/resources/${id}`);
    setResources(resources.filter((r) => r.id !== id));
    if (editingId === id) resetForm();
  };

  return (
    <section className="page">
      <div className="page-head">
        <div>
          <p className="eyebrow">Library</p>
          <h2>Resources</h2>
          <p className="page-sub">Keep the docs, articles, videos and tools you want to come back to.</p>
        </div>
        <div className="stats">
          <div className="stat"><strong>{resources.length}</strong><span>Saved</span></div>
        </div>
      </div>

      <form className="panel" onSubmit={handleSubmit}>
        <h3>{editingId ? 'Edit resource' : 'Add a resource'}</h3>
        <p className="panel-sub">
          {editingId ? 'Change the details and save.' : 'Save a link so you can find it again.'}
        </p>

        <div className="field-grid">
          <div className="field">
            <label htmlFor="title">Title</label>
            <input id="title" required value={form.title} onChange={update('title')} placeholder="e.g. React documentation" />
          </div>
          <div className="field">
            <label htmlFor="type">Type</label>
            <select id="type" value={form.type} onChange={update('type')}>
              <option value="docs">Documentation</option>
              <option value="article">Article</option>
              <option value="video">Video</option>
              <option value="tool">Tool</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="field full">
            <label htmlFor="url">Link</label>
            <input id="url" required type="url" value={form.url} onChange={update('url')} placeholder="https://react.dev" />
          </div>
          <div className="field full">
            <label htmlFor="notes">Notes</label>
            <textarea id="notes" rows={3} value={form.notes} onChange={update('notes')} placeholder="Why is this worth keeping?" />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit">{editingId ? 'Save changes' : 'Save resource'}</button>
          {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      {resources.length === 0 && <p className="empty">Nothing saved yet. Add your first link above.</p>}

      {resources.map((r) => (
        <div key={r.id} className="item">
          <div className="item-top">
            <a className="item-title" href={r.url} target="_blank" rel="noreferrer">{r.title}</a>
            <span className="badge tag">{r.type}</span>
          </div>
          {r.notes && <p className="item-desc">{r.notes}</p>}
          <div className="item-actions">
            <button onClick={() => handleEdit(r)}>Edit</button>
            <button className="btn-danger" onClick={() => handleDelete(r.id)}>Delete</button>
          </div>
        </div>
      ))}
    </section>
  );
}