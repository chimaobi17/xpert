import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { getAgentById } from '../../mock/agents';
import { getTemplateByAgentId } from '../../mock/templates';
import { getMockResponse } from '../../mock/responses';
import { interpolateTemplate } from '../../lib/helpers';
import DynamicForm from '../../components/agents/DynamicForm';
import PromptPreview from '../../components/agents/PromptPreview';
import AiResponse from '../../components/agents/AiResponse';
import Badge from '../../components/ui/Badge';

export default function AgentWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const agent = getAgentById(id);
  const template = getTemplateByAgentId(id);

  const [step, setStep] = useState(1);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  if (!agent || !template) {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--color-text-secondary)]">Agent not found.</p>
        <button onClick={() => navigate('/agents')} className="mt-2 text-sm text-primary-600 hover:text-primary-700">
          Back to agents
        </button>
      </div>
    );
  }

  function handleFormSubmit(values) {
    const prompt = interpolateTemplate(template.template_body, values);
    setGeneratedPrompt(prompt);
    setStep(2);
  }

  function handleSendToAi(prompt) {
    setGeneratedPrompt(prompt);
    setAiResponse(getMockResponse(agent.id));
    setStep(3);
  }

  function handleSaveToLibrary() {
    toast.success('Prompt saved to library!');
  }

  function handleRegenerate() {
    setAiResponse('');
    setTimeout(() => {
      setAiResponse(getMockResponse(agent.id));
    }, 100);
  }

  function handleNewPrompt() {
    setStep(1);
    setGeneratedPrompt('');
    setAiResponse('');
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
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[var(--color-text)]">{agent.name}</h1>
            <Badge variant="info" size="sm">{agent.domain}</Badge>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">{agent.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                step >= s
                  ? 'bg-primary-500 text-white'
                  : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-tertiary)] border border-[var(--color-border)]'
              }`}
            >
              {s}
            </div>
            <span className={`text-xs font-medium ${
              step >= s ? 'text-primary-600' : 'text-[var(--color-text-tertiary)]'
            }`}>
              {s === 1 ? 'Fill Form' : s === 2 ? 'Review Prompt' : 'AI Response'}
            </span>
            {s < 3 && <div className={`h-px w-8 ${step > s ? 'bg-primary-500' : 'bg-[var(--color-border)]'}`} />}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        {step === 1 && (
          <DynamicForm fields={template.field_schema} onSubmit={handleFormSubmit} />
        )}
        {step === 2 && (
          <PromptPreview
            prompt={generatedPrompt}
            onSendToAi={handleSendToAi}
            onSaveToLibrary={handleSaveToLibrary}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <AiResponse
            response={aiResponse}
            tokensUsed={Math.floor(Math.random() * 2000) + 500}
            onSave={handleSaveToLibrary}
            onRegenerate={handleRegenerate}
            onNewPrompt={handleNewPrompt}
          />
        )}
      </div>
    </div>
  );
}
