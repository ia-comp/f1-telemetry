import React from 'react'
import { useState, useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';

const CircuitMap = ({speedTraceData, driver}) => {
  const plotRef = useRef(null);

  useEffect(() => {
      // 1. Guard for the element and the specific marker trace
      const el = plotRef.current?.el;
      if (!el || !el.data || el.data.length < 2) return; 

      let index = 0;
      const interval = setInterval(() => {
        // 2. Ensure data still exists during this interval tick
        if (!speedTraceData.x[index] || index > speedTraceData.x.length) {
          index = 0;
          return;
        }
        index++;
        
        const newX = speedTraceData.x[index];
        const newY = speedTraceData.y[index];

        // 3. Update only the second trace (index 1)
        Plotly.restyle(el, { 
            x: [[newX]], 
            y: [[newY]] 
        }, [1]); 
      }, 24);

      return () => clearInterval(interval);
    }, [speedTraceData]); 

  const mapOutline = {
    x: speedTraceData.x,
    y: speedTraceData.y,          
    mode: "lines",
    name: driver,
    line: {
      color: speedTraceData.colour,
      width: 6
    },
    showlegend: true,
  };

  const animatedMarker = {
    x: [speedTraceData.x[0]],
    y: [speedTraceData.y[0]],
    mode: 'markers',
    marker: { color: 'white', size: 10 },
    name: 'Current Pos',
    showlegend: false
  };

  return (
    <Plot className="drop-shadow-[0px_0px_7px] drop-shadow-neutral-500 rounded-lg"
      ref={plotRef}
      data={[mapOutline, animatedMarker]}
      layout={{
        plot_bgcolor: "#262626",
        paper_bgcolor: "#262626",
        xaxis: { visible: false },
        yaxis: { visible: false },
                font: {
          color: "#FFFFFF"
        },
      }}
      config={{ displayModeBar: false, responsive: true }}
    />
  )
}

export default CircuitMap
