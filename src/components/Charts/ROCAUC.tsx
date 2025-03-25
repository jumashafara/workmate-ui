import React from "react";
import Plot from 'react-plotly.js';

interface ROCCurveProps {
  fpr?: number[];
  tpr?: number[];
  aucScore?: number;
}

const ROCCurve: React.FC<ROCCurveProps> = ({ 
  fpr = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
  tpr = [0, 0.3, 0.45, 0.6, 0.68, 0.75, 0.82, 0.89, 0.93, 0.97, 1],
  aucScore = 0.81
}) => {
  
  const data = [
    {
      x: fpr,
      y: tpr,
      type: 'scatter',
      mode: 'lines+markers',
      name: 'ROC Curve (AUC = ' + aucScore.toFixed(2) + ')',
      line: {
        color: '#ea580c',
        width: 2
      },
      marker: {
        color: '#ea580c',
        size: 6
      }
    },
    {
      x: [0, 1],
      y: [0, 1],
      type: 'scatter',
      mode: 'lines',
      name: 'Random Classifier',
      line: {
        color: '#9ca3af',
        width: 2,
        dash: 'dash'
      }
    }
  ];

  const layout = {
    xaxis: {
      title: 'False Positive Rate',
      range: [0, 1]
    },
    yaxis: {
      title: 'True Positive Rate',
      range: [0, 1]
    },
    legend: {
      x: 0.1,
      y: 0.9
    },
    margin: {
      l: 60,
      r: 30,
      b: 60,
      t: 80
    },
    hovermode: 'closest',
    plot_bgcolor: 'white',
    paper_bgcolor: 'white'
  };

  const config = {
    responsive: true,
    displayModeBar: false
  };

  return (
    <div className="text-gray-900 roc-curve border border-gray-300 bg-white shadow-md dark:bg-gray-800 dark:border-gray-600">
      <div className="bg-gray-200 p-3 text-center dark:bg-gray-700">
        <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">
          ROC Curve
        </h2>
        <p className="mb-4 dark:text-gray-300">
          What is the model's ability to distinguish between classes?
        </p>
      </div>
      <div className="p-3">
        <Plot
          data={data as any} // Type assertion to bypass TypeScript error
          layout={layout as any} // Type assertion to bypass TypeScript error
          config={config}
          style={{ width: '100%', height: 500 }}
        />
      </div>
    </div>
  );
};

export default ROCCurve;
