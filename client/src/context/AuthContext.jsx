import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('devshelf_token');
    const savedUser = localStorage.getItem('devshelf_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, id, userName } = response.data;
    const userData = { id, userName, email: response.data.email };
    setToken(token);
    setUser(userData);
    localStorage.setItem('devshelf_token', token);
    localStorage.setItem('devshelf_user', JSON.stringify(userData));
  };

  const register = async (userName, email, password) => {
    await api.post('/auth/register', { userName, email, password });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('devshelf_token');
    localStorage.removeItem('devshelf_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}