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
        <div className="bg-gradient-to-r from-gray-200 to-gray-300 p-4 rounded-sm text-gray-700 dark:from-gray-800 dark:to-gray-900 dark:text-gray-200">
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
                  <label className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                    Agriculture Land
                  </label>
                  <input
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? 0 : parseFloat(e.target.value);
                      setLand(value);
                      setFormData({
                        ...formData,
                        Land_size_for_Crop_Agriculture_Acres: [value],
                      });
                    }}
                    className="p-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all dark:bg-gray-800 dark:text-gray-200"
                    type="number"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                    Household Members
                  </label>
                  <input
                    min={1}
                    max={30}
                    step={1}
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? 0 : Number(e.target.value);
                      setMember(value);
                      setFormData({
                        ...formData,
                        tot_hhmembers: [value],
                      });
                    }}
                    className="p-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all dark:bg-gray-800 dark:text-gray-200"
                    type="number"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                    Farm Implements
                  </label>
                  <input
                    min={0}
                    max={20}
                    step={1}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setFarmImplements(value);
                      setFormData({
                        ...formData,
                        farm_implements_owned: [value],
                      });
                    }}
                    className="p-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all dark:bg-gray-800 dark:text-gray-200"
                    type="number"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                    Daily Consumed Water
                  </label>
                  <input
                    min={0.1}
                    max={20}
                    step={0.1}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setWater(value);
                      setFormData({
                        ...formData,
                        Average_Water_Consumed_Per_Day: [value],
                      });
                    }}
                    className="p-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all dark:bg-gray-800 dark:text-gray-200"
                    type="number"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                    Distance to OPD (km)
                  </label>
                  <input
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setDistanceToOPD(value);
                      setFormData({
                        ...formData,
                        Distance_travelled_one_way_OPD_treatment: [value],
                      });
                    }}
                    className="p-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all dark:bg-gray-800 dark:text-gray-200"
                    type="number"
                    min={0}
                    step={0.1}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                    Water Collection Time (minutes)
                  </label>
                  <input
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setWaterCollectionTime(value);
                      setFormData({
                        ...formData,
                        hh_water_collection_Minutes: [value],
                      });
                    }}
                    className="p-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all dark:bg-gray-800 dark:text-gray-200"
                    type="number"
                    min={0}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                    Composts Number
                  </label>
                  <input
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setCompostsNum(value);
                      setFormData({
                        ...formData,
                        composts_num: [value],
                      });
                    }}
                    className="p-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all dark:bg-gray-800 dark:text-gray-200"
                    type="number"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                    Education Level
                  </label>
                  <input
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setEducationLevel(value);
                      setFormData({
                        ...formData,
                        education_level_encoded: [value],
                      });
                    }}
                    className="p-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all dark:bg-gray-800 dark:text-gray-200"
                    type="number"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-200 ">
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
                        <label className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-200   ">
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
                    <label className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
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
                  <label className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
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
