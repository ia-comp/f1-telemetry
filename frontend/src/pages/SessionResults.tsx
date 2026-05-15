import React, { useState, useEffect } from "react"
import { useSessionStore,  SessionType } from "../store/sessionstore"

const API_URL = "http://localhost:8000/api"

interface SessionResult {
  Driver: string
  LapTime: string | null
  LapTimeDelta: string | null
}

const AVAILABLE_YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018]

function SessionResults() {
  const [sessionResults, setSessionResults] = useState<SessionResult[]>([])
  const [error, setError] = useState<string | null>(null)

  const {
    year,
    eventId,
    sessionType,
    loading,
    yearSchedule,
    setEventId,
    setSessionType,
    setLoading,
    handleYearChange,
  } = useSessionStore()

  const fetchSessionResults = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/session_results/${year}/${eventId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch session data")
      }
      const data: SessionResult[] = await response.json()
      setSessionResults(data)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // If we arrived from the homepage and already have values
    if (year > 0 && eventId !== "") {
      fetchSessionResults();
    }
    // Empty dependency array means this only runs ONCE when the component loads
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-50 mb-8 text-center">
        Session Results
      </h1>

      <select
        className="select"
        value={year}
        onChange={e => handleYearChange(Number(e.target.value))}
      >
        <option disabled value={0}>Select year</option>
        {AVAILABLE_YEARS.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>

      <select
        className="select"
        value={eventId}
        onChange={e => setEventId(e.target.value)}
      >
        <option disabled value="">Select event</option>
        {yearSchedule.map(event => (
          <option key={event.name} value={event.name}>
            {event.round} - {event.name} Grand Prix
          </option>
        ))}
      </select>

      <select
        className="select"
        value={sessionType}
        onChange={e => setSessionType(e.target.value as SessionType)}
      >
        <option value="practice">Practice</option>
        <option value="qualifying">Qualifying</option>
        <option value="race">Race</option>
      </select>

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}

      <button
        onClick={fetchSessionResults}
        disabled={loading || !eventId}
        className="btn btn-primary"
      >
        {loading ? "Loading..." : "Load Results"}
      </button>

      {sessionResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Driver</th>
                  <th className="px-6 py-4 text-left">Lap Time</th>
                  <th className="px-6 py-4 text-left">Delta</th>
                </tr>
              </thead>
              <tbody>
                {sessionResults.map((result, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 font-bold text-lg">{result.Driver}</td>
                    <td className="px-6 py-4 font-mono text-sm font-semibold">
                      {result.LapTime ?? "-"}
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-red-600">
                      {result.LapTimeDelta || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default SessionResults