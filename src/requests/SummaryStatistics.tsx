export interface PredictionDistribution {
  [key: string]: number;
}

export interface TotalPredictions {
  [key: string]: number;
}

export interface NumericSummaryStatistics {
  [key: string]: {
    count: number;
    mean: number;
    std: number;
    min: number;
    '25%': number;
    '50%': number;
    '75%': number;
    max: number;
  };
}

export interface SummaryStatistics {
  prediction_distribution: PredictionDistribution;
  total_predictions: TotalPredictions;
  numeric_summary_statistics: NumericSummaryStatistics;
}

export const fetchSummaryStatistics = async (): Promise<SummaryStatistics> => {
  const response = await fetch(
    'http://localhost:8000/predictor/summary-statistics',
  );
  if (!response.ok) {
    throw new Error('Failed to fetch predictions');
  }
  const data: SummaryStatistics = await response.json();

  return data;
};
