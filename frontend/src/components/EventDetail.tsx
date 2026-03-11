import type { SeismicEvent } from '../types/event'

const severityColor: Record<string, string> = {
  critical: 'text-red-500',
  high: 'text-orange-500',
  medium: 'text-yellow-500',
  low: 'text-emerald-500',
}

const severityRing: Record<string, string> = {
  critical: 'ring-red-500/30',
  high: 'ring-orange-500/30',
  medium: 'ring-yellow-500/30',
  low: 'ring-emerald-500/30',
}

const severityBg: Record<string, string> = {
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

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString()
}

function formatEnergy(mag: number): string {
  const logE = 1.5 * mag + 4.8
  const energy = Math.pow(10, logE)
  if (energy >= 1e15) return `${(energy / 1e15).toFixed(1)} PJ`
  if (energy >= 1e12) return `${(energy / 1e12).toFixed(1)} TJ`
  if (energy >= 1e9) return `${(energy / 1e9).toFixed(1)} GJ`
  if (energy >= 1e6) return `${(energy / 1e6).toFixed(1)} MJ`
  return `${(energy / 1e3).toFixed(1)} kJ`
}

function tntEquivalent(mag: number): string {
  const logE = 1.5 * mag + 4.8
  const joules = Math.pow(10, logE)
  const tntJoules = 4.184e9
  const tnt = joules / tntJoules
  if (tnt >= 1e6) return `${(tnt / 1e6).toFixed(1)}M tons TNT`
  if (tnt >= 1e3) return `${(tnt / 1e3).toFixed(1)}k tons TNT`
  if (tnt >= 1) return `${tnt.toFixed(1)} tons TNT`
  if (tnt >= 0.001) return `${(tnt * 1000).toFixed(0)} kg TNT`
  return `${(tnt * 1e6).toFixed(0)} g TNT`
}

