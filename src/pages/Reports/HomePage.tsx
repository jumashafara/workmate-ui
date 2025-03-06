import React from "react";
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from "@mui/material";
import { 
  CheckCircle, 
  Cancel, 
  TrendingUp,
  Assessment
} from "@mui/icons-material";
import DistrictStats from "../../components/Tables/DistrictStats";
import ClusterStats from "../../components/Tables/ClusterStats";

interface DashboardStats {
  total_predictions: number;
  positive_predictions: number;
  negative_predictions: number;
  average_income: number;
  accuracy: number;
}

const HomePage: React.FC = () => {
  const [stats, setStats] = React.useState<DashboardStats>({
    total_predictions: 0,
    positive_predictions: 0,
    negative_predictions: 0,
    average_income: 0.0,
    accuracy: 0.0,
  });
  const [loading, setLoading] = React.useState(true);
  const [groupBy, setGroupBy] = React.useState<string>("district");

  React.useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("https://workmate.api.dataidea.org/api/dashboard-stats/");
      const data = await response.json();
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card sx={{ height: '100%', boxShadow: 2 }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
        {icon && (
          <Box sx={{ 
            mr: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: `${color}.light`,
            borderRadius: '50%',
            p: 1.5
          }}>
            {icon}
          </Box>
        )}
        <Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 'bold' }}>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Predictions"
            value={stats.total_predictions}
            icon={<Assessment sx={{ fontSize: 28, color: 'primary.main' }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Achieved"
              value={`${((stats.positive_predictions / stats.total_predictions) * 100)?.toFixed(1)}%`}
            icon={<CheckCircle sx={{ fontSize: 28, color: 'success.main' }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Not achieved"
              value={`${((stats.negative_predictions / stats.total_predictions) * 100)?.toFixed(1)}%`}
            icon={<Cancel sx={{ fontSize: 28, color: 'error.main' }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Income + Production"
            value={`${(stats.average_income)?.toFixed(1)}%`}
            icon={<TrendingUp sx={{ fontSize: 28, color: 'info.main' }} />}
          />
        </Grid>
      </Grid>

      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="group-by-label">Group By</InputLabel>
          <Select
            labelId="group-by-label"
            id="group-by-select"
            value={groupBy}
            label="Group By"
            onChange={(e) => setGroupBy(e.target.value)}
          >
            <MenuItem value="district">District</MenuItem>
            <MenuItem value="cluster">Cluster</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {groupBy === "district" ? (
        <DistrictStats />
      ) : (
        <ClusterStats />
      )}
    </Box>
  );
};

export default HomePage;
