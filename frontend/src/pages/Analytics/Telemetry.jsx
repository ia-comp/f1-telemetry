import React from 'react';
import Plot from 'react-plotly.js';
import { useState, useEffect } from 'react';
import SpeedTrace from './SpeedTrace';
import ThrottleGraph from './ThrottleGraph';
import CircuitMap from './CircuitMap';
import Loading from '../../components/Loading';
import { useSessionStore } from '../../store/sessionstore';
import TelemetryBar from '../../components/TelemetryBar';

const API_URL = 'http://localhost:8000/api';

function Telemetry() {
  const [error, setError] = useState(null);
  const [speedTraceData, setData] = useState(null);

  const {
    year,
    eventId,
    driver,
    setLoading,
  } = useSessionStore()

  const plotSpeedTrace = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/session_results/telemetry/${year}/${eventId}/${driver}`);
      if (!response.ok) throw new Error('Failed to fetch speed trace');
      const data = await response.json();
      setData(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If we arrived from the homepage and already have values
    if (year > 0 && eventId > 0) {
      plotSpeedTrace();
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a1a] px-8 py-10">

      {/* Page header */}
      <h1 className="text-4xl font-bold text-gray-50 mb-1 text-center drop-shadow-[0px_0px_7px] drop-shadow-[#a0690ae6]">
        Telemetry
      </h1>
      <TelemetryBar loadFunction={plotSpeedTrace}/>

      {error && (
        <div className="text-center text-red-400 text-sm mb-6">{error}</div>
      )}

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-6 justify-center items-stretch max-w-6xl mx-auto w-full">


        {/* Circuit map card */}
        <div className="bg-[#262626] rounded-xl p-6 shadow-[0_0_15px_rgba(0,0,0,0.4)] flex flex-col gap-6 items-center flex-1">
          {/* LapTime */}
          <h2 className="text-sm font-semibold text-white/40 tracking-widest mb-3 uppercase">
            Lap Time
          </h2>
          <div className="text-3xl font-bold text-amber-300 drop-shadow-[0px_0px_7px] drop-shadow-[#a0690ae6]">
            {speedTraceData?.LapTime ?? '—:——.———'}
          </div>
          <h2 className="text-sm font-semibold text-white/40 tracking-widest mb-4 uppercase">
            Circuit Map
          </h2>
          {!speedTraceData ? (
            <Loading />
          ) : (
            <CircuitMap speedTraceData={speedTraceData} driver={driver} />
          )}


        </div>

        {/* Telemetry graphs card */}
        <div className="bg-[#262626] rounded-xl p-6 shadow-[0_0_15px_rgba(0,0,0,0.4)] flex flex-col gap-6 items-center flex-1">
          <h2 className="text-sm font-semibold text-white/40 tracking-widest mb-1 uppercase text-center">
            Telemetry
          </h2>

          {!speedTraceData ? (
            <Loading />
          ) : (
            <SpeedTrace speedTraceData={speedTraceData} driver={driver} />
          )}

          {!speedTraceData ? (
            <Loading />
          ) : (
            <ThrottleGraph speedTraceData={speedTraceData} driver={driver} />
          )}
        </div>

      </div>
    </div>
  );
}

export default Telemetry;