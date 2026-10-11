import { useState, useEffect } from 'react';
import api from '../api/client';

const emptyForm = { title: '', language: 'javascript', tags: '', description: '', code: '' };

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    api.get('/snippets').then((res) => setSnippets(res.data));
  }, []);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      const res = await api.put(`/snippets/${editingId}`, form);
      setSnippets(snippets.map((s) => (s.id === editingId ? res.data : s)));
    } else {
      const res = await api.post('/snippets', form);
      setSnippets([res.data, ...snippets]);
    }
    resetForm();
  };

  const handleEdit = (s) => {
    setForm({
      title: s.title,
      language: s.language || 'plaintext',
      tags: s.tags || '',
      description: s.description || '',
      code: s.code,
    });
    setEditingId(s.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    await api.delete(`/snippets/${id}`);
    setSnippets(snippets.filter((s) => s.id !== id));
    if (editingId === id) resetForm();
  };

  const tagList = (tags) => (tags || '').split(',').map((t) => t.trim()).filter(Boolean);
  const languageCount = new Set(snippets.map((s) => s.language)).size;

  return (
    <section className="page">
      <div className="page-head">
        <div>
          <p className="eyebrow">Code library</p>
          <h2>Snippets</h2>
          <p className="page-sub">Keep reusable code close so you don't have to write it twice.</p>
        </div>
        <div className="stats">
          <div className="stat"><strong>{snippets.length}</strong><span>Snippets</span></div>
          <div className="stat"><strong>{languageCount}</strong><span>Languages</span></div>
        </div>
      </div>

      <form className="panel" onSubmit={handleSubmit}>
        <h3>{editingId ? 'Edit snippet' : 'Add a snippet'}</h3>
        <p className="panel-sub">
          {editingId ? 'Change the details and save.' : 'Save code you might need again.'}
        </p>

        <div className="field-grid">
          <div className="field">
            <label htmlFor="title">Title</label>
            <input id="title" required value={form.title} onChange={update('title')} placeholder="e.g. Fetch with Axios" />
          </div>
          <div className="field">
            <label htmlFor="language">Language</label>
            <select id="language" value={form.language} onChange={update('language')}>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="csharp">C#</option>
              <option value="python">Python</option>
              <option value="sql">SQL</option>
              <option value="plaintext">Plain text</option>
            </select>
          </div>
          <div className="field full">
            <label htmlFor="tags">Tags</label>
            <input id="tags" value={form.tags} onChange={update('tags')} placeholder="axios, api, auth (separate with commas)" />
          </div>
          <div className="field full">
            <label htmlFor="description">Description</label>
            <textarea id="description" rows={2} value={form.description} onChange={update('description')} placeholder="What does this code do?" />
          </div>
          <div className="field full">
            <label htmlFor="code">Code</label>
            <textarea id="code" required rows={6} className="code" value={form.code} onChange={update('code')} placeholder="Paste your code here" />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit">{editingId ? 'Save changes' : 'Save snippet'}</button>
          {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      {snippets.length === 0 && <p className="empty">No snippets yet. Add your first one above.</p>}

      {snippets.map((s) => (
        <div key={s.id} className="item">
          <div className="item-top">
            <span className="item-title">{s.title}</span>
            <span className="badge">{s.language}</span>
          </div>
          {s.description && <p className="item-desc">{s.description}</p>}
          {tagList(s.tags).length > 0 && (
            <div className="item-top">
              {tagList(s.tags).map((tag, i) => (
                <span key={i} className="badge tag">{tag}</span>
              ))}
            </div>
          )}
          <pre>{s.code}</pre>
          <div className="item-actions">
            <button onClick={() => handleEdit(s)}>Edit</button>
            <button className="btn-danger" onClick={() => handleDelete(s.id)}>Delete</button>
          </div>
        </div>
      ))}
    </section>
  );
}