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
          'fixed inset-y-0 left-0 z-30 flex w-80 flex-col bg-background transition-transform duration-500 ease-in-out lg:static lg:translate-x-0 pt-0 border-r border-border/30',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="flex-1 space-y-2 px-6 py-10">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'group relative flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-300',
                  isActive
                    ? 'bg-primary-500 text-black shadow-[0_0_20px_rgba(33,196,93,0.3)]'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-foreground'
                )
              }
            >
              <item.icon className={clsx("h-6 w-6 transition-transform group-hover:scale-110")} />
              <span className="tracking-tight">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 pb-10">
          <div className="rounded-[2.5rem] bg-surface-hover p-7 border border-border/50 glass">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-tertiary">{planLabel}</p>
              <span className="text-[10px] font-bold text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded-full">ACTIVE</span>
            </div>
            <div className="h-2 w-full rounded-full bg-border/20 overflow-hidden mb-4">
              <div 
                className="h-full rounded-full bg-primary-500 shadow-[0_0_15px_rgba(33,196,93,0.5)] transition-all duration-1000 ease-out" 
                style={{ width: `${pct}%` }} 
              />
            </div>
            <div className="flex items-center justify-between">
               <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.1em]">
                {Math.round(pct)}% CAPACITY
              </p>
            </div>
            {isFree && (
              <button 
                onClick={() => window.location.href='/settings?tab=plan'} 
                className="w-full mt-6 py-3.5 rounded-full bg-foreground text-background text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
              >
                Upgrade System
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
