import React, { useState } from "react";
// import SelectHousehold from "../../components/Prediction/SelectHousehold";
import PredictionDisplay from "../../components/Prediction/PredictionDisplay";
import FeatureInput from "../../components/Prediction/FeatureInput";
import getPrediction from "../../api/Predictions";
import { Features } from "../../types/features";
import FeatureContributionsChart from "../../components/Charts/ContributionsPlot";

const IndividualPredictionPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  // const [cutoffValue, setCutoffValue] = useState<number>(0.5);
  const [landValue, setLandValue] = useState<number>(1);
  const [memberValue, setMemberValue] = useState<number>(5);
  const [waterValue, setWaterValue] = useState<number>(1);
  const [farmImplementsValue, setFarmImplementsValue] = useState<number>(1);
  const [prediction, setPrediction] = useState<number>(0.5);
  const [probabilities, setProbabilities] = useState<Array<number>>([0.5, 0.5]);
  const [predictedIncomeProduction, setPredictedIncomeProduction] =
    useState<number>(0);
  const [contributions, setContributions] = useState({});
  // pre-data
  // const [selectedHousehold, setSelectedHousehold] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [village, setVillage] = useState<string>("");
  const [cluster, setCluster] = useState<string>("");
  const [evaluationMonth, setEvaluationMonth] = useState<number>(1);

  // Add new state variables
  const [distanceToOPD, setDistanceToOPD] = useState<number>(1);
  const [waterCollectionTime, setWaterCollectionTime] = useState<number>(30);
  const [compostsNum, setCompostsNum] = useState<number>(0);
  const [educationLevel, setEducationLevel] = useState<number>(0);
  const [tippyTapPresent, setTippyTapPresent] = useState<number>(0);
  const [nonBioWasteManagement, setNonBioWasteManagement] = useState<number>(0);
  const [organicsProduction, setOrganicsProduction] = useState<number>(0);

  // const handleHouseholdChange = async (
  //   event: React.ChangeEvent<HTMLSelectElement>
  // ) => {
  //   setSelectedHousehold(event.target.value);
  //   console.log("passenger selected");
  // };

  const [formData, setFormData] = useState<Features>({
    household_id: "",
    district: "",
    village: "",
    cluster: "",
    evaluation_month: 0,
    cassava: [false], //done
    maize: [false], //
    ground_nuts: [false], //done
    irish_potatoes: [false], //
    sweet_potatoes: [false], //done
    perennial_crops_grown_food_banana: [false], //done
    vsla_participation: [true],
    business_participation: [false],
    tot_hhmembers: [1], // done
    Land_size_for_Crop_Agriculture_Acres: [0.1], //done
    hh_water_collection_Minutes: [1],
    farm_implements_owned: [1],
    Average_Water_Consumed_Per_Day: [0],
    Distance_travelled_one_way_OPD_treatment: [0],
    composts_num: [0],
    perennial_crops_grown_coffee: [false],
    sorghum: [false],
    hh_produce_lq_manure: [false],
    hh_produce_organics: [false],
    non_bio_waste_mgt_present: [false],
    soap_ash_present: [false],
    education_level_encoded: [0],
    tippy_tap_present: [false],
    hhh_sex: [false],
  });

  const handleGetPrediction = async (data: Features) => {
    setLoading(true);
    try {
      const response = await getPrediction(data);
      const prediction = response.prediction;
      const probability = response.probability;
      setPrediction(prediction);
      setContributions(response.contributions);

      setPredictedIncomeProduction(response.predicted_income_production); // Set as a number

      setProbabilities([probability, 1 - probability]);
    } catch (error) {
      console.error("Prediction failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="flex flex-col space-y-6">
        {/* <div className="w-full h-full md:w-1/2">
          <SelectHousehold
            cutoffValue={cutoffValue}
            onCutoffChange={setCutoffValue}
          />
        </div> */}
        <div className="">
          <FeatureInput
            formData={formData}
            setFormData={(newData) => {
              setFormData(newData);
              if (
                newData.district === formData.district &&
                newData.village === formData.village &&
                newData.cluster === formData.cluster &&
                newData.evaluation_month === formData.evaluation_month
              ) {
                handleGetPrediction(newData);
              }
            }}
            loading={loading}
            values={{
              land: landValue,
              member: memberValue,
              water: waterValue,
              farmImplements: farmImplementsValue,
              district,
              village,
              cluster,
              evaluationMonth,
              distanceToOPD,
              waterCollectionTime,
              compostsNum,
              educationLevel,
              tippyTapPresent,
              nonBioWasteManagement,
              organicsProduction,
            }}
            setValues={{
              setLand: setLandValue,
              setMember: setMemberValue,
              setWater: setWaterValue,
              setFarmImplements: setFarmImplementsValue,
              setDistrict,
              setVillage,
              setCluster,
              setEvaluationMonth,
              setDistanceToOPD,
              setWaterCollectionTime,
              setCompostsNum,
              setEducationLevel,
              setTippyTapPresent,
              setNonBioWasteManagement,
              setOrganicsProduction,
            }}
          />
        </div>
        <div>
          <PredictionDisplay
            probabilities={probabilities}
            prediction={prediction}
            predicted_income_production={predictedIncomeProduction}
          />
        </div>
        <div>
          <FeatureContributionsChart contributions={contributions} />
        </div>
      </div>
    </div>
  );
};

export default IndividualPredictionPage;
