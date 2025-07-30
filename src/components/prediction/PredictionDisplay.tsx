import React from "react";
import PieChart from "@/components/charts/PieChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Prediction</CardTitle>
        <p className="text-sm text-gray-600">
          What are the chances of achieving the target?
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Probability</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Achieving</TableCell>
                  <TableCell>{probabilities[0].toFixed(3)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Not Achieving</TableCell>
                  <TableCell>{probabilities[1].toFixed(3)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Predicted</TableCell>
                  <TableCell>
                    {prediction === 1
                      ? "Likely to achieve"
                      : "Not likely to achieve"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Predicted Income + Production
                  </TableCell>
                  <TableCell>
                    {predicted_income_production.toFixed(3)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-center items-center">
            <PieChart data={probabilities} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionDisplay;
