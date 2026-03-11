import { useState } from 'react'
import type { SeismicEvent, SeverityFilter } from './types/event'
import { useEventsGQL } from './hooks/useEventsGQL'
import { MapView } from './components/MapView'
import { EventList } from './components/EventList'
import { EventDetail } from './components/EventDetail'
import { LoadingSkeleton } from './components/ui/LoadingSkeleton'
import { ErrorMessage } from './components/ui/ErrorMessage'

function App() {
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>(null)
  const [selectedEvent, setSelectedEvent] = useState<SeismicEvent | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const { allEvents, events, loading, error } = useEventsGQL(severityFilter)

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorMessage message={error} onRetry={() => setSeverityFilter(severityFilter)} />

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black bg-grid text-neutral-50" role="main">
      <div className="h-[40vh] md:h-full md:w-[60%] shrink-0" aria-label="Map">
        <MapView
          events={events}
          selectedEvent={selectedEvent}
          onSelectEvent={setSelectedEvent}
        />
      </div>
      <div className="flex-1 md:w-[40%] flex flex-col overflow-hidden border-t md:border-t-0 md:border-l border-neutral-800" aria-label="Event sidebar">
        <div className="px-4 py-3 md:px-5 md:py-4 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <h1 className="text-sm font-display font-bold tracking-[0.2em] uppercase">Sentinel</h1>
          </div>
          <span className="text-xs text-neutral-500 font-mono">{allEvents.length} events</span>
        </div>
        <div className="basis-1/3 md:basis-2/5 shrink-0 flex flex-col min-h-0">
          <EventList
            events={events}
            allEvents={allEvents}
            selectedEvent={selectedEvent}
            onSelectEvent={setSelectedEvent}
            activeFilter={severityFilter}
            onFilterChange={setSeverityFilter}
            onScrollProgress={setScrollProgress}
          />
        </div>
        <div className="px-4 py-2 md:px-5 shrink-0">
          <div className="relative h-px bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-cyan-400/60 rounded-full transition-all duration-150 ease-out"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar">
          <EventDetail
            event={selectedEvent}
            events={allEvents}
            onClose={() => setSelectedEvent(null)}
          />
        </div>
      </div>
    </div>
  )
}

export default App
