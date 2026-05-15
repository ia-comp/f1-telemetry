import { create } from "zustand"

type SessionType = "practice" | "qualifying" | "race"

interface SessionState {
  year: number
  eventId: string
  sessionType: SessionType
  loading: boolean

  setYear: (year: number) => void
  setEventId: (id: string) => void
  setSessionType: (type: SessionType) => void
  setLoading: (load: boolean) => void
  reset: () => void
}

const defaults = {
  year: 2025,
  eventId: "",
  sessionType: "race" as SessionType,
  loading: false
}

const useSessionStore = create<SessionState>()(set => ({
  ...defaults,

  setYear: (year) => set({ year }),
  setEventId: (eventId) => set({ eventId }),
  setSessionType: (sessionType) => set({ sessionType }),
  setLoading: (loading) => set({ loading }),
  reset: () => set(defaults),
}));

export {
  useSessionStore,
  SessionType
}