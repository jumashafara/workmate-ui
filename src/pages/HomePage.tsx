import React from "react";
import { Grid } from "@mui/material";
import { Timeline, CheckCircle, Cancel, QueryStats } from "@mui/icons-material";

interface DashboardStats {
  totalPredictions: number;
  positivePredictions: number;
  negativePredictions: number;
  accuracy: number;
}

const HomePage: React.FC = () => {
  const [stats, setStats] = React.useState<DashboardStats>({
    totalPredictions: 0,
    positivePredictions: 0,
    negativePredictions: 0,
    accuracy: 0,
  });

  React.useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/stats/");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <div className="bg-white shadow-md rounded-sm p-6 flex justify-between items-center transition-all duration-300 hover:shadow-2xl">
      <div>
        <p className="text-gray-500 ">{title}</p>
        <h3 className="text-3xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`text-${color} text-4xl`}>{icon}</div>
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Predictions Dashboard</h2>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Predictions"
            value={stats.totalPredictions}
            icon={<Timeline fontSize="inherit" />}
            color="blue-600"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Positive Predictions"
            value={stats.positivePredictions}
            icon={<CheckCircle fontSize="inherit" />}
            color="green-600"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Negative Predictions"
            value={stats.negativePredictions}
            icon={<Cancel fontSize="inherit" />}
            color="red-600"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Accuracy (Classification)"
            value={`${stats.accuracy}%`}
            icon={<QueryStats fontSize="inherit" />}
            color="orange-600"
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default HomePage;
