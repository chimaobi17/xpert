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
        className="fixed inset-0 bg-black/80 backdrop-blur-md animate-fade-in" 
        onClick={onClose} 
      />
      
      <div
        className={clsx(
          'relative z-10 w-full rounded-[2.5rem] shadow-2xl border transition-all duration-500 animate-slide-up overflow-hidden',
          !isSolid ? 'glass border-zinc-800/50' : 'bg-black border-zinc-800',
          sizes[size]
        )}
      >
        <div className="flex items-center justify-between px-8 py-6">
          <h3 className="text-2xl font-bold text-white tracking-tight italic">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-2xl p-2 text-zinc-500 bg-zinc-900/50 hover:bg-zinc-800 hover:text-white transition-all border border-zinc-800/30"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="px-8 pb-10">{children}</div>
      </div>
    </div>
  );
}
