import React from "react";
import { Grid } from "@mui/material";
import { Timeline, CheckCircle, Cancel, QueryStats } from "@mui/icons-material";

interface DashboardStats {
  total_predictions: number;
  positive_predictions: number;
  negative_predictions: number;
  accuracy: number;
}

interface ClusterStat {
  district: string;
  cluster: string;
  avg_prediction: number;
  avg_income: number;
  evaluation_month: string;
}

const HomePage: React.FC = () => {
  const [stats, setStats] = React.useState<DashboardStats>({
    total_predictions: 0,
    positive_predictions: 0,
    negative_predictions: 0,
    accuracy: 0,
  });
  const [clusterStats, setClusterStats] = React.useState<ClusterStat[]>([]);

  React.useEffect(() => {
    fetchDashboardStats();
    fetchClusterStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/dashboard-stats/");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchClusterStats = async () => {
    try {
      const response = await fetch("/api/cluster-stats/");
      const data = await response.json();
      setClusterStats(data);
    } catch (error) {
      console.error("Error fetching cluster stats:", error);
    }
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <div className="bg-white shadow-md rounded-sm p-6 flex justify-between items-center transition-all duration-300 hover:shadow-2xl">
      <div>
        <p className="text-gray-500 ">{title}</p>
        <h3 className="text-3xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`${color} text-4xl`}>{icon}</div>
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Predictions Dashboard</h2>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Predictions"
            value={stats.total_predictions}
            icon={<Timeline fontSize="inherit" />}
            color="text-blue-400"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Positive Predictions"
            value={stats.positive_predictions}
            icon={<CheckCircle fontSize="inherit" />}
            color="text-green-400"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Negative Predictions"
            value={stats.negative_predictions}
            icon={<Cancel fontSize="inherit" />}
            color="text-red-400"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Accuracy (Classification)"
            value={`${stats.accuracy}%`}
            icon={<QueryStats fontSize="inherit" />}
            color="text-orange-400"
          />
        </Grid>
      </Grid>

      <h3 className="text-xl font-bold mt-8 mb-4">Cluster Statistics</h3>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 font-medium uppercase tracking-wider">
                District
              </th>
              <th className="px-6 py-3 font-medium uppercase tracking-wider">
                Cluster
              </th>
              <th className="px-6 py-3 font-medium uppercase tracking-wider">
                  EVALUATION MONTH
              </th>
              <th className="px-6 py-3 font-medium uppercase tracking-wider">
                AVERAGE PREDICTION
              </th>
              <th className="px-6 py-3 font-medium uppercase tracking-wider">
                AVERAGE INCOME
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clusterStats.map((stat, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {stat.district}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {stat.cluster}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {stat.evaluation_month}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {(stat.avg_prediction * 100).toFixed(1)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  ${stat.avg_income.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomePage;
