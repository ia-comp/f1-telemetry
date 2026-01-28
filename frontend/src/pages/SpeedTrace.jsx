import React from 'react';
import Plot from 'react-plotly.js';
import { useState, useEffect } from 'react';
const API_URL = 'http://localhost:8000/api';

function SpeedTrace() {
    // const [year, setYear] = useState(2025);
    // const [gp, setGP] = useState("");


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [data, setData] = useState(null)

  const driver = "HAM";
  const year = 2023;
  const gp = "japanese grand prix"
  
  const plotSpeedTrace = async () => {
    // setYear(selectedYear)
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/session_results/speed_trace/${year}/${gp}/${driver}`);
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

  console.log(data)
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-50 mb-8 text-center">
        Speed Trace
      </h1>
      {data && <Plot
        data={[
          {
            x: data.distance,
            y: data.speed,            
            mode: "lines",
            type: "scatter",
          },
        ]}
        layout={{
          title: "Qualifying Lap Speed Trace",
          xaxis: {
            title: "Distance (m)",
          },
          yaxis: {
            title: "Speed (km/h)",
          },
        }}
      />}
    </div>
  )
}

export default SpeedTrace
