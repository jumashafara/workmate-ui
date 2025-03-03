// PieChart.tsx
import React from "react";
import Plot from "react-plotly.js";
import { Box, Alert } from "@mui/material";

interface PieChartProps {
  data: number[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  // Validate data
  const isValidData = data && Array.isArray(data) && data.length === 2 && 
                      data.every(value => typeof value === 'number' && !isNaN(value));
  
  // Use default data if invalid
  const validData = isValidData ? data : [50, 50];
  
  if (!isValidData) {
    console.warn("PieChart received invalid data:", data);
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="warning">
          Invalid data format. Expected an array of two numbers.
        </Alert>
      </Box>
    );
  }
  
  return (
    <Box sx={{ width: '100%', height: '100%', minHeight: 300 }}>
      <Plot
        data={[
          {
            type: 'pie',
            values: validData,
            labels: ['Achieved', 'Not Achieved'],
            marker: {
              colors: ['#EA580C', '#1c2434']
            },
            textinfo: 'percent',
            hoverinfo: 'label+percent',
            hole: 0.4
          }
        ]}
        layout={{
          autosize: true,
          margin: { t: 10, b: 10, l: 10, r: 10 },
          showlegend: true,
          legend: {
            orientation: 'h',
            xanchor: 'center',
            yanchor: 'bottom',
            x: 0.5,
            y: -0.1
          },
          font: {
            family: 'Arial, sans-serif'
          }
        }}
        config={{
          responsive: true,
          displayModeBar: false,
          displaylogo: false
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </Box>
  );
};

export default PieChart;
