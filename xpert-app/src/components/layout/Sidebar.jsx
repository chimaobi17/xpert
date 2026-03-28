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
          'fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] pt-16 transition-transform duration-200 lg:static lg:translate-x-0 lg:pt-0',
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
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-[var(--color-border)] p-4">
          <div className="rounded-lg bg-primary-50 p-3">
            <p className="text-xs font-semibold text-primary-700 mb-1">{planLabel} Plan</p>
            <div className="h-1.5 rounded-full bg-primary-200">
              <div className="h-1.5 rounded-full bg-primary-500" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs text-primary-600 mt-1">
              {tokensUsed.toLocaleString()} / {quotaMax.toLocaleString()} tokens
            </p>
            {isFree && (
              <p className="text-xs text-primary-600 mt-1">
                Agents: {agentCount}/3
              </p>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
