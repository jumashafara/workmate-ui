"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, AlertCircle, User, BarChart3, Settings, TrendingUp } from "lucide-react";
import dynamic from "next/dynamic";
import { API_ENDPOINT } from "@/utils/endpoints";

// Dynamically import components
const PredictionDisplay = dynamic(
  () => import("@/components/prediction/PredictionDisplay"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-64 w-full" />,
  }
);

const FeatureContributionsChart = dynamic(
  () => import("@/components/charts/ContributionsPlot"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-96 w-full" />,
  }
);

interface Features {
  district: string;
  village: string;
  cluster: string;
  evaluation_month: number;
  cohort: string;
  cycle: string;
  region: string;
  standard_evaluation: boolean[];
  checkin_evaluation: boolean[];

  // Numeric fields
  Land_size_for_Crop_Agriculture_Acres: number[];
  farm_implements_owned: number[];
  tot_hhmembers: number[];
  Distance_travelled_one_way_OPD_treatment: number[];
  Average_Water_Consumed_Per_Day: number[];
  hh_water_collection_Minutes: number[];
  composts_num: number[];
  education_level_encoded: number[];

  // Categorical fields
  vsla_participation: boolean[];
  ground_nuts: boolean[];
  perennial_crops_grown_food_banana: boolean[];
  sweet_potatoes: boolean[];
  perennial_crops_grown_coffee: boolean[];
  irish_potatoes: boolean[];
  business_participation: boolean[];
  cassava: boolean[];
  hh_produce_lq_manure: boolean[];
  hh_produce_organics: boolean[];
  maize: boolean[];
  sorghum: boolean[];
  non_bio_waste_mgt_present: boolean[];
  soap_ash_present: boolean[];
  tippy_tap_present: boolean[];
  hhh_sex: boolean[];
}

// Mock prediction API function
const getPrediction = async (data: Features) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Return mock prediction result
  return {
    prediction: Math.random() > 0.5 ? 1 : 0,
    probability: Math.random(),
    predicted_income_production: Math.random() * 1000 + 500,
    contributions: {
      "Land Size": Math.random() * 0.3,
      "Household Members": Math.random() * 0.2,
      "Water Access": Math.random() * 0.15,
      "Farm Implements": Math.random() * 0.1,
      "Education Level": Math.random() * 0.08,
      "Distance to OPD": Math.random() * 0.07,
      Other: Math.random() * 0.1,
    },
  };
};

