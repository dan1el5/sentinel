import type { SeismicEvent, SeverityFilter } from '../types/event'

const severities: Array<'critical' | 'high' | 'medium' | 'low'> = [
  'critical',
  'high',
  'medium',
  'low',
]

const severityStyles: Record<string, { active: string; inactive: string }> = {
  critical: {
    active: 'bg-red-600 text-white',
    inactive: 'bg-slate-700 text-red-400 hover:bg-slate-600',
  },
  high: {
    active: 'bg-orange-600 text-white',
    inactive: 'bg-slate-700 text-orange-400 hover:bg-slate-600',
  },
  medium: {
    active: 'bg-yellow-600 text-white',
    inactive: 'bg-slate-700 text-yellow-400 hover:bg-slate-600',
  },
  low: {
    active: 'bg-green-600 text-white',
    inactive: 'bg-slate-700 text-green-400 hover:bg-slate-600',
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
    <div className="p-4 border-b border-slate-700 space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onFilterChange(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeFilter === null
              ? 'bg-slate-50 text-slate-900'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          All ({events.length})
        </button>
        {severities.map((s) => (
          <button
            key={s}
            onClick={() => onFilterChange(activeFilter === s ? null : s)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              activeFilter === s ? severityStyles[s].active : severityStyles[s].inactive
            }`}
          >
            {s} ({counts[s]})
          </button>
        ))}
      </div>
      {tsunamiCount > 0 && (
        <p className="text-amber-400 text-sm font-medium">
          &#x26A0; {tsunamiCount} tsunami alert{tsunamiCount > 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}
