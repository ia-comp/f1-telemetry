import React from 'react'
import { Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import SessionResults from './pages/SessionResults'
import Telemetry from './pages/Telemetry'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/session_results" element={<SessionResults />} />
        <Route path="/session_results/telemetry" element={<Telemetry />} />
      </Routes>
    </div>

  )
}

export default App
