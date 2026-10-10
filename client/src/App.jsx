import { Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import ResourcesPage from './pages/ResourcesPage';
import SnippetsPage from './pages/SnippetsPage';
import TasksPage from './pages/TasksPage';

export default function App() {
  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/welcome" element={<h2>You are logged in!</h2>} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/snippets" element={<SnippetsPage />} />
        <Route path="/tasks" element={<TasksPage />} />
      </Route>
    </Routes>
  </>
  );
}