import React from "react";
import CheckboxTwo from "../Checkboxes/CheckboxTwo";
import { Features } from "../../types/features";
// import { PuffLoader } from "react-spinners";

interface FeatureInputProps {
  formData: Features;
  setFormData: (data: Features) => void;
  loading: boolean;
  values: {
    land: number;
    member: number;
    water: number;
    farmImplements: number;
    district: string;
    village: string;
    cluster: string;
    evaluationMonth: number;
    distanceToOPD: number;
    waterCollectionTime: number;
    compostsNum: number;
    educationLevel: number;
  };
  setValues: {
    setLand: (value: number) => void;
    setMember: (value: number) => void;
    setWater: (value: number) => void;
    setFarmImplements: (value: number) => void;
    setDistrict: (value: string) => void;
    setVillage: (value: string) => void;
    setCluster: (value: string) => void;
    setEvaluationMonth: (value: number) => void;
    setDistanceToOPD: (value: number) => void;
    setWaterCollectionTime: (value: number) => void;
    setCompostsNum: (value: number) => void;
    setEducationLevel: (value: number) => void;
  };
}

const FeatureInput: React.FC<FeatureInputProps> = ({
  formData,
  setFormData,
  //   loading,
  //   values,
  setValues: {
    setLand,
    setMember,
    setWater,
    setFarmImplements,
    setDistrict,
    setVillage,
    setCluster,
    setEvaluationMonth,
    setDistanceToOPD,
    setWaterCollectionTime,
    setCompostsNum,
    setEducationLevel,
  },
}) => {
  return (
    <div className="flex flex-col md:flex-row mt-6 md:justify-between md:space-x-6">
      <div className="border border-gray-300 rounded-sm shadow-lg w-full bg-white mb-6 md:mb-0 dark:border-gray-600 dark:bg-gray-800  ">
        <div className="bg-gradient-to-r from-gray-200 to-gray-300 p-4 rounded-sm  dark:from-gray-800 dark:to-gray-900 dark:text-gray-200">
          <h2 className="text-xl font-bold mb-2 w-full">Feature Input</h2>
          <p className="">Adjust features to update the prediction</p>
          {/* {loading && (
            <PuffLoader className="mx-auto mt-2" color="#ffffff" size={20} />
          )} */}
        </div>
        <form className="p-6 dark:bg-gray-800 ">
          <div className="flex flex-col space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <CheckboxTwo
                  label="Food Banana"
                  initialChecked={formData.perennial_crops_grown_food_banana[0]}
                  onChange={(checked) =>
                    setFormData({
                      ...formData,
                      perennial_crops_grown_food_banana: [checked],
                    })
                  }
                />
              </div>
              <div>
                <CheckboxTwo
                  label="Ground Nuts"
                  initialChecked={formData.ground_nuts[0]}
                  onChange={(checked) =>
                    setFormData({ ...formData, ground_nuts: [checked] })
                  }
                />
              </div>
              <div>
                <CheckboxTwo
                  label="Sweet Potatoes"
                  initialChecked={formData.sweet_potatoes[0]}
                  onChange={(checked) =>
                    setFormData({ ...formData, sweet_potatoes: [checked] })
                  }
                />
              </div>
              <div>
                <CheckboxTwo
                  label="Cassava"
                  initialChecked={formData.cassava[0]}
                  onChange={(checked) =>
                    setFormData({ ...formData, cassava: [checked] })
                  }
                />
              </div>
              <div>
                <CheckboxTwo
                  label="Business Participation"
                  initialChecked={formData.business_participation[0]}
                  onChange={(checked) =>
                    setFormData({
                      ...formData,
                      business_participation: [checked],
                    })
                  }
                />
              </div>
              <div>
                <CheckboxTwo
                  label="Coffee"
                  initialChecked={formData.perennial_crops_grown_coffee[0]}
                  onChange={(checked) =>
                    setFormData({
                      ...formData,
                      perennial_crops_grown_coffee: [checked],
                    })
                  }
                />
              </div>
              <div>
                <CheckboxTwo
                  label="Sorghum"
                  initialChecked={formData.sorghum[0]}
                  onChange={(checked) =>
                    setFormData({ ...formData, sorghum: [checked] })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="  mb-1 dark:text-gray-200">
                    Agriculture Land (
                    {formData.Land_size_for_Crop_Agriculture_Acres[0]} acres)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.Land_size_for_Crop_Agriculture_Acres[0]}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setLand(value);
                      setFormData({
                        ...formData,
                        Land_size_for_Crop_Agriculture_Acres: [value],
                      });
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                        [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-orange-500 
                        [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="  mb-1 dark:text-gray-200">
                    Household Members ({formData.tot_hhmembers[0]})
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={formData.tot_hhmembers[0]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setMember(value);
                      setFormData({
                        ...formData,
                        tot_hhmembers: [value],
                      });
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 
[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
[&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-orange-500 
[&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="  mb-1 dark:text-gray-200">
                    Farm Implements ({formData.farm_implements_owned[0]})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={formData.farm_implements_owned[0]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setFarmImplements(value);
                      setFormData({
                        ...formData,
                        farm_implements_owned: [value],
                      });
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 
[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
[&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-orange-500 
[&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="  mb-1 dark:text-gray-200">
                    Daily Consumed Water (
                    {formData.Average_Water_Consumed_Per_Day[0]} L)
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="20"
                    step="0.1"
                    value={formData.Average_Water_Consumed_Per_Day[0]}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setWater(value);
                      setFormData({
                        ...formData,
                        Average_Water_Consumed_Per_Day: [value],
                      });
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 
[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
[&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-orange-500 
[&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="  mb-1 dark:text-gray-200">
                    Distance to OPD (
                    {formData.Distance_travelled_one_way_OPD_treatment[0]} km)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="0.1"
                    value={formData.Distance_travelled_one_way_OPD_treatment[0]}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setDistanceToOPD(value);
                      setFormData({
                        ...formData,
                        Distance_travelled_one_way_OPD_treatment: [value],
                      });
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 
[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
[&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-orange-500 
[&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="  mb-1 dark:text-gray-200">
                    Water Collection Time (
                    {formData.hh_water_collection_Minutes[0]} minutes)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    step="1"
                    value={formData.hh_water_collection_Minutes[0]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setWaterCollectionTime(value);
                      setFormData({
                        ...formData,
                        hh_water_collection_Minutes: [value],
                      });
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 
[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
[&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-orange-500 
[&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="  mb-1 dark:text-gray-200">
                    Composts Number ({formData.composts_num[0]})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={formData.composts_num[0]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setCompostsNum(value);
                      setFormData({
                        ...formData,
                        composts_num: [value],
                      });
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 
[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
[&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-orange-500 
[&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="  mb-1 dark:text-gray-200">
                    Education Level ({formData.education_level_encoded[0]})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="1"
                    value={formData.education_level_encoded[0]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setEducationLevel(value);
                      setFormData({
                        ...formData,
                        education_level_encoded: [value],
                      });
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 
[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
[&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-orange-500 
[&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="  mb-1 dark:text-gray-200 ">
                    District
                  </label>
                  <input
                    placeholder="eg Kaliro"
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      setFormData({
                        ...formData,
                        district: e.target.value,
                      });
                    }}
                    className="p-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all dark:bg-gray-800 dark:text-gray-200"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="  mb-1 dark:text-gray-200   ">
                    Village
                  </label>
                  <input
                    placeholder="eg Buyunga"
                    onChange={(e) => {
                      setVillage(e.target.value);
                      setFormData({
                        ...formData,
                        village: e.target.value,
                      });
                    }}
                    className="p-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all dark:bg-gray-800 dark:text-gray-200"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="  mb-1 dark:text-gray-200">
                    Cluster
                  </label>
                  <input
                    placeholder="eg Mitooma"
                    onChange={(e) => {
                      setCluster(e.target.value);
                      setFormData({
                        ...formData,
                        cluster: e.target.value,
                      });
                    }}
                    className="p-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all dark:bg-gray-800 dark:text-gray-200"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="  mb-1 dark:text-gray-200">
                    Evaluation Month
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setEvaluationMonth(value);
                      setFormData({
                        ...formData,
                        evaluation_month: value,
                      });
                    }}
                    className="p-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all dark:bg-gray-800 dark:text-gray-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeatureInput;
