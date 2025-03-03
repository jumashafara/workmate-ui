import React from "react";
import CheckboxTwo from "../Checkboxes/CheckboxTwo";
import { Features } from "../../types/features";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Grid, 
  FormControl, 
  FormLabel, 
  Slider, 
  Box, 
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup
} from "@mui/material";

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
  },
}) => {
  // Custom MUI checkbox component to replace CheckboxTwo
  const FeatureCheckbox = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (checked: boolean) => void }) => (
    <FormControlLabel
      control={
        <Checkbox 
          checked={checked} 
          onChange={(e) => onChange(e.target.checked)}
          color="primary"
        />
      }
      label={label}
    />
  );

  return (
    <Card sx={{ width: '100%', boxShadow: 2, mt: 3 }}>
      <CardHeader 
        title="Feature Input" 
        subheader="Adjust features to update the prediction"
        sx={{ 
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
          backgroundImage: 'linear-gradient(to right, #e5e7eb, #d1d5db)',
          padding: 3
        }}
      />
      <CardContent>
        <Box component="form" sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {/* Checkboxes */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Crop & Business Features</Typography>
              <FormGroup>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4} lg={2.4}>
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
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <FeatureCheckbox
                      label="Ground Nuts"
                      checked={formData.ground_nuts[0]}
                      onChange={(checked) =>
                        setFormData({ ...formData, ground_nuts: [checked] })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <FeatureCheckbox
                      label="Sweet Potatoes"
                      checked={formData.sweet_potatoes[0]}
                      onChange={(checked) =>
                        setFormData({ ...formData, sweet_potatoes: [checked] })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <FeatureCheckbox
                      label="Cassava"
                      checked={formData.cassava[0]}
                      onChange={(checked) =>
                        setFormData({ ...formData, cassava: [checked] })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={2.4}>
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
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={2.4}>
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
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <FeatureCheckbox
                      label="Sorghum"
                      checked={formData.sorghum[0]}
                      onChange={(checked) =>
                        setFormData({ ...formData, sorghum: [checked] })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <FeatureCheckbox
                      label="Tippy Tap"
                      checked={formData.tippy_tap_present[0]}
                      onChange={(checked) =>
                        setFormData({ ...formData, tippy_tap_present: [checked] })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={2.4}>
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
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={2.4}>
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
                  </Grid>
                </Grid>
              </FormGroup>
            </Grid>

            {/* Sliders */}
            <Grid item xs={12} container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Land & Household</Typography>
                <Box sx={{ mb: 4 }}>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <FormLabel id="agriculture-land-slider-label">
                      Agriculture Land ({formData.Land_size_for_Crop_Agriculture_Acres[0]} acres)
                    </FormLabel>
                    <Slider
                      aria-labelledby="agriculture-land-slider-label"
                      min={0.1}
                      max={10}
                      step={0.1}
                      value={formData.Land_size_for_Crop_Agriculture_Acres[0]}
                      onChange={(e, value) => {
                        const newValue = typeof value === 'number' ? value : value[0];
                        setLand(newValue);
                        setFormData({
                          ...formData,
                          Land_size_for_Crop_Agriculture_Acres: [newValue],
                        });
                      }}
                      valueLabelDisplay="auto"
                    />
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <FormLabel id="household-members-slider-label">
                      Household Members ({formData.tot_hhmembers[0]})
                    </FormLabel>
                    <Slider
                      aria-labelledby="household-members-slider-label"
                      min={1}
                      max={15}
                      step={1}
                      value={formData.tot_hhmembers[0]}
                      onChange={(e, value) => {
                        const newValue = typeof value === 'number' ? value : value[0];
                        setMember(newValue);
                        setFormData({
                          ...formData,
                          tot_hhmembers: [newValue],
                        });
                      }}
                      valueLabelDisplay="auto"
                    />
                  </FormControl>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Farm & Water</Typography>
                <Box sx={{ mb: 4 }}>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <FormLabel id="farm-implements-slider-label">
                      Farm Implements ({formData.farm_implements_owned[0]})
                    </FormLabel>
                    <Slider
                      aria-labelledby="farm-implements-slider-label"
                      min={0}
                      max={10}
                      step={1}
                      value={formData.farm_implements_owned[0]}
                      onChange={(e, value) => {
                        const newValue = typeof value === 'number' ? value : value[0];
                        setFarmImplements(newValue);
                        setFormData({
                          ...formData,
                          farm_implements_owned: [newValue],
                        });
                      }}
                      valueLabelDisplay="auto"
                    />
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <FormLabel id="water-consumption-slider-label">
                      Water Consumption ({formData.Average_Water_Consumed_Per_Day[0]} liters)
                    </FormLabel>
                    <Slider
                      aria-labelledby="water-consumption-slider-label"
                      min={0}
                      max={100}
                      step={1}
                      value={formData.Average_Water_Consumed_Per_Day[0]}
                      onChange={(e, value) => {
                        const newValue = typeof value === 'number' ? value : value[0];
                        setWater(newValue);
                        setFormData({
                          ...formData,
                          Average_Water_Consumed_Per_Day: [newValue],
                        });
                      }}
                      valueLabelDisplay="auto"
                    />
                  </FormControl>
                </Box>
              </Grid>
            </Grid>

            <Grid item xs={12} container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Distance & Time</Typography>
                <Box sx={{ mb: 4 }}>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <FormLabel id="distance-to-opd-slider-label">
                      Distance to OPD ({formData.Distance_travelled_one_way_OPD_treatment[0]} km)
                    </FormLabel>
                    <Slider
                      aria-labelledby="distance-to-opd-slider-label"
                      min={0}
                      max={50}
                      step={0.1}
                      value={formData.Distance_travelled_one_way_OPD_treatment[0]}
                      onChange={(e, value) => {
                        const newValue = typeof value === 'number' ? value : value[0];
                        setDistanceToOPD(newValue);
                        setFormData({
                          ...formData,
                          Distance_travelled_one_way_OPD_treatment: [newValue],
                        });
                      }}
                      valueLabelDisplay="auto"
                    />
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <FormLabel id="water-collection-time-slider-label">
                      Water Collection Time ({formData.hh_water_collection_Minutes[0]} minutes)
                    </FormLabel>
                    <Slider
                      aria-labelledby="water-collection-time-slider-label"
                      min={0}
                      max={180}
                      step={1}
                      value={formData.hh_water_collection_Minutes[0]}
                      onChange={(e, value) => {
                        const newValue = typeof value === 'number' ? value : value[0];
                        setWaterCollectionTime(newValue);
                        setFormData({
                          ...formData,
                          hh_water_collection_Minutes: [newValue],
                        });
                      }}
                      valueLabelDisplay="auto"
                    />
                  </FormControl>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Compost & Education</Typography>
                <Box sx={{ mb: 4 }}>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <FormLabel id="composts-number-slider-label">
                      Composts Number ({formData.composts_num[0]})
                    </FormLabel>
                    <Slider
                      aria-labelledby="composts-number-slider-label"
                      min={0}
                      max={10}
                      step={1}
                      value={formData.composts_num[0]}
                      onChange={(e, value) => {
                        const newValue = typeof value === 'number' ? value : value[0];
                        setCompostsNum(newValue);
                        setFormData({
                          ...formData,
                          composts_num: [newValue],
                        });
                      }}
                      valueLabelDisplay="auto"
                    />
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <FormLabel id="education-level-slider-label">
                      Education Level ({formData.education_level_encoded[0]})
                    </FormLabel>
                    <Slider
                      aria-labelledby="education-level-slider-label"
                      min={0}
                      max={3}
                      step={1}
                      value={formData.education_level_encoded[0]}
                      onChange={(e, value) => {
                        const newValue = typeof value === 'number' ? value : value[0];
                        setEducationLevel(newValue);
                        setFormData({
                          ...formData,
                          education_level_encoded: [newValue],
                        });
                      }}
                      valueLabelDisplay="auto"
                    />
                  </FormControl>
                </Box>
              </Grid>
            </Grid>

            <Grid item xs={12} container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Location</Typography>
                <Box sx={{ mb: 4 }}>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <FormLabel id="district-input-label">District</FormLabel>
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
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <FormLabel id="village-input-label">Village</FormLabel>
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
                  </FormControl>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Cluster & Evaluation</Typography>
                <Box sx={{ mb: 4 }}>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <FormLabel id="cluster-input-label">Cluster</FormLabel>
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
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <FormLabel id="evaluation-month-input-label">Evaluation Month</FormLabel>
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
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FeatureInput;
