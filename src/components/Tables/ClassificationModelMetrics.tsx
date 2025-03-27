import React from "react";
import { ClassificationMetricsProps } from "../../types/modelmetrics";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Box,
  Card,
  CardHeader,
  Typography,
  Tooltip,
  IconButton
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

interface ClassificationModelMetrics {
  model_metrics: ClassificationMetricsProps['model'] | null;
  title?: string;
}

const ClassificationModelStatsTable: React.FC<ClassificationModelMetrics> = ({
  model_metrics,
  title = "Classification Model Metrics"
}) => {
  if (!model_metrics) {
    return (
      <Card sx={{ width: '100%', boxShadow: 2, mb: 2 }}>
        <CardHeader 
          title={title}
          subheader="Model performance metrics"
          sx={{ 
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
            padding: 2
          }}
        />
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No model metrics data available
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Card sx={{ width: '100%', boxShadow: 2, mb: 2 }}>
      <CardHeader 
        title={title}
        subheader="Model performance metrics"
        sx={{ 
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
          padding: 2
        }}
      />
      <TableContainer component={Paper} sx={{ boxShadow: 0 }}>
        <Table sx={{ minWidth: 650 }} aria-label="classification model metrics table">
          <TableHead>
            <TableRow>
              <TableCell>Metric</TableCell>
              <TableCell align="center">Achieved (Class 1)</TableCell>
              <TableCell align="center">Not Achieved (Class 0)</TableCell>
              <TableCell>
                Description
                <Tooltip title="These metrics help evaluate the model's performance in predicting outcomes">
                  <IconButton size="small" sx={{ ml: 0.5 }}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow hover>
              <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>Precision</TableCell>
              <TableCell align="center" sx={{ 
                bgcolor: model_metrics?.achieved_precision > 0.7 ? 'rgba(46, 125, 50, 0.1)' : 'inherit'
              }}>
                {model_metrics?.achieved_precision.toFixed(2)}
              </TableCell>
              <TableCell align="center" sx={{ 
                bgcolor: model_metrics?.not_achived_precision > 0.7 ? 'rgba(46, 125, 50, 0.1)' : 'inherit'
              }}>
                {model_metrics?.not_achived_precision.toFixed(2)}
              </TableCell>
              <TableCell>Proportion of correct positive predictions.</TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>Recall</TableCell>
              <TableCell align="center" sx={{ 
                bgcolor: model_metrics?.achieved_recall > 0.7 ? 'rgba(46, 125, 50, 0.1)' : 'inherit'
              }}>
                {model_metrics?.achieved_recall.toFixed(2)}
              </TableCell>
              <TableCell align="center" sx={{ 
                bgcolor: model_metrics?.not_achived_recall > 0.7 ? 'rgba(46, 125, 50, 0.1)' : 'inherit'
              }}>
                {model_metrics?.not_achived_recall.toFixed(2)}
              </TableCell>
              <TableCell>Proportion of actual positives correctly identified.</TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>F1 Score</TableCell>
              <TableCell align="center" sx={{ 
                bgcolor: model_metrics?.achieved_f1_score > 0.7 ? 'rgba(46, 125, 50, 0.1)' : 'inherit'
              }}>
                {model_metrics?.achieved_f1_score.toFixed(2)}
              </TableCell>
              <TableCell align="center" sx={{ 
                bgcolor: model_metrics?.not_achived_f1_score > 0.7 ? 'rgba(46, 125, 50, 0.1)' : 'inherit'
              }}>
                {model_metrics?.not_achived_f1_score.toFixed(2)}
              </TableCell>
              <TableCell>Harmonic mean of precision and recall.</TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>Accuracy</TableCell>
              <TableCell align="center" colSpan={2} sx={{ 
                bgcolor: model_metrics?.accuracy > 0.7 ? 'rgba(46, 125, 50, 0.1)' : 'inherit'
              }}>
                {model_metrics?.accuracy.toFixed(2)}
              </TableCell>
              <TableCell>Overall correctness of predictions.</TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>ROC AUC Score</TableCell>
              <TableCell align="center" colSpan={2} sx={{ 
                bgcolor: model_metrics?.achieved_roc_auc > 0.7 ? 'rgba(46, 125, 50, 0.1)' : 'inherit'
              }}>
                {model_metrics?.achieved_roc_auc.toFixed(2)}
              </TableCell>
              <TableCell>Ability to distinguish between classes.</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ p: 2, bgcolor: 'background.default' }}>
        <Typography variant="caption" color="text.secondary">
          Note: Values closer to 1.0 indicate better performance. Highlighted cells indicate good performance ({'>'}0.7).
        </Typography>
      </Box>
    </Card>
  );
};

export default ClassificationModelStatsTable;