export default function IndividualPredictionPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [predictionMade, setPredictionMade] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>("");

  // Prediction results
  const [prediction, setPrediction] = useState<number>(0.5);
  const [probabilities, setProbabilities] = useState<Array<number>>([0.5, 0.5]);
  const [predictedIncomeProduction, setPredictedIncomeProduction] =
    useState<number>(0);
  const [contributions, setContributions] = useState({});

  // Form data
  const [formData, setFormData] = useState<Features>({
    district: "",
    village: "",
    cluster: "",
    evaluation_month: 1,
    cohort: "",
    cycle: "",
    region: "",
    standard_evaluation: [false],
    checkin_evaluation: [false],

    // Numeric fields with defaults
    Land_size_for_Crop_Agriculture_Acres: [1.0],
    farm_implements_owned: [1],
    tot_hhmembers: [5],
    Distance_travelled_one_way_OPD_treatment: [1],
    Average_Water_Consumed_Per_Day: [20],
    hh_water_collection_Minutes: [30],
    composts_num: [0],
    education_level_encoded: [0],

    // Categorical fields
    vsla_participation: [true],
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

  const validateForm = () => {
    if (!formData.district.trim()) {
      setValidationError("District is required");
      return false;
    }
    if (!formData.village.trim()) {
      setValidationError("Village is required");
      return false;
    }
    if (!formData.cluster.trim()) {
      setValidationError("Cluster is required");
      return false;
    }
    if (!formData.cohort.trim()) {
      setValidationError("Cohort is required");
      return false;
    }
    if (!formData.cycle.trim()) {
      setValidationError("Cycle is required");
      return false;
    }
    if (!formData.region.trim()) {
      setValidationError("Region is required");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setPredictionMade(false);

    try {
      const response = await getPrediction(formData);

      setPrediction(Number(response.prediction));
      setContributions(response.contributions);
      setPredictedIncomeProduction(response.predicted_income_production);
      setProbabilities([
        Number(response.probability),
        1 - Number(response.probability),
      ]);
      setPredictionMade(true);
    } catch (error) {
      console.error("Prediction failed:", error);
      setValidationError("Failed to generate prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateFormField = (field: keyof Features, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateNumericArray = (
    field: keyof Features,
    value: number,
    index: number = 0
  ) => {
    setFormData((prev) => {
      const currentArray = prev[field] as number[];
      const newArray = [...currentArray];
      newArray[index] = value;
      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  const updateBooleanArray = (
    field: keyof Features,
    value: boolean,
    index: number = 0
  ) => {
    setFormData((prev) => {
      const currentArray = prev[field] as boolean[];
      const newArray = [...currentArray];
      newArray[index] = value;
      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
            <User className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Individual Prediction
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              Generate AI-powered predictions for individual households by entering their characteristics and features
            </p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <BarChart3 className="h-4 w-4" />
                <span>ML Predictions</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <TrendingUp className="h-4 w-4" />
                <span>Real-time Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Settings className="h-4 w-4" />
                <span>Customizable Features</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Error */}
      {validationError && (
        <Alert className="border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-800 dark:bg-orange-900/10 dark:text-orange-200">
          <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <AlertDescription className="text-orange-700 dark:text-orange-300">{validationError}</AlertDescription>
        </Alert>
      )}

      {/* Input Form */}
      <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Settings className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Household Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Location & Context</h4>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="region" className="text-sm font-medium text-gray-700 dark:text-gray-300">Region *</Label>
              <Input
                id="region"
                value={formData.region}
                onChange={(e) => updateFormField("region", e.target.value)}
                placeholder="Enter region"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="district" className="text-sm font-medium text-gray-700 dark:text-gray-300">District *</Label>
              <Input
                id="district"
                value={formData.district}
                onChange={(e) => updateFormField("district", e.target.value)}
                placeholder="Enter district"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="village" className="text-sm font-medium text-gray-700 dark:text-gray-300">Village *</Label>
              <Input
                id="village"
                value={formData.village}
                onChange={(e) => updateFormField("village", e.target.value)}
                placeholder="Enter village"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cluster" className="text-sm font-medium text-gray-700 dark:text-gray-300">Cluster *</Label>
              <Input
                id="cluster"
                value={formData.cluster}
                onChange={(e) => updateFormField("cluster", e.target.value)}
                placeholder="Enter cluster"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cohort" className="text-sm font-medium text-gray-700 dark:text-gray-300">Cohort *</Label>
              <Input
                id="cohort"
                value={formData.cohort}
                onChange={(e) => updateFormField("cohort", e.target.value)}
                placeholder="Enter cohort"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cycle" className="text-sm font-medium text-gray-700 dark:text-gray-300">Cycle *</Label>
              <Input
                id="cycle"
                value={formData.cycle}
                onChange={(e) => updateFormField("cycle", e.target.value)}
                placeholder="Enter cycle"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="evaluation_month" className="text-sm font-medium text-gray-700 dark:text-gray-300">Evaluation Month</Label>
              <Input
                id="evaluation_month"
                type="number"
                value={formData.evaluation_month}
                onChange={(e) =>
                  updateFormField(
                    "evaluation_month",
                    parseInt(e.target.value) || 1
                  )
                }
                min="1"
                max="24"
              />
            </div>
            </div>
          </div>

          {/* Numeric Features */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Numeric Characteristics</h3>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Land Size (Acres): <span className="text-orange-600 dark:text-orange-400 font-semibold">{formData.Land_size_for_Crop_Agriculture_Acres[0]}</span>
                </Label>
                <Slider
                  value={[formData.Land_size_for_Crop_Agriculture_Acres[0]]}
                  onValueChange={(value) =>
                    updateNumericArray(
                      "Land_size_for_Crop_Agriculture_Acres",
                      value[0]
                    )
                  }
                  max={10}
                  min={0.1}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Household Members: <span className="text-orange-600 dark:text-orange-400 font-semibold">{formData.tot_hhmembers[0]}</span></Label>
                <Slider
                  value={[formData.tot_hhmembers[0]]}
                  onValueChange={(value) =>
                    updateNumericArray("tot_hhmembers", value[0])
                  }
                  max={15}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Farm Implements: <span className="text-orange-600 dark:text-orange-400 font-semibold">{formData.farm_implements_owned[0]}</span>
                </Label>
                <Slider
                  value={[formData.farm_implements_owned[0]]}
                  onValueChange={(value) =>
                    updateNumericArray("farm_implements_owned", value[0])
                  }
                  max={10}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Distance to OPD (km): <span className="text-orange-600 dark:text-orange-400 font-semibold">{formData.Distance_travelled_one_way_OPD_treatment[0]}</span>
                </Label>
                <Slider
                  value={[formData.Distance_travelled_one_way_OPD_treatment[0]]}
                  onValueChange={(value) =>
                    updateNumericArray(
                      "Distance_travelled_one_way_OPD_treatment",
                      value[0]
                    )
                  }
                  max={50}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Water Collection Time (min): <span className="text-orange-600 dark:text-orange-400 font-semibold">{formData.hh_water_collection_Minutes[0]}</span>
                </Label>
                <Slider
                  value={[formData.hh_water_collection_Minutes[0]]}
                  onValueChange={(value) =>
                    updateNumericArray("hh_water_collection_Minutes", value[0])
                  }
                  max={180}
                  min={5}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Education Level: <span className="text-orange-600 dark:text-orange-400 font-semibold">{formData.education_level_encoded[0]}</span>
                </Label>
                <Slider
                  value={[formData.education_level_encoded[0]]}
                  onValueChange={(value) =>
                    updateNumericArray("education_level_encoded", value[0])
                  }
                  max={4}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Average Water Consumed Per Day (L): <span className="text-orange-600 dark:text-orange-400 font-semibold">{formData.Average_Water_Consumed_Per_Day[0]}</span>
                </Label>
                <Slider
                  value={[formData.Average_Water_Consumed_Per_Day[0]]}
                  onValueChange={(value) =>
                    updateNumericArray(
                      "Average_Water_Consumed_Per_Day",
                      value[0]
                    )
                  }
                  max={100}
                  min={5}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Composts Number: <span className="text-orange-600 dark:text-orange-400 font-semibold">{formData.composts_num[0]}</span></Label>
                <Slider
                  value={[formData.composts_num[0]]}
                  onValueChange={(value) =>
                    updateNumericArray("composts_num", value[0])
                  }
                  max={10}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Boolean Features */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Agricultural & Social Participation
            </h3>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="vsla_participation"
                  checked={formData.vsla_participation[0]}
                  onCheckedChange={(checked) =>
                    updateBooleanArray("vsla_participation", checked)
                  }
                />
                <Label htmlFor="vsla_participation" className="text-sm font-medium text-gray-700 dark:text-gray-300">VSLA Participation</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="business_participation"
                  checked={formData.business_participation[0]}
                  onCheckedChange={(checked) =>
                    updateBooleanArray("business_participation", checked)
                  }
                />
                <Label htmlFor="business_participation" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Business Participation
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="maize"
                  checked={formData.maize[0]}
                  onCheckedChange={(checked) =>
                    updateBooleanArray("maize", checked)
                  }
                />
                <Label htmlFor="maize" className="text-sm font-medium text-gray-700 dark:text-gray-300">Grows Maize</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="ground_nuts"
                  checked={formData.ground_nuts[0]}
                  onCheckedChange={(checked) =>
                    updateBooleanArray("ground_nuts", checked)
                  }
                />
                <Label htmlFor="ground_nuts" className="text-sm font-medium text-gray-700 dark:text-gray-300">Grows Ground Nuts</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="sweet_potatoes"
                  checked={formData.sweet_potatoes[0]}
                  onCheckedChange={(checked) =>
                    updateBooleanArray("sweet_potatoes", checked)
                  }
                />
                <Label htmlFor="sweet_potatoes" className="text-sm font-medium text-gray-700 dark:text-gray-300">Grows Sweet Potatoes</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="cassava"
                  checked={formData.cassava[0]}
                  onCheckedChange={(checked) =>
                    updateBooleanArray("cassava", checked)
                  }
                />
                <Label htmlFor="cassava" className="text-sm font-medium text-gray-700 dark:text-gray-300">Grows Cassava</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="tippy_tap_present"
                  checked={formData.tippy_tap_present[0]}
                  onCheckedChange={(checked) =>
                    updateBooleanArray("tippy_tap_present", checked)
                  }
                />
                <Label htmlFor="tippy_tap_present" className="text-sm font-medium text-gray-700 dark:text-gray-300">Has Tippy Tap</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="hh_produce_organics"
                  checked={formData.hh_produce_organics[0]}
                  onCheckedChange={(checked) =>
                    updateBooleanArray("hh_produce_organics", checked)
                  }
                />
                <Label htmlFor="hh_produce_organics" className="text-sm font-medium text-gray-700 dark:text-gray-300">Produces Organics</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="hhh_sex"
                  checked={formData.hhh_sex[0]}
                  onCheckedChange={(checked) =>
                    updateBooleanArray("hhh_sex", checked)
                  }
                />
                <Label htmlFor="hhh_sex" className="text-sm font-medium text-gray-700 dark:text-gray-300">Head of Household (Female)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="perennial_crops_grown_food_banana"
                  checked={formData.perennial_crops_grown_food_banana[0]}
                  onCheckedChange={(checked) =>
                    updateBooleanArray(
                      "perennial_crops_grown_food_banana",
                      checked
                    )
                  }
                />
                <Label htmlFor="perennial_crops_grown_food_banana" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Grows Food Banana
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="perennial_crops_grown_coffee"
                  checked={formData.perennial_crops_grown_coffee[0]}
                  onCheckedChange={(checked) =>
                    updateBooleanArray("perennial_crops_grown_coffee", checked)
                  }
                />
                <Label htmlFor="perennial_crops_grown_coffee" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Grows Coffee
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="irish_potatoes"
                  checked={formData.irish_potatoes[0]}
                  onCheckedChange={(checked) =>
                    updateBooleanArray("irish_potatoes", checked)
                  }
                />
                <Label htmlFor="irish_potatoes" className="text-sm font-medium text-gray-700 dark:text-gray-300">Grows Irish Potatoes</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="sorghum"
                  checked={formData.sorghum[0]}
                  onCheckedChange={(checked) =>
                    updateBooleanArray("sorghum", checked)
                  }
                />
                <Label htmlFor="sorghum" className="text-sm font-medium text-gray-700 dark:text-gray-300">Grows Sorghum</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="hh_produce_lq_manure"
                  checked={formData.hh_produce_lq_manure[0]}
                  onCheckedChange={(checked) =>
                    updateBooleanArray("hh_produce_lq_manure", checked)
                  }
                />
                <Label htmlFor="hh_produce_lq_manure" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Produces Liquid Manure
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="non_bio_waste_mgt_present"
                  checked={formData.non_bio_waste_mgt_present[0]}
                  onCheckedChange={(checked) =>
                    updateBooleanArray("non_bio_waste_mgt_present", checked)
                  }
                />
                <Label htmlFor="non_bio_waste_mgt_present" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Non-Bio Waste Management
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="soap_ash_present"
                  checked={formData.soap_ash_present[0]}
                  onCheckedChange={(checked) =>
                    updateBooleanArray("soap_ash_present", checked)
                  }
                />
                <Label htmlFor="soap_ash_present" className="text-sm font-medium text-gray-700 dark:text-gray-300">Soap Ash Present</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="standard_evaluation"
                  checked={formData.standard_evaluation[0]}
                  onCheckedChange={(checked) =>
                    updateBooleanArray("standard_evaluation", checked)
                  }
                />
                <Label htmlFor="standard_evaluation" className="text-sm font-medium text-gray-700 dark:text-gray-300">Standard Evaluation</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="checkin_evaluation"
                  checked={formData.checkin_evaluation[0]}
                  onCheckedChange={(checked) =>
                    updateBooleanArray("checkin_evaluation", checked)
                  }
                />
                <Label htmlFor="checkin_evaluation" className="text-sm font-medium text-gray-700 dark:text-gray-300">Check-in Evaluation</Label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 min-w-[200px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Prediction"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Prediction Results */}
      {predictionMade && (
        <div className="space-y-6">
          <PredictionDisplay
            probabilities={probabilities}
            prediction={prediction}
            predicted_income_production={predictedIncomeProduction}
          />

          <FeatureContributionsChart contributions={contributions} />
        </div>
      )}

      {!predictionMade && !loading && (
        <Card className="bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800">
          <CardContent className="text-center py-12">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full w-fit mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">
              Ready to Generate Prediction
            </h3>
            <p className="text-orange-700 dark:text-orange-300">
              Fill in the form above and click "Generate Prediction" to see AI-powered results and feature contributions
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
