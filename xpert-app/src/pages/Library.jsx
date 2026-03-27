import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import { get, del } from '../lib/apiClient';
import { formatDate, truncate } from '../lib/helpers';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

export default function Library() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAgent, setFilterAgent] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadLibrary();
  }, []);

  async function loadLibrary() {
    setLoading(true);
    const res = await get('/library');
    if (res.ok) setItems(res.data);
    setLoading(false);
  }

  const agentNames = [...new Set(items.map((i) => i.ai_agent?.name).filter(Boolean))];

  const filtered = items.filter((item) => {
    const matchesSearch =
      (item.original_input || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.final_prompt || '').toLowerCase().includes(search.toLowerCase());
    const matchesAgent = filterAgent === 'All' || item.ai_agent?.name === filterAgent;
    return matchesSearch && matchesAgent;
  });

  async function handleDelete(id) {
    const res = await del(`/library/${id}`);
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success('Prompt removed from library');
    }
  }

  if (loading) {
    return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Prompt Library</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Your saved prompts and AI responses
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          icon={MagnifyingGlassIcon}
          placeholder="Search prompts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <select
          value={filterAgent}
          onChange={(e) => setFilterAgent(e.target.value)}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)]"
        >
          <option value="All">All Agents</option>
          {agentNames.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpenIcon}
          title="No saved prompts"
          description="Your saved prompts will appear here. Generate a prompt and save it to get started."
          actionLabel="Go to Workspace"
          onAction={() => window.location.href = '/workspace'}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="info" size="sm">{item.ai_agent?.name || 'Agent'}</Badge>
                    <span className="text-xs text-[var(--color-text-tertiary)]">{formatDate(item.created_at)}</span>
                  </div>
                  <p className="text-sm font-medium text-[var(--color-text)] truncate">{item.original_input}</p>
                  {expandedId !== item.id && (
                    <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{truncate(item.ai_response || '', 100)}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                    className="rounded-lg p-1.5 text-[var(--color-text-tertiary)] hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                  {expandedId === item.id ? (
                    <ChevronUpIcon className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                  )}
                </div>
              </button>

              {expandedId === item.id && (
                <div className="border-t border-[var(--color-border)] p-4 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase mb-1">Prompt</p>
                    <p className="text-sm text-[var(--color-text)] bg-[var(--color-bg)] rounded-lg p-3">{item.final_prompt}</p>
                  </div>
                  {item.ai_response && (
                    <div>
                      <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase mb-1">AI Response</p>
                      <div className="text-sm text-[var(--color-text)] bg-[var(--color-bg)] rounded-lg p-3 whitespace-pre-wrap">
                        {item.ai_response}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
