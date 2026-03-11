export function LoadingSkeleton() {
  return (
    <div className="flex h-screen bg-slate-900">
      <div className="w-[60%] h-full bg-slate-800 animate-pulse" />
      <div className="w-[40%] h-full p-6 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 bg-slate-800 rounded animate-pulse" />
        ))}
      </div>
    </div>
  )
}
