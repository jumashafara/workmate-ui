import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CheckinsPage: React.FC = () => {
  const checkinData: any[] = []; // Replace this with your actual data fetching logic

  return (
    <div className="p-6">
      {checkinData.length === 0 ? (
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl">No Data Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              There are no check-in records available at this time.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div>
          {/* Your existing check-in data rendering logic */}
        </div>
      )}
    </div>
  );
};

export default CheckinsPage;