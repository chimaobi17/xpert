import { createContext, useState, useEffect } from 'react';
import api from '../lib/axios';
import i18n from '../i18n';

export const AuthContext = createContext(null);

function syncLanguage(userData) {
  if (userData?.language_preference && userData.language_preference !== i18n.language?.split('-')[0]) {
    i18n.changeLanguage(userData.language_preference);
  }
}

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
      syncLanguage(res.data);
    } catch {
      setUser(null);
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const res = await api.post('/login', { email, password });

    // If 2FA is required, return the response without setting user
    if (res.data.requires_2fa) {
      return res.data;
    }

    if (res.data.token) {
      localStorage.setItem('auth_token', res.data.token);
    }
    sessionStorage.removeItem('xpert_onboarding_shown');
    const userData = res.data.user || res.data;
    setUser(userData);
    syncLanguage(userData);
    return res.data;
  }

  async function verifyMfa(userId, code) {
    const res = await api.post('/mfa/verify-login', { user_id: userId, code });
    if (res.data.token) {
      localStorage.setItem('auth_token', res.data.token);
    }
    sessionStorage.removeItem('xpert_onboarding_shown');
    const userData = res.data.user || res.data;
    setUser(userData);
    syncLanguage(userData);
  }

  async function register(name, email, password, password_confirmation, extra = {}) {
    const res = await api.post('/register', {
      name,
      email,
      password,
      password_confirmation,
      ...extra
    });
    if (res.data.token) {
      localStorage.setItem('auth_token', res.data.token);
    }
    sessionStorage.removeItem('xpert_onboarding_shown');
    sessionStorage.setItem('xpert_just_registered', 'true');
    const userData = res.data.user || res.data;
    setUser(userData);
    syncLanguage(userData);
  }

  async function logout() {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('xpert_onboarding_shown');
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
    setUser((prev) => {
      const newUser = prev ? { ...prev, ...data } : prev;
      if (data.language_preference) {
        syncLanguage(newUser);
      }
      return newUser;
    });
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, verifyMfa, register, logout, refreshUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
