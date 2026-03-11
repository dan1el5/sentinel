import { useEffect, useRef } from 'react'
import type { SeismicEvent } from '../types/event'
import { SeverityBadge } from './ui/SeverityBadge'

interface EventTableProps {
  events: SeismicEvent[]
  selectedEvent: SeismicEvent | null
  onSelectEvent: (event: SeismicEvent) => void
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function EventTable({ events, selectedEvent, onSelectEvent }: EventTableProps) {
  const selectedRef = useRef<HTMLTableRowElement>(null)

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selectedEvent])

  if (events.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-neutral-500 text-sm">
        No events match the current filter
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <table className="w-full text-xs">
        <thead className="sticky top-0 bg-neutral-900/90 backdrop-blur-sm text-neutral-500 text-left uppercase tracking-wider">
          <tr>
            <th className="px-4 py-2.5 font-medium">Location</th>
            <th className="px-3 py-2.5 font-medium">Mag</th>
            <th className="px-3 py-2.5 font-medium">Severity</th>
            <th className="px-3 py-2.5 font-medium">Depth</th>
            <th className="px-3 py-2.5 font-medium">Time</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {events.map((event) => {
            const isSelected = selectedEvent?.id === event.id
            return (
              <tr
                key={event.id}
                ref={isSelected ? selectedRef : null}
                onClick={() => onSelectEvent(event)}
                className={`cursor-pointer border-b border-neutral-800/40 transition-all duration-150 ease-out
                  ${isSelected
                    ? 'bg-cyan-950/40 border-l-2 border-l-cyan-400 shadow-[inset_2px_0_12px_-4px_rgba(34,211,238,0.15)]'
                    : 'hover:bg-neutral-800/60'
                  }
                `}
              >
                <td className="px-4 py-2.5 truncate max-w-[200px]">
                  {event.tsunami && <span className="mr-1 text-amber-400">&#x26A0;</span>}
                  {event.place}
                </td>
                <td className="px-3 py-2.5 font-mono text-neutral-300">{event.magnitude.toFixed(1)}</td>
                <td className="px-3 py-2.5">
                  <SeverityBadge severity={event.severity} />
                </td>
                <td className="px-3 py-2.5 font-mono text-neutral-300">{event.depth.toFixed(1)} km</td>
                <td className="px-3 py-2.5 text-neutral-500">{formatTime(event.timestamp)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
