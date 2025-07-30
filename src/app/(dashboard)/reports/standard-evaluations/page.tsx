"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, TrendingUp, DollarSign } from "lucide-react";

interface DashboardStats {
  total_predictions: number;
  positive_predictions: number;
  negative_predictions: number;
  average_income: number;
  accuracy: number;
}

const StandardEvaluationsPage: React.FC = () => {
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
      // Replace with your actual API endpoint
      const response = await fetch(`/api/dashboard-stats/`);
      const data = await response.json();
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, className = "" }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    className?: string;
  }) => (
    <Card className={`h-full ${className}`}>
      <CardContent className="flex items-center p-6">
        <div className="mr-4 p-3 rounded-full bg-muted">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Standard Evaluations</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Predictions"
          value={stats.total_predictions}
          icon={TrendingUp}
        />
        <StatCard
          title="Achieved"
          value={`${((stats.positive_predictions / stats.total_predictions) * 100 || 0).toFixed(1)}%`}
          icon={CheckCircle}
          className="border-green-200"
        />
        <StatCard
          title="Not Achieved"
          value={`${((stats.negative_predictions / stats.total_predictions) * 100 || 0).toFixed(1)}%`}
          icon={XCircle}
          className="border-red-200"
        />
        <StatCard
          title="Avg Income + Production"
          value={`${stats.average_income.toFixed(1)}`}
          icon={DollarSign}
          className="border-blue-200"
        />
      </div>

      <div className="w-fit">
        <Label htmlFor="group-by-select" className="text-sm font-medium">
          Group By
        </Label>
        <Select value={groupBy} onValueChange={setGroupBy}>
          <SelectTrigger className="w-48 mt-1">
            <SelectValue placeholder="Select grouping" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="district">District</SelectItem>
            <SelectItem value="cluster">Cluster</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        {groupBy === "district" ? (
          <Card>
            <CardHeader>
              <CardTitle>District Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                District statistics will be displayed here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Cluster Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Cluster statistics will be displayed here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StandardEvaluationsPage;