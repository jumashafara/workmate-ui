"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Maximize2, Minimize2, MapPin } from "lucide-react";

// Define household interface
interface Household {
  household_id: string;
  village: string;
  latitude: number;
  longitude: number;
  prediction: number;
  predicted_income: number;
  region?: string;
  district?: string;
  cluster?: string;
  altitude?: number;
  cohort?: string;
  cycle?: string;
  evaluation_month?: number;
  tot_hhmembers?: number;
  hhh_sex?: number;
  education_level_encoded?: number;
  Land_size_for_Crop_Agriculture_Acres?: number;
  farm_implements_owned?: number;
  business_participation?: number;
  vsla_participation?: number;
  maize?: number;
  ground_nuts?: number;
  sweet_potatoes?: number;
  cassava?: number;
  sorghum?: number;
  irish_potatoes?: number;
  perennial_crops_grown_food_banana?: number;
  perennial_crops_grown_coffee?: number;
  [key: string]: any;
}

interface HouseholdMapProps {
  households: Household[];
}

// Dynamic map component to avoid SSR issues
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
    </div>
  ),
});

const HouseholdMap: React.FC<HouseholdMapProps> = ({ households }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Force re-render when households change
  useEffect(() => {
    setMapKey((prev) => prev + 1);
  }, [households]);

  // Handle fullscreen toggle
  const toggleFullScreen = async () => {
    if (!mapContainerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await mapContainerRef.current.requestFullscreen();
        setIsFullScreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullScreen(false);
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  // Validate households data
  if (!households || households.length === 0) {
    return (
      <Card className="h-[500px]">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Data Available
            </h3>
            <p className="text-gray-500">
              No household data to display on the map.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter valid coordinates
  const validHouseholds = households.filter(
    (h) =>
      typeof h.latitude === "number" &&
      typeof h.longitude === "number" &&
      !isNaN(h.latitude) &&
      !isNaN(h.longitude) &&
      h.latitude >= -90 &&
      h.latitude <= 90 &&
      h.longitude >= -180 &&
      h.longitude <= 180
  );

  if (validHouseholds.length === 0) {
    return (
      <Card className="h-[500px]">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Invalid Coordinates
            </h3>
            <p className="text-gray-500">
              No valid geographic coordinates found in the data.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate statistics
  const achievedCount = validHouseholds.filter(
    (h) => h.prediction === 1
  ).length;
  const notAchievedCount = validHouseholds.length - achievedCount;
  const avgIncome =
    validHouseholds.reduce((sum, h) => sum + (h.predicted_income || 0), 0) /
    validHouseholds.length;

  return (
    <Card
      ref={mapContainerRef}
      className={`transition-all duration-300 ${
        isFullScreen ? "fixed inset-0 z-[9999] rounded-none" : "relative"
      }`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Household Distribution Map
            </CardTitle>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  Achieved ({achievedCount})
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  Not Achieved ({notAchievedCount})
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                Avg Income: ${avgIncome.toFixed(0)}
              </Badge>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullScreen}
            className="flex items-center gap-2"
          >
            {isFullScreen ? (
              <>
                <Minimize2 className="h-4 w-4" />
                Exit Fullscreen
              </>
            ) : (
              <>
                <Maximize2 className="h-4 w-4" />
                Fullscreen
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className={isFullScreen ? "p-0" : "p-6 pt-0"}>
        <div className={isFullScreen ? "h-screen" : "h-[500px]"}>
          <MapComponent
            key={mapKey}
            households={validHouseholds}
            isFullScreen={isFullScreen}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default HouseholdMap;
