import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
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

const PartialDependencePlot: React.FC = () => {
  const [model, setModel] = useState<string>("year1_classification");
  const [feature, setFeature] = useState("Land_size_for_Crop_Agriculture_Acres");
  const [gridValues, setGridValues] = useState<number[]>([]);
  const [averages, setAverages] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCategorical, setIsCategorical] = useState<boolean>(false);
  const numericalFeatureList = [
    ["Land_size_for_Crop_Agriculture_Acres", "Agriculture land size (acres)"],
    ["farm_implements_owned", "Farm implements owned"],
    ["tot_hhmembers", "Household members"],
    [
      "Distance_travelled_one_way_OPD_treatment",
      "Distance travelled to OPD treatment (one way)",
    ],
    ["Average_Water_Consumed_Per_Day", "Average water consumed per day"],
    ["hh_water_collection_Minutes", "Water collection time (minutes)"],
    ["composts_num", "Number of composts"],
    ["education_level_encoded", "Education level"],
  ];

  const categoricalFeatureList = [
    ["vsla_participation", "VSLA participation"],
    ["ground_nuts", "Groundnuts"],
    ["perennial_crops_grown_food_banana", "Food banana"],
    ["sweet_potatoes", "Sweet potatoes"],
    ["perennial_crops_grown_coffee", "Coffee"],
    ["irish_potatoes", "Irish potatoes"],
    ["business_participation", "Business participation"],
    ["cassava", "Cassava"],
    ["hh_produce_lq_manure", "Manure"],
    ["hh_produce_organics", "Organics"],
    ["maize", "Maize"],
    ["sorghum", "Sorghum"],
  ]


  // sortted combined list  
  const featureList = [...categoricalFeatureList, ...numericalFeatureList].sort((a, b) => a[0].localeCompare(b[0]));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Determine if the feature is categorical directly here
        const isFeatureCategorical = categoricalFeatureList.some(item => item[0] === feature);
        setIsCategorical(isFeatureCategorical);
        
        console.log(`Fetching PDP data for model: ${model}, feature: ${feature}, type: ${isFeatureCategorical ? "categorical" : "numerical"}`);
        
        const response = await fetch(
          `/api/get-pdp/?model=${model}&feature=${feature}&type=${isFeatureCategorical ? "categorical" : "numerical"}`
        );
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const result = await response.json();
        console.log("PDP data:", result);
        
        if (!result.data || !result.data.x || !result.data.y) {
          throw new Error("Invalid data format returned from API");
        }
        
        setGridValues(result.data.x);
        setAverages(result.data.y);
      } catch (error) {
        console.error("Error fetching partial dependence data:", error);
        setError(error instanceof Error ? error.message : "Failed to load partial dependence data");
        setGridValues([]);
        setAverages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [model, feature]);

  const renderContent = (isCategorical: boolean) => {
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

    if (gridValues.length === 0 || averages.length === 0) {
      return (
        <Box sx={{ p: 2 }}>
          <Alert severity="info">No partial dependence data available for this model and feature.</Alert>
        </Box>
      );
    }

    return (
      isCategorical ? (
        <Plot
          data={gridValues.map((value, index) => ({
            type: 'bar',
            x: [value],
            y: [averages[index]],
            name: index === 0 ? "No" : "Yes",
            marker: {
              color: index === 0 ? '#1C2434' : '#ea580c', // Set colors for bars
            }
          }))}
          layout={{
            title: '',
            autosize: true,
            margin: {
              l: 50,
              r: 50,
              t: 10,
              b: 50
            },
            xaxis: {
              title: featureList.find(item => item[0] === feature)?.[1] || feature,
              automargin: true
            },
            yaxis: {
              title: 'Average Probability',
              automargin: true
            },
            font: {
              family: 'Arial, sans-serif'
            },
            barmode: 'group', // Group bars for categorical features
            legend: {
              orientation: 'h', // Horizontal orientation
              yanchor: 'bottom', // Anchor to the bottom
              y: -0.3, // Position below the chart
              xanchor: 'center', // Center the legend
              x: 0.5 // Center the legend horizontally
            }
          }}
          config={{
            responsive: true,
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['lasso2d', 'select2d']
          }}
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <Plot
        data={[
          {
            type: 'scatter',
            mode: 'lines+markers',
            x: gridValues,
            y: averages,
            line: {
              color: '#ea580c',
              width: 2
            },
            marker: {
              color: '#ea580c',
              size: 6
            }
          }
        ]}
        layout={{
          title: '',
          autosize: true,
          margin: {
            l: 50,
            r: 30,
            t: 10,
            b: 50
          },
          xaxis: {
            title: featureList.find(item => item[0] === feature)?.[1] || feature,
            automargin: true
          },
          yaxis: {
            title: 'Average Probability',
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
        style={{ width: '100%', height: '100%' }}
      />
      )
    );
  };

  

  return (
    <Card sx={{ width: '100%', boxShadow: 2 }}>
      <CardHeader 
        title="Partial Dependence" 
        subheader="How does the prediction change if you change one feature?"
        sx={{ 
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
          backgroundImage: 'linear-gradient(to right, #e5e7eb, #d1d5db)',
          padding: 3
        }}
      />
      <CardContent>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="model-select-label">Model</InputLabel>
              <Select
                labelId="model-select-label"
                id="model-select"
                value={model}
                label="Model"
                onChange={(e) => setModel(e.target.value)}
              >
                <MenuItem value="year1_classification">Year 1 Classification</MenuItem>
                {/* <MenuItem value="year2_classification">Year 2 Classification</MenuItem> */}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="feature-select-label">Feature</InputLabel>
              <Select
                labelId="feature-select-label"
                id="feature-select"
                value={feature}
                label="Feature"
                onChange={(e) => setFeature(e.target.value)}
              >
                {featureList.map((featureItem) => (
                  <MenuItem key={featureItem[0]} value={featureItem[0]}>
                    {featureItem[1]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Box sx={{ height: 400, width: '100%' }}>
          {renderContent(isCategorical)}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PartialDependencePlot;
