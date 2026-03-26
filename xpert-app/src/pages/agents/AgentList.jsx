import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { agents, domains } from '../../mock/agents';
import AgentCard from '../../components/agents/AgentCard';
import clsx from 'clsx';

export default function AgentList() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? agents : agents.filter((a) => a.domain === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">AI Agents</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Choose an agent to start generating prompts
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {['All', ...domains].map((domain) => (
          <button
            key={domain}
            onClick={() => setFilter(domain)}
            className={clsx(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-150',
              filter === domain
                ? 'bg-primary-500 text-white'
                : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-primary-500/40'
            )}
          >
            {domain}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((agent) => (
          <AgentCard key={agent.id} agent={agent} userPlan={user?.plan_level} />
        ))}
      </div>
    </div>
  );
}
