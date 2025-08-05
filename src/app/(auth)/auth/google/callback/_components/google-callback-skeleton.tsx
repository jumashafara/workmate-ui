import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton loader component
export const GoogleCallbackSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <Card className="w-full max-w-md">
      <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center p-8">
        <Skeleton className="h-12 w-12 rounded-full mb-6" />
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-80" />
      </CardContent>
    </Card>
  </div>
);
