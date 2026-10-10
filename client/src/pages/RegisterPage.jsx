import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(userName, email, password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || (err.response ? 'Registration failed' : "Can't reach the server. Is it running?"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <span className="logo">D</span> DevShelf
      </div>

      <div className="auth-card">
        <h2>Create your account</h2>
        <p className="auth-sub">Set up your shelf and organize everything in one secure workspace.</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input id="username" required value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Choose a username" />

          <label htmlFor="email">Email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />

          <label htmlFor="password">Password</label>
          <div className="password-wrap">
            <input id="password" type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" />
            <button type="button" className="toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</button>
        </form>

        <p className="auth-footer">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}