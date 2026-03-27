import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  ClipboardIcon,
  BookmarkIcon,
  ArrowPathIcon,
  PlusIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

export default function AiResponse({ response, tokensUsed, onSaveToLibrary, onRegenerate, onNewPrompt }) {
  const [displayedText, setDisplayedText] = useState('');
  const [streaming, setStreaming] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!response) return;
    let i = 0;
    const interval = setInterval(() => {
      i += 3;
      if (i >= response.length) {
        setDisplayedText(response);
        setStreaming(false);
        clearInterval(interval);
      } else {
        setDisplayedText(response.slice(0, i));
      }
    }, 10);
    return () => clearInterval(interval);
  }, [response]);

  function handleCopy() {
    navigator.clipboard.writeText(response);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <div className="prose prose-sm max-w-none text-[var(--color-text)]">
          <ReactMarkdown>{displayedText}</ReactMarkdown>
        </div>
        {streaming && (
          <span className="inline-block w-2 h-4 bg-primary-500 animate-pulse ml-1" />
        )}
      </div>

      {!streaming && (
        <>
          <div className="flex items-center justify-between text-xs text-[var(--color-text-tertiary)]">
            <span>Estimated tokens: ~{tokensUsed || Math.ceil(response.length / 4)}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <CheckIcon className="h-4 w-4" /> : <ClipboardIcon className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button variant="outline" size="sm" onClick={onSaveToLibrary}>
              <BookmarkIcon className="h-4 w-4" /> Save to Library
            </Button>
            <Button variant="outline" size="sm" onClick={onRegenerate}>
              <ArrowPathIcon className="h-4 w-4" /> Regenerate
            </Button>
            <Button variant="primary" size="sm" onClick={onNewPrompt}>
              <PlusIcon className="h-4 w-4" /> New Prompt
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
