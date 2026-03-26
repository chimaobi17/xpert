import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { users } from '../mock/users';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Users() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterPlan, setFilterPlan] = useState('All');

  const filtered = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesPlan = filterPlan === 'All' || u.plan_level === filterPlan.toLowerCase();
    return matchesSearch && matchesPlan;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-text)]">Users</h1>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          icon={MagnifyingGlassIcon}
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <select
          value={filterPlan}
          onChange={(e) => setFilterPlan(e.target.value)}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)]"
        >
          <option>All</option>
          <option>Free</option>
          <option>Standard</option>
          <option>Premium</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
              <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Name</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Email</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Plan</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Tokens Today</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr
                key={user.id}
                onClick={() => navigate(`/users/${user.id}`)}
                className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 font-medium text-[var(--color-text)]">{user.name}</td>
                <td className="px-4 py-3 text-[var(--color-text-secondary)]">{user.email}</td>
                <td className="px-4 py-3">
                  <Badge
                    variant={user.plan_level === 'premium' ? 'premium' : user.plan_level === 'standard' ? 'info' : 'neutral'}
                    size="sm"
                  >
                    {user.plan_level}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-[var(--color-text-secondary)]">{user.tokens_today.toLocaleString()}</td>
                <td className="px-4 py-3 text-[var(--color-text-tertiary)]">{formatDate(user.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
