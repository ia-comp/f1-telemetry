import React from 'react'
import { Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import SessionResults from './pages/SessionResults'
import SpeedTrace from './pages/SpeedTrace'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/session_results" element={<SessionResults />} />
        <Route path="/session_results/telemetry" element={<SpeedTrace />} />
      </Routes>
    </div>

  )
}

export default App
