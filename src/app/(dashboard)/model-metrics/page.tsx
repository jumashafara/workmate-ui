"use client";

import { useState, useEffect } from "react";
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
  Brain,
  BarChart3,
  Settings,
  TrendingUp,
  Target,
  Activity,
} from "lucide-react";
import dynamic from "next/dynamic";
import { API_ENDPOINT } from "@/utils/endpoints";

// Dynamically import chart components
const ConfusionMatrix = dynamic(
  () => import("@/components/charts/ConfusionMatrix"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-96 w-full" />,
  }
);

const ROCCurve = dynamic(() => import("@/components/charts/ROCAUC"), {
  ssr: false,
  loading: () => <Skeleton className="h-96 w-full" />,
});

const ClassificationModelStatsTable = dynamic(
  () => import("@/components/tables/ClassificationModelMetrics"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-64 w-full" />,
  }
);

const RegressionModelStatsTable = dynamic(
  () => import("@/components/tables/RegressionModelMetrics"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-64 w-full" />,
  }
);

const ResidualPlot = dynamic(
  () => import("@/components/charts/ResidualPlot"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-96 w-full" />,
  }
);

const ActualVsPredicted = dynamic(
  () => import("@/components/charts/ActualVsPredicted"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-96 w-full" />,
  }
);

interface ClassificationMetrics {
  model: {
    id: number;
    name: string;
    description: string;
    file_path: string;
    accuracy: number;
    achieved_precision: number;
    achieved_f1_score: number;
    achieved_recall: number;
    achieved_roc_auc: number;
    not_achived_precision: number;
    not_achived_f1_score: number;
    not_achived_recall: number;
    not_achived_roc_auc: number;
    version: string;
    created_at: string;
    updated_at: string;
    true_positive: number;
    false_positive: number;
    true_negative: number;
    false_negative: number;
  };
  confusion_matrix: {
    true_negatives: number;
    false_negatives: number;
    true_positives: number;
    false_positives: number;
  };
}

interface RegressionMetrics {
  model: {
    id: number;
    name: string;
    description: string;
    file_path: string;
    r_squared: number;
    adjusted_r_squared: number;
    mean_squared_error: number;
    correlation: number;
    accuracy: number;
    version: string;
    created_at: string;
    updated_at: string;
  };
  y_pred: number[];
  y_test: number[];
}

// Mock API functions
const fetchClassificationModelMetrics = async (
  name: string
): Promise<ClassificationMetrics> => {
  try {
    const response = await fetch(`${API_ENDPOINT}/models/classification/${name}/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch classification model metrics:', error);
    throw error;
  }
};

const fetchRegressionModelMetrics = async (
  name: string
): Promise<RegressionMetrics> => {
  try {
    const response = await fetch(`${API_ENDPOINT}/models/regression/${name}/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch regression model metrics:', error);
    throw error;
  }
};

export default function ModelMetricsPage() {
  const [classificationModelMetrics, setClassificationModelMetrics] =
    useState<ClassificationMetrics | null>(null);
  const [regressionModelMetrics, setRegressionModelMetrics] =
    useState<RegressionMetrics | null>(null);
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

  const getModelMetrics = async (name: string, type: string) => {
    setLoading(true);
    try {
      if (type === "classification") {
        const data = await fetchClassificationModelMetrics(name);
        setClassificationModelMetrics(data);
        setRegressionModelMetrics(null);
      } else {
        const metrics = await fetchRegressionModelMetrics(name);
        setRegressionModelMetrics(metrics);
        setClassificationModelMetrics(null);
      }
    } catch (error) {
      console.error("Failed to fetch model metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getModelMetrics(model.name, model.type);
  }, [model.name, model.type]);

  const handleModelChange = (selectedValue: string) => {
    const selectedModel = modelOptions.find((m) => m.id === selectedValue);
    if (selectedModel) {
      setModel({ name: selectedModel.value, type: selectedModel.type });
    }
  };

  return (
    <div className="space-y-6 pb-80">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <Brain className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Model Metrics
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                Advanced model metrics & interactive charts
              </p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <BarChart3 className="h-4 w-4" />
                  <span>Performance Metrics</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Target className="h-4 w-4" />
                  <span>Model Accuracy</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Activity className="h-4 w-4" />
                  <span>Real-time Evaluation</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Model Selector - Moved to extreme right */}
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

      {/* Model Statistics Table */}
      <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Model Performance Summary
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Key metrics and statistics for the selected {model.type} model
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-32 w-full" />
          ) : model.type === "classification" ? (
            <ClassificationModelStatsTable
              model_metrics={classificationModelMetrics?.model || null}
            />
          ) : (
            <RegressionModelStatsTable model_metrics={regressionModelMetrics?.model || null} />
          )}
        </CardContent>
      </Card>

      {/* Classification-specific visualizations */}
      {model.type === "classification" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Confusion Matrix */}

          <div className="w-full h-[400px]">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ConfusionMatrix
                confusion_matrix_data={
                  classificationModelMetrics?.confusion_matrix
                }
              />
            )}
          </div>

          {/* ROC Curve */}

          <div className="w-full h-[400px]">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ROCCurve
                aucScore={classificationModelMetrics?.model?.achieved_roc_auc}
              />
            )}
          </div>
        </div>
      )}

      {/* Regression-specific visualizations */}
      {model.type === "regression" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="w-full h-[400px]">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResidualPlot
                y_pred={regressionModelMetrics?.y_pred || []}
                y_test={regressionModelMetrics?.y_test || []}
              />
            )}
          </div>

          <div className="w-full h-[400px]">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ActualVsPredicted
                y_pred={regressionModelMetrics?.y_pred || []}
                y_test={regressionModelMetrics?.y_test || []}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
