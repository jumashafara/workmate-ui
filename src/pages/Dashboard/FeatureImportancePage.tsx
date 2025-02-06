import React from "react";
import FeatureImportanceChart from "../../components/Charts/FeatureImportanceChart";
import VariableDescriptions from "../../components/Tables/FeatureDescriptions";

const FeatureImportance: React.FC = () => {
  return (
    <>
      <div>
        <FeatureImportanceChart featureNames={[]} importances={[]} />
      </div>
      <div className="mt-6">
        <VariableDescriptions variables={[]} />
      </div>
    </>
  );
};

export default FeatureImportance;
