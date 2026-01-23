import React from 'react'
import { Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import SessionResults from './pages/SessionResults'

function App() {
  return (
    <div className="min-h-screen bg-slate-800 relative flex items-center 
    justfiy-center p-4 overflow-hidden">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/session_results" element={<SessionResults />} />
      </Routes>
    </div>

  )
}

export default App
