import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  SelectChangeEvent,
  Button,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Skeleton
} from '@mui/material';
import Plot from 'react-plotly.js';
import { API_ENDPOINT } from '../../api/endpoints';

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
}

interface ClusterIncomeData {
  cluster: string;
  evaluation_month: number;
  avg_income: number;
  household_count: number;
  achievement_rate: number;
  region: string;
  district: string;
}

const ClusterIncomeAnalysisPage: React.FC = () => {
  const [data, setData] = useState<ClusterIncomeData[]>([]);
  const [allPredictions, setAllPredictions] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedClusters, setSelectedClusters] = useState<string[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  
  // Filter options
  const [regionOptions, setRegionOptions] = useState<FilterOption[]>([]);
  const [districtOptions, setDistrictOptions] = useState<FilterOption[]>([]);
  const [clusterOptions, setClusterOptions] = useState<FilterOption[]>([]);
  const [monthOptions, setMonthOptions] = useState<FilterOption[]>([]);

  // Fetch data using the same pattern as PredictionsDashboard
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (selectedRegions.length > 0) params.append('region', selectedRegions.join(','));
      if (selectedDistricts.length > 0) params.append('district', selectedDistricts.join(','));
      if (selectedClusters.length > 0) params.append('cluster', selectedClusters.join(','));
      if (selectedMonths.length > 0) params.append('evaluation_month', selectedMonths.join(','));
      
      // Build separate parameters for filter options (without pagination)
      const filterParams = new URLSearchParams();
      if (selectedRegions.length > 0) filterParams.append('region', selectedRegions.join(','));
      if (selectedDistricts.length > 0) filterParams.append('district', selectedDistricts.join(','));
      if (selectedClusters.length > 0) filterParams.append('cluster', selectedClusters.join(','));
      
      console.log('Fetching cluster income data with params:', params.toString());
      
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
      
      // Handle data response
      let predictions: PredictionData[] = [];
      if (dataResult.results && Array.isArray(dataResult.results)) {
        predictions = dataResult.results;
      } else if (dataResult.predictions && Array.isArray(dataResult.predictions)) {
        predictions = dataResult.predictions;
      } else if (Array.isArray(dataResult)) {
        predictions = dataResult;
      }
      
      setAllPredictions(predictions);
      
      // Process data to get cluster-month aggregations
      const clusterData = processClusterData(predictions);
      setData(clusterData);
      
      // Update filter options
      if (filterResult) {
        setRegionOptions(filterResult.regions?.map((r: string) => ({ value: r, label: r })) || []);
        setDistrictOptions(filterResult.districts?.map((d: string) => ({ value: d, label: d })) || []);
        setClusterOptions(filterResult.clusters?.map((c: string) => ({ value: c, label: c })) || []);
        setMonthOptions(filterResult.evaluation_months?.map((em: number) => ({ value: em.toString(), label: `Month ${em}` })) || []);
      }
      
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchData();
  }, []);

  // Debounced effect for filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [selectedRegions, selectedDistricts, selectedClusters, selectedMonths]);

  // Process raw data into cluster-month aggregations
  const processClusterData = (predictions: PredictionData[]): ClusterIncomeData[] => {
    const groupedData: { [key: string]: any } = {};
    
    predictions.forEach(pred => {
      const key = `${pred.cluster}-${pred.evaluation_month}-${pred.region}-${pred.district}`;
      
      if (!groupedData[key]) {
        groupedData[key] = {
          cluster: pred.cluster,
          evaluation_month: pred.evaluation_month,
          region: pred.region,
          district: pred.district,
          incomes: [],
          achievements: []
        };
      }
      
      groupedData[key].incomes.push(pred.predicted_income || 0);
      groupedData[key].achievements.push(pred.prediction);
    });
    
    return Object.values(groupedData).map((group: any) => ({
      cluster: group.cluster,
      evaluation_month: group.evaluation_month,
      region: group.region,
      district: group.district,
      avg_income: group.incomes.length > 0 ? group.incomes.reduce((sum: number, income: number) => sum + income, 0) / group.incomes.length : 0,
      household_count: group.incomes.length,
      achievement_rate: group.achievements.length > 0 ? (group.achievements.reduce((sum: number, ach: number) => sum + ach, 0) / group.achievements.length) * 100 : 0
    }));
  };

  // Handle filter changes with cascading logic
  const handleFilterChange = (
    event: SelectChangeEvent<string[]>,
    setterFunction: React.Dispatch<React.SetStateAction<string[]>>,
    filterLevel: 'region' | 'district' | 'cluster' | 'evaluation_month'
  ) => {
    const value = event.target.value;
    const newValue = typeof value === 'string' ? value.split(',') : value;
    setterFunction(newValue);

    // Reset dependent filters
    if (filterLevel === 'region') {
      setSelectedDistricts([]);
      setSelectedClusters([]);
    } else if (filterLevel === 'district') {
      setSelectedClusters([]);
    }
  };

  const handleRegionChange = (event: SelectChangeEvent<string[]>) => {
    handleFilterChange(event, setSelectedRegions, 'region');
  };

  const handleDistrictChange = (event: SelectChangeEvent<string[]>) => {
    handleFilterChange(event, setSelectedDistricts, 'district');
  };

  const handleClusterChange = (event: SelectChangeEvent<string[]>) => {
    handleFilterChange(event, setSelectedClusters, 'cluster');
  };

  const handleMonthChange = (event: SelectChangeEvent<string[]>) => {
    handleFilterChange(event, setSelectedMonths, 'evaluation_month');
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedRegions([]);
    setSelectedDistricts([]);
    setSelectedClusters([]);
    setSelectedMonths([]);
  };

  // Simple linear regression function
  const linearRegression = (x: number[], y: number[]) => {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return { slope, intercept };
  };

  // Prepare chart data with predictions
  const getLineChartData = () => {
    const clusters = [...new Set(data.map(d => d.cluster))];
    const allTraces: any[] = [];
    
    // Collect all data points for overall trend calculation
    const allDataPoints: { month: number; income: number }[] = [];
    
    clusters.forEach(cluster => {
      const clusterData = data.filter(d => d.cluster === cluster).sort((a, b) => a.evaluation_month - b.evaluation_month);
      
      if (clusterData.length === 0) return;
      
      // Add to overall data points
      clusterData.forEach(d => {
        allDataPoints.push({ month: d.evaluation_month, income: d.avg_income });
      });
      
      // Actual data trace
      const actualTrace = {
        x: clusterData.map(d => `Month ${d.evaluation_month}`),
        y: clusterData.map(d => d.avg_income),
        type: 'scatter',
        mode: 'lines+markers',
        name: cluster,
        line: { width: 3 },
        marker: { size: 8 },
        hovertemplate: '<b>%{fullData.name}</b><br>Month: %{x}<br>Avg Income: $%{y:.2f}<extra></extra>',
        showlegend: true
      };
      
      allTraces.push(actualTrace);
      
      // Generate prediction if we have at least 2 data points
      if (clusterData.length >= 2) {
        const xValues = clusterData.map(d => d.evaluation_month);
        const yValues = clusterData.map(d => d.avg_income);
        
        // Calculate linear regression
        const { slope, intercept } = linearRegression(xValues, yValues);
        
        // Predict next evaluation month (assuming pattern: 6, 9, 12, 15, etc.)
        const lastMonth = Math.max(...xValues);
        const interval = xValues.length > 1 ? Math.min(...xValues.slice(1).map((x, i) => x - xValues[i])) : 3;
        const nextMonth = lastMonth + interval;
        
        const predictedIncome = slope * nextMonth + intercept;
        
        // Only show prediction if it's reasonable (positive income)
        if (predictedIncome > 0) {
          // Create prediction trace (dotted line)
          const predictionTrace = {
            x: [`Month ${lastMonth}`, `Month ${nextMonth}`],
            y: [clusterData[clusterData.length - 1].avg_income, predictedIncome],
            type: 'scatter',
            mode: 'lines+markers',
            name: `${cluster} (Predicted)`,
            line: { 
              width: 2, 
              dash: 'dot',
              color: actualTrace.line?.color || '#999999'
            },
            marker: { 
              size: 6,
              symbol: 'diamond',
              color: actualTrace.line?.color || '#999999'
            },
            hovertemplate: '<b>%{fullData.name}</b><br>Month: %{x}<br>Predicted Income: $%{y:.2f}<br><i>Linear trend projection</i><extra></extra>',
            showlegend: false, // Don't clutter legend with predictions
            opacity: 0.7
          };
          
          allTraces.push(predictionTrace);
        }
      }
    });
    
    // Add overall trend line if we have enough data points
    if (allDataPoints.length >= 2) {
      const allMonths = allDataPoints.map(d => d.month);
      const allIncomes = allDataPoints.map(d => d.income);
      
      // Calculate overall trend
      const { slope: overallSlope, intercept: overallIntercept } = linearRegression(allMonths, allIncomes);
      
      // Create trend line points across the actual data range
      const minMonth = Math.min(...allMonths);
      const maxMonth = Math.max(...allMonths);
      
      const trendStartIncome = overallSlope * minMonth + overallIntercept;
      const trendEndIncome = overallSlope * maxMonth + overallIntercept;
      
      // Add overall trend trace
      const overallTrendTrace = {
        x: [`Month ${minMonth}`, `Month ${maxMonth}`],
        y: [trendStartIncome, trendEndIncome],
        type: 'scatter',
        mode: 'lines',
        name: 'Overall Trend',
        line: { 
          width: 4, 
          color: '#EA580C',
          dash: 'dash'
        },
        hovertemplate: '<b>Overall Trend</b><br>Month: %{x}<br>Trend Income: $%{y:.2f}<br><i>Best fit across all selected clusters</i><extra></extra>',
        showlegend: true,
        opacity: 0.8
      };
      
      // Add trend line first so it appears behind other lines
      allTraces.unshift(overallTrendTrace);
      
      // Add trend prediction for next month
      const detectedInterval = allDataPoints.length > 1 ? 3 : 3; // Default to 3 month intervals
      const nextTrendMonth = maxMonth + detectedInterval;
      const nextTrendIncome = overallSlope * nextTrendMonth + overallIntercept;
      
      if (nextTrendIncome > 0) {
        const trendPredictionTrace = {
          x: [`Month ${maxMonth}`, `Month ${nextTrendMonth}`],
          y: [overallSlope * maxMonth + overallIntercept, nextTrendIncome],
          type: 'scatter',
          mode: 'lines+markers',
          name: 'Overall Trend (Predicted)',
          line: { 
            width: 3, 
            color: '#EA580C',
            dash: 'dot'
          },
          marker: { 
            size: 8,
            symbol: 'star',
            color: '#EA580C'
          },
          hovertemplate: '<b>Overall Trend Prediction</b><br>Month: %{x}<br>Predicted Income: $%{y:.2f}<br><i>Overall trend projection</i><extra></extra>',
          showlegend: false,
          opacity: 0.8
        };
        
        allTraces.push(trendPredictionTrace);
      }
    }
    
    return allTraces;
  };



  const getScatterData = () => {
    return [{
      x: data.map(d => d.avg_income),
      y: data.map(d => d.achievement_rate),
      mode: 'markers',
      type: 'scatter',
      marker: {
        size: data.map(d => Math.sqrt(d.household_count) * 3),
        color: data.map(d => d.evaluation_month),
        colorscale: [
          [0, '#1c2434'],
          [1, '#EA580C']
        ],
        showscale: true,
        colorbar: {
          title: 'Evaluation Month'
        }
      },
      text: data.map(d => `${d.cluster} - Month ${d.evaluation_month}`),
      hovertemplate: '<b>%{text}</b><br>Avg Income: $%{x:.2f}<br>Achievement Rate: %{y:.1f}%<br>Households: %{marker.size}<extra></extra>'
    }];
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Skeleton variant="text" width="40%" height={48} sx={{ mb: 2 }} />
        
        {/* Filters Card Skeleton */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Skeleton variant="text" width="15%" height={32} />
              <Skeleton variant="rectangular" width={120} height={32} />
            </Box>
            
            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Skeleton variant="rounded" width={100} height={24} />
              <Skeleton variant="rounded" width={120} height={24} />
              <Skeleton variant="rounded" width={90} height={24} />
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} variant="rectangular" width={200} height={40} />
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Charts Grid Skeleton */}
        <Grid container spacing={4}>
          {/* Line Chart Skeleton */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="35%" height={32} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" width="100%" height={500} />
              </CardContent>
            </Card>
          </Grid>
          
          {/* Scatter Plot Skeleton */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="30%" height={32} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" width="100%" height={500} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Summary Stats Skeleton */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Skeleton variant="text" width="25%" height={32} sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {[1, 2, 3, 4].map(i => (
                <Grid item xs={6} md={3} key={i}>
                  <Skeleton variant="text" width="80%" height={20} />
                  <Skeleton variant="text" width="60%" height={40} />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Trends by Evaluation Month
      </Typography>
      
      {/* Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Filters</Typography>
            <Button onClick={clearFilters} variant="outlined" size="small">
              Clear All Filters
            </Button>
          </Box>
          
          {/* Active Filters */}
          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedRegions.map(region => (
              <Chip 
                key={region} 
                label={`Region: ${region}`} 
                onDelete={() => setSelectedRegions(prev => prev.filter(r => r !== region))}
                size="small"
              />
            ))}
            {selectedDistricts.map(district => (
              <Chip 
                key={district} 
                label={`District: ${district}`} 
                onDelete={() => setSelectedDistricts(prev => prev.filter(d => d !== district))}
                size="small"
              />
            ))}
            {selectedClusters.map(cluster => (
              <Chip 
                key={cluster} 
                label={`Cluster: ${cluster}`} 
                onDelete={() => setSelectedClusters(prev => prev.filter(c => c !== cluster))}
                size="small"
              />
            ))}
            {selectedMonths.map(month => (
              <Chip 
                key={month} 
                label={`Month: ${month}`} 
                onDelete={() => setSelectedMonths(prev => prev.filter(m => m !== month))}
                size="small"
              />
            ))}
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel>Regions</InputLabel>
              <Select
                multiple
                value={selectedRegions}
                onChange={handleRegionChange}
                input={<OutlinedInput label="Regions" />}
                renderValue={(selected) => selected.join(', ')}
              >
                {regionOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    <Checkbox checked={selectedRegions.indexOf(option.value) > -1} />
                    <ListItemText primary={option.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel>Districts</InputLabel>
              <Select
                multiple
                value={selectedDistricts}
                onChange={handleDistrictChange}
                input={<OutlinedInput label="Districts" />}
                renderValue={(selected) => selected.join(', ')}
              >
                {districtOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    <Checkbox checked={selectedDistricts.indexOf(option.value) > -1} />
                    <ListItemText primary={option.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel>Clusters</InputLabel>
              <Select
                multiple
                value={selectedClusters}
                onChange={handleClusterChange}
                input={<OutlinedInput label="Clusters" />}
                renderValue={(selected) => selected.join(', ')}
              >
                {clusterOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    <Checkbox checked={selectedClusters.indexOf(option.value) > -1} />
                    <ListItemText primary={option.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel>Evaluation Months</InputLabel>
              <Select
                multiple
                value={selectedMonths}
                onChange={handleMonthChange}
                input={<OutlinedInput label="Evaluation Months" />}
                renderValue={(selected) => selected.join(', ')}
              >
                {monthOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    <Checkbox checked={selectedMonths.indexOf(option.value) > -1} />
                    <ListItemText primary={option.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Charts */}
      <Grid container spacing={4}>
        {/* Line Chart - Income Trends */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Average Income Trends by Cluster
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Solid lines show actual data, dotted lines show predictions. Orange dashed line shows overall trend across all selected clusters.
              </Typography>
              <Plot
                data={getLineChartData()}
                layout={{
                  width: 1000,
                  height: 500,
                  title: '',
                  xaxis: { title: 'Evaluation Month' },
                  yaxis: { title: 'Average Income ($)' },
                  margin: { t: 40, b: 60, l: 80, r: 60 },
                  legend: { x: 1.02, y: 1 }
                }}
                config={{ displayModeBar: true, responsive: true }}
              />
            </CardContent>
          </Card>
        </Grid>
        
        {/* Scatter Plot */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Income vs Achievement Rate
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Bubble size = number of households
              </Typography>
              <Plot
                data={getScatterData()}
                layout={{
                  width: 1000,
                  height: 500,
                  title: '',
                  xaxis: { title: 'Average Income ($)' },
                  yaxis: { title: 'Achievement Rate (%)' },
                  margin: { t: 40, b: 60, l: 80, r: 60 }
                }}
                config={{ displayModeBar: true, responsive: true }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Summary Stats */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Summary Statistics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Typography variant="body2" color="text.secondary">Total Clusters</Typography>
              <Typography variant="h5" color="#EA580C">
                {[...new Set(data.map(d => d.cluster))].length}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="body2" color="text.secondary">Evaluation Months</Typography>
              <Typography variant="h5" color="#EA580C">
                {[...new Set(data.map(d => d.evaluation_month))].length}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="body2" color="text.secondary">Avg Income (Overall)</Typography>
              <Typography variant="h5" color="#EA580C">
                ${data.length > 0 ? (data.reduce((sum, d) => sum + d.avg_income, 0) / data.length).toFixed(2) : '0.00'}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="body2" color="text.secondary">Total Households</Typography>
              <Typography variant="h5" color="#EA580C">
                {data.reduce((sum, d) => sum + d.household_count, 0).toLocaleString()}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ClusterIncomeAnalysisPage; 