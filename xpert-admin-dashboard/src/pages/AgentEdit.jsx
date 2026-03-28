import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { get, patch } from '../lib/apiClient';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Toggle from '../components/ui/Toggle';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function AgentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    loadAgent();
  }, [id]);

  async function loadAgent() {
    const res = await get(`/admin/agents`);
    if (res.ok) {
      const found = res.data.find((a) => String(a.id) === String(id));
      if (found) {
        setAgent(found);
        setName(found.name);
        setSystemPrompt(found.latest_template?.system_prompt || found.system_prompt || '');
        setIsPremium(found.is_premium_only);
      }
    }
    setLoading(false);
  }

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;

  if (!agent) {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--color-text-secondary)]">Agent not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/agents')}>Back to Agents</Button>
      </div>
    );
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const res = await patch(`/admin/agents/${id}`, {
      name,
      system_prompt: systemPrompt,
      is_premium_only: isPremium,
    });
    setSaving(false);
    if (res.ok) {
      toast.success('Agent updated successfully');
      navigate('/agents');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/agents')}
          className="rounded-lg p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Edit Agent: {agent.name}</h1>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <form onSubmit={handleSave} className="max-w-2xl space-y-5">
          <Input
            label="Agent Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Domain"
            value={agent.domain}
            disabled
            className="opacity-60"
          />
          <Input
            label="Category"
            value={agent.category}
            disabled
            className="opacity-60"
          />
          <Textarea
            label="System Prompt"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={6}
          />
          <Toggle
            checked={isPremium}
            onChange={setIsPremium}
            label="Premium Only"
          />

          <div className="flex gap-3">
            <Button type="submit" loading={saving}>Save Changes</Button>
            <Button variant="ghost" type="button" onClick={() => navigate('/agents')}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
