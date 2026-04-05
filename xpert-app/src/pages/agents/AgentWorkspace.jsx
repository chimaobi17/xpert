import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { get, post, del } from '../../lib/apiClient';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import DynamicForm from '../../components/agents/DynamicForm';
import PromptPreview from '../../components/agents/PromptPreview';
import AiResponse from '../../components/agents/AiResponse';
import FeedbackModal from '../../components/feedback/FeedbackModal';
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
  const [showFeedback, setShowFeedback] = useState(false);
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
      setTimeout(() => setShowFeedback(true), 2000);
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
    <div className="animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-6 mb-10">
        <button
          onClick={handleBack}
          className="rounded-2xl p-3 text-text-tertiary bg-surface-hover hover:bg-neutral-100 dark:hover:bg-zinc-800 hover:text-foreground transition-all border border-border"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-foreground tracking-tight">{agent.name}</h1>
            {agent.is_premium_only && (
              <Badge variant="premium" size="sm" className="rounded-full px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-black border-none font-bold uppercase tracking-tighter italic">
                Premium
              </Badge>
            )}
          </div>
          <p className="text-sm text-text-tertiary font-bold uppercase tracking-[0.2em] mt-1">{agent.domain} • {agent.category}</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between gap-4 mb-12 px-2">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex-1 group">
            <div className="relative mb-4">
              <div className={clsx(
                "h-1 rounded-full transition-all duration-700",
                step > i + 1 ? "bg-primary-500" : step === i + 1 ? "bg-primary-500/30" : "bg-surface-hover"
              )} />
              {step === i + 1 && (
                <div className="absolute top-0 left-0 h-1 bg-primary-500 animate-pulse-slow shadow-[0_0_10px_rgba(33,196,93,0.5)]" style={{ width: '100%' }} />
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className={clsx(
                "flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black transition-all duration-500",
                step > i + 1
                  ? "bg-primary-500 text-black"
                  : step === i + 1
                    ? "bg-surface-hover text-primary-500 border border-primary-500/30 shadow-[0_0_15px_rgba(33,196,93,0.1)]"
                    : "bg-surface-hover/50 text-text-tertiary border border-border/30"
              )}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span className={clsx(
                "text-xs font-black uppercase tracking-widest transition-colors",
                step === i + 1 ? "text-foreground" : "text-text-tertiary"
              )}>
                {label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card className="p-10 min-h-[400px]">
        {step === 1 && (
          <div className="animate-slide-up">
            <div className="mb-8">
               <h2 className="text-2xl font-black text-foreground mb-2">Configure Interaction</h2>
               <p className="text-text-secondary font-medium">Define parameters for your elite AI curator.</p>
            </div>
            <DynamicForm
              fields={fields}
              values={formValues}
              onChange={setFormValues}
              errors={formErrors}
              disabled={loading}
            />
            <div className="mt-10 flex justify-end">
              <Button 
                onClick={handleGeneratePrompt} 
                loading={loading}
                className="h-14 px-10 rounded-full font-black uppercase tracking-widest shadow-[0_0_20px_rgba(33,196,93,0.3)]"
              >
                Generate Prompt
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-slide-up">
            <div className="mb-8">
               <h2 className="text-2xl font-black text-foreground mb-2">Review Blueprint</h2>
               <p className="text-text-secondary font-medium">Verify the detailed instructions before execution.</p>
            </div>
            <PromptPreview
              key={generatedPrompt}
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
          <div className="animate-slide-up">
            <div className="mb-8 border-b border-border pb-6 flex items-center justify-between">
               <div>
                  <h2 className="text-2xl font-black text-foreground mb-1">Curation Complete</h2>
                  <p className="text-text-secondary font-medium">Review the optimized response from your agent.</p>
               </div>
               <Badge className="bg-primary-500/10 text-primary-500 border-primary-500/20 rounded-full px-4 py-1.5 font-bold uppercase tracking-tighter">Verified Result</Badge>
            </div>
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

      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        agentId={agent?.id}
        agentName={agent?.name}
      />
    </div>
  );
}
