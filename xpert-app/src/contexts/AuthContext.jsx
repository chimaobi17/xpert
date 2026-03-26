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
    await api.post('/login', { email, password });
    await checkAuth();
  }

  async function register(name, email, password, password_confirmation) {
    await getCsrfCookie();
    await api.post('/register', { name, email, password, password_confirmation });
    await checkAuth();
  }

  async function logout() {
    await api.post('/logout');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
