import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { users } from '../mock/users';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = users.find((u) => u.id === Number(id));
  const [plan, setPlan] = useState(user?.plan_level || 'free');

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--color-text-secondary)]">User not found.</p>
      </div>
    );
  }

  function handlePlanChange() {
    toast.success(`Plan updated to ${plan}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/users')}
          className="rounded-lg p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">User Details</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar name={user.name} size="lg" />
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-text)]">{user.name}</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">{user.email}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-text-secondary)]">Role</span>
              <Badge variant={user.role === 'admin' ? 'warning' : 'neutral'} size="sm">{user.role}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-text-secondary)]">Plan</span>
              <Badge variant={user.plan_level === 'premium' ? 'premium' : user.plan_level === 'standard' ? 'info' : 'neutral'} size="sm">
                {user.plan_level}
              </Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-text-secondary)]">Joined</span>
              <span className="text-[var(--color-text)]">{new Date(user.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Today&apos;s Usage</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--color-text-secondary)]">Tokens</span>
                <span className="font-medium text-[var(--color-text)]">{user.tokens_today.toLocaleString()}</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--color-border)]">
                <div className="h-2 rounded-full bg-primary-500" style={{ width: `${Math.min((user.tokens_today / 25000) * 100, 100)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--color-text-secondary)]">Requests</span>
                <span className="font-medium text-[var(--color-text)]">{user.requests_today}</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--color-border)]">
                <div className="h-2 rounded-full bg-primary-500" style={{ width: `${Math.min((user.requests_today / 50) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Change Plan</h3>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="block w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] mb-4"
          >
            <option value="free">Free</option>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
          </select>
          <Button onClick={handlePlanChange} className="w-full">
            Update Plan
          </Button>
        </div>
      </div>
    </div>
  );
}
