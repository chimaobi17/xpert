import { useState } from 'react';
import { notifications as initialNotifications } from '../mock/notifications';
import { formatDateTime } from '../lib/helpers';
import Badge from '../components/ui/Badge';
import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

const typeIcons = {
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
  success: CheckCircleIcon,
};

const typeBadgeVariant = {
  warning: 'warning',
  info: 'info',
  success: 'success',
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);

  function markAsRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Notifications</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <BellIcon className="mx-auto h-12 w-12 text-[var(--color-text-tertiary)] mb-4" />
          <p className="text-sm text-[var(--color-text-secondary)]">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const Icon = typeIcons[n.type] || InformationCircleIcon;
            return (
              <button
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                  n.read
                    ? 'border-[var(--color-border)] bg-[var(--color-surface)]'
                    : 'border-primary-200 bg-primary-50/50'
                }`}
              >
                <div className={`rounded-lg p-2 ${n.read ? 'bg-[var(--color-bg)]' : 'bg-primary-100'}`}>
                  <Icon className={`h-5 w-5 ${n.read ? 'text-[var(--color-text-tertiary)]' : 'text-primary-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-sm font-medium ${n.read ? 'text-[var(--color-text-secondary)]' : 'text-[var(--color-text)]'}`}>
                      {n.title}
                    </p>
                    <Badge variant={typeBadgeVariant[n.type]} size="sm">{n.type}</Badge>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-primary-500" />}
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)]">{n.message}</p>
                  <p className="text-xs text-[var(--color-text-tertiary)] mt-1">{formatDateTime(n.created_at)}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
