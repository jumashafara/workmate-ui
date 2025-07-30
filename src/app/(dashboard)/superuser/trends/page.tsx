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
import { Filter, X, TrendingUp, BarChart3, Users, Activity, AlertCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { API_ENDPOINT } from "@/utils/endpoints";

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

interface FilterOption {
  value: string;
  label: string;
}

export default function SuperuserTrendsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ClusterIncomeData[]>([]);

  // Filter states
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedClusters, setSelectedClusters] = useState<string[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);

  // Filter options
  const [regionOptions, setRegionOptions] = useState<FilterOption[]>([]);
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

  // Fetch data using the same pattern as PredictionsDashboard
  const fetchData = async () => {
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams();

      if (selectedRegions.length > 0)
        params.append("region", selectedRegions.join(","));
      if (selectedDistricts.length > 0)
        params.append("district", selectedDistricts.join(","));
      if (selectedClusters.length > 0)
        params.append("cluster", selectedClusters.join(","));
      if (selectedMonths.length > 0)
        params.append("evaluation_month", selectedMonths.join(","));

      // Build separate parameters for filter options
      const filterParams = new URLSearchParams();
      if (selectedRegions.length > 0)
        filterParams.append("region", selectedRegions.join(","));
      if (selectedDistricts.length > 0)
        filterParams.append("district", selectedDistricts.join(","));
      if (selectedClusters.length > 0)
        filterParams.append("cluster", selectedClusters.join(","));

      // Make parallel API calls for data and filter options
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

      // Handle data response
      let predictions: PredictionData[] = [];
      if (dataResult.results && Array.isArray(dataResult.results)) {
        predictions = dataResult.results;
      } else if (
        dataResult.predictions &&
        Array.isArray(dataResult.predictions)
      ) {
        predictions = dataResult.predictions;
      } else if (Array.isArray(dataResult)) {
        predictions = dataResult;
      }

      // Process data to get cluster-month aggregations
      const clusterData = processClusterData(predictions);
      setData(clusterData);

      // Update filter options
      if (filterResult) {
        setRegionOptions(
          filterResult.regions?.map((r: string) => ({ value: r, label: r })) ||
            []
        );
        setDistrictOptions(
          filterResult.districts?.map((d: string) => ({
            value: d,
            label: d,
          })) || []
        );
        setClusterOptions(
          filterResult.clusters?.map((c: string) => ({ value: c, label: c })) ||
            []
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

  // Initial data load
  useEffect(() => {
    fetchData();
  }, []);

  // Debounced effect for filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedRegions, selectedDistricts, selectedClusters, selectedMonths]);

  const clearFilters = () => {
    setSelectedRegions([]);
    setSelectedDistricts([]);
    setSelectedClusters([]);
    setSelectedMonths([]);
  };

  const activeFiltersCount =
    selectedRegions.length +
    selectedDistricts.length +
    selectedClusters.length +
    selectedMonths.length;

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

    // Collect all data points for overall trend calculation
    const allDataPoints: { month: number; income: number }[] = [];

    clusters.forEach((cluster) => {
      const clusterData = data
        .filter((d) => d.cluster === cluster)
        .sort((a, b) => a.evaluation_month - b.evaluation_month);

      if (clusterData.length === 0) return;

      // Add to overall data points
      clusterData.forEach((d) => {
        allDataPoints.push({ month: d.evaluation_month, income: d.avg_income });
      });

      // Actual data trace
      const actualTrace: any = {
        x: clusterData.map((d) => d.evaluation_month),
        y: clusterData.map((d) => d.avg_income),
        type: "scatter",
        mode: "lines+markers",
        name: cluster,
        line: { width: 3 },
        marker: { size: 8 },
        hovertemplate:
          "<b>%{fullData.name}</b><br>Month: %{x}<br>Avg Income + Production: $%{y:.2f}<extra></extra>",
        showlegend: true,
      };

      allTraces.push(actualTrace);

      // Generate prediction if we have at least 2 data points
      if (clusterData.length >= 2) {
        const xValues = clusterData.map((d) => d.evaluation_month);
        const yValues = clusterData.map((d) => d.avg_income);

        // Calculate linear regression
        const { slope, intercept } = linearRegression(xValues, yValues);

        // Predict next evaluation month
        const lastMonth = Math.max(...xValues);
        const interval =
          xValues.length > 1
            ? Math.min(...xValues.slice(1).map((x, i) => x - xValues[i]))
            : 3;
        const nextMonth = lastMonth + interval;

        const predictedIncome = slope * nextMonth + intercept;

        // Only show prediction if it's reasonable (positive income)
        if (predictedIncome > 0) {
          // Create prediction trace (dotted line)
          const predictionTrace = {
            x: [lastMonth, nextMonth],
            y: [
              clusterData[clusterData.length - 1].avg_income,
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
              "<b>%{fullData.name}</b><br>Month: %{x}<br>Predicted Income + Production: $%{y:.2f}<br><i>Linear trend projection</i><extra></extra>",
            showlegend: false,
            opacity: 0.7,
          };

          allTraces.push(predictionTrace);
        }
      }
    });

    // Add overall trend line if we have enough data points
    if (allDataPoints.length >= 2) {
      const allMonths = allDataPoints.map((d) => d.month);
      const allIncomes = allDataPoints.map((d) => d.income);

      // Calculate overall trend
      const { slope: overallSlope, intercept: overallIntercept } =
        linearRegression(allMonths, allIncomes);

      // Create trend line points across the actual data range
      const minMonth = Math.min(...allMonths);
      const maxMonth = Math.max(...allMonths);

      const trendStartIncome = overallSlope * minMonth + overallIntercept;
      const trendEndIncome = overallSlope * maxMonth + overallIntercept;

      // Add overall trend trace
      const overallTrendTrace = {
        x: [minMonth, maxMonth],
        y: [trendStartIncome, trendEndIncome],
        type: "scatter",
        mode: "lines",
        name: "Overall Trend",
        line: {
          width: 4,
          color: "#EA580C",
          dash: "dash",
        },
        hovertemplate:
          "<b>Overall Trend</b><br>Month: %{x}<br>Trend Income + Production: $%{y:.2f}<br><i>Best fit across all selected clusters</i><extra></extra>",
        showlegend: true,
        opacity: 0.8,
      };

      // Add trend line first so it appears behind other lines
      allTraces.unshift(overallTrendTrace);
    }

    return allTraces;
  };

  const getScatterData = () => {
    return [
      {
        x: data.map((d) => d.avg_income),
        y: data.map((d) => d.achievement_rate),
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
          "<b>%{text}</b><br>Avg Income + Production: $%{x:.2f}<br>Achievement Rate: %{y:.1f}%<br>Households: %{marker.size}<extra></extra>",
      },
    ];
  };

  // Calculate summary statistics
  const summaryStats = {
    totalClusters: [...new Set(data.map((d) => d.cluster))].length,
    evaluationMonths: [...new Set(data.map((d) => d.evaluation_month))].length,
    avgIncome:
      data.length > 0
        ? data.reduce((sum, d) => sum + d.avg_income, 0) / data.length
        : 0,
    totalHouseholds: data.reduce((sum, d) => sum + d.household_count, 0),
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-start gap-4">
            <Skeleton className="h-14 w-14 rounded-xl" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-80" />
              <Skeleton className="h-5 w-96" />
              <div className="flex gap-6">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Skeleton */}
        <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-6 w-32" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts Skeleton */}
        <div className="grid gap-6 lg:grid-cols-1">
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

        {/* Summary Stats Skeleton */}
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
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
            <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Cluster Trends Analysis
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              Advanced trend analysis with predictive modeling and cluster performance insights
            </p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <BarChart3 className="h-4 w-4" />
                <span>Interactive Charts</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Activity className="h-4 w-4" />
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

      {/* Filters */}
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
        </CardHeader>
        <CardContent className="space-y-6 pt-2">
          {/* Filter Controls */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Region</Label>
              <MultiSelect
                options={regionOptions}
                selected={selectedRegions}
                onChange={setSelectedRegions}
                placeholder="Select regions"
                emptyText="No regions found"
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
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Active Filters</h4>
              <div className="flex flex-wrap gap-2">
              {selectedRegions.map((region) => (
                <Badge key={region} className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors">
                  Region: {region}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer hover:text-red-600 transition-colors"
                    onClick={() =>
                      setSelectedRegions((prev) =>
                        prev.filter((r) => r !== region)
                      )
                    }
                  />
                </Badge>
              ))}
              {selectedDistricts.map((district) => (
                <Badge key={district} className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors">
                  District: {district}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer hover:text-red-600 transition-colors"
                    onClick={() =>
                      setSelectedDistricts((prev) =>
                        prev.filter((d) => d !== district)
                      )
                    }
                  />
                </Badge>
              ))}
              {selectedClusters.map((cluster) => (
                <Badge key={cluster} className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors">
                  Cluster: {cluster}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer hover:text-red-600 transition-colors"
                    onClick={() =>
                      setSelectedClusters((prev) =>
                        prev.filter((c) => c !== cluster)
                      )
                    }
                  />
                </Badge>
              ))}
              {selectedMonths.map((month) => (
                <Badge key={month} className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors">
                  Month: {month}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer hover:text-red-600 transition-colors"
                    onClick={() =>
                      setSelectedMonths((prev) =>
                        prev.filter((m) => m !== month)
                      )
                    }
                  />
                </Badge>
              ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-1">
        {/* Line Chart - Income Trends */}
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
                    title: "Average Income + Production ($)",
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

        {/* Scatter Plot */}
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
                  xaxis: { title: "Average Income + Production ($)" },
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

      {/* Summary Statistics */}
      <Card className="bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <CardTitle className="text-xl font-semibold text-orange-900 dark:text-orange-100">Summary Statistics</CardTitle>
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
                ${summaryStats.avgIncome.toFixed(0)}
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
