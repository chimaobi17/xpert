import logoFull from '../../assets/logo-full.svg';

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-secondary)] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <img src={logoFull} alt="Xpert" className="h-14 sm:h-20" />
          </div>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Administration Panel</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
          <div className="mb-6 h-1 rounded-full bg-gradient-to-r from-primary-500 to-primary-300" />
          {children}
        </div>
      </div>
    </div>
  );
}
