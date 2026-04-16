import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { LANGUAGES } from '../../i18n';
import { patch } from '../../lib/apiClient';
import useAuth from '../../hooks/useAuth';

export default function LanguageSelector({ compact = false, className }) {
  const { i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const currentLang = LANGUAGES.find(l => l.code === (i18n.language?.split('-')[0] || 'en')) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Set document dir for RTL languages
  useEffect(() => {
    const lang = LANGUAGES.find(l => l.code === (i18n.language?.split('-')[0] || 'en'));
    document.documentElement.dir = lang?.dir || 'ltr';
    document.documentElement.lang = lang?.code || 'en';
  }, [i18n.language]);

  async function selectLanguage(code) {
    i18n.changeLanguage(code);
    setOpen(false);

    // Persist to backend if logged in
    if (user) {
      try {
        await patch('/user/profile', { language_preference: code });
        updateUser({ language_preference: code });
      } catch {
        // Silently fail — localStorage already has it via i18next
      }
    }
  }

  if (compact) {
    return (
      <div className={clsx('relative', className)} ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="rounded-2xl p-2.5 text-text-secondary hover:text-foreground hover:bg-surface-hover transition-all border-none"
          title="Change Language"
        >
          <GlobeAltIcon className="h-5 w-5" />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute right-0 z-50 mt-2 w-56 max-h-80 overflow-y-auto rounded-2xl border border-border bg-background p-1.5 shadow-2xl animate-fade-in">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => selectLanguage(lang.code)}
                  className={clsx(
                    'flex w-full items-center justify-between px-3 py-2.5 text-sm rounded-xl transition-all',
                    currentLang.code === lang.code
                      ? 'bg-primary-500/10 text-primary-600 font-semibold'
                      : 'text-text-secondary hover:text-foreground hover:bg-surface-hover'
                  )}
                >
                  <span>{lang.nativeName}</span>
                  <span className="text-xs text-text-tertiary">{lang.code.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // Full select dropdown (for Settings page)
  return (
    <select
      className={clsx(
        'block w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 outline-none transition-all',
        className
      )}
      value={currentLang.code}
      onChange={(e) => selectLanguage(e.target.value)}
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.nativeName} — {lang.name}
        </option>
      ))}
    </select>
  );
}
