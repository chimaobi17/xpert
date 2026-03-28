import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { get, post } from '../../lib/apiClient';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import DynamicForm from '../../components/agents/DynamicForm';
import PromptPreview from '../../components/agents/PromptPreview';
import AiResponse from '../../components/agents/AiResponse';
import toast from 'react-hot-toast';

export default function AgentWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [agent, setAgent] = useState(null);
  const [loadingAgent, setLoadingAgent] = useState(true);
  const [step, setStep] = useState(1);
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [responseType, setResponseType] = useState('text');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAgent();
  }, [id]);

  async function loadAgent() {
    setLoadingAgent(true);
    const res = await get(`/agents/${id}`);
    if (res.ok) {
      setAgent(res.data);
    } else {
      setAgent(null);
    }
    setLoadingAgent(false);
  }

  if (loadingAgent) {
    return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  }

  if (!agent) {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--color-text-secondary)]">Agent not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/workspace')}>
          Back to Workspace
        </Button>
      </div>
    );
  }

  const template = agent.latest_template;
  const fieldSchema = template?.field_schema;
  const fields = (typeof fieldSchema === 'string' ? JSON.parse(fieldSchema) : fieldSchema)?.fields || [];

  async function handleGeneratePrompt() {
    const errors = {};
    fields.forEach((f) => {
      if (f.required && !formValues[f.name] && f.type !== 'file') {
        errors[f.name] = `${f.label} is required`;
      }
    });
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setLoading(true);

    // Build FormData if file present, else JSON
    const hasFile = fields.some((f) => f.type === 'file') && formValues.file;

    let res;
    if (hasFile) {
      const formData = new FormData();
      Object.entries(formValues).forEach(([key, val]) => {
        if (key === 'file' && val instanceof File) {
          formData.append('file', val);
        } else {
          formData.append(`fields[${key}]`, val ?? '');
        }
      });
      res = await post(`/agents/${id}/generate`, formData);
    } else {
      res = await post(`/agents/${id}/generate`, { fields: formValues });
    }

    if (res.ok) {
      setGeneratedPrompt(res.data.prompt);
      setStep(2);
    } else if (res.validationErrors) {
      setFormErrors(res.validationErrors);
    }
    setLoading(false);
  }

  async function handleSubmitToAI(finalPrompt, promptType) {
    setLoading(true);
    const res = await post(`/agents/${id}/submit`, {
      prompt_text: finalPrompt,
      prompt_type: promptType,
    });

    if (res.ok) {
      setAiResponse(res.data.response);
      setResponseType(res.data.type || 'text');
      setStep(3);
    } else {
      const message = res.data?.message || 'AI is temporarily unavailable. Please try again.';
      if (res.data?.retry) {
        toast.error(message + ' Retrying may help.');
      } else if (res.data?.upgrade) {
        toast(message, { icon: '⬆️' });
      } else {
        toast.error(message);
      }
    }
    setLoading(false);
  }

  async function handleSaveToLibrary() {
    const res = await post('/library', {
      agent_id: Number(id),
      original_input: JSON.stringify(formValues),
      final_prompt: generatedPrompt,
      ai_response: aiResponse,
    });
    if (res.ok) {
      toast.success('Saved to your prompt library');
    }
  }

  function handleRegenerate() {
    setStep(2);
    setAiResponse('');
  }

  function handleNewPrompt() {
    setStep(1);
    setFormValues({});
    setGeneratedPrompt('');
    setAiResponse('');
  }

  const stepLabels = ['Fill Form', 'Review Prompt', 'AI Response'];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/workspace')}
          className="rounded-lg p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[var(--color-text)]">{agent.name}</h1>
            {agent.is_premium_only && <Badge variant="premium" size="sm">Premium</Badge>}
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">{agent.domain} — {agent.category}</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-6">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
              step > i + 1
                ? 'bg-primary-500 text-white'
                : step === i + 1
                  ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-500'
                  : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-tertiary)]'
            }`}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className={`text-xs font-medium ${
              step === i + 1 ? 'text-primary-600' : 'text-[var(--color-text-tertiary)]'
            }`}>
              {label}
            </span>
            {i < stepLabels.length - 1 && (
              <div className={`h-px w-8 ${step > i + 1 ? 'bg-primary-500' : 'bg-[var(--color-border)]'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
              Configure your prompt
            </h2>
            <DynamicForm
              fields={fields}
              values={formValues}
              onChange={setFormValues}
              errors={formErrors}
            />
            <div className="mt-6 flex justify-end">
              <Button onClick={handleGeneratePrompt} loading={loading}>
                Generate Prompt
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
              Review your prompt
            </h2>
            <PromptPreview
              generatedPrompt={generatedPrompt}
              onSubmit={handleSubmitToAI}
              onBack={() => setStep(1)}
              loading={loading}
            />
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
              AI Response
            </h2>
            <AiResponse
              response={aiResponse}
              responseType={responseType}
              onSaveToLibrary={handleSaveToLibrary}
              onRegenerate={handleRegenerate}
              onNewPrompt={handleNewPrompt}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
