import { useEffect } from 'react';
import clsx from 'clsx';
import { XMarkIcon } from '@heroicons/react/24/outline';

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export default function Modal({ isOpen, onClose, title, size = 'md', isSolid = false, children }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="fixed inset-0 bg-black/60 dark:bg-black/90 backdrop-blur-md animate-fade-in" 
        onClick={onClose} 
      />
      
      <div
        className={clsx(
          'relative z-10 w-full rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl border transition-all duration-500 animate-slide-up overflow-hidden max-h-[90vh] overflow-y-auto',
          !isSolid ? 'glass border-border/50' : 'bg-background border-border',
          sizes[size]
        )}
      >
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6">
          <h3 className="text-lg sm:text-2xl font-bold text-foreground tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-2xl p-2 text-text-tertiary bg-surface-hover hover:text-foreground transition-all border border-border/30"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="px-5 sm:px-8 pb-6 sm:pb-10">{children}</div>
      </div>
    </div>
  );
}
