import { useState, useEffect } from 'react'
import { config } from '../config/env'
import type { SeismicEvent, SeverityFilter } from '../types/event'

interface UseEventsResult {
  events: SeismicEvent[]
  loading: boolean
  error: string | null
}

export function useEvents(severity: SeverityFilter): UseEventsResult {
  const [events, setEvents] = useState<SeismicEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchEvents() {
      setLoading(true)
      setError(null)

      try {
        const params = severity ? `?severity=${severity}` : ''
        const response = await fetch(`${config.apiUrl}/api/events${params}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data: SeismicEvent[] = await response.json()
        setEvents(data)
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()

    return () => controller.abort()
  }, [severity])

  return { events, loading, error }
}
