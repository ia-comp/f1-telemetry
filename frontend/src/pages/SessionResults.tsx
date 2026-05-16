import React, { useState, useEffect } from "react"
import { useSessionStore,  SessionType } from "../store/sessionstore"
import SessionBar from "../components/SessionBar"

const API_URL = "http://localhost:8000/api"

interface SessionResult {
  Driver: string
  TeamColour: string
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
    if (year > 0 && eventId > 0) {
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
        <div className="w-full flex justify-center px-4">
          <div className="w-full max-w-7xl">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-3 px-4 text-left text-[10px] tracking-widest uppercase text-gray-500 font-medium w-12">Pos</th>
                  <th className="py-3 px-4 text-left text-[10px] tracking-widest uppercase text-gray-500 font-medium">Driver</th>
                  <th className="py-3 px-4 text-right text-[10px] tracking-widest uppercase text-gray-500 font-medium">Fastest Lap</th>
                  <th className="py-3 px-4 text-right text-[10px] tracking-widest uppercase text-gray-500 font-medium">Delta</th>
                </tr>
              </thead>
              <tbody>
                {sessionResults.map((result, index) => (
                  <tr
                    key={index}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors duration-100"
                  >
                    <td className="py-3 px-4 text-gray-500 text-sm tabular-nums">{index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-4 w-4 rounded-full shrink-0"
                          style={{ backgroundColor: `#${result.TeamColour}`, border: "bg-"}}
                        />
                        <span className="text-gray-50 font-bold tracking-wider">{result.Driver}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-md text-gray-200 tabular-nums">
                      {result.LapTime ?? '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-md text-red-400 tabular-nums">
                      {result.LapTimeDelta ? `+ ${result.LapTimeDelta}` : '-'}
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