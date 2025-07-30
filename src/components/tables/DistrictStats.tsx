import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { API_ENDPOINT } from "../../utils/endpoints";

interface DistrictStat {
  district: string;
  avg_prediction: number;
  avg_income: number;
  evaluation_month: string;
  count?: number;
}

interface DistrictStatsProps {
  apiUrl?: string;
  queryParams?: URLSearchParams;
}

  const DistrictStats: React.FC<DistrictStatsProps> = ({ apiUrl = `${API_ENDPOINT}/district-stats/`, queryParams }) => {
  const [districtStats, setDistrictStats] = useState<DistrictStat[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof DistrictStat>("district");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rowsPerPage = 10; // Number of rows per page

  useEffect(() => {
    fetchDistrictStats();
  }, [apiUrl, queryParams]);

  const fetchDistrictStats = async () => {
    try {
      setLoading(true);
      let url = apiUrl;
      
      // If we're on the standard evaluations page with filters
      if (queryParams) {
        // Add group_by=district to the query params
        const params = new URLSearchParams(queryParams);
        params.set('group_by', 'district');
        url = `/api/standard-evaluations/?${params.toString()}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      // Reset to first page when data changes
      setCurrentPage(1);
      
      // Handle both array response and object with data property
      const statsData = Array.isArray(data) ? data : data.data || [];
      setDistrictStats(statsData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching district stats:", err);
      setError("Failed to load district statistics");
      setLoading(false);
    }
  };

  // Handle sorting
  const handleSort = (field: keyof DistrictStat) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  // Get current rows for pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  
  // Sort data
  const sortedData = [...districtStats].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    // Handle string comparison
    const aString = String(aValue || '');
    const bString = String(bValue || '');
    return sortDirection === 'asc' 
      ? aString.localeCompare(bString) 
      : bString.localeCompare(aString);
  });
  
  const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(districtStats.length / rowsPerPage);

  const SortButton = ({ field, children }: { field: keyof DistrictStat; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto p-0 font-medium justify-start"
      onClick={() => handleSort(field)}
    >
      {children}
      {sortField === field && (
        sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
      )}
    </Button>
  );

  if (loading) return <div>Loading district statistics...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortButton field="district">District</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="evaluation_month">Evaluation Month</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="avg_prediction">Percentage Achieved</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="avg_income">Predicted Income + Production</SortButton>
              </TableHead>
              {districtStats[0]?.count !== undefined && (
                <TableHead>
                  <SortButton field="count">Count</SortButton>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRows.map((stat, index) => (
              <TableRow key={index}>
                <TableCell>{stat.district}</TableCell>
                <TableCell>{stat.evaluation_month}</TableCell>
                <TableCell>{(stat.avg_prediction * 100).toFixed(1)}%</TableCell>
                <TableCell>${(stat.avg_income / 3).toFixed(2)}</TableCell>
                {stat.count !== undefined && (
                  <TableCell>{stat.count}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {districtStats.length > 0 && totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistrictStats;
