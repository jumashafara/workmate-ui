export interface Features {
  household_id: string;
  checkin_evaluation: Array<boolean>;
  standard_evaluation: Array<boolean>;
  
  cohort: string;
  cycle: string;
  region: string;
  district: string;
  cluster: string;
  village: string;
  evaluation_month: number;

  // Numeric fields
  Land_size_for_Crop_Agriculture_Acres: Array<number>;
  farm_implements_owned: Array<number>;
  tot_hhmembers: Array<number>;
  Distance_travelled_one_way_OPD_treatment: Array<number>;
  Average_Water_Consumed_Per_Day: Array<number>;
  hh_water_collection_Minutes: Array<number>;
  composts_num: Array<number>;
  education_level_encoded: Array<number>;

  // Categorical fields (encoded as numbers)
  vsla_participation: Array<boolean>;
  ground_nuts: Array<boolean>;
  perennial_crops_grown_food_banana: Array<boolean>;
  sweet_potatoes: Array<boolean>;
  perennial_crops_grown_coffee: Array<boolean>;
  irish_potatoes: Array<boolean>;
  business_participation: Array<boolean>;
  cassava: Array<boolean>;
  hh_produce_lq_manure: Array<boolean>;
  hh_produce_organics: Array<boolean>;
  maize: Array<boolean>;
  sorghum: Array<boolean>;
  non_bio_waste_mgt_present: Array<boolean>;
  soap_ash_present: Array<boolean>;
  tippy_tap_present: Array<boolean>;
  hhh_sex: Array<boolean>;
}
