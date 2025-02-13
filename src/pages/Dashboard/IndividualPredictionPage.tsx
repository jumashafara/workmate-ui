import React, { useState } from "react";
// import SelectHousehold from "../../components/Prediction/SelectHousehold";
import PredictionDisplay from "../../components/Prediction/PredictionDisplay";
import FeatureInput from "../../components/Prediction/FeatureInput";
import getPrediction from "../../api/Predictions";
import { Features } from "../../types/features";

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
    cassava: [true], //done
    maize: [true], //
    ground_nuts: [true], //done
    irish_potatoes: [true], //
    sweet_potatoes: [true], //done
    perennial_crops_grown_food_banana: [true], //done
    tot_hhmembers: [0], // done
    business_participation: [true],
    Land_size_for_Crop_Agriculture_Acres: [0], //done
    farm_implements_owned: [0],
    vsla_participation: [true],
    Average_Water_Consumed_Per_Day: [0],
    Distance_travelled_one_way_OPD_treatment: [0],
    hh_water_collection_Minutes: [0],
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
      const prediction = response.data.prediction;
      const probabiliy = response.data.probability;
      setPrediction(prediction);
      setPredictedIncomeProduction(response.data.predicted_income_production);
      setProbabilities([probabiliy, 1 - probabiliy]);
    } catch (error) {
      console.error("Prediction failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="flex flex-col space-y-6 md:flex-row md:space-y-0 md:justify-between md:space-x-6 md:items-stretch">
        {/* <div className="w-full h-full md:w-1/2">
          <SelectHousehold
            cutoffValue={cutoffValue}
            onCutoffChange={setCutoffValue}
          />
        </div> */}
        <div className="w-full">
          <PredictionDisplay
            probabilities={probabilities}
            prediction={prediction}
            predicted_income_production={predictedIncomeProduction}
          />
        </div>
      </div>
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
        }}
      />
    </div>
  );
};

export default IndividualPredictionPage;
