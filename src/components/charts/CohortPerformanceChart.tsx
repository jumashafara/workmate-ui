import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface CohortPerformanceChartProps {
  data: PredictionData[];
  height?: number;
}

interface CohortStats {
  cohort: string;
  achievement_rate: number;
  avg_income: number;
  total_households: number;
  avg_probability: number;
}

const CohortPerformanceChart: React.FC<CohortPerformanceChartProps> = ({ 
  data, 
  height = 400 
}) => {
  // Process data to aggregate by cohort
  const cohortStats = useMemo(() => {
    if (!data || data.length === 0) return [];

    const grouped = data.reduce((acc, item) => {
      const cohort = item.cohort || 'Unknown';
      
      if (!acc[cohort]) {
        acc[cohort] = {
          total: 0,
          achieved: 0,
          income_sum: 0,
          probability_sum: 0
        };
      }
      
      acc[cohort].total++;
      acc[cohort].achieved += item.prediction;
      acc[cohort].income_sum += item.predicted_income || 0;
      acc[cohort].probability_sum += item.probability || 0;
      
      return acc;
    }, {} as Record<string, any>);

    return Object.entries(grouped)
      .map(([cohort, stats]) => ({
        cohort,
        achievement_rate: (stats.achieved / stats.total) * 100,
        avg_income: stats.income_sum / stats.total,
        total_households: stats.total,
        avg_probability: stats.probability_sum / stats.total
      }))
      .sort((a, b) => b.achievement_rate - a.achievement_rate);
  }, [data]);

  // Prepare data for Plotly
  const plotData = [
    {
      x: cohortStats.map(stat => stat.cohort),
      y: cohortStats.map(stat => stat.achievement_rate),
      type: 'bar' as const,
      name: 'Achievement Rate (%)',
      marker: {
        color: cohortStats.map(stat => 
          stat.achievement_rate >= 70 ? '#4CAF50' : 
          stat.achievement_rate >= 50 ? '#EA580C' : '#1c2434'
        ),
        opacity: 0.8,
        line: {
          color: '#2E7D32',
          width: 1
        }
      },
      text: cohortStats.map(stat => 
        `${stat.achievement_rate.toFixed(1)}%<br>` +
        `Households: ${stat.total_households}<br>` +
        `Avg Income + Production: $${stat.avg_income.toFixed(0)}`
      ),
      textposition: 'outside' as const,
      hovertemplate: 
        '<b>%{x}</b><br>' +
        'Achievement Rate: %{y:.1f}%<br>' +
        'Total Households: %{customdata[0]}<br>' +
        'Average Income + Production: $%{customdata[1]:.0f}<br>' +
        'Average Probability: %{customdata[2]:.3f}' +
        '<extra></extra>',
      customdata: cohortStats.map(stat => [
        stat.total_households,
        stat.avg_income,
        stat.avg_probability
      ])
    }
  ];



  const layout = {
    title: {
      text: 'Cohort Performance Comparison',
      font: { size: 16, family: 'Arial, sans-serif', color: '#1c2434' }
    },
    xaxis: {
      title: { text: 'Cohort', font: { color: '#1c2434' } },
      tickangle: -45,
      automargin: true,
      tickfont: { color: '#1c2434' }
    },
    yaxis: {
      title: { text: 'Achievement Rate (%)', font: { color: '#1c2434' } },
      range: [0, Math.max(100, Math.max(...cohortStats.map(s => s.achievement_rate)) + 10)],
      tickfont: { color: '#1c2434' }
    },
    showlegend: true,
    legend: {
      x: 1,
      y: 1,
      bgcolor: 'rgba(255,255,255,0.8)'
    },
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
      filename: 'cohort-performance',
      height: 500,
      width: 800,
      scale: 1
    }
  };

  if (!data || data.length === 0) {
    return (
      <Card style={{ height: height }}>
        <CardContent className="flex justify-center items-center h-full">
          <p className="text-muted-foreground">
            No data available for cohort performance analysis
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Cohort Performance Analysis</CardTitle>
        <p className="text-sm text-muted-foreground">
          Compare achievement rates across different cohorts. Green indicates high performance (≥70%), 
          orange indicates moderate performance (50-69%), and gray indicates low performance (&lt;50%).
        </p>
      </CardHeader>
      <CardContent>
        <div className="w-full" style={{ height: height }}>
          <Plot
            data={plotData}
            layout={layout}
            config={config}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
          />
        </div>
        
        {/* Summary Statistics */}
        <div className="mt-4 flex justify-around flex-wrap gap-4">
          <div className="text-center min-w-[120px]">
            <div className="text-2xl font-semibold text-green-600">
              {cohortStats.filter(s => s.achievement_rate >= 70).length}
            </div>
            <div className="text-xs text-muted-foreground">High Performers</div>
          </div>
          
          <div className="text-center min-w-[120px]">
            <div className="text-2xl font-semibold text-orange-600">
              {cohortStats.filter(s => s.achievement_rate >= 50 && s.achievement_rate < 70).length}
            </div>
            <div className="text-xs text-muted-foreground">Moderate Performers</div>
          </div>
          
          <div className="text-center min-w-[120px]">
            <div className="text-2xl font-semibold text-red-600">
              {cohortStats.filter(s => s.achievement_rate < 50).length}
            </div>
            <div className="text-xs text-muted-foreground">Need Attention</div>
          </div>
          
          <div className="text-center min-w-[120px]">
            <div className="text-2xl font-semibold text-blue-600">
              {(cohortStats.reduce((sum, s) => sum + s.achievement_rate, 0) / cohortStats.length).toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Average Achievement</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CohortPerformanceChart; 