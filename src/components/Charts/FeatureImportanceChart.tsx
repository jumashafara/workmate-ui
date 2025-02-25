import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const FeatureImportanceChart: React.FC = () => {
  const [featureNames, setFeatureName] = useState(["foo", "bar"]);
  const [importances, setImportances] = useState<number[]>([]);
  const [model, setModel] = useState<string | undefined>(
    "year1_classification"
  );

  const getFeatureImportances = async (model: string | undefined) => {
    const response = await fetch(
      `/api/models/feature-importances/?model=${model}`
    );
    const data = await response.json();
    console.log(data);
    return data;
  };

  useEffect(() => {
    getFeatureImportances(model).then((data) => {
      const features = Object.keys(data.feature_importances);
      const importances = Object.values(data.feature_importances) as number[];
      setFeatureName(features);
      setImportances(importances);
    });
  }, [model]);

  const options = {
    chart: {
      type: "bar" as const,
      toolbar: { show: true },
    },
    legend: {
      show: false,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
      },
    },

    xaxis: {
      title: {
        text: "Importance",
      },
      categories: featureNames,
      min: 0,
      max: Math.max(...importances) * 1.1,
      labels: {
        formatter: (value: number) => value.toFixed(3), // Show three decimal places
      },
    },
    yaxis: {
      title: {
        text: "Features",
        align: "left",
      },
      labels: {
        show: true,
      },
    },
    fill: {
      colors: ["#ea580c"],
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: false,
      borderColor: "#e0e0e0",
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
  };

  const series = [
    {
      data: importances,
    },
  ];

  return (
    <div className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
      <div className="flex flex-col space-y-3 md:flex-row md:justify-between bg-gray-200 dark:bg-gray-700 p-4 ">
        <div>
          <h2 className="text-lg font-semibold mb-4 w-full text-gray-900 dark:text-white">
            Feature Importance Chart
          </h2>
          <p className="text-gray-900 dark:text-gray-100">
            What were the most important features?
          </p>
        </div>
        <div>
          <select
            name=""
            id=""
            className="w-full p-3 border bg-gray-100 border-gray-300 dark:border-gray-600 dark:bg-gray-800 outline-none"
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="year1_classification">Year 1 Classification</option>
            <option value="year2_classification">Year 2 Classification</option>
          </select>
        </div>
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
