import type { SeismicEvent } from '../types/event'
import { SeverityBadge } from './ui/SeverityBadge'

const severityBorderColor: Record<string, string> = {
  critical: 'border-l-red-500',
  high: 'border-l-orange-500',
  medium: 'border-l-yellow-500',
  low: 'border-l-emerald-500',
}

interface EventDetailProps {
  event: SeismicEvent | null
  onClose: () => void
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString()
}

export function EventDetail({ event, onClose }: EventDetailProps) {
  return (
    <div
      className={`border-t border-neutral-800 overflow-hidden transition-all duration-300 ease-out ${
        event ? 'max-h-80' : 'max-h-12'
      }`}
    >
      {!event ? (
        <div className="px-4 py-3 text-center text-neutral-600 text-xs">
          Select an event to view details
        </div>
      ) : (
        <div className={`border-l-4 ${severityBorderColor[event.severity]} bg-neutral-900/95 backdrop-blur-md p-4 space-y-3`}>
          <div className="flex items-start justify-between">
            <h3 className="text-neutral-50 font-semibold text-sm pr-4 leading-snug">{event.place}</h3>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-50 hover:bg-neutral-700 rounded-full w-6 h-6 flex items-center justify-center transition-all duration-150 text-sm leading-none shrink-0"
            >
              &#x2715;
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-neutral-800/50 rounded-lg p-3">
            <div>
              <p className="text-neutral-500 text-xs">Magnitude</p>
              <p className="text-neutral-50 font-mono text-sm">{event.magnitude.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-neutral-500 text-xs">Severity</p>
              <div className="mt-0.5"><SeverityBadge severity={event.severity} /></div>
            </div>
            <div>
              <p className="text-neutral-500 text-xs">Depth</p>
              <p className="text-neutral-50 font-mono text-sm">{event.depth.toFixed(1)} km</p>
            </div>
            <div>
              <p className="text-neutral-500 text-xs">Time</p>
              <p className="text-neutral-50 text-sm">{formatTime(event.timestamp)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-neutral-500 text-xs">Coordinates</p>
              <p className="text-neutral-50 font-mono text-sm">{event.lat.toFixed(4)}, {event.lng.toFixed(4)}</p>
            </div>
          </div>

          {event.tsunami && (
            <div className="bg-amber-500/10 text-amber-400 px-3 py-2 rounded text-xs font-medium">
              <span className="animate-pulse">&#x26A0;</span> Tsunami alert issued for this event
            </div>
          )}

          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-cyan-400 hover:text-cyan-300 text-xs transition-colors duration-150"
          >
            View on USGS &#x2192;
          </a>
        </div>
      )}
    </div>
  )
}
