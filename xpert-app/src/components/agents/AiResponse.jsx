import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  ClipboardIcon,
  BookmarkIcon as BookmarkOutline,
  ArrowPathIcon,
  PlusIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

export default function AiResponse({ response, responseType, tokensUsed, onSaveToLibrary, onUnsaveFromLibrary, saved, onRegenerate, onNewPrompt, onBackToPrompt, stopped, onStreamingComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [copied, setCopied] = useState(false);
  const intervalRef = useRef(null);
  const stoppedRef = useRef(stopped);

  // Keep a ref in sync so the interval callback can read it
  useEffect(() => {
    stoppedRef.current = stopped;
  }, [stopped]);

  const isImage = responseType === 'image';

  // Cleanup helper
  function stopInterval() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  // Start streaming text effect when response changes
  useEffect(() => {
    stopInterval();

    if (!response || isImage) {
      setDisplayedText(response || '');
      setStreaming(false);
      return;
    }

    // If stopped was already set (e.g., restored from session), show full text immediately
    if (stoppedRef.current) {
      setDisplayedText(response);
      setStreaming(false);
      return;
    }

    setStreaming(true);
    let i = 0;
    intervalRef.current = setInterval(() => {
      // Check if stopped was set externally
      if (stoppedRef.current) {
        setDisplayedText(response);
        setStreaming(false);
        stopInterval();
        return;
      }

      i += 3;
      if (i >= response.length) {
        setDisplayedText(response);
        setStreaming(false);
        stopInterval();
        // Notify parent that streaming completed naturally
        onStreamingComplete?.();
      } else {
        setDisplayedText(response.slice(0, i));
      }
    }, 10);

    return stopInterval;
  }, [response, isImage]);

  // React to parent stop signal
  useEffect(() => {
    if (stopped) {
      stopInterval();
      setDisplayedText(response || '');
      setStreaming(false);
    }
  }, [stopped, response]);

  function handleCopy() {
    navigator.clipboard.writeText(response);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  }

  function handleToggleSave() {
    if (saved) {
      onUnsaveFromLibrary?.();
    } else {
      onSaveToLibrary?.();
    }
  }

  const showActions = !streaming || isImage || stopped;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        {isImage ? (
          <div className="flex justify-center">
            <img
              src={`data:image/jpeg;base64,${response}`}
              alt="AI generated image"
              className="max-w-full rounded-lg shadow-md"
            />
          </div>
        ) : (
          <>
            <div className="prose prose-sm max-w-none text-[var(--color-text)]">
              <ReactMarkdown>{displayedText}</ReactMarkdown>
            </div>
            {streaming && !stopped && (
              <div className="flex items-center gap-3 mt-3">
                <span className="inline-block w-2 h-4 bg-primary-500 animate-pulse" />
                <span className="text-xs text-[var(--color-text-tertiary)]">Generating...</span>
              </div>
            )}
          </>
        )}
      </div>

      {showActions && (
        <>
          {!isImage && (
            <div className="flex items-center justify-between text-xs text-[var(--color-text-tertiary)]">
              <span>Estimated tokens: ~{tokensUsed || Math.ceil(response.length / 4)}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {!isImage && (
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? <CheckIcon className="h-4 w-4" /> : <ClipboardIcon className="h-4 w-4" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            )}
            <Button
              variant={saved ? 'secondary' : 'outline'}
              size="sm"
              onClick={handleToggleSave}
              className={saved ? 'text-primary-600' : ''}
            >
              {saved ? <BookmarkSolid className="h-4 w-4 text-primary-500" /> : <BookmarkOutline className="h-4 w-4" />}
              {saved ? 'Saved' : 'Save to Library'}
            </Button>
            {onBackToPrompt && (
              <Button variant="outline" size="sm" onClick={onBackToPrompt}>
                Edit Prompt
              </Button>
            )}
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
