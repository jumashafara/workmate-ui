import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { Card, CardHeader, CardContent, Box, Typography, Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert } from "@mui/material";

interface FeatureImportanceChartProps {
  featureNames?: string[];
  importances?: number[];
}

const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({ featureNames: propFeatureNames, importances: propImportances }) => {
  const [featureNames, setFeatureName] = useState<string[]>(propFeatureNames || []);
  const [importances, setImportances] = useState<number[]>(propImportances || []);
  const [model, setModel] = useState<string>("year1_classification");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getFeatureImportances = async (model: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/models/feature-importances/?model=${model}`
      );
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Feature importances data:", data);
      
      if (!data.feature_importances) {
        throw new Error("No feature importances data returned from API");
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching feature importances:", error);
      setError(error instanceof Error ? error.message : "Failed to load feature importances");
      return { feature_importances: {} };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!propFeatureNames || !propImportances || propFeatureNames.length === 0 || propImportances.length === 0) {
      getFeatureImportances(model).then((data) => {
        if (data && data.feature_importances) {
          const features = Object.keys(data.feature_importances);
          const importances = Object.values(data.feature_importances) as number[];
          setFeatureName(features);
          setImportances(importances);
        }
      });
    } else {
      setFeatureName(propFeatureNames);
      setImportances(propImportances);
      setLoading(false);
    }
  }, [model, propFeatureNames, propImportances]);

  // Sort features by importance
  const sortedData = featureNames.map((name, index) => ({
    name,
    importance: importances[index] || 0
  })).sort((a, b) => b.importance - a.importance);

  const sortedFeatureNames = sortedData.map(item => item.name);
  const sortedImportances = sortedData.map(item => item.importance);

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

    if (sortedFeatureNames.length === 0 || sortedImportances.length === 0) {
      return (
        <Box sx={{ p: 2 }}>
          <Alert severity="info">No feature importance data available for this model.</Alert>
        </Box>
      );
    }

    return (
      <Plot
        data={[
          {
            type: 'bar',
            x: sortedImportances,
            y: sortedFeatureNames,
            orientation: 'h',
            marker: {
              color: '#ea580c'
            }
          }
        ]}
        layout={{
          title: '',
          autosize: true,
          margin: {
            l: 150, // Increased left margin for feature names
            r: 30,
            t: 10,
            b: 50
          },
          xaxis: {
            title: 'Importance',
            automargin: true
          },
          yaxis: {
            title: 'Features',
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
    );
  };

  return (
    <Card sx={{ width: '100%', boxShadow: 2 }}>
      <CardHeader 
        title="Feature Importance Chart" 
        subheader="What were the most important features?"
        sx={{ 
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
          backgroundImage: 'linear-gradient(to right, #e5e7eb, #d1d5db)',
          padding: 3
        }}
        action={
          <FormControl sx={{ minWidth: 200, mt: 1 }}>
            <InputLabel id="model-select-label">Model</InputLabel>
            <Select
              labelId="model-select-label"
              id="model-select"
              value={model}
              label="Model"
              onChange={(e) => setModel(e.target.value)}
            >
              <MenuItem value="year1_classification">Year 1 Classification</MenuItem>
              <MenuItem value="year2_classification">Year 2 Classification</MenuItem>
            </Select>
          </FormControl>
        }
      />
      <CardContent>
        <Box sx={{ height: 400, width: '100%' }}>
          {renderContent()}
        </Box>
      </CardContent>
    </Card>
  );
};

export default FeatureImportanceChart;
