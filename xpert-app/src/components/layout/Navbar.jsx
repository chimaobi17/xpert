import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  SunIcon,
  MoonIcon,
  BellIcon,
  Bars3Icon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowUpCircleIcon,
} from '@heroicons/react/24/outline';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';
import Avatar from '../ui/Avatar';

export default function Navbar({ onMenuToggle }) {
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
        <Link to="/dashboard" className="flex items-center gap-2">
          <svg className="h-8 w-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8L24 25L12 42" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M36 8L24 25L36 42" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-xl font-bold text-[var(--color-text)] hidden sm:block">XPERT</span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors"
        >
          {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </button>

        <Link
          to="/notifications"
          className="relative rounded-lg p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors"
        >
          <BellIcon className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary-500" />
        </Link>

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
              <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-lg">
                <div className="border-b border-[var(--color-border)] px-4 py-3">
                  <p className="text-sm font-medium text-[var(--color-text)]">{user?.name}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">{user?.email}</p>
                </div>
                <Link
                  to="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
                >
                  <UserCircleIcon className="h-4 w-4" /> Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
                >
                  <Cog6ToothIcon className="h-4 w-4" /> Settings
                </Link>
                <Link
                  to="/settings?tab=plan"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-primary-600 hover:bg-[var(--color-surface-hover)]"
                >
                  <ArrowUpCircleIcon className="h-4 w-4" /> Upgrade Plan
                </Link>
                <div className="border-t border-[var(--color-border)]">
                  <button
                    onClick={() => { setDropdownOpen(false); handleLogout(); }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-[var(--color-surface-hover)]"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" /> Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
