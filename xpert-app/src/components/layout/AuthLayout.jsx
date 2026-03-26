export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-secondary)] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <svg className="h-12 w-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8L24 25L12 42" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M36 8L24 25L36 42" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">XPERT</h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">AI-Powered Prompt Platform</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
          <div className="mb-6 h-1 rounded-full bg-gradient-to-r from-primary-500 to-emerald-400" />
          {children}
        </div>
      </div>
    </div>
  );
}
