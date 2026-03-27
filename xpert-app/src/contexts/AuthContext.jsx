import { createContext, useState, useEffect } from 'react';
import api, { getCsrfCookie } from '../lib/axios';

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
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    await getCsrfCookie();
    const res = await api.post('/login', { email, password });
    setUser(res.data);
  }

  async function register(name, email, password, password_confirmation) {
    await getCsrfCookie();
    const res = await api.post('/register', { name, email, password, password_confirmation });
    setUser(res.data);
  }

  async function logout() {
    await api.post('/logout');
    setUser(null);
  }

  async function refreshUser() {
    try {
      const res = await api.get('/user');
      setUser(res.data);
    } catch {
      setUser(null);
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
