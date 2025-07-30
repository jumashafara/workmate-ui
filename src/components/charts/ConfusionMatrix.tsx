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

interface ConfusionMatrixProps {
  confusion_matrix_data:
    | {
        true_positives: number;
        false_positives: number;
        true_negatives: number;
        false_negatives: number;
      }
    | undefined;
}

const ConfusionMatrix: React.FC<ConfusionMatrixProps> = ({
  confusion_matrix_data,
}) => {
  const [matrix_data, setMatrixData] = useState<number[][]>([
    [0, 0],
    [0, 0],
  ]);

  useEffect(() => {
    if (confusion_matrix_data) {
      setMatrixData([
        [
          confusion_matrix_data.true_negatives,
          confusion_matrix_data.false_negatives,
        ],
        [
          confusion_matrix_data.false_positives,
          confusion_matrix_data.true_positives,
        ],
      ]);
    }
  }, [confusion_matrix_data]);

  const categories = ["Negative", "Positive"];

  // Create z-values for the heatmap (transpose matrix_data for correct orientation)
  const zValues = [
    [matrix_data[0][0], matrix_data[1][0]], // First row: TN, FP
    [matrix_data[0][1], matrix_data[1][1]], // Second row: FN, TP
  ];

  // Create annotations for the heatmap cells
  const annotations = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      annotations.push({
        x: j,
        y: i,
        text: zValues[i][j].toString(),
        font: {
          color: "black",
          size: 16,
        },
        showarrow: false,
      });
    }
  }

  const data = [
    {
      z: zValues,
      x: categories,
      y: categories,
      type: "heatmap",
      colorscale: [
        [0, "#fff7ed"],
        [0.5, "#fdba74"],
        [1, "#ea580c"],
      ],
      showscale: false,
    },
  ];

  const layout = {
    xaxis: {
      title: "Predicted Label",
      tickvals: [0, 1],
      ticktext: categories,
    },
    yaxis: {
      title: "True Label",
      tickvals: [0, 1],
      ticktext: categories,
      autorange: "reversed",
    },
    annotations: annotations,
    margin: {
      l: 80,
      r: 30,
      b: 80,
      t: 80,
    },
    plot_bgcolor: "white",
    paper_bgcolor: "white",
  };

  const config = {
    responsive: true,
    displayModeBar: false,
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-center">Confusion Matrix</CardTitle>
        <CardDescription className="text-center">
          How many false positives and false negatives?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[500px]">
          {/* @ts-ignore */}
          <Plot
            data={data}
            layout={layout}
            config={config}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfusionMatrix;
