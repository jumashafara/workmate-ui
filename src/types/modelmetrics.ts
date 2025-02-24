export interface ClassificationMetricsProps {
  model: {
    id: number;
    name: string;
    description: string;
    file_path: string;
    accuracy: number;
    achieved_precision: number;
    achieved_f1_score: number;
    achieved_recall: number;
    achieved_roc_auc: number;
    not_achived_precision: number;
    not_achived_f1_score: number;
    not_achived_recall: number;
    not_achived_roc_auc: number;
    version: number;
    created_at: string;
    updated_at: string;
    true_positive: number;
    false_positive: number;
    true_negative: number;
    false_negative: number;
  };
  confusion_matrix: {
    true_positives: number;
    false_positives: number;
    true_negatives: number;
    false_negatives: number;
  };
}

export interface RegressionMetricsProps {
  id: number;
  name: string;
  description: string;
  file_path: string;
  r_squared: number;
  adjusted_r_squared: number;
  mean_squared_error: number;
  correlation: number;
  accuracy: number;
  version: number;
  created_at: string;
  updated_at: string;

  // R²	Adjusted R²	MSE	Correlation
}
