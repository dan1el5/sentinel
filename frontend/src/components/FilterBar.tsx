import type { SeismicEvent, SeverityFilter } from '../types/event'

const severities: Array<'critical' | 'high' | 'medium' | 'low'> = [
  'critical',
  'high',
  'medium',
  'low',
]

const severityStyles: Record<string, { active: string; inactive: string }> = {
  critical: {
    active: 'bg-red-500 text-white shadow-[0_0_8px_rgba(239,68,68,0.3)]',
    inactive: 'bg-neutral-800/80 text-red-400 border border-neutral-700/50 hover:bg-neutral-800',
  },
  high: {
    active: 'bg-orange-500 text-white shadow-[0_0_8px_rgba(249,115,22,0.3)]',
    inactive: 'bg-neutral-800/80 text-orange-400 border border-neutral-700/50 hover:bg-neutral-800',
  },
  medium: {
    active: 'bg-yellow-500 text-white shadow-[0_0_8px_rgba(234,179,8,0.3)]',
    inactive: 'bg-neutral-800/80 text-yellow-400 border border-neutral-700/50 hover:bg-neutral-800',
  },
  low: {
    active: 'bg-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.3)]',
    inactive: 'bg-neutral-800/80 text-emerald-400 border border-neutral-700/50 hover:bg-neutral-800',
  },
}

interface FilterBarProps {
  events: SeismicEvent[]
  activeFilter: SeverityFilter
  onFilterChange: (filter: SeverityFilter) => void
}

export function FilterBar({ events, activeFilter, onFilterChange }: FilterBarProps) {
  const counts = severities.reduce(
    (acc, s) => {
      acc[s] = events.filter((e) => e.severity === s).length
      return acc
    },
    {} as Record<string, number>,
  )

  const tsunamiCount = events.filter((e) => e.tsunami).length

  return (
    <div className="px-4 py-3 border-b border-neutral-800">
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => onFilterChange(null)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 active:scale-95 ${
            activeFilter === null
              ? 'bg-neutral-50 text-black'
              : 'bg-neutral-800/80 text-neutral-400 border border-neutral-700/50 hover:bg-neutral-800'
          }`}
        >
          All ({events.length})
        </button>
        {severities.map((s) => (
          <button
            key={s}
            onClick={() => onFilterChange(activeFilter === s ? null : s)}
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all duration-150 active:scale-95 ${
              activeFilter === s ? severityStyles[s].active : severityStyles[s].inactive
            }`}
          >
            {s} ({counts[s]})
          </button>
        ))}
      </div>
      {tsunamiCount > 0 && (
        <p className="text-amber-400 text-xs font-medium mt-2">
          <span className="animate-pulse">&#x26A0;</span> {tsunamiCount} tsunami alert{tsunamiCount > 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}
