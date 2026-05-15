import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { useSessionStore, SessionType } from "../store/sessionstore"

const API_URL = "http://localhost:8000/api"

const AVAILABLE_YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018]

interface Event {
  name: string
  round: number
}

const SESSION_OPTIONS: { value: SessionType; label: string }[] = [
  { value: "practice",   label: "Practice"   },
  { value: "qualifying", label: "Qualifying" },
  { value: "race",       label: "Race"       },
]

function HomePage() {
  const navigate = useNavigate()
  const [yearSchedule, setYearSchedule] = useState<Event[]>([])
  const [scheduleLoading, setScheduleLoading] = useState(false)

  const {
    year,
    eventId,
    sessionType,
    setEventId,
    setSessionType,
    handleYearChange,
  } = useSessionStore()

  useEffect(() => {
    if (!year) {
      return
    }
    setScheduleLoading(true)
    fetch(`${API_URL}/session_results/${year}`)
      .then(r => r.json())
      .then((data: Event[]) => setYearSchedule(data))
      .catch(() => setYearSchedule([]))
      .finally(() => setScheduleLoading(false))
  }, [year])


  const canStart = year > 0 && eventId !== "" && sessionType !== ""

  const selectClass =
    "w-full bg-black/30 border border-white/10 text-gray-200 text-sm " +
    "rounded-lg px-3 py-2.5 appearance-none outline-none " +
    "focus:border-white/30 focus:ring-1 focus:ring-white/10 " +
    "hover:border-white/20 transition-colors duration-150 " +
    "placeholder:text-gray-600"

  return (
    <div className="flex h-screen bg-[#080808] overflow-hidden">

      {/* ── Left Side ─────────────────────────────────────────── */}
      <div className="relative flex-1 flex items-center justify-center">
        {/* Ambient blobs */}
        <div className="absolute top-[12%] left-[10%] size-72 bg-[#053f11] blur-[120px] opacity-60 pointer-events-none" />
        <div className="absolute bottom-[15%] right-[10%] size-56 bg-[#f017c8] blur-[110px] opacity-15 pointer-events-none" />

        <div className="flex flex-col gap-5 z-10">
          <h1
            className="text-gray-50 font-black leading-none tracking-tight"
            style={{
              fontSize: "clamp(4rem, 8vw, 7rem)",
              textShadow: "0px 0px 40px #e8000088, 0px 0px 12px #e8000044",
            }}
          >
            RaceEngi
          </h1>
          <p className="text-gray-500 text-lg font-medium tracking-wide">
            Your own F1 pitwall — for free
          </p>
        </div>
      </div>

      {/* ── Divider ───────────────────────────────────────────── */}
      <div className="w-px bg-white/5 my-12" />

      {/* ── Right Side ────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-12">
        <div className="w-full max-w-sm flex flex-col gap-6">

          <p className="text-gray-500 text-xs uppercase tracking-[0.18em] font-semibold">
            Select session
          </p>

          {/* Year */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs tracking-wider uppercase">Year</label>
            <div className="relative">
              <select
                className={selectClass}
                value={year}
                onChange={e => handleYearChange(Number(e.target.value))}
              >
                <option disabled value={0}>Select year</option>
                {AVAILABLE_YEARS.map(yr => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">▾</span>
            </div>
          </div>

          {/* Event */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs tracking-wider uppercase">Grand Prix</label>
            <div className="relative">
              <select
                className={selectClass}
                value={eventId}
                onChange={e => setEventId(e.target.value)}
                disabled={!year || scheduleLoading}
              >
                <option value="" disabled>
                  {scheduleLoading ? "Loading events..." : "Select event"}
                </option>
                {yearSchedule.map(event => (
                  <option key={event.name} value={event.name}>
                    {event.round} — {event.name} Grand Prix
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">▾</span>
            </div>
          </div>

          {/* Session type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs tracking-wider uppercase">Session</label>
            <div className="relative">
              <select
                className={selectClass}
                value={sessionType}
                onChange={e => setSessionType(e.target.value as SessionType)}
              >
                {SESSION_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">▾</span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate("/session_results")}
            disabled={!canStart}
            className="mt-2 w-full py-3 rounded-lg text-sm font-bold tracking-widest uppercase transition-all duration-150
              disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none
              enabled:hover:brightness-110 enabled:active:scale-[0.98]"
            style={{
              background: canStart ? "#e8000d" : "#e8000d",
              color: "#fff",
              boxShadow: canStart ? "0 0 24px #e8000d55, 0 0 6px #e8000d33" : "none",
            }}
          >
            Get started
          </button>

        </div>
      </div>
    </div>
  )
}

export default HomePage