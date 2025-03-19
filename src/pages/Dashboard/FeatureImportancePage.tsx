import FeatureImportanceChart from "../../components/Charts/FeatureImportanceChart";
import VariableDescriptions from "../../components/Tables/FeatureDescriptions";
import PartialDependencePlot from "../../components/Charts/PartialDependencePlot";
import { Grid, Box, Typography } from "@mui/material";
import TwoWayPartialDependenceHeatMap from "../../components/Charts/TwoWayPartialDependenceHeatMap";
const FeatureImportance: React.FC = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 'bold' }}>
        Feature Importance
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <VariableDescriptions variables={[]} />
        </Grid>
        
        <Grid item xs={12}>
          <FeatureImportanceChart featureNames={[]} importances={[]} />
        </Grid>
        
        <Grid item xs={12}>
          <PartialDependencePlot />
        </Grid>

        <Grid item xs={12}>
          <TwoWayPartialDependenceHeatMap />
        </Grid>
      </Grid>
    </Box>
  );
};

export default FeatureImportance;
