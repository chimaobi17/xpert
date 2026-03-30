// Vercel deployment cache-bust: premium-agent-naming-v3
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
    <div className="animate-fade-in">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white tracking-tight">Discover Agents</h1>
        <p className="text-lg text-zinc-400 mt-2 font-medium">
          The most powerful AI curators, ready for your workspace.
        </p>
      </div>

      {/* Search & Filters Stack */}
      <div className="flex flex-col gap-6 mb-12">
        <div className="max-w-2xl">
          <Input
            icon={MagnifyingGlassIcon}
            placeholder="Search agents by name or description..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-zinc-900/40 border-zinc-800 rounded-2xl h-14 text-base"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap gap-2">
            {domains.map((d) => (
              <button
                key={d}
                onClick={() => setDomain(d)}
                className={clsx(
                  'rounded-full px-5 py-2 text-sm font-bold transition-all duration-300',
                  domain === d
                    ? 'bg-primary-500 text-black shadow-[0_0_15px_rgba(33,196,93,0.3)]'
                    : 'bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800'
                )}
              >
                {d}
              </button>
            ))}
          </div>
          
          <div className="relative group">
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className={clsx(
                'appearance-none rounded-full border border-zinc-800 px-6 py-2 text-sm font-bold transition-all pr-12',
                'bg-zinc-900/60 text-white cursor-pointer hover:border-zinc-700'
              )}
            >
              {tierFilters.map((t) => (
                <option key={t} value={t} className="bg-zinc-900 text-white">{t}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
               <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
               </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Grid */}
      {loading ? (
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => {
            const locked = agent.is_premium_only && user?.plan_level === 'free';

            return (
              <div key={agent.id} className="group relative">
                <Card 
                   className={clsx(
                     "relative h-full overflow-hidden transition-all duration-500",
                     locked ? "border-zinc-800/50" : "border-zinc-800 hover:border-primary-500/50 hover:shadow-[0_0_30px_rgba(33,196,93,0.1)]"
                   )}
                   glass
                >
                  {locked && (
                    <div className={clsx(
                      'absolute inset-0 z-20 flex items-center justify-center backdrop-blur-[8px]',
                      'bg-black/60'
                    )}>
                      <div className="text-center p-6 w-full transform transition-transform group-hover:scale-105">
                        <div className="bg-primary-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary-500/20">
                           <LockClosedIcon className="h-8 w-8 text-primary-500" />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-1">{agent.name}</h4>
                        <p className="text-xs uppercase tracking-widest text-primary-500/80 font-bold mb-6">{agent.domain} • Premium</p>
                        <Button 
                          onClick={() => setUpgradeModal(true)}
                          className="w-full rounded-full h-12 font-bold shadow-[0_0_20px_rgba(33,196,93,0.3)]"
                        >
                          Unlock This Agent
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-primary-500 shadow-inner group-hover:border-primary-500/30 transition-colors">
                        <CodeBracketIcon className="h-6 w-6" />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {agent.is_premium_only && (
                          <Badge variant="premium" size="sm" className="rounded-full px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-black border-none font-bold uppercase tracking-tighter italic">
                            Premium
                          </Badge>
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{agent.domain}</span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 leading-tight">{agent.name}</h3>
                      <p className="text-sm text-zinc-400 font-medium leading-relaxed line-clamp-3">
                        {agent.description || agent.system_prompt?.slice(0, 150) + '...'}
                      </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-zinc-800/50">
                      {agent.is_added ? (
                        <div className="flex items-center justify-center gap-2 text-primary-500 font-bold py-2">
                          <CheckCircleIcon className="h-5 w-5" /> Enabled
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full rounded-full h-11 font-bold border-zinc-800 hover:border-primary-500/50 hover:bg-primary-500/5 hover:text-primary-500 transition-all"
                          onClick={() => handleAddAgent(agent)}
                        >
                          <PlusIcon className="h-4 w-4" /> Add to Workspace
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {/* Agent Limit Modal */}
      <Modal isOpen={limitModal} onClose={() => setLimitModal(false)} title="Agent Limit Reached" isSolid>
        <div className="text-center p-2">
          <div className="bg-primary-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
             <RectangleStackIcon className="h-10 w-10 text-primary-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Full Workspace</h3>
          <p className="text-base text-zinc-400 mb-8 font-medium">
            Free plan users can curate up to 3 agents. Upgrade to curate an unlimited library.
          </p>
          <Button 
             className="w-full h-14 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(33,196,93,0.3)]" 
             onClick={() => { setLimitModal(false); navigate('/settings?tab=plan'); }}
          >
            Upgrade Now
          </Button>
        </div>
      </Modal>

      {/* Upgrade Modal */}
      <Modal isOpen={upgradeModal} onClose={() => setUpgradeModal(false)} title="Upgrade Your Plan" isSolid>
        <div className="text-center p-2">
          <div className="bg-gradient-to-tr from-primary-600 to-emerald-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(33,196,93,0.4)]">
             <SparklesIcon className="h-10 w-10 text-black" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Unlock Ultimate Power</h3>
          <p className="text-base text-zinc-400 mb-8 font-medium">
            Access advanced translation, ultra-fast generation, and our most capable premium curators.
          </p>
          <div className="grid gap-4 mb-8">
            <div className="rounded-3xl border border-zinc-800 p-6 text-left bg-zinc-950/50">
              <div className="flex justify-between items-center mb-1">
                 <p className="font-bold text-lg text-white">Standard</p>
                 <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest italic">Personal</span>
              </div>
              <p className="text-sm text-zinc-400">150K tokens/day, Priority Support</p>
            </div>
            <div className="rounded-3xl border-2 border-primary-500 p-6 text-left bg-primary-500/5 shadow-[0_0_15px_rgba(33,196,93,0.1)]">
              <div className="flex justify-between items-center mb-1">
                 <p className="font-bold text-xl text-primary-500">Premium</p>
                 <Badge variant="premium" size="sm" className="rounded-full px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-black border-none font-bold uppercase tracking-tighter">Elite</Badge>
              </div>
              <p className="text-sm text-white font-medium">1M tokens/day, All Agents, Image Generation</p>
            </div>
          </div>
          <Button 
             className="w-full h-14 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(33,196,93,0.3)]" 
             onClick={() => { setUpgradeModal(false); navigate('/settings?tab=plan'); }}
          >
            Start Your Free Trial
          </Button>
        </div>
      </Modal>
    </div>
  );
}
