import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  ClipboardDocumentIcon,
  BookmarkIcon,
  ArrowPathIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

export default function AiResponse({ response, tokensUsed, onSave, onRegenerate, onNewPrompt }) {
  const [displayedText, setDisplayedText] = useState('');
  const [streaming, setStreaming] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!response) return;
    let index = 0;
    const interval = setInterval(() => {
      index += 3;
      if (index >= response.length) {
        setDisplayedText(response);
        setStreaming(false);
        clearInterval(interval);
      } else {
        setDisplayedText(response.slice(0, index));
      }
    }, 10);
    return () => clearInterval(interval);
  }, [response]);

  function handleCopy() {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">AI Response</h3>
        {streaming && <Spinner size="sm" className="text-primary-500" />}
      </div>

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-5">
        <div className="prose prose-sm max-w-none text-[var(--color-text)] prose-headings:text-[var(--color-text)] prose-code:text-primary-600 prose-pre:bg-[var(--color-bg-secondary)] prose-pre:border prose-pre:border-[var(--color-border)]">
          <ReactMarkdown>{displayedText}</ReactMarkdown>
        </div>
        {streaming && <span className="inline-block w-0.5 h-4 bg-primary-500 animate-pulse ml-0.5" />}
      </div>

      {!streaming && (
        <>
          <div className="flex items-center justify-between rounded-lg bg-[var(--color-bg-secondary)] px-4 py-2">
            <span className="text-xs text-[var(--color-text-secondary)]">
              Tokens used: <span className="font-medium text-[var(--color-text)]">{tokensUsed}</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <CheckIcon className="h-4 w-4 text-green-500" /> : <ClipboardDocumentIcon className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button variant="outline" size="sm" onClick={onSave}>
              <BookmarkIcon className="h-4 w-4" />
              Save to Library
            </Button>
            <Button variant="outline" size="sm" onClick={onRegenerate}>
              <ArrowPathIcon className="h-4 w-4" />
              Regenerate
            </Button>
            <Button variant="primary" size="sm" onClick={onNewPrompt}>
              <PlusIcon className="h-4 w-4" />
              New Prompt
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
