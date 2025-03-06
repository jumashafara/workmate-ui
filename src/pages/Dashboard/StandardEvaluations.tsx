import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip, FormControl, InputLabel, MenuItem, Select, OutlinedInput, SelectChangeEvent, Checkbox, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, Pagination, IconButton } from '@mui/material';
import ClusterStats from '../../components/Tables/ClusterStats';
import DistrictStats from '../../components/Tables/DistrictStats';
import { ArrowUpward, ArrowDownward, PeopleAlt, Percent, AttachMoney, BarChart } from '@mui/icons-material';

// Define interfaces for our data
interface FilterOption {
  value: string;
  label: string;
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
  evaluation_month: number;
  prediction: number;
  probability: number;
  predicted_income: number;
  // Add other fields as needed
}

const StandardEvaluations: React.FC = () => {
  // State for grouping
  const [groupBy, setGroupBy] = useState<string>('none');
  
  // State for filter options
  const [cohortOptions, setCohortOptions] = useState<FilterOption[]>([]);
  const [cycleOptions, setCycleOptions] = useState<FilterOption[]>([]);
  const [regionOptions, setRegionOptions] = useState<FilterOption[]>([]);
  const [districtOptions, setDistrictOptions] = useState<FilterOption[]>([]);
  const [clusterOptions, setClusterOptions] = useState<FilterOption[]>([]);
  const [villageOptions, setVillageOptions] = useState<FilterOption[]>([]);
  
  // State for selected filters
  const [selectedCohorts, setSelectedCohorts] = useState<string[]>([]);
  const [selectedCycles, setSelectedCycles] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedClusters, setSelectedClusters] = useState<string[]>([]);
  const [selectedVillages, setSelectedVillages] = useState<string[]>([]);
  
  // State for predictions data
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for query parameters
  const [queryParams, setQueryParams] = useState<URLSearchParams>(new URLSearchParams());

  // State for pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(30);
  
  // State for sorting
  const [sortField, setSortField] = useState<keyof PredictionData | ''>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Fetch all predictions to get filter options
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://workmate.api.dataidea.org/api/standard-evaluations/');
        const data = await response.json();
        
        if (data.predictions) {
          setPredictions(data.predictions);
          
          // Extract unique values for filter options and create option objects
          const extractOptions = (field: keyof PredictionData): FilterOption[] => {
            const uniqueValues = [...new Set(data.predictions
              .map((p: PredictionData) => p[field])
              .filter(Boolean))] as string[];
              
            return uniqueValues.map(value => ({ 
              value: value, 
              label: value 
            }));
          };
          
          setCohortOptions(extractOptions('cohort'));
          setCycleOptions(extractOptions('cycle'));
          setRegionOptions(extractOptions('region'));
          setDistrictOptions(extractOptions('district'));
          setClusterOptions(extractOptions('cluster'));
          setVillageOptions(extractOptions('village'));
        }
      } catch (err) {
        setError('Failed to fetch predictions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPredictions();
  }, []);
  
  // Handle filter changes
  const handleFilterChange = (
    event: SelectChangeEvent<string[]>,
    setterFunction: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const value = event.target.value;
    setterFunction(typeof value === 'string' ? value.split(',') : value);
  };
  
  // Apply filters and fetch grouped data
  const applyFilters = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      
      if (selectedCohorts.length > 0) params.append('cohort', selectedCohorts.join(','));
      if (selectedCycles.length > 0) params.append('cycle', selectedCycles.join(','));
      if (selectedRegions.length > 0) params.append('region', selectedRegions.join(','));
      if (selectedDistricts.length > 0) params.append('district', selectedDistricts.join(','));
      if (selectedClusters.length > 0) params.append('cluster', selectedClusters.join(','));
      if (selectedVillages.length > 0) params.append('village', selectedVillages.join(','));
      
      // Save the query parameters for the child components
      setQueryParams(params);
      
      if (groupBy !== 'none') {
        params.append('group_by', groupBy);
      }
      
      const response = await fetch(`https://workmate.api.dataidea.org/api/standard-evaluations/?${params.toString()}`);
      const data = await response.json();
      
      if (groupBy === 'none' && data.predictions) {
        setPredictions(data.predictions);
        // Reset to first page when filters change
        setCurrentPage(1);
      }
      
      // The grouped data will be handled by the ClusterStats or DistrictStats components
      
    } catch (err) {
      setError('Failed to apply filters');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Apply filters when any filter or grouping changes
  useEffect(() => {
    applyFilters();
  }, [
    groupBy,
    selectedCohorts,
    selectedCycles,
    selectedRegions,
    selectedDistricts,
    selectedClusters,
    selectedVillages
  ]);

  // Handle sorting
  const handleSort = (field: keyof PredictionData) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
  };

  // Get sorted and paginated data
  const getSortedAndPaginatedData = () => {
    // First sort the data if a sort field is selected
    let sortedData = [...predictions];
    
    if (sortField) {
      sortedData.sort((a, b) => {
        // Handle numeric fields
        if (typeof a[sortField] === 'number' && typeof b[sortField] === 'number') {
          return sortDirection === 'asc' 
            ? (a[sortField] as number) - (b[sortField] as number)
            : (b[sortField] as number) - (a[sortField] as number);
        }
        
        // Handle string fields
        const aValue = String(a[sortField] || '');
        const bValue = String(b[sortField] || '');
        
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
    }
    
    // Then paginate the data
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  };

  // Get sort icon
  const getSortIcon = (field: keyof PredictionData) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />;
  };

  // Calculate total pages
  const totalPages = Math.ceil(predictions.length / rowsPerPage);
  
  // Calculate averages for the filtered data
  const calculateAverages = () => {
    if (!predictions || predictions.length === 0) {
      return { avgPrediction: 0, avgIncome: 0 };
    }

    const totalPrediction = predictions.reduce((sum, item) => sum + item.prediction, 0);
    const totalIncome = predictions.reduce((sum, item) => sum + (item.predicted_income || 0), 0);

    return {
      avgPrediction: totalPrediction / predictions.length,
      avgIncome: totalIncome / predictions.length,
      totalRecords: predictions.length,
      achievedCount: predictions.filter(p => p.prediction === 1).length
    };
  };

  const averages = calculateAverages();
  
  // Render multi-select filter
  const renderFilter = (
    label: string,
    options: FilterOption[],
    value: string[],
    onChange: (event: SelectChangeEvent<string[]>) => void
  ) => (
    <FormControl sx={{ m: 1, width: 200 }} size="small">
      <InputLabel id={`${label.toLowerCase()}-label`}>{label}</InputLabel>
      <Select
        labelId={`${label.toLowerCase()}-label`}
        id={`${label.toLowerCase()}-select`}
        multiple
        value={value}
        onChange={onChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} size="small" />
            ))}
          </Box>
        )}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
  
  return (
    <div className="p-4">
      <Typography variant="h4" component="h1" gutterBottom>
        Predictions Dashboard
      </Typography>
      
      <Card className="mb-4">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {renderFilter('Cohort', cohortOptions, selectedCohorts, 
              (e) => handleFilterChange(e, setSelectedCohorts))}
              
            {renderFilter('Cycle', cycleOptions, selectedCycles, 
              (e) => handleFilterChange(e, setSelectedCycles))}
              
            {renderFilter('Region', regionOptions, selectedRegions, 
              (e) => handleFilterChange(e, setSelectedRegions))}
              
            {renderFilter('District', districtOptions, selectedDistricts, 
              (e) => handleFilterChange(e, setSelectedDistricts))}
              
            {renderFilter('Cluster', clusterOptions, selectedClusters, 
              (e) => handleFilterChange(e, setSelectedClusters))}
              
            {renderFilter('Village', villageOptions, selectedVillages, 
              (e) => handleFilterChange(e, setSelectedVillages))}
          </Box>
        </CardContent>
      </Card>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <div>
          {groupBy === 'cluster' ? (
            <ClusterStats queryParams={queryParams} />
          ) : groupBy === 'district' ? (
            <DistrictStats queryParams={queryParams} />
          ) : (
            <div>
              <Typography variant="h6" gutterBottom>
                Individual Predictions
                <span className="ml-2 text-sm text-gray-500">
                  (Showing {Math.min(predictions.length, rowsPerPage)} of {predictions.length} records)
                </span>
              </Typography>

              {/* Summary Cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ height: '100%', boxShadow: 2 }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                      <PeopleAlt sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                      <Box>
                        <Typography variant="h6" component="div">
                          Total Records
                        </Typography>
                        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                          {predictions.length}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ height: '100%', boxShadow: 2 }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                      <Percent sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                      <Box>
                        <Typography variant="h6" component="div">
                          Avg Achieved
                        </Typography>
                        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                          {averages.avgPrediction.toFixed(2)}%
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ height: '100%', boxShadow: 2 }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                      <AttachMoney sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                      <Box>
                        <Typography variant="h6" component="div">
                          Avg Income + Production
                        </Typography>
                        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                          ${averages.avgIncome.toFixed(2)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ height: '100%', boxShadow: 2 }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                      <BarChart sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                      <Box>
                        <Typography variant="h6" component="div">
                          Filtered Records
                        </Typography>
                        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                          {getSortedAndPaginatedData().length}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-wrap gap-4 mb-4">
                  {/* Filters section remains the same */}
                  {/* ... existing code ... */}
                </div>
                
                <TableContainer component={Paper} elevation={0}>
                  <Table sx={{ minWidth: 650 }} aria-label="predictions table">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
                        <TableCell>
                          <TableSortLabel
                            active={sortField === 'cohort'}
                            direction={sortField === 'cohort' ? sortDirection : 'asc'}
                            onClick={() => handleSort('cohort')}
                          >
                            Cohort
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={sortField === 'cycle'}
                            direction={sortField === 'cycle' ? sortDirection : 'asc'}
                            onClick={() => handleSort('cycle')}
                          >
                            Cycle
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={sortField === 'region'}
                            direction={sortField === 'region' ? sortDirection : 'asc'}
                            onClick={() => handleSort('region')}
                          >
                            Region
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
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
                            active={sortField === 'village'}
                            direction={sortField === 'village' ? sortDirection : 'asc'}
                            onClick={() => handleSort('village')}
                          >
                            Village
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
                            active={sortField === 'prediction'}
                            direction={sortField === 'prediction' ? sortDirection : 'asc'}
                            onClick={() => handleSort('prediction')}
                          >
                            Prediction
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={sortField === 'predicted_income'}
                            direction={sortField === 'predicted_income' ? sortDirection : 'asc'}
                            onClick={() => handleSort('predicted_income')}
                          >
                            Predicted Income
                          </TableSortLabel>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getSortedAndPaginatedData().map((prediction) => (
                        <TableRow 
                          key={prediction.id} 
                          hover
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell>{prediction.cohort}</TableCell>
                          <TableCell>{prediction.cycle}</TableCell>
                          <TableCell>{prediction.region}</TableCell>
                          <TableCell>{prediction.district}</TableCell>
                          <TableCell>{prediction.cluster}</TableCell>
                          <TableCell>{prediction.village}</TableCell>
                          <TableCell>{prediction.evaluation_month}</TableCell>
                          <TableCell>
                            {prediction.prediction === 0 ? 'Achieved' : 'Not Achieved'}
                          </TableCell>
                          <TableCell>
                            ${prediction.predicted_income?.toFixed(2) || '0.00'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {predictions.length > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Showing {Math.min(rowsPerPage, predictions.length)} of {predictions.length} records
                    </Typography>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(event, page) => setCurrentPage(page)}
                      color="primary"
                      shape="rounded"
                    />
                  </Box>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StandardEvaluations;

