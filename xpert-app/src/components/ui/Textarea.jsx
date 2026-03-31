import clsx from 'clsx';

export default function Textarea({ label, error, rows = 4, className, id, ...props }) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={clsx('space-y-2', className)}>
      {label && (
        <label htmlFor={textareaId} className="block text-xs font-black uppercase tracking-widest text-text-tertiary ml-1">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={clsx(
          'block w-full rounded-2xl border bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-text-tertiary transition-all duration-300 resize-y',
          error 
            ? 'border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
            : 'border-border/80 focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 focus:shadow-[0_0_20px_rgba(33,196,93,0.05)]'
        )}
        {...props}
      />
      {error && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase tracking-tighter">{error}</p>}
    </div>
  );
}
