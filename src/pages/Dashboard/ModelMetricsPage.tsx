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
import ClassificationModelStatsTable from "../../components/Charts/ClassificationModelMetrics";
import RegressionModelStatsTable from "../../components/Tables/RegressionModelMetrics";

const ModelMetrics: React.FC = () => {
  const [classificationModelMetrics, setClassificationModelMetrics] =
    useState<ClassificationMetricsProps | null>(null);
  const [regressionModelMetrics, setRegressionModelMetrics] =
    useState<RegressionMetricsProps | null>(null);
  const [model, setModel] = useState<{ name: string; type: string }>({
    name: "Year 1 Classification",
    type: "classification",
  });

  const modelOptions = [
    { id: 1, name: "Year 1 Classification", type: "classification" },
    { id: 2, name: "Year 2 Classification", type: "classification" },
    { id: 3, name: "Year 1 Regression", type: "regression" },
    // { id: 4, name: "Year 2 Regression", type: "regression" },
  ];

  const getModelMetrics = async (name: string, type: string) => {
    if (type === "classification") {
      const metrics = await fetchClassificationModelMetrics(name);
      setClassificationModelMetrics(metrics);
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
      <div className="">
        <select
          value={model.name}
          name="modelSelect"
          id="modelSelect"
          className="p-2 bg-transparent outline-none"
          onChange={(e) => {
            const selectedId = Number(e.target.value);
            const selectedModel = modelOptions.find((m) => m.id === selectedId);
            if (selectedModel) {
              setModel({ name: selectedModel.name, type: selectedModel.type });
              localStorage.setItem("model_id", selectedModel.name);
              getModelMetrics(selectedModel.name, selectedModel.type);
            }
          }}
        >
          <option value="">Select Model</option>
          {modelOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        {model.type === "classification" ? (
          <ClassificationModelStatsTable
            model_metrics={classificationModelMetrics}
          />
        ) : (
          <RegressionModelStatsTable model_metrics={regressionModelMetrics} />
        )}
      </div>
      {model.type === "classification" ? (
        <div className="flex flex-col md:flex-row md:space-x-3 mt-6">
          <div className="md:w-1/2">
            <ConfusionMatrix model_metrics={classificationModelMetrics} />
          </div>
          <div className="md:w-1/2">
            <ROCCurve />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ModelMetrics;
