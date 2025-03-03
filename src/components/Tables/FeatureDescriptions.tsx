import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Card, 
  CardHeader, 
  CardContent, 
  Typography 
} from "@mui/material";

interface VariableDescription {
  name: string;
  description: string;
  type: string;
}

interface VariableDescriptionsProps {
  variables: VariableDescription[];
}

const variables = [
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
];

const VariableDescriptions: React.FC<VariableDescriptionsProps> = () => {
  return (
    <Card sx={{ width: '100%', boxShadow: 2 }}>
      <CardHeader 
        title="Variable Descriptions" 
        subheader="What do the feature names mean?"
        sx={{ 
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
          padding: 3
        }}
      />
      <CardContent sx={{ padding: 0 }}>
        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 650 }} aria-label="feature descriptions table">
            <TableHead>
              <TableRow sx={{ backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50' }}>
                <TableCell>Variable Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {variables.map((variable, index) => (
                <TableRow
                  key={index}
                  hover
                  sx={{ 
                    '&:nth-of-type(odd)': {
                      backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                    },
                    '&:last-child td, &:last-child th': { border: 0 }
                  }}
                >
                  <TableCell component="th" scope="row">{variable.name}</TableCell>
                  <TableCell>{variable.description}</TableCell>
                  <TableCell>{variable.type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default VariableDescriptions;
