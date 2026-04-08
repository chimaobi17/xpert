import { useState, useEffect } from 'react';
import clsx from 'clsx';

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

export default function Avatar({ name, src, size = 'md', className }) {
  const [imgError, setImgError] = useState(false);

  // Reset error state when src changes
  useEffect(() => {
    setImgError(false);
  }, [src]);

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  if (src && !imgError) {
    const VITE_API_URL = import.meta.env.VITE_API_URL || '';
    const finalSrc = src.includes('xpert.test') && VITE_API_URL 
      ? src.replace(/https?:\/\/xpert\.test/, VITE_API_URL) 
      : src;

    return (
      <img
        src={finalSrc}
        alt={name}
        onError={() => setImgError(true)}
        className={clsx('rounded-full object-cover', sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={clsx(
        'inline-flex items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold',
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
