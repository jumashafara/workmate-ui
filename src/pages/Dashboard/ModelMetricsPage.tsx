import React, { useEffect, useState } from "react";
import ConfusionMatrix from "../../components/Charts/ConfusionMatrix";
import ROCCurve from "../../components/Charts/ROCAUC";
import {
  fetchClassificationModelMetrics,
  fetchRegressionModelMetrics,
} from "../../api/ModelMetrics";
import {
  ClassificationMetricsProps,
  RegressionMetricsProps,
} from "../../types/modelmetrics";
import ClassificationModelStatsTable from "../../components/Tables/ClassificationModelMetrics";
import RegressionModelStatsTable from "../../components/Tables/RegressionModelMetrics";

const ModelMetrics: React.FC = () => {
  const [classificationModelMetrics, setClassificationModelMetrics] =
    useState<ClassificationMetricsProps | null>(null);
  const [confusionMatrixData, setConfusionMetrixData] = useState<any>(null);
  const [regressionModelMetrics, setRegressionModelMetrics] =
    useState<RegressionMetricsProps | null>(null);
  const [model, setModel] = useState<{ name: string; type: string }>({
    name: "year1_classification",
    type: "classification",
  });

  const modelOptions = [
    { id: 1, name: "Year 1 Classification", value: "year1_classification", type: "classification" },
    { id: 2, name: "Year 2 Classification", value: "year2_classification", type: "classification" },
    // { id: 3, name: "Year 1 Regression", value: "year1_regression", type: "regression" },
    // { id: 4, name: "Year 2 Regression", value: "year2_regression", type: "regression" },
  ];

  const getModelMetrics = async (name: string, type: string) => {
    if (type === "classification") {
      const data = await fetchClassificationModelMetrics(name);
      setClassificationModelMetrics(data);
      setConfusionMetrixData(data.confusion_matrix);
    } else {
      const metrics = await fetchRegressionModelMetrics(name);
      setRegressionModelMetrics(metrics);
    }
  };

  useEffect(() => {
    getModelMetrics(model.name, model.type);
  }, [model.name]);
  return (
    <>
      <div className="flex justify-between p-3 mb-0 bg-gray-200 border border-gray-300 dark:bg-gray-700">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Model Metrics
          </h2>
          <p className="text-gray-800">How is our model performing? </p>
        </div>
        <select
          value={model.name}
          name="modelSelect"
          id="modelSelect"
          className="p-3 outline-none border border-gray-300 bg-gray-100 dark:border-gray-800 dark:bg-gray-800 rounded-sm"
          onChange={(e) => {
            const selectedId = Number(e.target.value);
            const selectedModel = modelOptions.find((m) => m.id === selectedId);
            if (selectedModel) {
              setModel({ name: selectedModel.value, type: selectedModel.type });
              getModelMetrics(selectedModel.value, selectedModel.type);
            }
          }}
        >
          <option value="">Select Model</option>
          {modelOptions.map((option) => (
            <option
              key={option.id}
              value={option.id}
              className="dark:bg-gray-800"
            >
              {option.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        {model.type === "classification" ? (
          <ClassificationModelStatsTable
            model_metrics={classificationModelMetrics?.model}
          />
        ) : (
          <RegressionModelStatsTable model_metrics={regressionModelMetrics} />
        )}
      </div>
      {model.type === "classification" ? (
        <div className="flex flex-col md:flex-row md:space-x-3 mt-6">
          <div className="md:w-1/2">
            <ConfusionMatrix confusion_matrix_data={confusionMatrixData} />
          </div>
          <div className="md:w-1/2">
            <ROCCurve aucScore={classificationModelMetrics?.model?.achieved_roc_auc} />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ModelMetrics;
