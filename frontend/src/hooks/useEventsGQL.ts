import { useState, useEffect } from 'react'
import { config } from '../config/env'
import type { SeismicEvent, SeverityFilter } from '../types/event'

const EVENTS_QUERY = `
  query GetEvents($severity: String) {
    events(severity: $severity) {
      id
      lat
      lng
      magnitude
      severity
      place
      timestamp
      depth
      tsunami
      url
    }
  }
`

interface UseEventsResult {
  events: SeismicEvent[]
  loading: boolean
  error: string | null
}

export function useEventsGQL(severity: SeverityFilter): UseEventsResult {
  const [events, setEvents] = useState<SeismicEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchEvents() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`${config.apiUrl}/graphql`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: EVENTS_QUERY,
            variables: { severity: severity ?? null },
          }),
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const json = await response.json()

        if (json.errors) {
          throw new Error(json.errors[0].message)
        }

        setEvents(json.data.events)
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
