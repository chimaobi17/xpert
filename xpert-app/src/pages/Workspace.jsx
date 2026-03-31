import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CodeBracketIcon,
  PlusCircleIcon,
  RectangleStackIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { get, del } from '../lib/apiClient';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
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
  const navigate = useNavigate();
  const cached = useRef(readCache()).current;
  const [myAgents, setMyAgents] = useState(cached || []);
  const [loading, setLoading] = useState(!cached);

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

  async function handleRemove(agentId) {
    const res = await del(`/user/agents/${agentId}`);
    if (res.ok) {
      const updated = myAgents.filter((a) => a.id !== agentId);
      setMyAgents(updated);
      writeCache(updated);
      toast.success('Agent removed from workspace');
    }
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

  if (myAgents.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-6">My Workspace</h1>
        <EmptyState
          icon={RectangleStackIcon}
          title="No agents yet"
          description="Discover AI agents and add them to your workspace to get started."
          actionLabel="Discover Agents"
          onAction={() => navigate('/agents/discover')}
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">My Workspace</h1>
          <p className="text-lg text-text-secondary font-medium mt-2">
            Managing <span className="text-primary-500 font-bold">{myAgents.length}</span> active curators.
          </p>
        </div>
        <Link to="/agents/discover">
          <Button size="lg" className="rounded-full shadow-lg">
            <PlusCircleIcon className="h-6 w-6 mr-1" />
            Deploy More
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {myAgents.map((agent) => (
          <div key={agent.id} className="group relative">
            <Card
              hoverable
              glass
              onClick={() => navigate(`/agents/${agent.id}`, { state: { from: '/workspace' } })}
              className="relative h-full border-border/50 hover:border-primary-500/50 transition-all duration-500 flex flex-col p-8"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-surface-hover text-primary-500 shadow-sm group-hover:scale-110 transition-all duration-500">
                  <CodeBracketIcon className="h-7 w-7" />
                </div>
                <div className="flex items-center gap-3">
                  {agent.is_premium_only && (
                    <Badge variant="premium" size="sm" className="rounded-full px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-black border-none font-bold uppercase tracking-tighter italic">
                      Elite
                    </Badge>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemove(agent.id); }}
                    className="rounded-full p-2.5 text-text-tertiary hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                    title="Remove Agent"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="min-w-0 flex-1">
                <h3 className="text-2xl font-black text-foreground tracking-tight truncate mb-1">
                  {agent.name}
                </h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary mb-6">{agent.domain}</p>
                <p className="text-sm text-text-secondary font-medium leading-relaxed line-clamp-3 opacity-80 group-hover:opacity-100 transition-all duration-300">
                   {agent.description || agent.system_prompt?.slice(0, 120)}...
                </p>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
