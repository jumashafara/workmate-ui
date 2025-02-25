import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const PartialDependencePlot: React.FC = () => {
  const [model, setModel] = useState<string>("year1_classification");
  const [feature, setFeature] = useState(
    "Land_size_for_Crop_Agriculture_Acres"
  );

  const [gridValues, setGridValues] = useState();
  const [averages, setAverages] = useState();

  const featureList = [
    ["Land_size_for_Crop_Agriculture_Acres", "Agriculture land size (acres)"],
    ["farm_implements_owned", "Farm implements owned"],
    ["tot_hhmembers", "Household members"],
    [
      "Distance_travelled_one_way_OPD_treatment",
      "Distance travelled to OPD treatment (one way)",
    ],
    ["Average_Water_Consumed_Per_Day", "Average water consumed per day"],
    ["hh_water_collection_Minutes", "Water collection time (minutes)"],
    ["composts_num", "Number of composts"],
    ["education_level_encoded", "Education level"],
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `http://localhost:8000/api/get-pdp/?model=${model}&feature=${feature}`
      );
      const result = await response.json();
      setGridValues(result.data.x);
      setAverages(result.data.y);
    };

    fetchData();
  }, [model, feature]);

  const chartOptions = {
    chart: {
      type: "line" as const,
      toolbar: { show: true },
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: gridValues,
      title: {
        text: feature,
      },
      labels: {
        formatter: (value: number) => value?.toFixed(2),
      },
    },

    yaxis: {
      title: {
        text: "Average Probability",
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
    fill: {
      colors: ["#ea580c"],
    },
  };

  const chartSeries = [
    {
      name: "Averages",
      data: averages || [],
    },
  ];

  return (
    <div className="bg-white rounded-sm shadow-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800">
      <div className="">
        <div className="bg-gray-200 p-4 dark:bg-gray-700">
          <div className="flex flex-col space-y-3 md:flex-row md:justify-between mb-4 ">
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                Partial Dependence
              </h2>
              <p>How does the prediction change if you change one feature?</p>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-3">
              <select
                name=""
                id=""
                className="border border-gray-300 rounded-sm p-3 outline-none bg-gray-100 dark:border-gray-600 dark:bg-gray-800"
                onChange={(e) => {
                  setModel(e.target.value);
                }}
              >
                <option value="year1_classification" className="bg-transparent">
                  Year 1 Classification
                </option>
                <option value="year2_classification" className="bg-transparent">
                  Year 2 Classification
                </option>
              </select>
              <select
                name=""
                id=""
                className="border border-gray-300 rounded-sm p-3 outline-none bg-gray-100 dark:border-gray-600 dark:bg-gray-800"
                onChange={(e) => {
                  setFeature(e.target.value);
                }}
              >
                {featureList.map((featureItem) => (
                  <option
                    key={featureItem[0]}
                    value={featureItem[0]}
                    className="bg-transparent"
                  >
                    {featureItem[1]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="p-4">
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="line"
            height={400}
          />
        </div>
      </div>
    </div>
  );
};

export default PartialDependencePlot;
