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
      <div className="flex-1 flex items-center justify-center text-slate-400">
        No events match the current filter
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-slate-800 text-slate-400 text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Location</th>
            <th className="px-4 py-3 font-medium">Mag</th>
            <th className="px-4 py-3 font-medium">Severity</th>
            <th className="px-4 py-3 font-medium">Depth</th>
            <th className="px-4 py-3 font-medium">Time</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => {
            const isSelected = selectedEvent?.id === event.id
            return (
              <tr
                key={event.id}
                ref={isSelected ? selectedRef : null}
                onClick={() => onSelectEvent(event)}
                className={`cursor-pointer border-b border-slate-700/50 transition-colors hover:bg-slate-700/50 ${
                  isSelected ? 'bg-slate-700 border-l-3 border-l-blue-500' : ''
                }`}
              >
                <td className="px-4 py-3">
                  {event.tsunami && <span className="mr-1">&#x26A0;</span>}
                  {event.place}
                </td>
                <td className="px-4 py-3 font-mono">{event.magnitude.toFixed(1)}</td>
                <td className="px-4 py-3">
                  <SeverityBadge severity={event.severity} />
                </td>
                <td className="px-4 py-3 font-mono">{event.depth.toFixed(1)} km</td>
                <td className="px-4 py-3 text-slate-400">{formatTime(event.timestamp)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
