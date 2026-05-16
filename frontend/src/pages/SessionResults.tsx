import React, { useState, useEffect } from "react"
import { useSessionStore,  SessionType } from "../store/sessionstore"
import SessionBar from "../components/SessionBar"

const API_URL = "http://localhost:8000/api"

interface SessionResult {
  Driver: string
  LapTime: string | null
  LapTimeDelta: string | null
}

function SessionResults() {
  const [sessionResults, setSessionResults] = useState<SessionResult[]>([])
  const [error, setError] = useState<string | null>(null)

  const {
    year,
    eventId,
    setLoading,
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
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-50 mb-8 text-center">
        Session Results
      </h1>
      <SessionBar loadFunction={fetchSessionResults}/>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}

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