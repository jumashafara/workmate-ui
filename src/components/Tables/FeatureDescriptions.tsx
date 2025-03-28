import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Box,
  Typography,
  TableSortLabel,
  Pagination,
  Card,
  CardHeader
} from "@mui/material";

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
    description: "Distance travelled one way for Outpatient department treatment",
    type: "Numerical",
  },
  {
    name: "tot_hhmembers",
    description: "Total household members",
    type: "Numerical",
  },
  {
    name: "farm_implements_owned",
    description: "Total number of small farm implements like hoes, slashers owned by a household",
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
    description: "If a household or household member is participating in some VSLA",
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
  }
];

const VariableDescriptions: React.FC<VariableDescriptionsProps> = ({ variables = defaultVariables }) => {
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

  // Ensure we have variables to display, using default if empty
  const dataToDisplay = variables && variables.length > 0 ? variables : defaultVariables;

  // Sort data
  const sortedData = [...dataToDisplay].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    // Handle string comparison
    const aString = String(aValue || '');
    const bString = String(bValue || '');
    return sortDirection === 'asc' 
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
    <Box>
      <Card sx={{ width: '100%', boxShadow: 2, mb: 2 }}>
        <CardHeader 
          title="Variable Descriptions" 
          subheader="What do the feature names mean?"
          sx={{ 
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
            padding: 2
          }}
        />
        <TableContainer component={Paper} sx={{ maxHeight: 440, boxShadow: 0 }}>
          <Table stickyHeader aria-label="feature descriptions table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'name'}
                    direction={sortField === 'name' ? sortDirection : 'asc'}
                    onClick={() => handleSort('name')}
                  >
                    Variable Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'description'}
                    direction={sortField === 'description' ? sortDirection : 'asc'}
                    onClick={() => handleSort('description')}
                  >
                    Description
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'type'}
                    direction={sortField === 'type' ? sortDirection : 'asc'}
                    onClick={() => handleSort('type')}
                  >
                    Type
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentRows.length > 0 ? (
                currentRows.map((variable, index) => (
                  <TableRow
                    key={index}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">{variable.name}</TableCell>
                    <TableCell>{variable.description}</TableCell>
                    <TableCell>{variable.type}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">No data available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {sortedData.length > rowsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, page) => setCurrentPage(page)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
};

export default VariableDescriptions;
