import React from "react";
import PieChart from "../Charts/PieChart";

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
    <div className="w-full border border-gray-300 rounded-sm shadow-lg bg-white dark:border-gray-600 dark:bg-gray-800">
      <div className="bg-gradient-to-r from-gray-200 to-gray-300 p-4 rounded-sm text-gray-700 dark:from-gray-800 dark:to-gray-900 dark:text-gray-200">
        <h2 className="text-xl font-bold mb-2 w-full">Prediction</h2>
        <p className="">What are the chances of achieving the target?</p>
      </div>
      <div className="p-6 flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <table className="w-full bg-white dark:bg-gray-800">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-left">Status</th>
                <th className="px-4 py-2 border-b text-left">Probability</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border-b text-left">Achieving</td>
                <td className="px-4 py-2 border-b text-left">
                  {probabilities[0].toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b text-left">Not Achieving</td>
                <td className="px-4 py-2 border-b text-left">
                  {probabilities[1].toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b text-left">Predicted</td>
                <td className="px-4 py-2 border-b text-left">
                  {prediction === 1 ? "Achieved" : "Not Achieved"}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b text-left">
                  Predicted Income Production
                </td>
                <td className="px-4 py-2 border-b text-left">
                  {predicted_income_production}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="md:w-1/2 p-6">
          <PieChart data={probabilities} />
        </div>
      </div>
    </div>
  );
};

export default PredictionDisplay;
