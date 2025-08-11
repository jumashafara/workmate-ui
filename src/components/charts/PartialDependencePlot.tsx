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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Target } from "lucide-react";
import { API_ENDPOINT } from "@/utils/endpoints";

const PartialDependencePlot: React.FC = () => {
  const [model, setModel] = useState<string>("year1_classification");
  const [feature, setFeature] = useState(
    "Land_size_for_Crop_Agriculture_Acres"
  );
  const [gridValues, setGridValues] = useState<number[]>([]);
  const [averages, setAverages] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCategorical, setIsCategorical] = useState<boolean>(false);
  const numericalFeatureList = [
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

  const categoricalFeatureList = [
    ["vsla_participation", "VSLA participation"],
    ["ground_nuts", "Groundnuts"],
    ["perennial_crops_grown_food_banana", "Food banana"],
    ["sweet_potatoes", "Sweet potatoes"],
    ["perennial_crops_grown_coffee", "Coffee"],
    ["irish_potatoes", "Irish potatoes"],
    ["business_participation", "Business participation"],
    ["cassava", "Cassava"],
    ["hh_produce_lq_manure", "Manure"],
    ["hh_produce_organics", "Organics"],
    ["maize", "Maize"],
    ["sorghum", "Sorghum"],
  ];

  // sortted combined list
  const featureList = [...categoricalFeatureList, ...numericalFeatureList].sort(
    (a, b) => a[0].localeCompare(b[0])
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Determine if the feature is categorical directly here
        const isFeatureCategorical = categoricalFeatureList.some(
          (item) => item[0] === feature
        );
        setIsCategorical(isFeatureCategorical);

        console.log(
          `Fetching PDP data for model: ${model}, feature: ${feature}, type: ${
            isFeatureCategorical ? "categorical" : "numerical"
          }`
        );

        const response = await fetch(
          `${API_ENDPOINT}/get-pdp/?model=${model}&feature=${feature}&type=${
            isFeatureCategorical ? "categorical" : "numerical"
          }`
        );

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();
        console.log("PDP data:", result);

        if (!result.data || !result.data.x || !result.data.y) {
          throw new Error("Invalid data format returned from API");
        }

        setGridValues(result.data.x);
        setAverages(result.data.y);
      } catch (error) {
        console.error("Error fetching partial dependence data:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load partial dependence data"
        );
        setGridValues([]);
        setAverages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [model, feature]);

  const renderContent = (isCategorical: boolean) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      );
    }

    if (gridValues.length === 0 || averages.length === 0) {
      return (
        <div className="p-4">
          <Alert>
            <AlertDescription>
              No partial dependence data available for this model and feature.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return isCategorical ? (
      // @ts-ignore
      <Plot
        data={gridValues.map((value, index) => ({
          type: "bar",
          x: [value],
          y: [averages[index]],
          name: index === 0 ? "No" : "Yes",
          marker: {
            color: index === 0 ? "#1C2434" : "#ea580c", // Set colors for bars
          },
        }))}
        layout={{
          title: {
            text: `Partial Dependence: ${featureList.find((item) => item[0] === feature)?.[1] || feature}`,
            font: { size: 16, color: "#374151" },
            x: 0.5,
            xanchor: "center"
          },
          autosize: true,
          margin: {
            l: 60,
            r: 50,
            t: 60,
            b: 80,
          },
          xaxis: {
            title: {
              text: featureList.find((item) => item[0] === feature)?.[1] || feature,
              font: { size: 14, color: "#374151" },
              standoff: 20
            },
            automargin: true,
            tickfont: { size: 12, color: "#6B7280" },
            tickangle: 0
          },
          yaxis: {
            title: {
              text: "Average Prediction Probability",
              font: { size: 14, color: "#374151" },
              standoff: 20
            },
            automargin: true,
            tickfont: { size: 12, color: "#6B7280" },
            tickformat: ".3f"
          },
          font: {
            family: "Arial, sans-serif",
          },
          barmode: "group", // Group bars for categorical features
          legend: {
            orientation: "h", // Horizontal orientation
            yanchor: "bottom", // Anchor to the bottom
            y: -0.4, // Position below the chart
            xanchor: "center", // Center the legend
            x: 0.5, // Center the legend horizontally
            font: { size: 12, color: "#374151" },
            title: { text: "Feature Values", font: { size: 12, color: "#374151" } }
          },
        }}
        config={{
          responsive: true,
          displayModeBar: true,
          displaylogo: false,
          modeBarButtonsToRemove: ["lasso2d", "select2d"],
        }}
        style={{ width: "100%", height: "100%" }}
      />
    ) : (
      // @ts-ignore
      <Plot
        data={[
          {
            type: "scatter",
            mode: "lines+markers",
            x: gridValues,
            y: averages,
            line: {
              color: "#ea580c",
              width: 2,
            },
            marker: {
              color: "#ea580c",
              size: 6,
            },
          },
        ]}
        layout={{
          autosize: true,
          margin: {
            l: 60,
            r: 30,
            t: 60,
            b: 50,
          },
          xaxis: {
            title: {
              text: featureList.find((item) => item[0] === feature)?.[1] || feature,
              font: { size: 14, color: "#374151", family: "Gabarito, Arial, sans-serif" },
              standoff: 20
            },
            automargin: true,
            tickfont: { size: 12, color: "#6B7280" },
            tickangle: 0
          },
          yaxis: {
            title: {
              text: "Average Prediction Probability",
              font: { size: 14, color: "#374151" },
              standoff: 20
            },
            automargin: true,
            tickfont: { size: 12, color: "#6B7280" },
            tickformat: ".3f"
          },
          font: {
            family: "Gabarito, Arial, sans-serif",
          },
        }}
        config={{
          responsive: true,
          displayModeBar: true,
          displaylogo: false,
          modeBarButtonsToRemove: ["lasso2d", "select2d"],
        }}
        style={{ width: "100%", height: "100%" }}
      />
    );
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <Target className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Partial Dependence Plot
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Individual feature effect on predictions
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Model</label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year1_classification">
                  Year 1 Classification
                </SelectItem>
                <SelectItem value="year2_classification">
                  Year 2 Classification
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Feature</label>
            <Select value={feature} onValueChange={setFeature}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {featureList.map((featureItem) => (
                  <SelectItem key={featureItem[0]} value={featureItem[0]}>
                    {featureItem[1]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="h-[400px] w-full">{renderContent(isCategorical)}</div>
      </CardContent>
    </Card>
  );
};

export default PartialDependencePlot;
