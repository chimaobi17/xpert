import { createContext, useState, useEffect, useCallback } from 'react';

export const ThemeContext = createContext(null);

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(preference) {
  return preference === 'system' ? getSystemTheme() : preference;
}

export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(() => {
    return localStorage.getItem('xpert-admin-theme') || 'system';
  });

  const resolved = resolveTheme(preference);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolved);
    localStorage.setItem('xpert-admin-theme', preference);
  }, [preference, resolved]);

  useEffect(() => {
    if (preference !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    function handler() {
      document.documentElement.setAttribute('data-theme', getSystemTheme());
    }
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [preference]);

  const setTheme = useCallback((value) => {
    setPreference(value);
  }, []);

  function toggleTheme() {
    setPreference((prev) => (prev === 'light' ? 'dark' : 'light'));
  }

  return (
    <ThemeContext.Provider value={{ theme: resolved, preference, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
