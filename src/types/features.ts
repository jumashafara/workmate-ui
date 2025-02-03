export interface Features {
  household_id: string;
  district: string;
  village: string;
  cluster: string;
  evaluation_month: number;
  cassava: Array<boolean>;
  maize: Array<boolean>;
  ground_nuts: Array<boolean>;
  irish_potatoes: Array<boolean>;
  sweet_potatoes: Array<boolean>;
  perennial_crops_grown_food_banana: Array<boolean>;
  tot_hhmembers: Array<number>;
  business_participation: Array<boolean>;
  Land_size_for_Crop_Agriculture_Acres: Array<number>;
  farm_implements_owned: Array<number>;
  vsla_participation: Array<boolean>;
  Average_Water_Consumed_Per_Day: Array<number>;
}
