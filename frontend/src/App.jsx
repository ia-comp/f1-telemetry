import React from 'react'
import { Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import SessionResults from './pages/SessionResults'
import SpeedTrace from './pages/SpeedTrace'

function App() {
  return (
    <div className="bg-neutral-900 min-w-lg">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/session_results" element={<SessionResults />} />
        <Route path="/session_results/speed_trace" element={<SpeedTrace />} />
      </Routes>
    </div>

  )
}

export default App
