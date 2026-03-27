import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';
import { users as allUsers } from '../mock/users';
import useAuth from '../hooks/useAuth';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

export default function Users() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [specFilter, setSpecFilter] = useState('all');

  let filtered = allUsers;
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }
  if (planFilter !== 'all') {
    filtered = filtered.filter((u) => u.plan_level === planFilter);
  }
  if (roleFilter !== 'all') {
    filtered = filtered.filter((u) => u.role === roleFilter);
  }
  if (specFilter !== 'all') {
    filtered = filtered.filter((u) => u.field_of_specialization === specFilter);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Users</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">{allUsers.length} total users</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex-1 min-w-[200px]">
          <Input
            icon={MagnifyingGlassIcon}
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)]"
        >
          <option value="all">All Plans</option>
          <option value="free">Free</option>
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
        </select>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)]"
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>
        <select
          value={specFilter}
          onChange={(e) => setSpecFilter(e.target.value)}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)]"
        >
          <option value="all">All Specializations</option>
          <option value="technology">Technology</option>
          <option value="creative">Creative</option>
          <option value="business">Business</option>
          <option value="research">Research</option>
          <option value="language">Language</option>
        </select>
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">User</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Role</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Plan</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Specialization</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Status</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Tokens Today</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => navigate(`/users/${user.id}`)}
                  className="cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--color-text)]">{user.name}</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">{user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={user.role === 'super_admin' ? 'premium' : user.role === 'admin' ? 'info' : 'neutral'} size="sm">
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={user.plan_level === 'premium' ? 'success' : user.plan_level === 'standard' ? 'info' : 'neutral'} size="sm">
                      {user.plan_level}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)] capitalize">
                    {user.field_of_specialization || '—'}
                  </td>
                  <td className="px-4 py-3">
                    {user.banned_until ? (
                      <Badge variant="error" size="sm">
                        <ShieldExclamationIcon className="h-3 w-3 mr-1" /> Blocked
                      </Badge>
                    ) : (
                      <Badge variant="success" size="sm">Active</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                    {user.tokens_today.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
