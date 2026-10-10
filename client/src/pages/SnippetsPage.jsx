import { useState, useEffect } from 'react';
import api from '../api/client';

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState([]);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    api.get('/snippets').then((res) => setSnippets(res.data));
  }, []);

  const resetForm = () => {
    setTitle('');
    setCode('');
    setLanguage('javascript');
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      const res = await api.put(`/snippets/${editingId}`, { title, code, language });
      setSnippets(snippets.map((s) => (s.id === editingId ? res.data : s)));
    } else {
      const res = await api.post('/snippets', { title, code, language });
      setSnippets([res.data, ...snippets]);
    }
    resetForm();
  };

  const handleEdit = (s) => {
    setTitle(s.title);
    setCode(s.code);
    setLanguage(s.language);
    setEditingId(s.id);
  };

  const handleDelete = async (id) => {
    await api.delete(`/snippets/${id}`);
    setSnippets(snippets.filter((s) => s.id !== id));
    if (editingId === id) resetForm();
  };

  return (
    <div>
      <h2>My Snippets</h2>

      <form onSubmit={handleSubmit}>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="javascript">JavaScript</option>
          <option value="csharp">C#</option>
          <option value="python">Python</option>
          <option value="sql">SQL</option>
        </select>
        <br />
        <textarea required rows={4} value={code} onChange={(e) => setCode(e.target.value)} placeholder="Paste code here" />
        <br />
        <button type="submit">{editingId ? 'Save changes' : 'Save'}</button>
        {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      {snippets.length === 0 && <p>No snippets yet.</p>}

      {snippets.map((s) => (
        <div key={s.id}>
          <strong>{s.title}</strong> ({s.language})
          <button onClick={() => handleEdit(s)}>Edit</button>
          <button onClick={() => handleDelete(s.id)}>Delete</button>
          <pre>{s.code}</pre>
        </div>
      ))}
    </div>
  );
}