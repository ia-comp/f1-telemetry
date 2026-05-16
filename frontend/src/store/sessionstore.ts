import { create } from "zustand"

const API_URL = "http://localhost:8000/api"

type SessionType = "practice" | "qualifying" | "race"

interface Event {
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
  setEventId:        (eventId: string) => void
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
 
const useSessionStore = create<SessionState>()((set, get) => ({
  ...defaults,
 
  setYear:        (year)        => set({ year }),
  setEventId:     (eventId)     => set({ eventId }),
  setSessionType: (sessionType) => set({ sessionType }),
  setLoading:     (loading)     => set({ loading }),
  reset:          ()            => set(defaults),

  handleYearChange: async (selectedYear: number) => {
    const sanitizedYear = Math.floor(Number(selectedYear));
    if (isNaN(sanitizedYear) || sanitizedYear <= 0) {
      set({ error: "Invalid year selected", yearSchedule: [] });
      return;
    }
    get().reset(); 
    get().setYear(selectedYear);
    get().setLoading(true);

    try {
      const response = await fetch(`${API_URL}/session_results/${get().year}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to fetch schedule`);
      }
      // 2. Set the data and clear error
      const data: Event[] = await response.json();
      set({ yearSchedule: data, error: null });
    } catch (e) {
      set({ error: (e as Error).message, yearSchedule: [] });
    } finally {
      get().setLoading(false);
    }
  },
 
}));

export {
  useSessionStore,
  SessionType,
  Event
}