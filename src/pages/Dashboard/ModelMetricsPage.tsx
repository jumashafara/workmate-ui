import React, { useEffect, useState } from "react";
import ModelStatsChart from "../../components/Charts/ModelMetrics";
import ConfusionMatrix from "../../components/Charts/ConfusionMatrix";
import ROCCurve from "../../components/Charts/ROCAUC";
import { fetchModelMetrics } from "../../api/ModelMetrics";
import { MetricsProps } from "../../types/modelmetrics";

const ModelMetrics: React.FC = () => {
  const [model_metrics, setModelMetrics] = useState<MetricsProps | null>(null);
  const [model_id, setModelId] = useState<number>(1);

  const getModelMetrics = async (id: number) => {
    const metrics = await fetchModelMetrics(id);
    setModelMetrics(metrics);
  };

  useEffect(() => {
    getModelMetrics(model_id);
  }, [model_id]);
  return (
    <>
      <div className="">
        <select
          value={model_id}
          name=""
          id=""
          className="p-2 bg-transparent outline-none"
          onChange={(e) => {
            console.log("hello");
            const selectedId = Number(e.target.value);
            setModelId(selectedId);
            localStorage.setItem("model_id", selectedId.toString());
            getModelMetrics(selectedId);
          }}
        >
          <option className="disabled" value="">
            Select Model
          </option>
          <option value="1">Year 1 Classification</option>
        </select>
      </div>
      <div>
        <ModelStatsChart model_metrics={model_metrics} />
      </div>
      <div className="flex flex-col md:flex-row md:space-x-3 mt-6">
        <div className="md:w-1/2">
          <ConfusionMatrix model_metrics={model_metrics} />
        </div>
        <div className="md:w-1/2">
          <ROCCurve />
        </div>
      </div>
    </>
  );
};

export default ModelMetrics;
