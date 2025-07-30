import React from "react";
import { RegressionMetricsProps } from "../../types/modelmetrics";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RegressionModelMetrics {
  model_metrics: RegressionMetricsProps | null;
  title?: string;
}

const RegressionModelStatsTable: React.FC<RegressionModelMetrics> = ({
  model_metrics,
  title = "Regression Model Metrics"
}) => {
  if (!model_metrics) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">No model metrics data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-gray-600">Model performance metrics</p>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead className="text-center">Value</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">R-squared</TableCell>
                <TableCell className={`text-center ${model_metrics?.r_squared > 0.7 ? 'bg-green-50' : ''}`}>
                  {model_metrics?.r_squared?.toFixed(2)}
                </TableCell>
                <TableCell>
                  Proportion of variance in the dependent variable explained by the model.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Adjusted R-squared</TableCell>
                <TableCell className={`text-center ${model_metrics?.adjusted_r_squared > 0.7 ? 'bg-green-50' : ''}`}>
                  {model_metrics?.adjusted_r_squared?.toFixed(2)}
                </TableCell>
                <TableCell>
                  R-squared adjusted for the number of predictors in the model.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Mean Squared Error</TableCell>
                <TableCell className="text-center">
                  {model_metrics?.mean_squared_error?.toFixed(2)}
                </TableCell>
                <TableCell>
                  Average squared difference between predicted and actual values.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Correlation</TableCell>
                <TableCell className={`text-center ${model_metrics?.correlation > 0.7 ? 'bg-green-50' : ''}`}>
                  {model_metrics?.correlation?.toFixed(2)}
                </TableCell>
                <TableCell>
                  Strength and direction of the linear relationship between predicted and actual values.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            Note: Values closer to 1.0 indicate better performance. Highlighted cells indicate good performance (&gt;0.7).
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegressionModelStatsTable;
