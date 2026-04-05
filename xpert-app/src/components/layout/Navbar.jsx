import { useState, useEffect } from 'react';
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
import Badge from '../ui/Badge';

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const tick = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between glass px-6 lg:px-10 transition-all duration-300 border-b border-border/30">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="rounded-2xl p-2.5 text-text-secondary hover:bg-surface-hover lg:hidden transition-colors border-none"
        >
          <Bars3Icon className="h-6 w-6 font-bold" />
        </button>
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="bg-background/50 p-2 rounded-xl group-hover:bg-surface-hover transition-all">
            <svg className="h-7 w-7 transition-transform group-hover:scale-110" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8L24 25L12 42" stroke="#21c45d" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M36 8L24 25L36 42" stroke="#21c45d" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-foreground hidden sm:block tracking-tight leading-none uppercase">XPERT</span>
          </div>
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

        <div className="hidden sm:flex items-center rounded-2xl px-3 py-2 text-xs font-bold text-text-secondary tabular-nums tracking-wide">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>

        <Link
          to="/notifications"
          className="relative rounded-2xl p-2.5 text-text-secondary hover:text-foreground hover:bg-surface-hover transition-all border-none"
        >
          <BellIcon className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary-500 shadow-[0_0_10px_rgba(33,196,93,0.5)] border border-background" />
        </Link>

        <div className="relative ml-2">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 rounded-2xl p-1.5 pr-4 hover:bg-surface-hover transition-all border-none group"
          >
            <Avatar name={user?.name} size="sm" className="rounded-xl group-hover:scale-105 transition-transform" />
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
              <div role="menu" className="absolute right-0 z-50 mt-4 w-64 rounded-[2rem] border border-border bg-background p-2 shadow-2xl glass animate-fade-in overflow-hidden">
                <div className="px-5 py-5 border-b border-border/50">
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
