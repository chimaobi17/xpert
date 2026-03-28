import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { get, post, del } from '../../lib/apiClient';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import DynamicForm from '../../components/agents/DynamicForm';
import PromptPreview from '../../components/agents/PromptPreview';
import AiResponse from '../../components/agents/AiResponse';
import toast from 'react-hot-toast';

const STORAGE_PREFIX = 'agent_workspace_';

function readSession(key) {
  try {
    const saved = sessionStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
}

function writeSession(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch { /* quota exceeded — ignore */ }
}

export default function AgentWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const storageKey = `${STORAGE_PREFIX}${id}`;
  const restored = useRef(readSession(storageKey)).current;

  const [agent, setAgent] = useState(null);
  const [loadingAgent, setLoadingAgent] = useState(true);
  const [step, setStep] = useState(restored?.step || 1);
  const [formValues, setFormValues] = useState(restored?.formValues || {});
  const [formErrors, setFormErrors] = useState({});
  const [generatedPrompt, setGeneratedPrompt] = useState(restored?.generatedPrompt || '');
  const [aiResponse, setAiResponse] = useState(restored?.aiResponse || '');
  const [responseType, setResponseType] = useState(restored?.responseType || 'text');
  const [savedLibraryId, setSavedLibraryId] = useState(restored?.savedLibraryId || null);
  const [loading, setLoading] = useState(false);
  const [stopped, setStopped] = useState(false);
  const abortRef = useRef(null);

  // Persist state to sessionStorage on every meaningful change
  const saveState = useCallback(() => {
    writeSession(storageKey, {
      step, formValues, generatedPrompt, aiResponse, responseType, savedLibraryId,
    });
  }, [storageKey, step, formValues, generatedPrompt, aiResponse, responseType, savedLibraryId]);

  useEffect(() => {
    if (!loadingAgent && agent) saveState();
  }, [saveState, loadingAgent, agent]);

  // Also save on unmount (captures final state before component is destroyed)
  const stateRef = useRef();
  stateRef.current = { step, formValues, generatedPrompt, aiResponse, responseType, savedLibraryId };

  useEffect(() => {
    return () => {
      writeSession(storageKey, stateRef.current);
      // Abort any in-flight AI request on unmount
      if (abortRef.current) {
        abortRef.current.abort();
        abortRef.current = null;
      }
    };
  }, [storageKey]);

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

  // Smart back navigation: go to referrer or fallback to /workspace
  function handleBack() {
    const from = location.state?.from;
    if (from) {
      navigate(from);
    } else if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/workspace');
    }
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
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setStopped(false);
    setAiResponse('');
    setSavedLibraryId(null);

    const res = await post(`/agents/${id}/submit`, {
      prompt_text: finalPrompt,
      prompt_type: promptType,
    }, { signal: controller.signal });

    // If aborted, don't update state
    if (controller.signal.aborted) {
      return;
    }

    if (res.ok) {
      setAiResponse(res.data.response);
      setResponseType(res.data.type || 'text');
      setStep(3);
    } else if (res.error?.error !== 'cancelled') {
      const message = res.data?.message || res.error?.message || 'AI is temporarily unavailable. Please try again.';
      if (res.error?.retry) {
        toast.error(message + ' Retrying may help.');
      } else if (res.error?.upgrade) {
        toast(message, { icon: '⬆️' });
      } else {
        toast.error(message);
      }
    }
    setLoading(false);
    abortRef.current = null;
  }

  function handleStopGenerating() {
    // Abort the API request if still in flight
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    // Signal AiResponse to stop streaming animation
    setStopped(true);
    setLoading(false);
    toast('Generation stopped', { icon: '⏹' });
  }

  async function handleSaveToLibrary() {
    const res = await post('/library', {
      agent_id: Number(id),
      original_input: JSON.stringify(formValues),
      final_prompt: generatedPrompt,
      ai_response: aiResponse,
    });
    if (res.ok) {
      setSavedLibraryId(res.data.id);
      toast.success('Saved to your prompt library');
    }
  }

  async function handleUnsaveFromLibrary() {
    if (!savedLibraryId) return;
    const res = await del(`/library/${savedLibraryId}`);
    if (res.ok) {
      setSavedLibraryId(null);
      toast.success('Removed from library');
    }
  }

  async function handleSavePromptOnly(promptText) {
    const res = await post('/library', {
      agent_id: Number(id),
      original_input: JSON.stringify(formValues),
      final_prompt: promptText,
      ai_response: '',
    });
    if (res.ok) {
      toast.success('Prompt saved to library');
      return res.data.id;
    }
    return null;
  }

  function handleRegenerate() {
    setStep(2);
    setAiResponse('');
    setSavedLibraryId(null);
    setStopped(false);
  }

  function handleNewPrompt() {
    setStep(1);
    setFormValues({});
    setGeneratedPrompt('');
    setAiResponse('');
    setSavedLibraryId(null);
    setStopped(false);
    sessionStorage.removeItem(storageKey);
  }

  const stepLabels = ['Fill Form', 'Review Prompt', 'AI Response'];

  // Stop button visible only when actively loading or streaming (not after completion)
  const showStopButton = loading || (step === 3 && !stopped && aiResponse && responseType !== 'image');

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handleBack}
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
            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
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
              <div className={`h-px w-8 transition-colors ${step > i + 1 ? 'bg-primary-500' : 'bg-[var(--color-border)]'}`} />
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
              onSavePrompt={handleSavePromptOnly}
              onUnsavePrompt={async (libId) => {
                const res = await del(`/library/${libId}`);
                if (res.ok) toast.success('Removed from library');
              }}
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
              onUnsaveFromLibrary={handleUnsaveFromLibrary}
              saved={!!savedLibraryId}
              onRegenerate={handleRegenerate}
              onNewPrompt={handleNewPrompt}
              onBackToPrompt={() => { setStep(2); setStopped(false); }}
              stopped={stopped}
              onStreamingComplete={() => setStopped(true)}
            />
          </div>
        )}
      </Card>

      {/* Fixed stop button — only while actively generating */}
      {showStopButton && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <button
            onClick={handleStopGenerating}
            className="flex items-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-red-600 active:scale-95 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <rect x="5" y="5" width="10" height="10" rx="1" />
            </svg>
            Stop Generating
          </button>
        </div>
      )}
    </div>
  );
}
