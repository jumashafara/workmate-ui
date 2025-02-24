import React from "react";
import { Grid } from "@mui/material";
import { Timeline, CheckCircle, Cancel, QueryStats } from "@mui/icons-material";
import DistrictStats from "../../src/components/Tables/DistrictStats";
import ClusterStats from "../components/Tables/ClusterStats";

interface DashboardStats {
  total_predictions: number;
  positive_predictions: number;
  negative_predictions: number;
  accuracy: number;
}

const HomePage: React.FC = () => {
  const [stats, setStats] = React.useState<DashboardStats>({
    total_predictions: 0,
    positive_predictions: 0,
    negative_predictions: 0,
    accuracy: 0,
  });

  const [selectedStats, setSelectedStats] = React.useState("cluster");

  React.useEffect(() => {
    fetchDashboardStats();
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

  const StatCard = ({ title, value, icon, color }: any) => (
    <div className="bg-white shadow-md rounded-sm p-6 flex justify-between items-center transition-all duration-300 hover:shadow-2xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800">
      <div>
        <p className="">{title}</p>
        <h3 className="text-3xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`${color} text-4xl`}>{icon}</div>
    </div>
  );

  return (
    <div className="">
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
            title="Achieved"
            value={stats.positive_predictions}
            icon={<CheckCircle fontSize="inherit" />}
            color="text-green-400"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Not Achieved"
            value={stats.negative_predictions}
            icon={<Cancel fontSize="inherit" />}
            color="text-red-400"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Accuracy (c lass)"
            value={`${stats.accuracy}%`}
            icon={<QueryStats fontSize="inherit" />}
            color="text-orange-400"
          />
        </Grid>
      </Grid>

      <div className="pt-6 pb-3">
        <select
          name=""
          id=""
          onChange={(e) => setSelectedStats(e.target.value)}
          className="text-lg font-bold p-3  outline-none dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-sm"
        >
          <option value="" className="p-3 text-bold ">
            Select Stats ({selectedStats})
          </option>
          <option value="cluster" className="p-3 text-bold bg-gray-300 dark:bg-gray-800">
          Cluster
          </option>
          <option value="district" className="p-3 text-bold bg-gray-300 dark:bg-gray-800">
          District
          </option>
        </select>
      </div>
      {selectedStats === "cluster" ? <ClusterStats /> : <DistrictStats />}
    </div>
  );
};

export default HomePage;
