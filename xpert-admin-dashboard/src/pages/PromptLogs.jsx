import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { get } from '../lib/apiClient';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';

function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function PromptLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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
      (log.ai_agent?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-text)]">Prompt Logs</h1>

      <Input
        icon={MagnifyingGlassIcon}
        placeholder="Search by user or agent..."
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
              <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Type</th>
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
                <tr key={log.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--color-text)]">{log.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-[var(--color-text-tertiary)]">{log.user?.email || ''}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="info" size="sm">{log.ai_agent?.name || 'Unknown'}</Badge>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">{log.prompt_type}</td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">{(log.tokens_estimated || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-[var(--color-text-tertiary)]">{formatDateTime(log.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
