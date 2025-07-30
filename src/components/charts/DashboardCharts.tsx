import React from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

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
  totalCount: number;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({
  data,
  totalCount,
}) => {
  // Calculate metrics
  const totalRecords = totalCount;
  const filteredRecords = data.length;
  const achievedCount = data.filter((p) => p.prediction === 1).length;
  const achievedPercentage =
    data.length > 0 ? (achievedCount / data.length) * 100 : 0;
  const avgIncome =
    data.length > 0
      ? data.reduce((sum, item) => sum + (item.predicted_income || 0), 0) /
        data.length
      : 0;

  // Calculate insights for filtered data
  const insights = React.useMemo(() => {
    if (data.length === 0) {
      return {
        regions: 0,
        districts: 0,
        clusters: 0,
        cohorts: 0,
        avgProbability: 0,
        incomeRange: { min: 0, max: 0 },
        filterPercentage: 0
      };
    }

    const uniqueRegions = new Set(data.map(d => d.region)).size;
    const uniqueDistricts = new Set(data.map(d => d.district)).size;
    const uniqueClusters = new Set(data.map(d => d.cluster)).size;
    const uniqueCohorts = new Set(data.map(d => d.cohort)).size;
    
    // Filter out records with valid probability values
    const recordsWithProbability = data.filter(item => item.probability != null && !isNaN(item.probability));
    const avgProbability = recordsWithProbability.length > 0 
      ? recordsWithProbability.reduce((sum, item) => sum + item.probability, 0) / recordsWithProbability.length
      : 0;
    
    const incomes = data.map(d => d.predicted_income).filter(income => income > 0);
    const incomeRange = {
      min: incomes.length > 0 ? Math.min(...incomes) : 0,
      max: incomes.length > 0 ? Math.max(...incomes) : 0
    };
    
    const filterPercentage = totalRecords > 0 ? (filteredRecords / totalRecords) * 100 : 0;

    return {
      regions: uniqueRegions,
      districts: uniqueDistricts,
      clusters: uniqueClusters,
      cohorts: uniqueCohorts,
      avgProbability: avgProbability * 100,
      incomeRange,
      filterPercentage
    };
  }, [data, totalRecords, filteredRecords]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Records Chart */}
      <Card className="h-80 flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="text-center">Total Records</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center p-4">
          <div className="w-full h-full flex items-center justify-center">
            <Plot
              data={[
                {
                  type: "indicator",
                  mode: "number",
                  value: totalRecords,
                  title: {
                    text: "records",
                    font: { size: 14, color: "#1c2434" },
                  },
                  number: {
                    font: { size: 40, color: "#EA580C" },
                  },
                },
              ]}
              layout={{
                autosize: true,
                margin: { t: 20, b: 20, l: 20, r: 20 },
                font: { color: "#1c2434" },
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent'
              }}
              config={{ displayModeBar: false, responsive: true }}
              style={{ width: '100%', height: '100%' }}
              useResizeHandler={true}
            />
          </div>
        </CardContent>
      </Card>

      {/* Achieved Chart */}
      <Card className="h-80 flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="text-center">Achieved</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center p-4">
          <div className="w-full h-full flex items-center justify-center">
            <Plot
              data={[
                {
                  type: "pie",
                  values: [achievedCount, data.length - achievedCount],
                  labels: ["Achieved", "Not Achieved"],
                  marker: {
                    colors: ["#EA580C", "#1c2434"],
                  },
                  textinfo: "label+percent",
                  hovertemplate:
                    "<b>%{label}</b><br>Count: %{value}<br>Percentage: %{percent}<extra></extra>",
                  hole: 0.4,
                },
              ]}
              layout={{
                autosize: true,
                margin: { t: 20, b: 20, l: 20, r: 20 },
                showlegend: false,
                font: { color: "#1c2434" },
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent',
                annotations: [
                  {
                    text: `${achievedPercentage.toFixed(1)}%`,
                    x: 0.5,
                    y: 0.5,
                    font: { size: 20, color: "#EA580C" },
                    showarrow: false,
                  },
                ],
              }}
              config={{ displayModeBar: false, responsive: true }}
              style={{ width: '100%', height: '100%' }}
              useResizeHandler={true}
            />
          </div>
        </CardContent>
      </Card>

      {/* Average Income Chart */}
      <Card className="h-80 flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="text-center">
            Average Income + Production
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center p-4">
          <div className="w-full h-full flex items-center justify-center">
            <Plot
              data={[
                {
                  type: "indicator",
                  mode: "gauge+number",
                  value: avgIncome,
                  title: { text: "USD", font: { size: 14, color: "#1c2434" } },
                  number: {
                    font: { size: 30, color: "#EA580C" },
                    prefix: "$",
                    suffix: "",
                  },
                  gauge: {
                    axis: { range: [0, Math.max(avgIncome * 2, 3)] },
                    bar: { color: "#EA580C" },
                    steps: [
                      { range: [0, avgIncome * 0.5], color: "#f3f4f6" },
                      {
                        range: [avgIncome * 0.5, avgIncome * 1.5],
                        color: "#e5e7eb",
                      },
                    ],
                    threshold: {
                      line: { color: "#1c2434", width: 4 },
                      thickness: 0.75,
                      value: avgIncome * 1.2,
                    },
                  },
                },
              ]}
              layout={{
                autosize: true,
                margin: { t: 20, b: 20, l: 20, r: 20 },
                font: { size: 12, color: "#1c2434" },
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent'
              }}
              config={{ displayModeBar: false, responsive: true }}
              style={{ width: '100%', height: '100%' }}
              useResizeHandler={true}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Insights Chart */}
      <Card className="h-80 flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="text-center">Data Insights</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-4">
          <div className="h-full flex flex-col justify-between text-sm">
            {/* Main Metric - Removed percentage display */}
            
            {/* Geographic Coverage */}
            <div className="space-y-2 text-xs">
              <div className="font-semibold text-gray-700 border-b pb-1">Geographic Coverage</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Regions:</span>
                  <span className="font-medium text-[#EA580C]">{insights.regions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Districts:</span>
                  <span className="font-medium text-[#EA580C]">{insights.districts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Clusters:</span>
                  <span className="font-medium text-[#EA580C]">{insights.clusters}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cohorts:</span>
                  <span className="font-medium text-[#EA580C]">{insights.cohorts}</span>
                </div>
              </div>
            </div>
            
            {/* Model Performance */}
            <div className="space-y-2 text-xs">
              <div className="font-semibold text-gray-700 border-b pb-1">Model Performance</div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Confidence:</span>
                <span className="font-medium text-[#EA580C]">
                  {insights.avgProbability > 0 ? `${insights.avgProbability.toFixed(1)}%` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Success Rate:</span>
                <span className="font-medium text-[#EA580C]">{achievedPercentage.toFixed(1)}%</span>
              </div>
            </div>
            
            {/* Income Range */}
            {insights.incomeRange.max > 0 && (
              <div className="space-y-2 text-xs">
                <div className="font-semibold text-gray-700 border-b pb-1">Income Range</div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Min - Max:</span>
                  <span className="font-medium text-[#EA580C]">
                    ${insights.incomeRange.min.toFixed(0)} - ${insights.incomeRange.max.toFixed(0)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
