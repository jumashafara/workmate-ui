import React from "react";
import PieChart from "../Charts/PieChart";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Grid 
} from "@mui/material";

interface PredictionDisplayProps {
  probabilities: number[];
  prediction: number;
  predicted_income_production: number;
}

const PredictionDisplay: React.FC<PredictionDisplayProps> = ({
  probabilities,
  prediction,
  predicted_income_production,
}) => {
  return (
    <Card sx={{ width: '100%', boxShadow: 2 }}>
      <CardHeader 
        title="Prediction" 
        subheader="What are the chances of achieving the target?"
        sx={{ 
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
          backgroundImage: 'linear-gradient(to right, #e5e7eb, #d1d5db)',
          padding: 3
        }}
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TableContainer component={Paper} elevation={0}>
              <Table aria-label="prediction results table">
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>Probability</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Achieving</TableCell>
                    <TableCell>{probabilities[0].toFixed(3)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Not Achieving</TableCell>
                    <TableCell>{probabilities[1].toFixed(3)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Predicted</TableCell>
                    <TableCell>{prediction === 1 ? "Not Achieved" : "Achieved"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Predicted Income Production</TableCell>
                    <TableCell>{predicted_income_production.toFixed(3)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <PieChart data={probabilities} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PredictionDisplay;
