"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  BarChart3,
  Settings,
  Target,
  Activity,
  Zap,
} from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import chart components
const FeatureImportanceChart = dynamic(
  () => import("@/components/charts/FeatureImportanceChart"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-96 w-full" />,
  }
);

const VariableDescriptions = dynamic(
  () => import("@/components/tables/FeatureDescriptions"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-64 w-full" />,
  }
);

const PartialDependencePlot = dynamic(
  () => import("@/components/charts/PartialDependencePlot"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-96 w-full" />,
  }
);

const TwoWayPartialDependenceHeatMap = dynamic(
  () => import("@/components/charts/TwoWayPartialDependenceHeatMap"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-96 w-full" />,
  }
);

export default function FeatureImportancePage() {
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState<{ name: string; type: string }>({
    name: "year1_classification",
    type: "classification",
  });

  const modelOptions = [
    {
      id: "1",
      name: "Year 1 Classification",
      value: "year1_classification",
      type: "classification",
    },
    {
      id: "2",
      name: "Year 2 Classification",
      value: "year2_classification",
      type: "classification",
    },
    {
      id: "3",
      name: "Year 1 Regression",
      value: "year1_regression",
      type: "regression",
    },
    {
      id: "4",
      name: "Year 2 Regression",
      value: "year2_regression",
      type: "regression",
    },
  ];

  // Mock data - replace with actual API calls
  const featureNames: string[] = [];
  const importances: number[] = [];
  const variables: any[] = [];

  const handleModelChange = (selectedValue: string) => {
    const selectedModel = modelOptions.find((m) => m.id === selectedValue);
    if (selectedModel) {
      setModel({ name: selectedModel.value, type: selectedModel.type });
    }
  };

  return (
    <div className="space-y-6 pb-60">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <Zap className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Feature Importance
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                See which features matter most and how they interact
              </p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <TrendingUp className="h-4 w-4" />
                  <span>Feature Analysis</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Target className="h-4 w-4" />
                  <span>Variable Impact</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Activity className="h-4 w-4" />
                  <span>Dependency Plots</span>
                </div>
              </div>
            </div>
          </div>

          {/* Model Selector */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 min-w-[280px]">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <Label
                htmlFor="model-select"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Active Model
              </Label>
            </div>
            <Select
              value={modelOptions.find((m) => m.value === model.name)?.id}
              onValueChange={handleModelChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {modelOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`text-xs ${
                          option.type === "classification"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }`}
                      >
                        {option.type}
                      </Badge>
                      {option.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Current:{" "}
              <span className="text-orange-600 dark:text-orange-400 font-medium">
                {modelOptions.find((m) => m.value === model.name)?.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Variable Descriptions */}
      <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <BarChart3 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Variable Descriptions
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Detailed information about each feature in the model
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <VariableDescriptions variables={variables} />
          )}
        </CardContent>
      </Card>

      {/* Feature Importance Chart */}

      {loading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <FeatureImportanceChart
          featureNames={featureNames}
          importances={importances}
        />
      )}

      {/* Dependency Analysis */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Partial Dependence Plot */}

        <div className="w-full h-[400px]">
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <PartialDependencePlot />
          )}
        </div>

        {/* Two-Way Partial Dependence Heatmap */}

        <div className="w-full h-[400px]">
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <TwoWayPartialDependenceHeatMap />
          )}
        </div>
      </div>
    </div>
  );
}
