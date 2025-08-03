import React from "react";
import dynamic from "next/dynamic";
import { Activity } from "lucide-react";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface ROCCurveProps {
  fpr?: number[];
  tpr?: number[];
  aucScore?: number;
}

const ROCCurve: React.FC<ROCCurveProps> = ({
  fpr = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
  tpr = [0, 0.3, 0.45, 0.6, 0.68, 0.75, 0.82, 0.89, 0.93, 0.97, 1],
  aucScore = 0.81,
}) => {
  const data = [
    {
      x: fpr,
      y: tpr,
      type: "scatter",
      mode: "lines+markers",
      name: "ROC Curve (AUC = " + aucScore.toFixed(2) + ")",
      line: {
        color: "#ea580c",
        width: 2,
      },
      marker: {
        color: "#ea580c",
        size: 6,
      },
    },
    {
      x: [0, 1],
      y: [0, 1],
      type: "scatter",
      mode: "lines",
      name: "Random Classifier",
      line: {
        color: "#9ca3af",
        width: 2,
        dash: "dash",
      },
    },
  ];

  const layout = {
    xaxis: {
      title: "False Positive Rate",
      range: [0, 1],
    },
    yaxis: {
      title: "True Positive Rate",
      range: [0, 1],
    },
    legend: {
      x: 0.1,
      y: 0.9,
    },
    margin: {
      l: 60,
      r: 30,
      b: 70,
      t: 60,
    },
    hovermode: "closest",
    plot_bgcolor: "white",
    paper_bgcolor: "white",
    font: {
      family: "Gabarito, system-ui, sans-serif",
    },
  };

  const config = {
    responsive: true,
    displayModeBar: false,
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              ROC Curve
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Receiver Operating Characteristic analysis
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[500px]">
          <Plot
            data={data as any} // Type assertion to bypass TypeScript error
            layout={layout as any} // Type assertion to bypass TypeScript error
            config={config}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ROCCurve;
