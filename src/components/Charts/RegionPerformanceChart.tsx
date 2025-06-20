import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { Card, CardContent, Typography, Box } from '@mui/material';

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

interface RegionPerformanceChartProps {
  data: PredictionData[];
  height?: number;
}

interface RegionStats {
  region: string;
  achievement_rate: number;
  avg_income: number;
  total_households: number;
  avg_probability: number;
  achieved_count: number;
}

const RegionPerformanceChart: React.FC<RegionPerformanceChartProps> = ({ 
  data, 
  height = 400 
}) => {
  // Process data to aggregate by region
  const regionStats = useMemo(() => {
    if (!data || data.length === 0) return [];

    const grouped = data.reduce((acc, item) => {
      const region = item.region || 'Unknown';
      
      if (!acc[region]) {
        acc[region] = {
          total: 0,
          achieved: 0,
          income_sum: 0,
          probability_sum: 0
        };
      }
      
      acc[region].total++;
      acc[region].achieved += item.prediction;
      acc[region].income_sum += item.predicted_income || 0;
      acc[region].probability_sum += item.probability || 0;
      
      return acc;
    }, {} as Record<string, any>);

    return Object.entries(grouped)
      .map(([region, stats]) => ({
        region,
        achievement_rate: (stats.achieved / stats.total) * 100,
        avg_income: stats.income_sum / stats.total,
        total_households: stats.total,
        avg_probability: stats.probability_sum / stats.total,
        achieved_count: stats.achieved
      }))
      .sort((a, b) => b.achievement_rate - a.achievement_rate);
  }, [data]);

  // Prepare data for Plotly
  const plotData = [
    {
      x: regionStats.map(stat => stat.region),
      y: regionStats.map(stat => stat.achievement_rate),
      type: 'bar' as const,
      name: 'Achievement Rate (%)',
      marker: {
        color: regionStats.map(stat => 
          stat.achievement_rate >= 70 ? '#4CAF50' : 
          stat.achievement_rate >= 50 ? '#EA580C' : '#1c2434'
        ),
        opacity: 0.8,
        line: {
          color: '#2E7D32',
          width: 1
        }
      },
      text: regionStats.map(stat => 
        `${stat.achievement_rate.toFixed(1)}%<br>` +
        `${stat.achieved_count}/${stat.total_households} households`
      ),
      textposition: 'outside' as const,
      hovertemplate: 
        '<b>%{x}</b><br>' +
        'Achievement Rate: %{y:.1f}%<br>' +
        'Achieved: %{customdata[0]} households<br>' +
        'Total Households: %{customdata[1]}<br>' +
        'Average Income: $%{customdata[2]:.0f}<br>' +
        'Average Probability: %{customdata[3]:.3f}' +
        '<extra></extra>',
      customdata: regionStats.map(stat => [
        stat.achieved_count,
        stat.total_households,
        stat.avg_income,
        stat.avg_probability
      ])
    }
  ];

  const layout = {
    title: {
      text: 'Regional Performance Analysis',
      font: { size: 16, family: 'Arial, sans-serif', color: '#1c2434' }
    },
    xaxis: {
      title: { text: 'Region', font: { color: '#1c2434' } },
      tickangle: -45,
      automargin: true,
      tickfont: { color: '#1c2434' }
    },
    yaxis: {
      title: { text: 'Achievement Rate (%)', font: { color: '#1c2434' } },
      range: [0, Math.max(100, Math.max(...regionStats.map(s => s.achievement_rate)) + 10)],
      tickfont: { color: '#1c2434' }
    },
    showlegend: false,
    margin: {
      l: 60,
      r: 60,
      t: 80,
      b: 100
    },
    hovermode: 'closest' as const,
    plot_bgcolor: '#fafafa',
    paper_bgcolor: 'white'
  };

  const config = {
    displayModeBar: true,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'] as any,
    displaylogo: false,
    toImageButtonOptions: {
      format: 'png' as const,
      filename: 'region-performance',
      height: 500,
      width: 800,
      scale: 1
    }
  };

  if (!data || data.length === 0) {
    return (
      <Card sx={{ height: height }}>
        <CardContent sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%' 
        }}>
          <Typography variant="body1" color="text.secondary">
            No data available for regional performance analysis
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Calculate summary statistics
  const overallAchievementRate = (regionStats.reduce((sum, s) => sum + s.achievement_rate, 0) / regionStats.length) || 0;
  const totalHouseholds = regionStats.reduce((sum, s) => sum + s.total_households, 0);
  const totalAchieved = regionStats.reduce((sum, s) => sum + s.achieved_count, 0);
  const bestPerformingRegion = regionStats[0];
  const worstPerformingRegion = regionStats[regionStats.length - 1];

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Regional Performance Analysis
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Compare achievement rates across different regions. Green indicates high performance (≥70%), 
            orange indicates moderate performance (50-69%), and gray indicates low performance (&lt;50%).
          </Typography>
        </Box>
        
        <Box sx={{ width: '100%', height: height }}>
          <Plot
            data={plotData}
            layout={layout}
            config={config}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
          />
        </Box>
        
        {/* Summary Statistics */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Regional Insights
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', mb: 2 }}>
            <Box sx={{ textAlign: 'center', minWidth: 120 }}>
              <Typography variant="h6" color="success.main">
                {regionStats.filter(s => s.achievement_rate >= 70).length}
              </Typography>
              <Typography variant="caption">High Performing Regions</Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center', minWidth: 120 }}>
              <Typography variant="h6" color="warning.main">
                {regionStats.filter(s => s.achievement_rate >= 50 && s.achievement_rate < 70).length}
              </Typography>
              <Typography variant="caption">Moderate Performing</Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center', minWidth: 120 }}>
              <Typography variant="h6" color="error.main">
                {regionStats.filter(s => s.achievement_rate < 50).length}
              </Typography>
              <Typography variant="caption">Need Attention</Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center', minWidth: 120 }}>
              <Typography variant="h6" color="primary.main">
                {overallAchievementRate.toFixed(1)}%
              </Typography>
              <Typography variant="caption">Overall Achievement</Typography>
            </Box>
          </Box>
          
          {/* Best and Worst Performing Regions */}
          {regionStats.length > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ 
                flex: 1, 
                minWidth: 250,
                p: 2, 
                bgcolor: 'success.light', 
                borderRadius: 1,
                color: 'success.contrastText'
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  🏆 Best Performing Region
                </Typography>
                <Typography variant="body2">
                  <strong>{bestPerformingRegion?.region}</strong> - {bestPerformingRegion?.achievement_rate.toFixed(1)}%
                </Typography>
                <Typography variant="caption">
                  {bestPerformingRegion?.achieved_count} of {bestPerformingRegion?.total_households} households achieved target
                </Typography>
              </Box>
              
              <Box sx={{ 
                flex: 1, 
                minWidth: 250,
                p: 2, 
                bgcolor: 'error.light', 
                borderRadius: 1,
                color: 'error.contrastText'
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  ⚠️ Needs Most Attention
                </Typography>
                <Typography variant="body2">
                  <strong>{worstPerformingRegion?.region}</strong> - {worstPerformingRegion?.achievement_rate.toFixed(1)}%
                </Typography>
                <Typography variant="caption">
                  {worstPerformingRegion?.achieved_count} of {worstPerformingRegion?.total_households} households achieved target
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default RegionPerformanceChart; 