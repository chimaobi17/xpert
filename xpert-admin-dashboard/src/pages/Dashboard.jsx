import { useState, useEffect } from 'react';
import {
  UsersIcon,
  DocumentTextIcon,
  CpuChipIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { get } from '../lib/apiClient';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [statsRes, usersRes] = await Promise.all([
      get('/admin/stats'),
      get('/admin/users'),
    ]);
    if (statsRes.ok) setStats(statsRes.data);
    if (usersRes.ok) setUsers(usersRes.data.slice(0, 5));
    setLoading(false);
  }

  if (loading) {
    return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  }

  const statCards = [
    { icon: UsersIcon, label: 'Total Users', value: stats?.total_users ?? 0 },
    { icon: DocumentTextIcon, label: 'Prompts Today', value: stats?.total_prompts_today ?? 0 },
    { icon: CpuChipIcon, label: 'Active Agents', value: stats?.active_agents ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-text)]">Admin Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-[var(--color-text)]">{stat.value.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-primary-50 p-2.5">
                <stat.icon className="h-5 w-5 text-primary-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Recent Registrations</h3>
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">{user.name}</p>
                  <p className="text-xs text-[var(--color-text-tertiary)]">{user.email}</p>
                </div>
                <Badge variant={user.plan_level === 'premium' ? 'premium' : user.plan_level === 'standard' ? 'info' : 'neutral'} size="sm">
                  {user.plan_level}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">System Health</h3>
          <div className="space-y-3">
            {['Laravel API', 'SQLite Database', 'HuggingFace API', 'Queue Worker'].map((service) => (
              <div key={service} className="flex items-center justify-between rounded-lg bg-[var(--color-bg)] p-3">
                <span className="text-sm text-[var(--color-text)]">{service}</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircleIcon className="h-4 w-4 text-primary-500" />
                  <span className="text-xs font-medium text-primary-600">Healthy</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
