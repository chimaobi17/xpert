import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  SunIcon,
  MoonIcon,
  BellIcon,
  Bars3Icon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowUpCircleIcon,
  XMarkIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';
import { useAppGuide } from '../../contexts/AppGuideContext';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import logoFull from '../../assets/logo-full.svg';
import logoIcon from '../../assets/logo-icon.svg';

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { startGuide } = useAppGuide();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <header className={clsx(
      "sticky top-0 z-40 flex h-16 sm:h-20 items-center justify-between !border-x-0 !border-t-0 border-b border-border/30 px-4 sm:px-6 lg:px-10 transition-all duration-300",
      theme === 'light' ? 'bg-white' : 'glass'
    )}>
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          id="guide-menu-toggle"
          className="rounded-2xl p-2.5 text-text-secondary hover:bg-surface-hover lg:hidden transition-colors border-none"
        >
          <Bars3Icon className="h-6 w-6 font-bold" />
        </button>
        <Link to="/dashboard" className="flex items-center group">
          <img src={logoFull} alt="Xpert" className="hidden sm:block h-14 transition-transform group-hover:scale-105" />
          <img src={logoIcon} alt="Xpert" className="block sm:hidden h-12 transition-transform group-hover:scale-105" />
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}

          className="rounded-2xl p-2.5 text-text-secondary hover:text-foreground hover:bg-surface-hover transition-all border-none"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </button>

        <button
          onClick={startGuide}
          id="guide-tour-start"
          className="rounded-2xl p-2.5 text-primary-500 hover:bg-primary-500/10 transition-all border-none"
          title="Start App Tour"
        >
          <SparklesIcon className="h-5 w-5 animate-pulse" />
        </button>

        <Link
          to="/notifications"
          id="guide-notifications"
          className="relative rounded-2xl p-2.5 text-text-secondary hover:text-foreground hover:bg-surface-hover transition-all border-none"
        >
          <BellIcon className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary-500 shadow-[0_0_10px_rgba(31,196,95,0.5)] border border-background" />
        </Link>

        <div className="relative ml-2">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 rounded-2xl p-1.5 pr-4 hover:bg-surface-hover transition-all border-none group"
          >
            <Avatar name={user?.name} src={user?.avatar_url} size="sm" className="rounded-xl group-hover:scale-105 transition-transform" />
            <div className="hidden md:flex flex-col items-start px-2">
              <p className="text-sm font-bold text-foreground leading-none mb-0.5">{user?.name?.split(' ')[0]}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary scale-90 origin-left opacity-70">
                {user?.plan_level === 'premium' ? 'ELITE' : 'CITIZEN'}
              </p>
            </div>
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              <div role="menu" className="absolute right-0 z-50 mt-4 w-56 sm:w-64 max-w-[calc(100vw-2rem)] rounded-[2rem] border border-border bg-background p-2 shadow-2xl animate-fade-in overflow-hidden">
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="absolute top-3 right-4 p-2 rounded-full bg-surface-hover text-text-tertiary hover:text-foreground transition-all z-10"
                  title="Close Menu"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
                <div className="px-5 pt-6 pb-5 border-b border-border/50">
                  <p className="text-sm font-bold text-foreground tracking-tight mb-0.5">{user?.name}</p>
                  <p className="text-xs font-medium text-text-secondary truncate">{user?.email}</p>
                  <div className="mt-4">
                    <Badge variant={user?.plan_level === 'premium' ? 'premium' : 'neutral'} size="sm" className="w-full justify-center py-1.5 rounded-xl">
                      {user?.plan_level?.toUpperCase() || 'FREE'} ACCESS
                    </Badge>
                  </div>
                </div>
                <div className="p-2 space-y-1">
                  <Link
                    to="/settings?tab=profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-text-secondary hover:text-foreground hover:bg-surface-hover rounded-2xl transition-all"
                  >
                    <UserCircleIcon className="h-5 w-5" /> Profile
                  </Link>
                  <Link
                    to="/settings?tab=preferences"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-text-secondary hover:text-foreground hover:bg-surface-hover rounded-2xl transition-all"
                  >
                    <Cog6ToothIcon className="h-5 w-5" /> Settings
                  </Link>
                  {user?.plan_level !== 'premium' && (
                    <Link
                      to="/settings?tab=plan"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-primary-500 hover:bg-primary-500/5 rounded-2xl transition-all"
                    >
                      <ArrowUpCircleIcon className="h-5 w-5" /> Upgrade Plan
                    </Link>
                  )}
                  <div className="pt-1 border-t border-border/50">
                    <button
                      onClick={() => { setDropdownOpen(false); handleLogout(); }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-2xl transition-all uppercase tracking-tighter"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" /> Log Out
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
