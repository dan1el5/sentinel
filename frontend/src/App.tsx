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
    <div className="flex h-screen bg-slate-900 text-slate-50">
      <div className="w-[60%] h-full">
        <MapView
          events={events}
          selectedEvent={selectedEvent}
          onSelectEvent={setSelectedEvent}
        />
      </div>
      <div className="w-[40%] h-full flex flex-col overflow-hidden border-l border-slate-700">
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
