export interface SeismicEvent {
  id: string
  lat: number
  lng: number
  magnitude: number
  severity: 'critical' | 'high' | 'medium' | 'low'
  place: string
  timestamp: string
  depth: number
  tsunami: boolean
  url: string
}

export type SeverityFilter = 'critical' | 'high' | 'medium' | 'low' | null
