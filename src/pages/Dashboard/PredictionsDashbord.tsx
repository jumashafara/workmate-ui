import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip, FormControl, InputLabel, MenuItem, Select, OutlinedInput, SelectChangeEvent, Checkbox, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, Pagination, IconButton } from '@mui/material';
import ClusterStats from '../../components/Tables/ClusterStats';
import DistrictStats from '../../components/Tables/DistrictStats';
import { ArrowUpward, ArrowDownward, PeopleAlt, Percent, AttachMoney, BarChart } from '@mui/icons-material';
import { API_ENDPOINT } from '../../api/endpoints';
import HouseholdMap from '../../components/Maps/HouseholdMap'

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
  latitude: number;
  longitude: number;
  altitude: number;
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
  const [allPredictions, setAllPredictions] = useState<PredictionData[]>([]);
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for query parameters
  const [queryParams, setQueryParams] = useState<URLSearchParams>(new URLSearchParams());

  // State for pagination from API
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(50);
  
  // State for sorting
  const [sortField, setSortField] = useState<keyof PredictionData | ''>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Fetch predictions and filter options in a single optimized call
  const fetchData = async (page: number = 1) => {
    try {
      setLoading(true);
      
      // Build query parameters for both data and filters
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('page_size', rowsPerPage.toString());
      
      if (selectedCohorts.length > 0) params.append('cohort', selectedCohorts.join(','));
      if (selectedCycles.length > 0) params.append('cycle', selectedCycles.join(','));
      if (selectedRegions.length > 0) params.append('region', selectedRegions.join(','));
      if (selectedDistricts.length > 0) params.append('district', selectedDistricts.join(','));
      if (selectedClusters.length > 0) params.append('cluster', selectedClusters.join(','));
      if (selectedVillages.length > 0) params.append('village', selectedVillages.join(','));
      
      if (groupBy !== 'none') {
        params.append('group_by', groupBy);
      }
      
      console.log('Fetching data with params:', params.toString());
      
      // Make parallel API calls for data and filter options
      const [dataResponse, filterResponse] = await Promise.all([
        fetch(`${API_ENDPOINT}/standard-evaluations/?${params.toString()}`),
        fetch(`${API_ENDPOINT}/filter-options/?${params.toString()}`)
      ]);
      
      if (!dataResponse.ok || !filterResponse.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const [dataResult, filterResult] = await Promise.all([
        dataResponse.json(),
        filterResponse.json()
      ]);
      
      console.log('Data received:', dataResult);
      console.log('Filter options received:', filterResult);
      
      // Handle paginated data response
      if (groupBy === 'none') {
        if (dataResult.results) {
          // Paginated response
          setPredictions(dataResult.results);
          setTotalCount(dataResult.count || 0);
          setAllPredictions(dataResult.results); // For summary calculations
        } else if (dataResult.predictions) {
          // Non-paginated fallback
          setPredictions(dataResult.predictions);
          setTotalCount(dataResult.predictions.length);
          setAllPredictions(dataResult.predictions);
        }
      }
      
      // Update filter options
      if (filterResult) {
        setCohortOptions(filterResult.cohorts.map((c: string) => ({ value: c, label: c })));
        setCycleOptions(filterResult.cycles.map((c: string) => ({ value: c, label: c })));
        setRegionOptions(filterResult.regions.map((r: string) => ({ value: r, label: r })));
        setDistrictOptions(filterResult.districts.map((d: string) => ({ value: d, label: d })));
        setClusterOptions(filterResult.clusters.map((c: string) => ({ value: c, label: c })));
        setVillageOptions(filterResult.villages.map((v: string) => ({ value: v, label: v })));
      }
      
      // Save the query parameters for the child components
      setQueryParams(params);
      
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchData(1);
  }, []);

  // Debounced effect for filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when filters change
      fetchData(1);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [
    groupBy,
    selectedCohorts,
    selectedCycles,
    selectedRegions,
    selectedDistricts,
    selectedClusters,
    selectedVillages,
    rowsPerPage
  ]);

  // Handle pagination changes
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchData(newPage);
  };

  // Handle filter changes with cascading logic
  const handleFilterChange = (
    event: SelectChangeEvent<string[]>,
    setterFunction: React.Dispatch<React.SetStateAction<string[]>>,
    filterLevel: 'cohort' | 'cycle' | 'region' | 'district' | 'cluster' | 'village'
  ) => {
    const value = event.target.value;
    const newValue = typeof value === 'string' ? value.split(',') : value;
    
    // Set the new value for the current filter
    setterFunction(newValue);
    
    // Clear dependent filters when a higher-level filter changes
    switch (filterLevel) {
      case 'cohort':
        setSelectedCycles([]);
        setSelectedRegions([]);
        setSelectedDistricts([]);
        setSelectedClusters([]);
        setSelectedVillages([]);
        break;
      case 'cycle':
        setSelectedRegions([]);
        setSelectedDistricts([]);
        setSelectedClusters([]);
        setSelectedVillages([]);
        break;
      case 'region':
        setSelectedDistricts([]);
        setSelectedClusters([]);
        setSelectedVillages([]);
        break;
      case 'district':
        setSelectedClusters([]);
        setSelectedVillages([]);
        break;
      case 'cluster':
        setSelectedVillages([]);
        break;
      case 'village':
        // No dependent filters to clear
        break;
    }
  };
  


  // Handle sorting
  const handleSort = (field: keyof PredictionData) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
  };

  // Server-side pagination is now handled by the API

  // Get sort icon
  const getSortIcon = (field: keyof PredictionData) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />;
  };

  // Calculate total pages from API response
  const totalPages = Math.ceil(totalCount / rowsPerPage);
  
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
              <Chip 
                key={value} 
                label={value} 
                size="small" 
              />
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
          
          {/* Active Filters Display */}
          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
            {(selectedCohorts.length > 0 || selectedCycles.length > 0 || selectedRegions.length > 0 || 
              selectedDistricts.length > 0 || selectedClusters.length > 0 || selectedVillages.length > 0) && (
              <>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Active Filters:
                </Typography>
                <Chip 
                  label="Clear All" 
                  size="small" 
                  color="warning"
                  onClick={() => {
                    setSelectedCohorts([]);
                    setSelectedCycles([]);
                    setSelectedRegions([]);
                    setSelectedDistricts([]);
                    setSelectedClusters([]);
                    setSelectedVillages([]);
                  }}
                />
              </>
            )}
            
            {selectedCohorts.length > 0 && selectedCohorts.map(value => (
              <Chip 
                key={`cohort-${value}`} 
                label={`Cohort: ${value}`}
                size="small"
                onDelete={() => {
                  setSelectedCohorts(prev => prev.filter(item => item !== value));
                }}
              />
            ))}
            
            {selectedCycles.length > 0 && selectedCycles.map(value => (
              <Chip 
                key={`cycle-${value}`} 
                label={`Cycle: ${value}`}
                size="small"
                onDelete={() => {
                  setSelectedCycles(prev => prev.filter(item => item !== value));
                }}
              />
            ))}
            
            {selectedRegions.length > 0 && selectedRegions.map(value => (
              <Chip 
                key={`region-${value}`} 
                label={`Region: ${value}`}
                size="small"
                onDelete={() => {
                  setSelectedRegions(prev => prev.filter(item => item !== value));
                }}
              />
            ))}
            
            {selectedDistricts.length > 0 && selectedDistricts.map(value => (
              <Chip 
                key={`district-${value}`} 
                label={`District: ${value}`}
                size="small"
                onDelete={() => {
                  setSelectedDistricts(prev => prev.filter(item => item !== value));
                }}
              />
            ))}
            
            {selectedClusters.length > 0 && selectedClusters.map(value => (
              <Chip 
                key={`cluster-${value}`} 
                label={`Cluster: ${value}`}
                size="small"
                onDelete={() => {
                  setSelectedClusters(prev => prev.filter(item => item !== value));
                }}
              />
            ))}
            
            {selectedVillages.length > 0 && selectedVillages.map(value => (
              <Chip 
                key={`village-${value}`} 
                label={`Village: ${value}`}
                size="small"
                onDelete={() => {
                  setSelectedVillages(prev => prev.filter(item => item !== value));
                }}
              />
            ))}
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {renderFilter('Cohort', cohortOptions, selectedCohorts, 
              (e) => handleFilterChange(e, setSelectedCohorts, 'cohort'))}
              
            {renderFilter('Cycle', cycleOptions, selectedCycles, 
              (e) => handleFilterChange(e, setSelectedCycles, 'cycle'))}
              
            {renderFilter('Region', regionOptions, selectedRegions, 
              (e) => handleFilterChange(e, setSelectedRegions, 'region'))}
              
            {renderFilter('District', districtOptions, selectedDistricts, 
              (e) => handleFilterChange(e, setSelectedDistricts, 'district'))}
              
            {renderFilter('Cluster', clusterOptions, selectedClusters, 
              (e) => handleFilterChange(e, setSelectedClusters, 'cluster'))}
              
            {renderFilter('Village', villageOptions, selectedVillages, 
              (e) => handleFilterChange(e, setSelectedVillages, 'village'))}
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
                  (Showing {predictions.length} of {totalCount} records - Page {currentPage} of {totalPages})
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
                          {totalCount}
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
                          Achieved
                        </Typography>
                        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                          {(averages.avgPrediction * 100).toFixed(2)}
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
                          {averages.avgIncome.toFixed(2)}
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
                          {predictions.length}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <div className="">
                {/* Insert map here */}
                <HouseholdMap households={predictions} />

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination 
                      count={totalPages} 
                      page={currentPage} 
                      onChange={(event, page) => handlePageChange(page)}
                      color="primary"
                      size="large"
                      showFirstButton 
                      showLastButton
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

