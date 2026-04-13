import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import { get, del } from '../lib/apiClient';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { timeAgo, truncate } from '../lib/helpers';

export default function Library() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAgent, setFilterAgent] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    loadLibrary();
  }, []);

  async function loadLibrary() {
    setLoading(true);
    const res = await get('/library');
    if (res.ok) setItems(res.data);
    setLoading(false);
  }

  const agentNames = [...new Set(items.map((i) => i.agent?.name).filter(Boolean))];

  const filtered = items.filter((item) => {
    const matchesSearch =
      (item.original_input || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.final_prompt || '').toLowerCase().includes(search.toLowerCase());
    const matchesAgent = filterAgent === 'All' || item.agent?.name === filterAgent;
    return matchesSearch && matchesAgent;
  });

  async function handleCopy(item) {
    const text = item.ai_response || item.final_prompt || '';
    await navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const res = await del(`/library/${deleteTarget}`);
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== deleteTarget));
      toast.success('Prompt removed from library');
    }
    setDeleteTarget(null);
  }

  if (loading) {
    return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight">Saved Results</h1>
        <p className="text-sm sm:text-lg text-text-secondary mt-1 sm:mt-2 font-medium">
          Everything you've saved from your AI helpers — all in one place.
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
        <Select
          value={filterAgent}
          onChange={(e) => setFilterAgent(e.target.value)}
          options={agentNames}
          className="sm:w-64"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpenIcon}
          title="No saved prompts"
          description="Your saved prompts will appear here. Generate a prompt and save it to get started."
          actionLabel="Go to Workspace"
          onAction={() => navigate('/workspace')}
        />
      ) : (
        <div className="space-y-5">
          {filtered.map((item) => (
            <Card
              key={item.id}
              className="!p-0 rounded-lg overflow-hidden"
            >
              <div
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                className="flex w-full items-center justify-between p-5 text-left cursor-pointer hover:bg-surface-hover/30 transition-all duration-300 group/card"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="info" size="sm" className="rounded-full px-3">{item.agent?.name || 'Agent'}</Badge>
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">{timeAgo(item.created_at)}</span>
                  </div>
                  <p className="text-sm font-bold text-foreground truncate">{item.original_input}</p>
                  {expandedId !== item.id && (
                    <p className="text-xs text-text-secondary mt-1 line-clamp-1">{truncate(item.ai_response || '', 100)}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleCopy(item); }}
                    className="rounded-xl p-2.5 text-text-tertiary hover:text-primary-500 hover:bg-primary-500/10 transition-all"
                    title="Copy to clipboard"
                  >
                    {copiedId === item.id ? (
                      <CheckIcon className="h-5 w-5 text-primary-500" />
                    ) : (
                      <ClipboardDocumentIcon className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(item.id); }}
                    className="rounded-xl p-2.5 text-text-tertiary hover:text-red-500 hover:bg-red-500/10 transition-all"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                  {expandedId === item.id ? (
                    <ChevronUpIcon className="h-5 w-5 text-text-tertiary" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-text-tertiary" />
                  )}
                </div>
              </div>

              {expandedId === item.id && (
                <div className="border-t border-border p-6 space-y-4 animate-slide-up">
                  <div>
                    <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-2">Detailed Blueprint</p>
                    <div className="text-sm text-foreground bg-surface-hover/30 rounded-2xl p-4 border border-border/50">
                      {item.final_prompt}
                    </div>
                  </div>
                  {item.ai_response && (
                    <div>
                      <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-2">Curated Intelligence</p>
                      <div className="text-sm text-foreground bg-surface-hover/30 rounded-2xl p-4 border border-border/50 whitespace-pre-wrap">
                        {item.ai_response}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Saved Prompt" isSolid size="sm">
        <div className="text-center p-1 sm:p-2">
          <div className="bg-red-500/10 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrashIcon className="h-7 w-7 sm:h-8 sm:w-8 text-red-500" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 tracking-tight">Are you sure?</h3>
          <p className="text-sm text-text-secondary mb-6 font-medium">
            This action cannot be undone. This prompt will be permanently removed from your library.
          </p>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:gap-3">
            <Button
              variant="outline"
              className="flex-1 h-11 rounded-full font-bold"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 h-11 rounded-full font-bold bg-red-500 hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
