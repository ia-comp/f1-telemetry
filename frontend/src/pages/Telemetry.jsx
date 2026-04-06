import React from 'react';
import Plot from 'react-plotly.js';
import { useState, useEffect } from 'react';
import SpeedTrace from './SpeedTrace';

const API_URL = 'http://localhost:8000/api';

function Telemetry() {
    // const [year, setYear] = useState(2025);
    // const [gp, setGP] = useState("");


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [speedTraceData, setData] = useState(null)

  const driver = "HAM";
  const year = 2023;
  const gp = "Japanese"
  
  const plotSpeedTrace = async () => {
    // setYear(selectedYear)
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/session_results/telemetry/speed_trace/${year}/${gp}/${driver}`);
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
    plotSpeedTrace()
  }, []);

  console.log(speedTraceData)
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-50 mb-8 text-center drop-shadow-[0px_0px_7px] drop-shadow-[#a0690ae6]">
        Speed Trace
      </h1>

      <div className="flex justify-around">
        <div className="border-2 border-solid border-amber-300">
          <h2 className="text-4xl font-bold text-gray-50 mb-8 text-center drop-shadow-[0px_0px_7px] drop-shadow-[#a0690ae6]">
            Lap Time
          </h2>
        </div>

        {/* Circuit map */}
        <div className="border-2 border-solid border-amber-300">
          <h2 className="text-4xl font-bold text-gray-50 mb-8 text-center drop-shadow-[0px_0px_7px] drop-shadow-[#a0690ae6]">
            Circuit map
          </h2>
          {!speedTraceData ? 
            <p  className="text-gray-50 mb-8 text-center drop-shadow-[0px_0px_7px] drop-shadow-[#a0690ae6]">Loading...</p> : 
         <Plot className="drop-shadow-[0px_0px_7px] 
          drop-shadow-neutral-500 
          rounded-lg"
            data={[
              {
                x: speedTraceData.x,
                y: speedTraceData.y,            
                mode: "lines",
                name: "Circuit Map",
                line: {
                  color: speedTraceData.colour,
                  width: 6
                }
              },
            ]}
            layout={{
              plot_bgcolor: "#262626",
              paper_bgcolor: "#262626"
            }}
          />}

        </div>

        {/* Speed Trace Graph */}
        <div className="
          flex
          flex-col 
          items-center 
          justify-center


          ">
          <h2 className="text-4xl font-bold text-gray-50 mb-8 text-center drop-shadow-[0px_0px_7px] drop-shadow-[#a0690ae6]">
            Telemetry
          </h2>          
          {!speedTraceData ? 
            <p  className="text-gray-50 mb-8 text-center drop-shadow-[0px_0px_7px] drop-shadow-[#a0690ae6]">Loading...</p> :
            <SpeedTrace speedTraceData={speedTraceData} driver={driver}></SpeedTrace>
          }

          {/* Throttle % Graph*/}
          {!speedTraceData ? 
          <p  className="text-gray-50 mb-8 text-center drop-shadow-[0px_0px_7px] drop-shadow-[#a0690ae6]">Loading...</p> : 
          
          <Plot className="drop-shadow-[0px_0px_7px] 
          drop-shadow-neutral-500 
          rounded-lg"
            data={[
              {
                x: speedTraceData.distance,
                y: speedTraceData.throttle,            
                mode: "lines",
                name: driver,
                line: {
                  color: speedTraceData.colour,
                  width: 3
                }
              },
            ]}
            layout={{
              title: {
                text: "Throttle"
              },          
              xaxis: {
                title: {
                  text: "Distance (m)"
                },
                showgrid: false,
                zeroline: true,
                showline: true
              },
              yaxis: {
                title: {
                  text: "Throttle (%)"
                },
                showline: true
              },
              font: {
                color: "#FFFFFF"
              },
              showlegend: true,
              plot_bgcolor: "#262626",
              paper_bgcolor: "#262626"
            }}
          />}
        </div>      
      </div>
    </div>
  )
}

export default Telemetry
