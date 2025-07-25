import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip, FormControl, InputLabel, MenuItem, Select, OutlinedInput, SelectChangeEvent, Checkbox, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, Pagination, IconButton, Button, Switch, FormControlLabel, Skeleton } from '@mui/material';
import ClusterStats from '../../../components/Tables/ClusterStats';
import DistrictStats from '../../../components/Tables/DistrictStats';
import RegionPerformanceChart from '../../../components/Charts/RegionPerformanceChart';
import DashboardCharts from '../../../components/Charts/DashboardCharts';
import { ArrowUpward, ArrowDownward, GetApp, ViewList } from '@mui/icons-material';
import { API_ENDPOINT } from '../../../api/endpoints';
import HouseholdMap from '../../../components/Maps/HouseholdMap'

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


  const AreaManagerPredictionsDashbord: React.FC = () => {
  const region = localStorage.getItem("region");

  // State for grouping
  const [groupBy, setGroupBy] = useState<string>('none');
  
  // State for filter options
  const [cohortOptions, setCohortOptions] = useState<FilterOption[]>([]);
  const [cycleOptions, setCycleOptions] = useState<FilterOption[]>([]);
  const [evaluationMonthOptions, setEvaluationMonthOptions] = useState<FilterOption[]>([]);
  const [regionOptions, setRegionOptions] = useState<FilterOption[]>([]);
  const [districtOptions, setDistrictOptions] = useState<FilterOption[]>([]);
  const [clusterOptions, setClusterOptions] = useState<FilterOption[]>([]);
  const [villageOptions, setVillageOptions] = useState<FilterOption[]>([]);
  
  // State for selected filters
  const [selectedCohorts, setSelectedCohorts] = useState<string[]>([]);
  const [selectedCycles, setSelectedCycles] = useState<string[]>([]);
  const [selectedEvaluationMonths, setSelectedEvaluationMonths] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(region ? [region] : []);
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
  const [rowsPerPage, setRowsPerPage] = useState<number>(200);
  
  // State for fetching all data
  const [fetchAllData, setFetchAllData] = useState<boolean>(false);
  const [isLoadingAllData, setIsLoadingAllData] = useState<boolean>(false);
  
  // State for sorting
  const [sortField, setSortField] = useState<keyof PredictionData | ''>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Effect to set initial region filter
  useEffect(() => {
    if (region) {
      setSelectedRegions([region]);
    }
  }, [region]);

  // Fetch all data by making multiple requests if needed
  const fetchAllDataIteratively = async () => {
    try {
      setIsLoadingAllData(true);
      let allData: PredictionData[] = [];
      let currentPage = 1;
      let hasMoreData = true;
      const pageSize = 500; // Reduced page size for better reliability
      
      console.log('Starting to fetch all data iteratively...');
      
      while (hasMoreData) {
        const params = new URLSearchParams();
        params.append('page', currentPage.toString());
        params.append('page_size', pageSize.toString());
        
        // Add filter parameters
        if (selectedCohorts.length > 0) params.append('cohort', selectedCohorts.join(','));
        if (selectedCycles.length > 0) params.append('cycle', selectedCycles.join(','));
        if (selectedEvaluationMonths.length > 0) params.append('evaluation_month', selectedEvaluationMonths.join(','));
        // Always include user's region in params
        params.append('region', region || '');
        if (selectedDistricts.length > 0) params.append('district', selectedDistricts.join(','));
        if (selectedClusters.length > 0) params.append('cluster', selectedClusters.join(','));
        if (selectedVillages.length > 0) params.append('village', selectedVillages.join(','));
        
        if (groupBy !== 'none') {
          params.append('group_by', groupBy);
        }
        
        console.log(`Fetching page ${currentPage} with params:`, params.toString());
        
        const response = await fetch(`${API_ENDPOINT}/standard-evaluations/?${params.toString()}`);
        if (!response.ok) {
          console.error(`Failed to fetch page ${currentPage}, status:`, response.status, response.statusText);
          throw new Error(`Failed to fetch data on page ${currentPage}: ${response.status}`);
        }
        
        const result = await response.json();
        console.log(`Page ${currentPage} result:`, {
          resultsLength: result.results?.length || 0,
          hasNext: !!result.next,
          totalCount: result.count,
          currentDataLength: allData.length,
          regionFilter: region // Log region filter for verification
        });
        
        if (result.results && result.results.length > 0) {
          // Verify that all results are from the user's region
          const filteredResults = region 
            ? result.results.filter((item: PredictionData) => item.region === region)
            : result.results;
            
          allData = [...allData, ...filteredResults];
          // Check if there's more data - look for 'next' property or if we got fewer results than requested
          hasMoreData = result.results.length === pageSize && !!result.next;
          currentPage++;
          
          // Safety check to prevent infinite loops
          if (currentPage > 50) { // Max 50 pages = 25,000 records
            console.warn('Reached maximum page limit, stopping...');
            hasMoreData = false;
          }
        } else {
          console.log('No more results found, stopping...');
          hasMoreData = false;
        }
        
        // Add a small delay to prevent overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log(`Fetch complete! Total records: ${allData.length}, Region filter: ${region}`);
      setPredictions(allData);
      setTotalCount(allData.length);
      setAllPredictions(allData);
      
    } catch (err) {
      setError(`Failed to fetch all data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Fetch all data error:', err);
    } finally {
      setIsLoadingAllData(false);
    }
  };

  // Fetch predictions and filter options in a single optimized call
  const fetchData = async (page: number = 1, getAllData: boolean = false) => {
    try {
      setLoading(true);
      if (getAllData) {
        // Use the iterative approach for fetching all data
        await fetchAllDataIteratively();
        
        // Still fetch filter options
        const filterParams = new URLSearchParams();
        if (selectedCohorts.length > 0) filterParams.append('cohort', selectedCohorts.join(','));
        if (selectedCycles.length > 0) filterParams.append('cycle', selectedCycles.join(','));
        if (selectedEvaluationMonths.length > 0) filterParams.append('evaluation_month', selectedEvaluationMonths.join(','));
        // Always include user's region in filter params
        filterParams.append('region', region || '');
        if (selectedDistricts.length > 0) filterParams.append('district', selectedDistricts.join(','));
        if (selectedClusters.length > 0) filterParams.append('cluster', selectedClusters.join(','));
        
        const filterResponse = await fetch(`${API_ENDPOINT}/filter-options/?${filterParams.toString()}`);
        if (filterResponse.ok) {
          const filterResult = await filterResponse.json();
          
          // Update filter options
          if (filterResult) {
            setCohortOptions(filterResult.cohorts?.map((c: string) => ({ value: c, label: c })) || []);
            setCycleOptions(filterResult.cycles?.map((c: string) => ({ value: c, label: c })) || []);
            setEvaluationMonthOptions(filterResult.evaluation_months?.map((em: number) => ({ value: em.toString(), label: `Month ${em}` })) || []);
            // Only set region options if user is superuser
            if (!region) {
            setRegionOptions(filterResult.regions?.map((r: string) => ({ value: r, label: r })) || []);
            }
            setDistrictOptions(filterResult.districts?.map((d: string) => ({ value: d, label: d })) || []);
            setClusterOptions(filterResult.clusters?.map((c: string) => ({ value: c, label: c })) || []);
            setVillageOptions(filterResult.villages?.map((v: string) => ({ value: v, label: v })) || []);
          }
        }
        return;
      }
      
      // Build query parameters for both data and filters
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('page_size', rowsPerPage.toString());
      
             if (selectedCohorts.length > 0) params.append('cohort', selectedCohorts.join(','));
       if (selectedCycles.length > 0) params.append('cycle', selectedCycles.join(','));
       if (selectedEvaluationMonths.length > 0) params.append('evaluation_month', selectedEvaluationMonths.join(','));
      // Always include user's region in params
      params.append('region', region || '');
       if (selectedDistricts.length > 0) params.append('district', selectedDistricts.join(','));
       if (selectedClusters.length > 0) params.append('cluster', selectedClusters.join(','));
       if (selectedVillages.length > 0) params.append('village', selectedVillages.join(','));
      
      if (groupBy !== 'none') {
        params.append('group_by', groupBy);
      }
      
      console.log('Fetching data with params:', params.toString());
      
      // Build separate parameters for filter options (without pagination)
      const filterParams = new URLSearchParams();
      if (selectedCohorts.length > 0) filterParams.append('cohort', selectedCohorts.join(','));
      if (selectedCycles.length > 0) filterParams.append('cycle', selectedCycles.join(','));
      if (selectedEvaluationMonths.length > 0) filterParams.append('evaluation_month', selectedEvaluationMonths.join(','));
      // Always include user's region in filter params
      filterParams.append('region', region || '');
      if (selectedDistricts.length > 0) filterParams.append('district', selectedDistricts.join(','));
      if (selectedClusters.length > 0) filterParams.append('cluster', selectedClusters.join(','));
      
      // Make parallel API calls for data and filter options
      const [dataResponse, filterResponse] = await Promise.all([
        fetch(`${API_ENDPOINT}/standard-evaluations/?${params.toString()}`),
        fetch(`${API_ENDPOINT}/filter-options/?${filterParams.toString()}`)
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
          setAllPredictions(dataResult.results);
        } else if (dataResult.predictions) {
          // Non-paginated fallback
          setPredictions(dataResult.predictions);
          setTotalCount(dataResult.predictions.length);
          setAllPredictions(dataResult.predictions);
        }
      }
      
             // Update filter options
       if (filterResult) {
         setCohortOptions(filterResult.cohorts?.map((c: string) => ({ value: c, label: c })) || []);
         setCycleOptions(filterResult.cycles?.map((c: string) => ({ value: c, label: c })) || []);
         setEvaluationMonthOptions(filterResult.evaluation_months?.map((em: number) => ({ value: em.toString(), label: `Month ${em}` })) || []);
        // Only set region options if user is superuser
        if (!region) {
         setRegionOptions(filterResult.regions?.map((r: string) => ({ value: r, label: r })) || []);
        }
         setDistrictOptions(filterResult.districts?.map((d: string) => ({ value: d, label: d })) || []);
         setClusterOptions(filterResult.clusters?.map((c: string) => ({ value: c, label: c })) || []);
         setVillageOptions(filterResult.villages?.map((v: string) => ({ value: v, label: v })) || []);
       }
      
      // Save the query parameters for the child components
      setQueryParams(params);
      
      } catch (err) {
      setError('Failed to fetch data');
      console.error('Data fetch error:', err);
      } finally {
        setLoading(false);
      setIsLoadingAllData(false);
      }
    };
    
  // Initial data load
  useEffect(() => {
    // Automatically load all data for area manager
    setFetchAllData(true);
    fetchAllDataSimple();
  }, []); // Only run once on mount
  
  // Debounced effect for filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when filters change
      fetchData(1, fetchAllData);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
     }, [
     groupBy,
     selectedCohorts,
     selectedCycles,
     selectedEvaluationMonths,
     selectedRegions,
     selectedDistricts,
     selectedClusters,
     selectedVillages,
     rowsPerPage,
     fetchAllData
   ]);

  // Handle pagination changes
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchData(newPage);
  };

  // Simple approach to fetch all data without pagination
  const fetchAllDataSimple = async () => {
    try {
      setIsLoadingAllData(true);
      
      const params = new URLSearchParams();
      // Don't add pagination parameters at all
      
      // Add filter parameters
      if (selectedCohorts.length > 0) params.append('cohort', selectedCohorts.join(','));
      if (selectedCycles.length > 0) params.append('cycle', selectedCycles.join(','));
      if (selectedEvaluationMonths.length > 0) params.append('evaluation_month', selectedEvaluationMonths.join(','));
      // Always include user's region in params
      params.append('region', region || '');
      if (selectedDistricts.length > 0) params.append('district', selectedDistricts.join(','));
      if (selectedClusters.length > 0) params.append('cluster', selectedClusters.join(','));
      if (selectedVillages.length > 0) params.append('village', selectedVillages.join(','));
      
      if (groupBy !== 'none') {
        params.append('group_by', groupBy);
      }
      
      console.log('Trying simple approach with params:', params.toString());
      
      const response = await fetch(`${API_ENDPOINT}/standard-evaluations/?${params.toString()}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      
      const result = await response.json();
      console.log('Simple approach result:', {
        hasResults: !!result.results,
        resultsLength: result.results?.length || 0,
        hasPredictions: !!result.predictions,
        predictionsLength: result.predictions?.length || 0,
        totalCount: result.count,
        allKeys: Object.keys(result),
        regionFilter: region // Log region filter for verification
      });
      
      // Try different possible response structures
      let dataArray = [];
      if (result.results && Array.isArray(result.results)) {
        dataArray = result.results;
      } else if (result.predictions && Array.isArray(result.predictions)) {
        dataArray = result.predictions;
      } else if (Array.isArray(result)) {
        dataArray = result;
      }

      // Verify that all results are from the user's region
      if (region) {
        dataArray = dataArray.filter((item: PredictionData) => item.region === region);
      }
      
      if (dataArray.length === 0) {
        console.log('Simple approach failed, trying iterative approach...');
        await fetchAllDataIteratively();
        return;
      }
      
      console.log(`Simple approach successful! Got ${dataArray.length} records for region: ${region}`);
      setPredictions(dataArray);
      setTotalCount(dataArray.length);
      setAllPredictions(dataArray);
      
    } catch (err) {
      console.error('Simple approach failed:', err);
      console.log('Falling back to iterative approach...');
      await fetchAllDataIteratively();
    } finally {
      setIsLoadingAllData(false);
    }
  };

  // Handle fetch all data
  const handleFetchAllData = () => {
    setFetchAllData(true);
    setCurrentPage(1);
    fetchAllDataSimple();
  };

  // Handle return to paginated data
  const handleReturnToPaginated = () => {
    setFetchAllData(false);
    setCurrentPage(1);
    fetchData(1, false);
  };

     // Handle filter changes with cascading logic
   const handleFilterChange = (
     event: SelectChangeEvent<string[]>,
     setterFunction: React.Dispatch<React.SetStateAction<string[]>>,
     filterLevel: 'cohort' | 'cycle' | 'evaluation_month' | 'region' | 'district' | 'cluster' | 'village'
   ) => {
    const value = event.target.value;
    const newValue = typeof value === 'string' ? value.split(',') : value;
    
    // Set the new value for the current filter
    setterFunction(newValue);
    
         // Clear dependent filters when a higher-level filter changes
     switch (filterLevel) {
       case 'cohort':
         setSelectedCycles([]);
         setSelectedEvaluationMonths([]);
         setSelectedRegions([]);
         setSelectedDistricts([]);
         setSelectedClusters([]);
         setSelectedVillages([]);
         break;
       case 'cycle':
         setSelectedEvaluationMonths([]);
         setSelectedRegions([]);
         setSelectedDistricts([]);
         setSelectedClusters([]);
         setSelectedVillages([]);
         break;
       case 'evaluation_month':
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
            
            {/* Fetch All Data Toggle */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {fetchAllData ? (
                <Button
                  variant="outlined"
                  startIcon={<ViewList />}
                  onClick={handleReturnToPaginated}
                  disabled={isLoadingAllData}
                  size="small"
                >
                  Return to Paginated View
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<GetApp />}
                  onClick={handleFetchAllData}
                  disabled={loading || isLoadingAllData}
                  size="small"
                  sx={{ 
                    bgcolor: '#EA580C', 
                    '&:hover': { bgcolor: '#C2410C' },
                    color: 'white'
                  }}
                >
                  {isLoadingAllData ? 'Loading All Data...' : 'Load All Data'}
                </Button>
              )}
            </Box>
          </Box>
          
          {/* Active Filters Display */}
          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
            {(selectedCohorts.length > 0 || selectedCycles.length > 0 || selectedEvaluationMonths.length > 0 || 
              selectedRegions.length > 0 || selectedDistricts.length > 0 || selectedClusters.length > 0 || 
              selectedVillages.length > 0) && (
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
                    setSelectedEvaluationMonths([]);
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
            
            {selectedEvaluationMonths.length > 0 && selectedEvaluationMonths.map(value => (
              <Chip 
                key={`evaluation-month-${value}`} 
                label={`Month: ${value}`}
                size="small"
                onDelete={() => {
                  setSelectedEvaluationMonths(prev => prev.filter(item => item !== value));
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
              
            {renderFilter('Evaluation Month', evaluationMonthOptions, selectedEvaluationMonths, 
              (e) => handleFilterChange(e, setSelectedEvaluationMonths, 'evaluation_month'))}
              
            {!region && renderFilter('Region', regionOptions, selectedRegions, 
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
        <div>
          {/* Dashboard Charts Skeleton */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Grid container spacing={3}>
                {[1, 2, 3, 4].map(i => (
                  <Grid item xs={12} sm={6} md={3} key={i}>
                    <Box>
                      <Skeleton variant="text" width="70%" height={24} />
                      <Skeleton variant="text" width="50%" height={48} />
                      <Skeleton variant="text" width="40%" height={20} />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Map Skeleton */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Skeleton variant="text" width="25%" height={32} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={400} />
            </CardContent>
          </Card>

          {/* Charts Skeleton */}
          <Grid container spacing={4}>
            {/* Region Performance Chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
                  <Skeleton variant="rectangular" width="100%" height={300} />
                </CardContent>
              </Card>
            </Grid>

            {/* Additional Chart Placeholder */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="35%" height={32} sx={{ mb: 2 }} />
                  <Skeleton variant="rectangular" width="100%" height={300} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Table/Data Skeleton */}
          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <TableCell key={i}>
                          <Skeleton variant="text" width="80%" height={24} />
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(row => (
                      <TableRow key={row}>
                        {[1, 2, 3, 4, 5, 6].map(col => (
                          <TableCell key={col}>
                            <Skeleton variant="text" width="90%" height={20} />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Pagination Skeleton */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Skeleton variant="rounded" width={300} height={40} />
          </Box>
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
                  {fetchAllData 
                    ? `(Showing all ${predictions.length} records)`
                    : `(Showing ${predictions.length} of ${totalCount} records - Page ${currentPage} of ${totalPages})`
                  }
                </span>
              </Typography>

              {/* Interactive Dashboard Charts */}
              <DashboardCharts data={predictions} totalCount={totalCount} />

              <div className="">
                {/* Insert map here */}
                <HouseholdMap households={predictions} />

                {/* Region Performance Chart */}
                <RegionPerformanceChart data={predictions} />

                {/* Cohort Performance Chart */}
                {/* <CohortPerformanceChart data={predictions} /> */}



                {/* Pagination Controls - Only show when not fetching all data */}
                {!fetchAllData && totalPages > 1 && (
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
                
                {/* All Data Information */}
                {fetchAllData && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      bgcolor: '#f5f5f5', 
                      p: 2, 
                      borderRadius: 1,
                      border: '1px solid #e0e0e0'
                    }}>
                      📊 All available data has been loaded ({predictions.length} records). 
                      Charts and analysis include complete dataset.
                    </Typography>
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

export default AreaManagerPredictionsDashbord;

