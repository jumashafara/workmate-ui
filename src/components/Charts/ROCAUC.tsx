import React from "react";
import ReactApexChart from "react-apexcharts";

const ROCCurve: React.FC = () => {
  const fpr = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
  const tpr = [0, 0.3, 0.45, 0.6, 0.68, 0.75, 0.82, 0.89, 0.93, 0.97, 1];
  const aucScore = 0.81;

  const series = [
    {
      name: "ROC Curve",
      data: fpr.map((val, idx) => [val, tpr[idx]]),
    },
    {
      name: "Random Classifier",
      data: [
        [0, 0],
        [1, 1],
      ],
    },
  ];

  const options = {
    chart: {
      type: "line",
      height: 500,
      zoom: {
        enabled: false,
      },
    },
    xaxis: {
      title: {
        text: "False Positive Rate",
        style: {
          color: "#000",
        },
      },
      min: 0,
      max: 1,
      labels: {
        style: {
          colors: ["#000"],
        },
      },
    },
    yaxis: {
      title: {
        text: "True Positive Rate",
        style: {
          color: "#000",
        },
      },
      min: 0,
      max: 1,
      labels: {
        style: {
          colors: ["#000"],
        },
      },
    },
    stroke: {
      curve: "straight",
      width: 2,
    },
    colors: ["#ea580c", "#9ca3af"],
    markers: {
      size: 4,
    },
    legend: {
      position: "top",
      labels: {
        colors: ["#000"],
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
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
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={500}
        />
      </div>
    </div>
  );
};

export default ROCCurve;
