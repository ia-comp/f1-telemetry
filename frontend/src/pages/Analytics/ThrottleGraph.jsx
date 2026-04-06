import React from 'react'
import { useState, useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';

const ThrottleGraph = ({ speedTraceData, driver }) => {
  const plotRef = useRef(null);

  useEffect(() => {
      // 1. Guard for the element and the specific marker trace
      const el = plotRef.current?.el;
      if (!el || !el.data || el.data.length < 2) return; 

      let index = 0;
      const interval = setInterval(() => {
        // 2. Ensure data still exists during this interval tick
        if (!speedTraceData.distance[index] || index > speedTraceData.distance.length) {
          index = 0;
          return;
        }
        index++;
        
        const newX = speedTraceData.distance[index];
        const newY = speedTraceData.throttle[index];

        // 3. Update only the second trace (index 1)
        Plotly.restyle(el, { 
            x: [[newX]], 
            y: [[newY]] 
        }, [1]); 
      }, 24);

      return () => clearInterval(interval);
    }, [speedTraceData]); 

  const throttleLine = {
    x: speedTraceData.distance,
    y: speedTraceData.throttle,            
    mode: "lines",
    name: driver,
    line: {
      color: speedTraceData.colour,
      width: 3
    },
    showlegend: true
  };

  const animatedMarker = {
    x: [speedTraceData.distance[0]],
    y: [speedTraceData.throttle[0]],
    mode: 'markers',
    marker: { color: 'white', size: 10 },
    name: 'Current Pos',
    showlegend: false
  };

  return (
    <Plot className="drop-shadow-[0px_0px_7px] drop-shadow-neutral-500 rounded-lg"
      ref={plotRef}  
      data={[throttleLine, animatedMarker]}
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
          plot_bgcolor: "#262626",
          paper_bgcolor: "#262626"
        }}
        config={{ displayModeBar: false, responsive: true }}
      />
  );
}

export default ThrottleGraph