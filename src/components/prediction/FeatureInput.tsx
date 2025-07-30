import React from "react";
import { Features } from "../../types/features";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

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
    // new additions
    tippyTapPresent: number;
    nonBioWasteManagement: number;
    organicsProduction: number;
    // additional missing fields
    cohort: string;
    cycle: string;
    region: string;
    standardEvaluation: boolean;
    checkinEvaluation: boolean;
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
    setTippyTapPresent: (value: number) => void;
    setNonBioWasteManagement: (value: number) => void;
    setOrganicsProduction: (value: number) => void;
    // additional missing setters
    setCohort: (value: string) => void;
    setCycle: (value: string) => void;
    setRegion: (value: string) => void;
    setStandardEvaluation: (value: boolean) => void;
    setCheckinEvaluation: (value: boolean) => void;
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
    // setTippyTapPresent,
    // setWasteManagement,
    // setOrganicsProduction,
    setCohort,
    setCycle,
    setRegion,
    setStandardEvaluation,
    setCheckinEvaluation,
  },
}) => {
  // Custom shadcn/ui checkbox component
  const FeatureCheckbox = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (checked: boolean) => void }) => (
    <div className="flex items-center space-x-2">
      <Checkbox 
        checked={checked} 
        onCheckedChange={onChange}
        id={label.toLowerCase().replace(/\s+/g, '-')}
      />
      <Label 
        htmlFor={label.toLowerCase().replace(/\s+/g, '-')}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </Label>
    </div>
  );

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>Feature Input</CardTitle>
        <p className="text-sm text-gray-600">Adjust features to update the prediction</p>
      </CardHeader>
      <CardContent>
        <form className="mt-4">
          <div className="space-y-6">
            {/* Checkboxes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Crop & Business Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <FeatureCheckbox
                  label="Food Banana"
                  checked={formData.perennial_crops_grown_food_banana[0]}
                  onChange={(checked) =>
                    setFormData({
                      ...formData,
                      perennial_crops_grown_food_banana: [checked],
                    })
                  }
                />
                <FeatureCheckbox
                  label="Ground Nuts"
                  checked={formData.ground_nuts[0]}
                  onChange={(checked) =>
                    setFormData({ ...formData, ground_nuts: [checked] })
                  }
                />
                <FeatureCheckbox
                  label="Sweet Potatoes"
                  checked={formData.sweet_potatoes[0]}
                  onChange={(checked) =>
                    setFormData({ ...formData, sweet_potatoes: [checked] })
                  }
                />
                <FeatureCheckbox
                  label="Cassava"
                  checked={formData.cassava[0]}
                  onChange={(checked) =>
                    setFormData({ ...formData, cassava: [checked] })
                  }
                />
                <FeatureCheckbox
                  label="Business Participation"
                  checked={formData.business_participation[0]}
                  onChange={(checked) =>
                    setFormData({
                      ...formData,
                      business_participation: [checked],
                    })
                  }
                />
                <FeatureCheckbox
                  label="Coffee"
                  checked={formData.perennial_crops_grown_coffee[0]}
                  onChange={(checked) =>
                    setFormData({
                      ...formData,
                      perennial_crops_grown_coffee: [checked],
                    })
                  }
                />
                <FeatureCheckbox
                  label="Sorghum"
                  checked={formData.sorghum[0]}
                  onChange={(checked) =>
                    setFormData({ ...formData, sorghum: [checked] })
                  }
                />
                <FeatureCheckbox
                  label="Tippy Tap"
                  checked={formData.tippy_tap_present[0]}
                  onChange={(checked) =>
                    setFormData({ ...formData, tippy_tap_present: [checked] })
                  }
                />
                <FeatureCheckbox
                  label="Waste Mgt"
                  checked={formData.non_bio_waste_mgt_present[0]}
                  onChange={(checked) =>
                    setFormData({
                      ...formData,
                      non_bio_waste_mgt_present: [checked],
                    })
                  }
                />
                <FeatureCheckbox
                  label="Organics Production"
                  checked={formData.hh_produce_organics[0]}
                  onChange={(checked) =>
                    setFormData({
                      ...formData,
                      hh_produce_organics: [checked],
                    })
                  }
                />
                <FeatureCheckbox
                  label="Maize"
                  checked={formData.maize[0]}
                  onChange={(checked) =>
                    setFormData({ ...formData, maize: [checked] })
                  }
                />
                <FeatureCheckbox
                  label="Irish Potatoes"
                  checked={formData.irish_potatoes[0]}
                  onChange={(checked) =>
                    setFormData({ ...formData, irish_potatoes: [checked] })
                  }
                />
                <FeatureCheckbox
                  label="Liquid Manure"
                  checked={formData.hh_produce_lq_manure[0]}
                  onChange={(checked) =>
                    setFormData({ ...formData, hh_produce_lq_manure: [checked] })
                  }
                />
                <FeatureCheckbox
                  label="Soap/Ash Present"
                  checked={formData.soap_ash_present[0]}
                  onChange={(checked) =>
                    setFormData({ ...formData, soap_ash_present: [checked] })
                  }
                />
                <FeatureCheckbox
                  label="VSLA Participation"
                  checked={formData.vsla_participation[0]}
                  onChange={(checked) =>
                    setFormData({ ...formData, vsla_participation: [checked] })
                  }
                />
                <FeatureCheckbox
                  label="Household Head is Male"
                  checked={formData.hhh_sex[0]}
                  onChange={(checked) =>
                    setFormData({ ...formData, hhh_sex: [checked] })
                  }
                />
              </div>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Land & Household</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="agriculture-land-slider">
                      Agriculture Land ({formData.Land_size_for_Crop_Agriculture_Acres[0]} acres)
                    </Label>
                    <Slider
                      id="agriculture-land-slider"
                      min={0.1}
                      max={5}
                      step={0.1}
                      value={[formData.Land_size_for_Crop_Agriculture_Acres[0]]}
                      onValueChange={(value) => {
                        const newValue = value[0];
                        setLand(newValue);
                        setFormData({
                          ...formData,
                          Land_size_for_Crop_Agriculture_Acres: [newValue],
                        });
                      }}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="household-members-slider">
                      Household Members ({formData.tot_hhmembers[0]})
                    </Label>
                    <Slider
                      id="household-members-slider"
                      min={1}
                      max={15}
                      step={1}
                      value={[formData.tot_hhmembers[0]]}
                      onValueChange={(value) => {
                        const newValue = value[0];
                        setMember(newValue);
                        setFormData({
                          ...formData,
                          tot_hhmembers: [newValue],
                        });
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Farm & Water</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="farm-implements-slider">
                      Farm Implements ({formData.farm_implements_owned[0]})
                    </Label>
                    <Slider
                      id="farm-implements-slider"
                      min={0}
                      max={10}
                      step={1}
                      value={[formData.farm_implements_owned[0]]}
                      onValueChange={(value) => {
                        const newValue = value[0];
                        setFarmImplements(newValue);
                        setFormData({
                          ...formData,
                          farm_implements_owned: [newValue],
                        });
                      }}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="water-consumption-slider">
                      Water Consumption ({formData.Average_Water_Consumed_Per_Day[0]} jerrycans)
                    </Label>
                    <Slider
                      id="water-consumption-slider"
                      min={1}
                      max={10}
                      step={1}
                      value={[formData.Average_Water_Consumed_Per_Day[0]]}
                      onValueChange={(value) => {
                        const newValue = value[0];
                        setWater(newValue);
                        setFormData({
                          ...formData,
                          Average_Water_Consumed_Per_Day: [newValue],
                        });
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Distance & Time</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="distance-to-opd-slider">
                      Distance to OPD ({formData.Distance_travelled_one_way_OPD_treatment[0]} km)
                    </Label>
                    <Slider
                      id="distance-to-opd-slider"
                      min={0}
                      max={50}
                      step={0.1}
                      value={[formData.Distance_travelled_one_way_OPD_treatment[0]]}
                      onValueChange={(value) => {
                        const newValue = value[0];
                        setDistanceToOPD(newValue);
                        setFormData({
                          ...formData,
                          Distance_travelled_one_way_OPD_treatment: [newValue],
                        });
                      }}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="water-collection-time-slider">
                      Water Collection Time ({formData.hh_water_collection_Minutes[0]} minutes)
                    </Label>
                    <Slider
                      id="water-collection-time-slider"
                      min={1}
                      max={120}
                      step={1}
                      value={[formData.hh_water_collection_Minutes[0]]}
                      onValueChange={(value) => {
                        const newValue = value[0];
                        setWaterCollectionTime(newValue);
                        setFormData({
                          ...formData,
                          hh_water_collection_Minutes: [newValue],
                        });
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Compost & Education</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="composts-number-slider">
                      Composts Number ({formData.composts_num[0]})
                    </Label>
                    <Slider
                      id="composts-number-slider"
                      min={0}
                      max={10}
                      step={1}
                      value={[formData.composts_num[0]]}
                      onValueChange={(value) => {
                        const newValue = value[0];
                        setCompostsNum(newValue);
                        setFormData({
                          ...formData,
                          composts_num: [newValue],
                        });
                      }}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education-level-slider">
                      Education Level ({formData.education_level_encoded[0]})
                    </Label>
                    <Slider
                      id="education-level-slider"
                      min={0}
                      max={3}
                      step={1}
                      value={[formData.education_level_encoded[0]]}
                      onValueChange={(value) => {
                        const newValue = value[0];
                        setEducationLevel(newValue);
                        setFormData({
                          ...formData,
                          education_level_encoded: [newValue],
                        });
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Location</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="district-input">District</Label>
                    <Input
                      id="district-input"
                      placeholder="eg Kaliro"
                      value={formData.district}
                      onChange={(e) => {
                        setDistrict(e.target.value);
                        setFormData({
                          ...formData,
                          district: e.target.value,
                        });
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="village-input">Village</Label>
                    <Input
                      id="village-input"
                      placeholder="eg Buyunga"
                      value={formData.village}
                      onChange={(e) => {
                        setVillage(e.target.value);
                        setFormData({
                          ...formData,
                          village: e.target.value,
                        });
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="region-input">Region</Label>
                    <Input
                      id="region-input"
                      placeholder="eg East"
                      value={formData.region}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setRegion(newValue);
                        const updatedFormData = {
                          ...formData,
                          region: newValue,
                        };
                        console.log("Updated region:", newValue);
                        console.log("Updated formData:", updatedFormData);
                        setFormData(updatedFormData);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Cluster & Evaluation</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cluster-input">Cluster</Label>
                    <Input
                      id="cluster-input"
                      placeholder="eg Bugonza"
                      value={formData.cluster}
                      onChange={(e) => {
                        setCluster(e.target.value);
                        setFormData({
                          ...formData,
                          cluster: e.target.value,
                        });
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="evaluation-month-input">Evaluation Month</Label>
                    <Input
                      id="evaluation-month-input"
                      type="number"
                      min={3}
                      max={24}
                      value={formData.evaluation_month}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setEvaluationMonth(value);
                        setFormData({
                          ...formData,
                          evaluation_month: value,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Add new section for Cohort, Cycle, and Evaluation Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Cohort & Cycle</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cohort-input">Cohort</Label>
                    <Input
                      id="cohort-input"
                      placeholder="eg 2024"
                      value={formData.cohort}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setCohort(newValue);
                        const updatedFormData = {
                          ...formData,
                          cohort: newValue,
                        };
                        console.log("Updated cohort:", newValue);
                        console.log("Updated formData:", updatedFormData);
                        setFormData(updatedFormData);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cycle-input">Cycle</Label>
                    <Input
                      id="cycle-input"
                      placeholder="eg A"
                      value={formData.cycle}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setCycle(newValue);
                        const updatedFormData = {
                          ...formData,
                          cycle: newValue,
                        };
                        console.log("Updated cycle:", newValue);
                        console.log("Updated formData:", updatedFormData);
                        setFormData(updatedFormData);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Evaluation Type</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={formData.standard_evaluation[0]}
                      onCheckedChange={(checked) => {
                        const booleanChecked = checked === true;
                        setStandardEvaluation(booleanChecked);
                        setFormData({
                          ...formData,
                          standard_evaluation: [booleanChecked],
                        });
                      }}
                      id="standard-evaluation"
                    />
                    <Label 
                      htmlFor="standard-evaluation"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Standard Evaluation
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={formData.checkin_evaluation[0]}
                      onCheckedChange={(checked) => {
                        const booleanChecked = checked === true;
                        setCheckinEvaluation(booleanChecked);
                        setFormData({
                          ...formData,
                          checkin_evaluation: [booleanChecked],
                        });
                      }}
                      id="checkin-evaluation"
                    />
                    <Label 
                      htmlFor="checkin-evaluation"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Check-in Evaluation
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FeatureInput;
