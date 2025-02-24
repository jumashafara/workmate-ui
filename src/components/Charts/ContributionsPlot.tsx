import React from "react";
import Chart from "react-apexcharts";

interface FeatureContributionsChartProps {
  contributions: Record<string, number>;
}

const featureLabelMap: Record<string, string> = {
  perennial_crops_grown_food_banana: "Food Banana",
  perennial_crops_grown_coffee: "Coffee",
  Land_size_for_Crop_Agriculture_Acres: "Agric Land Size (Acres)",
  ground_nuts: "Ground Nuts",
  business_participation: "Business Participation",
  irish_potatoes: "Irish Potatoes",
  sweet_potatoes: "Sweet Potatoes",
  tot_hhmembers: "Total Household Members",
  vsla_participation: "VSLA Participation",
  Distance_travelled_one_way_OPD_treatment: "Distance to OPD (One-Way)",
  cassava: "Cassava",
  hh_water_collection_Minutes: "Water Collection Time (Min)",
  Average_Water_Consumed_Per_Day: "Avg. Water Consumption (Per Day)",
  farm_implements_owned: "Farm Implements Owned",
  composts_num: "Composts",
  hh_produce_lq_manure: "Liquid Manure Production",
  maize: "Maize Production",
  hh_produce_organics: "Organics Production",
  sorghum: "Sorghum Production",
  education_level_encoded: "Education Level",
  soap_ash_present: "Soap & Ash Available",
  non_bio_waste_mgt_present: "Non-Bio Waste Management",
  tippy_tap_present: "Tippy Tap Availability",
  hhh_sex: "Household Head Gender",
};

const FeatureContributionsChart: React.FC<FeatureContributionsChartProps> = ({
  contributions,
}) => {
  const featureEntries = Object.entries(contributions)
    .map(([key, value]) => [featureLabelMap[key] || key, Number(value)]) // Use mapped label or fallback to key, ensure value is a number
    .sort((a, b) => Math.abs(Number(b[1])) - Math.abs(Number(a[1]))); // Ensure values are treated as numbers

  const featureNames = featureEntries.map(([key]) => key);
  const featureValues = featureEntries.map(([, value]) => Number(value)); // Ensure values are numbers

  const colors = featureValues.map((value) =>
    value >= 0 ? "#EA580C" : "#374151"
  );

  const chartOptions = {
    chart: {
      type: "bar" as const,
      toolbar: { show: false },
      //   background: "#ffffff",
      foreColor: "#333",
      padding: "5px",
      //   increase bar size
    },
    colors,
    xaxis: {
      categories: featureNames,
      labels: { rotate: -45, style: { colors: "#333", fontSize: "14px" } },
    },
    yaxis: {
      title: {
        text: "Contribution Score",
        style: { color: "#333", fontSize: "16px" },
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number) => `${val.toFixed(4)}`,
      },
      style: { fontSize: "14px", background: "#fff", border: 0 },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        barHeight: "90%",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val.toFixed(2),
      style: { fontSize: "12px", colors: ["#fff"] },
    },
    legend: {
      show: false, // Hide the legend
    },
  };

  const chartSeries = [
    {
      name: "Feature Contribution",
      data: featureValues,
    },
  ];

  return (
    <div className="bg-white rounded-sm shadow-md border border-gray-300 dark:border-gray-700">
      <div className="bg-gradient-to-r from-gray-200 to-gray-300 p-4 rounded-sm  dark:from-gray-800 dark:to-gray-900 dark:text-gray-200">
        <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
          Feature Contributions
        </h2>
        <p>How has each feature contributed to the prediction?</p>
      </div>
      <div className="dark:bg-gray-800">
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={500}
        />
      </div>
    </div>
  );
};

export default FeatureContributionsChart;
