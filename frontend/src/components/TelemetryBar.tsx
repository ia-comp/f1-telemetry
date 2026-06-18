import React from "react"
import { useSessionStore } from "../store/sessionstore"
import type { SessionType } from "../store/sessionstore"
import Loading from "./Loading"

const AVAILABLE_YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018]

const SESSION_OPTIONS: { value: SessionType; label: string }[] = [
  { value: "practice",   label: "Practice"   },
  { value: "qualifying", label: "Qualifying" },
  { value: "race",       label: "Race"       },
]

type SessionBarProps = {
  loadFunction: () => void;
};

const TelemetryBar = ({loadFunction}: SessionBarProps) => {
  const {
    year,
    eventId,
    sessionType,
    driver,
    loading,
    yearSchedule,
    handleYearChange,
    setEventId,
    setSessionType,
    setDriver,
  } = useSessionStore()

  const canStart = year > 0 && eventId > 0

  return (
    <div className="w-full flex justify-center px-4 py-4">
      <div className="w-full max-w-7xl flex items-center gap-3">

        {/* Year */}
        <div className="flex flex-col gap-1 min-w-22.5">
          <label className="text-gray-500 text-[10px] tracking-widest uppercase">Year</label>
          <select
            className="select"
            value={year}
            onChange={e => handleYearChange(Number(e.target.value))}
          >
            <option value={0} disabled>Year</option>
            {AVAILABLE_YEARS.map(yr => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-white/10 mt-4 shrink-0" />

        {/* Grand Prix */}
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-gray-500 text-[10px] tracking-widest uppercase">Grand Prix</label>
          <select
            className="select"
            value={eventId}
            onChange={e => setEventId(Number(e.target.value))}
            disabled={!year || loading}
          >
            <option value={0} disabled>
              {loading ? "Loading schedule...": "Select event"}
            </option>
            {yearSchedule.map(event => (
              <option key={event.round} value={event.round}>
                Round {event.round} - {event.name} Grand Prix
              </option>
            ))}
          </select>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-white/10 mt-4 shrink-0" />

        {/* Session */}
        <div className="flex flex-col gap-1 min-w-32.5">
          <label className="text-gray-500 text-[10px] tracking-widest uppercase">Session</label>
          <select
            className="select"
            value={sessionType}
            onChange={e => setSessionType(e.target.value as SessionType)}
          >
            {SESSION_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-white/10 mt-4 shrink-0" />

        {/* Session */}
        <div className="flex flex-col gap-1 min-w-32.5">
          <label className="text-gray-500 text-[10px] tracking-widest uppercase">Driver</label>
          <select
            className="select"
            value={driver}
            onChange={e => setDriver(String(e.target.value))}
          >
            <option value={0} disabled>
              {loading ? "Loading drivers...": "Select drivers"}
            </option>
            <option value={"HAM"}>
              HAM
            </option>
            <option value={"LEC"}>
              LEC
            </option>
            <option value={"VER"}>
              VER
            </option>
          </select>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-white/10 mt-4 shrink-0" />
        
        {/* Load button — matches select-sm height */}

        <div className="flex flex-col gap-1 min-w-32.5">
          <button
            onClick={loadFunction}
            disabled={!canStart}
            className="btn btn-error text-xs font-bold mt-4.5 tracking-wider uppercase
                      disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: canStart ? "#e8000d" : "#e8000d",
              color: "#fff",
              boxShadow: canStart ? "0 0 24px #e8000d55, 0 0 6px #e8000d33" : "none",
            }}
          >
            {loading ? <Loading />: "Load Results"}
          </button>
        </div>

      </div>
    </div>
  )
}

export default TelemetryBar