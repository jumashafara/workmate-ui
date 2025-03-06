import React, { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TableSortLabel,
  Box,
  Typography,
  Pagination
} from "@mui/material";

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

const ClusterStats: React.FC<ClusterStatsProps> = ({ apiUrl = "https://workmate.api.dataidea.org/api/cluster-stats/", queryParams }) => {
  const [clusterStats, setClusterStats] = useState<ClusterStat[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof ClusterStat>("district");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rowsPerPage = 10; // Number of rows per page

  useEffect(() => {
    fetchClusterStats();
  }, [apiUrl, queryParams]);

  const fetchClusterStats = async () => {
    try {
      setLoading(true);
      let url = apiUrl;
      
      // If we're on the standard evaluations page with filters
      if (queryParams) {
        // Add group_by=cluster to the query params
        const params = new URLSearchParams(queryParams);
        params.set('group_by', 'cluster');
        url = `https://workmate.api.dataidea.org/api/standard-evaluations/?${params.toString()}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      // Reset to first page when data changes
      setCurrentPage(1);
      
      // Handle both array response and object with data property
      const statsData = Array.isArray(data) ? data : data.data || [];
      setClusterStats(statsData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching cluster stats:", err);
      setError("Failed to load cluster statistics");
      setLoading(false);
    }
  };

  // Handle sorting
  const handleSort = (field: keyof ClusterStat) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  // Get current rows for pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  
  // Sort data
  const sortedData = [...clusterStats].sort((a, b) => {
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
  const totalPages = Math.ceil(clusterStats.length / rowsPerPage);

  if (loading) return <Typography>Loading cluster statistics...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <TableContainer component={Paper} sx={{ maxHeight: 440, boxShadow: 2 }}>
        <Table stickyHeader aria-label="cluster statistics table">
          <TableHead>
            <TableRow>
              <TableCell 
                sortDirection={sortField === 'district' ? sortDirection : false}
              >
                <TableSortLabel
                  active={sortField === 'district'}
                  direction={sortField === 'district' ? sortDirection : 'asc'}
                  onClick={() => handleSort('district')}
                >
                  District
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'cluster'}
                  direction={sortField === 'cluster' ? sortDirection : 'asc'}
                  onClick={() => handleSort('cluster')}
                >
                  Cluster
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'evaluation_month'}
                  direction={sortField === 'evaluation_month' ? sortDirection : 'asc'}
                  onClick={() => handleSort('evaluation_month')}
                >
                  Evaluation Month
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'avg_prediction'}
                  direction={sortField === 'avg_prediction' ? sortDirection : 'asc'}
                  onClick={() => handleSort('avg_prediction')}
                >
                  Percentage Predicted
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'avg_income'}
                  direction={sortField === 'avg_income' ? sortDirection : 'asc'}
                  onClick={() => handleSort('avg_income')}
                >
                  Predicted Income
                </TableSortLabel>
              </TableCell>
              {clusterStats[0]?.count !== undefined && (
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'count'}
                    direction={sortField === 'count' ? sortDirection : 'asc'}
                    onClick={() => handleSort('count' as keyof ClusterStat)}
                  >
                    Count
                  </TableSortLabel>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
              {currentRows.map((stat, index) => (
              <TableRow
                  key={index}
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
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
      </TableContainer>

      {clusterStats.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, page) => setCurrentPage(page)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
};

export default ClusterStats;
