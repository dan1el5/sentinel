import type { SeismicEvent } from '../types/event'
import { SeverityBadge } from './ui/SeverityBadge'

const severityBorderColor: Record<string, string> = {
  critical: 'border-l-red-600',
  high: 'border-l-orange-500',
  medium: 'border-l-yellow-500',
  low: 'border-l-green-500',
}

interface EventDetailProps {
  event: SeismicEvent | null
  onClose: () => void
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString()
}

export function EventDetail({ event, onClose }: EventDetailProps) {
  if (!event) return null

  return (
    <div className={`border-t border-slate-700 border-l-4 ${severityBorderColor[event.severity]} bg-slate-800 p-4 space-y-3`}>
      <div className="flex items-start justify-between">
        <h3 className="text-slate-50 font-semibold pr-4">{event.place}</h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-50 transition-colors text-lg leading-none"
        >
          &#x2715;
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-slate-400">Magnitude</p>
          <p className="text-slate-50 font-mono">{event.magnitude.toFixed(1)}</p>
        </div>
        <div>
          <p className="text-slate-400">Severity</p>
          <SeverityBadge severity={event.severity} />
        </div>
        <div>
          <p className="text-slate-400">Depth</p>
          <p className="text-slate-50 font-mono">{event.depth.toFixed(1)} km</p>
        </div>
        <div>
          <p className="text-slate-400">Time</p>
          <p className="text-slate-50">{formatTime(event.timestamp)}</p>
        </div>
        <div className="col-span-2">
          <p className="text-slate-400">Coordinates</p>
          <p className="text-slate-50 font-mono">{event.lat.toFixed(4)}, {event.lng.toFixed(4)}</p>
        </div>
      </div>

      {event.tsunami && (
        <div className="bg-amber-500/15 text-amber-400 px-3 py-2 rounded text-sm font-medium">
          &#x26A0; Tsunami alert issued for this event
        </div>
      )}

      <a
        href={event.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-blue-400 hover:text-blue-300 text-sm transition-colors"
      >
        View on USGS &#x2192;
      </a>
    </div>
  )
}
