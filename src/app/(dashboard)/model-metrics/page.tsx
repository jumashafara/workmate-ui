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
    not_achieved_precision: number;
    not_achieved_f1_score: number;
    not_achieved_recall: number;
    not_achieved_roc_auc: number;
    version: number;
    created_at: string;
    updated_at: string;
    true_positive: number;
    false_positive: number;
    true_negative: number;
    false_negative: number;
  };
  confusion_matrix: number[][];
}

interface RegressionMetrics {
  id: number;
  name: string;
  description: string;
  file_path: string;
  r_squared: number;
  adjusted_r_squared: number;
  mean_squared_error: number;
  correlation: number;
  accuracy: number;
  version: number;
  created_at: string;
  updated_at: string;
}

// Mock API functions
const fetchClassificationModelMetrics = async (
  name: string
): Promise<ClassificationMetrics> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    model: {
      id: 1,
      name: "Year 1 Classification",
      description: "Classification model for year 1",
      file_path: "/models/year1_classification.pkl",
      accuracy: 0.82,
      achieved_precision: 0.78,
      achieved_f1_score: 0.81,
      achieved_recall: 0.85,
      achieved_roc_auc: 0.85,
      not_achieved_precision: 0.75,
      not_achieved_f1_score: 0.79,
      not_achieved_recall: 0.82,
      not_achieved_roc_auc: 0.83,
      version: 1,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      true_positive: 180,
      false_positive: 25,
      true_negative: 150,
      false_negative: 20,
    },
    confusion_matrix: [
      [150, 20],
      [25, 180],
    ],
  };
};

const fetchRegressionModelMetrics = async (
  name: string
): Promise<RegressionMetrics> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    id: 1,
    name: "Year 1 Regression",
    description: "Regression model for year 1",
    file_path: "/models/year1_regression.pkl",
    r_squared: 0.76,
    adjusted_r_squared: 0.75,
    mean_squared_error: 0.15,
    correlation: 0.87,
    accuracy: 0.82,
    version: 1,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  };
};

export default function ModelMetricsPage() {
  const [classificationModelMetrics, setClassificationModelMetrics] =
    useState<ClassificationMetrics | null>(null);
  const [confusionMatrixData, setConfusionMatrixData] = useState<any>(null);
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
        setConfusionMatrixData(data.confusion_matrix);
        setRegressionModelMetrics(null);
      } else {
        const metrics = await fetchRegressionModelMetrics(name);
        setRegressionModelMetrics(metrics);
        setClassificationModelMetrics(null);
        setConfusionMatrixData(null);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Model Metrics</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Evaluate model performance with detailed metrics and visualizations.
          </p>
        </div>

        {/* Model Selector */}
        <div className="space-y-2">
          <Label htmlFor="model-select">Select Model</Label>
          <Select
            value={modelOptions.find((m) => m.value === model.name)?.id}
            onValueChange={handleModelChange}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {modelOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Model Statistics Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {model.type === "classification" ? "Classification" : "Regression"}{" "}
            Model Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-32 w-full" />
          ) : model.type === "classification" ? (
            <ClassificationModelStatsTable
              model_metrics={classificationModelMetrics?.model || null}
            />
          ) : (
            <RegressionModelStatsTable model_metrics={regressionModelMetrics} />
          )}
        </CardContent>
      </Card>

      {/* Classification-specific visualizations */}
      {model.type === "classification" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Confusion Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Confusion Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[400px]">
                {loading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <ConfusionMatrix
                    confusion_matrix_data={confusionMatrixData}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* ROC Curve */}
          <Card>
            <CardHeader>
              <CardTitle>ROC Curve</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[400px]">
                {loading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <ROCCurve
                    aucScore={
                      classificationModelMetrics?.model?.achieved_roc_auc
                    }
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Regression-specific visualizations can be added here */}
      {model.type === "regression" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Residual Plot</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  Residual plot visualization would go here
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feature Importance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  Feature importance chart would go here
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {model.type === "classification" && classificationModelMetrics ? (
              <>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {(classificationModelMetrics.model.accuracy * 100).toFixed(
                      1
                    )}
                    %
                  </div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {(
                      classificationModelMetrics.model.achieved_precision * 100
                    ).toFixed(1)}
                    %
                  </div>
                  <div className="text-sm text-gray-600">Precision</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {(
                      classificationModelMetrics.model.achieved_recall * 100
                    ).toFixed(1)}
                    %
                  </div>
                  <div className="text-sm text-gray-600">Recall</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {classificationModelMetrics.model.achieved_roc_auc.toFixed(
                      3
                    )}
                  </div>
                  <div className="text-sm text-gray-600">ROC AUC</div>
                </div>
              </>
            ) : (
              regressionModelMetrics && (
                <>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {regressionModelMetrics.r_squared.toFixed(3)}
                    </div>
                    <div className="text-sm text-gray-600">R² Score</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.sqrt(
                        regressionModelMetrics.mean_squared_error
                      ).toFixed(3)}
                    </div>
                    <div className="text-sm text-gray-600">RMSE</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {regressionModelMetrics.correlation.toFixed(3)}
                    </div>
                    <div className="text-sm text-gray-600">Correlation</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {regressionModelMetrics.mean_squared_error.toFixed(3)}
                    </div>
                    <div className="text-sm text-gray-600">MSE</div>
                  </div>
                </>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
