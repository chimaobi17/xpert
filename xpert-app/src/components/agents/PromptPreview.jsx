import { useState } from 'react';
import clsx from 'clsx';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import Spinner from '../ui/Spinner';

export default function PromptPreview({ generatedPrompt, onSubmit, onBack, loading, onSavePrompt, onUnsavePrompt }) {
  const [choice, setChoice] = useState(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [editedPrompt, setEditedPrompt] = useState(generatedPrompt);
  const [savedId, setSavedId] = useState(null);

  function getFinalPrompt() {
    if (choice === 'generated') return generatedPrompt;
    if (choice === 'custom') return customPrompt;
    if (choice === 'edited') return editedPrompt;
    return '';
  }

  function getPromptType() {
    if (choice === 'generated') return 'generated';
    if (choice === 'custom') return 'custom';
    return 'edited';
  }

  async function handleToggleSave() {
    if (savedId) {
      await onUnsavePrompt?.(savedId);
      setSavedId(null);
    } else {
      const id = await onSavePrompt?.(getFinalPrompt());
      if (id) setSavedId(id);
    }
  }

  const options = [
    { id: 'generated', label: 'Use Generated Prompt', desc: 'Send the AI-crafted prompt as-is' },
    { id: 'custom', label: 'Write My Own', desc: 'Start from scratch with your own prompt' },
    { id: 'edited', label: 'Edit Generated Prompt', desc: 'Tweak the generated prompt to your liking' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">Choose how to proceed</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setChoice(opt.id)}
              className={clsx(
                'rounded-lg border p-4 text-left transition-all',
                choice === opt.id
                  ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                  : 'border-[var(--color-border)] hover:border-primary-300'
              )}
            >
              <p className="text-sm font-medium text-[var(--color-text)]">{opt.label}</p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {choice === 'generated' && (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4">
          <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">Generated Prompt (read-only)</p>
          <pre className="text-sm text-[var(--color-text)] whitespace-pre-wrap font-sans">{generatedPrompt}</pre>
        </div>
      )}

      {choice === 'custom' && (
        <Textarea
          label="Your Custom Prompt"
          placeholder="Write your prompt here..."
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          rows={8}
        />
      )}

      {choice === 'edited' && (
        <Textarea
          label="Edit the Generated Prompt"
          value={editedPrompt}
          onChange={(e) => setEditedPrompt(e.target.value)}
          rows={8}
        />
      )}

      <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
        <Button variant="ghost" onClick={onBack} disabled={loading}>Back to Form</Button>
        <div className="flex items-center gap-2">
          {onSavePrompt && choice && getFinalPrompt().trim() && !loading && (
            <Button
              variant={savedId ? 'secondary' : 'outline'}
              size="sm"
              onClick={handleToggleSave}
              className={savedId ? 'text-primary-600' : ''}
            >
              {savedId ? <BookmarkSolid className="h-4 w-4 text-primary-500" /> : <BookmarkOutline className="h-4 w-4" />}
              {savedId ? 'Saved' : 'Save Prompt'}
            </Button>
          )}
          <Button
            onClick={() => onSubmit(getFinalPrompt(), getPromptType())}
            disabled={!choice || !getFinalPrompt().trim() || loading}
            loading={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Spinner size="sm" light /> Thinking...
              </span>
            ) : (
              'Send to AI'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
