// Interface for each predicted data entry
export interface PredictedDataEntry {
  HouseHoldID: string;
  HouseholdSize: number;
  TimeToOPD: number;
  TimeToWater: number;
  AgricultureLand: number;
  PerennialCropsGrown: number;
  hhh_read_write: number;
  Material_walls: number;
  business_number: number;
  work_casual: number;
  work_salaried: number;
  save_mode_7: number;
  perennial_cropping: number;
  latrine_constructed: number;
  tippy_tap_available: number;
  standard_hangline: number;
  kitchen_house: number;
  bathroom_constructed: number;
  swept_compound: number;
  dish_rack_present: number;
  composts: number;
  non_bio_waste_mgt_present: number;
  apply_liquid_manure: number;
  water_control_practise: number;
  soil_management: number;
  postharvest_food_storage: number;
  prediction: number;
}

// PredictedData is now an array of PredictedDataEntry objects
export type PredictedData = PredictedDataEntry[];

// Function to fetch the predicted data
export const fetchPredictedData = async (): Promise<PredictedData> => {
  const token = localStorage.getItem('token');
  const response = await fetch('api/predictor/submitted-data', {
    method: 'GET',
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch predictions');
  }

  const data: PredictedData = await response.json(); // Make sure to cast it to `PredictedData`
  return data;
};
