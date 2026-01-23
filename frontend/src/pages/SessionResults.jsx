import React from 'react'
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8000/api';

function SessionResults() {
    const [sessionResults, setSessionResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // for testing 
    const year = 2023;
    const gp = "monaco";

    const fetchSessionResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/session_results/${year}/${gp}`);
        if (!response.ok) throw new Error('Failed to fetch session data');
        const data = await response.json();
        setSessionResults(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
  return (
    <div>
        <h1 className="text-4xl font-bold text-gray-50 mb-8 text-center">
          🏎️ F1 Session Results
        </h1>
        
        {sessionResults.length === 0 && !loading && !error && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
            Select a race and click "Load Results" to view qualifying data
          </div>
        )}

        <button
          onClick={fetchSessionResults}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Loading...' : 'Load Results'}
        </button>

        {/* Results Table */}
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
                      <td className="px-6 py-4 font-mono text-sm font-semibold">{result.LapTime || '-'}</td>
                      <td className="px-6 py-4 font-mono text-sm text-red-600">{result.LapTimeDelta || '-'}</td>
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
