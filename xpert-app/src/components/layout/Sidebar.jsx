import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import {
  HomeIcon,
  RectangleStackIcon,
  MagnifyingGlassCircleIcon,
  BookOpenIcon,
  BellIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import useAuth from '../../hooks/useAuth';
import { get } from '../../lib/apiClient';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/workspace', label: 'My Workspace', icon: RectangleStackIcon },
  { to: '/agents/discover', label: 'Discover Agents', icon: MagnifyingGlassCircleIcon },
  { to: '/library', label: 'Prompt Library', icon: BookOpenIcon },
  { to: '/notifications', label: 'Notifications', icon: BellIcon },
  { to: '/help', label: 'Help', icon: QuestionMarkCircleIcon },
  { to: '/settings', label: 'Settings', icon: Cog6ToothIcon },
];

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const [tokensUsed, setTokensUsed] = useState(0);
  const [agentCount, setAgentCount] = useState(0);

  const planLabel = user?.plan_level === 'premium' ? 'Premium' : user?.plan_level === 'standard' ? 'Standard' : 'Free';
  const quotaMax = user?.plan_level === 'premium' ? 1000000 : user?.plan_level === 'standard' ? 150000 : 25000;
  const isFree = user?.plan_level === 'free' || !user?.plan_level;

  useEffect(() => {
    get('/usage').then((res) => {
      if (res.ok) setTokensUsed(res.data.tokens_used_today ?? 0);
    });
    get('/user/agents').then((res) => {
      if (res.ok) setAgentCount(res.data.length);
    });
  }, []);

  const pct = Math.min((tokensUsed / quotaMax) * 100, 100);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-30 flex w-72 flex-col bg-[var(--color-surface)] pt-16 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:pt-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary-500/10 text-primary-500'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={clsx("h-5 w-5 transition-transform group-hover:scale-110", isActive && "text-primary-500")} />
                  {item.label}
                  {isActive && (
                    <div className="absolute left-0 h-6 w-1 rounded-r-full bg-primary-500 shadow-[0_0_8px_rgba(33,196,93,0.6)]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[var(--color-border)]/50">
          <div className="rounded-2xl bg-[var(--color-bg-secondary)] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-tertiary)]">{planLabel}</p>
              <span className="text-[10px] font-bold text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded-full">Active</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[var(--color-surface-hover)] overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-emerald-400 shadow-[0_0_8px_rgba(33,196,93,0.4)] transition-all duration-500" 
                style={{ width: `${pct}%` }} 
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-[10px] font-medium text-[var(--color-text-secondary)]">
                {tokensUsed.toLocaleString()} / {quotaMax.toLocaleString()}
              </p>
              <p className="text-[10px] font-bold text-[var(--color-text-secondary)]">
                {Math.round(pct)}%
              </p>
            </div>
            {isFree && (
              <button onClick={() => window.location.href='/settings?tab=plan'} className="w-full mt-3 py-2 rounded-xl bg-primary-500 text-black text-xs font-bold hover:bg-primary-400 transition-colors">
                Upgrade Now
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
