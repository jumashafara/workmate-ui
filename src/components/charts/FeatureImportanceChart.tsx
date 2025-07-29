import React, { useEffect, useState } from "react";
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { API_ENDPOINT } from "@/utils/endpoints";
interface FeatureImportanceChartProps {
  featureNames?: string[];
  importances?: number[];
}

const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({
  featureNames: propFeatureNames,
  importances: propImportances,
}) => {
  const [featureNames, setFeatureName] = useState<string[]>(
    propFeatureNames || []
  );
  const [importances, setImportances] = useState<number[]>(
    propImportances || []
  );
  const [model, setModel] = useState<string>("year1_classification");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getFeatureImportances = async (model: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${API_ENDPOINT}/models/feature-importances/?model=${model}`
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("Feature importances data:", data);

      if (!data.feature_importances) {
        throw new Error("No feature importances data returned from API");
      }

      return data;
    } catch (error) {
      console.error("Error fetching feature importances:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load feature importances"
      );
      return { feature_importances: {} };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      !propFeatureNames ||
      !propImportances ||
      propFeatureNames.length === 0 ||
      propImportances.length === 0
    ) {
      getFeatureImportances(model).then((data) => {
        if (data && data.feature_importances) {
          const features = Object.keys(data.feature_importances);
          const importances = Object.values(
            data.feature_importances
          ) as number[];
          setFeatureName(features);
          setImportances(importances);
        }
      });
    } else {
      setFeatureName(propFeatureNames);
      setImportances(propImportances);
      setLoading(false);
    }
  }, [model, propFeatureNames, propImportances]);

  // Sort features by importance
  const sortedData = featureNames
    .map((name, index) => ({
      name,
      importance: importances[index] || 0,
    }))
    .sort((a, b) => b.importance - a.importance);

  const sortedFeatureNames = sortedData.map((item) => item.name);
  const sortedImportances = sortedData.map((item) => item.importance);

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

    if (sortedFeatureNames.length === 0 || sortedImportances.length === 0) {
      return (
        <div className="p-4">
          <Alert>
            <AlertDescription>
              No feature importance data available for this model.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return (
      // @ts-ignore
      <Plot
        data={[
          {
            type: "bar",
            x: sortedImportances,
            y: sortedFeatureNames,
            orientation: "h",
            marker: {
              color: "#ea580c",
            },
          },
        ]}
        layout={{
          title: "",
          autosize: true,
          margin: {
            l: 150, // Increased left margin for feature names
            r: 30,
            t: 10,
            b: 50,
          },
          xaxis: {
            title: "Importance",
            automargin: true,
          },
          yaxis: {
            title: "Features",
            automargin: true,
          },
          font: {
            family: "Arial, sans-serif",
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
      <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Feature Importance Chart</CardTitle>
            <CardDescription>
              What were the most important features?
            </CardDescription>
          </div>
          <CardAction>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select model" />
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
          </CardAction>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[400px] w-full">{renderContent()}</div>
      </CardContent>
    </Card>
  );
};

export default FeatureImportanceChart;