function depthLabel(depth: number): { label: string; color: string } {
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
  const depth = event ? depthLabel(event.depth) : null
  const depthPercent = event ? Math.min((event.depth / 700) * 100, 100) : 0

  const nearby = event
    ? events
        .filter((e) => e.id !== event.id)
        .map((e) => ({ ...e, dist: haversineDistance(event.lat, event.lng, e.lat, e.lng) }))
        .filter((e) => e.dist < 500)
        .sort((a, b) => a.dist - b.dist)
    : []

  const strongerCount = event ? events.filter((e) => e.magnitude > event.magnitude).length : 0
  const totalEvents = events.length

  return (
    <div className={`flex flex-col p-5 ${event ? '' : 'h-full'}`}>
      <div className="flex items-center justify-between mb-4 shrink-0">
        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">Event Detail</p>
        <button
          onClick={onClose}
          aria-label="Close event detail"
          className={`text-neutral-500 hover:text-neutral-50 hover:bg-neutral-800 rounded-full w-6 h-6 flex items-center justify-center transition-all duration-200 ease-out text-xs hover:scale-110 hover:rotate-90 active:scale-95 ${event ? 'visible' : 'invisible'}`}
        >
          &#x2715;
        </button>
      </div>

      {!event ? (
        <div className="relative flex-1 bg-neutral-950/60 overflow-hidden flex flex-col items-center justify-center">
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-neutral-700/50" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-neutral-700/50" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-neutral-700/50" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-neutral-700/50" />

          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-neutral-700 mb-3">
            <path d="M2 12 L7 7 L9 9 L12 3 L15 15 L17 11 L19 13 L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <p className="text-neutral-700 text-[10px] font-mono uppercase tracking-widest">Awaiting event selection</p>
        </div>
      ) : (
        <div className="relative bg-neutral-950/60">
          {/* Severity accent bar */}
          <div className={`absolute top-8 bottom-8 left-0 w-0.5 ${severityBg[event.severity]} z-10 pointer-events-none`} />

          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-neutral-700/50 z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-neutral-700/50 z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-neutral-700/50 z-10 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-neutral-700/50 z-10 pointer-events-none" />

          <div className="p-4">
            <div className="flex items-center gap-4 mb-5">
            <div className={`w-14 h-14 rounded-full bg-neutral-900 ring-2 ${severityRing[event.severity]} flex items-center justify-center shrink-0`}>
              <span className={`font-mono text-xl font-bold ${severityColor[event.severity]}`}>{event.magnitude.toFixed(1)}</span>
            </div>
            <div className="min-w-0">
              <h3 className="text-neutral-50 font-semibold text-sm leading-snug">{event.place}</h3>
              <p className="text-[10px] text-neutral-500 mt-0.5">{timeAgo(event.timestamp)} · Rank {strongerCount + 1} of {totalEvents}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-neutral-900/80 rounded-lg px-3 py-3 transition-all duration-200 ease-out hover:bg-neutral-800/80">
              <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2">Depth</p>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-neutral-50 font-mono text-lg font-semibold">{event.depth.toFixed(1)}</span>
                <span className="text-[10px] text-neutral-500">km</span>
                <span className={`text-[10px] font-medium ml-auto ${depth!.color}`}>{depth!.label}</span>
              </div>
              <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${severityBg[event.severity]}`}
                  style={{ width: `${depthPercent}%` }}
                />
              </div>
              <div className="flex justify-between mt-0.5">
                <span className="text-[8px] text-neutral-600">0 km</span>
                <span className="text-[8px] text-neutral-600">700 km</span>
              </div>
            </div>

            <div className="bg-neutral-900/80 rounded-lg px-3 py-3 transition-all duration-200 ease-out hover:bg-neutral-800/80">
              <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2">Energy Released</p>
              <p className="text-neutral-50 font-mono text-lg font-semibold mb-0.5">{formatEnergy(event.magnitude)}</p>
              <p className="text-[10px] text-neutral-500">&#x2248; {tntEquivalent(event.magnitude)}</p>
            </div>

            <div className="bg-neutral-900/80 rounded-lg px-3 py-3 transition-all duration-200 ease-out hover:bg-neutral-800/80">
              <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2">Nearby Activity</p>
              <p className="text-neutral-50 font-mono text-lg font-semibold mb-0.5">{nearby.length}</p>
              {nearby.length > 0 ? (
                <p className="text-[10px] text-neutral-500 truncate">Closest: {nearby[0].place} ({Math.round(nearby[0].dist)} km)</p>
              ) : (
                <p className="text-[10px] text-neutral-500">No events within 500 km</p>
              )}
            </div>

            <div className="bg-neutral-900/80 rounded-lg px-3 py-3 transition-all duration-200 ease-out hover:bg-neutral-800/80">
              <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2">Tsunami Status</p>
              {event.tsunami ? (
                <>
                  <p className="text-amber-400 font-semibold text-sm mb-0.5"><span className="animate-pulse">&#x26A0;</span> Alert Issued</p>
                  <p className="text-[10px] text-neutral-500">Coastal warnings active</p>
                </>
              ) : (
                <>
                  <p className="text-neutral-400 text-sm mb-0.5">None</p>
                  <p className="text-[10px] text-neutral-500">No coastal threat detected</p>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] mb-3">
            <div className="flex justify-between py-1.5 border-b border-neutral-800/60">
              <span className="uppercase tracking-wider text-neutral-500">Coordinates</span>
              <span className="text-neutral-300 font-mono">{event.lat.toFixed(4)}, {event.lng.toFixed(4)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-neutral-800/60">
              <span className="uppercase tracking-wider text-neutral-500">Severity</span>
              <span className={`font-medium capitalize ${severityColor[event.severity]}`}>{event.severity}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-neutral-800/60">
              <span className="uppercase tracking-wider text-neutral-500">Time</span>
              <span className="text-neutral-300">{formatTime(event.timestamp)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-neutral-800/60">
              <span className="uppercase tracking-wider text-neutral-500">Event ID</span>
              <span className="text-neutral-300 font-mono">{event.id}</span>
            </div>
          </div>

          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View event on USGS website"
            className="group/link inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 text-xs transition-colors duration-200"
          >
            View on USGS <span className="inline-block transition-transform duration-200 ease-out group-hover/link:translate-x-1">&#x2192;</span>
          </a>
          </div>
        </div>
      )}
    </div>
  )
}
