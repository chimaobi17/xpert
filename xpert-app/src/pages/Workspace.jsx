import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CodeBracketIcon,
  PlusCircleIcon,
  RectangleStackIcon,
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
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">My Workspace</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {myAgents.length} agent{myAgents.length !== 1 ? 's' : ''} in your workspace
          </p>
        </div>
        <Link to="/agents/discover">
          <Button variant="outline" size="sm">
            <PlusCircleIcon className="h-4 w-4" />
            Discover More
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {myAgents.map((agent) => (
          <Card
            key={agent.id}
            hoverable
            onClick={() => navigate(`/agents/${agent.id}`, { state: { from: '/workspace' } })}
            className="relative group"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <CodeBracketIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-[var(--color-text)] truncate">
                    {agent.name}
                  </h3>
                  {agent.is_premium_only && <Badge variant="premium" size="sm">Premium</Badge>}
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{agent.domain}</p>
                <p className="text-xs text-[var(--color-text-tertiary)] mt-2 line-clamp-2">
                  {agent.system_prompt?.slice(0, 100)}...
                </p>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleRemove(agent.id); }}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-xs text-[var(--color-text-tertiary)] hover:text-red-500 transition-all"
            >
              Remove
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
