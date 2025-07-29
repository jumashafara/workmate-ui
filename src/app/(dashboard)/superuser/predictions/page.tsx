"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Download,
  Filter,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from "lucide-react"

interface PredictionData {
  id: number
  household_id: string
  cohort: string
  cycle: string
  region: string
  district: string
  cluster: string
  village: string
  latitude: number
  longitude: number
  altitude: number
  evaluation_month: number
  prediction: number
  probability: number
  predicted_income: number
}

interface FilterOption {
  value: string
  label: string
}

export default function SuperuserPredictionsPage() {
  const [loading, setLoading] = useState(true)
  const [predictions, setPredictions] = useState<PredictionData[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCohorts, setSelectedCohorts] = useState<string[]>([])
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  
  // Filter options
  const [cohortOptions, setCohortOptions] = useState<FilterOption[]>([])
  const [regionOptions, setRegionOptions] = useState<FilterOption[]>([])
  const [districtOptions, setDistrictOptions] = useState<FilterOption[]>([])

  // Mock data loading simulation
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock data
      const mockPredictions: PredictionData[] = Array.from({ length: pageSize }, (_, i) => ({
        id: i + 1 + (currentPage - 1) * pageSize,
        household_id: `HH${String(i + 1).padStart(4, '0')}`,
        cohort: ['Cohort A', 'Cohort B', 'Cohort C'][i % 3],
        cycle: ['Cycle 1', 'Cycle 2', 'Cycle 3'][i % 3],
        region: ['Central', 'Northern', 'Western', 'Eastern'][i % 4],
        district: ['District A', 'District B', 'District C', 'District D'][i % 4],
        cluster: `Cluster ${String.fromCharCode(65 + (i % 10))}`,
        village: `Village ${i + 1}`,
        latitude: -1.2921 + (Math.random() - 0.5) * 0.1,
        longitude: 36.8219 + (Math.random() - 0.5) * 0.1,
        altitude: 1500 + Math.random() * 500,
        evaluation_month: [6, 9, 12, 15][i % 4],
        prediction: Math.random() > 0.6 ? 1 : 0,
        probability: Math.random(),
        predicted_income: Math.random() * 5000 + 1000,
      }))

      setPredictions(mockPredictions)
      setTotalCount(2847) // Mock total count
      
      // Mock filter options
      setCohortOptions([
        { value: 'Cohort A', label: 'Cohort A' },
        { value: 'Cohort B', label: 'Cohort B' },
        { value: 'Cohort C', label: 'Cohort C' },
      ])
      
      setRegionOptions([
        { value: 'Central', label: 'Central' },
        { value: 'Northern', label: 'Northern' },
        { value: 'Western', label: 'Western' },
        { value: 'Eastern', label: 'Eastern' },
      ])
      
      setDistrictOptions([
        { value: 'District A', label: 'District A' },
        { value: 'District B', label: 'District B' },
        { value: 'District C', label: 'District C' },
        { value: 'District D', label: 'District D' },
      ])
      
      setLoading(false)
    }

    loadData()
  }, [currentPage, pageSize])

  const totalPages = Math.ceil(totalCount / pageSize)

  const clearFilters = () => {
    setSelectedCohorts([])
    setSelectedRegions([])
    setSelectedDistricts([])
    setSearchTerm("")
  }

  const activeFiltersCount = selectedCohorts.length + selectedRegions.length + selectedDistricts.length + (searchTerm ? 1 : 0)

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
            <div className="flex gap-4">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-20" />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <TableHead key={i}>
                      <Skeleton className="h-4 w-20" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Predictions Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage and analyze prediction data with advanced filtering and export capabilities.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Achievement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((predictions.filter(p => p.prediction === 1).length / predictions.length) * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(predictions.reduce((sum, p) => sum + p.predicted_income, 0) / predictions.length).toFixed(0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Page</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentPage} of {totalPages}</div>
          </CardContent>
        </Card>
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
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
              {activeFiltersCount > 0 && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search households..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div>
                <Label>Cohort</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cohorts" />
                  </SelectTrigger>
                  <SelectContent>
                    {cohortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
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
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedCohorts.map((cohort) => (
                  <Badge key={cohort} variant="secondary">
                    Cohort: {cohort}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() => setSelectedCohorts(prev => prev.filter(c => c !== cohort))}
                    />
                  </Badge>
                ))}
                {selectedRegions.map((region) => (
                  <Badge key={region} variant="secondary">
                    Region: {region}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() => setSelectedRegions(prev => prev.filter(r => r !== region))}
                    />
                  </Badge>
                ))}
                {searchTerm && (
                  <Badge variant="secondary">
                    Search: {searchTerm}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() => setSearchTerm("")}
                    />
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Prediction Data</CardTitle>
              <CardDescription>
                Showing {predictions.length} of {totalCount} records
              </CardDescription>
            </div>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Household ID</TableHead>
                <TableHead>Cohort</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Cluster</TableHead>
                <TableHead>Prediction</TableHead>
                <TableHead>Probability</TableHead>
                <TableHead>Income</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {predictions.map((prediction) => (
                <TableRow key={prediction.id}>
                  <TableCell className="font-medium">{prediction.household_id}</TableCell>
                  <TableCell>{prediction.cohort}</TableCell>
                  <TableCell>{prediction.region}</TableCell>
                  <TableCell>{prediction.district}</TableCell>
                  <TableCell>{prediction.cluster}</TableCell>
                  <TableCell>
                    <Badge variant={prediction.prediction === 1 ? "default" : "secondary"}>
                      {prediction.prediction === 1 ? "Achieved" : "Not Achieved"}
                    </Badge>
                  </TableCell>
                  <TableCell>{(prediction.probability * 100).toFixed(1)}%</TableCell>
                  <TableCell>${prediction.predicted_income.toFixed(0)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label>Rows per page:</Label>
          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i
              if (pageNum > totalPages) return null
              
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-10"
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}