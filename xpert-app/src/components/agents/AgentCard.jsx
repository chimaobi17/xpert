import { useNavigate } from 'react-router-dom';
import {
  CommandLineIcon,
  PencilSquareIcon,
  ChartBarIcon,
  DocumentMagnifyingGlassIcon,
  LanguageIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import Badge from '../ui/Badge';

const iconMap = {
  CommandLineIcon,
  PencilSquareIcon,
  ChartBarIcon,
  DocumentMagnifyingGlassIcon,
  LanguageIcon,
};

const domainColors = {
  Technology: 'info',
  Creative: 'warning',
  Business: 'success',
  Research: 'neutral',
  Language: 'premium',
};

export default function AgentCard({ agent, userPlan = 'free' }) {
  const navigate = useNavigate();
  const Icon = iconMap[agent.icon] || CommandLineIcon;
  const isLocked = agent.is_premium_only && userPlan === 'free';

  return (
    <button
      onClick={() => !isLocked && navigate(`/agents/${agent.id}`)}
      className="relative flex flex-col items-start rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-left transition-all duration-150 hover:border-primary-500/40 hover:shadow-md w-full"
      disabled={isLocked}
    >
      {isLocked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-[var(--color-surface)]/80 backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-1">
            {/* <LockClosedIcon className="h-6 w-6 text-[var(--color-text-tertiary)]" />
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">Premium Only</span> */}
          </div>
        </div>
      )}
      <div className="flex w-full items-start justify-between mb-3">
        <div className="rounded-lg bg-primary-50 p-2.5">
          <Icon className="h-6 w-6 text-primary-600" />
        </div>
        <div className="flex gap-1.5">
          <Badge variant={domainColors[agent.domain]} size="sm">{agent.domain}</Badge>
          {agent.is_premium_only && <Badge variant="premium" size="sm">Premium</Badge>}
        </div>
      </div>
      <h3 className="text-base font-semibold text-[var(--color-text)] mb-1">{agent.name}</h3>
      <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">{agent.description}</p>
    </button>
  );
}
