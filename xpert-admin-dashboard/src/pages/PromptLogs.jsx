import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { promptLogs } from '../mock/logs';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function PromptLogs() {
  const [search, setSearch] = useState('');

  const filtered = promptLogs.filter(
    (log) =>
      log.user_name.toLowerCase().includes(search.toLowerCase()) ||
      log.user_email.toLowerCase().includes(search.toLowerCase()) ||
      log.agent_name.toLowerCase().includes(search.toLowerCase())
  );

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
            {filtered.map((log) => (
              <tr key={log.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-[var(--color-text)]">{log.user_name}</p>
                  <p className="text-xs text-[var(--color-text-tertiary)]">{log.user_email}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="info" size="sm">{log.agent_name}</Badge>
                </td>
                <td className="px-4 py-3 text-[var(--color-text-secondary)]">{log.prompt_type.replace('_', ' ')}</td>
                <td className="px-4 py-3 text-[var(--color-text-secondary)]">{log.tokens_estimated.toLocaleString()}</td>
                <td className="px-4 py-3 text-[var(--color-text-tertiary)]">{formatDateTime(log.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
