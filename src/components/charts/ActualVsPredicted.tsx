import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface ActualVsPredictedProps {
  y_pred: number[];
  y_test: number[];
}

const ActualVsPredicted: React.FC<ActualVsPredictedProps> = ({ y_pred, y_test }) => {
  const [plotData, setPlotData] = useState<any[]>([]);
  const [layout, setLayout] = useState<any>({});

  useEffect(() => {
    if (y_pred && y_test && y_pred.length > 0 && y_test.length > 0) {
      // Find min and max values for perfect prediction line
      const allValues = [...y_pred, ...y_test];
      const minVal = Math.min(...allValues);
      const maxVal = Math.max(...allValues);

      // Create scatter plot data
      const data = [
        {
          x: y_pred,
          y: y_test,
          type: "scatter",
          mode: "markers",
          marker: {
            color: "rgba(59, 130, 246, 0.7)",
            size: 6,
            line: {
              color: "rgba(59, 130, 246, 1)",
              width: 1,
            },
          },
          name: "Actual vs Predicted",
        },
        {
          x: [minVal, maxVal],
          y: [minVal, maxVal],
          type: "scatter",
          mode: "lines",
          line: {
            color: "rgba(239, 68, 68, 0.8)",
            width: 2,
            dash: "dash",
          },
          name: "Perfect Prediction",
        },
      ];

      const plotLayout = {
        title: {
          text: "Actual vs Predicted Values",
          font: {
            size: 18,
            color: "#374151",
          },
        },
        xaxis: {
          title: {
            text: "Predicted Values",
            font: {
              size: 14,
              color: "#374151",
            },
          },
          gridcolor: "rgba(0,0,0,0.1)",
          zeroline: false,
        },
        yaxis: {
          title: {
            text: "Actual Values",
            font: {
              size: 14,
              color: "#374151",
            },
          },
          gridcolor: "rgba(0,0,0,0.1)",
          zeroline: false,
        },
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)",
        margin: {
          l: 60,
          r: 30,
          t: 60,
          b: 60,
        },
        showlegend: true,
        legend: {
          x: 0.02,
          y: 0.98,
          bgcolor: "rgba(255,255,255,0.8)",
          bordercolor: "rgba(0,0,0,0.1)",
          borderwidth: 1,
        },
        hovermode: "closest",
      };

      setPlotData(data);
      setLayout(plotLayout);
    }
  }, [y_pred, y_test]);

  if (!y_pred || !y_test || y_pred.length === 0 || y_test.length === 0) {
    return (
      <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Actual vs Predicted
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Comparison of actual vs predicted values
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[400px] flex items-center justify-center bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="text-center">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full w-fit mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="text-orange-700 dark:text-orange-300 font-medium">
                No Data Available
              </p>
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                Actual vs predicted data not available for this model
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Actual vs Predicted
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Comparison of actual vs predicted values
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px]">
          <Plot
            data={plotData}
            layout={layout}
            config={{ displayModeBar: false }}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ActualVsPredicted; 