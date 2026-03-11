import type { SeismicEvent } from '../types/event'
import { SeverityBadge } from './ui/SeverityBadge'

const severityAccent: Record<string, string> = {
  critical: 'border-l-red-500',
  high: 'border-l-orange-500',
  medium: 'border-l-yellow-500',
  low: 'border-l-emerald-500',
}

const severityBarColor: Record<string, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-emerald-500',
}

interface EventDetailProps {
  event: SeismicEvent | null
  events: SeismicEvent[]
  onClose: () => void
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString()
}

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function depthClass(depth: number): { label: string; color: string } {
  if (depth < 70) return { label: 'Shallow', color: 'text-emerald-400' }
  if (depth < 300) return { label: 'Intermediate', color: 'text-yellow-400' }
  return { label: 'Deep', color: 'text-red-400' }
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function EventDetail({ event, events, onClose }: EventDetailProps) {
  if (!event) {
    return (
      <div className="h-full flex flex-col p-5">
        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium mb-4">Event Detail</p>
        <div className="flex-1 flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-neutral-900/60 rounded-lg p-3 h-[68px]">
                <div className="h-2 w-12 bg-neutral-800 rounded animate-pulse mb-2.5" style={{ animationDelay: `${i * 100}ms` }} />
                <div className="h-5 w-10 bg-neutral-800 rounded animate-pulse" style={{ animationDelay: `${i * 100 + 50}ms` }} />
              </div>
            ))}
          </div>
          <div className="bg-neutral-900/60 rounded-lg p-3 h-10">
            <div className="h-2 w-full bg-neutral-800 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-neutral-900/60 rounded-lg p-3 h-14">
                <div className="h-2 w-14 bg-neutral-800 rounded animate-pulse mb-2" style={{ animationDelay: `${i * 80 + 200}ms` }} />
                <div className="h-3 w-20 bg-neutral-800 rounded animate-pulse" style={{ animationDelay: `${i * 80 + 250}ms` }} />
              </div>
            ))}
          </div>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-neutral-600 text-xs">Select an event to view details</p>
          </div>
        </div>
      </div>
    )
  }

  const magPercent = Math.min((event.magnitude / 10) * 100, 100)
  const magnitudes = events.map((e) => e.magnitude).sort((a, b) => a - b)
  const rank = magnitudes.filter((m) => m <= event.magnitude).length
  const percentile = Math.round((rank / magnitudes.length) * 100)
  const depth = depthClass(event.depth)
  const nearbyCount = events.filter(
    (e) => e.id !== event.id && haversineDistance(event.lat, event.lng, e.lat, e.lng) < 500,
  ).length
  const strongerCount = events.filter((e) => e.magnitude > event.magnitude).length

  return (
    <div className={`h-full flex flex-col p-5 border-l-4 ${severityAccent[event.severity]}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">Event Detail</p>
        <button
          onClick={onClose}
          className="text-neutral-500 hover:text-neutral-50 hover:bg-neutral-800 rounded-full w-6 h-6 flex items-center justify-center transition-all duration-150 text-xs"
        >
          &#x2715;
        </button>
      </div>

      <h3 className="text-neutral-50 font-semibold text-sm leading-snug mb-1">{event.place}</h3>
      <p className="text-[10px] text-neutral-500 mb-4">{timeAgo(event.timestamp)}</p>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="bg-neutral-900/80 rounded-lg px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Magnitude</p>
          <p className="text-neutral-50 font-mono text-xl font-semibold">{event.magnitude.toFixed(1)}</p>
        </div>
        <div className="bg-neutral-900/80 rounded-lg px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Depth</p>
          <p className="text-neutral-50 font-mono text-xl font-semibold">{event.depth.toFixed(1)}<span className="text-[10px] text-neutral-500 ml-1">km</span></p>
        </div>
        <div className="bg-neutral-900/80 rounded-lg px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Severity</p>
          <div className="mt-1.5"><SeverityBadge severity={event.severity} /></div>
        </div>
      </div>

      <div className="bg-neutral-900/80 rounded-lg px-3 py-2.5 mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[10px] uppercase tracking-wider text-neutral-500">Magnitude Scale</p>
          <p className="text-[10px] text-neutral-500">Top {100 - percentile}% of events</p>
        </div>
        <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${severityBarColor[event.severity]}`}
            style={{ width: `${magPercent}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-neutral-600">0</span>
          <span className="text-[9px] text-neutral-600">10</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-neutral-900/80 rounded-lg px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Depth Class</p>
          <p className={`text-xs font-medium ${depth.color}`}>{depth.label}</p>
          <p className="text-[10px] text-neutral-600 mt-0.5">
            {event.depth < 70 ? '< 70 km' : event.depth < 300 ? '70–300 km' : '> 300 km'}
          </p>
        </div>
        <div className="bg-neutral-900/80 rounded-lg px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Nearby Events</p>
          <p className="text-neutral-50 font-mono text-sm font-semibold">{nearbyCount}</p>
          <p className="text-[10px] text-neutral-600 mt-0.5">within 500 km</p>
        </div>
        <div className="bg-neutral-900/80 rounded-lg px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Coordinates</p>
          <p className="text-neutral-300 font-mono text-xs">{event.lat.toFixed(4)}, {event.lng.toFixed(4)}</p>
        </div>
        <div className="bg-neutral-900/80 rounded-lg px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Ranking</p>
          <p className="text-neutral-300 text-xs">{strongerCount === 0 ? 'Strongest event' : `${strongerCount} stronger`}</p>
        </div>
      </div>

      {event.tsunami && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-2.5 rounded-lg text-xs font-medium mb-3">
          <span className="animate-pulse">&#x26A0;</span> Tsunami alert issued for this event
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-neutral-900/80 rounded-lg px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Time (UTC)</p>
          <p className="text-neutral-300 text-xs">{formatTime(event.timestamp)}</p>
        </div>
        <div className="bg-neutral-900/80 rounded-lg px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Tsunami Risk</p>
          <p className={`text-xs font-medium ${event.tsunami ? 'text-amber-400' : 'text-neutral-500'}`}>
            {event.tsunami ? 'Alert Issued' : 'None'}
          </p>
        </div>
      </div>

      <div className="mt-auto">
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 text-xs transition-colors duration-150"
        >
          View on USGS &#x2192;
        </a>
      </div>
    </div>
  )
}
