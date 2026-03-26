import { useNavigate } from 'react-router-dom';
import { ClockIcon } from '@heroicons/react/24/outline';
import { formatDateTime } from '../../lib/helpers';

const recentLogs = [
  { id: 1, agent_name: 'Code Assistant', prompt_type: 'code_generation', tokens: 1240, created_at: '2026-03-26T09:30:00Z' },
  { id: 2, agent_name: 'Content Writer', prompt_type: 'article', tokens: 2100, created_at: '2026-03-26T08:15:00Z' },
  { id: 3, agent_name: 'Business Analyst', prompt_type: 'swot_analysis', tokens: 1800, created_at: '2026-03-25T16:45:00Z' },
  { id: 4, agent_name: 'Code Assistant', prompt_type: 'debugging', tokens: 950, created_at: '2026-03-25T14:20:00Z' },
  { id: 5, agent_name: 'Document Analyzer', prompt_type: 'summary', tokens: 1550, created_at: '2026-03-25T11:00:00Z' },
];

export default function RecentActivity() {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">Recent Activity</h3>
        <button
          onClick={() => navigate('/library')}
          className="text-xs text-primary-600 hover:text-primary-700"
        >
          View all
        </button>
      </div>
      <div className="space-y-3">
        {recentLogs.map((log) => (
          <div key={log.id} className="flex items-center justify-between rounded-lg bg-[var(--color-bg)] p-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary-50 p-2">
                <ClockIcon className="h-4 w-4 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">{log.agent_name}</p>
                <p className="text-xs text-[var(--color-text-tertiary)]">{log.prompt_type.replace('_', ' ')}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-[var(--color-text-secondary)]">{log.tokens} tokens</p>
              <p className="text-xs text-[var(--color-text-tertiary)]">{formatDateTime(log.created_at)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
