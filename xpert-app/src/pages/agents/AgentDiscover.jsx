import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  MagnifyingGlassIcon,
  CodeBracketIcon,
  LockClosedIcon,
  CheckCircleIcon,
  PlusIcon,
  SparklesIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline';
import { get, post } from '../../lib/apiClient';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

const domains = ['All', 'Technology', 'Creative', 'Business', 'Research', 'Language'];
const tierFilters = ['All Tiers', 'Free Only', 'Premium Only'];

export default function AgentDiscover() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [domain, setDomain] = useState(
    user?.field_of_specialization
      ? domains.find((d) => d.toLowerCase() === user.field_of_specialization) || 'All'
      : 'All'
  );
  const [tier, setTier] = useState('All Tiers');
  const [upgradeModal, setUpgradeModal] = useState(false);
  const [limitModal, setLimitModal] = useState(false);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userAgentCount, setUserAgentCount] = useState(0);

  const isFree = user?.plan_level === 'free' || !user?.plan_level;

  useEffect(() => {
    if (isFree) {
      get('/user/agents').then((res) => {
        if (res.ok) setUserAgentCount(res.data.length);
      }).catch(() => {});
    }
  }, [isFree]);

  const loadAgents = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (domain !== 'All') params.set('domain', domain);
    if (tier === 'Free Only') params.set('tier', 'free');
    else if (tier === 'Premium Only') params.set('tier', 'premium');

    const url = params.toString() ? `/agents/search?${params}` : '/agents';
    const res = await get(url);
    if (res.ok) setAgents(res.data);
    setLoading(false);
  }, [query, domain, tier]);

  useEffect(() => {
    const debounce = setTimeout(loadAgents, 300);
    return () => clearTimeout(debounce);
  }, [loadAgents]);

  async function handleAddAgent(agent) {
    if (agent.is_premium_only && user?.plan_level === 'free') {
      setUpgradeModal(true);
      return;
    }
    if (isFree && userAgentCount >= 3) {
      setLimitModal(true);
      return;
    }
    const res = await post(`/user/agents/${agent.id}`);
    if (res.ok) {
      setAgents((prev) => prev.map((a) => (a.id === agent.id ? { ...a, is_added: true } : a)));
      setUserAgentCount((c) => c + 1);
      toast.success(`${agent.name} added to your workspace`);
    } else if (res.error === 'agent_limit_reached') {
      setLimitModal(true);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Discover Agents</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Browse and add AI agents to your workspace
        </p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input
          icon={MagnifyingGlassIcon}
          placeholder="Search agents by name or description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-1">
          {domains.map((d) => (
            <button
              key={d}
              onClick={() => setDomain(d)}
              className={clsx(
                'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                domain === d
                  ? 'bg-primary-500 text-white'
                  : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
              )}
            >
              {d}
            </button>
          ))}
        </div>
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value)}
          className={clsx(
            'rounded-lg border px-3 py-1.5 text-xs font-medium backdrop-blur-md',
            'bg-white/60 border-white/20 [html[data-theme=dark]_&]:bg-gray-900/60 [html[data-theme=dark]_&]:border-white/10',
            'text-[var(--color-text)]'
          )}
        >
          {tierFilters.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Agent Grid */}
      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => {
            const locked = agent.is_premium_only && user?.plan_level === 'free';

            return (
              <Card key={agent.id} className="relative">
                {locked && (
                  <div className={clsx(
                    'absolute inset-0 z-10 flex items-center justify-center rounded-xl backdrop-blur-md',
                    'bg-white/60 border border-white/20 [html[data-theme=dark]_&]:bg-gray-900/60 [html[data-theme=dark]_&]:border-white/10'
                  )}>
                    <div className="text-center p-4">
                      <LockClosedIcon className="h-8 w-8 text-primary-500 mx-auto mb-2" />
                      <p className="text-sm font-bold text-[var(--color-text)] leading-tight">{agent.name}</p>
                      <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)] mt-1">{agent.domain}</p>
                      <Button size="sm" className="mt-3 w-full" onClick={() => setUpgradeModal(true)}>
                        Upgrade to Unlock
                      </Button>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <CodeBracketIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-[var(--color-text)] truncate">{agent.name}</h3>
                      {agent.is_premium_only && <Badge variant="premium" size="sm">Premium</Badge>}
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{agent.domain}</p>
                    <p className="text-xs text-[var(--color-text-tertiary)] mt-2 line-clamp-2">
                      {agent.system_prompt?.slice(0, 120)}...
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  {agent.is_added ? (
                    <Button variant="secondary" size="sm" className="w-full" disabled>
                      <CheckCircleIcon className="h-4 w-4" /> Added
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleAddAgent(agent)}
                    >
                      <PlusIcon className="h-4 w-4" /> Add to Workspace
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {!loading && agents.length === 0 && (
        <div className="text-center py-16 text-[var(--color-text-secondary)]">
          No agents found matching your criteria.
        </div>
      )}

      {/* Agent Limit Modal */}
      <Modal isOpen={limitModal} onClose={() => setLimitModal(false)} title="Agent Limit Reached" isSolid>
        <div className="text-center">
          <RectangleStackIcon className="h-12 w-12 text-primary-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">You've Reached Your Limit</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            Free plan users can have up to 3 agents in their workspace. Upgrade to add unlimited agents.
          </p>
          <Button className="w-full" onClick={() => { setLimitModal(false); navigate('/settings?tab=plan'); }}>
            View Plans
          </Button>
        </div>
      </Modal>

      {/* Upgrade Modal */}
      <Modal isOpen={upgradeModal} onClose={() => setUpgradeModal(false)} title="Upgrade Your Plan" isSolid>
        <div className="text-center">
          <SparklesIcon className="h-12 w-12 text-primary-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">Unlock Premium Agents</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            Premium agents include AI image generation, advanced translation, and more. Upgrade to access all agents.
          </p>
          <div className="space-y-3">
            <div className="rounded-lg border border-[var(--color-border)] p-4 text-left">
              <p className="font-semibold text-[var(--color-text)]">Standard — 150K tokens/day</p>
              <p className="text-sm text-[var(--color-text-secondary)]">300 requests/day, all free agents</p>
            </div>
            <div className="rounded-lg border-2 border-primary-500 p-4 text-left bg-primary-50">
              <p className="font-semibold text-primary-700">Premium — 1M tokens/day</p>
              <p className="text-sm text-primary-600">Unlimited requests, all agents including image generation</p>
            </div>
          </div>
          <Button className="w-full mt-6" onClick={() => { setUpgradeModal(false); navigate('/settings?tab=plan'); }}>
            View Plans
          </Button>
        </div>
      </Modal>
    </div>
  );
}
