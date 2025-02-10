import React from "react";
import { RegressionMetricsProps } from "../../types/modelmetrics";

interface RegressionModelMetrics {
  model_metrics: RegressionMetricsProps | null;
}

const RegressionModelStatsTable: React.FC<RegressionModelMetrics> = ({
  model_metrics,
}) => {
  return (
    <div className="overflow-x-auto border border-gray-300 p-4 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-md">
      {/* select model */}

      <h2 className="text-lg font-semibold mb-4 text-center text-gray-900 dark:text-white">
        Model Metrics
      </h2>
      <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-600">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="px-4 py-2 border text-gray-900 dark:text-gray-100">
              Metric
            </th>
            <th className="px-4 py-2 border text-gray-900 dark:text-gray-100">
              Value
            </th>
            <th className="px-4 py-2 border text-gray-900 dark:text-gray-100">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">
              R-squared
            </td>
            <td className="px-4 py-2 border text-center text-gray-900 dark:text-gray-100">
              {model_metrics?.r_squared?.toFixed(2)}
            </td>
            <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">
              Proportion of variance in the dependent variable explained by the
              model.
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">
              Adjusted R-squared
            </td>
            <td className="px-4 py-2 border text-center text-gray-900 dark:text-gray-100">
              {model_metrics?.adjusted_r_squared?.toFixed(2)}
            </td>
            <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">
              R-squared adjusted for the number of predictors in the model.
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">
              Mean Squared Error
            </td>
            <td className="px-4 py-2 border text-center text-gray-900 dark:text-gray-100">
              {model_metrics?.mean_squared_error?.toFixed(2)}
            </td>
            <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">
              Average squared difference between predicted and actual values.
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">
              Correlation
            </td>
            <td className="px-4 py-2 border text-center text-gray-900 dark:text-gray-100">
              {model_metrics?.correlation?.toFixed(2)}
            </td>
            <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">
              Strength and direction of the linear relationship between
              predicted and actual values.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RegressionModelStatsTable;
