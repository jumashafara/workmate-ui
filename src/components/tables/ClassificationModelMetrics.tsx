import React from "react";
import { ClassificationMetricsProps } from "@/types/modelmetrics";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface ClassificationModelMetrics {
  model_metrics: ClassificationMetricsProps["model"] | null;
  title?: string;
}

const ClassificationModelStatsTable: React.FC<ClassificationModelMetrics> = ({
  model_metrics,
  title = "Classification Model Metrics",
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
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead className="text-center">Achieved (Class 1)</TableHead>
              <TableHead className="text-center">
                Not Achieved (Class 0)
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Description
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          These metrics help evaluate the model's performance in
                          predicting outcomes
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Precision</TableCell>
              <TableCell
                className={`text-center ${
                  model_metrics?.achieved_precision > 0.7 ? "bg-green-50" : ""
                }`}
              >
                {model_metrics?.achieved_precision.toFixed(2)}
              </TableCell>
              <TableCell
                className={`text-center ${
                  model_metrics?.not_achived_precision > 0.7
                    ? "bg-green-50"
                    : ""
                }`}
              >
                {model_metrics?.not_achived_precision.toFixed(2)}
              </TableCell>
              <TableCell>
                Proportion of households correctly predicted to hit the target.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Recall</TableCell>
              <TableCell
                className={`text-center ${
                  model_metrics?.achieved_recall > 0.7 ? "bg-green-50" : ""
                }`}
              >
                {model_metrics?.achieved_recall.toFixed(2)}
              </TableCell>
              <TableCell
                className={`text-center ${
                  model_metrics?.not_achived_recall > 0.7 ? "bg-green-50" : ""
                }`}
              >
                {model_metrics?.not_achived_recall.toFixed(2)}
              </TableCell>
              <TableCell>
                Proportion of actual households that hit the target and were
                correctly identified.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">F1 Score</TableCell>
              <TableCell
                className={`text-center ${
                  model_metrics?.achieved_f1_score > 0.7 ? "bg-green-50" : ""
                }`}
              >
                {model_metrics?.achieved_f1_score.toFixed(2)}
              </TableCell>
              <TableCell
                className={`text-center ${
                  model_metrics?.not_achived_f1_score > 0.7
                    ? "bg-green-50"
                    : ""
                }`}
              >
                {model_metrics?.not_achived_f1_score.toFixed(2)}
              </TableCell>
              <TableCell>
                Harmonic mean of precision and recall in the context of
                households hitting the target.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Accuracy</TableCell>
              <TableCell
                className={`text-center ${
                  model_metrics?.accuracy > 0.7 ? "bg-green-50" : ""
                }`}
                colSpan={2}
              >
                {model_metrics?.accuracy.toFixed(2)}
              </TableCell>
              <TableCell>
                Overall correctness of predictions regarding households hitting
                the target.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">ROC AUC Score</TableCell>
              <TableCell
                className={`text-center ${
                  model_metrics?.achieved_roc_auc > 0.7 ? "bg-green-50" : ""
                }`}
                colSpan={2}
              >
                {model_metrics?.achieved_roc_auc.toFixed(2)}
              </TableCell>
              <TableCell>
                Ability to distinguish between households that hit the target
                and those that do not.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          Note: Values closer to 1.0 indicate better performance. Highlighted
          cells indicate good performance (&gt;0.7).
        </p>
      </div>
    </>
  );
};

export default ClassificationModelStatsTable;
