export function LoadingSkeleton() {
  return (
    <div className="flex h-screen bg-black bg-grid">
      <div className="w-[60%] h-full bg-neutral-900 flex items-center justify-center">
        <span className="text-neutral-800 text-2xl tracking-[0.3em] uppercase font-semibold">
          Sentinel
        </span>
      </div>
      <div className="w-[40%] h-full p-6 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-10 bg-neutral-900 rounded animate-pulse"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  )
}
