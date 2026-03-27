import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  ArrowLeftIcon,
  ShieldExclamationIcon,
  ShieldCheckIcon,
  ArrowUpCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { getUserById } from '../mock/users';
import useAuth from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Textarea from '../components/ui/Textarea';
// formatDate would come from lib/helpers when backend is wired
import toast from 'react-hot-toast';

const durationOptions = ['24h', '7d', '30d', 'permanent'];

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [targetUser, setTargetUser] = useState(getUserById(id));
  const [blockModal, setBlockModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [blockDuration, setBlockDuration] = useState('24h');
  const [blockReason, setBlockReason] = useState('');

  if (!targetUser) {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--color-text-secondary)]">User not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/users')}>
          Back to Users
        </Button>
      </div>
    );
  }

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isBlocked = !!targetUser.banned_until;

  function handleBlock() {
    if (blockReason.length < 10) {
      toast.error('Reason must be at least 10 characters');
      return;
    }
    setTargetUser({ ...targetUser, banned_until: '2026-04-30T00:00:00Z', ban_reason: blockReason });
    setBlockModal(false);
    setBlockReason('');
    toast.success(`${targetUser.name} has been blocked`);
  }

  function handleUnblock() {
    setTargetUser({ ...targetUser, banned_until: null, ban_reason: null });
    toast.success(`${targetUser.name} has been unblocked`);
  }

  function handlePromote(newRole) {
    setTargetUser({ ...targetUser, role: newRole });
    toast.success(`${targetUser.name} role changed to ${newRole}`);
  }

  function handleDelete() {
    setDeleteModal(false);
    toast.success(`${targetUser.name} has been deleted`);
    navigate('/users');
  }

  function handlePlanChange(plan) {
    setTargetUser({ ...targetUser, plan_level: plan });
    toast.success(`Plan updated to ${plan}`);
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/users')}
          className="rounded-lg p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">{targetUser.name}</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{targetUser.email}</p>
        </div>
        {isBlocked && (
          <Badge variant="error">
            <ShieldExclamationIcon className="h-3 w-3 mr-1" /> Blocked
          </Badge>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Info */}
        <Card>
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Profile</h3>
          <dl className="space-y-3">
            {[
              ['Role', targetUser.role],
              ['Plan', targetUser.plan_level],
              ['Job Title', targetUser.job_title || '—'],
              ['Purpose', targetUser.purpose || '—'],
              ['Specialization', targetUser.field_of_specialization || '—'],
              ['Joined', new Date(targetUser.created_at).toLocaleDateString()],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm">
                <dt className="text-[var(--color-text-secondary)]">{label}</dt>
                <dd className="font-medium text-[var(--color-text)] capitalize">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        {/* Usage Stats */}
        <Card>
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Usage Today</h3>
          <dl className="space-y-3">
            <div className="flex justify-between text-sm">
              <dt className="text-[var(--color-text-secondary)]">Tokens Used</dt>
              <dd className="font-medium text-[var(--color-text)]">{targetUser.tokens_today.toLocaleString()}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-[var(--color-text-secondary)]">Requests</dt>
              <dd className="font-medium text-[var(--color-text)]">{targetUser.requests_today}</dd>
            </div>
          </dl>
        </Card>

        {/* Plan Management */}
        <Card>
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Plan Management</h3>
          <div className="flex gap-2">
            {['free', 'standard', 'premium'].map((plan) => (
              <button
                key={plan}
                onClick={() => handlePlanChange(plan)}
                className={clsx(
                  'flex-1 rounded-lg border px-3 py-2 text-xs font-medium capitalize transition-all',
                  targetUser.plan_level === plan
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-primary-300'
                )}
              >
                {plan}
              </button>
            ))}
          </div>
        </Card>

        {/* Moderation Actions */}
        <Card>
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Moderation</h3>

          {isBlocked && targetUser.ban_reason && (
            <div className="rounded-lg bg-red-50 border border-red-100 p-3 mb-4">
              <p className="text-xs font-medium text-red-600">Ban Reason</p>
              <p className="text-sm text-red-700 mt-1">{targetUser.ban_reason}</p>
              {targetUser.banned_until && (
                <p className="text-xs text-red-500 mt-1">Until: {new Date(targetUser.banned_until).toLocaleDateString()}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            {isBlocked ? (
              <Button variant="outline" size="sm" className="w-full" onClick={handleUnblock}>
                <ShieldCheckIcon className="h-4 w-4" /> Unblock User
              </Button>
            ) : (
              <Button variant="danger" size="sm" className="w-full" onClick={() => setBlockModal(true)}>
                <ShieldExclamationIcon className="h-4 w-4" /> Block User
              </Button>
            )}

            {isSuperAdmin ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handlePromote(targetUser.role === 'admin' ? 'user' : 'admin')}
                >
                  <ArrowUpCircleIcon className="h-4 w-4" />
                  {targetUser.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                </Button>
                <Button variant="danger" size="sm" className="w-full" onClick={() => setDeleteModal(true)}>
                  <TrashIcon className="h-4 w-4" /> Delete User Permanently
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" className="w-full opacity-50 cursor-not-allowed" disabled title="Only super admins can perform this action">
                  <ArrowUpCircleIcon className="h-4 w-4" /> Promote/Demote
                </Button>
                <Button variant="outline" size="sm" className="w-full opacity-50 cursor-not-allowed" disabled title="Only super admins can perform this action">
                  <TrashIcon className="h-4 w-4" /> Delete User
                </Button>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Block Modal (Glassmorphism) */}
      <Modal isOpen={blockModal} onClose={() => setBlockModal(false)} title="Block User">
        <div className="space-y-4">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Block <span className="font-medium text-[var(--color-text)]">{targetUser.name}</span> from using XPERT.
          </p>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Duration</label>
            <select
              value={blockDuration}
              onChange={(e) => setBlockDuration(e.target.value)}
              className="block w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
            >
              {durationOptions.map((d) => (
                <option key={d} value={d}>{d === 'permanent' ? 'Permanent' : d}</option>
              ))}
            </select>
          </div>
          <Textarea
            label="Reason (required, min 10 characters)"
            placeholder="Explain why this user is being blocked..."
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setBlockModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleBlock}>Block User</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete User" size="sm">
        <div className="text-center">
          <TrashIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-sm text-[var(--color-text)]">
            Are you sure you want to permanently delete <span className="font-semibold">{targetUser.name}</span>?
          </p>
          <p className="text-xs text-red-500 mt-2 font-medium">
            This action is irreversible. All user data will be destroyed.
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <Button variant="ghost" onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete Forever</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
