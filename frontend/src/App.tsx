import { useState } from 'react'
import type { SeismicEvent, SeverityFilter } from './types/event'
import { useEventsGQL } from './hooks/useEventsGQL'
import { MapView } from './components/MapView'
import { FilterBar } from './components/FilterBar'
import { EventTable } from './components/EventTable'
import { EventDetail } from './components/EventDetail'
import { LoadingSkeleton } from './components/ui/LoadingSkeleton'
import { ErrorMessage } from './components/ui/ErrorMessage'

function App() {
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>(null)
  const [selectedEvent, setSelectedEvent] = useState<SeismicEvent | null>(null)
  const { events, loading, error } = useEventsGQL(severityFilter)

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorMessage message={error} onRetry={() => setSeverityFilter(severityFilter)} />

  return (
    <div className="flex h-screen bg-black bg-grid text-neutral-50">
      <div className="w-[60%] h-full">
        <MapView
          events={events}
          selectedEvent={selectedEvent}
          onSelectEvent={setSelectedEvent}
        />
      </div>
      <div className="w-[40%] h-full flex flex-col overflow-hidden border-l border-neutral-800">
        <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <h1 className="text-sm font-semibold tracking-[0.2em] uppercase">Sentinel</h1>
          </div>
          <span className="text-xs text-neutral-500 font-mono">{events.length} events</span>
        </div>
        <FilterBar
          events={events}
          activeFilter={severityFilter}
          onFilterChange={setSeverityFilter}
        />
        <EventTable
          events={events}
          selectedEvent={selectedEvent}
          onSelectEvent={setSelectedEvent}
        />
        <EventDetail
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      </div>
    </div>
  )
}

export default App
