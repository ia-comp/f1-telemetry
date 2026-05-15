import { create } from "zustand"

const API_URL = "http://localhost:8000/api"

type SessionType = "practice" | "qualifying" | "race"

export interface Event {
  name: string
  round: number
}
 
interface SessionState {
  year:         number
  eventId:      string
  sessionType:  SessionType
  loading:      boolean
  yearSchedule: Event[]
  error:        string | null
 
  setYear:           (year: number) => void
  setEventId:        (id: string) => void
  setSessionType:    (type: SessionType) => void
  setLoading:        (loading: boolean) => void
  handleYearChange:  (selectedYear: number) => Promise<void>
  reset:             () => void
}
 
const defaults = {
  year:         0,
  eventId:      '',
  sessionType:  'race' as SessionType,
  loading:      false,
  yearSchedule: [] as Event[],
  error:        null,
}
 
const useSessionStore = create<SessionState>()((set) => ({
  ...defaults,
 
  setYear:        (year)        => set({ year }),
  setEventId:     (eventId)     => set({ eventId }),
  setSessionType: (sessionType) => set({ sessionType }),
  setLoading:     (loading)     => set({ loading }),
 
  handleYearChange: async (selectedYear) => {
    set({ ...defaults, year: selectedYear, loading: true })
    try {
      const response = await fetch(`${API_URL}/session_results/${selectedYear}`)
      if (!response.ok) throw new Error('Failed to fetch year schedule')
      const data: Event[] = await response.json()
      set({ yearSchedule: data, error: null })
    } catch (e) {
      set({ error: (e as Error).message, yearSchedule: [] })
    } finally {
      set({ loading: false })
    }
  },
 
  reset: () => set(defaults),
}))

export {
  useSessionStore,
  SessionType
}