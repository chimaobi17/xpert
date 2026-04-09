import clsx from 'clsx';

export default function Input({ label, error, icon: Icon, className, id, ...props }) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : Math.random().toString(36).substr(2, 9));

  return (
    <div className={clsx('space-y-2', className)}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-black uppercase tracking-widest text-text-tertiary ml-1 break-words whitespace-normal">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Icon className="h-5 w-5 text-text-tertiary group-focus-within:text-primary-500 transition-colors duration-300" />
          </div>
        )}
        <input
          id={inputId}
          className={clsx(
            'block w-full rounded-2xl border bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-text-tertiary transition-all duration-300',
            Icon && 'pl-12',
            error 
              ? 'border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
              : 'border-border/80 focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 focus:shadow-[0_0_20px_rgba(31,196,95,0.05)]'
          )}
          {...props}
        />
      </div>
      {error && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase tracking-tighter">{error}</p>}
    </div>
  );
}
