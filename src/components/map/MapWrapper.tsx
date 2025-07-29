// MapWrapper.tsx
import dynamic from 'next/dynamic';
import React from 'react';

// Define the household interface for props
interface Household {
  household_id: string;
  village: string;
  latitude: number;
  longitude: number;
  prediction: number;
  predicted_income: number;
  region?: string;
  district?: string;
  cluster?: string;
  altitude?: number;
  standard_evaluation?: boolean;
  checkin_evaluation?: boolean;
  cohort?: string;
  cycle?: string;
  evaluation_month?: number;
  Land_size_for_Crop_Agriculture_Acres?: number;
  farm_implements_owned?: number;
  tot_hhmembers?: number;
  Distance_travelled_one_way_OPD_treatment?: number;
  Average_Water_Consumed_Per_Day?: number;
  hh_water_collection_Minutes?: number;
  vsla_participation?: number;
  ground_nuts?: number;
  composts_num?: number;
  perennial_crops_grown_food_banana?: number;
  sweet_potatoes?: number;
  perennial_crops_grown_coffee?: number;
  irish_potatoes?: number;
  business_participation?: number;
  cassava?: number;
  hh_produce_lq_manure?: number;
  hh_produce_organics?: number;
  maize?: number;
  sorghum?: number;
  non_bio_waste_mgt_present?: number;
  soap_ash_present?: number;
  education_level_encoded?: number;
  tippy_tap_present?: number;
  hhh_sex?: number;
  probability?: number;
  [key: string]: any;
}

interface HouseholdMapProps {
  households: Household[];
}

// Dynamic import with SSR disabled
const DynamicHouseholdMap = dynamic(
  () => import('./HouseholdMap'),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-md shadow-md p-6 mb-6 h-[500px] flex items-center justify-center text-gray-500">
        Loading map...
      </div>
    ),
  }
);

const MapWrapper: React.FC<HouseholdMapProps> = ({ households }) => {
  return <DynamicHouseholdMap households={households} />;
};

export default MapWrapper;