export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 sm:px-6 relative overflow-hidden transition-colors duration-500">
      {/* Environmental Glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none dark:opacity-100 opacity-30" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none dark:opacity-100 opacity-30" />

      <div className="w-full max-w-[480px] z-10">
        <div className="mb-8 sm:mb-12 text-center">
          <div className="mx-auto mb-4 sm:mb-6 flex items-center justify-center group">
            <div className="bg-surface-hover p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-border group-hover:border-primary-500/30 transition-all duration-500 shadow-2xl">
              <svg className="h-10 w-10 sm:h-16 sm:w-16 group-hover:scale-110 transition-transform duration-500" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8L24 25L12 42" stroke="#21c45d" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M36 8L24 25L36 42" stroke="#21c45d" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground tracking-tight mb-2 uppercase">XPERT</h1>
          <p className="text-text-tertiary font-bold uppercase tracking-[0.2em] text-[10px]">Premium AI Management Platform</p>
        </div>

        <div className="rounded-2xl sm:rounded-3xl border border-border bg-surface/40 p-5 sm:p-8 lg:p-10 shadow-xl glass relative overflow-hidden">
          {children}
        </div>
        
        <div className="mt-12 text-center">
           <p className="text-text-tertiary text-xs font-medium tracking-tight uppercase">SESSION READY — EDGE DEPLOYED</p>
        </div>
      </div>
    </div>
  );
}
