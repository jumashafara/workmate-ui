import {
  ClassificationMetricsProps,
  RegressionMetricsProps,
} from "../types/modelmetrics";
import { API_ENDPOINT } from "./endpoints";

const fetchClassificationModelMetrics = async (name: string) => {
  const response = await fetch(`${API_ENDPOINT}/api/models/classification/${name}`);
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
  const response = await fetch(`${API_ENDPOINT}/models/regression/${name}`);
  const data = await response.json();
  const metrics: RegressionMetricsProps = data.model;
  console.log(metrics);
  return metrics;
};

const fetch2DPartialDependence = async (model: string, feature1: string, feature2: string) => {
  try {
    const response = await fetch(
      `${API_ENDPOINT}/get-2d-pdp/?model=${model}&feature1=${feature1}&feature2=${feature2}`
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching 2D PDP data:", error);
    throw error;
  }
};

export { fetchClassificationModelMetrics, fetchRegressionModelMetrics, fetch2DPartialDependence };
