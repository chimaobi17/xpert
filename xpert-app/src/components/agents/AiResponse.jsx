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
      // Check if stopped was set externally — freeze at current position
      if (stoppedRef.current) {
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

  // React to parent stop signal — freeze text at current position
  useEffect(() => {
    if (stopped) {
      stopInterval();
      setDisplayedText(prev => prev);
      setStreaming(false);
    }
  }, [stopped]);

  function handleCopy() {
    navigator.clipboard.writeText(displayedText);
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
    <div className="flex flex-col" style={{ maxHeight: 'calc(100vh - 280px)' }}>
      {/* Scrollable AI content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6 overflow-hidden">
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
              <div className="prose prose-sm max-w-none text-[var(--color-text)] overflow-x-auto break-words [&_pre]:overflow-x-auto [&_pre]:max-w-full [&_table]:block [&_table]:overflow-x-auto">
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
      </div>

      {/* Fixed action buttons — always visible below the scroll area */}
      {showActions && (
        <div className="flex-shrink-0 pt-4 border-t border-[var(--color-border)] mt-4">
          {!isImage && (
            <div className="flex items-center justify-between text-xs text-[var(--color-text-tertiary)] mb-3">
              <span>Estimated tokens: ~{tokensUsed || Math.ceil(response.length / 4)}</span>
            </div>
          )}

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 [&>button]:min-h-[44px]">
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
        </div>
      )}
    </div>
  );
}
