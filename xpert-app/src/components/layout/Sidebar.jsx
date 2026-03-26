import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import {
  HomeIcon,
  CpuChipIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/agents', label: 'AI Agents', icon: CpuChipIcon },
  { to: '/library', label: 'Library', icon: BookOpenIcon },
  { to: '/settings', label: 'Settings', icon: Cog6ToothIcon },
  { to: '/help', label: 'Help', icon: QuestionMarkCircleIcon },
];

export default function Sidebar({ open, onClose }) {
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
            <p className="text-xs font-semibold text-primary-700 mb-1">Free Plan</p>
            <div className="h-1.5 rounded-full bg-primary-200">
              <div className="h-1.5 rounded-full bg-primary-500" style={{ width: '35%' }} />
            </div>
            <p className="text-xs text-primary-600 mt-1">8,750 / 25,000 tokens</p>
          </div>
        </div>
      </aside>
    </>
  );
}
