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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  Filter,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  List,
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

export default function SuperuserPredictionsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCohorts, setSelectedCohorts] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter options
  const [cohortOptions, setCohortOptions] = useState<FilterOption[]>([]);
  const [regionOptions, setRegionOptions] = useState<FilterOption[]>([]);
  const [districtOptions, setDistrictOptions] = useState<FilterOption[]>([]);

  // State for fetching all data
  const [fetchAllData, setFetchAllData] = useState<boolean>(false);
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

        // Add filter parameters
        if (selectedCohorts.length > 0)
          params.append("cohort", selectedCohorts.join(","));
        if (selectedRegions.length > 0)
          params.append("region", selectedRegions.join(","));
        if (selectedDistricts.length > 0)
          params.append("district", selectedDistricts.join(","));

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
          allData = [...allData, ...result.results];
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
  const fetchData = async (page: number = 1, getAllData: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      if (getAllData) {
        await fetchAllDataIteratively();

        // Still fetch filter options
        const filterParams = new URLSearchParams();
        if (selectedCohorts.length > 0)
          filterParams.append("cohort", selectedCohorts.join(","));
        if (selectedRegions.length > 0)
          filterParams.append("region", selectedRegions.join(","));
        if (selectedDistricts.length > 0)
          filterParams.append("district", selectedDistricts.join(","));

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
          }
        }
        return;
      }

      // Build query parameters
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("page_size", pageSize.toString());

      if (selectedCohorts.length > 0)
        params.append("cohort", selectedCohorts.join(","));
      if (selectedRegions.length > 0)
        params.append("region", selectedRegions.join(","));
      if (selectedDistricts.length > 0)
        params.append("district", selectedDistricts.join(","));

      // Build separate parameters for filter options
      const filterParams = new URLSearchParams();
      if (selectedCohorts.length > 0)
        filterParams.append("cohort", selectedCohorts.join(","));
      if (selectedRegions.length > 0)
        filterParams.append("region", selectedRegions.join(","));
      if (selectedDistricts.length > 0)
        filterParams.append("district", selectedDistricts.join(","));

      // Make parallel API calls
      const [dataResponse, filterResponse] = await Promise.all([
        fetch(`${API_ENDPOINT}/standard-evaluations/?${params.toString()}`),
        fetch(`${API_ENDPOINT}/filter-options/?${filterParams.toString()}`),
      ]);

      if (!dataResponse.ok) {
        if (dataResponse.status === 0 || !navigator.onLine) {
          throw new Error('Network error: Please check your internet connection and ensure the API server is running');
        }
        throw new Error(`API Error: ${dataResponse.status} - ${dataResponse.statusText}`);
      }
      if (!filterResponse.ok) {
        console.warn('Filter API failed, continuing with main data');
      }

      const dataResult = await dataResponse.json();
      const filterResult = filterResponse.ok ? await filterResponse.json() : null;

      // Handle data response
      if (dataResult.results) {
        setPredictions(dataResult.results);
        setTotalCount(dataResult.count || 0);
      } else if (dataResult.predictions) {
        setPredictions(dataResult.predictions);
        setTotalCount(dataResult.predictions.length);
      }

      // Update filter options
      if (filterResult) {
        setCohortOptions(
          filterResult.cohorts?.map((c: string) => ({ value: c, label: c })) ||
            []
        );
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
    fetchData(1);
  }, []);

  // Debounced effect for filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchData(1, fetchAllData);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    selectedCohorts,
    selectedRegions,
    selectedDistricts,
    pageSize,
    fetchAllData,
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const clearFilters = () => {
    setSelectedCohorts([]);
    setSelectedRegions([]);
    setSelectedDistricts([]);
    setSearchTerm("");
  };

  const activeFiltersCount =
    selectedCohorts.length +
    selectedRegions.length +
    selectedDistricts.length +
    (searchTerm ? 1 : 0);

  // Handle pagination changes
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchData(newPage);
  };

  // Handle fetch all data
  const handleFetchAllData = () => {
    setFetchAllData(true);
    setCurrentPage(1);
    fetchData(1, true);
  };

  // Handle return to paginated data
  const handleReturnToPaginated = () => {
    setFetchAllData(false);
    setCurrentPage(1);
    fetchData(1, false);
  };

  // Handle multi-select changes
  const handleMultiSelectChange = (
    value: string,
    selectedValues: string[],
    setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Predictions Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage and analyze prediction data with advanced filtering and export capabilities.
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-red-500 text-lg font-medium mb-2">
                Unable to load data
              </div>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => fetchData(1)} className="bg-orange-600 hover:bg-orange-700">
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

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <TableHead key={i}>
                      <Skeleton className="h-4 w-20" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Predictions Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage and analyze prediction data with advanced filtering and export
          capabilities.
        </p>
      </div>

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
              {fetchAllData ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReturnToPaginated}
                  disabled={isLoadingAllData}
                >
                  <List className="mr-2 h-4 w-4" />
                  Return to Paginated View
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleFetchAllData}
                  disabled={loading || isLoadingAllData}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isLoadingAllData ? "Loading All Data..." : "Load All Data"}
                </Button>
              )}
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
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search households..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <Label>Cohort</Label>
                <div className="border rounded-md p-2 max-h-32 overflow-y-auto">
                  {cohortOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2 mb-1"
                    >
                      <Checkbox
                        id={`cohort-${option.value}`}
                        checked={selectedCohorts.includes(option.value)}
                        onCheckedChange={() =>
                          handleMultiSelectChange(
                            option.value,
                            selectedCohorts,
                            setSelectedCohorts
                          )
                        }
                      />
                      <Label
                        htmlFor={`cohort-${option.value}`}
                        className="text-sm"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Region</Label>
                <div className="border rounded-md p-2 max-h-32 overflow-y-auto">
                  {regionOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2 mb-1"
                    >
                      <Checkbox
                        id={`region-${option.value}`}
                        checked={selectedRegions.includes(option.value)}
                        onCheckedChange={() =>
                          handleMultiSelectChange(
                            option.value,
                            selectedRegions,
                            setSelectedRegions
                          )
                        }
                      />
                      <Label
                        htmlFor={`region-${option.value}`}
                        className="text-sm"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>District</Label>
                <div className="border rounded-md p-2 max-h-32 overflow-y-auto">
                  {districtOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2 mb-1"
                    >
                      <Checkbox
                        id={`district-${option.value}`}
                        checked={selectedDistricts.includes(option.value)}
                        onCheckedChange={() =>
                          handleMultiSelectChange(
                            option.value,
                            selectedDistricts,
                            setSelectedDistricts
                          )
                        }
                      />
                      <Label
                        htmlFor={`district-${option.value}`}
                        className="text-sm"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2">
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
                {selectedRegions.map((region) => (
                  <Badge key={region} variant="secondary">
                    Region: {region}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() =>
                        setSelectedRegions((prev) =>
                          prev.filter((r) => r !== region)
                        )
                      }
                    />
                  </Badge>
                ))}
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
                {searchTerm && (
                  <Badge variant="secondary">
                    Search: {searchTerm}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() => setSearchTerm("")}
                    />
                  </Badge>
                )}
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

      {/* Data Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Prediction Data</CardTitle>
              <CardDescription>
                {fetchAllData
                  ? `Showing all ${predictions.length} records`
                  : `Showing ${predictions.length} of ${totalCount} records - Page ${currentPage} of ${totalPages}`}
              </CardDescription>
            </div>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Household ID</TableHead>
                <TableHead>Cohort</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Cluster</TableHead>
                <TableHead>Prediction</TableHead>
                <TableHead>Probability</TableHead>
                <TableHead>Income</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {predictions.map((prediction) => (
                <TableRow key={prediction.id}>
                  <TableCell className="font-medium">
                    {prediction.household_id}
                  </TableCell>
                  <TableCell>{prediction.cohort}</TableCell>
                  <TableCell>{prediction.region}</TableCell>
                  <TableCell>{prediction.district}</TableCell>
                  <TableCell>{prediction.cluster}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        prediction.prediction === 1 ? "default" : "secondary"
                      }
                    >
                      {prediction.prediction === 1
                        ? "Achieved"
                        : "Not Achieved"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {(prediction.probability * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell>
                    ${prediction.predicted_income.toFixed(0)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination - Only show when not fetching all data */}
      {!fetchAllData && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label>Rows per page:</Label>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => setPageSize(Number(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                if (pageNum > totalPages) return null;

                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className="w-10"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* All Data Information */}
      {fetchAllData && (
        <div className="flex justify-center mt-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              📊 All available data has been loaded ({predictions.length}{" "}
              records). Charts and analysis include complete dataset.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
