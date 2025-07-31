import React, { useEffect, useState } from "react";
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

interface ClusterStat {
  district: string;
  cluster: string;
  avg_prediction: number;
  avg_income: number;
  evaluation_month: string;
  count?: number;
}

interface ClusterStatsProps {
  apiUrl?: string;
  queryParams?: URLSearchParams;
}

const ClusterStats: React.FC<ClusterStatsProps> = ({ apiUrl = `${API_ENDPOINT}/cluster-stats/`, queryParams }) => {
  const [clusterStats, setClusterStats] = useState<ClusterStat[]>([]);
  const [sortField, setSortField] = useState<keyof ClusterStat>("district");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClusterStats();
  }, [apiUrl, queryParams]);

  const fetchClusterStats = async () => {
    try {
      setLoading(true);
      let url = apiUrl;
      
      if (queryParams) {
        const params = new URLSearchParams(queryParams);
        params.set('group_by', 'cluster');
        url = `${API_ENDPOINT}/standard-evaluations/?${params.toString()}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      const statsData = Array.isArray(data) ? data : data.data || [];
      setClusterStats(statsData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching cluster stats:", err);
      setError("Failed to load cluster statistics");
      setLoading(false);
    }
  };

  const handleSort = (field: keyof ClusterStat) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const sortedData = [...clusterStats].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    const aString = String(aValue || '');
    const bString = String(bValue || '');
    return sortDirection === 'asc' 
      ? aString.localeCompare(bString) 
      : bString.localeCompare(aString);
  });
  
  const SortButton = ({ field, children }: { field: keyof ClusterStat; children: React.ReactNode }) => (
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

  if (loading) return <div>Loading cluster statistics...</div>;
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
                <SortButton field="cluster">Cluster</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="evaluation_month">Evaluation Month</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="avg_prediction">Percentage Predicted</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="avg_income">Predicted Income + Production</SortButton>
              </TableHead>
              {clusterStats[0]?.count !== undefined && (
                <TableHead>
                  <SortButton field="count">Count</SortButton>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((stat, index) => (
              <TableRow key={index}>
                <TableCell>{stat.district}</TableCell>
                <TableCell>{stat.cluster}</TableCell>
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
    </div>
  );
};

export default ClusterStats;
