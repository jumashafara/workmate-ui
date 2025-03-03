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
    name: "Agriculture Land (Acres)",
    description: "Size of land used for agriculture",
    type: "Numerical",
  },
  {
    name: "Food Banana",
    description: "If the household planted food banana",
    type: "Categorical",
  },
  {
    name: "Farm Implements Owned",
    description: "Number of farm implements like hoes owned by the household",
    type: "Numerical",
  },
  {
    name: "Total Household Members",
    description: "The number of members in a household",
    type: "Numerical",
  },
  {
    name: "Sweet Potatoes",
    description: "If the household planted sweet potatoes",
    type: "Categorical",
  },
  {
    name: "Ground Nuts",
    description: "If the household planted Ground Nuts",
    type: "Categorical",
  },
  {
    name: "Coffee",
    description: "If the household planted Coffee",
    type: "Categorical",
  },
  {
    name: "Business Participation",
    description: "If any household member participates in a business",
    type: "Categorical",
  },
  {
    name: "Household Income",
    description: "Total household income from all sources",
    type: "Numerical",
  },
  {
    name: "Education Level",
    description: "Highest education level in the household",
    type: "Categorical",
  },
  {
    name: "Livestock Owned",
    description: "Number of livestock owned by the household",
    type: "Numerical",
  },
  {
    name: "Access to Water",
    description: "Distance to nearest water source in kilometers",
    type: "Numerical",
  },
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

  // Get current rows for pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  
  // Sort data
  const sortedData = [...(variables.length > 0 ? variables : defaultVariables)].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    // Handle string comparison
    const aString = String(aValue || '');
    const bString = String(bValue || '');
    return sortDirection === 'asc' 
      ? aString.localeCompare(bString) 
      : bString.localeCompare(aString);
  });
  
  const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(variables.length / rowsPerPage);

  console.log("Variables:", variables); // Check the incoming variables
  console.log("Sorted Data:", sortedData); // Check the sorted data
  console.log("Current Rows:", currentRows); // Check the current rows for pagination

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

      {variables.length > rowsPerPage && (
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
