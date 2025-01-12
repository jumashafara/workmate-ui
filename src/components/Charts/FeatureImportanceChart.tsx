import React from "react";
import ReactApexChart from "react-apexcharts";

interface FeatureImportanceChartProps {
  featureNames: string[];
  importances: number[];
}

const featureNames = [
  "Agriculture Land (Acres)",
  "Food Banana",
  "Farm Implements Owned",
  "Total Household Members",
  "Sweet Potatoes",
  "Ground Nuts",
  "Coffee",
  "Business Participation",
];
const importances = [
  0.0927, 0.0609, 0.0518, 0.0517, 0.0507, 0.0378, 0.0315, 0.0303,
];

const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = () => {
  const options = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
      },
    },
    xaxis: {
      categories: featureNames,
      title: {
        text: "Importance",
      },
    },
    yaxis: {
      title: {
        text: "Features",
      },
      labels: {
        show: true,
      },
    },
    // fill: {
    //   colors: ["#ea580c"], // You can customize the color here
    // },
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: true,
      borderColor: "#e0e0e0",
    },
    title: {
      // text: "Feature Importance",
      align: "center",
      style: {
        fontSize: "20px",
        color: "#333",
      },
    },
  };

  const series = [
    {
      data: importances,
    },
  ];

  return (
    <div className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
      <div className="bg-gray-200 dark:bg-gray-700 p-3 text-center">
        <h2 className="text-lg font-semibold mb-4 w-full text-gray-900 dark:text-white">
          Feature Importance Chart
        </h2>
        <p className="text-gray-900 dark:text-gray-100">
          What were the most important features?
        </p>
      </div>

      <div className="p-4">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default FeatureImportanceChart;
