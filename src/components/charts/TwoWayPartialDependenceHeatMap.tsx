// this component is used to display the two way partial dependence heat map using plotly

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
import { Activity, Loader2 } from "lucide-react";
import { fetch2DPartialDependence } from "@/utils/model-metrics";

interface TwoWayPartialDependenceHeatMapProps {
  defaultModel?: string;
  defaultFeature1?: string;
  defaultFeature2?: string;
}

const TwoWayPartialDependenceHeatMap: React.FC<
  TwoWayPartialDependenceHeatMapProps
> = ({
  defaultModel = "year1_classification",
  defaultFeature1 = "farm_implements_owned",
  defaultFeature2 = "tot_hhmembers",
}) => {
  const [model, setModel] = useState<string>(defaultModel);
  const [feature1, setFeature1] = useState<string>(defaultFeature1);
  const [feature2, setFeature2] = useState<string>(defaultFeature2);
  const [pdpData, setPdpData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const featureList = [
    // ["Land_size_for_Crop_Agriculture_Acres", "Agriculture land size (acres)"],
    ["farm_implements_owned", "Farm implements owned"],
    ["tot_hhmembers", "Household members"],
    [
      "Distance_travelled_one_way_OPD_treatment",
      "Distance travelled to OPD treatment (one way)",
    ],
    ["Average_Water_Consumed_Per_Day", "Average water consumed per day"],
    ["hh_water_collection_Minutes", "Water collection time (minutes)"],
    ["composts_num", "Number of composts"],
    // ["education_level_encoded", "Education level"],
    // ["vsla_participation", "VSLA participation"],
    // ["ground_nuts", "Groundnuts"],
    // ["perennial_crops_grown_food_banana", "Food banana"],
    // ["sweet_potatoes", "Sweet potatoes"],
    // ["perennial_crops_grown_coffee", "Coffee"],
    // ["irish_potatoes", "Irish potatoes"],
    // ["business_participation", "Business participation"],
    // ["cassava", "Cassava"],
    // ["hh_produce_lq_manure", "Manure"],
    // ["hh_produce_organics", "Organics"],
    // ["maize", "Maize"],
    // ["sorghum", "Sorghum"],
  ].sort((a, b) => a[1].localeCompare(b[1]));

  useEffect(() => {
    const loadPdpData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetch2DPartialDependence(model, feature1, feature2);
        setPdpData(data);
        console.log("pdp data x", data.z);
      } catch (error) {
        console.error("Error loading 2D PDP data:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load 2D PDP data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadPdpData();
  }, [model, feature1, feature2]);

  const renderContent = () => {
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

    if (!pdpData || !pdpData.x || !pdpData.y || !pdpData.z) {
      return (
        <div className="p-4">
          <Alert>
            <AlertDescription>
              No 2D partial dependence data available for these features.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    // Get feature display names
    const feature1Display =
      featureList.find((f) => f[0] === feature1)?.[1] || feature1;
    const feature2Display =
      featureList.find((f) => f[0] === feature2)?.[1] || feature2;

    return (
      <Plot
        data={[
          {
            type: "heatmap",
            x: pdpData.x,
            y: pdpData.y,
            z: pdpData.z,
            text: pdpData.z.map((row: number[]) =>
              row.map((val) => val.toFixed(3))
            ),
            texttemplate: "%{text}",
            hoverinfo: "x+y+z",
            colorscale: "YlOrRd",
            colorbar: {
              // @ts-ignore
              title: "Predicted Value",
              titleside: "right",
            },
          },
        ]}
        layout={{
          title: "",
          autosize: true,
          margin: {
            l: 70,
            r: 70,
            t: 30,
            b: 70,
          },
          xaxis: {
            title: { text: feature1Display },
            automargin: true,
          },
          yaxis: {
            title: { text: feature2Display },
            automargin: true,
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
        style={{ width: "100%", height: "400px" }}
      />
    );
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Two-Way Partial Dependence
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Feature interaction effects heatmap
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
          <div className="flex flex-row gap-2 mb-2">
            <div className="flex flex-col">
              <label className="text-xs font-medium">Model</label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="text-xs h-8 min-w-[120px]">
                  <SelectValue className="text-xs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="year1_classification" className="text-xs">
                    Year 1 Classification
                  </SelectItem>
                  <SelectItem value="year2_classification" className="text-xs">
                    Year 2 Classification
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium">Feature 1</label>
              <Select value={feature1} onValueChange={setFeature1}>
                <SelectTrigger className="text-xs h-8 min-w-[120px]">
                  <SelectValue className="text-xs" />
                </SelectTrigger>
                <SelectContent>
                  {featureList.map(([value, label]) => (
                    <SelectItem key={value} value={value} className="text-xs">
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium">Feature 2</label>
              <Select value={feature2} onValueChange={setFeature2}>
                <SelectTrigger className="text-xs h-8 min-w-[120px]">
                  <SelectValue className="text-xs" />
                </SelectTrigger>
                <SelectContent>
                  {featureList.map(([value, label]) => (
                    <SelectItem key={value} value={value} className="text-xs">
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="w-full h-[400px] pb-12">{renderContent()}</div>
      </CardContent>
    </Card>
  );
};

export default TwoWayPartialDependenceHeatMap;
