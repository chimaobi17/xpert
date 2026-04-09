import { useState } from 'react';
import clsx from 'clsx';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import Spinner from '../ui/Spinner';
import Card from '../ui/Card';

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
        <div className="grid gap-4 sm:grid-cols-3">
          {options.map((opt) => (
            <Card
              key={opt.id}
              hoverable
              onClick={() => setChoice(opt.id)}
              className={clsx(
                'p-4 sm:p-6 h-full flex flex-col justify-start transition-all duration-500',
                choice === opt.id
                  ? 'border-primary-500 bg-transparent ring-1 ring-primary-500 shadow-[0_0_20px_rgba(31,196,95,0.15)]'
                  : 'border-gray-100 dark:border-border hover:border-primary-500/50'
              )}
            >
              <p className="text-sm font-bold text-foreground mb-1">{opt.label}</p>
              <p className="text-xs text-text-secondary leading-relaxed">{opt.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {choice === 'generated' && (
        <div className="relative rounded-2xl border border-border bg-surface-hover/30 p-4 sm:p-6 animate-slide-up group overflow-hidden">
          <p className="text-[10px] font-black text-text-tertiary mb-3 uppercase tracking-widest">Optimized Intelligence Context</p>
          <pre className="text-sm text-foreground whitespace-pre-wrap break-words font-sans leading-relaxed overflow-x-auto">{generatedPrompt}</pre>
        </div>
      )}

      {choice === 'custom' && (
        <div className="animate-slide-up">
           <Textarea
             label="Your Custom Directives"
             placeholder="Instruct your agent with precise documentation..."
             value={customPrompt}
             onChange={(e) => setCustomPrompt(e.target.value)}
             rows={8}
           />
        </div>
      )}

      {choice === 'edited' && (
        <div className="animate-slide-up">
           <Textarea
             label="Refine Machine Blueprint"
             value={editedPrompt}
             onChange={(e) => setEditedPrompt(e.target.value)}
             rows={8}
           />
        </div>
      )}

      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between pt-8 border-t border-border mt-8">
        <Button variant="ghost" onClick={onBack} disabled={loading}>Back to Form</Button>
        <div className="flex items-center gap-2 w-full sm:w-auto">
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
            {loading ? 'Thinking...' : 'Send to AI'}
          </Button>
        </div>
      </div>
    </div>
  );
}
