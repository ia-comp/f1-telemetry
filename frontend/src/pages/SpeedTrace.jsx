import React from 'react';
import Plot from 'react-plotly.js';
import { useState, useEffect } from 'react';
const API_URL = 'http://localhost:8000/api';

function SpeedTrace() {
    // const [year, setYear] = useState(2025);
    // const [gp, setGP] = useState("");


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [speedTraceData, setData] = useState(null)

  const driver = "HAM";
  const year = 2023;
  const gp = "japanese grand prix"
  
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
          {speedTraceData && <Plot className="          drop-shadow-[0px_0px_7px] 
          drop-shadow-neutral-500 
          rounded-lg"
            data={[
              {
                x: speedTraceData.distance,
                y: speedTraceData.speed,            
                mode: "lines",
                name: driver,
                line: {
                  color: speedTraceData.colour,
                  width: 3
                }
              },
            ]}
            layout={{          
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
                  text: "Speed (km/h)"
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

export default SpeedTrace
