import React from "react";
import { ClassificationMetricsProps } from "../../types/modelmetrics";

interface ClassificationModelMetrics {
  model_metrics: ClassificationMetricsProps | null;
}

const ClassificationModelStatsTable: React.FC<ClassificationModelMetrics> = ({ model_metrics }) => {
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
              Achieved (Class 1)
            </th>
            <th className="px-4 py-2 border text-gray-900 dark:text-gray-100">
              Not Achieved (Class 0)
            </th>
            <th className="px-4 py-2 border text-gray-900 dark:text-gray-100">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">
              Precision
            </td>
            <td className="px-4 py-2 border text-center text-gray-900 dark:text-gray-100">
              {model_metrics?.achieved_precision.toFixed(2)}
            </td>
            <td className="px-4 py-2 border text-center text-gray-900 dark:text-gray-100">
              {model_metrics?.not_achived_precision.toFixed(2)}
            </td>
            <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">
              Proportion of correct positive predictions.
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">
              Recall
            </td>
            <td className="px-4 py-2 border text-center text-gray-900 dark:text-gray-100">
              {model_metrics?.achieved_recall.toFixed(2)}
            </td>
            <td className="px-4 py-2 border text-center text-gray-900 dark:text-gray-100">
              {model_metrics?.not_achived_recall.toFixed(2)}
            </td>
            <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">
              Proportion of actual positives correctly identified.
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">
              F1 Score
            </td>
            <td className="px-4 py-2 border text-center text-gray-900 dark:text-gray-100">
              {model_metrics?.achieved_f1_score.toFixed(2)}
            </td>
            <td className="px-4 py-2 border text-center text-gray-900 dark:text-gray-100">
              {model_metrics?.not_achived_f1_score.toFixed(2)}
            </td>
            <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">
              Harmonic mean of precision and recall.
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">
              Accuracy
            </td>
            <td
              colSpan={2}
              className="px-4 py-2 border text-center text-gray-900 dark:text-gray-100"
            >
              {model_metrics?.accuracy.toFixed(2)}
            </td>
            <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">
              Overall correctness of predictions.
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">
              ROC AUC Score
            </td>
            <td
              colSpan={2}
              className="px-4 py-2 border text-center text-gray-900 dark:text-gray-100"
            >
              {model_metrics?.achieved_roc_auc.toFixed(2)}
            </td>
            <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">
              Ability to distinguish between classes.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ClassificationModelStatsTable;
