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
      onClick={() => isLocked ? navigate('/settings?tab=plan') : navigate(`/agents/${agent.id}`, { state: { from: '/agents/discover' } })}
      className="relative flex flex-col items-start rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-left transition-all duration-300 hover:border-primary-500/40 hover:shadow-2xl w-full group overflow-hidden"
    >
      {/* Content Layer (Blurred if locked) */}
      <div className={`w-full transition-all duration-500 ${isLocked ? 'blur-[6px] opacity-40 scale-[0.98] pointer-events-none select-none' : ''}`}>
        <div className="flex w-full items-start justify-between mb-4">
          <div className="rounded-xl bg-primary-500/5 p-3 group-hover:scale-110 transition-transform">
            <Icon className="h-6 w-6 text-primary-500" />
          </div>
          <div className="flex gap-1.5 grayscale-[0.5] opacity-80">
            <Badge variant={domainColors[agent.domain]} size="sm">{agent.domain}</Badge>
            {agent.is_premium_only && <Badge variant="premium" size="sm">Premium</Badge>}
          </div>
        </div>
        <h3 className="text-base font-bold text-[var(--color-text)] mb-2 tracking-tight">{agent.name}</h3>
        <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">{agent.description}</p>
      </div>

      {/* Premium Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="mb-4 rounded-2xl bg-primary-500/10 p-3 shadow-xl shadow-primary-500/5">
            <LockClosedIcon className="h-8 w-8 text-primary-500" />
          </div>
          
          <div className="space-y-1 mb-6">
            <h3 className="text-lg font-black text-[var(--color-text)] tracking-tight">{agent.name}</h3>
            <div className="flex justify-center">
              <Badge variant="premium" size="sm" className="uppercase tracking-widest text-[10px] py-0.5">
                {agent.domain} • ELITE
              </Badge>
            </div>
          </div>

          <div className="w-full">
            <div
              className="w-full rounded-xl bg-primary-500 py-2.5 text-xs font-black text-white shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Unlock Helper</span>
            </div>
            <p className="mt-2.5 text-[10px] font-bold text-text-tertiary uppercase tracking-widest opacity-60">Elite Plan Required</p>
          </div>
        </div>
      )}
    </button>
  );
}
