import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { agents } from '../mock/agents';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Toggle from '../components/ui/Toggle';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function AgentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const agent = agents.find((a) => a.id === Number(id));

  const [name, setName] = useState(agent?.name || '');
  const [systemPrompt, setSystemPrompt] = useState(
    'You are an expert assistant. Provide accurate, well-structured responses.'
  );
  const [isPremium, setIsPremium] = useState(agent?.is_premium_only || false);

  if (!agent) {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--color-text-secondary)]">Agent not found.</p>
      </div>
    );
  }

  function handleSave(e) {
    e.preventDefault();
    toast.success('Agent updated successfully');
    navigate('/agents');
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

          <div className="rounded-lg bg-[var(--color-bg)] p-4">
            <h4 className="text-sm font-semibold text-[var(--color-text)] mb-2">Usage Statistics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[var(--color-text-secondary)]">Total Usage</p>
                <p className="font-medium text-[var(--color-text)]">{agent.usage_count.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[var(--color-text-secondary)]">Active Users</p>
                <p className="font-medium text-[var(--color-text)]">{agent.active_users}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit">Save Changes</Button>
            <Button variant="ghost" type="button" onClick={() => navigate('/agents')}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
