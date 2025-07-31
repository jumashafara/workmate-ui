import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

interface VariableDescription {
  name: string;
  description: string;
  type: string;
}

interface VariableDescriptionsProps {
  variables?: VariableDescription[];
}

// Default variables if none are provided
const defaultVariables = [
  {
    name: "Land_size_for_Crop_Agriculture_Acres",
    description: "Total landsize owned/rented for agriculture",
    type: "Numerical",
  },
  {
    name: "hh_water_collection_Minutes",
    description: "Total time taken to collect water in minutes",
    type: "Numerical",
  },
  {
    name: "Distance_travelled_one_way_OPD_treatment",
    description:
      "Distance travelled one way for Outpatient department treatment",
    type: "Numerical",
  },
  {
    name: "tot_hhmembers",
    description: "Total household members",
    type: "Numerical",
  },
  {
    name: "farm_implements_owned",
    description:
      "Total number of small farm implements like hoes, slashers owned by a household",
    type: "Numerical",
  },
  {
    name: "perennial_crops_grown_food_banana",
    description: "If a household grows bananas",
    type: "Categorical",
  },
  {
    name: "business_participation",
    description: "If a member of a household owns a business",
    type: "Categorical",
  },
  {
    name: "sweet_potatoes",
    description: "If a household grows sweet potatoes",
    type: "Categorical",
  },
  {
    name: "Average_Water_Consumed_Per_Day",
    description: "Average amount of water in jerrycans consumed by a household",
    type: "Numerical",
  },
  {
    name: "education_level_encoded",
    description: "Current level of education of the household head",
    type: "Categorical",
  },
  {
    name: "ground_nuts",
    description: "If a household grows Ground Nuts",
    type: "Categorical",
  },
  {
    name: "composts_num",
    description: "Number of compost pits owned by a household",
    type: "Numerical",
  },
  {
    name: "perennial_crops_grown_coffee",
    description: "If a household is growing coffee",
    type: "Categorical",
  },
  {
    name: "irish_potatoes",
    description: "If a household is growing irish potatoes",
    type: "Categorical",
  },
  {
    name: "sorghum",
    description: "If a household is growing sorghum",
    type: "Categorical",
  },
  {
    name: "vsla_participation",
    description:
      "If a household or household member is participating in some VSLA",
    type: "Categorical",
  },
  {
    name: "cassava",
    description: "If a household is growing cassava",
    type: "Categorical",
  },
  {
    name: "maize",
    description: "If a household is growing maize",
    type: "Categorical",
  },
  {
    name: "hh_produce_organics",
    description: "If a household produces organic materials",
    type: "Categorical",
  },
  {
    name: "hh_produce_lq_manure",
    description: "If a household produced own liquid manure",
    type: "Categorical",
  },
  {
    name: "hhh_sex",
    description: "The sex of the household head",
    type: "Categorical",
  },
  {
    name: "soap_ash_present",
    description: "If the household has soap ash present",
    type: "Categorical",
  },
  {
    name: "non_bio_waste_mgt_present",
    description: "If household has a way of properly managing waste",
    type: "Categorical",
  },
  {
    name: "tippy_tap_present",
    description: "If the household has a tippy tap",
    type: "Categorical",
  },
];

const VariableDescriptions: React.FC<VariableDescriptionsProps> = ({
  variables = defaultVariables,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof VariableDescription>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const rowsPerPage = 8; // Number of rows per page

  // Handle sorting
  const handleSort = (field: keyof VariableDescription) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const SortButton = ({
    field,
    children,
  }: {
    field: keyof VariableDescription;
    children: React.ReactNode;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto p-0 font-medium justify-start"
      onClick={() => handleSort(field)}
    >
      {children}
      {sortField === field &&
        (sortDirection === "asc" ? (
          <ChevronUp className="ml-1 h-4 w-4" />
        ) : (
          <ChevronDown className="ml-1 h-4 w-4" />
        ))}
    </Button>
  );

  // Ensure we have variables to display, using default if empty
  const dataToDisplay =
    variables && variables.length > 0 ? variables : defaultVariables;

  // Sort data
  const sortedData = [...dataToDisplay].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    // Handle string comparison
    const aString = String(aValue || "");
    const bString = String(bValue || "");
    return sortDirection === "asc"
      ? aString.localeCompare(bString)
      : bString.localeCompare(aString);
  });

  // Get current rows for pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  console.log("Variables provided:", variables ? variables.length : 0); // Check the incoming variables
  console.log("Data to display:", dataToDisplay.length); // Check what's being used
  console.log("Sorted Data:", sortedData.length); // Check the sorted data
  console.log("Current Rows:", currentRows.length); // Check the current rows for pagination
  console.log("Total Pages:", totalPages); // Check pagination calculation

  return (
    <div className="space-y-4">
      <div className="rounded-md border max-h-96 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortButton field="name">Variable Name</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="description">Description</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="type">Type</SortButton>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRows.length > 0 ? (
              currentRows.map((variable, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{variable.name}</TableCell>
                  <TableCell>{variable.description}</TableCell>
                  <TableCell>{variable.type}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {sortedData.length > rowsPerPage && (
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VariableDescriptions;
