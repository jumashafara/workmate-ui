import { MetricsProps } from "../types/modelmetrics";

export const fetchModelMetrics = async (id: number) => {
  const response = await fetch(`/api/models/${id}`);
  const data = await response.json();
  const metrics: MetricsProps = data.model;
  console.log(metrics);
  return metrics;
};
