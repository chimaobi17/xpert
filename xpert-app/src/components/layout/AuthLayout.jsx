export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 relative overflow-hidden">
      {/* Environmental Glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[480px] z-10">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 flex items-center justify-center group">
            <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800/50 group-hover:border-primary-500/30 transition-all duration-500 shadow-2xl">
              <svg className="h-16 w-16 group-hover:scale-110 transition-transform duration-500" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8L24 25L12 42" stroke="#21c45d" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M36 8L24 25L36 42" stroke="#21c45d" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2 italic">XPERT</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Elite Neural Command Platform</p>
        </div>

        <div className="rounded-[2.5rem] border border-zinc-800/80 bg-zinc-950/40 p-10 lg:p-12 shadow-2xl glass relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 to-emerald-400 shadow-[0_0_15px_rgba(33,196,93,0.3)]" />
          {children}
        </div>
        
        <div className="mt-12 text-center">
           <p className="text-zinc-600 text-xs font-medium tracking-tight">VERSION 2.1 — DEPLOYED TO EDGE</p>
        </div>
      </div>
    </div>
  );
}
