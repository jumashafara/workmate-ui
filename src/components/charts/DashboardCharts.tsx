import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Map,
  Building,
  DollarSign,
  TrendingUp,
  Target,
} from "lucide-react";

interface PredictionData {
  id: number;
  household_id: string;
  cohort: string;
  cycle: string;
  region: string;
  district: string;
  cluster: string;
  village: string;
  latitude: number;
  longitude: number;
  altitude: number;
  evaluation_month: number;
  prediction: number;
  probability: number;
  predicted_income: number;
}

interface DashboardChartsProps {
  data: PredictionData[];
}

// Helper function to calculate average
const getAverage = (arr: number[]) => {
  if (arr.length === 0) return 0;
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
};

// Aggregation function
const aggregateData = (
  data: PredictionData[],
  groupBy: "region" | "district" | "cluster"
) => {
  const grouped = data.reduce((acc, item) => {
    const key = item[groupBy];
    if (!key) return acc;

    if (!acc[key]) {
      acc[key] = {
        predictions: [],
        incomes: [],
        count: 0,
      };
    }
    acc[key].predictions.push(item.prediction);
    acc[key].incomes.push(item.predicted_income);
    acc[key].count++;
    return acc;
  }, {} as Record<string, { predictions: number[]; incomes: number[]; count: number }>);

  return Object.entries(grouped)
    .map(([name, values]) => ({
      name,
      avg_prediction: getAverage(values.predictions) * 100, // As percentage
      avg_income: getAverage(values.incomes),
      count: values.count,
    }))
    .sort((a, b) => b.avg_prediction - a.avg_prediction); // Sort by highest achievement
};

const AggregationCard: React.FC<{
  title: string;
  data: {
    name: string;
    avg_prediction: number;
    avg_income: number;
    count: number;
  }[];
  icon: React.ReactNode;
}> = ({ title, data, icon }) => (
  <Card className="h-auto">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg">
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-2 text-sm max-h-48 overflow-y-auto">
      {data.length > 0 ? (
        data.map((item) => (
          <div
            key={item.name}
            className="flex justify-between items-center p-2 rounded-md bg-gray-50 dark:bg-gray-800"
          >
            <div className="font-medium">{item.name}</div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-500" />
                <span>{item.avg_prediction.toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-orange-500" />
                <span>${item.avg_income.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">No data to display.</div>
      )}
    </CardContent>
  </Card>
);

const DashboardCharts: React.FC<DashboardChartsProps> = ({ data }) => {
  const regionData = aggregateData(data, "region");
  const districtData = aggregateData(data, "district");
  const clusterData = aggregateData(data, "cluster");

  // Overall Summary
  const totalAchieved = data.filter((p) => p.prediction === 1).length;
  const overallAchievedPercentage =
    data.length > 0 ? (totalAchieved / data.length) * 100 : 0;
  const overallAverageIncome = getAverage(data.map((d) => d.predicted_income));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Overall Summary Card */}
      <Card className="lg:col-span-1 h-auto bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-blue-800 dark:text-blue-200">
            <TrendingUp />
            Overall Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {overallAchievedPercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              Achieved Goal
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              ${overallAverageIncome.toFixed(2)}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              Avg. Income
            </div>
          </div>
          <div className="text-center text-xs text-gray-500 pt-2">
            Based on {data.length.toLocaleString()} records
          </div>
        </CardContent>
      </Card>

      {/* Region Card */}
      <AggregationCard
        title="By Region"
        data={regionData}
        icon={<Map className="h-5 w-5 text-orange-500" />}
      />

      {/* District Card */}
      <AggregationCard
        title="By District"
        data={districtData}
        icon={<Building className="h-5 w-5 text-orange-500" />}
      />

      {/* Cluster Card */}
      <AggregationCard
        title="By Cluster"
        data={clusterData}
        icon={<Users className="h-5 w-5 text-orange-500" />}
      />
    </div>
  );
};

export default DashboardCharts;
