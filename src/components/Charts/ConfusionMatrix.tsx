import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

interface ConfusionMatrixProps {
  confusion_matrix_data:
    | {
        true_positives: number;
        false_positives: number;
        true_negatives: number;
        false_negatives: number;
      }
    | undefined;
}

const ConfusionMatrix: React.FC<ConfusionMatrixProps> = ({
  confusion_matrix_data,
}) => {
  const [matrix_data, setMatrixData] = useState<number[][]>([
    [0, 0],
    [0, 0],
  ]);

  useEffect(() => {
    if (confusion_matrix_data) {
      setMatrixData([
        [
          confusion_matrix_data.true_negatives,
          confusion_matrix_data.false_negatives,
        ],
        [
          confusion_matrix_data.false_positives,
          confusion_matrix_data.true_positives,
        ],
      ]);
    }
  }, [confusion_matrix_data]);

  const categories = ["Negative", "Positive"];

  const series = [
    {
      name: "Negative",
      data: matrix_data[0],
    },
    {
      name: "Positive",
      data: matrix_data[1],
    },
  ];

  const options = {
    chart: {
      type: "heatmap",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 600,
              color: "#fff7ed",
              name: "Low",
            },
            {
              from: 601,
              to: 1600,
              color: "#fdba74",
              name: "Medium",
            },
            {
              from: 1601,
              to: 2000,
              color: "#ea580c",
              name: "High",
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["#000"],
      },
    },
    xaxis: {
      categories: categories,
      title: {
        text: "Predicted Label",
      },
    },
    yaxis: {
      categories: categories,
      reversed: true,
      title: {
        text: "True Label",
      },
    },
    title: {
      text: "Confusion Matrix",
      align: "center",
    },
    colors: ["#ea580c"],
  };

  return (
    <div className="text-gray-900 confusion-matrix border border-gray-300 bg-white shadow-md dark:bg-gray-800 dark:border-gray-600">
      <div className="bg-gray-200 p-3 dark:bg-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-center dark:text-gray-100">
          Confusion Matrix
        </h2>
        <p className="text-center mb-4 dark:text-gray-300">
          How many false positives and false negatives?
        </p>
      </div>
      <div className="p-3">
        <ReactApexChart
          options={options}
          series={series}
          type="heatmap"
          height={500}
        />
      </div>
    </div>
  );
};

export default ConfusionMatrix;
