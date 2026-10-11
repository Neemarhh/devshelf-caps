import { useState, useEffect } from 'react';
import api from '../api/client';

const emptyForm = {
  title: '', status: 'todo', priority: 'medium',
  project: '', description: '', dueDate: '',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    api.get('/tasks').then((res) => setTasks(res.data));
  }, []);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
    };
    if (editingId) {
      const res = await api.put(`/tasks/${editingId}`, payload);
      setTasks(tasks.map((t) => (t.id === editingId ? res.data : t)));
    } else {
      const res = await api.post('/tasks', payload);
      setTasks([res.data, ...tasks]);
    }
    resetForm();
  };

  const handleEdit = (task) => {
    setForm({
      title: task.title,
      status: task.status,
      priority: task.priority,
      project: task.project || '',
      description: task.description || '',
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
    });
    setEditingId(task.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStatusChange = async (id, newStatus) => {
    const res = await api.patch(`/tasks/${id}/status`, { status: newStatus });
    setTasks(tasks.map((t) => (t.id === id ? res.data : t)));
  };

  const handleDelete = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks(tasks.filter((t) => t.id !== id));
    if (editingId === id) resetForm();
  };

  const count = (status) => tasks.filter((t) => t.status === status).length;

  return (
    <section className="page">
      <div className="page-head">
        <div>
          <p className="eyebrow">Workflow</p>
          <h2>Tasks</h2>
          <p className="page-sub">Track what you're building, what's next and what's done.</p>
        </div>
        <div className="stats">
          <div className="stat"><strong>{count('todo')}</strong><span>To Do</span></div>
          <div className="stat"><strong>{count('in-progress')}</strong><span>In Progress</span></div>
          <div className="stat"><strong>{count('done')}</strong><span>Done</span></div>
        </div>
      </div>

      <form className="panel" onSubmit={handleSubmit}>
        <h3>{editingId ? 'Edit task' : 'Add a task'}</h3>
        <p className="panel-sub">
          {editingId ? 'Change the details and save.' : 'Write down something you need to get done.'}
        </p>

        <div className="field-grid">
          <div className="field full">
            <label htmlFor="title">Title</label>
            <input id="title" required value={form.title} onChange={update('title')} placeholder="e.g. Build the login page" />
          </div>
          <div className="field">
            <label htmlFor="status">Status</label>
            <select id="status" value={form.status} onChange={update('status')}>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="priority">Priority</label>
            <select id="priority" value={form.priority} onChange={update('priority')}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="project">Project</label>
            <input id="project" value={form.project} onChange={update('project')} placeholder="e.g. DevShelf" />
          </div>
          <div className="field">
            <label htmlFor="dueDate">Due date</label>
            <input id="dueDate" type="date" value={form.dueDate} onChange={update('dueDate')} />
          </div>
          <div className="field full">
            <label htmlFor="description">Description</label>
            <textarea id="description" rows={3} value={form.description} onChange={update('description')} placeholder="What needs to happen?" />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit">{editingId ? 'Save changes' : 'Add task'}</button>
          {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      {tasks.length === 0 && <p className="empty">No tasks yet. Add your first one above.</p>}

      {tasks.map((task) => (
        <div key={task.id} className="item">
          <div className="item-top">
            <span className={task.status === 'done' ? 'item-title done' : 'item-title'}>{task.title}</span>
            <span className={`badge ${task.priority}`}>{task.priority}</span>
            {task.project && <span className="badge">{task.project}</span>}
          </div>
          {task.description && <p className="item-desc">{task.description}</p>}
          {task.dueDate && <p className="item-desc">Due {new Date(task.dueDate).toLocaleDateString()}</p>}
          <div className="item-actions">
            <select value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value)}>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <button onClick={() => handleEdit(task)}>Edit</button>
            <button className="btn-danger" onClick={() => handleDelete(task.id)}>Delete</button>
          </div>
        </div>
      ))}
    </section>
  );
}