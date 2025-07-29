import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

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
        'Average Income + Production: $%{customdata[2]:.0f}<br>' +
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
      font: { size: 16, family: 'Arial, sans-serif', color: '#1c2434' },
      x: 0.5,
      xanchor: 'center'
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
    autosize: true,
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
    responsive: true,
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
      <Card className="mb-3" style={{ height: height }}>
        <CardContent className="flex justify-center items-center h-full">
          <p className="text-muted-foreground">
            No data available for regional performance analysis
          </p>
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
    <Card className="mb-3">
      <CardHeader>
        <CardTitle>Regional Performance Analysis</CardTitle>
        <CardDescription>
          Compare achievement rates across different regions
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="w-full mb-4 flex items-center justify-center" style={{ height: height }}>
          <div className="w-full h-full">
            <Plot
              data={plotData}
              layout={layout}
              config={config}
              style={{ width: '100%', height: '100%' }}
              useResizeHandler={true}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegionPerformanceChart; 