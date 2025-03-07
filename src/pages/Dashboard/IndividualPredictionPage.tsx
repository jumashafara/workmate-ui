import React, { useState } from "react";
// import SelectHousehold from "../../components/Prediction/SelectHousehold";
import PredictionDisplay from "../../components/Prediction/PredictionDisplay";
import FeatureInput from "../../components/Prediction/FeatureInput";
import getPrediction from "../../api/Predictions";
import { Features } from "../../types/features";
import FeatureContributionsChart from "../../components/Charts/ContributionsPlot";
import { Button, Box, Typography, CircularProgress } from "@mui/material";

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
  
  // Add new state variables for the missing fields
  const [cohort, setCohort] = useState<string>("2024");
  const [cycle, setCycle] = useState<string>("A");
  const [region, setRegion] = useState<string>("Central");
  const [standardEvaluation, setStandardEvaluation] = useState<boolean>(true);
  const [checkinEvaluation, setCheckinEvaluation] = useState<boolean>(false);

  // Add new state variables
  const [distanceToOPD, setDistanceToOPD] = useState<number>(1);
  const [waterCollectionTime, setWaterCollectionTime] = useState<number>(30);
  const [compostsNum, setCompostsNum] = useState<number>(0);
  const [educationLevel, setEducationLevel] = useState<number>(0);
  const [tippyTapPresent, setTippyTapPresent] = useState<number>(0);
  const [nonBioWasteManagement, setNonBioWasteManagement] = useState<number>(0);
  const [organicsProduction, setOrganicsProduction] = useState<number>(0);
  
  // Add state to track if a prediction has been made
  const [predictionMade, setPredictionMade] = useState<boolean>(false);

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
    evaluation_month: 1,
    
    // Add missing fields
    cohort: "2024",
    cycle: "A",
    region: "Central",
    standard_evaluation: [true],
    checkin_evaluation: [false],
    
    // Numeric fields with proper defaults
    Land_size_for_Crop_Agriculture_Acres: [1.0],
    farm_implements_owned: [1],
    tot_hhmembers: [5],
    Distance_travelled_one_way_OPD_treatment: [1],
    Average_Water_Consumed_Per_Day: [20],
    hh_water_collection_Minutes: [30],
    composts_num: [0],
    education_level_encoded: [0],
    
    // Categorical fields (all initialized to false)
    vsla_participation: [true],  // This seems to be a default in the original code
    ground_nuts: [false],
    perennial_crops_grown_food_banana: [false],
    sweet_potatoes: [false],
    perennial_crops_grown_coffee: [false],
    irish_potatoes: [false],
    business_participation: [false],
    cassava: [false],
    hh_produce_lq_manure: [false],
    hh_produce_organics: [false],
    maize: [false],
    sorghum: [false],
    non_bio_waste_mgt_present: [false],
    soap_ash_present: [false],
    tippy_tap_present: [false],
    hhh_sex: [false],  

  });

  const handleGetPrediction = async (data: Features) => {
    setLoading(true);
    setPredictionMade(false);
    
    // Ensure all boolean values are properly formatted as arrays
    const formattedData = {
      ...data,
      // Convert any single boolean values to arrays if needed
      checkin_evaluation: Array.isArray(data.checkin_evaluation) ? data.checkin_evaluation : [data.checkin_evaluation],
      standard_evaluation: Array.isArray(data.standard_evaluation) ? data.standard_evaluation : [data.standard_evaluation],
      vsla_participation: Array.isArray(data.vsla_participation) ? data.vsla_participation : [data.vsla_participation],
      ground_nuts: Array.isArray(data.ground_nuts) ? data.ground_nuts : [data.ground_nuts],
      perennial_crops_grown_food_banana: Array.isArray(data.perennial_crops_grown_food_banana) ? data.perennial_crops_grown_food_banana : [data.perennial_crops_grown_food_banana],
      sweet_potatoes: Array.isArray(data.sweet_potatoes) ? data.sweet_potatoes : [data.sweet_potatoes],
      perennial_crops_grown_coffee: Array.isArray(data.perennial_crops_grown_coffee) ? data.perennial_crops_grown_coffee : [data.perennial_crops_grown_coffee],
      irish_potatoes: Array.isArray(data.irish_potatoes) ? data.irish_potatoes : [data.irish_potatoes],
      business_participation: Array.isArray(data.business_participation) ? data.business_participation : [data.business_participation],
      cassava: Array.isArray(data.cassava) ? data.cassava : [data.cassava],
      hh_produce_lq_manure: Array.isArray(data.hh_produce_lq_manure) ? data.hh_produce_lq_manure : [data.hh_produce_lq_manure],
      hh_produce_organics: Array.isArray(data.hh_produce_organics) ? data.hh_produce_organics : [data.hh_produce_organics],
      maize: Array.isArray(data.maize) ? data.maize : [data.maize],
      sorghum: Array.isArray(data.sorghum) ? data.sorghum : [data.sorghum],
      non_bio_waste_mgt_present: Array.isArray(data.non_bio_waste_mgt_present) ? data.non_bio_waste_mgt_present : [data.non_bio_waste_mgt_present],
      soap_ash_present: Array.isArray(data.soap_ash_present) ? data.soap_ash_present : [data.soap_ash_present],
      tippy_tap_present: Array.isArray(data.tippy_tap_present) ? data.tippy_tap_present : [data.tippy_tap_present],
      hhh_sex: Array.isArray(data.hhh_sex) ? data.hhh_sex : [data.hhh_sex],
    };
    
    try {
      console.log("Sending prediction data:", formattedData);
      const response = await getPrediction(formattedData);
      const prediction = response.prediction;
      const probability = response.probability;
      setPrediction(prediction);
      setContributions(response.contributions);

      setPredictedIncomeProduction(response.predicted_income_production);
      setProbabilities([probability, 1 - probability]);
      setPredictionMade(true);
    } catch (error) {
      console.error("Prediction failed:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // New function to handle form submission
  const handleSubmit = () => {
    handleGetPrediction(formData);
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
              // Remove automatic prediction trigger
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
              // Add missing values
              cohort,
              cycle,
              region,
              standardEvaluation,
              checkinEvaluation,
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
              // Add missing setters
              setCohort,
              setCycle,
              setRegion,
              setStandardEvaluation,
              setCheckinEvaluation,
            }}
          />
          
          {/* Add submit button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 3 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={handleSubmit}
              disabled={loading}
              sx={{ 
                minWidth: 200,
                backgroundColor: '#EA580C',
                '&:hover': {
                  backgroundColor: '#C2410C',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Generate Prediction"
              )}
            </Button>
          </Box>
        </div>
        
        {predictionMade && (
          <>
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
          </>
        )}
        
        {!predictionMade && !loading && (
          <Box sx={{ textAlign: 'center', p: 4, bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="h6" color="textSecondary">
              Fill in the form above and click "Generate Prediction" to see results
            </Typography>
          </Box>
        )}
      </div>
    </div>
  );
};

export default IndividualPredictionPage;
