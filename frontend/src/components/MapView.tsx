import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import type { SeismicEvent } from '../types/event'
import { SeverityBadge } from './ui/SeverityBadge'

const severityColorHex: Record<string, string> = {
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#ca8a04',
  low: '#16a34a',
}

interface MapViewProps {
  events: SeismicEvent[]
  selectedEvent: SeismicEvent | null
  onSelectEvent: (event: SeismicEvent) => void
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString()
}

export function MapView({ events, selectedEvent, onSelectEvent }: MapViewProps) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {events.map((event) => {
        const isSelected = selectedEvent?.id === event.id
        return (
          <CircleMarker
            key={event.id}
            center={[event.lat, event.lng]}
            radius={isSelected ? 12 : 6}
            pathOptions={{
              color: isSelected ? '#ffffff' : severityColorHex[event.severity],
              weight: isSelected ? 2 : 1,
              fillColor: severityColorHex[event.severity],
              fillOpacity: 0.8,
            }}
            eventHandlers={{ click: () => onSelectEvent(event) }}
          >
            <Popup>
              <div className="text-sm space-y-1">
                <p className="font-medium text-slate-900">{event.place}</p>
                <p>Magnitude: {event.magnitude}</p>
                <SeverityBadge severity={event.severity} />
                <p className="text-xs text-slate-500">{formatTime(event.timestamp)}</p>
              </div>
            </Popup>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
