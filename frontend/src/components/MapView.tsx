import { useRef, useEffect } from 'react'
import Map, { Marker, type MapRef } from 'react-map-gl/mapbox'
import { config } from '../config/env'
import type { SeismicEvent } from '../types/event'

const severityColorHex: Record<SeismicEvent['severity'], string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#10b981',
}

interface MapViewProps {
  events: SeismicEvent[]
  selectedEvent: SeismicEvent | null
  onSelectEvent: (event: SeismicEvent) => void
}

const defaultZoom = typeof window !== 'undefined' && window.innerWidth < 768 ? 0.8 : 1.8

export function MapView({ events, selectedEvent, onSelectEvent }: MapViewProps) {
  const mapRef = useRef<MapRef>(null)

  if (!config.mapboxToken) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-neutral-950">
        <p className="font-mono text-lg text-neutral-500">Map unavailable</p>
        <p className="font-mono text-sm text-neutral-600">Mapbox token not configured</p>
      </div>
    )
  }

  useEffect(() => {
    if (!mapRef.current) return
    if (selectedEvent) {
      mapRef.current.flyTo({
        center: [selectedEvent.lng, selectedEvent.lat],
        zoom: 5,
        duration: 1800,
        essential: true,
      })
    } else {
      mapRef.current.flyTo({
        center: [0, 20],
        zoom: defaultZoom,
        duration: 1800,
        essential: true,
      })
    }
  }, [selectedEvent])

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={config.mapboxToken}
      initialViewState={{
        longitude: 0,
        latitude: 20,
        zoom: defaultZoom,
      }}
      projection={{ name: 'globe' }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      style={{ width: '100%', height: '100%' }}
      fog={{
        color: 'rgb(10, 10, 15)',
        'high-color': 'rgb(20, 20, 30)',
        'horizon-blend': 0.08,
        'space-color': 'rgb(5, 5, 10)',
        'star-intensity': 0.4,
      }}
    >
      {events.map((event) => {
        const isSelected = selectedEvent?.id === event.id
        return (
          <Marker
            key={event.id}
            longitude={event.lng}
            latitude={event.lat}
            onClick={(e) => {
              e.originalEvent.stopPropagation()
              onSelectEvent(event)
            }}
          >
            <div
              className={`rounded-full cursor-pointer transition-all duration-300 ease-out
                ${isSelected
                  ? 'w-5 h-5 border-2 border-white'
                  : 'w-3 h-3 border border-transparent hover:scale-150'
                }
                ${event.severity === 'critical' && !isSelected ? 'animate-pulse' : ''}
              `}
              style={{
                backgroundColor: severityColorHex[event.severity],
                boxShadow: isSelected
                  ? `0 0 16px ${severityColorHex[event.severity]}, 0 0 8px rgba(255,255,255,0.3)`
                  : `0 0 6px ${severityColorHex[event.severity]}80`,
              }}
            />
          </Marker>
        )
      })}
    </Map>
  )
}
