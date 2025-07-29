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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Records Chart */}
      <Card className="h-80">
        <CardHeader>
          <CardTitle className="text-center">Total Records</CardTitle>
        </CardHeader>
        <CardContent>
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
              width: 250,
              height: 200,
              margin: { t: 20, b: 20, l: 20, r: 20 },
              font: { color: "#1c2434" },
            }}
            config={{ displayModeBar: false }}
          />
        </CardContent>
      </Card>

      {/* Achieved Chart */}
      <Card className="h-80">
        <CardHeader>
          <CardTitle className="text-center">Achieved</CardTitle>
        </CardHeader>
        <CardContent>
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
              width: 250,
              height: 200,
              margin: { t: 20, b: 20, l: 20, r: 20 },
              showlegend: false,
              font: { color: "#1c2434" },
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
            config={{ displayModeBar: false }}
          />
        </CardContent>
      </Card>

      {/* Average Income Chart */}
      <Card className="h-80">
        <CardHeader>
          <CardTitle className="text-center">
            Average Income + Production
          </CardTitle>
        </CardHeader>
        <CardContent>
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
              width: 250,
              height: 200,
              margin: { t: 20, b: 20, l: 20, r: 20 },
              font: { size: 12, color: "#1c2434" },
            }}
            config={{ displayModeBar: false }}
          />
        </CardContent>
      </Card>

      {/* Filtered Records Chart */}
      <Card className="h-80">
        <CardHeader>
          <CardTitle className="text-center">Filtered Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Plot
            data={[
              {
                type: "indicator",
                mode: "number+delta",
                value: filteredRecords,
                delta: {
                  reference: totalRecords,
                  valueformat: ".0f",
                  relative: false,
                  position: "bottom",
                },
                title: {
                  text: `of ${totalRecords} total`,
                  font: { size: 14, color: "#1c2434" },
                },
                number: {
                  font: { size: 40, color: "#EA580C" },
                },
              },
            ]}
            layout={{
              width: 250,
              height: 200,
              margin: { t: 20, b: 20, l: 20, r: 20 },
              font: { color: "#1c2434" },
            }}
            config={{ displayModeBar: false }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
