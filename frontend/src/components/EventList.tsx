import { useCallback, useEffect, useRef, useState } from 'react'
import type { SeismicEvent, SeverityFilter } from '../types/event'
import { SeverityBadge } from './ui/SeverityBadge'

const severities: Array<'critical' | 'high' | 'medium' | 'low'> = [
  'critical',
  'high',
  'medium',
  'low',
]

const severityStyles: Record<string, { active: string; inactive: string }> = {
  critical: {
    active: 'bg-red-500 text-white border border-transparent shadow-[0_0_12px_rgba(239,68,68,0.4)]',
    inactive: 'bg-neutral-800/80 text-red-400 border border-neutral-700/50 hover:bg-red-500/10 hover:border-red-500/30',
  },
  high: {
    active: 'bg-orange-500 text-white border border-transparent shadow-[0_0_12px_rgba(249,115,22,0.4)]',
    inactive: 'bg-neutral-800/80 text-orange-400 border border-neutral-700/50 hover:bg-orange-500/10 hover:border-orange-500/30',
  },
  medium: {
    active: 'bg-yellow-500 text-white border border-transparent shadow-[0_0_12px_rgba(234,179,8,0.4)]',
    inactive: 'bg-neutral-800/80 text-yellow-400 border border-neutral-700/50 hover:bg-yellow-500/10 hover:border-yellow-500/30',
  },
  low: {
    active: 'bg-emerald-500 text-white border border-transparent shadow-[0_0_12px_rgba(16,185,129,0.4)]',
    inactive: 'bg-neutral-800/80 text-emerald-400 border border-neutral-700/50 hover:bg-emerald-500/10 hover:border-emerald-500/30',
  },
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface EventListProps {
  events: SeismicEvent[]
  allEvents: SeismicEvent[]
  selectedEvent: SeismicEvent | null
  onSelectEvent: (event: SeismicEvent) => void
  activeFilter: SeverityFilter
  onFilterChange: (filter: SeverityFilter) => void
  onScrollProgress?: (progress: number) => void
}

export function EventList({ events, allEvents, selectedEvent, onSelectEvent, activeFilter, onFilterChange, onScrollProgress }: EventListProps) {
  const selectedRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el || !onScrollProgress) return
    const progress = el.scrollHeight <= el.clientHeight
      ? 1
      : el.scrollTop / (el.scrollHeight - el.clientHeight)
    onScrollProgress(progress)
  }, [onScrollProgress])

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selectedEvent])

  useEffect(() => {
    const el = scrollRef.current
    if (el) {
      el.scrollTop = 0
    }
    onScrollProgress?.(0)
  }, [activeFilter, onScrollProgress])

  const counts = severities.reduce(
    (acc, s) => {
      acc[s] = allEvents.filter((e) => e.severity === s).length
      return acc
    },
    {} as Record<string, number>,
  )

  const tsunamiCount = allEvents.filter((e) => e.tsunami).length

  return (
    <>
      <div className="px-5 py-3 border-b border-neutral-800/60">
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">Events</p>
          {tsunamiCount > 0 && (
            <p className="text-amber-400 text-[10px] font-medium">
              <span className="animate-pulse">&#x26A0;</span> {tsunamiCount} tsunami alert{tsunamiCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onFilterChange(null)}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium transition-all duration-200 ease-out active:scale-95 hover:scale-105 focus:outline-none ${
              activeFilter === null
                ? 'bg-neutral-50 text-black border border-transparent shadow-[0_0_12px_rgba(255,255,255,0.15)]'
                : 'bg-neutral-800/80 text-neutral-400 border border-neutral-700/50 hover:bg-neutral-700/80 hover:text-neutral-300'
            }`}
          >
            All
          </button>
          {severities.map((s) => (
            <button
              key={s}
              onClick={() => onFilterChange(activeFilter === s ? null : s)}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium capitalize transition-all duration-200 ease-out active:scale-95 hover:scale-105 focus:outline-none ${
                activeFilter === s ? severityStyles[s].active : severityStyles[s].inactive
              }`}
            >
              {s} ({counts[s]})
            </button>
          ))}
        </div>
      </div>

      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto hide-scrollbar relative">
        {events.length === 0 ? (
          <div className="h-full flex items-center justify-center text-neutral-500 text-xs">
            No events match the current filter
          </div>
        ) : (
          <div className="divide-y divide-neutral-800/40">
            {events.map((event) => {
              const isSelected = selectedEvent?.id === event.id
              return (
                <div
                  key={event.id}
                  ref={isSelected ? selectedRef : null}
                  onClick={() => onSelectEvent(event)}
                  className={`group px-5 py-2.5 cursor-pointer transition-all duration-200 ease-out flex items-center gap-3
                    ${isSelected
                      ? 'bg-cyan-950/40 border-l-2 border-l-cyan-400 shadow-[inset_2px_0_12px_-4px_rgba(34,211,238,0.15)]'
                      : 'border-l-2 border-l-transparent hover:bg-neutral-800/60 hover:pl-6'
                    }
                  `}
                >
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs truncate transition-colors duration-200 ${isSelected ? 'text-neutral-100' : 'text-neutral-200 group-hover:text-neutral-50'}`}>
                      {event.tsunami && <span className="mr-1 text-amber-400">&#x26A0;</span>}
                      {event.place}
                    </p>
                    <p className="text-[10px] text-neutral-500 mt-0.5">{formatTime(event.timestamp)}</p>
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-2.5">
                    <span className={`text-xs font-mono transition-colors duration-200 ${isSelected ? 'text-neutral-100' : 'text-neutral-300 group-hover:text-neutral-100'}`}>{event.magnitude.toFixed(1)}</span>
                    <SeverityBadge severity={event.severity} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
        <div className="sticky bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </div>
    </>
  )
}
