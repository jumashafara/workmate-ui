"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Users, Target, Calendar, MapPin } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  // Mock data - replace with real data
  const stats = [
    {
      title: "Total Predictions",
      value: "24,651",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: Target,
    },
    {
      title: "Active Clusters", 
      value: "156",
      change: "+3.2%",
      changeType: "positive" as const,
      icon: MapPin,
    },
    {
      title: "Households",
      value: "8,924",
      change: "+8.1%",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "This Month",
      value: "2,847",
      change: "-2.4%",
      changeType: "negative" as const,
      icon: Calendar,
    },
  ]

  const quickActions = [
    {
      title: "Predictions Dashboard",
      description: "View and analyze prediction data with advanced filtering",
      href: "/superuser/predictions",
      icon: BarChart3,
      color: "bg-blue-500",
    },
    {
      title: "Cluster Trends",
      description: "Analyze cluster performance trends over time",
      href: "/superuser/trends", 
      icon: TrendingUp,
      color: "bg-green-500",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Welcome back! Here&apos;s an overview of your system.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                stat.changeType === 'positive' 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {quickActions.map((action) => (
            <Card key={action.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href={action.href}>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Open {action.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity - Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest updates and changes in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: "New prediction data processed",
                description: "1,247 new predictions added for March evaluation",
                time: "2 hours ago",
              },
              {
                title: "Cluster analysis completed",
                description: "Weekly cluster performance analysis finished",
                time: "4 hours ago",
              },
              {
                title: "System backup completed",
                description: "Daily database backup completed successfully",
                time: "1 day ago",
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 pb-4 border-b last:border-0">
                <div className="mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-orange-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}