"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label" 
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Filter, X, TrendingUp, BarChart3 } from "lucide-react"

interface ClusterIncomeData {
  cluster: string
  evaluation_month: number
  avg_income: number
  household_count: number
  achievement_rate: number
  region: string
  district: string
}

interface FilterOption {
  value: string
  label: string
}

// Mock chart component - replace with actual charting library
function MockLineChart({ data }: { data: ClusterIncomeData[] }) {
  return (
    <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center border">
      <div className="text-center">
        <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">Line Chart: Income Trends by Cluster</p>
        <p className="text-sm text-gray-400 mt-2">
          {data.length} data points across {[...new Set(data.map(d => d.cluster))].length} clusters
        </p>
      </div>
    </div>
  )
}

function MockScatterPlot({ data }: { data: ClusterIncomeData[] }) {
  return (
    <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center border">
      <div className="text-center">
        <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">Scatter Plot: Income vs Achievement Rate</p>
        <p className="text-sm text-gray-400 mt-2">
          Bubble size represents household count
        </p>
      </div>
    </div>
  )
}

export default function SuperuserTrendsPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<ClusterIncomeData[]>([])
  
  // Filter states
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([])
  const [selectedClusters, setSelectedClusters] = useState<string[]>([])
  const [selectedMonths, setSelectedMonths] = useState<string[]>([])
  
  // Filter options
  const [regionOptions, setRegionOptions] = useState<FilterOption[]>([])
  const [districtOptions, setDistrictOptions] = useState<FilterOption[]>([])
  const [clusterOptions, setClusterOptions] = useState<FilterOption[]>([])
  const [monthOptions, setMonthOptions] = useState<FilterOption[]>([])

  // Mock data loading simulation
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Generate mock cluster data
      const clusters = ['Cluster A', 'Cluster B', 'Cluster C', 'Cluster D', 'Cluster E']
      const regions = ['Central', 'Northern', 'Western', 'Eastern']
      const districts = ['District A', 'District B', 'District C', 'District D']
      const months = [6, 9, 12, 15]
      
      const mockData: ClusterIncomeData[] = []
      
      clusters.forEach((cluster, clusterIndex) => {
        months.forEach((month, monthIndex) => {
          mockData.push({
            cluster,
            evaluation_month: month,
            avg_income: 2000 + Math.random() * 2000 + (monthIndex * 200), // Trending upward
            household_count: Math.floor(50 + Math.random() * 100),
            achievement_rate: 40 + Math.random() * 40, // 40-80%
            region: regions[clusterIndex % regions.length],
            district: districts[clusterIndex % districts.length],
          })
        })
      })
      
      setData(mockData)
      
      // Set filter options
      setRegionOptions(regions.map(r => ({ value: r, label: r })))
      setDistrictOptions(districts.map(d => ({ value: d, label: d })))
      setClusterOptions(clusters.map(c => ({ value: c, label: c })))
      setMonthOptions(months.map(m => ({ value: m.toString(), label: `Month ${m}` })))
      
      setLoading(false)
    }

    loadData()
  }, [])

  const clearFilters = () => {
    setSelectedRegions([])
    setSelectedDistricts([])
    setSelectedClusters([])
    setSelectedMonths([])
  }

  const activeFiltersCount = selectedRegions.length + selectedDistricts.length + selectedClusters.length + selectedMonths.length

  // Calculate summary statistics
  const summaryStats = {
    totalClusters: [...new Set(data.map(d => d.cluster))].length,
    evaluationMonths: [...new Set(data.map(d => d.evaluation_month))].length,
    avgIncome: data.length > 0 ? data.reduce((sum, d) => sum + d.avg_income, 0) / data.length : 0,
    totalHouseholds: data.reduce((sum, d) => sum + d.household_count, 0),
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-1">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-96 w-full" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-96 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cluster Trends Analysis</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Analyze cluster performance trends over evaluation months with predictive insights.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary">{activeFiltersCount}</Badge>
              )}
            </CardTitle>
            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filter Controls */}
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label>Region</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select regions" />
                </SelectTrigger>
                <SelectContent>
                  {regionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>District</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select districts" />
                </SelectTrigger>
                <SelectContent>
                  {districtOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Cluster</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select clusters" />
                </SelectTrigger>
                <SelectContent>
                  {clusterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Evaluation Month</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select months" />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedRegions.map((region) => (
                <Badge key={region} variant="secondary">
                  Region: {region}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedRegions(prev => prev.filter(r => r !== region))}
                  />
                </Badge>
              ))}
              {selectedDistricts.map((district) => (
                <Badge key={district} variant="secondary">
                  District: {district}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => setSelectedDistricts(prev => prev.filter(d => d !== district))}
                  />
                </Badge>
              ))}
              {selectedClusters.map((cluster) => (
                <Badge key={cluster} variant="secondary">
                  Cluster: {cluster}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedClusters(prev => prev.filter(c => c !== cluster))}
                  />
                </Badge>
              ))}
              {selectedMonths.map((month) => (
                <Badge key={month} variant="secondary">
                  Month: {month}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedMonths(prev => prev.filter(m => m !== month))}
                  />
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-1">
        {/* Line Chart - Income Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Average Income + Production Trends by Cluster</CardTitle>
            <CardDescription>
              Solid lines show actual data, dotted lines show predictions. Orange dashed line shows overall trend across all selected clusters.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MockLineChart data={data} />
          </CardContent>
        </Card>
        
        {/* Scatter Plot */}
        <Card>
          <CardHeader>
            <CardTitle>Income + Production vs Achievement Rate</CardTitle>
            <CardDescription>
              Bubble size represents number of households. Color represents evaluation month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MockScatterPlot data={data} />
          </CardContent>
        </Card>
      </div>
      
      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Summary Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label className="text-sm text-gray-500">Total Clusters</Label>
              <div className="text-2xl font-bold text-orange-600">
                {summaryStats.totalClusters}
              </div>
            </div>
            <div>
              <Label className="text-sm text-gray-500">Evaluation Months</Label>
              <div className="text-2xl font-bold text-orange-600">
                {summaryStats.evaluationMonths}
              </div>
            </div>
            <div>
              <Label className="text-sm text-gray-500">Avg Income + Production (Overall)</Label>
              <div className="text-2xl font-bold text-orange-600">
                ${summaryStats.avgIncome.toFixed(0)}
              </div>
            </div>
            <div>
              <Label className="text-sm text-gray-500">Total Households</Label>
              <div className="text-2xl font-bold text-orange-600">
                {summaryStats.totalHouseholds.toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}