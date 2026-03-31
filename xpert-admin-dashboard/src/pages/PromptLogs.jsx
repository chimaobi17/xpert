import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, ClipboardDocumentIcon, UserCircleIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import { get } from '../lib/apiClient';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';

import { formatExactDateTime, formatRelativeTime } from '../lib/helpers';

export default function PromptLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    const res = await get('/admin/logs');
    if (res.ok) setLogs(res.data);
    setLoading(false);
  }

  const filtered = logs.filter(
    (log) =>
      (log.user?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (log.user?.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (log.agent?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (log.prompt_text || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-text)]">Prompt Logs</h1>

      <Input
        icon={MagnifyingGlassIcon}
        placeholder="Search by user, agent or prompt text..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
              <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">User</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Agent</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Prompt</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Tokens</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-[var(--color-text-secondary)]">
                  No prompt logs yet. Logs will appear as users interact with agents.
                </td>
              </tr>
            ) : (
              filtered.map((log) => (
                <tr 
                  key={log.id} 
                  onClick={() => setSelectedLog(log)}
                  className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 min-w-[150px]">
                    <p className="font-medium text-[var(--color-text)]">{log.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-[var(--color-text-tertiary)]">{log.user?.email || ''}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="info" size="sm" className="whitespace-nowrap">{log.agent?.name || 'Default'}</Badge>
                  </td>
                  <td className="px-4 py-3 max-w-sm">
                    <p className="line-clamp-2 text-[var(--color-text-secondary)] font-medium leading-relaxed">
                      {log.prompt_text || '—'}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)] font-mono">{(log.tokens_estimated || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-[var(--color-text-tertiary)] text-xs whitespace-nowrap" title={formatRelativeTime(log.created_at) + ' ago'}>
                    {formatExactDateTime(log.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={!!selectedLog} 
        onClose={() => setSelectedLog(null)} 
        title="Prompt Breakdown"
      >
        {selectedLog && (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                <div className="flex items-center gap-2 mb-1 text-[var(--color-text-secondary)] mb-1">
                  <UserCircleIcon className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">User Account</span>
                </div>
                <p className="text-sm font-bold text-[var(--color-text)] truncate">{selectedLog.user?.name}</p>
                <p className="text-xs text-[var(--color-text-tertiary)] truncate">{selectedLog.user?.email}</p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                <div className="flex items-center gap-2 mb-1 text-[var(--color-text-secondary)] mb-1">
                  <CpuChipIcon className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">AI Integration</span>
                </div>
                <p className="text-sm font-bold text-[var(--color-text)] truncate">{selectedLog.agent?.name || 'Standard Agent'}</p>
                <p className="text-xs text-[var(--color-text-tertiary)] truncate">{selectedLog.prompt_type || 'Chat Session'}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                  <ClipboardDocumentIcon className="h-4 w-4" />
                  <span className="text-sm font-semibold">User Request</span>
                </div>
                <Badge variant="neutral" size="sm">{(selectedLog.tokens_estimated || 0).toLocaleString()} Tokens Used</Badge>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 shadow-inner">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-text)] font-medium">
                  {selectedLog.prompt_text}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[var(--color-border)]">
              <span className="text-xs text-[var(--color-text-tertiary)]" title={formatExactDateTime(selectedLog.created_at)}>
                Log Reference: #{selectedLog.id} • {formatRelativeTime(selectedLog.created_at)}
              </span>
              <Button variant="outline" size="sm" onClick={() => setSelectedLog(null)}>Close Inspection</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
