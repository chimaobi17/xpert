import { useNavigate } from 'react-router-dom';
import {
  CommandLineIcon,
  PencilSquareIcon,
  ChartBarIcon,
  DocumentMagnifyingGlassIcon,
  LanguageIcon,
} from '@heroicons/react/24/outline';
import { agents } from '../../mock/agents';

const iconMap = {
  CommandLineIcon,
  PencilSquareIcon,
  ChartBarIcon,
  DocumentMagnifyingGlassIcon,
  LanguageIcon,
};

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {agents.map((agent) => {
          const Icon = iconMap[agent.icon];
          return (
            <button
              key={agent.id}
              onClick={() => navigate(`/agents/${agent.id}`)}
              className="flex flex-col items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-center transition-all duration-150 hover:border-primary-500/40 hover:shadow-sm"
            >
              {Icon && <Icon className="h-6 w-6 text-primary-500" />}
              <span className="text-xs font-medium text-[var(--color-text)]">{agent.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
