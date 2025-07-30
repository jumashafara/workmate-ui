import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useTheme } from "next-themes";

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
  const { theme } = useTheme();
  const [plotData, setPlotData] = useState<any[]>([]);
  const [layout, setLayout] = useState<any>({});

  useEffect(() => {
    if (!contributions || Object.keys(contributions).length === 0) {
      return;
    }

    const featureEntries = Object.entries(contributions)
      .map(([key, value]) => [featureLabelMap[key] || key, Number(value)])
      .sort((a, b) => Math.abs(Number(b[1])) - Math.abs(Number(a[1])));

    const featureNames = featureEntries.map(([key]) => key);
    const featureValues = featureEntries.map(([, value]) => Number(value));

    // Create colors array based on positive/negative values
    const colors = featureValues.map((value) =>
      value >= 0 ? "#EA580C" : "#374151"
    );

    // Set up the plot data
    setPlotData([
      {
        type: "bar",
        orientation: "h",
        x: featureValues,
        y: featureNames,
        marker: {
          color: colors,
        },
        text: featureValues.map((val) => val.toFixed(2)),
        textposition: "auto",
        hoverinfo: "x+y",
        name: "Feature Contribution",
      },
    ]);

    // Set up the layout
    setLayout({
      title: {
        text: "",
        font: {
          family: "system-ui, -apple-system, sans-serif",
          size: 18,
        },
      },
      autosize: true,
      height: 500,
      margin: {
        l: 150, // Increased left margin for feature names
        r: 30,
        t: 30,
        b: 80,
      },
      xaxis: {
        title: {
          text: "Contribution Score",
          font: {
            family: "system-ui, -apple-system, sans-serif",
            size: 14,
          },
        },
        gridcolor:
          theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      },
      yaxis: {
        automargin: true,
        tickfont: {
          family: "system-ui, -apple-system, sans-serif",
          size: 12,
        },
      },
      plot_bgcolor: theme === "dark" ? "#1C2434" : "#FFFFFF",
      paper_bgcolor: theme === "dark" ? "#1C2434" : "#FFFFFF",
      font: {
        family: "system-ui, -apple-system, sans-serif",
        color: theme === "dark" ? "#FFFFFF" : "#000000",
      },
    });
  }, [contributions, theme]);

  // If no contributions data, show a message
  if (!contributions || Object.keys(contributions).length === 0) {
    return (
      <Card className="w-full shadow-sm mb-3">
        <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
          <CardTitle>Feature Contributions</CardTitle>
          <CardDescription>
            How has each feature contributed to the prediction?
          </CardDescription>
        </CardHeader>
        <CardContent className="py-10">
          <p className="text-center text-muted-foreground">
            No feature contribution data available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-sm mb-3">
      <CardHeader>
        <CardTitle>Feature Contributions</CardTitle>
        <CardDescription>
          How has each feature contributed to the prediction?
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[500px] w-full">
          <Plot
            data={plotData}
            layout={layout}
            config={{
              displayModeBar: true,
              responsive: true,
              modeBarButtonsToRemove: ["lasso2d", "select2d"],
            }}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureContributionsChart;
