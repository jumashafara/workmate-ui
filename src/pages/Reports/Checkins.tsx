import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const Checkins: React.FC = () => {
  const checkinData = []; // Replace this with your actual data fetching logic

  return (
    <Box sx={{ p: 2 }}>
      {checkinData.length === 0 ? (
        <Card sx={{ textAlign: 'center', p: 2 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              No Data Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              There are no check-in records available at this time.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        // Render your check-in data here
        <div>
          {/* Your existing check-in data rendering logic */}
        </div>
      )}
    </Box>
  );
};

export default Checkins;
