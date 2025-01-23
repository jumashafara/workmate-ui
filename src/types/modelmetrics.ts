export interface MetricsProps {
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
  true_positive: number;
  false_positive: number;
  true_negative: number;
  false_negative: number;
  version: number;
  created_at: string;
  updated_at: string;
}
