"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { Filter, X, TrendingUp, BarChart3, Users, Activity, MapPin, Building, Group } from "lucide-react";
import dynamic from "next/dynamic";
import { API_ENDPOINT } from "@/utils/endpoints";
import { useCurrency } from "@/contexts/CurrencyContext";
import { PredictionData } from "@/types/predictions";
import { getUserData } from "@/utils/cookie";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface ClusterIncomeData {
  cluster: string;
  evaluation_month: number;
  avg_income: number;
  household_count: number;
  achievement_rate: number;
  region: string;
  district: string;
}

interface FilterOption {
  value: string;
  label: string;
}

export default function AreaManagerTrendsPage() {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const data = getUserData();
    setUserData(data);
  }, []);

  const region = userData?.region;

  const { currency, formatCurrency, exchangeRate } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ClusterIncomeData[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedClusters, setSelectedClusters] = useState<string[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);

  // Filter options
  const [districtOptions, setDistrictOptions] = useState<FilterOption[]>([]);
  const [clusterOptions, setClusterOptions] = useState<FilterOption[]>([]);
  const [monthOptions, setMonthOptions] = useState<FilterOption[]>([]);

  // Process raw data into cluster-month aggregations
  const processClusterData = (
    predictions: PredictionData[]
  ): ClusterIncomeData[] => {
    const groupedData: { [key: string]: any } = {};

    predictions.forEach((pred) => {
      const key = `${pred.cluster}-${pred.evaluation_month}-${pred.region}-${pred.district}`;

      if (!groupedData[key]) {
        groupedData[key] = {
          cluster: pred.cluster,
          evaluation_month: pred.evaluation_month,
          region: pred.region,
          district: pred.district,
          incomes: [],
          achievements: [],
        };
      }

      groupedData[key].incomes.push(pred.predicted_income || 0);
      groupedData[key].achievements.push(pred.prediction);
    });

    return Object.values(groupedData).map((group: any) => ({
      cluster: group.cluster,
      evaluation_month: group.evaluation_month,
      region: group.region,
      district: group.district,
      avg_income:
        group.incomes.length > 0
          ? group.incomes.reduce(
              (sum: number, income: number) => sum + income,
              0
            ) / group.incomes.length
          : 0,
      household_count: group.incomes.length,
      achievement_rate:
        group.achievements.length > 0
          ? (group.achievements.reduce(
              (sum: number, ach: number) => sum + ach,
              0
            ) /
              group.achievements.length) *
            100
          : 0,
    }));
  };

  // Fetch data
  const fetchData = async () => {
    if (!region) return; // Don't fetch if region is not available
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("region", region);
      if (selectedDistricts.length > 0)
        params.append("district", selectedDistricts.join(","));
      if (selectedClusters.length > 0)
        params.append("cluster", selectedClusters.join(","));
      if (selectedMonths.length > 0)
        params.append("evaluation_month", selectedMonths.join(","));

      const filterParams = new URLSearchParams();
      filterParams.append("region", region);
      if (selectedDistricts.length > 0)
        filterParams.append("district", selectedDistricts.join(","));
      if (selectedClusters.length > 0)
        filterParams.append("cluster", selectedClusters.join(","));

      const [dataResponse, filterResponse] = await Promise.all([
        fetch(`${API_ENDPOINT}/standard-evaluations/?${params.toString()}`),
        fetch(`${API_ENDPOINT}/filter-options/?${filterParams.toString()}`),
      ]);

      if (!dataResponse.ok || !filterResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const [dataResult, filterResult] = await Promise.all([
        dataResponse.json(),
        filterResponse.json(),
      ]);

      let predictions: PredictionData[] = dataResult.predictions || [];
      const clusterData = processClusterData(predictions);
      setData(clusterData);

      if (filterResult) {
        setDistrictOptions(
          filterResult.districts?.map((d: string) => ({
            value: d,
            label: d,
          })) || []
        );
        setClusterOptions(
          filterResult.clusters?.map((c: string) => ({
            value: c,
            label: c,
          })) || []
        );
        setMonthOptions(
          filterResult.evaluation_months?.map((em: number) => ({
            value: em.toString(),
            label: `Month ${em}`,
          })) || []
        );
      }
    } catch (err) {
      console.error("Data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Effect for fetching data on initial load and when filters change
  useEffect(() => {
    if (region) {
      const handler = setTimeout(() => {
        fetchData();
      }, 300);
      return () => clearTimeout(handler);
    }
  }, [region, selectedDistricts, selectedClusters, selectedMonths]);

  const clearFilters = () => {
    setSelectedDistricts([]);
    setSelectedClusters([]);
    setSelectedMonths([]);
  };

  const activeFiltersCount =
    selectedDistricts.length + selectedClusters.length + selectedMonths.length;

  // Simple linear regression function
  const linearRegression = (x: number[], y: number[]) => {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  };

  // Prepare chart data with predictions
  const getLineChartData = () => {
    const clusters = [...new Set(data.map((d) => d.cluster))];
    const allTraces: any[] = [];

    const allDataPoints: { month: number; income: number }[] = [];

    clusters.forEach((cluster) => {
      const clusterData = data
        .filter((d) => d.cluster === cluster)
        .sort((a, b) => a.evaluation_month - b.evaluation_month);

      if (clusterData.length === 0) return;

      clusterData.forEach((d) => {
        allDataPoints.push({ month: d.evaluation_month, income: currency === 'USD' ? d.avg_income : d.avg_income * exchangeRate });
      });

      const actualTrace: any = {
        x: clusterData.map((d) => d.evaluation_month),
        y: clusterData.map((d) => currency === 'USD' ? d.avg_income : d.avg_income * exchangeRate),
        type: "scatter",
        mode: "lines+markers",
        name: cluster,
        line: { width: 3 },
        marker: { size: 8 },
        hovertemplate:
          `<b>%{fullData.name}</b><br>Month: %{x}<br>Avg Income + Production: %{y}<extra></extra>`,
        showlegend: true,
      };

      allTraces.push(actualTrace);

      if (clusterData.length >= 2) {
        const xValues = clusterData.map((d) => d.evaluation_month);
        const yValues = clusterData.map((d) => currency === 'USD' ? d.avg_income : d.avg_income * exchangeRate);

        const { slope, intercept } = linearRegression(xValues, yValues);

        const lastMonth = Math.max(...xValues);
        const interval =
          xValues.length > 1
            ? Math.min(...xValues.slice(1).map((x, i) => x - xValues[i]))
            : 3;
        const nextMonth = lastMonth + interval;
        const predictedIncome = slope * nextMonth + intercept;

        if (predictedIncome > 0) {
          const predictionTrace = {
            x: [lastMonth, nextMonth],
            y: [
              yValues[yValues.length - 1],
              predictedIncome,
            ],
            type: "scatter",
            mode: "lines+markers",
            name: `${cluster} (Predicted)`,
            line: {
              width: 2,
              dash: "dot",
              color: actualTrace.line?.color || "#999999",
            },
            marker: {
              size: 6,
              symbol: "diamond",
              color: actualTrace.line?.color || "#999999",
            },
            hovertemplate:
              `<b>%{fullData.name}</b><br>Month: %{x}<br>Predicted Income + Production: %{y}<br><i>Linear trend projection</i><extra></extra>`,
            showlegend: false,
            opacity: 0.7,
          };
          allTraces.push(predictionTrace);
        }
      }
    });

    if (allDataPoints.length >= 2) {
      const allMonths = allDataPoints.map((d) => d.month);
      const allIncomes = allDataPoints.map((d) => d.income);
      const { slope: overallSlope, intercept: overallIntercept } = linearRegression(allMonths, allIncomes);
      const minMonth = Math.min(...allMonths);
      const maxMonth = Math.max(...allMonths);
      const trendStartIncome = overallSlope * minMonth + overallIntercept;
      const trendEndIncome = overallSlope * maxMonth + overallIntercept;

      const overallTrendTrace = {
        x: [minMonth, maxMonth],
        y: [trendStartIncome, trendEndIncome],
        type: "scatter",
        mode: "lines",
        name: "Overall Trend",
        line: { width: 4, color: "#EA580C", dash: "dash" },
        hovertemplate:
          `<b>Overall Trend</b><br>Month: %{x}<br>Trend Income + Production: %{y}<br><i>Best fit across all selected clusters</i><extra></extra>`,
        showlegend: true,
        opacity: 0.8,
      };
      allTraces.unshift(overallTrendTrace);
    }
    return allTraces;
  };

  const getScatterData = () => {
    return [
      {
        x: data.map((d) => currency === 'USD' ? d.avg_income : d.avg_income * exchangeRate),
        y: data.map((d) => d.achievement_rate),
        customdata: data.map((d) => [
          formatCurrency(d.avg_income),
          d.household_count,
        ]),
        mode: "markers",
        type: "scatter" as const,
        marker: {
          size: data.map((d) => Math.sqrt(d.household_count) * 3),
          color: data.map((d) => d.evaluation_month),
          colorscale: "Viridis" as any,
          showscale: true,
          colorbar: {
            title: "Evaluation Month",
          },
        },
        text: data.map((d) => `${d.cluster} - Month ${d.evaluation_month}`),
        hovertemplate:
          "<b>%{text}</b><br>Avg Income + Production: %{customdata[0]}<br>Achievement Rate: %{y:.1f}%<br>Households: %{customdata[1]}<extra></extra>",
      },
    ];
  };

  const summaryStats = {
    totalClusters: [...new Set(data.map((d) => d.cluster))].length,
    evaluationMonths: [...new Set(data.map((d) => d.evaluation_month))].length,
    avgIncome:
      data.length > 0
        ? data.reduce((sum, d) => sum + d.avg_income, 0) / data.length
        : 0,
    totalHouseholds: data.reduce((sum, d) => sum + d.household_count, 0),
    totalDistricts: [...new Set(data.map((d) => d.district))].length,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-start gap-4">
            <Skeleton className="h-14 w-14 rounded-xl" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-96" />
              <Skeleton className="h-5 w-full max-w-2xl" />
              <div className="flex gap-6">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
          </div>
        </div>
        <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/10">
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-6 w-32" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <div className="space-y-2">
                <Skeleton className="h-6 w-80" />
                <Skeleton className="h-4 w-96" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Skeleton className="h-[500px] w-full" />
            </CardContent>
          </Card>
          <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <div className="space-y-2">
                <Skeleton className="h-6 w-72" />
                <Skeleton className="h-4 w-80" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Skeleton className="h-[500px] w-full" />
            </CardContent>
          </Card>
        </div>
        <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
            <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Area Manager ({region}) - Cluster Trends Analysis
            </h1>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <BarChart3 className="h-4 w-4" />
                <span>Interactive Charts</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Building className="h-4 w-4" />
                <span>{summaryStats.totalDistricts} Districts</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Group className="h-4 w-4" />
                <span>{summaryStats.totalClusters} Clusters</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Users className="h-4 w-4" />
                <span>{summaryStats.totalHouseholds.toLocaleString()} Households</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <Filter className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <span className="text-xl font-semibold text-gray-900 dark:text-white">Trend Filters</span>
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                    {activeFiltersCount} active
                  </Badge>
                )}
              </div>
            </CardTitle>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {showFilters ? "Hide" : "Show"} Filters
              </Button>
              {activeFiltersCount > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20 transition-colors"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent className="space-y-6 pt-2">
            <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Evaluation Month</Label>
                <MultiSelect
                  options={monthOptions}
                  selected={selectedMonths}
                  onChange={setSelectedMonths}
                  placeholder="Select months"
                  emptyText="No months found"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">District</Label>
                <MultiSelect
                  options={districtOptions}
                  selected={selectedDistricts}
                  onChange={setSelectedDistricts}
                  placeholder="Select districts"
                  emptyText="No districts found"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cluster</Label>
                <MultiSelect
                  options={clusterOptions}
                  selected={selectedClusters}
                  onChange={setSelectedClusters}
                  placeholder="Select clusters"
                  emptyText="No clusters found"
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Average Income + Production Trends by Cluster</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                  Solid lines show actual data, dotted lines show predictions.
                  Orange dashed line shows overall trend across all selected
                  clusters.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[500px]">
              <Plot
                data={getLineChartData()}
                layout={{
                  autosize: true,
                  title: "",
                  xaxis: {
                    title: "Evaluation Month",
                    tickmode: "linear",
                    dtick: 3,
                    tickformat: "d",
                    ticksuffix: "",
                    showgrid: true,
                    gridcolor: "#f0f0f0",
                  },
                  yaxis: {
                    title: `Average Income + Production (${currency})`,
                    showgrid: true,
                    gridcolor: "#f0f0f0",
                  },
                  margin: { t: 40, b: 60, l: 80, r: 60 },
                  legend: { x: 1.02, y: 1 },
                  plot_bgcolor: "white",
                  paper_bgcolor: "white",
                }}
                config={{ displayModeBar: true, responsive: true }}
                style={{ width: "100%", height: "100%" }}
                useResizeHandler={true}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <BarChart3 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Income + Production vs Achievement Rate</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                  Bubble size represents number of households. Color represents
                  evaluation month.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[500px]">
              <Plot
                //@ts-ignore
                data={getScatterData()}
                layout={{
                  autosize: true,
                  title: "",
                  xaxis: { title: `Average Income + Production (${currency})` },
                  yaxis: { title: "Achievement Rate (%)" },
                  margin: { t: 40, b: 60, l: 80, r: 60 },
                }}
                config={{ displayModeBar: true, responsive: true }}
                style={{ width: "100%", height: "100%" }}
                useResizeHandler={true}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <CardTitle className="text-xl font-semibold text-orange-900 dark:text-orange-100">Regional Summary Statistics</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="bg-white dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
              <Label className="text-sm font-medium text-orange-700 dark:text-orange-300">Total Clusters</Label>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">
                {summaryStats.totalClusters}
              </div>
            </div>
            <div className="bg-white dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
              <Label className="text-sm font-medium text-orange-700 dark:text-orange-300">Evaluation Months</Label>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">
                {summaryStats.evaluationMonths}
              </div>
            </div>
            <div className="bg-white dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
              <Label className="text-sm font-medium text-orange-700 dark:text-orange-300">
                Avg Income + Production
              </Label>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-2">
                {formatCurrency(summaryStats.avgIncome)}
              </div>
            </div>
            <div className="bg-white dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
              <Label className="text-sm font-medium text-orange-700 dark:text-orange-300">Total Households</Label>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-2">
                {summaryStats.totalHouseholds.toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
