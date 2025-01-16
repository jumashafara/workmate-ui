// PieChart.tsx
import React from "react";
import ReactApexChart from "react-apexcharts";

interface PieChartProps {
  data: number[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const chartOptions = {
    chart: {
      type: "pie",
    },
    labels: ["Acheived", "Not Achieved"],
    colors: ["#EA580C", "#1c2434"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const chartSeries = data; // Example data: 38% survived, 62% did not

  return (
    <div>
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="pie"
        width="300"
      />
    </div>
  );
};

export default PieChart;
