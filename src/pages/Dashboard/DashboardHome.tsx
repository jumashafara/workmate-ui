import React from 'react';
import { Card, Grid, Typography, Box } from '@mui/material';
import { 
    Timeline, 
    CheckCircle, 
    Cancel,
    QueryStats 
} from '@mui/icons-material';

interface DashboardStats {
    totalPredictions: number;
    positivePredictions: number;
    negativePredictions: number;
    accuracy: number;
}

const DashboardHome: React.FC = () => {
    const [stats, setStats] = React.useState<DashboardStats>({
        totalPredictions: 0,
        positivePredictions: 0,
        negativePredictions: 0,
        accuracy: 0
    });

    React.useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await fetch('/api/dashboard/stats');
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const StatCard = ({ title, value, icon, color }: any) => (
        <Card sx={{ p: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                    <Typography color="textSecondary" variant="subtitle2">
                        {title}
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 1 }}>
                        {value}
                    </Typography>
                </Box>
                {icon && (
                    <Box sx={{ color }}>
                        {icon}
                    </Box>
                )}
            </Box>
        </Card>
    );

    return (
        <Box p={3}>
            <Typography variant="h4" mb={4}>
                Predictions Dashboard
            </Typography>
            
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Predictions"
                        value={stats.totalPredictions}
                        icon={<Timeline sx={{ fontSize: 40 }} />}
                        color="#1976d2"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Positive Predictions"
                        value={stats.positivePredictions}
                        icon={<CheckCircle sx={{ fontSize: 40 }} />}
                        color="#2e7d32"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Negative Predictions"
                        value={stats.negativePredictions}
                        icon={<Cancel sx={{ fontSize: 40 }} />}
                        color="#d32f2f"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Accuracy Rate"
                        value={`${stats.accuracy}%`}
                        icon={<QueryStats sx={{ fontSize: 40 }} />}
                        color="#ed6c02"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardHome; 