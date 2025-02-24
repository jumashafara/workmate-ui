import FeatureImportanceChart from "../../components/Charts/FeatureImportanceChart";
import VariableDescriptions from "../../components/Tables/FeatureDescriptions";
import PartialDependencePlot from "../../components/Charts/PartialDependencePlot";

const FeatureImportance: React.FC = () => {

  return (
    <div  className="flex flex-col space-y-6">
      <div className="">
        <VariableDescriptions variables={[]} />
      </div>
      <div>
        <FeatureImportanceChart featureNames={[]} importances={[]} />
      </div>
      <div className="">
        <PartialDependencePlot />
      </div>
    </div>
  );
};

export default FeatureImportance;
