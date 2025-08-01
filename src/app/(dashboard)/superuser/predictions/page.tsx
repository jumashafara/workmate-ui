"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MultiSelect } from "@/components/ui/multi-select";
import { Filter, X, BarChart3, TrendingUp, Users, MapPin, AlertCircle, Download, Group, Building } from "lucide-react";
import dynamic from "next/dynamic";
import { PredictionData } from "@/types/predictions";

const DashboardCharts = dynamic(
  () => import("@/components/charts/DashboardCharts"),
  { ssr: false }
);
const RegionPerformanceChart = dynamic(
  () => import("@/components/charts/RegionPerformanceChart"),
  { ssr: false }
);
const HouseholdMap = dynamic(() => import("@/components/map/MapWrapper"), {
  ssr: false,
});
import { API_ENDPOINT } from "@/utils/endpoints";

interface FilterOption {
  value: string;
  label: string;
}

export default function SuperuserPredictionsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<PredictionData[]>([]);

  // Filter states
  const [selectedCohorts, setSelectedCohorts] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedClusters, setSelectedClusters] = useState<string[]>([]);
  const [selectedCycles, setSelectedCycles] = useState<string[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter options
  const [cohortOptions, setCohortOptions] = useState<FilterOption[]>([]);
  const [regionOptions, setRegionOptions] = useState<FilterOption[]>([]);
  const [districtOptions, setDistrictOptions] = useState<FilterOption[]>([]);
  const [clusterOptions, setClusterOptions] = useState<FilterOption[]>([]);
  const [cycleOptions, setCycleOptions] = useState<FilterOption[]>([]);
  const [monthOptions, setMonthOptions] = useState<FilterOption[]>([]);

  const [isLoadingAllData, setIsLoadingAllData] = useState<boolean>(false);

  const fetchAllData = async () => {
    try {
      setIsLoadingAllData(true);
      setError(null);

      const params = new URLSearchParams();
      if (selectedCohorts.length > 0)
        params.append("cohort", selectedCohorts.join(","));
      if (selectedRegions.length > 0)
        params.append("region", selectedRegions.join(","));
      if (selectedDistricts.length > 0)
        params.append("district", selectedDistricts.join(","));
      if (selectedClusters.length > 0)
        params.append("cluster", selectedClusters.join(","));
      if (selectedCycles.length > 0)
        params.append("cycle", selectedCycles.join(","));
      if (selectedMonths.length > 0)
        params.append("evaluation_month", selectedMonths.join(","));

      const response = await fetch(
        `${API_ENDPOINT}/standard-evaluations/?${params.toString()}`
      );
      if (!response.ok) {
        if (response.status === 0 || !navigator.onLine) {
          throw new Error(
            "Network error: Please check your internet connection"
          );
        }
        throw new Error(
          `API Error: ${response.status} - ${response.statusText}`
        );
      }

      const result = await response.json();
      
      const allData = result.predictions || [];

      setPredictions(allData);
    } catch (err: any) {
      console.error("Fetch all data error:", err);
      let errorMessage =
        "Network error. Please check if the API server is running.";

      if (err.name === "TypeError" && err.message.includes("Failed to fetch")) {
        errorMessage = `Cannot connect to API server at ${API_ENDPOINT}. Please ensure the backend server is running on localhost:8000.`;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(`Failed to fetch data: ${errorMessage}`);
    } finally {
      setIsLoadingAllData(false);
    }
  };

  // Fetch predictions and filter options
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      await fetchAllData();

      // Fetch filter options
      const filterParams = new URLSearchParams();
      if (selectedCohorts.length > 0)
        filterParams.append("cohort", selectedCohorts.join(","));
      if (selectedRegions.length > 0)
        filterParams.append("region", selectedRegions.join(","));
      if (selectedDistricts.length > 0)
        filterParams.append("district", selectedDistricts.join(","));
      if (selectedClusters.length > 0)
        filterParams.append("cluster", selectedClusters.join(","));
      if (selectedCycles.length > 0)
        filterParams.append("cycle", selectedCycles.join(","));
      if (selectedMonths.length > 0)
        filterParams.append("evaluation_month", selectedMonths.join(","));

      const filterResponse = await fetch(
        `${API_ENDPOINT}/filter-options/?${filterParams.toString()}`
      );
      if (filterResponse.ok) {
        const filterResult = await filterResponse.json();

        if (filterResult) {
          setCohortOptions(
            filterResult.cohorts?.map((c: string) => ({
              value: c,
              label: c,
            })) || []
          );
          setRegionOptions(
            filterResult.regions?.map((r: string) => ({
              value: r,
              label: r,
            })) || []
          );
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
          setCycleOptions(
            filterResult.cycles?.map((c: string) => ({
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
      }
    } catch (err: any) {
      console.error("Data fetch error:", err);
      let errorMessage =
        "Network error. Please check if the API server is running.";

      if (err.name === "TypeError" && err.message.includes("Failed to fetch")) {
        errorMessage = `Cannot connect to API server at ${API_ENDPOINT}. Please ensure the backend server is running on localhost:8000.`;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(`Failed to fetch data: ${errorMessage}`);
    } finally {
      setLoading(false);
      setIsLoadingAllData(false);
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
  }, [
    selectedCohorts,
    selectedRegions,
    selectedDistricts,
    selectedClusters,
    selectedCycles,
    selectedMonths,
  ]);

  const clearFilters = () => {
    setSelectedCohorts([]);
    setSelectedRegions([]);
    setSelectedDistricts([]);
    setSelectedClusters([]);
    setSelectedCycles([]);
    setSelectedMonths([]);
  };

  const activeFiltersCount =
    selectedCohorts.length +
    selectedRegions.length +
    selectedDistricts.length +
    selectedClusters.length +
    selectedCycles.length +
    selectedMonths.length;

  const downloadData = () => {
    if (!predictions || predictions.length === 0) {
      alert('No data available to download');
      return;
    }

    // Convert data to CSV format, excluding probability column
    const excludeColumns = ['probability'];
    const headers = Object.keys(predictions[0]).filter(key => !excludeColumns.includes(key)) as (keyof PredictionData)[];
    const csvContent = [
      headers.join(','),
      ...predictions.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle values that need quotes (containing commas, quotes, or newlines)
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `predictions_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <BarChart3 className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Predictions Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Advanced prediction analytics with intelligent filtering and comprehensive visualizations
              </p>
            </div>
          </div>
        </div>

        {/* Error Card */}
        <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/10">
          <CardContent className="p-8">
            <div className="text-center max-w-md mx-auto">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full w-fit mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-2">
                Unable to Load Data
              </h3>
              <p className="text-orange-700 dark:text-orange-300 mb-6 leading-relaxed">
                {error}
              </p>
              <Button
                onClick={() => fetchData()}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2"
                disabled={isLoadingAllData}
              >
                {isLoadingAllData ? "Retrying..." : "Try Again"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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

        {/* Dashboard Charts Skeleton */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <Skeleton className="h-96 w-full" />
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts Skeleton */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Superuser - Aggregated Predictions
            </h1>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <TrendingUp className="h-4 w-4" />
                <span>Real-time Analytics</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>Regions: {regionOptions.length}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>Districts: {districtOptions.length}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Group className="h-4 w-4" />
                <span>Clusters: {clusterOptions.length}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Group className="h-4 w-4" />
                <span>{predictions.length.toLocaleString()} Records</span>
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
                <span className="text-xl font-semibold text-gray-900 dark:text-white">Smart Filters</span>
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                    {activeFiltersCount} active
                  </Badge>
                )}
              </div>
            </CardTitle>
            <div className="flex gap-3">

              <Button
                onClick={downloadData}
                disabled={!predictions || predictions.length === 0}
                variant="outline"
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cohort</Label>
                <MultiSelect
                  options={cohortOptions}
                  selected={selectedCohorts}
                  onChange={setSelectedCohorts}
                  placeholder="Select cohorts"
                  emptyText="No cohorts found"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cycle</Label>
                <MultiSelect
                  options={cycleOptions}
                  selected={selectedCycles}
                  onChange={setSelectedCycles}
                  placeholder="Select cycles"
                  emptyText="No cycles found"
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

          </CardContent>
        )}
      </Card>

      {/* Interactive Dashboard Charts */}
      <DashboardCharts data={predictions} />

     
      {/* Map and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RegionPerformanceChart data={predictions} />
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Household Predictions Map</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <HouseholdMap households={predictions} />
          </CardContent>
        </Card>
      </div>

      {/* Data Information */}
      <Card className="bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <BarChart3 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">
                Complete Dataset Loaded
              </h4>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Displaying all {predictions.length.toLocaleString()} prediction records with real-time analytics and interactive visualizations.
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {predictions.length.toLocaleString()}
              </div>
              <div className="text-xs text-orange-600 dark:text-orange-400 uppercase tracking-wide">
                Records
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
