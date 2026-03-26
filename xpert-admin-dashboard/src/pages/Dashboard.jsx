import {
  UsersIcon,
  DocumentTextIcon,
  CpuChipIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { dashboardStats, usageOverWeek, popularAgents, recentRegistrations, systemHealth } from '../mock/stats';
import Badge from '../components/ui/Badge';

function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function Dashboard() {
  const maxPrompts = Math.max(...usageOverWeek.map((d) => d.prompts));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-text)]">Admin Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: UsersIcon, label: 'Total Users', value: dashboardStats.totalUsers.toLocaleString() },
          { icon: DocumentTextIcon, label: 'Prompts Today', value: dashboardStats.totalPromptsToday.toLocaleString() },
          { icon: CpuChipIcon, label: 'Active Agents', value: dashboardStats.activeAgents },
          { icon: CurrencyDollarIcon, label: 'Revenue (MTD)', value: dashboardStats.revenue },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-[var(--color-text)]">{stat.value}</p>
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
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Usage (Last 7 Days)</h3>
          <div className="flex items-end gap-2 h-40">
            {usageOverWeek.map((day) => (
              <div key={day.day} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-primary-500 transition-all"
                  style={{ height: `${(day.prompts / maxPrompts) * 100}%` }}
                />
                <span className="text-xs text-[var(--color-text-tertiary)]">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Popular Agents</h3>
          <div className="space-y-3">
            {popularAgents.map((agent) => (
              <div key={agent.name} className="flex items-center gap-3">
                <span className="text-sm text-[var(--color-text)] w-36 truncate">{agent.name}</span>
                <div className="flex-1 h-2 rounded-full bg-[var(--color-bg-secondary)]">
                  <div
                    className="h-2 rounded-full bg-primary-500"
                    style={{ width: `${agent.usage}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-[var(--color-text-secondary)] w-8 text-right">{agent.usage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Recent Registrations</h3>
          <div className="space-y-3">
            {recentRegistrations.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">{user.name}</p>
                  <p className="text-xs text-[var(--color-text-tertiary)]">{user.email}</p>
                </div>
                <div className="text-right">
                  <Badge variant={user.plan_level === 'premium' ? 'premium' : user.plan_level === 'standard' ? 'info' : 'neutral'} size="sm">
                    {user.plan_level}
                  </Badge>
                  <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">{formatDateTime(user.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">System Health</h3>
          <div className="space-y-3">
            {systemHealth.map((service) => (
              <div key={service.name} className="flex items-center justify-between rounded-lg bg-[var(--color-bg)] p-3">
                <span className="text-sm text-[var(--color-text)]">{service.name}</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span className="text-xs font-medium text-green-600">Healthy</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
