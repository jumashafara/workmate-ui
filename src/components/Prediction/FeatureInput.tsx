import React from "react";
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
  FormGroup,
  Divider,
  Paper
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

  // Section component for consistent styling
  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#EA580C', fontWeight: 'bold', mb: 2 }}>
        {title}
      </Typography>
      {children}
    </Paper>
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
            
            {/* Group 1: Household Identification */}
            <Grid item xs={12}>
              <Section title="Household Identification">
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <FormLabel>Cohort</FormLabel>
                      <input
                            placeholder="eg 2024"
                        value={formData.cohort}
                        required
                        onChange={(e) => {
                          setCohort(e.target.value);
                    setFormData({
                      ...formData,
                            cohort: e.target.value,
                          });
                        }}
                        className="p-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all dark:bg-gray-800 dark:text-gray-200"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <FormLabel>Cycle</FormLabel>
                      <input
                        placeholder="eg A"
                        value={formData.cycle}
                        required
                        onChange={(e) => {
                          setCycle(e.target.value);
                          setFormData({
                            ...formData,
                            cycle: e.target.value,
                          });
                        }}
                        className="p-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all dark:bg-gray-800 dark:text-gray-200"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <FormLabel>Evaluation Month</FormLabel>
                      <input
                        type="number"
                        min={1}
                        max={12}
                        value={formData.evaluation_month}
                        required
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
                  </Grid>
                </Grid>
                
                <FormControl fullWidth sx={{ mt: 1 }}>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={formData.standard_evaluation[0]}
                          onChange={(e) => {
                            setStandardEvaluation(e.target.checked);
                    setFormData({
                      ...formData,
                              standard_evaluation: [e.target.checked],
                            });
                          }}
                          color="primary"
                        />
                      }
                      label="Standard Evaluation"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={formData.checkin_evaluation[0]}
                          onChange={(e) => {
                            setCheckinEvaluation(e.target.checked);
                    setFormData({
                      ...formData,
                              checkin_evaluation: [e.target.checked],
                            });
                          }}
                          color="primary"
                        />
                      }
                      label="Check-in Evaluation"
                    />
                  </FormGroup>
                </FormControl>
              </Section>
            </Grid>
            
            {/* Group 2: Location Information */}
            <Grid item xs={12}>
              <Section title="Location Information">
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <FormLabel>Region</FormLabel>
                      <input
                        placeholder="eg Central"
                        value={formData.region}
                        required
                        onChange={(e) => {
                          setRegion(e.target.value);
                          setFormData({
                            ...formData,
                            region: e.target.value,
                          });
                        }}
                        className="p-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all dark:bg-gray-800 dark:text-gray-200"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <FormLabel>District</FormLabel>
                      <input
                        placeholder="eg Kaliro"
                        value={formData.district}
                        required
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
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <FormLabel>Cluster</FormLabel>
                      <input
                        placeholder="eg Mitooma"
                        value={formData.cluster}
                        required
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
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <FormLabel>Village</FormLabel>
                  <input
                        placeholder="eg Buyunga"
                          value={formData.village}
                        required
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
                  </Grid>
                </Grid>
              </Section>
            </Grid>
            
            {/* Group 3: Household Characteristics */}
            <Grid item xs={12} md={6}>
              <Section title="Household Characteristics">
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <FormLabel>
                    Household Members ({formData.tot_hhmembers[0]})
                  </FormLabel>
                  <Slider
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
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <FormLabel>
                    Education Level ({formData.education_level_encoded[0]})
                  </FormLabel>
                  <Slider
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
                    marks={[
                      { value: 0, label: 'None' },
                      { value: 1, label: 'Primary' },
                      { value: 2, label: 'Secondary' },
                      { value: 3, label: 'Tertiary' }
                    ]}
                  />
                </FormControl>
                
                <FormControl fullWidth>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formData.hhh_sex[0]}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                            hhh_sex: [e.target.checked],
                      });
                    }}
                        color="primary"
                      />
                    }
                    label="Household Head is Male"
                  />
                </FormControl>
              </Section>
            </Grid>
            
            {/* Group 4: Agriculture & Land */}
            <Grid item xs={12} md={6}>
              <Section title="Agriculture & Land">
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <FormLabel>
                    Agriculture Land ({formData.Land_size_for_Crop_Agriculture_Acres[0]} acres)
                  </FormLabel>
                  <Slider
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
                  <FormLabel>
                    Farm Implements ({formData.farm_implements_owned[0]})
                  </FormLabel>
                  <Slider
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
                  <FormLabel>
                    Composts Number ({formData.composts_num[0]})
                  </FormLabel>
                  <Slider
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
              </Section>
            </Grid>
            
            {/* Group 5: Water & Health */}
            <Grid item xs={12} md={6}>
              <Section title="Water & Health">
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <FormLabel>
                    Water Consumption ({formData.Average_Water_Consumed_Per_Day[0]} liters)
                  </FormLabel>
                  <Slider
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
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <FormLabel>
                    Water Collection Time ({formData.hh_water_collection_Minutes[0]} minutes)
                  </FormLabel>
                  <Slider
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
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <FormLabel>
                    Distance to OPD ({formData.Distance_travelled_one_way_OPD_treatment[0]} km)
                  </FormLabel>
                  <Slider
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
              </Section>
            </Grid>
            
            {/* Group 6: Sanitation & Hygiene */}
            <Grid item xs={12} md={6}>
              <Section title="Sanitation & Hygiene">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={formData.tippy_tap_present[0]}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              tippy_tap_present: [e.target.checked],
                            });
                          }}
                          color="primary"
                        />
                      }
                      label="Tippy Tap Present"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={formData.non_bio_waste_mgt_present[0]}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              non_bio_waste_mgt_present: [e.target.checked],
                            });
                          }}
                          color="primary"
                        />
                      }
                      label="Non-Bio Waste Management Present"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={formData.soap_ash_present[0]}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              soap_ash_present: [e.target.checked],
                            });
                          }}
                          color="primary"
                        />
                      }
                      label="Soap/Ash Present"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={formData.hh_produce_organics[0]}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                              hh_produce_organics: [e.target.checked],
                      });
                    }}
                          color="primary"
                        />
                      }
                      label="Household Produces Organics"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={formData.hh_produce_lq_manure[0]}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                              hh_produce_lq_manure: [e.target.checked],
                      });
                    }}
                          color="primary"
                        />
                      }
                      label="Household Produces Liquid Manure"
                    />
                  </Grid>
                </Grid>
              </Section>
            </Grid>
            
            {/* Group 7: Crops & Business */}
            <Grid item xs={12}>
              <Section title="Crops & Business">
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={4} md={3} lg={2}>
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
                  <Grid item xs={6} sm={4} md={3} lg={2}>
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
                  <Grid item xs={6} sm={4} md={3} lg={2}>
                    <FeatureCheckbox
                      label="Cassava"
                      checked={formData.cassava[0]}
                      onChange={(checked) =>
                        setFormData({ ...formData, cassava: [checked] })
                      }
                    />
                  </Grid>
                  <Grid item xs={6} sm={4} md={3} lg={2}>
                    <FeatureCheckbox
                      label="Ground Nuts"
                      checked={formData.ground_nuts[0]}
                      onChange={(checked) =>
                        setFormData({ ...formData, ground_nuts: [checked] })
                      }
                    />
                  </Grid>
                  <Grid item xs={6} sm={4} md={3} lg={2}>
                    <FeatureCheckbox
                      label="Sweet Potatoes"
                      checked={formData.sweet_potatoes[0]}
                      onChange={(checked) =>
                        setFormData({ ...formData, sweet_potatoes: [checked] })
                      }
                    />
                  </Grid>
                  <Grid item xs={6} sm={4} md={3} lg={2}>
                    <FeatureCheckbox
                      label="Irish Potatoes"
                      checked={formData.irish_potatoes[0]}
                      onChange={(checked) =>
                        setFormData({ ...formData, irish_potatoes: [checked] })
                      }
                    />
                  </Grid>
                  <Grid item xs={6} sm={4} md={3} lg={2}>
                    <FeatureCheckbox
                      label="Maize"
                      checked={formData.maize[0]}
                      onChange={(checked) =>
                        setFormData({ ...formData, maize: [checked] })
                      }
                    />
                  </Grid>
                  <Grid item xs={6} sm={4} md={3} lg={2}>
                    <FeatureCheckbox
                      label="Sorghum"
                      checked={formData.sorghum[0]}
                      onChange={(checked) =>
                        setFormData({ ...formData, sorghum: [checked] })
                      }
                    />
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={4} md={3} lg={2}>
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
                  <Grid item xs={6} sm={4} md={3} lg={2}>
                    <FeatureCheckbox
                      label="VSLA Participation"
                      checked={formData.vsla_participation[0]}
                      onChange={(checked) =>
                        setFormData({ ...formData, vsla_participation: [checked] })
                      }
                    />
                  </Grid>
                </Grid>
              </Section>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FeatureInput;
