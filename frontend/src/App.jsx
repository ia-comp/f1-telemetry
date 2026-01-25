import React from 'react'
import { Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import SessionResults from './pages/SessionResults'

function App() {
  return (
    <div className="bg-neutral-900 min-w-lg">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/session_results" element={<SessionResults />} />
      </Routes>
    </div>

  )
}

export default App
