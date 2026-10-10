import { useState, useEffect } from 'react';
import api from '../api/client';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    api.get('/tasks').then((res) => setTasks(res.data));
  }, []);

  const resetForm = () => {
    setTitle('');
    setPriority('medium');
    setEditingTask(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingTask) {
      const res = await api.put(`/tasks/${editingTask.id}`, {
        title,
        priority,
        status: editingTask.status,
        description: editingTask.description,
        project: editingTask.project,
        dueDate: editingTask.dueDate,
      });
      setTasks(tasks.map((t) => (t.id === editingTask.id ? res.data : t)));
    } else {
      const res = await api.post('/tasks', { title, status: 'todo', priority });
      setTasks([res.data, ...tasks]);
    }
    resetForm();
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setPriority(task.priority);
    setEditingTask(task);
  };

  const handleStatusChange = async (id, newStatus) => {
    const res = await api.patch(`/tasks/${id}/status`, { status: newStatus });
    setTasks(tasks.map((t) => (t.id === id ? res.data : t)));
  };

  const handleDelete = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks(tasks.filter((t) => t.id !== id));
    if (editingTask?.id === id) resetForm();
  };

  return (
    <div>
      <h2>My Tasks</h2>

      <form onSubmit={handleSubmit}>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit">{editingTask ? 'Save changes' : 'Add'}</button>
        {editingTask && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      {tasks.length === 0 && <p>No tasks yet.</p>}

      {tasks.map((task) => (
        <div key={task.id}>
          <span style={{ textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>
            {task.title}
          </span>{' '}
          ({task.priority})
          <select value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value)}>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <button onClick={() => handleEdit(task)}>Edit</button>
          <button onClick={() => handleDelete(task.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}