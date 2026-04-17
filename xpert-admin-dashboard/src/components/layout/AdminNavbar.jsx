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
import logoFull from '../../assets/logo-full.svg';
import logoIcon from '../../assets/logo-icon.svg';


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
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 lg:px-6 transition-all duration-300">
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] lg:hidden shrink-0"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-3 shrink-0">
          <img src={logoFull} alt="Xpert" className="hidden sm:block h-14" />
          <img src={logoIcon} alt="Xpert" className="block sm:hidden h-16 shrink-0" />
          <span className="rounded-md bg-primary-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-700 hidden sm:block border border-primary-200">
            Admin
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors shrink-0"
        >
          {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </button>

        <div className="relative ml-1 shrink-0">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-[var(--color-surface-hover)] transition-colors shrink-0"
          >
            <Avatar name={user?.name} size="md" className="shrink-0" />
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
