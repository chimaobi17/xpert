import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SunIcon,
  MoonIcon,
  Bars3Icon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';
import Avatar from '../ui/Avatar';

export default function AdminNavbar({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] lg:hidden"
        >
          <Bars3Icon className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <svg className="h-8 w-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8L24 25L12 42" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M36 8L24 25L36 42" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-xl font-bold text-[var(--color-text)] hidden sm:block">XPERT</span>
          <span className="rounded-md bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-700 hidden sm:block">
            Admin
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors"
        >
          {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </button>

        <div className="relative ml-1">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-[var(--color-surface-hover)] transition-colors"
          >
            <Avatar name={user?.name} size="sm" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-lg">
                <div className="border-b border-[var(--color-border)] px-4 py-3">
                  <p className="text-sm font-medium text-[var(--color-text)]">{user?.name}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">{user?.email}</p>
                </div>
                <button
                  onClick={() => { setDropdownOpen(false); handleLogout(); }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-[var(--color-surface-hover)]"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
