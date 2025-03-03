import React from "react";
import { ClassificationMetricsProps } from "../../types/modelmetrics";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper 
} from "@mui/material";

interface ClassificationModelMetrics {
  model_metrics: ClassificationMetricsProps | null;
}

const ClassificationModelStatsTable: React.FC<ClassificationModelMetrics> = ({
  model_metrics,
}) => {
  return (
    <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
      <Table sx={{ minWidth: 650 }} aria-label="classification model metrics table">
        <TableHead>
          <TableRow sx={{ backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100' }}>
            <TableCell>Metric</TableCell>
            <TableCell align="center">Achieved (Class 1)</TableCell>
            <TableCell align="center">Not Achieved (Class 0)</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow hover>
            <TableCell component="th" scope="row">Precision</TableCell>
            <TableCell align="center">
              {model_metrics?.achieved_precision.toFixed(2)}
            </TableCell>
            <TableCell align="center">
              {model_metrics?.not_achived_precision.toFixed(2)}
            </TableCell>
            <TableCell>Proportion of correct positive predictions.</TableCell>
          </TableRow>
          <TableRow hover>
            <TableCell component="th" scope="row">Recall</TableCell>
            <TableCell align="center">
              {model_metrics?.achieved_recall.toFixed(2)}
            </TableCell>
            <TableCell align="center">
              {model_metrics?.not_achived_recall.toFixed(2)}
            </TableCell>
            <TableCell>Proportion of actual positives correctly identified.</TableCell>
          </TableRow>
          <TableRow hover>
            <TableCell component="th" scope="row">F1 Score</TableCell>
            <TableCell align="center">
              {model_metrics?.achieved_f1_score.toFixed(2)}
            </TableCell>
            <TableCell align="center">
              {model_metrics?.not_achived_f1_score.toFixed(2)}
            </TableCell>
            <TableCell>Harmonic mean of precision and recall.</TableCell>
          </TableRow>
          <TableRow hover>
            <TableCell component="th" scope="row">Accuracy</TableCell>
            <TableCell align="center" colSpan={2}>
              {model_metrics?.accuracy.toFixed(2)}
            </TableCell>
            <TableCell>Overall correctness of predictions.</TableCell>
          </TableRow>
          <TableRow hover>
            <TableCell component="th" scope="row">ROC AUC Score</TableCell>
            <TableCell align="center" colSpan={2}>
              {model_metrics?.achieved_roc_auc.toFixed(2)}
            </TableCell>
            <TableCell>Ability to distinguish between classes.</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClassificationModelStatsTable;
