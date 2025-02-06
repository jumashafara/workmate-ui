import { MetricsProps } from "../types/modelmetrics";

export const fetchModelMetrics = async (id: number) => {
  const response = await fetch(`http://127.0.0.1:8000/api/models/1`);
  const data = await response.json();
  const metrics: MetricsProps = data.model;
  console.log(metrics);
  return metrics;
};
