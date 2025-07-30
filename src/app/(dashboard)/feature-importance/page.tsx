"use client";

import { Skeleton } from "@/components/ui/skeleton";
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
          Understand which features contribute most to model predictions and how
          they interact.
        </p>
      </div>

      {/* Variable Descriptions */}

      <VariableDescriptions variables={variables} />

      <FeatureImportanceChart
        featureNames={featureNames}
        importances={importances}
      />

      {/* Partial Dependence Plot */}

      <PartialDependencePlot />

      {/* Two-Way Partial Dependence Heatmap */}

      <TwoWayPartialDependenceHeatMap />
    </div>
  );
}
