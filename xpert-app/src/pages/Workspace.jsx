import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import clsx from 'clsx';
import {
  CodeBracketIcon,
  PlusCircleIcon,
  RectangleStackIcon,
  TrashIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import { get, del } from '../lib/apiClient';
import useAuth from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import ConfirmModal from '../components/ui/ConfirmModal';
import toast from 'react-hot-toast';

const CACHE_KEY = 'workspace_agents';
const CACHE_TTL = 60_000; // 1 minute

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return data;
  } catch { return null; }
}

function writeCache(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch { /* ignore */ }
}

export default function Workspace() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const cached = useRef(readCache()).current;
  const [myAgents, setMyAgents] = useState(cached || []);
  const [loading, setLoading] = useState(!cached);
  const [removeTarget, setRemoveTarget] = useState(null);

  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    if (!cached) setLoading(true);
    const res = await get('/user/agents');
    if (res.ok) {
      setMyAgents(res.data);
      writeCache(res.data);
    }
    setLoading(false);
  }

  async function confirmRemove() {
    if (!removeTarget) return;
    const res = await del(`/user/agents/${removeTarget}`);
    if (res.ok) {
      const updated = myAgents.filter((a) => a.id !== removeTarget);
      setMyAgents(updated);
      writeCache(updated);
      toast.success('Helper removed from workspace');
    }
    setRemoveTarget(null);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Spinner size="lg" />
        <p className="mt-4 text-sm text-[var(--color-text-secondary)] animate-pulse">
          Loading your workspace...
        </p>
        <div className="mt-2 text-xs text-[var(--color-text-tertiary)] max-w-xs text-center">
          Note: The backend may take up to 30 seconds to wake up on the first visit.
        </div>
      </div>
    );
  }

  const MAX_FREE_AGENTS = 3;
  const isFree = user?.plan_level === 'free' || !user?.plan_level;
  const showEmptySlots = isFree && myAgents.length < MAX_FREE_AGENTS;
  const emptySlotCount = MAX_FREE_AGENTS - myAgents.length;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">My Workspace</h1>
          <p className="text-lg text-text-secondary font-medium mt-2">
            You have <span className="text-primary-500 font-bold">{myAgents.length}</span> AI helper{myAgents.length !== 1 ? 's' : ''} ready to go.
          </p>
        </div>
        <Link to="/agents/discover">
          <Button size="lg" className="rounded-full shadow-lg">
            <PlusCircleIcon className="h-6 w-6 mr-1" />
            Add More
          </Button>
        </Link>
      </div>

      <div id="guide-workspace-grid" className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {myAgents.map((agent) => {
          const locked = agent.is_premium_only && (user?.plan_level === 'free' || !user?.plan_level);
          
          return (
            <div key={agent.id} className="group relative">
              <Card
                hoverable
                glass
                onClick={() => {
                  if (locked) {
                    navigate('/settings?tab=plan');
                  } else {
                    navigate(`/agents/${agent.id}`, { state: { from: '/workspace' } });
                  }
                }}
                className={clsx(
                  "relative h-full border-border/50 transition-all duration-500 flex flex-col p-4 sm:p-6 lg:p-8 overflow-hidden",
                  !locked && "hover:border-primary-500/50"
                )}
              >
                {/* Content Layer (Blurred if locked) */}
                <div className={clsx(
                  "flex flex-col h-full transition-all duration-500",
                  locked && "blur-[8px] opacity-30 pointer-events-none select-none"
                )}>
                  <div className="flex items-start justify-between mb-4 sm:mb-8">
                    <div className="flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-surface-hover text-primary-500 shadow-sm group-hover:scale-110 transition-all duration-500">
                      {locked ? (
                        <LockClosedIcon className="h-5 w-5 sm:h-7 sm:w-7" />
                      ) : (
                        <CodeBracketIcon className="h-5 w-5 sm:h-7 sm:w-7" />
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {agent.is_premium_only && (
                        <Badge variant="premium" size="sm" className="rounded-full px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-black border-none font-bold uppercase tracking-tighter italic">
                          Elite
                        </Badge>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); setRemoveTarget(agent.id); }}
                        className="rounded-full p-2.5 text-text-tertiary hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                        title="Remove Agent"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-2xl font-black text-foreground tracking-tight truncate mb-1">
                      {agent.name}
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary mb-6">{agent.domain}</p>
                    <p className="text-sm text-text-secondary font-medium leading-relaxed line-clamp-3 opacity-80 group-hover:opacity-100 transition-all duration-300">
                       {agent.description || agent.system_prompt?.slice(0, 120)}...
                    </p>
                  </div>
                </div>

                {/* Premium Lock Overlay */}
                {locked && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center animate-fade-in bg-background/5">
                    <div className="mb-4 rounded-2xl bg-primary-500/10 p-3 shadow-xl shadow-primary-500/5">
                      <LockClosedIcon className="h-8 w-8 text-primary-500" />
                    </div>

                    <div className="space-y-1 mb-6">
                      <h4 className="text-xl font-black text-foreground tracking-tight">{agent.name}</h4>
                      <div className="flex justify-center">
                        <Badge variant="premium" size="sm" className="uppercase tracking-widest text-[9px] py-0.5">
                          {agent.domain} • ELITE
                        </Badge>
                      </div>
                    </div>

                    <div className="w-full px-4">
                      <Button
                        onClick={(e) => { e.stopPropagation(); navigate('/settings?tab=plan'); }}
                        className="w-full rounded-xl h-12 font-black shadow-lg shadow-primary-500/20"
                      >
                        Unlock Helper
                      </Button>
                      <p className="mt-3 text-[10px] font-bold text-text-tertiary uppercase tracking-widest opacity-60">Elite Plan Required</p>
                    </div>
                    
                    {/* Allow removal even if locked */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setRemoveTarget(agent.id); }}
                      className="absolute top-4 right-4 rounded-full p-2.5 text-text-tertiary hover:text-red-500 transition-all opacity-60 hover:opacity-100"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </Card>
            </div>
          );
        })}

        {/* Empty Slot CTAs for free users with vacancies */}
        {showEmptySlots && [...Array(emptySlotCount)].map((_, i) => (
          <div
            key={`empty-slot-${i}`}
            onClick={() => navigate('/agents/discover')}
            className="group relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/60 hover:border-primary-500/50 bg-surface-hover/20 hover:bg-surface-hover/40 p-6 sm:p-8 cursor-pointer transition-all duration-300 min-h-[220px]"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-500 group-hover:scale-110 transition-transform duration-300">
              <PlusCircleIcon className="h-7 w-7" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-foreground mb-1">
                {i === 0 && myAgents.length > 0 ? "Add Third Helper" : "Empty Slot"}
              </p>
              <p className="text-xs text-text-secondary font-medium">Pick an AI helper to complete your team</p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary-500 mt-1">
              Slot {myAgents.length + i + 1} of 3
            </span>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={confirmRemove}
        title="Remove Helper"
        message="Are you sure you want to remove this helper from your workspace? You can always add it back later from Find Helpers."
        confirmLabel="Remove"
        icon={TrashIcon}
        variant="danger"
      />
    </div>
  );
}
