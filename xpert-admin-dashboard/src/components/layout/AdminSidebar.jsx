import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import {
  HomeIcon,
  UsersIcon,
  CpuChipIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { to: '/', label: 'Dashboard', icon: HomeIcon, end: true },
  { to: '/users', label: 'Users', icon: UsersIcon },
  { to: '/agents', label: 'AI Agents', icon: CpuChipIcon },
  { to: '/logs', label: 'Prompt Logs', icon: DocumentTextIcon },
  { to: '/settings', label: 'Settings', icon: Cog6ToothIcon },
];

export default function AdminSidebar({ open, onClose }) {
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
              end={item.end}
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
      </aside>
    </>
  );
}
