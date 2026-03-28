import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { get } from '../lib/apiClient';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';

export default function Agents() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    const res = await get('/admin/agents');
    if (res.ok) setAgents(res.data);
    setLoading(false);
  }

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-text)]">AI Agents</h1>

      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
              <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Agent</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Domain</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Category</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Type</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-colors">
                <td className="px-4 py-3 font-medium text-[var(--color-text)]">{agent.name}</td>
                <td className="px-4 py-3">
                  <Badge variant="info" size="sm">{agent.domain}</Badge>
                </td>
                <td className="px-4 py-3 text-[var(--color-text-secondary)]">{agent.category}</td>
                <td className="px-4 py-3">
                  {agent.is_premium_only ? (
                    <Badge variant="premium" size="sm">Premium</Badge>
                  ) : (
                    <Badge variant="neutral" size="sm">Free</Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => navigate(`/agents/${agent.id}/edit`)}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
