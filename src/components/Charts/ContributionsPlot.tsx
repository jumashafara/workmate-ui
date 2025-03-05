import React, { useEffect, useState } from "react";
import Plot from 'react-plotly.js';
import { Card, CardHeader, CardContent, Typography, Box, useTheme } from "@mui/material";

interface FeatureContributionsChartProps {
  contributions: Record<string, number>;
}

const featureLabelMap: Record<string, string> = {
  perennial_crops_grown_food_banana: "Food Banana",
  perennial_crops_grown_coffee: "Coffee",
  Land_size_for_Crop_Agriculture_Acres: "Agric Land Size (Acres)",
  ground_nuts: "Ground Nuts",
  business_participation: "Business Participation",
  irish_potatoes: "Irish Potatoes",
  sweet_potatoes: "Sweet Potatoes",
  tot_hhmembers: "Total Household Members",
  vsla_participation: "VSLA Participation",
  Distance_travelled_one_way_OPD_treatment: "Distance to OPD (One-Way)",
  cassava: "Cassava",
  hh_water_collection_Minutes: "Water Collection Time (Min)",
  Average_Water_Consumed_Per_Day: "Avg. Water Consumption (Per Day)",
  farm_implements_owned: "Farm Implements Owned",
  composts_num: "Composts",
  hh_produce_lq_manure: "Liquid Manure Production",
  maize: "Maize Production",
  hh_produce_organics: "Organics Production",
  sorghum: "Sorghum Production",
  education_level_encoded: "Education Level",
  soap_ash_present: "Soap & Ash Available",
  non_bio_waste_mgt_present: "Non-Bio Waste Management",
  tippy_tap_present: "Tippy Tap Availability",
  hhh_sex: "Household Head Gender",
};

const FeatureContributionsChart: React.FC<FeatureContributionsChartProps> = ({
  contributions,
}) => {
  const theme = useTheme();
  const [plotData, setPlotData] = useState<any[]>([]);
  const [layout, setLayout] = useState<any>({});

  useEffect(() => {
    if (!contributions || Object.keys(contributions).length === 0) {
      return;
    }

    const featureEntries = Object.entries(contributions)
      .map(([key, value]) => [featureLabelMap[key] || key, Number(value)])
      .sort((a, b) => Math.abs(Number(b[1])) - Math.abs(Number(a[1])));

    const featureNames = featureEntries.map(([key]) => key);
    const featureValues = featureEntries.map(([, value]) => Number(value));

    // Create colors array based on positive/negative values
    const colors = featureValues.map((value) =>
      value >= 0 ? '#EA580C' : '#374151'
    );

    // Set up the plot data
    setPlotData([
      {
        type: 'bar',
        orientation: 'h',
        x: featureValues,
        y: featureNames,
        marker: {
          color: colors
        },
        text: featureValues.map(val => val.toFixed(2)),
        textposition: 'auto',
        hoverinfo: 'x+y',
        name: 'Feature Contribution'
      }
    ]);

    // Set up the layout
    setLayout({
      title: {
        text: '',
        font: {
          family: theme.typography.fontFamily,
          size: 18
        }
      },
      autosize: true,
      height: 500,
      margin: {
        l: 150, // Increased left margin for feature names
        r: 30,
        t: 30,
        b: 80
      },
      xaxis: {
        title: {
          text: 'Contribution Score',
          font: {
            family: theme.typography.fontFamily,
            size: 14
          }
        },
        gridcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
      },
      yaxis: {
        automargin: true,
        tickfont: {
          family: theme.typography.fontFamily,
          size: 12
        }
      },
      plot_bgcolor: theme.palette.mode === 'dark' ? '#1C2434' : '#FFFFFF',
      paper_bgcolor: theme.palette.mode === 'dark' ? '#1C2434' : '#FFFFFF',
      font: {
        family: theme.typography.fontFamily,
        color: theme.palette.text.primary
      }
    });
  }, [contributions, theme]);

  // If no contributions data, show a message
  if (!contributions || Object.keys(contributions).length === 0) {
    return (
      <Card sx={{ width: '100%', boxShadow: 2, mb: 3 }}>
        <CardHeader
          title="Feature Contributions"
          subheader="How has each feature contributed to the prediction?"
          sx={{ 
            backgroundImage: 'linear-gradient(to right, #e5e7eb, #d1d5db)',
            padding: 3
          }}
        />
        <CardContent>
          <Typography variant="body1" align="center" sx={{ py: 10 }}>
            No feature contribution data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ width: '100%', boxShadow: 2, mb: 3 }}>
      <CardHeader
        title="Feature Contributions"
        subheader="How has each feature contributed to the prediction?"
        sx={{ 
          backgroundImage: 'linear-gradient(to right, #e5e7eb, #d1d5db)',
          padding: 3
        }}
      />
      <CardContent>
        <Box sx={{ height: 500, width: '100%' }}>
          <Plot
            data={plotData}
            layout={layout}
            config={{
              displayModeBar: true,
              responsive: true,
              modeBarButtonsToRemove: ['lasso2d', 'select2d']
            }}
            style={{ width: '100%', height: '100%' }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default FeatureContributionsChart;
