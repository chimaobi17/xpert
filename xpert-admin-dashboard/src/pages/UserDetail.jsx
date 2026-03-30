import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  ArrowLeftIcon,
  ShieldExclamationIcon,
  ShieldCheckIcon,
  ArrowUpCircleIcon,
  TrashIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';
import { get, put, patch, del } from '../lib/apiClient';
import useAuth from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import Textarea from '../components/ui/Textarea';
import toast from 'react-hot-toast';

const durationOptions = ['24h', '7d', '30d', 'permanent'];

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blockModal, setBlockModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [blockDuration, setBlockDuration] = useState('24h');
  const [blockReason, setBlockReason] = useState('');

  useEffect(() => {
    loadUser();
  }, [id]);

  async function loadUser() {
    setLoading(true);
    const res = await get(`/admin/users/${id}`);
    if (res.ok) setTargetUser(res.data);
    setLoading(false);
  }

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;

  if (!targetUser) {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--color-text-secondary)]">User not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/users')}>Back to Users</Button>
      </div>
    );
  }

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isBlocked = !!(targetUser.banned_until || targetUser.ban_reason);

  async function handleBlock() {
    if (blockReason.length < 10) {
      toast.error('Reason must be at least 10 characters');
      return;
    }
    const res = await put(`/admin/users/${id}/block`, { duration: blockDuration, reason: blockReason });
    if (res.ok) {
      setTargetUser(res.data);
      setBlockModal(false);
      setBlockReason('');
      toast.success(`${targetUser.name} has been blocked`);
    }
  }

  async function handleUnblock() {
    const res = await put(`/admin/users/${id}/unblock`);
    if (res.ok) {
      setTargetUser(res.data);
      toast.success(`${targetUser.name} has been unblocked`);
    }
  }

  async function handlePromote(newRole) {
    const res = await put(`/admin/users/${id}/promote`, { role: newRole });
    if (res.ok) {
      setTargetUser(res.data);
      toast.success(`${targetUser.name} role changed to ${newRole}`);
    }
  }

  async function handleDelete() {
    const res = await del(`/admin/users/${id}`);
    if (res.ok) {
      setDeleteModal(false);
      toast.success(`${targetUser.name} has been deleted`);
      navigate('/users');
    }
  }

  async function handlePlanChange(plan) {
    const res = await patch(`/admin/users/${id}`, { plan_level: plan });
    if (res.ok) {
      setTargetUser(res.data);
      toast.success(`Plan updated to ${plan}`);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/users')} className="rounded-lg p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]">
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">{targetUser.name}</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{targetUser.email}</p>
        </div>
        {isBlocked && (
          <Badge variant="error"><ShieldExclamationIcon className="h-3 w-3 mr-1" /> Blocked</Badge>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
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

        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Recent Activity</h3>
          <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
             <table className="w-full text-xs">
                <thead className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
                   <tr>
                      <th className="px-4 py-2 text-left font-medium text-[var(--color-text-secondary)]">Agent</th>
                      <th className="px-4 py-2 text-left font-medium text-[var(--color-text-secondary)]">Prompt</th>
                      <th className="px-4 py-2 text-left font-medium text-[var(--color-text-secondary)]">Tokens</th>
                      <th className="px-4 py-2 text-left font-medium text-[var(--color-text-secondary)]">Date</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                   {targetUser.prompt_logs?.length > 0 ? (
                      targetUser.prompt_logs.map((log) => (
                         <tr 
                            key={log.id} 
                            onClick={() => setSelectedLog(log)}
                            className="hover:bg-[var(--color-surface-hover)] cursor-pointer transition-colors"
                         >
                            <td className="px-4 py-2">
                               <Badge variant="info" size="sm">{log.agent?.name || 'Default'}</Badge>
                            </td>
                            <td className="px-4 py-2 text-[var(--color-text-secondary)]">
                               <p className="line-clamp-1 max-w-[200px]">{log.prompt_text || '—'}</p>
                            </td>
                            <td className="px-4 py-2 text-[var(--color-text-secondary)]">{(log.tokens_estimated || 0).toLocaleString()}</td>
                            <td className="px-4 py-2 text-[var(--color-text-tertiary)]">{new Date(log.created_at).toLocaleDateString()}</td>
                         </tr>
                      ))
                   ) : (
                      <tr>
                         <td colSpan="4" className="px-4 py-6 text-center text-[var(--color-text-tertiary)] italic">
                            No recent activity found for this user.
                         </td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>
        </Card>

        {/* Breakdown Modal */}
        <Modal 
          isOpen={!!selectedLog} 
          onClose={() => setSelectedLog(null)} 
          title="Interaction Discovery"
        >
          {selectedLog && (
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              <div className="p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary-500/10 p-2">
                    <CpuChipIcon className="h-5 w-5 text-primary-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--color-text)]">
                      {selectedLog.agent?.name || 'Standard Agent'} Interaction
                    </h4>
                    <p className="text-xs text-[var(--color-text-tertiary)]">
                      {new Date(selectedLog.created_at).toLocaleString()} • Ref #{selectedLog.id}
                    </p>
                  </div>
                  <div className="ml-auto">
                     <Badge variant="neutral" size="sm">{selectedLog.tokens_estimated || 0} tokens</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-tertiary)] mb-3">
                  Full Prompt Context
                </h5>
                <div className="rounded-xl border border-[var(--color-border)] bg-[#0c0c0c] p-5 shadow-2xl">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-text)]">
                    {selectedLog.prompt_text}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={() => setSelectedLog(null)}>Dismiss</Button>
                <Button variant="outline" onClick={() => window.print()}>Export Log</Button>
              </div>
            </div>
          )}
        </Modal>

        <Card className="lg:col-span-2">
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

          <div className="flex flex-wrap gap-2">
            {isBlocked ? (
              <Button variant="outline" size="sm" onClick={handleUnblock}>
                <ShieldCheckIcon className="h-4 w-4" /> Unblock User
              </Button>
            ) : (
              <Button variant="danger" size="sm" onClick={() => setBlockModal(true)}>
                <ShieldExclamationIcon className="h-4 w-4" /> Block User
              </Button>
            )}

            {isSuperAdmin ? (
              <>
                <Button variant="outline" size="sm" onClick={() => handlePromote(targetUser.role === 'admin' ? 'user' : 'admin')}>
                  <ArrowUpCircleIcon className="h-4 w-4" />
                  {targetUser.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                </Button>
                <Button variant="danger" size="sm" onClick={() => setDeleteModal(true)}>
                  <TrashIcon className="h-4 w-4" /> Delete User
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" disabled title="Only super admins can perform this action">
                  <ArrowUpCircleIcon className="h-4 w-4" /> Promote/Demote
                </Button>
                <Button variant="outline" size="sm" disabled title="Only super admins can perform this action">
                  <TrashIcon className="h-4 w-4" /> Delete User
                </Button>
              </>
            )}
          </div>
        </Card>
      </div>

      <Modal isOpen={blockModal} onClose={() => setBlockModal(false)} title="Block User">
        <div className="space-y-4">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Block <span className="font-medium text-[var(--color-text)]">{targetUser.name}</span> from using XPERT.
          </p>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Duration</label>
            <select value={blockDuration} onChange={(e) => setBlockDuration(e.target.value)} className="block w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm">
              {durationOptions.map((d) => (<option key={d} value={d}>{d === 'permanent' ? 'Permanent' : d}</option>))}
            </select>
          </div>
          <Textarea label="Reason (required, min 10 characters)" placeholder="Explain why..." value={blockReason} onChange={(e) => setBlockReason(e.target.value)} rows={3} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setBlockModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleBlock}>Block User</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete User" size="sm">
        <div className="text-center">
          <TrashIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-sm text-[var(--color-text)]">
            Permanently delete <span className="font-semibold">{targetUser.name}</span>?
          </p>
          <p className="text-xs text-red-500 mt-2 font-medium">This action is irreversible.</p>
          <div className="flex justify-center gap-3 mt-6">
            <Button variant="ghost" onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete Forever</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
