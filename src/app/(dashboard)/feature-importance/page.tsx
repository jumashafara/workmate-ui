"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

// Dynamically import chart components
const FeatureImportanceChart = dynamic(() => import("@/components/charts/FeatureImportanceChart"), { 
  ssr: false,
  loading: () => <Skeleton className="h-96 w-full" />
});

const VariableDescriptions = dynamic(() => import("@/components/tables/FeatureDescriptions"), { 
  ssr: false,
  loading: () => <Skeleton className="h-64 w-full" />
});

const PartialDependencePlot = dynamic(() => import("@/components/charts/PartialDependencePlot"), { 
  ssr: false,
  loading: () => <Skeleton className="h-96 w-full" />
});

const TwoWayPartialDependenceHeatMap = dynamic(() => import("@/components/charts/TwoWayPartialDependenceHeatMap"), { 
  ssr: false,
  loading: () => <Skeleton className="h-96 w-full" />
});

export default function FeatureImportancePage() {
  // Mock data - replace with actual API calls
  const featureNames: string[] = [];
  const importances: number[] = [];
  const variables: any[] = [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Feature Importance
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Understand which features contribute most to model predictions and how they interact.
        </p>
      </div>

      {/* Variable Descriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Variable Descriptions</CardTitle>
          <CardDescription>
            Detailed descriptions of all features used in the prediction model.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VariableDescriptions variables={variables} />
        </CardContent>
      </Card>

      {/* Feature Importance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Importance Rankings</CardTitle>
          <CardDescription>
            Visual representation of feature importance scores showing which variables have the most impact on predictions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[500px]">
            <FeatureImportanceChart 
              featureNames={featureNames} 
              importances={importances} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Partial Dependence Plot */}
      <Card>
        <CardHeader>
          <CardTitle>Partial Dependence Plot</CardTitle>
          <CardDescription>
            Shows how individual features affect predictions while keeping other features constant.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[500px]">
            <PartialDependencePlot />
          </div>
        </CardContent>
      </Card>

      {/* Two-Way Partial Dependence Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Two-Way Feature Interactions</CardTitle>
          <CardDescription>
            Heatmap showing how pairs of features interact and influence predictions together.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[500px]">
            <TwoWayPartialDependenceHeatMap />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}