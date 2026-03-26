import { useRef, useState } from 'react';
import clsx from 'clsx';
import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function FileUpload({ accept, maxSize = 10, onFile, label, className }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  function handleChange(e) {
    const selected = e.target.files[0];
    if (!selected) return;

    if (maxSize && selected.size > maxSize * 1024 * 1024) {
      setError(`File must be under ${maxSize}MB`);
      return;
    }

    setError('');
    setFile(selected);
    onFile?.(selected);
  }

  function handleRemove() {
    setFile(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
    onFile?.(null);
  }

  return (
    <div className={clsx('space-y-1', className)}>
      {label && <p className="block text-sm font-medium text-[var(--color-text)]">{label}</p>}
      {!file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[var(--color-border)] px-4 py-8 text-sm text-[var(--color-text-secondary)] hover:border-primary-500/50 hover:text-primary-600 transition-colors"
        >
          <CloudArrowUpIcon className="h-6 w-6" />
          <span>Click to upload a file</span>
        </button>
      ) : (
        <div className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3">
          <span className="text-sm text-[var(--color-text)] truncate">{file.name}</span>
          <button
            type="button"
            onClick={handleRemove}
            className="ml-2 rounded p-1 text-[var(--color-text-secondary)] hover:text-red-500 transition-colors"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
