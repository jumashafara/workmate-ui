// this component is used to display the two way partial dependence heat map using plotly

import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Grid,
  CircularProgress,
  Alert
} from "@mui/material";
import { fetch2DPartialDependence } from '../../api/ModelMetrics';

interface TwoWayPartialDependenceHeatMapProps {
  defaultModel?: string;
  defaultFeature1?: string;
  defaultFeature2?: string;
}

const TwoWayPartialDependenceHeatMap: React.FC<TwoWayPartialDependenceHeatMapProps> = ({
  defaultModel = "year1_classification",
  defaultFeature1 = "farm_implements_owned",
  defaultFeature2 = "tot_hhmembers"
}) => {
  const [model, setModel] = useState<string>(defaultModel);
  const [feature1, setFeature1] = useState<string>(defaultFeature1);
  const [feature2, setFeature2] = useState<string>(defaultFeature2);
  const [pdpData, setPdpData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const featureList = [
    ["Land_size_for_Crop_Agriculture_Acres", "Agriculture land size (acres)"],
    ["farm_implements_owned", "Farm implements owned"],
    ["tot_hhmembers", "Household members"],
    ["Distance_travelled_one_way_OPD_treatment", "Distance travelled to OPD treatment (one way)"],
    ["Average_Water_Consumed_Per_Day", "Average water consumed per day"],
    ["hh_water_collection_Minutes", "Water collection time (minutes)"],
    ["composts_num", "Number of composts"],
    // ["education_level_encoded", "Education level"],
    // ["vsla_participation", "VSLA participation"],
    // ["ground_nuts", "Groundnuts"],
    // ["perennial_crops_grown_food_banana", "Food banana"],
    // ["sweet_potatoes", "Sweet potatoes"],
    // ["perennial_crops_grown_coffee", "Coffee"],
    // ["irish_potatoes", "Irish potatoes"],
    // ["business_participation", "Business participation"],
    // ["cassava", "Cassava"],
    // ["hh_produce_lq_manure", "Manure"],
    // ["hh_produce_organics", "Organics"],
    // ["maize", "Maize"],
    // ["sorghum", "Sorghum"],
  ].sort((a, b) => a[1].localeCompare(b[1]));

  useEffect(() => {
    const loadPdpData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetch2DPartialDependence(model, feature1, feature2);
        setPdpData(data);
        console.log('pdp data x', data.z);
      } catch (error) {
        console.error("Error loading 2D PDP data:", error);
        setError(error instanceof Error ? error.message : "Failed to load 2D PDP data");
      } finally {
        setLoading(false);
      }
    };

    loadPdpData();
  }, [model, feature1, feature2]);

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ p: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      );
    }

    // if (!pdpData || !pdpData.x || !pdpData.y || !pdpData.z) {
    //   return (
    //     <Box sx={{ p: 2 }}>
    //       <Alert severity="info">No 2D partial dependence data available for these features.</Alert>
    //     </Box>
    //   );
    // }

    // Get feature display names
    const feature1Display = featureList.find(f => f[0] === feature1)?.[1] || feature1;
    const feature2Display = featureList.find(f => f[0] === feature2)?.[1] || feature2;

    return (
      <Plot
        data={[
          {
            type: 'heatmap',
            x: pdpData.x,
            y: pdpData.y,
            z: pdpData.z,
            colorscale: 'YlOrRd',
            colorbar: {
              title: 'Predicted Value',
              titleside: 'right',
            },
          }
        ]}
        layout={{
          title: '',
          autosize: true,
          margin: {
            l: 70,
            r: 70,
            t: 30,
            b: 70
          },
          xaxis: {
            title: feature1Display,
            automargin: true
          },
          yaxis: {
            title: feature2Display,
            automargin: true
          },
          font: {
            family: 'Arial, sans-serif'
          }
        }}
        config={{
          responsive: true,
          displayModeBar: true,
          displaylogo: false,
          modeBarButtonsToRemove: ['lasso2d', 'select2d']
        }}
        style={{ width: '100%', height: '400px' }}
      />
    );
  };

  return (
    <Card sx={{ width: '100%', boxShadow: 2 }}>
      <CardHeader 
        title="Two-Way Partial Dependence" 
        subheader="How does the prediction change when two features interact?"
        sx={{ 
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
          backgroundImage: 'linear-gradient(to right, #e5e7eb, #d1d5db)',
          padding: 3
        }}
      />
      <CardContent>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="model-select-label">Model</InputLabel>
              <Select
                labelId="model-select-label"
                id="model-select"
                value={model}
                label="Model"
                onChange={(e) => setModel(e.target.value as string)}
              >
                <MenuItem value="year1_classification">Year 1 Classification</MenuItem>
                <MenuItem value="year2_classification">Year 2 Classification</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="feature1-select-label">Feature 1</InputLabel>
              <Select
                labelId="feature1-select-label"
                id="feature1-select"
                value={feature1}
                label="Feature 1"
                onChange={(e) => setFeature1(e.target.value as string)}
              >
                {featureList.map(([value, label]) => (
                  <MenuItem key={value} value={value}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="feature2-select-label">Feature 2</InputLabel>
              <Select
                labelId="feature2-select-label"
                id="feature2-select"
                value={feature2}
                label="Feature 2"
                onChange={(e) => setFeature2(e.target.value as string)}
              >
                {featureList.map(([value, label]) => (
                  <MenuItem key={value} value={value}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <div className="w-full h-[400px] pb-12">
          {renderContent()}
        </div>
      </CardContent>
    </Card>
  );
};

export default TwoWayPartialDependenceHeatMap;
