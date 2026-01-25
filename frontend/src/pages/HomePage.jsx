import React from 'react'
import { useNavigate } from 'react-router'

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen">
      {/* Left Side */}
      <div className="relative flex-1 flex items-center justify-center">
        <div className="absolute top-50 left-25 size-60 bg-[#053f11] blur-[100px]" />
        <div className="absolute bottom-60 right-45 size-60 bg-[#f017c8] opacity-20 blur-[100px]" />

        <div className="flex flex-col gap-4">

          <h1 className="text-gray-50 text-9xl font-bold drop-shadow-[0px_0px_7px] drop-shadow-[#a0690ae6]">
            RaceEngi
          </h1>
          <p className="text-gray-400 text-xl font-bold drop-shadow-[0px_1px_3px] drop-shadow-[#61587e]">
            Your own F1 pitwall - for free
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center">
        <button 
          className='btn btn-primary'
          onClick={() => navigate('/session_results')}
        >
          Get started
        </button>
      </div>
    </div>
  )
}

export default HomePage
