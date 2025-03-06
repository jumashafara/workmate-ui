import {
  ClassificationMetricsProps,
  RegressionMetricsProps,
} from "../types/modelmetrics";

const fetchClassificationModelMetrics = async (name: string) => {
  const response = await fetch(`https://workmate.api.dataidea.org/api/models/classification/${name}`);
  const data = await response.json();
  const model = data.model;
  const confusion_matrix = data.confusion_matrix;
  console.log(model);
  console.log(confusion_matrix);
  const metrics: ClassificationMetricsProps = {
    model,
    confusion_matrix,
  };
  return metrics;
};

const fetchRegressionModelMetrics = async (name: string) => {
  const response = await fetch(`https://workmate.api.dataidea.org/api/models/regression/${name}`);
  const data = await response.json();
  const metrics: RegressionMetricsProps = data.model;
  console.log(metrics);
  return metrics;
};

export { fetchClassificationModelMetrics, fetchRegressionModelMetrics };
