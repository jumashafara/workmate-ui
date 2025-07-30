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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Area Manager - Predictions Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage and analyze prediction data for your region ({region}) with advanced filtering capabilities.
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-red-500 text-lg font-medium mb-2">
                Unable to load data
              </div>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => fetchData()} className="bg-orange-600 hover:bg-orange-700">
                Retry
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
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-20" />
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Area Manager - Predictions Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage and analyze prediction data for your region ({region}) with advanced filtering capabilities.
        </p>
      </div>

      {/* Region Context Card */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="py-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-orange-100 text-orange-800">
              Your Region: {region}
            </Badge>
            <span className="text-sm text-gray-600">
              Data is automatically filtered to show only your region
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Dashboard Charts */}
      <DashboardCharts data={predictions} totalCount={totalCount} />

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary">{activeFiltersCount}</Badge>
              )}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? "Hide" : "Show"} Filters
              </Button>
              {activeFiltersCount > 0 && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              <div className="space-y-2">
                <Label>District</Label>
                <MultiSelect
                  options={districtOptions}
                  selected={selectedDistricts}
                  onChange={setSelectedDistricts}
                  placeholder="Select districts"
                  emptyText="No districts found"
                />
              </div>

              <div className="space-y-2">
                <Label>Cluster</Label>
                <MultiSelect
                  options={clusterOptions}
                  selected={selectedClusters}
                  onChange={setSelectedClusters}
                  placeholder="Select clusters"
                  emptyText="No clusters found"
                />
              </div>

              <div className="space-y-2">
                <Label>Cohort</Label>
                <MultiSelect
                  options={cohortOptions}
                  selected={selectedCohorts}
                  onChange={setSelectedCohorts}
                  placeholder="Select cohorts"
                  emptyText="No cohorts found"
                />
              </div>

              <div className="space-y-2">
                <Label>Cycle</Label>
                <MultiSelect
                  options={cycleOptions}
                  selected={selectedCycles}
                  onChange={setSelectedCycles}
                  placeholder="Select cycles"
                  emptyText="No cycles found"
                />
              </div>

              <div className="space-y-2">
                <Label>Evaluation Month</Label>
                <MultiSelect
                  options={monthOptions}
                  selected={selectedMonths}
                  onChange={setSelectedMonths}
                  placeholder="Select months"
                  emptyText="No months found"
                />
              </div>

              <div className="space-y-2">
                <Label>Village</Label>
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
              <div className="flex flex-wrap gap-2">
                {selectedDistricts.map((district) => (
                  <Badge key={district} variant="secondary">
                    District: {district}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() =>
                        setSelectedDistricts((prev) =>
                          prev.filter((d) => d !== district)
                        )
                      }
                    />
                  </Badge>
                ))}
                {selectedClusters.map((cluster) => (
                  <Badge key={cluster} variant="secondary">
                    Cluster: {cluster}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() =>
                        setSelectedClusters((prev) =>
                          prev.filter((c) => c !== cluster)
                        )
                      }
                    />
                  </Badge>
                ))}
                {selectedCohorts.map((cohort) => (
                  <Badge key={cohort} variant="secondary">
                    Cohort: {cohort}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() =>
                        setSelectedCohorts((prev) =>
                          prev.filter((c) => c !== cohort)
                        )
                      }
                    />
                  </Badge>
                ))}
                {selectedCycles.map((cycle) => (
                  <Badge key={cycle} variant="secondary">
                    Cycle: {cycle}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() =>
                        setSelectedCycles((prev) =>
                          prev.filter((c) => c !== cycle)
                        )
                      }
                    />
                  </Badge>
                ))}
                {selectedMonths.map((month) => (
                  <Badge key={month} variant="secondary">
                    Month: {month}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() =>
                        setSelectedMonths((prev) =>
                          prev.filter((m) => m !== month)
                        )
                      }
                    />
                  </Badge>
                ))}
                {selectedVillages.map((village) => (
                  <Badge key={village} variant="secondary">
                    Village: {village}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() =>
                        setSelectedVillages((prev) =>
                          prev.filter((v) => v !== village)
                        )
                      }
                    />
                  </Badge>
                ))}
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
      <div className="flex justify-center mt-4">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            📊 Showing all available data for your region ({predictions.length} records). Charts and analysis include complete dataset.
          </p>
        </div>
      </div>
    </div>
  );
}