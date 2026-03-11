export function LoadingSkeleton() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-black bg-grid text-neutral-50">
      <div className="h-[40vh] md:h-full md:w-[60%] bg-neutral-950 flex items-center justify-center relative overflow-hidden">
        {/* Radar sweep */}
        <div className="relative w-48 h-48">
          {/* Rings */}
          <div className="absolute inset-0 rounded-full border border-neutral-800/40" />
          <div className="absolute inset-6 rounded-full border border-neutral-800/30" />
          <div className="absolute inset-12 rounded-full border border-neutral-800/20" />

          {/* Crosshair */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-neutral-800/30" />
          <div className="absolute left-0 right-0 top-1/2 h-px bg-neutral-800/30" />

          {/* Sweep */}
          <div className="absolute inset-0 rounded-full animate-spin" style={{ animationDuration: '3s' }}>
            <div
              className="absolute top-1/2 left-1/2 w-1/2 h-px origin-left"
              style={{
                background: 'linear-gradient(to right, rgba(34, 211, 238, 0.6), transparent)',
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 origin-top-left w-24 h-24"
              style={{
                background: 'conic-gradient(from 0deg, rgba(34, 211, 238, 0.08), transparent 60deg)',
                transform: 'rotate(-60deg)',
              }}
            />
          </div>

          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
        </div>

        {/* Title below radar */}
        <div className="absolute bottom-16 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm font-display font-bold tracking-[0.2em] uppercase text-neutral-400">Sentinel</span>
          </div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-700">Initializing systems</p>
        </div>
      </div>

      <div className="flex-1 md:w-[40%] flex flex-col border-t md:border-t-0 md:border-l border-neutral-800">
        {/* Header skeleton */}
        <div className="px-5 py-4 border-b border-neutral-800 shrink-0">
          <div className="h-3 w-24 bg-neutral-800/40 rounded-sm" />
        </div>

        {/* Filter skeleton */}
        <div className="px-5 py-3 border-b border-neutral-800/60 shrink-0">
          <div className="h-2 w-12 bg-neutral-800/30 rounded-sm mb-2.5" />
          <div className="flex gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-5 w-16 bg-neutral-800/30 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Event list skeleton */}
        <div className="flex-1 px-5 py-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2.5 border-b border-neutral-800/20"
            >
              <div className="flex-1 space-y-1.5">
                <div
                  className="h-2.5 bg-neutral-800/30 rounded-sm animate-pulse"
                  style={{ width: `${65 + (i * 7) % 30}%`, animationDelay: `${i * 80}ms` }}
                />
                <div
                  className="h-2 w-20 bg-neutral-800/20 rounded-sm animate-pulse"
                  style={{ animationDelay: `${i * 80 + 40}ms` }}
                />
              </div>
              <div
                className="h-5 w-10 bg-neutral-800/20 rounded-sm animate-pulse"
                style={{ animationDelay: `${i * 80 + 80}ms` }}
              />
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="px-5 py-2 shrink-0">
          <div className="h-px bg-neutral-800" />
        </div>

        {/* Detail skeleton */}
        <div className="flex-1 p-5">
          <div className="h-2 w-20 bg-neutral-800/30 rounded-sm mb-4" />
          <div className="relative flex-1 bg-neutral-950/60 h-48 flex items-center justify-center">
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-neutral-800/30" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-neutral-800/30" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-neutral-800/30" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-neutral-800/30" />
            <div className="h-2 w-32 bg-neutral-800/20 rounded-sm animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
