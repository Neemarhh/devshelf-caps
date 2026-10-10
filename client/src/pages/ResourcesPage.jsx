import { useState, useEffect } from 'react';
import api from '../api/client';

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    api.get('/resources').then((res) => setResources(res.data));
  }, []);

  const resetForm = () => {
    setTitle('');
    setUrl('');
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      const res = await api.put(`/resources/${editingId}`, { title, url, type: 'docs' });
      setResources(resources.map((r) => (r.id === editingId ? res.data : r)));
    } else {
      const res = await api.post('/resources', { title, url, type: 'docs' });
      setResources([res.data, ...resources]);
    }
    resetForm();
  };

  const handleEdit = (item) => {
    setTitle(item.title);
    setUrl(item.url);
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    await api.delete(`/resources/${id}`);
    setResources(resources.filter((r) => r.id !== id));
    if (editingId === id) resetForm();
  };

  return (
    <div>
      <h2>My Resources</h2>

      <form onSubmit={handleSubmit}>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input required type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
        <button type="submit">{editingId ? 'Save changes' : 'Add'}</button>
        {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      {resources.length === 0 && <p>No resources yet. Add your first one above!</p>}

      {resources.map((item) => (
        <div key={item.id}>
          <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a>
          <button onClick={() => handleEdit(item)}>Edit</button>
          <button onClick={() => handleDelete(item.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}