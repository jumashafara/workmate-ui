import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
} from "lucide-react";
import { PredictionData } from "@/types/predictions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrency } from "@/contexts/CurrencyContext";

interface ClusterParticipationTableProps {
  data: PredictionData[];
}

interface ClusterParticipation {
  cluster: string;
  householdCount: number;
  averageParticipation: {
    vsla_participation: number;
    business_participation: number;
    hh_produce_lq_manure: number;
    hh_produce_organics: number;
    non_bio_waste_mgt_present: number;
    soap_ash_present: number;
    tippy_tap_present: number;
    ground_nuts: number;
    composts_num: number;
    perennial_crops_grown_food_banana: number;
    sweet_potatoes: number;
    perennial_crops_grown_coffee: number;
    irish_potatoes: number;
    cassava: number;
    maize: number;
    sorghum: number;
  };
}

const ClusterParticipationTable: React.FC<ClusterParticipationTableProps> = ({
  data,
}) => {
  const { formatCurrency } = useCurrency();
  const [currentColumnSet, setCurrentColumnSet] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("cluster");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);
  const rowsPerPage = 10;

  const clusterParticipation = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Group data by cluster
    const clusterGroups = data.reduce((acc, item) => {
      const cluster = item.cluster || "Unknown";
      if (!acc[cluster]) {
        acc[cluster] = [];
      }
      acc[cluster].push(item);
      return acc;
    }, {} as Record<string, PredictionData[]>);

    // Calculate averages for each cluster
    let result = Object.entries(clusterGroups).map(([cluster, households]) => {
      const participationFeatures = [
        "vsla_participation",
        "business_participation",
        "predicted_income",
        "prediction",
        "hh_produce_lq_manure",
        "hh_produce_organics",
        "non_bio_waste_mgt_present",
        "soap_ash_present",
        "tippy_tap_present",
        "Average_Water_Consumed_Per_Day",
        "hh_water_collection_Minutes",
        "ground_nuts",
        "composts_num",
        "perennial_crops_grown_food_banana",
        "sweet_potatoes",
        "perennial_crops_grown_coffee",
        "irish_potatoes",
        "cassava",
        "maize",
        "sorghum",
        "Land_size_for_Crop_Agriculture_Acres",
      ];

      const averages = participationFeatures.reduce((acc, feature) => {
        const sum = households.reduce((total, household) => {
          const value = (household as any)[feature];
          return total + (typeof value === "number" ? value : 0);
        }, 0);
        acc[feature] = households.length > 0 ? sum / households.length : 0;
        return acc;
      }, {} as Record<string, number>);

      return {
        cluster,
        householdCount: households.length,
        averageParticipation: averages,
      };
    });

    // Filter by search term
    if (searchTerm) {
      result = result.filter((item) =>
        item.cluster.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort the data
    result.sort((a, b) => {
      let aValue: any, bValue: any;

      if (sortField === "cluster") {
        aValue = a.cluster;
        bValue = b.cluster;
      } else {
        aValue =
          a.averageParticipation[
            sortField as keyof typeof a.averageParticipation
          ];
        bValue =
          b.averageParticipation[
            sortField as keyof typeof b.averageParticipation
          ];
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return result;
  }, [data, searchTerm, sortField, sortDirection]);

  // Define column sets (3 logical categories)
  const columnSets = [
    {
      name: "Income & Business",
      columns: [
        {
          key: "vsla_participation",
          label: "VSLA Participation",
          format: "percentage",
        },
        {
          key: "business_participation",
          label: "Business Participation",
          format: "percentage",
        },
        {
          key: "predicted_income",
          label: "Predicted Income + Production",
          format: "currency",
        },
        {
          key: "prediction",
          label: "Target Achievement",
          format: "percentage",
        },
      ],
    },
    {
      name: "Agriculture",
      columns: [
        { key: "ground_nuts", label: "Ground Nuts", format: "percentage" },
        // { key: 'composts_num', label: 'Composts', format: 'percentage' },
        {
          key: "perennial_crops_grown_food_banana",
          label: "Banana",
          format: "percentage",
        },
        { key: "sweet_potatoes", label: "Sweet Potatoes", format: "percentage" },
        // {
        //   key: "perennial_crops_grown_coffee",
        //   label: "Coffee",
        //   format: "percentage",
        // },
        { key: "irish_potatoes", label: "Irish Potatoes", format: "percentage" },
        { key: "cassava", label: "Cassava", format: "percentage" },
        { key: "maize", label: "Maize", format: "percentage" },
        // { key: 'sorghum', label: 'Sorghum', format: 'percentage' },
        {
          key: "Land_size_for_Crop_Agriculture_Acres",
          label: "Land Size (Acres)",
          format: "average",
        },
      ],
    },
    // {
    //     name: "WASH",
    //     columns: [
    //       { key: 'hh_produce_lq_manure', label: 'Manure Production', format: 'percentage' },
    //       { key: 'hh_produce_organics', label: 'Organic Production', format: 'percentage' },
    //       { key: 'non_bio_waste_mgt_present', label: 'Waste Management', format: 'percentage' },
    //       { key: 'soap_ash_present', label: 'Soap/Ash Present', format: 'percentage' },
    //       { key: 'tippy_tap_present', label: 'Tippy Tap', format: 'percentage' },
    //       { key: 'Average_Water_Consumed_Per_Day', label: 'Water Consumption (L/day)', format: 'average' },
    //       { key: 'hh_water_collection_Minutes', label: 'Water Collection (min)', format: 'average' }
    //     ]
    //   },
  ];

  const currentColumns = columnSets[currentColumnSet]?.columns || [];

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatAverage = (value: number) => {
    return value.toFixed(2);
  };



  const nextColumnSet = () => {
    setCurrentColumnSet((prev) => (prev + 1) % columnSets.length);
  };

  const prevColumnSet = () => {
    setCurrentColumnSet(
      (prev) => (prev - 1 + columnSets.length) % columnSets.length
    );
  };

  const nextPage = () => {
    setCurrentPage((prev) =>
      Math.min(
        prev + 1,
        Math.ceil(clusterParticipation.length / rowsPerPage) - 1
      )
    );
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    setCurrentPage(0); // Reset to first page when sorting
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSortField("cluster");
    setSortDirection("desc");
    setCurrentPage(0);
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const downloadTableData = () => {
    if (clusterParticipation.length === 0) return;

    // Get current column set info
    const currentSet = columnSets[currentColumnSet];
    const columnHeaders = [
      "Cluster",
      ...currentSet.columns.map((col) => col.label),
    ];

    // Prepare CSV data
    const csvData = clusterParticipation.map((cluster) => {
      const row = [
        cluster.cluster,
        ...currentSet.columns.map((col) => {
          const value =
            cluster.averageParticipation[
              col.key as keyof typeof cluster.averageParticipation
            ];
          if (col.format === "percentage") {
            return `${(value * 100).toFixed(1)}%`;
          } else if (col.format === "currency") {
            return formatCurrency(value);
          } else {
            return value.toFixed(2);
          }
        }),
      ];
      return row.join(",");
    });

    // Create CSV content
    const csvContent = [columnHeaders.join(","), ...csvData].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `cluster_participation_${currentSet.name
        .toLowerCase()
        .replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(clusterParticipation.length / rowsPerPage);
  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = clusterParticipation.slice(startIndex, endIndex);

  if (!data || data.length === 0) {
    return (
      <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Cluster Participation Analysis
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Average participation rates in prediction features per cluster
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">
              No data available for cluster participation analysis
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Cluster Participation Analysis
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Average participation rates in prediction features per cluster
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filter Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Search className="h-4 w-4 mr-2" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
              {(searchTerm ||
                sortField !== "cluster" ||
                sortDirection !== "desc") && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={downloadTableData}
                disabled={clusterParticipation.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              {clusterParticipation.length} clusters found
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="search">Search Clusters</Label>
                <Input
                  id="search"
                  placeholder="Enter cluster name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort-field">Sort By</Label>
                <Select value={sortField} onValueChange={handleSort}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cluster">Cluster Name</SelectItem>
                    {currentColumns.map((column) => (
                      <SelectItem key={column.key} value={column.key}>
                        {column.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort-direction">Sort Direction</Label>
                <Select
                  value={sortDirection}
                  onValueChange={(value: "asc" | "desc") =>
                    setSortDirection(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevColumnSet}
                disabled={columnSets.length <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {columnSets[currentColumnSet]?.name || "Features"}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={nextColumnSet}
                disabled={columnSets.length <= 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-xs text-gray-500">
                {currentColumnSet + 1} of {columnSets.length}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevPage}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Clusters {startIndex + 1}-
                  {Math.min(endIndex, clusterParticipation.length)} of{" "}
                  {clusterParticipation.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPage}
                  disabled={currentPage >= totalPages - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-max">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold sticky left-0 bg-white dark:bg-gray-900 z-10">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("cluster")}
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                      >
                        Cluster {getSortIcon("cluster")}
                      </Button>
                    </TableHead>

                    {currentColumns.map((column) => (
                      <TableHead
                        key={column.key}
                        className="text-center font-semibold"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort(column.key)}
                          className="h-auto p-0 font-semibold hover:bg-transparent"
                        >
                          {column.label} {getSortIcon(column.key)}
                        </Button>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentRows.map((cluster) => (
                    <TableRow key={cluster.cluster}>
                      <TableCell className="font-medium sticky left-0 bg-white dark:bg-gray-900 z-10">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {cluster.cluster}
                          </Badge>
                        </div>
                      </TableCell>

                      {currentColumns.map((column) => (
                        <TableCell key={column.key} className="text-center">
                          <span className="text-sm font-medium">
                            {column.format === "percentage"
                              ? formatPercentage(
                                  cluster.averageParticipation[
                                    column.key as keyof typeof cluster.averageParticipation
                                  ]
                                )
                              : column.format === "currency"
                              ? formatCurrency(
                                  cluster.averageParticipation[
                                    column.key as keyof typeof cluster.averageParticipation
                                  ]
                                )
                              : formatAverage(
                                  cluster.averageParticipation[
                                    column.key as keyof typeof cluster.averageParticipation
                                  ]
                                )}
                          </span>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClusterParticipationTable;
