"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Filter,
  X,
  BarChart3,
  TrendingUp,
  Users,
  MapPin,
  AlertCircle,
} from "lucide-react";
import dynamic from 'next/dynamic';

const DashboardCharts = dynamic(() => import("@/components/charts/DashboardCharts"), { ssr: false });
const RegionPerformanceChart = dynamic(() => import("@/components/charts/RegionPerformanceChart"), { ssr: false });
const HouseholdMap = dynamic(() => import("@/components/map/HouseholdMap"), { ssr: false });
import { API_ENDPOINT } from "@/utils/endpoints";

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

// Mock user data - replace with actual user context
const getUserData = () => ({
  region: "Central", // Example region for area manager
});

export default function AreaManagerPredictionsPage() {
  const userData = getUserData();
  const region = userData.region;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filter states
  const [selectedCohorts, setSelectedCohorts] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedClusters, setSelectedClusters] = useState<string[]>([]);
  const [selectedCycles, setSelectedCycles] = useState<string[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [selectedVillages, setSelectedVillages] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter options
  const [cohortOptions, setCohortOptions] = useState<FilterOption[]>([]);
  const [districtOptions, setDistrictOptions] = useState<FilterOption[]>([]);
  const [clusterOptions, setClusterOptions] = useState<FilterOption[]>([]);
  const [cycleOptions, setCycleOptions] = useState<FilterOption[]>([]);
  const [monthOptions, setMonthOptions] = useState<FilterOption[]>([]);
  const [villageOptions, setVillageOptions] = useState<FilterOption[]>([]);

  const [isLoadingAllData, setIsLoadingAllData] = useState<boolean>(false);

  // Fetch all data by making multiple requests if needed
  const fetchAllDataIteratively = async () => {
    try {
      setIsLoadingAllData(true);
      setError(null);
      let allData: PredictionData[] = [];
      let currentPageFetch = 1;
      let hasMoreData = true;
      const pageSize = 500;

      while (hasMoreData) {
        const params = new URLSearchParams();
        params.append("page", currentPageFetch.toString());
        params.append("page_size", pageSize.toString());

        // Always include user's region in params
        if (region) params.append("region", region);

        // Add filter parameters
        if (selectedCohorts.length > 0)
          params.append("cohort", selectedCohorts.join(","));
        if (selectedDistricts.length > 0)
          params.append("district", selectedDistricts.join(","));
        if (selectedClusters.length > 0)
          params.append("cluster", selectedClusters.join(","));
        if (selectedCycles.length > 0)
          params.append("cycle", selectedCycles.join(","));
        if (selectedMonths.length > 0)
          params.append("evaluation_month", selectedMonths.join(","));
        if (selectedVillages.length > 0)
          params.append("village", selectedVillages.join(","));

        const response = await fetch(
          `${API_ENDPOINT}/standard-evaluations/?${params.toString()}`
        );
        if (!response.ok) {
          if (response.status === 0 || !navigator.onLine) {
            throw new Error('Network error: Please check your internet connection');
          }
          throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();

        if (result.results && result.results.length > 0) {
          // Filter to only include data from user's region
          const filteredResults = region 
            ? result.results.filter((item: PredictionData) => item.region === region)
            : result.results;
            
          allData = [...allData, ...filteredResults];
          hasMoreData = result.results.length === pageSize && !!result.next;
          currentPageFetch++;

          if (currentPageFetch > 50) {
            // Safety check
            hasMoreData = false;
          }
        } else {
          hasMoreData = false;
        }

        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      setPredictions(allData);
      setTotalCount(allData.length);
    } catch (err: any) {
      console.error("Fetch all data error:", err);
      let errorMessage = 'Network error. Please check if the API server is running.';
      
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
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

      // Always fetch all data for area managers
      await fetchAllDataIteratively();

      // Fetch filter options
      const filterParams = new URLSearchParams();
      // Always include user's region in filter params
      if (region) filterParams.append("region", region);

      if (selectedCohorts.length > 0)
        filterParams.append("cohort", selectedCohorts.join(","));
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
          setVillageOptions(
            filterResult.villages?.map((v: string) => ({
              value: v,
              label: v,
            })) || []
          );
        }
      }
    } catch (err: any) {
      console.error("Data fetch error:", err);
      let errorMessage = 'Network error. Please check if the API server is running.';
      
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
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

  // Debounced effect for filter changes - don't include selectedRegions since it's fixed for area managers
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    selectedCohorts,
    selectedDistricts,
    selectedClusters,
    selectedCycles,
    selectedMonths,
    selectedVillages,
  ]);

  // Clear all filters except region for area managers
  const clearFilters = () => {
    setSelectedCohorts([]);
    setSelectedDistricts([]);
    setSelectedClusters([]);
    setSelectedCycles([]);
    setSelectedMonths([]);
    setSelectedVillages([]);
  };

  const activeFiltersCount =
    selectedCohorts.length +
    selectedDistricts.length +
    selectedClusters.length +
    selectedCycles.length +
    selectedMonths.length +
    selectedVillages.length;

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
                Area Manager - Predictions Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Manage and analyze prediction data for your region ({region}) with advanced filtering capabilities.
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
              <Skeleton className="h-8 w-96" />
              <Skeleton className="h-5 w-full max-w-2xl" />
            </div>
          </div>
        </div>

        {/* Region Context Skeleton */}
        <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/10">
          <CardContent className="py-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </CardContent>
        </Card>

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
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
            <BarChart3 className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Area Manager - Predictions Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              Advanced prediction analytics for your region ({region}) with comprehensive filtering and visualizations
            </p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <TrendingUp className="h-4 w-4" />
                <span>Real-time Analytics</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Users className="h-4 w-4" />
                <span>{totalCount.toLocaleString()} Records</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>Region: {region}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Region Context Card */}
      <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/10">
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <MapPin className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1">
              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 mb-1">
                Your Region: {region}
              </Badge>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Data is automatically filtered to show only your region
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Dashboard Charts */}
      <DashboardCharts data={predictions} totalCount={totalCount} />

      {/* Filters */}
      <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <Filter className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <span className="text-xl font-semibold text-gray-900 dark:text-white">Regional Filters</span>
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Village</Label>
                <MultiSelect
                  options={villageOptions}
                  selected={selectedVillages}
                  onChange={setSelectedVillages}
                  placeholder="Select villages"
                  emptyText="No villages found"
                />
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Active Filters</h4>
                <div className="flex flex-wrap gap-2">
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
                {selectedCohorts.map((cohort) => (
                  <Badge key={cohort} className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors">
                    Cohort: {cohort}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer hover:text-red-600 transition-colors"
                      onClick={() =>
                        setSelectedCohorts((prev) =>
                          prev.filter((c) => c !== cohort)
                        )
                      }
                    />
                  </Badge>
                ))}
                {selectedCycles.map((cycle) => (
                  <Badge key={cycle} className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors">
                    Cycle: {cycle}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer hover:text-red-600 transition-colors"
                      onClick={() =>
                        setSelectedCycles((prev) =>
                          prev.filter((c) => c !== cycle)
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
                {selectedVillages.map((village) => (
                  <Badge key={village} className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors">
                    Village: {village}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer hover:text-red-600 transition-colors"
                      onClick={() =>
                        setSelectedVillages((prev) =>
                          prev.filter((v) => v !== village)
                        )
                      }
                    />
                  </Badge>
                ))}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Map and Charts */}
      <div className="space-y-6">
        <HouseholdMap households={predictions} />
        <RegionPerformanceChart data={predictions} />
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
                Regional Dataset Loaded
              </h4>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Displaying all {predictions.length.toLocaleString()} prediction records for your region ({region}) with real-time analytics and interactive visualizations.
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