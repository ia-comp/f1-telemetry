import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { useSessionStore, SessionType } from "../store/sessionstore"
import Loading from "../components/Loading"

const AVAILABLE_YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018]

const SESSION_OPTIONS: { value: SessionType; label: string }[] = [
  { value: "practice",   label: "Practice"   },
  { value: "qualifying", label: "Qualifying" },
  { value: "race",       label: "Race"       },
]

function HomePage() {
  const navigate = useNavigate()

  const {
    year,
    eventId,
    sessionType,
    yearSchedule,
    loading,
    setEventId,
    setSessionType,
    handleYearChange,
  } = useSessionStore()

  const canStart = year > 0 && eventId > 0

  return (
    <div className="flex h-screen bg-[#080808] overflow-hidden">

      {/* ── Left Side ─────────────────────────────────────────── */}
      {/* Left Side */}
      <div className="relative flex-1 flex items-center justify-center">
        {/* Ambient Blobs */}
        <div className="absolute top-50 left-25 size-60 bg-[#053f11] blur-[100px]" />
        <div className="absolute bottom-60 right-45 size-60 bg-[#f017c8] opacity-20 blur-[100px]" />

        <div className="flex flex-col gap-4">

          <h1 className="text-gray-50 text-9xl font-bold  drop-shadow-[0px_0px_9px] drop-shadow-[#a0690ae6]">
            RaceEngi
          </h1>
          <p className="text-gray-400 text-xl font-bold drop-shadow-[0px_1px_7px] drop-shadow-[#5d3c05]">
            Your own F1 pitwall - for free
          </p>
        </div>
      </div>


      {/* ── Divider ───────────────────────────────────────────── */}
      <div className="w-px bg-white/5 my-12" />

      {/* ── Right Side ────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-12">
        <div className="w-full max-w-sm flex flex-col gap-6">

          <p className="text-gray-200 text-3xl font-bold">
            Select session
          </p>

          {/* Year */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs tracking-wider uppercase font-bold">Year</label>
            <div className="relative">
              <select
                className="select"
                value={year}
                onChange={e => handleYearChange(Number(e.target.value))}
              >
                <option disabled value={0}>Select year</option>
                {AVAILABLE_YEARS.map(yr => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Event */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs tracking-wider uppercase font-bold">Grand Prix</label>
            <div className="relative">
              <select
                className="select"
                value={eventId}
                onChange={e => setEventId(Number(e.target.value))}
                disabled={!year || loading}
              >
                <option value={0} disabled>
                  {loading ? "Loading events..." : "Select event"}
                </option>
                {yearSchedule.map(event => (
                  <option key={event.round} value={event.round}>
                    Round {event.round} - {event.name} Grand Prix
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Session type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs tracking-wider uppercase font-bold">Session</label>
            <div className="relative">
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
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate("/session_results")}
            disabled={!canStart}
            className="mt-2 w-full py-3 rounded-lg text-sm font-bold tracking-wider uppercase transition-all duration-150
              disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none
              enabled:hover:brightness-110 enabled:active:scale-[0.98]"
            style={{
              background: canStart ? "#e8000d" : "#e8000d",
              color: "#fff",
              boxShadow: canStart ? "0 0 24px #e8000d55, 0 0 6px #e8000d33" : "none",
            }}
          >
            {loading ? <Loading />: "Get started"}
          </button>

        </div>
      </div>
    </div>
  )
}

export default HomePage