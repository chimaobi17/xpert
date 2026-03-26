import { useState } from 'react';
import Button from '../ui/Button';
import { PencilIcon, PaperAirplaneIcon, BookmarkIcon } from '@heroicons/react/24/outline';

export default function PromptPreview({ prompt, onSendToAi, onSaveToLibrary, onBack }) {
  const [editing, setEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState(prompt);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">Generated Prompt</h3>
        <button
          onClick={() => setEditing(!editing)}
          className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
        >
          <PencilIcon className="h-3.5 w-3.5" />
          {editing ? 'Preview' : 'Edit'}
        </button>
      </div>

      {editing ? (
        <textarea
          value={editedPrompt}
          onChange={(e) => setEditedPrompt(e.target.value)}
          rows={8}
          className="block w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] font-mono"
        />
      ) : (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
          <p className="text-sm text-[var(--color-text)] whitespace-pre-wrap">{editedPrompt}</p>
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={() => onSendToAi(editedPrompt)} className="flex-1">
          <PaperAirplaneIcon className="h-4 w-4" />
          Send to AI
        </Button>
        <Button variant="secondary" onClick={() => onSaveToLibrary(editedPrompt)}>
          <BookmarkIcon className="h-4 w-4" />
          Save to Library
        </Button>
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}
