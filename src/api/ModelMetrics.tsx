import {
  ClassificationMetricsProps,
  RegressionMetricsProps,
} from "../types/modelmetrics";

const fetchClassificationModelMetrics = async (name: string) => {
  const response = await fetch(`/api/models/classification/${name}`);
  const data = await response.json();
  const metrics: ClassificationMetricsProps = data.model;
  console.log(metrics);
  return metrics;
};

const fetchRegressionModelMetrics = async (name: string) => {
  const response = await fetch(`/api/models/regression/${name}`);
  const data = await response.json();
  const metrics: RegressionMetricsProps = data.model;
  console.log(metrics);
  return metrics;
};

export { fetchClassificationModelMetrics, fetchRegressionModelMetrics };
