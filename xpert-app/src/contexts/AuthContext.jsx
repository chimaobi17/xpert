import { createContext, useState, useEffect } from 'react';
import api from '../lib/axios';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await api.get('/user');
      setUser(res.data);
    } catch {
      setUser(null);
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const res = await api.post('/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('auth_token', res.data.token);
    }
    setUser(res.data.user || res.data);
  }

  async function register(name, email, password, password_confirmation) {
    const res = await api.post('/register', { name, email, password, password_confirmation });
    if (res.data.token) {
      localStorage.setItem('auth_token', res.data.token);
    }
    setUser(res.data.user || res.data);
  }

  async function logout() {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  }

  async function refreshUser() {
    try {
      const res = await api.get('/user');
      setUser(res.data);
    } catch {
      setUser(null);
      localStorage.removeItem('auth_token');
    }
  }

  function updateUser(data) {
    setUser((prev) => (prev ? { ...prev, ...data } : prev));
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
