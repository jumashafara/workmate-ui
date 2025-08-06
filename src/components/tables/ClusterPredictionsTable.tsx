"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, DollarSign, Target, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";

interface ClusterIncomeData {
  cluster: string;
  evaluation_month: number;
  avg_income: number;
  household_count: number;
  achievement_rate: number;
  region: string;
  district: string;
}

interface ClusterPredictionsTableProps {
  data: ClusterIncomeData[];
}

interface ClusterPredictionRow {
  cluster: string;
  region: string;
  district: string;
  month6: {
    achievement_rate: number | null;
    avg_income: number | null;
  };
  month9: {
    achievement_rate: number | null;
    avg_income: number | null;
  };
  month12: {
    achievement_rate: number | null;
    avg_income: number | null;
  };
  month18: {
    achievement_rate: number | null;
    avg_income: number | null;
  };
  month23: {
    achievement_rate: number | null;
    avg_income: number | null;
  };
}

export default function ClusterPredictionsTable({ data }: ClusterPredictionsTableProps) {
  const { formatCurrency } = useCurrency();
  
  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("cluster");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  const rowsPerPage = 10;

  const processedData = useMemo(() => {
    const clusterMap = new Map<string, ClusterPredictionRow>();

    // Initialize clusters with null values for all months
    data.forEach((item) => {
      if (!clusterMap.has(item.cluster)) {
        clusterMap.set(item.cluster, {
          cluster: item.cluster,
          region: item.region,
          district: item.district,
          month6: { achievement_rate: null, avg_income: null },
          month9: { achievement_rate: null, avg_income: null },
          month12: { achievement_rate: null, avg_income: null },
          month18: { achievement_rate: null, avg_income: null },
          month23: { achievement_rate: null, avg_income: null },
        });
      }

      const cluster = clusterMap.get(item.cluster)!;
      
      // Map data to the correct month
      switch (item.evaluation_month) {
        case 6:
          cluster.month6 = {
            achievement_rate: item.achievement_rate,
            avg_income: item.avg_income,
          };
          break;
        case 9:
          cluster.month9 = {
            achievement_rate: item.achievement_rate,
            avg_income: item.avg_income,
          };
          break;
        case 12:
          cluster.month12 = {
            achievement_rate: item.achievement_rate,
            avg_income: item.avg_income,
          };
          break;
        case 18:
          cluster.month18 = {
            achievement_rate: item.achievement_rate,
            avg_income: item.avg_income,
          };
          break;
        case 23:
          cluster.month23 = {
            achievement_rate: item.achievement_rate,
            avg_income: item.avg_income,
          };
          break;
      }
    });

    let result = Array.from(clusterMap.values());
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(cluster => 
        cluster.cluster.toLowerCase().includes(term) ||
        cluster.region.toLowerCase().includes(term) ||
        cluster.district.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case "cluster":
          aValue = a.cluster.toLowerCase();
          bValue = b.cluster.toLowerCase();
          break;
        case "region":
          aValue = a.region.toLowerCase();
          bValue = b.region.toLowerCase();
          break;
        case "district":
          aValue = a.district.toLowerCase();
          bValue = b.district.toLowerCase();
          break;
        case "month6_achievement":
          aValue = a.month6.achievement_rate ?? 0;
          bValue = b.month6.achievement_rate ?? 0;
          break;
        case "month6_income":
          aValue = a.month6.avg_income ?? 0;
          bValue = b.month6.avg_income ?? 0;
          break;
        case "month9_achievement":
          aValue = a.month9.achievement_rate ?? 0;
          bValue = b.month9.achievement_rate ?? 0;
          break;
        case "month9_income":
          aValue = a.month9.avg_income ?? 0;
          bValue = b.month9.avg_income ?? 0;
          break;
        case "month12_achievement":
          aValue = a.month12.achievement_rate ?? 0;
          bValue = b.month12.achievement_rate ?? 0;
          break;
        case "month12_income":
          aValue = a.month12.avg_income ?? 0;
          bValue = b.month12.avg_income ?? 0;
          break;
        case "month18_achievement":
          aValue = a.month18.achievement_rate ?? 0;
          bValue = b.month18.achievement_rate ?? 0;
          break;
        case "month18_income":
          aValue = a.month18.avg_income ?? 0;
          bValue = b.month18.avg_income ?? 0;
          break;
        case "month23_achievement":
          aValue = a.month23.achievement_rate ?? 0;
          bValue = b.month23.achievement_rate ?? 0;
          break;
        case "month23_income":
          aValue = a.month23.avg_income ?? 0;
          bValue = b.month23.avg_income ?? 0;
          break;
        default:
          aValue = a.cluster.toLowerCase();
          bValue = b.cluster.toLowerCase();
      }
      
      if (typeof aValue === 'string') {
        return sortDirection === "asc" 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
    });

    return result;
  }, [data, searchTerm, sortField, sortDirection]);

  const renderValue = (value: number | null, type: 'achievement' | 'income') => {
    if (value === null) return "-";
    
    if (type === 'achievement') {
      return `${value.toFixed(1)}%`;
    } else {
      return formatCurrency(value);
    }
  };

  const getAchievementColor = (rate: number | null) => {
    if (rate === null) return "text-gray-500";
    if (rate >= 80) return "text-green-600";
    if (rate >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Pagination logic
  const totalPages = Math.ceil(processedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = processedData.slice(startIndex, endIndex);

  // Helper functions
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSortField("cluster");
    setSortDirection("asc");
    setCurrentPage(1);
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const downloadTableData = () => {
    if (processedData.length === 0) return;

    // Define CSV headers
    const headers = [
      "Cluster",
      "Region", 
      "District",
      "Month 6 Achievement",
      "Month 6 Income",
      "Month 9 Achievement",
      "Month 9 Income",
      "Month 12 Achievement",
      "Month 12 Income",
      "Month 18 Achievement",
      "Month 18 Income",
      "Month 23 Achievement",
      "Month 23 Income"
    ];

    // Prepare CSV data
    const csvData = processedData.map((cluster) => {
      const row = [
        cluster.cluster,
        cluster.region,
        cluster.district,
        cluster.month6.achievement_rate ? cluster.month6.achievement_rate.toFixed(1) : "-",
        cluster.month6.avg_income ? cluster.month6.avg_income.toFixed(2) : "-",
        cluster.month9.achievement_rate ? cluster.month9.achievement_rate.toFixed(1) : "-",
        cluster.month9.avg_income ? cluster.month9.avg_income.toFixed(2) : "-",
        cluster.month12.achievement_rate ? cluster.month12.achievement_rate.toFixed(1) : "-",
        cluster.month12.avg_income ? cluster.month12.avg_income.toFixed(2) : "-",
        cluster.month18.achievement_rate ? cluster.month18.achievement_rate.toFixed(1) : "-",
        cluster.month18.avg_income ? cluster.month18.avg_income.toFixed(2) : "-",
        cluster.month23.achievement_rate ? cluster.month23.achievement_rate.toFixed(1) : "-",
        cluster.month23.avg_income ? cluster.month23.avg_income.toFixed(2) : "-"
      ];
      return row.join(",");
    });

    // Create CSV content
    const csvContent = [headers.join(","), ...csvData].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `cluster_predictions_by_evaluation_month_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (processedData.length === 0) {
    return (
      <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">
              Cluster Predictions by Evaluation Month
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No cluster data available for the selected filters.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-xl font-semibold text-gray-900 dark:text-white">
            Cluster Predictions by Evaluation Month
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {/* Filter Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Search className="h-4 w-4 mr-2" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
              {(searchTerm || sortField !== "cluster" || sortDirection !== "asc") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={downloadTableData}
                disabled={processedData.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              {processedData.length} clusters found
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Search Clusters</Label>
                  <Input
                    placeholder="Search by cluster, region, or district..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Sort By</Label>
                  <Select
                    value={sortField}
                    onValueChange={(value) => {
                      setSortField(value);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cluster">Cluster Name</SelectItem>
                      <SelectItem value="region">Region</SelectItem>
                      <SelectItem value="district">District</SelectItem>
                      <SelectItem value="month6_achievement">Month 6 Achievement</SelectItem>
                      <SelectItem value="month6_income">Month 6 Income</SelectItem>
                      <SelectItem value="month9_achievement">Month 9 Achievement</SelectItem>
                      <SelectItem value="month9_income">Month 9 Income</SelectItem>
                      <SelectItem value="month12_achievement">Month 12 Achievement</SelectItem>
                      <SelectItem value="month12_income">Month 12 Income</SelectItem>
                      <SelectItem value="month18_achievement">Month 18 Achievement</SelectItem>
                      <SelectItem value="month18_income">Month 18 Income</SelectItem>
                      <SelectItem value="month23_achievement">Month 23 Achievement</SelectItem>
                      <SelectItem value="month23_income">Month 23 Income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Sort Direction</Label>
                  <Select
                    value={sortDirection}
                    onValueChange={(value: "asc" | "desc") => {
                      setSortDirection(value);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Ascending</SelectItem>
                      <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 bg-white dark:bg-gray-900 z-10 min-w-[200px]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("cluster")}
                    className="h-auto p-0 font-medium"
                  >
                    Cluster {getSortIcon("cluster")}
                  </Button>
                </TableHead>
                <TableHead className="min-w-[120px]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("region")}
                    className="h-auto p-0"
                  >
                    Region {getSortIcon("region")}
                  </Button>
                </TableHead>
                <TableHead className="min-w-[120px]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("district")}
                    className="h-auto p-0"
                  >
                    District {getSortIcon("district")}
                  </Button>
                </TableHead>
                
                {/* Month 6 */}
                <TableHead className="text-center min-w-[120px]">
                  <div className="flex flex-col items-center gap-1">
                    <Badge variant="outline" className="text-xs">Month 6</Badge>
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3 text-blue-600" />
                      <span className="text-xs">Achievement</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-green-600" />
                      <span className="text-xs">Income</span>
                    </div>
                  </div>
                </TableHead>
                
                {/* Month 9 */}
                <TableHead className="text-center min-w-[120px]">
                  <div className="flex flex-col items-center gap-1">
                    <Badge variant="outline" className="text-xs">Month 9</Badge>
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3 text-blue-600" />
                      <span className="text-xs">Achievement</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-green-600" />
                      <span className="text-xs">Income</span>
                    </div>
                  </div>
                </TableHead>
                
                {/* Month 12 */}
                <TableHead className="text-center min-w-[120px]">
                  <div className="flex flex-col items-center gap-1">
                    <Badge variant="outline" className="text-xs">Month 12</Badge>
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3 text-blue-600" />
                      <span className="text-xs">Achievement</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-green-600" />
                      <span className="text-xs">Income</span>
                    </div>
                  </div>
                </TableHead>
                
                {/* Month 18 */}
                <TableHead className="text-center min-w-[120px]">
                  <div className="flex flex-col items-center gap-1">
                    <Badge variant="outline" className="text-xs">Month 18</Badge>
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3 text-blue-600" />
                      <span className="text-xs">Achievement</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-green-600" />
                      <span className="text-xs">Income</span>
                    </div>
                  </div>
                </TableHead>

                {/* Month 23 */}
                <TableHead className="text-center min-w-[120px]">
                  <div className="flex flex-col items-center gap-1">
                    <Badge variant="outline" className="text-xs">Month 23</Badge>
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3 text-blue-600" />
                      <span className="text-xs">Achievement</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-green-600" />
                      <span className="text-xs">Income</span>
                    </div>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((cluster) => (
                <TableRow key={cluster.cluster}>
                  <TableCell className="sticky left-0 bg-white dark:bg-gray-900 z-10 font-medium">
                    {cluster.cluster}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                    {cluster.region}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                    {cluster.district}
                  </TableCell>
                  
                  {/* Month 6 */}
                  <TableCell className="text-center">
                    <div className="flex flex-col gap-1">
                      <div className={`text-sm font-medium ${getAchievementColor(cluster.month6.achievement_rate)}`}>
                        {renderValue(cluster.month6.achievement_rate, 'achievement')}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {renderValue(cluster.month6.avg_income, 'income')}
                      </div>
                    </div>
                  </TableCell>
                  
                  {/* Month 9 */}
                  <TableCell className="text-center">
                    <div className="flex flex-col gap-1">
                      <div className={`text-sm font-medium ${getAchievementColor(cluster.month9.achievement_rate)}`}>
                        {renderValue(cluster.month9.achievement_rate, 'achievement')}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {renderValue(cluster.month9.avg_income, 'income')}
                      </div>
                    </div>
                  </TableCell>
                  
                  {/* Month 12 */}
                  <TableCell className="text-center">
                    <div className="flex flex-col gap-1">
                      <div className={`text-sm font-medium ${getAchievementColor(cluster.month12.achievement_rate)}`}>
                        {renderValue(cluster.month12.achievement_rate, 'achievement')}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {renderValue(cluster.month12.avg_income, 'income')}
                      </div>
                    </div>
                  </TableCell>
                  
                  {/* Month 18 */}
                  <TableCell className="text-center">
                    <div className="flex flex-col gap-1">
                      <div className={`text-sm font-medium ${getAchievementColor(cluster.month18.achievement_rate)}`}>
                        {renderValue(cluster.month18.achievement_rate, 'achievement')}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {renderValue(cluster.month18.avg_income, 'income')}
                      </div>
                    </div>
                  </TableCell>

                  {/* Month 23 */}
                  <TableCell className="text-center">
                    <div className="flex flex-col gap-1">
                      <div className={`text-sm font-medium ${getAchievementColor(cluster.month23.achievement_rate)}`}>
                        {renderValue(cluster.month23.achievement_rate, 'achievement')}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {renderValue(cluster.month23.avg_income, 'income')}
                      </div>
                    </div>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(endIndex, processedData.length)} of {processedData.length} clusters
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        {/* <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span>High Achievement (≥80%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
              <span>Medium Achievement (60-79%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span>Low Achievement (&lt;60%)</span>
            </div>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
} 